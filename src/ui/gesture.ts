import { D4Op } from '../core/group';
import { LineTarget } from '../core/board';

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

  constructor(boardEl: HTMLElement, trailCanvas: HTMLCanvasElement, onAction: GestureCallback) {
    this.boardEl = boardEl;
    this.trailCanvas = trailCanvas;
    this.ctx = trailCanvas.getContext('2d');
    this.onAction = onAction;

    this.bindEvents();
    this.syncCanvasSize();
    window.addEventListener('resize', () => this.syncCanvasSize());
  }

  public setLocked(locked: boolean) {
    this.isLocked = locked;
  }

  private syncCanvasSize() {
    const rect = this.boardEl.getBoundingClientRect();
    this.trailCanvas.width = rect.width;
    this.trailCanvas.height = rect.height;
  }

  private getLineForCell(r: number, c: number): LineTarget | null {
    if (r === 0 && c === 0) return { type: 'row', idx: 0, label: '1행' };
    if (r === 1 && c === 0) return { type: 'row', idx: 1, label: '2행' };
    if (r === 2 && c === 0) return { type: 'row', idx: 2, label: '3행' };
    if (r === 1 && c === 1) return { type: 'col', idx: 0, label: '1열' };
    if (r === 0 && c === 1) return { type: 'col', idx: 1, label: '2열' };
    if (r === 0 && c === 2) return { type: 'col', idx: 2, label: '3열' };
    if (r === 1 && c === 2) return { type: 'diag', idx: 'anti', label: '↗ 부대각선' };
    if (r === 2 && c === 2) return { type: 'diag', idx: 'main', label: '↖ 주대각선' };
    return null;
  }

  private bindEvents() {
    this.boardEl.addEventListener('pointerdown', (e) => {
      if (this.isLocked) return;
      const rect = this.boardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const cellW = rect.width / 3;
      const cellH = rect.height / 3;
      const c = Math.floor(x / cellW);
      const r = Math.floor(y / cellH);

      const target = this.getLineForCell(r, c);
      if (!target) return;

      this.isPointerDown = true;
      this.startCell = { r, c, target };
      this.points = [{ x, y }];
      this.drawTrail();
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isPointerDown) return;
      const rect = this.boardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.points.push({ x, y });
      this.drawTrail();
    });

    const handleEnd = () => {
      if (!this.isPointerDown || !this.startCell) {
        this.isPointerDown = false;
        this.clearTrail();
        return;
      }

      this.isPointerDown = false;
      if (this.points.length < 2) {
        this.clearTrail();
        return;
      }

      const start = this.points[0];
      const end = this.points[this.points.length - 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dist = Math.hypot(dx, dy);

      const target = this.startCell.target;
      this.clearTrail();

      if (dist < 15) {
        // 단일 탭: R90
        this.onAction(target, 'R90');
        return;
      }

      const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

      // 제스처 각도 판정
      if (Math.abs(angleDeg) <= 30 || Math.abs(angleDeg) >= 150) {
        // 가로 스와이프: MX
        this.onAction(target, 'MX');
      } else if (Math.abs(angleDeg) >= 60 && Math.abs(angleDeg) <= 120) {
        // 세로 스와이프: MY
        this.onAction(target, 'MY');
      } else if ((angleDeg > 30 && angleDeg < 60) || (angleDeg > -150 && angleDeg < -120)) {
        // 주대각 스와이프: MD
        this.onAction(target, 'MD');
      } else if ((angleDeg > -60 && angleDeg < -30) || (angleDeg > 120 && angleDeg < 150)) {
        // 부대각 스와이프: MAD
        this.onAction(target, 'MAD');
      } else if (Math.abs(dx) >= Math.abs(dy)) {
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
