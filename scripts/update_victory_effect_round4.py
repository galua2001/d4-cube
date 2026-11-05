# -*- coding: utf-8 -*-
"""
victoryEffect.ts 에 showSpecialPracticeVictory 추가
"""
import sys

target_path = r'C:\Users\user\matrix-cube\src\ui\victoryEffect.ts'

with open(target_path, 'r', encoding='utf-8') as f:
    content = f.read()

interface_code = '''
export interface SpecialPracticeVictoryOptions {
  title: string;
  subtitle: string;
  isPerfect: boolean;
  onRetry: () => void;
  onExit: () => void;
}
'''

if 'SpecialPracticeVictoryOptions' not in content:
    # VictoryRecordInfo 다음에 추가
    info_marker = 'export interface VictoryRecordInfo {'
    content = interface_code + content

method_code = '''
  public showSpecialPracticeVictory(options: SpecialPracticeVictoryOptions) {
    this.resizeCanvas();
    this.canvas.style.display = 'block';
    this.particles = [];
    this.isRunning = true;

    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 150, 50, 300]);
    }

    const colors = ['#10b981', '#34d399', '#facc15', '#38bdf8', '#ffffff', '#a855f7'];
    const w = this.canvas.width;
    const h = this.canvas.height;

    for (let i = 0; i < 180; i++) {
      const fromLeft = i % 2 === 0;
      this.particles.push({
        x: fromLeft ? Math.random() * (w * 0.3) : w - Math.random() * (w * 0.3),
        y: h + 10,
        vx: (fromLeft ? 1 : -1) * (Math.random() * 9 + 4) + (Math.random() - 0.5) * 4,
        vy: -(Math.random() * 18 + 14),
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 14,
        alpha: 1,
        shape: i % 4 === 0 ? 'star' : (i % 2 === 0 ? 'rect' : 'circle')
      });
    }

    this.animate();

    const old = document.getElementById('victory-banner-overlay');
    if (old) old.remove();

    const banner = document.createElement('div');
    banner.id = 'victory-banner-overlay';
    banner.className = 'victory-banner-anim';

    banner.innerHTML = `
      <div class="victory-card practice-special-card">
        <div class="victory-trophy">🎯</div>
        <div class="badge-new-record" style="background: linear-gradient(135deg, #10b981, #059669);">${options.isPerfect ? '🌟 PERFECT SOLVE!' : '🎉 PRACTICE CLEAR!'}</div>
        <div class="victory-title">${options.title}</div>
        <div class="victory-stars">${options.isPerfect ? '⭐⭐⭐' : '⭐⭐'}</div>
        <div class="victory-desc" style="font-size: 0.95rem; color: #a7f3d0; margin-top: 6px;">${options.subtitle}</div>
        <div class="victory-actions" style="margin-top: 20px;">
          <button id="btn-practice-retry" class="btn-action primary" style="background: linear-gradient(135deg, #10b981, #059669);">↺ 다시 연습하기</button>
          <button id="btn-practice-exit" class="btn-action">일반 게임으로 복귀</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    const closeBanner = () => {
      banner.classList.add('fade-out');
      setTimeout(() => banner.remove(), 300);
    };

    banner.querySelector('#btn-practice-retry')?.addEventListener('click', () => {
      closeBanner();
      options.onRetry();
    });

    banner.querySelector('#btn-practice-exit')?.addEventListener('click', () => {
      closeBanner();
      options.onExit();
    });

    setTimeout(() => {
      this.isRunning = false;
      if (this.animId) cancelAnimationFrame(this.animId);
      if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.style.display = 'none';
    }, 4500);
  }
}
'''

if 'showSpecialPracticeVictory' not in content:
    # 마지막 닫는 괄호 } 바로 앞에 추가
    last_brace_idx = content.rfind('}')
    content = content[:last_brace_idx] + method_code

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated victoryEffect.ts!")
