import { D4Op } from '../core/group';
import { LineTarget, generateLines } from '../core/board';

export interface GestureCallback {
  (target: LineTarget, op: D4Op): void;
}

export class GestureRecognizer {
  private boardEl: HTMLElement;
  private trailCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private onAction: GestureCallback;
  private points: Array<{ x: number; y: number }> = [];
  private isPointerDown = false;
  private startCell: { r: number; c: number; target: LineTarget } | null = null;
  private isLocked = false;
  private boardSize = 3;

  // 1-1 성분의 현재 모드 ('row': 1행 변환 모드, 'col': 1열 변환 모드)
  private cell11Mode: 'row' | 'col' = 'row';

  // 탭 / 더블탭 / 롱프레스 타이머
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;
  private singleTapTimer: ReturnType<typeof setTimeout> | null = null;
  private lastTapInfo: { r: number; c: number; time: number } | null = null;
  private isLongPressTriggered = false;

  constructor(boardEl: HTMLElement, trailCanvas: HTMLCanvasElement, onAction: GestureCallback, boardSize = 3) {
    this.boardEl = boardEl;
    this.trailCanvas = trailCanvas;
    this.ctx = trailCanvas.getContext('2d');
    this.onAction = onAction;
    this.boardSize = boardSize;

    this.bindEvents();
    this.syncCanvasSize();
    window.addEventListener('resize', () => this.syncCanvasSize());
  }

  public setBoardSize(size: number) {
    this.boardSize = size;
  }

  public setLocked(locked: boolean) {
    this.isLocked = locked;
  }

  public getCell11Mode(): 'row' | 'col' {
    return this.cell11Mode;
  }

  public toggleCell11Mode(): 'row' | 'col' {
    this.cell11Mode = this.cell11Mode === 'row' ? 'col' : 'row';
    return this.cell11Mode;
  }

  private syncCanvasSize() {
    const rect = this.boardEl.getBoundingClientRect();
    this.trailCanvas.width = rect.width;
    this.trailCanvas.height = rect.height;
  }

  public getLineForCell(r: number, c: number): LineTarget | null {
    const sz = this.boardSize;
    const lines = generateLines(sz);

    // 1-1 성분 (r=0, c=0): 보라색 점 토글 상태에 따라 1행 또는 1열
    if (r === 0 && c === 0) {
      if (this.cell11Mode === 'col') {
        return lines.find(l => l.type === 'col' && l.idx === 0) || null;
      }
      return lines.find(l => l.type === 'row' && l.idx === 0) || null;
    }

    // 21, 31 등 1열 성분 (c=0, r>0) ➔ 2행, 3행 ... 변환
    if (c === 0 && r > 0) {
      return lines.find(l => l.type === 'row' && l.idx === r) || null;
    }

    // 12, 13 등 1행 성분 (r=0, c>0) ➔ 2열, 3열 ... 변환
    if (r === 0 && c > 0) {
      return lines.find(l => l.type === 'col' && l.idx === c) || null;
    }

    // 대각선: 우측 하단 모서리는 주대각선, (1, sz-1)은 부대각선
    if (r === sz - 1 && c === sz - 1) {
      return lines.find(l => l.type === 'diag' && l.idx === 'main') || null;
    }
    if (r === 1 && c === sz - 1) {
      return lines.find(l => l.type === 'diag' && l.idx === 'anti') || null;
    }

    // 보드 중앙 성분(예: 3x3의 2행2열) 터치 시 2행 변환으로 매핑하여 무반응 방지
    if (r === Math.floor(sz / 2) && c === Math.floor(sz / 2)) {
      return lines.find(l => l.type === 'row' && l.idx === r) || null;
    }

    // 그 외 비제어 내부 성분
    return null;
  }

  private bindEvents() {
    this.boardEl.addEventListener('pointerdown', (e) => {
      if (this.isLocked) return;

      // 보라색 점 클릭 감지 시 제스처 무시
      const targetElem = e.target as HTMLElement;
      if (targetElem && targetElem.classList.contains('dot-toggle-11')) {
        return;
      }

      const cellBox = (e.target as HTMLElement).closest('.cell-box') as HTMLElement;
      let r = -1;
      let c = -1;

      if (cellBox && cellBox.parentElement === this.boardEl) {
        const idx = Array.from(this.boardEl.children).indexOf(cellBox);
        if (idx !== -1) {
          r = Math.floor(idx / this.boardSize);
          c = idx % this.boardSize;
        }
      }

      if (r === -1 || c === -1) {
        const rect = this.boardEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cellW = rect.width / this.boardSize;
        const cellH = rect.height / this.boardSize;
        c = Math.max(0, Math.min(this.boardSize - 1, Math.floor(x / cellW)));
        r = Math.max(0, Math.min(this.boardSize - 1, Math.floor(y / cellH)));
      }

      const target = this.getLineForCell(r, c);
      if (!target) return;

      try {
        this.boardEl.setPointerCapture(e.pointerId);
      } catch {
        // 일부 브라우저 예외 무시
      }

      this.isPointerDown = true;
      this.isLongPressTriggered = false;
      this.startCell = { r, c, target };
      const startX = e.clientX;
      const startY = e.clientY;
      this.points = [{ x: startX, y: startY }];

      // 🌟 롱프레스 감지: 380ms 이상 누르고 있으면 270도(R270) 회전
      if (this.longPressTimer) clearTimeout(this.longPressTimer);
      this.longPressTimer = setTimeout(() => {
        if (this.isPointerDown && !this.isLongPressTriggered) {
          this.isLongPressTriggered = true;
          this.clearTrail();
          if (this.startCell) {
            this.onAction(this.startCell.target, 'R270');
          }
        }
      }, 380);
    });

    this.boardEl.addEventListener('pointermove', (e) => {
      if (!this.isPointerDown) return;
      this.points.push({ x: e.clientX, y: e.clientY });

      // 35px 이상 이동 시 롱프레스 취소
      if (this.points.length > 1) {
        const start = this.points[0];
        if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 35) {
          if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
          }
        }
      }

      this.drawTrail();
    });

    const handleEnd = (e: PointerEvent) => {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }

      if (!this.isPointerDown || !this.startCell) {
        this.isPointerDown = false;
        this.clearTrail();
        return;
      }

      this.isPointerDown = false;

      // 롱프레스가 이미 270도 회전을 실행했으면 종료
      if (this.isLongPressTriggered) {
        this.isLongPressTriggered = false;
        this.clearTrail();
        return;
      }

      const start = this.points[0];
      const endX = e.clientX || start.x;
      const endY = e.clientY || start.y;
      const dx = endX - start.x;
      const dy = endY - start.y;
      const dist = Math.hypot(dx, dy);

      const target = this.startCell.target;
      const r = this.startCell.r;
      const c = this.startCell.c;
      this.clearTrail();

      // ========================================================
      // 1. 🌟 클릭/탭 판정 (이동거리 < 35px):
      //    - 1번 클릭: 90도 (R90)
      //    - 2번 연속 클릭: 180도 (R180)
      // ========================================================
      if (dist < 35) {
        const now = performance.now();
        const isSameCell = this.lastTapInfo && this.lastTapInfo.r === r && this.lastTapInfo.c === c;

        // 더블 탭 (380ms 이내 재클릭) ➔ 180도(R180)
        if (this.singleTapTimer && isSameCell && (now - this.lastTapInfo!.time <= 380)) {
          clearTimeout(this.singleTapTimer);
          this.singleTapTimer = null;
          this.lastTapInfo = null;
          this.onAction(target, 'R180');
          return;
        }

        // 싱글 탭 대기 ➔ 190ms 후 단일 클릭 확정 시 90도(R90)
        if (this.singleTapTimer) {
          clearTimeout(this.singleTapTimer);
        }
        this.lastTapInfo = { r, c, time: now };
        const capturedTarget = target;
        this.singleTapTimer = setTimeout(() => {
          this.onAction(capturedTarget, 'R90');
          this.singleTapTimer = null;
          this.lastTapInfo = null;
        }, 190);

        return;
      }

      // ========================================================
      // 2. 🌟 스와이프 제스처 판정 (이동거리 >= 35px)
      // ========================================================
      if (this.singleTapTimer) {
        clearTimeout(this.singleTapTimer);
        this.singleTapTimer = null;
        this.lastTapInfo = null;
      }

      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

      // 가로 스와이프: 상하 반전 (MX)
      if (Math.abs(angleDeg) <= 30 || Math.abs(angleDeg) >= 150) {
        this.onAction(target, 'MX');
      }
      // 세로 스와이프: 좌우 반전 (MY)
      else if (Math.abs(angleDeg) >= 60 && Math.abs(angleDeg) <= 120) {
        this.onAction(target, 'MY');
      }
      // 주대각선 스와이프 (MD)
      else if ((angleDeg > 30 && angleDeg < 60) || (angleDeg > -150 && angleDeg < -120)) {
        this.onAction(target, 'MD');
      }
      // 부대각선 스와이프 (MAD)
      else if ((angleDeg > -60 && angleDeg < -30) || (angleDeg > 120 && angleDeg < 150)) {
        this.onAction(target, 'MAD');
      }
      // 폴백
      else if (Math.abs(dx) >= Math.abs(dy)) {
        this.onAction(target, 'MX');
      } else {
        this.onAction(target, 'MY');
      }
    };

    this.boardEl.addEventListener('pointerup', handleEnd);
    this.boardEl.addEventListener('pointercancel', handleEnd);
    window.addEventListener('pointerup', handleEnd);
  }

  private drawTrail() {
    // 터치 시 불필요한 선 궤적을 그리지 않도록 완전히 비활성화
  }

  private clearTrail() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
    this.points = [];
  }
}
