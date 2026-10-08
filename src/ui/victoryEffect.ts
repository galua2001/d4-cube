// 승리 시 화면 전체에 화려하게 터지는 컨페티(Confetti 폭죽) 및 축하 배너 시스템

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
  shape: 'rect' | 'circle' | 'star';
}

export interface VictoryRecordInfo {
  timeFormatted?: string;
  isNewBestTime?: boolean;
  isNewBestMoves?: boolean;
  bestTimeFormatted?: string;
  bestMoves?: number | null;
}

export class VictoryEffectManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private particles: Particle[] = [];
  private animId: number | null = null;
  private isRunning = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'victory-confetti-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '999';
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  public launchVictory(
    movesCount: number,
    stars: number,
    recordInfo?: VictoryRecordInfo,
    onRestart?: () => void
  ) {
    this.resizeCanvas();
    this.canvas.style.display = 'block';
    this.particles = [];
    this.isRunning = true;

    // 햅틱 진동 피드백 (모바일 지원 시)
    if (navigator.vibrate) {
      navigator.vibrate([80, 40, 120, 40, 250]);
    }

    const colors = ['#facc15', '#38bdf8', '#4ade80', '#f43f5e', '#a855f7', '#fb923c', '#ffffff'];
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 양쪽 및 중앙에서 150개의 화려한 폭죽 파티클 발사
    for (let i = 0; i < 150; i++) {
      const fromLeft = i % 2 === 0;
      this.particles.push({
        x: fromLeft ? Math.random() * (w * 0.3) : w - Math.random() * (w * 0.3),
        y: h + 10,
        vx: (fromLeft ? 1 : -1) * (Math.random() * 8 + 3) + (Math.random() - 0.5) * 4,
        vy: -(Math.random() * 16 + 12),
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1,
        shape: i % 5 === 0 ? 'star' : (i % 2 === 0 ? 'rect' : 'circle')
      });
    }

    this.animate();

    // 화면 상단에 세련된 승리 배너 생성 (기존 글자 alert 대화상자 완전 대체)
    this.showVictoryBanner(movesCount, stars, recordInfo, onRestart);

    // 3.8초 후 파티클 자연스럽게 종료
    setTimeout(() => {
      this.isRunning = false;
      if (this.animId) cancelAnimationFrame(this.animId);
      if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.style.display = 'none';
    }, 4000);
  }

  private animate = () => {
    if (!this.isRunning || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // 중력
      p.vx *= 0.985;
      p.rotation += p.vRot;

      if (p.vy > 0) {
        p.alpha -= 0.007; // 낙하 시 페이드아웃
      }

      if (p.alpha <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // 별 모양
        this.ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          this.ctx.lineTo(Math.cos((18 + s * 72) * Math.PI / 180) * p.size, -Math.sin((18 + s * 72) * Math.PI / 180) * p.size);
          this.ctx.lineTo(Math.cos((54 + s * 72) * Math.PI / 180) * (p.size / 2), -Math.sin((54 + s * 72) * Math.PI / 180) * (p.size / 2));
        }
        this.ctx.closePath();
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(this.animate);
    }
  };

  private showVictoryBanner(
    movesCount: number,
    stars: number,
    recordInfo?: VictoryRecordInfo,
    onRestart?: () => void
  ) {
    // 기존 배너가 있으면 제거
    const old = document.getElementById('victory-banner-overlay');
    if (old) old.remove();

    const banner = document.createElement('div');
    banner.id = 'victory-banner-overlay';
    banner.className = 'victory-banner-anim';

    const isNewBest = recordInfo?.isNewBestTime || recordInfo?.isNewBestMoves;
    const timeDisplay = recordInfo?.timeFormatted ? `⏱️ 소요 시간: <b>${recordInfo.timeFormatted}</b>` : '';

    banner.innerHTML = `
      <div class="victory-card">
        <div class="victory-trophy">🏆</div>
        ${isNewBest ? '<div class="badge-new-record">🔥 NEW BEST RECORD!</div>' : ''}
        <div class="victory-title">PERFECT CLEAR!</div>
        <div class="victory-stars">${'⭐'.repeat(stars)}</div>
        <div class="victory-desc">모든 대칭 타일을 원위치로 맞추셨습니다!</div>
        <div class="victory-stats-box">
          <div class="victory-moves">총 조작: <b>${movesCount} 회</b></div>
          ${timeDisplay ? `<div class="victory-time">${timeDisplay}</div>` : ''}
        </div>
        ${recordInfo?.bestTimeFormatted || recordInfo?.bestMoves !== undefined ? `
          <div class="victory-best-summary">
            최고 기록: ${recordInfo.bestMoves ? `${recordInfo.bestMoves}회` : '-'} / ${recordInfo.bestTimeFormatted || '-'}
          </div>
        ` : ''}
        <div class="victory-actions">
          <button id="btn-victory-replay" class="btn-action primary">🎲 다시 섞기</button>
          <button id="btn-victory-close" class="btn-action">닫기</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    const closeBanner = () => {
      banner.classList.add('fade-out');
      setTimeout(() => banner.remove(), 300);
    };

    banner.querySelector('#btn-victory-close')?.addEventListener('click', closeBanner);
    banner.querySelector('#btn-victory-replay')?.addEventListener('click', () => {
      closeBanner();
      if (onRestart) onRestart();
    });

    // 6초 후 자동 페이드아웃
    setTimeout(() => {
      if (document.body.contains(banner)) {
        closeBanner();
      }
    }, 6000);
  }
}

export const victoryManager = new VictoryEffectManager();
