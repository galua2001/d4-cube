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

    // 지정된 컨트롤러 외 다른 성분은 터치해도 변환하지 않음 (null 반환)
    return null;
  }

  private bindEvents() {
    this.boardEl.addEventListener('pointerdown', (e) => {
      if (this.isLocked) return;

      // 보라색 점 클릭 감지 여부
      const targetElem = e.target as HTMLElement;
      if (targetElem && targetElem.classList.contains('dot-toggle-11')) {
        return; // main.ts 클릭 리스너에서 전담 처리
      }

      const rect = this.boardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cellW = rect.width / this.boardSize;
      const cellH = rect.height / this.boardSize;
      const c = Math.floor(x / cellW);
      const r = Math.floor(y / cellH);

      const target = this.getLineForCell(r, c);
      if (!target) return;

      this.isPointerDown = true;
      this.isLongPressTriggered = false;
      this.startCell = { r, c, target };
      this.points = [{ x, y }];
      this.drawTrail();

      // 🌟 길게 누름(Long Press) 감지: 450ms 이상 홀드 시 270도(R270) 회전
      if (this.longPressTimer) clearTimeout(this.longPressTimer);
      this.longPressTimer = setTimeout(() => {
        if (this.isPointerDown && this.points.length < 5) {
          this.isLongPressTriggered = true;
          this.clearTrail();
          if (this.startCell) {
            this.onAction(this.startCell.target, 'R270');
          }
        }
      }, 450);
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isPointerDown) return;
      const rect = this.boardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.points.push({ x, y });

      // 일정 거리 이상 움직이면 롱프레스 취소
      if (this.points.length > 1) {
        const start = this.points[0];
        if (Math.hypot(x - start.x, y - start.y) > 15) {
          if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
          }
        }
      }

      this.drawTrail();
    });

    const handleEnd = () => {
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

      // 롱프레스가 이미 작동했으면 종료
      if (this.isLongPressTriggered) {
        this.isLongPressTriggered = false;
        this.clearTrail();
        return;
      }

      if (this.points.length === 0) {
        this.clearTrail();
        return;
      }

      const start = this.points[0];
      const end = this.points[this.points.length - 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);

      const target = this.startCell.target;
      const r = this.startCell.r;
      const c = this.startCell.c;
      this.clearTrail();

      // ========================================================
      // 1. 🌟 클릭/탭 판정 (이동거리 < 15px)
      //    - 1번 클릭: 90도 (R90)
      //    - 2번 연속 클릭: 180도 (R180)
      // ========================================================
      if (dist < 15) {
        const now = performance.now();
        const isSameCell = this.lastTapInfo && this.lastTapInfo.r === r && this.lastTapInfo.c === c;

        // 🌟 더블 탭 (300ms 이내 재클릭) ➔ 180도(R180)
        if (this.singleTapTimer && isSameCell && this.lastTapInfo && (now - this.lastTapInfo.time <= 300)) {
          clearTimeout(this.singleTapTimer);
          this.singleTapTimer = null;
          this.lastTapInfo = null;
          this.onAction(target, 'R180');
          return;
        }

        // 🌟 싱글 탭 (260ms 후 단일 클릭 확정) ➔ 90도(R90)
        if (this.singleTapTimer) {
          clearTimeout(this.singleTapTimer);
        }
        this.lastTapInfo = { r, c, time: now };
        const capturedTarget = target;
        this.singleTapTimer = setTimeout(() => {
          this.onAction(capturedTarget, 'R90');
          this.singleTapTimer = null;
          this.lastTapInfo = null;
        }, 260);

        return;
      }

      // ========================================================
      // 2. 🌟 직선 스와이프 제스처 판정 (이동거리 >= 15px)
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

    window.addEventListener('pointerup', handleEnd);
    window.addEventListener('pointercancel', handleEnd);
  }

  private drawTrail() {
    if (!this.ctx || this.points.length < 2) return;
    this.ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);

    this.ctx.strokeStyle = '#38bdf8';
    this.ctx.lineWidth = 6;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.shadowColor = '#0284c7';
    this.ctx.shadowBlur = 10;

    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.stroke();
  }

  private clearTrail() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
    this.points = [];
  }
}
