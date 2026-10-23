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
  private allowDiagonal = false;

  // 1-1 성분의 현재 모드 ('row': 1행 변환 모드, 'col': 1열 변환 모드)
  private cell11Mode: 'row' | 'col' = 'row';

  // 누름 시간 추적 및 홀드 회전 인디케이터 관리
  private pointerDownTime = 0;
  private holdTimer: ReturnType<typeof setTimeout> | null = null;
  private animFrameId: number | null = null;
  private isHoldTriggered = false;

  private indicatorEl: HTMLElement | null = null;
  private ringFillEl: SVGCircleElement | null = null;
  private badgeEl: HTMLElement | null = null;

  // 임계값 상수
  private readonly THRESHOLD_STAGE1 = 250; // ms: 90° (0 ~ 249ms)
  private readonly THRESHOLD_STAGE2 = 550; // ms: 180° (250 ~ 549ms), 550ms 이상 시 R270 자동 발동
  private readonly SWIPE_DISTANCE_THRESHOLD = 35; // px: 스와이프 전환 기준
  private readonly CIRCUMFERENCE = 213.6; // 2 * Math.PI * 34 (r = 34)

  constructor(boardEl: HTMLElement, trailCanvas: HTMLCanvasElement, onAction: GestureCallback, boardSize = 3) {
    this.boardEl = boardEl;
    this.trailCanvas = trailCanvas;
    if (trailCanvas && typeof trailCanvas.getContext === 'function') {
      this.ctx = trailCanvas.getContext('2d');
    }
    this.onAction = onAction;
    this.boardSize = boardSize;

    this.bindEvents();
    this.syncCanvasSize();
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('resize', () => this.syncCanvasSize());
    }
  }

  public setBoardSize(size: number) {
    this.boardSize = size;
  }

  public setAllowDiagonal(allow: boolean) {
    this.allowDiagonal = allow;
  }

  public isDiagonalAllowed(): boolean {
    return this.allowDiagonal;
  }

  public setLocked(locked: boolean) {
    this.isLocked = locked;
    if (locked) {
      this.cancelHold();
    }
  }

  public getCell11Mode(): 'row' | 'col' {
    return this.cell11Mode;
  }

  public toggleCell11Mode(): 'row' | 'col' {
    this.cell11Mode = this.cell11Mode === 'row' ? 'col' : 'row';
    return this.cell11Mode;
  }

  private syncCanvasSize() {
    if (!this.boardEl || !this.trailCanvas) return;
    if (typeof this.boardEl.getBoundingClientRect === 'function') {
      const rect = this.boardEl.getBoundingClientRect();
      this.trailCanvas.width = rect.width;
      this.trailCanvas.height = rect.height;
    }
  }

  public getLineForCell(r: number, c: number): LineTarget | null {
    const sz = this.boardSize;
    const lines = generateLines(sz);

    // 1-1 성분 (r=0, c=0): 토글 스위치 상태에 따라 1행 또는 1열
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

    // 대각선 변환이 활성화되었을 때만 대각선 및 보드 중앙 성분 인식
    if (this.allowDiagonal) {
      // 대각선: 우측 하단 모서리는 주대각선, (1, sz-1)은 부대각선
      if (r === sz - 1 && c === sz - 1) {
        return lines.find(l => l.type === 'diag' && l.idx === 'main') || null;
      }
      if (r === 1 && c === sz - 1) {
        return lines.find(l => l.type === 'diag' && l.idx === 'anti') || null;
      }

      // 보드 중앙 성분(예: 3x3의 2행2열) 터치 시 2행 변환으로 매핑
      if (r === Math.floor(sz / 2) && c === Math.floor(sz / 2)) {
        return lines.find(l => l.type === 'row' && l.idx === r) || null;
      }
    }

    // 기본(대각선 비활성화) 모드에서는 오직 외곽 5곳(11, 12, 13, 21, 31)만 컨트롤러로 인식
    return null;
  }

  /**
   * 실시간 홀드 인디케이터 DOM 요소를 준비합니다.
   */
  private ensureIndicator(): void {
    if (this.indicatorEl || typeof document === 'undefined') return;

    const indicator = document.createElement('div');
    indicator.className = 'hold-indicator';
    indicator.id = 'hold-indicator';
    indicator.innerHTML = `
      <svg class="hold-ring-svg" viewBox="0 0 80 80">
        <circle class="hold-ring-bg" cx="40" cy="40" r="34" />
        <circle class="hold-ring-marker-250" cx="40" cy="40" r="34" />
        <circle class="hold-ring-fill" cx="40" cy="40" r="34" />
      </svg>
      <div class="hold-badge">90°</div>
    `;

    if (this.boardEl && typeof this.boardEl.appendChild === 'function') {
      if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
        const computed = window.getComputedStyle(this.boardEl);
        if (computed && computed.position === 'static') {
          this.boardEl.style.position = 'relative';
        }
      }
      this.boardEl.appendChild(indicator);
    }

    this.indicatorEl = indicator;
    this.ringFillEl = indicator.querySelector('.hold-ring-fill') as SVGCircleElement;
    this.badgeEl = indicator.querySelector('.hold-badge') as HTMLElement;
  }

  /**
   * 터치된 셀 중심에 실시간 원형 게이지 인디케이터를 띄우고 rAF 루프를 가동합니다.
   */
  private showIndicator(x: number, y: number): void {
    this.ensureIndicator();
    if (!this.indicatorEl || !this.ringFillEl || !this.badgeEl) return;

    this.indicatorEl.style.left = `${x}px`;
    this.indicatorEl.style.top = `${y}px`;
    this.indicatorEl.className = 'hold-indicator active';
    this.ringFillEl.style.strokeDashoffset = `${this.CIRCUMFERENCE}`;
    this.badgeEl.textContent = '90°';

    this.startIndicatorLoop();
  }

  private startIndicatorLoop(): void {
    if (this.animFrameId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    const update = () => {
      if (!this.isPointerDown || this.isHoldTriggered) return;

      const elapsed = Date.now() - this.pointerDownTime;

      const progress = Math.min(1, elapsed / this.THRESHOLD_STAGE2);
      const offset = this.CIRCUMFERENCE * (1 - progress);

      if (this.ringFillEl) {
        this.ringFillEl.style.strokeDashoffset = `${offset.toFixed(1)}`;
      }

      if (this.indicatorEl && this.badgeEl) {
        if (elapsed >= this.THRESHOLD_STAGE1) {
          if (!this.indicatorEl.classList.contains('stage-180')) {
            this.indicatorEl.classList.add('stage-180');
            this.badgeEl.textContent = '180°';
          }
        } else {
          if (this.indicatorEl.classList.contains('stage-180')) {
            this.indicatorEl.classList.remove('stage-180');
            this.badgeEl.textContent = '90°';
          }
        }
      }

      if (elapsed < this.THRESHOLD_STAGE2 && typeof requestAnimationFrame === 'function') {
        this.animFrameId = requestAnimationFrame(update);
      }
    };

    if (typeof requestAnimationFrame === 'function') {
      this.animFrameId = requestAnimationFrame(update);
    }
  }

  /**
   * 3단계 550ms 도달 시 R270을 자동 발동하고 팝업 번쩍 효과를 연출합니다.
   */
  private triggerStage3(): void {
    if (!this.isPointerDown || this.isHoldTriggered) return;
    this.isHoldTriggered = true;

    if (this.animFrameId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.ringFillEl) {
      this.ringFillEl.style.strokeDashoffset = '0';
    }

    if (this.indicatorEl && this.badgeEl) {
      this.indicatorEl.classList.remove('stage-180');
      this.indicatorEl.classList.add('stage-270', 'triggered');
      this.badgeEl.textContent = '270°';
    }

    if (this.startCell) {
      this.onAction(this.startCell.target, 'R270');
    }

    setTimeout(() => {
      this.hideIndicator();
    }, 280);
  }

  private hideIndicator(): void {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
    if (this.animFrameId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.indicatorEl) {
      this.indicatorEl.className = 'hold-indicator';
    }
  }

  private cancelHold(): void {
    this.hideIndicator();
  }

  private bindEvents() {
    if (!this.boardEl || typeof this.boardEl.addEventListener !== 'function') return;

    this.boardEl.addEventListener('pointerdown', (e: any) => {
      if (this.isLocked) return;

      // 1행 1열 스위치(.tile-switch-11 등) 조작 시 제스처 전면 무시 (스위치 탭 시 회전 방지)
      const targetElem = e.target as HTMLElement;
      if (
        targetElem &&
        (targetElem.closest?.('.tile-switch-11') ||
          targetElem.classList?.contains('tile-switch-11') ||
          targetElem.closest?.('#tile-switch-11') ||
          targetElem.closest?.('.side-switch-11') ||
          targetElem.classList?.contains('side-switch-11') ||
          targetElem.classList?.contains('dot-toggle-11') ||
          targetElem.closest?.('.dual-switch-11') ||
          targetElem.classList?.contains('dual-switch-11'))
      ) {
        return;
      }

      const cellBox = (e.target as HTMLElement)?.closest?.('.cell-box') as HTMLElement;
      let r = -1;
      let c = -1;

      if (cellBox && cellBox.parentElement === this.boardEl && this.boardEl.children) {
        const idx = Array.from(this.boardEl.children).indexOf(cellBox);
        if (idx !== -1) {
          r = Math.floor(idx / this.boardSize);
          c = idx % this.boardSize;
        }
      }

      if (r === -1 || c === -1) {
        if (typeof this.boardEl.getBoundingClientRect === 'function') {
          const rect = this.boardEl.getBoundingClientRect();
          const x = (e.clientX ?? 0) - rect.left;
          const y = (e.clientY ?? 0) - rect.top;
          const cellW = rect.width / this.boardSize;
          const cellH = rect.height / this.boardSize;
          c = Math.max(0, Math.min(this.boardSize - 1, Math.floor(x / cellW)));
          r = Math.max(0, Math.min(this.boardSize - 1, Math.floor(y / cellH)));
        } else {
          r = 0;
          c = 0;
        }
      }

      const target = this.getLineForCell(r, c);
      if (!target) return;

      if (typeof this.boardEl.setPointerCapture === 'function' && e.pointerId !== undefined) {
        try {
          this.boardEl.setPointerCapture(e.pointerId);
        } catch {
          // 일부 브라우저 예외 무시
        }
      }

      this.isPointerDown = true;
      this.isHoldTriggered = false;
      this.startCell = { r, c, target };
      const startX = e.clientX ?? 0;
      const startY = e.clientY ?? 0;
      this.points = [{ x: startX, y: startY }];
      this.pointerDownTime = Date.now();

      // 인디케이터 등장 위치: 터치된 셀의 중심 좌표
      let centerX = startX;
      let centerY = startY;
      if (typeof this.boardEl.getBoundingClientRect === 'function') {
        const rect = this.boardEl.getBoundingClientRect();
        centerX = startX - rect.left;
        centerY = startY - rect.top;

        if (cellBox && typeof cellBox.getBoundingClientRect === 'function') {
          const cRect = cellBox.getBoundingClientRect();
          centerX = (cRect.left + cRect.width / 2) - rect.left;
          centerY = (cRect.top + cRect.height / 2) - rect.top;
        }
      }

      this.showIndicator(centerX, centerY);

      // 3단계(550ms) 자동 발동 타이머 가동
      if (this.holdTimer) clearTimeout(this.holdTimer);
      this.holdTimer = setTimeout(() => {
        this.triggerStage3();
      }, this.THRESHOLD_STAGE2);
    });

    this.boardEl.addEventListener('pointermove', (e: any) => {
      if (!this.isPointerDown) return;
      const curX = e.clientX ?? 0;
      const curY = e.clientY ?? 0;
      this.points.push({ x: curX, y: curY });

      // 35px 이상 이동 시 홀드 인디케이터 숨김 및 스와이프 제스처 모드로 전환
      if (this.points.length > 0) {
        const start = this.points[0];
        const dist = Math.hypot(curX - start.x, curY - start.y);
        if (dist >= this.SWIPE_DISTANCE_THRESHOLD) {
          if (this.holdTimer) {
            clearTimeout(this.holdTimer);
            this.holdTimer = null;
          }
          if (this.animFrameId && typeof cancelAnimationFrame === 'function') {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
          }
          if (this.indicatorEl && !this.isHoldTriggered) {
            this.hideIndicator();
          }
        }
      }

      this.drawTrail();
    });

    const handleEnd = (e: any) => {
      if (this.holdTimer) {
        clearTimeout(this.holdTimer);
        this.holdTimer = null;
      }
      if (this.animFrameId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }

      if (!this.isPointerDown || !this.startCell) {
        this.isPointerDown = false;
        this.hideIndicator();
        this.clearTrail();
        return;
      }

      this.isPointerDown = false;

      // 3단계(550ms)로 R270이 이미 자동 발동된 경우 추가 회전 없이 인디케이터만 정리
      if (this.isHoldTriggered) {
        this.isHoldTriggered = false;
        this.hideIndicator();
        this.clearTrail();
        return;
      }

      const start = this.points[0] || { x: 0, y: 0 };
      const endX = (e.clientX !== undefined) ? e.clientX : start.x;
      const endY = (e.clientY !== undefined) ? e.clientY : start.y;
      const dx = endX - start.x;
      const dy = endY - start.y;
      const dist = Math.hypot(dx, dy);

      const target = this.startCell.target;
      const nowTime = Date.now();
      const elapsed = nowTime - this.pointerDownTime;

      this.hideIndicator();
      this.clearTrail();

      // ========================================================
      // 1. 누르는 시간(Press Duration) 기반 회전 판정 (이동거리 < 35px):
      //    - 0 <= t < 250ms: 손 떼는 순간 즉시 R90 (1수)
      //    - 250ms <= t < 550ms: 손 떼는 순간 즉시 R180 (1수)
      // ========================================================
      if (dist < this.SWIPE_DISTANCE_THRESHOLD) {
        if (elapsed < this.THRESHOLD_STAGE1) {
          this.onAction(target, 'R90');
        } else {
          this.onAction(target, 'R180');
        }
        return;
      }

      // ========================================================
      // 2. 스와이프 제스처 판정 (이동거리 >= 35px)
      // ========================================================
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
    if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
      window.addEventListener('pointerup', handleEnd);
    }
  }

  private drawTrail() {
    // 터치 시 불필요한 선 궤적을 그리지 않도록 완전히 비활성화
  }

  private clearTrail() {
    if (!this.ctx || !this.trailCanvas) return;
    this.ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);
    this.points = [];
  }
}
