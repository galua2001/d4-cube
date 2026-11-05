# -*- coding: utf-8 -*-
import sys

file_path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 멤버 변수 추가
target_props = "  private isPlaying: boolean = false;\n  private playTimerId: number | null = null;"
if target_props not in content:
    target_props = "  private isPlaying: boolean = false;\r\n  private playTimerId: number | null = null;"

assert target_props in content, "target_props not found"

replace_props = """  private isPlaying: boolean = false;
  private playTimerId: number | null = null;
  private playSpeed: number = 1.0;
  private toastTimerId: number | null = null;"""

content = content.replace(target_props, replace_props, 1)

# 2. getPlaySpeed, setPlaySpeed, showToast 메서드 추가 (resetStep 뒤)
target_reset = """  public resetStep(): void {
    this.stopAutoPlay();
    this.setStep(0);
  }"""
if target_reset not in content:
    target_reset = target_reset.replace('\n', '\r\n')

assert target_reset in content, "target_reset not found"

replace_reset = """  public resetStep(): void {
    this.stopAutoPlay();
    this.setStep(0);
  }

  public getPlaySpeed(): number {
    return this.playSpeed;
  }

  public setPlaySpeed(speed: number): void {
    this.playSpeed = speed;
    const speedBtns = this.overlay?.querySelectorAll('.formula-speed-btn');
    speedBtns?.forEach((b) => {
      const btnSpeed = parseFloat((b as HTMLElement).dataset.speed || '1.0');
      b.classList.toggle('active', btnSpeed === this.playSpeed);
    });

    if (this.isPlaying) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  public showToast(message: string): void {
    let toastEl = this.overlay?.querySelector('#formula-toast') as HTMLElement | null;
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'formula-toast';
      toastEl.className = 'formula-toast';
      const card = this.overlay?.querySelector('.formula-modal-card');
      if (card) {
        card.appendChild(toastEl);
      } else {
        this.overlay?.appendChild(toastEl);
      }
    }
    toastEl.textContent = message;
    toastEl.classList.add('show');

    if (this.toastTimerId !== null) {
      window.clearTimeout(this.toastTimerId);
    }
    this.toastTimerId = window.setTimeout(() => {
      toastEl?.classList.remove('show');
      this.toastTimerId = null;
    }, 2000);
  }"""

content = content.replace(target_reset, replace_reset, 1)

# 3. startAutoPlay interval 조절
target_autoplay = """      this.renderStepInfo();
      this.renderMiniBoard();
    }, 1500);"""
if target_autoplay not in content:
    target_autoplay = target_autoplay.replace('\n', '\r\n')

assert target_autoplay in content, "target_autoplay not found"

replace_autoplay = """      this.renderStepInfo();
      this.renderMiniBoard();
    }, Math.round(1500 / this.playSpeed));"""

content = content.replace(target_autoplay, replace_autoplay, 1)

# 4. createDom() 에 토스트 엘리먼트 추가
target_createdom = """          <!-- 우측 공식 상세 및 3×3 인터랙티브 시뮬레이터 -->
          <div class="formula-detail-panel" id="formula-detail-panel"></div>
        </div>
      </div>"""
if target_createdom not in content:
    target_createdom = target_createdom.replace('\n', '\r\n')

assert target_createdom in content, "target_createdom not found"

replace_createdom = """          <!-- 우측 공식 상세 및 3×3 인터랙티브 시뮬레이터 -->
          <div class="formula-detail-panel" id="formula-detail-panel"></div>
        </div>

        <!-- 복사 알림 토스트 (Round 6) -->
        <div class="formula-toast" id="formula-toast" role="status" aria-live="polite"></div>
      </div>"""

content = content.replace(target_createdom, replace_createdom, 1)

# 5. renderDetail() 공식 표기법 영역에 복사 버튼 추가
target_notation = """          <div class="formula-notation-box">
            <div class="formula-notation-label">${t('formula.mathNotationLabel')}</div>
            <div class="formula-notation-code">⚡ ${formula.formulaSeq}</div>
            ${formula.latexFormula ? `<div class="formula-latex-code">Formula: ${formula.latexFormula}</div>` : ''}
          </div>"""
if target_notation not in content:
    target_notation = target_notation.replace('\n', '\r\n')

assert target_notation in content, "target_notation not found"

replace_notation = """          <div class="formula-notation-box">
            <div class="formula-notation-header">
              <span class="formula-notation-label">${t('formula.mathNotationLabel')}</span>
              <button class="btn-copy-formula" id="btn-copy-formula" type="button" title="${t('formula.btnCopy')}">
                <span class="copy-icon">📋</span>
                <span class="copy-text">${t('formula.btnCopy')}</span>
              </button>
            </div>
            <div class="formula-notation-code">⚡ ${formula.formulaSeq}</div>
            ${formula.latexFormula ? `<div class="formula-latex-code">Formula: ${formula.latexFormula}</div>` : ''}
          </div>"""

content = content.replace(target_notation, replace_notation, 1)

# 6. renderDetail() 재생 컨트롤 바에 속도 버튼 추가
target_playback = """                <!-- 재생 컨트롤 바 -->
                <div class="step-playback-bar">
                  <button class="formula-ctrl-btn" id="btn-step-prev">◀</button>
                  <button class="formula-ctrl-btn primary" id="btn-step-play">▶ ${t('formula.btnPlay')}</button>
                  <button class="formula-ctrl-btn" id="btn-step-next">▶</button>
                  <button class="formula-ctrl-btn" id="btn-step-reset">↺ ${t('formula.btnReset')}</button>
                </div>"""
if target_playback not in content:
    target_playback = target_playback.replace('\n', '\r\n')

assert target_playback in content, "target_playback not found"

replace_playback = """                <!-- 재생 컨트롤 바 & 속도 제어기 (Round 6) -->
                <div class="step-playback-bar">
                  <div class="step-playback-main-btns">
                    <button class="formula-ctrl-btn" id="btn-step-prev">◀</button>
                    <button class="formula-ctrl-btn primary" id="btn-step-play">▶ ${t('formula.btnPlay')}</button>
                    <button class="formula-ctrl-btn" id="btn-step-next">▶</button>
                    <button class="formula-ctrl-btn" id="btn-step-reset">↺ ${t('formula.btnReset')}</button>
                  </div>
                  <div class="step-speed-selector" id="step-speed-selector">
                    <button class="formula-speed-btn ${this.playSpeed === 0.5 ? 'active' : ''}" data-speed="0.5" id="btn-speed-05x">${t('formula.speed05x')}</button>
                    <button class="formula-speed-btn ${this.playSpeed === 1.0 ? 'active' : ''}" data-speed="1.0" id="btn-speed-1x">${t('formula.speed1x')}</button>
                    <button class="formula-speed-btn ${this.playSpeed === 2.0 ? 'active' : ''}" data-speed="2.0" id="btn-speed-2x">${t('formula.speed2x')}</button>
                  </div>
                </div>"""

content = content.replace(target_playback, replace_playback, 1)

# 7. bindDetailEvents() 이벤트 바인딩 추가
target_events = """    panel.querySelector('#btn-step-reset')?.addEventListener('click', () => {
      this.resetStep();
    });

    // 실전 보드 연습하기 버튼 이벤트"""
if target_events not in content:
    target_events = target_events.replace('\n', '\r\n')

assert target_events in content, "target_events not found"

replace_events = """    panel.querySelector('#btn-step-reset')?.addEventListener('click', () => {
      this.resetStep();
    });

    // 공식 원클릭 복사 이벤트 (Round 6)
    const copyBtn = panel.querySelector('#btn-copy-formula');
    copyBtn?.addEventListener('click', async () => {
      soundEngine.playTap();
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(formula.formulaSeq);
        }
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
      this.showToast(t('formula.copiedToast'));
      copyBtn.classList.add('copied');
      window.setTimeout(() => copyBtn.classList.remove('copied'), 1500);
    });

    // 재생 속도 제어 버튼군 이벤트 (Round 6)
    panel.querySelectorAll('.formula-speed-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const speed = parseFloat((btn as HTMLElement).dataset.speed || '1.0');
        soundEngine.playTap();
        this.setPlaySpeed(speed);
      });
    });

    // 실전 보드 연습하기 버튼 이벤트"""

content = content.replace(target_events, replace_events, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("formulaModal.ts successfully updated with speed control & copy formula features!")
