import { D4Op, D4, composeOps } from '../core/group';
import { renderDogTileCanvas } from './tileRenderer';
import { soundEngine } from '../audio/audioEngine';

export const TUTORIAL_STORAGE_KEY = 'matrix_cube_tutorial_completed';

export function isTutorialCompleted(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markTutorialCompleted(): void {
  try {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  } catch {}
}

export function getBadgeText(op: D4Op): string {
  switch (op) {
    case D4.ID: return '0';
    case D4.MX: return 'X';
    case D4.MY: return 'Y';
    case D4.R180: return '180';
    case D4.R90: return '90';
    case D4.R270: return '270';
    case D4.MD: return 'D';
    case D4.MAD: return 'AD';
    default: return '0';
  }
}

/**
 * 30초 압축 행렬 큐브 핵심 튜토리얼 (정확한 4단계):
 * STEP 1. 게임의 최종 목표: 뒤집히거나 돌아간 모든 강아지를 '0번(정위치 앞면)'으로 완성하는 것!
 * STEP 2. 행렬 변환 원리: 1행 1열을 가로로 그으면 1행 전체가 가로 대칭(MX)으로 뒤집힘!
 * STEP 3. 1행 1열 모드 전환: 1행 1열 우측하단 점을 눌러 1행과 1열 변환 모드를 자유자재로 전환!
 * STEP 4. 군론 대칭 합성의 묘미: 가로 대칭과 세로 대칭이 만나면 180도 회전 탄생! 군론 마스터 후 실전 게임 시작!
 */
export class TutorialModalController {
  public isOpen = false;
  public currentStep = 1; // 1 ~ 4
  public boardOps: D4Op[] = Array(9).fill(D4.ID);
  public cell11Mode: 'row' | 'col' = 'row';
  private dragStart: { x: number; y: number; time: number } | null = null;
  private autoTimer: ReturnType<typeof setTimeout> | null = null;

  private imgDogFront: HTMLImageElement | null = null;
  private imgDogBack: HTMLImageElement | null = null;

  constructor() {
    if (typeof Image !== 'undefined') {
      this.imgDogFront = new Image();
      this.imgDogBack = new Image();
      this.imgDogFront.src = 'assets/dog_front.png';
      this.imgDogBack.src = 'assets/dog_back.png';

      const onImgLoad = () => {
        if (this.isOpen) {
          this.renderBoard();
        }
      };
      this.imgDogFront.onload = onImgLoad;
      this.imgDogBack.onload = onImgLoad;
    }
  }

  public open(startStep = 1): void {
    this.isOpen = true;
    this.currentStep = Math.max(1, Math.min(4, startStep));
    this.cell11Mode = 'row';
    this.boardOps = [D4.MX, D4.R90, D4.MY, D4.ID, D4.R180, D4.MX, D4.MY, D4.ID, D4.R90]; // 1단계 목표 시연용 섞인 보드
    this.clearAutoTimer();

    this.buildDOM();
    this.updateStepUI();
    this.renderBoard();

    this.removePulse();
    soundEngine.playTap();
  }

  public close(): void {
    this.isOpen = false;
    this.clearAutoTimer();
    if (typeof document !== 'undefined') {
      const overlay = document.getElementById('tutorial-modal-overlay');
      if (overlay) {
        overlay.remove();
      }
    }
    soundEngine.playTap();
  }

  public skip(): void {
    markTutorialCompleted();
    this.close();
    soundEngine.playTap();
  }

  public nextStep(): void {
    this.clearAutoTimer();
    if (this.currentStep < 4) {
      this.currentStep++;
      this.updateStepUI();
      soundEngine.playTap();
    } else {
      this.completeTutorial();
    }
  }

  public completeTutorial(): void {
    markTutorialCompleted();
    this.close();
    soundEngine.playWin();
  }

  private clearAutoTimer(): void {
    if (this.autoTimer) {
      clearTimeout(this.autoTimer);
      this.autoTimer = null;
    }
  }

  private removePulse(): void {
    if (typeof document === 'undefined') return;
    const btnNav = document.getElementById('btn-header-tutorial');
    if (btnNav) {
      btnNav.classList.remove('pulse-active');
    }
  }

  public buildDOM(): void {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('tutorial-modal-overlay');
    if (existing) {
      existing.remove();
    }

    const overlay = document.createElement('div');
    overlay.id = 'tutorial-modal-overlay';
    overlay.className = 'tutorial-overlay';
    overlay.innerHTML = `
      <div class="tutorial-card">
        <!-- 헤더 -->
        <div class="tutorial-header">
          <div class="tutorial-header-left">
            <span class="tutorial-header-badge">30초 핵심</span>
            <span class="tutorial-header-title">🎓 게임 목표 & 군론 행렬 변환</span>
          </div>
          <button id="btn-tut-close" class="tutorial-header-close" title="닫기">✕</button>
        </div>

        <!-- 스텝 프로그레스 바 -->
        <div class="tutorial-steps-bar">
          <div class="tut-step-dot" data-step="1"></div>
          <div class="tut-step-dot" data-step="2"></div>
          <div class="tut-step-dot" data-step="3"></div>
          <div class="tut-step-dot" data-step="4"></div>
        </div>

        <!-- 메인 본문 컨텐츠 영역 -->
        <div class="tutorial-body" id="tut-body">
          <!-- 가이드 텍스트 -->
          <div class="tut-guide-box" id="tut-guide-box">
            <div class="tut-guide-step-name" id="tut-step-name">STEP 1. 게임의 최종 목표</div>
            <div class="tut-guide-main-text" id="tut-main-text">모든 타일을 '0번(정위치 앞면)'으로 완성하세요!</div>
            <div class="tut-guide-sub-text" id="tut-sub-text">뒤집히거나 회전된 강아지들을 모두 바르게 세우면 퍼즐 클리어!</div>
          </div>

          <!-- 3x3 인터랙티브 보드 -->
          <div class="tut-board-wrapper" id="tut-board-wrapper">
            <div class="tut-board-grid" id="tut-board-grid"></div>
            <!-- 제스처 가이드 레이어 -->
            <div class="tut-gesture-layer" id="tut-gesture-layer">
              <div class="tut-finger tut-finger-swipe-x" id="tut-finger">👆</div>
            </div>
          </div>

          <!-- 공식 발견 카드 -->
          <div class="tut-formula-card" id="tut-formula-card" style="display: none;">
            <span class="tut-formula-badge" id="tut-formula-badge">💡 군론 대칭 변환</span>
            <div class="tut-formula-text" id="tut-formula-text">1행 1열 가로 대칭 (MX)</div>
            <div class="tut-formula-desc" id="tut-formula-desc">1행 강아지들이 모두 뒤태로 뒤집혔습니다!</div>
          </div>

          <!-- 스텝 4 최종 마스터 카드 -->
          <div class="tut-master-card" id="tut-master-card" style="display: none;">
            <div class="tut-master-badge-icon">🏆</div>
            <div class="tut-master-title">군론 행렬 퍼즐 완전 정복!</div>
            <p style="font-size:0.88rem; color:#94a3b8; margin:0 0 10px 0;">게임의 목표와 D4 대칭군 핵심 원리를 모두 마스터하셨습니다.</p>
            <div class="tut-rules-summary-list">
              <div class="tut-rule-item"><span>🎯</span> <span><b>게임 목표</b> : 모든 타일을 <b>0번(정위치 앞면)</b>으로 일치시키기</span></div>
              <div class="tut-rule-item"><span>📐</span> <span><b>1행 1열 컨트롤</b> : 1행을 가로·세로로 뒤집는 핵심 성분</span></div>
              <div class="tut-rule-item"><span>🔄</span> <span><b>모드 전환 점</b> : 1행 1열의 점을 눌러 1행 ↔ 1열 전환</span></div>
              <div class="tut-rule-item"><span>⚡</span> <span><b>군론 합성</b> : 가로 대칭(MX) + 세로 대칭(MY) = 180° 회전</span></div>
            </div>
          </div>
        </div>

        <!-- 하단 컨트롤 버튼 바 -->
        <div class="tutorial-footer">
          <button id="btn-tut-skip" class="tut-btn-skip">건너뛰기</button>
          <button id="btn-tut-action" class="tut-btn-action">
            <span id="tut-btn-action-text">다음 (1/4) ➔</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // 3x3 타일 셀 생성
    const grid = document.getElementById('tut-board-grid');
    if (grid) {
      grid.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tut-cell-box';
        cell.id = `tut-cell-${i}`;
        cell.dataset.index = String(i);

        const canvas = document.createElement('canvas');
        canvas.className = 'tut-cell-canvas';
        canvas.width = 100;
        canvas.height = 100;
        cell.appendChild(canvas);

        // 1행 1열 (i === 0) 가이드 뱃지 및 토글 점
        if (i === 0) {
          const guideTag = document.createElement('div');
          guideTag.className = 'controller-guide-label guide-row';
          guideTag.id = 'tut-guide-tag-11';
          guideTag.innerText = '1행';
          cell.appendChild(guideTag);

          const dot = document.createElement('div');
          dot.className = 'dot-toggle-11';
          dot.id = 'tut-dot-11';
          dot.title = '1행 1열 모드 전환 (1행 <-> 1열)';
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDotClick();
          });
          cell.appendChild(dot);
        } else if (i === 1 || i === 2) {
          const guideTag = document.createElement('div');
          guideTag.className = 'controller-guide-label guide-col';
          guideTag.innerText = `${i + 1}열`;
          cell.appendChild(guideTag);
        } else if (i === 3 || i === 6) {
          const guideTag = document.createElement('div');
          guideTag.className = 'controller-guide-label guide-row';
          guideTag.innerText = `${Math.floor(i / 3) + 1}행`;
          cell.appendChild(guideTag);
        }

        const badge = document.createElement('span');
        badge.className = 'tut-cell-badge';
        badge.textContent = '0';
        cell.appendChild(badge);

        grid.appendChild(cell);
      }
    }

    this.bindEvents();
  }

  private handleDotClick(): void {
    this.cell11Mode = this.cell11Mode === 'row' ? 'col' : 'row';
    const tag = document.getElementById('tut-guide-tag-11');
    const dot = document.getElementById('tut-dot-11');
    if (tag) {
      tag.innerText = this.cell11Mode === 'col' ? '1열' : '1행';
      tag.className = `controller-guide-label ${this.cell11Mode === 'col' ? 'guide-col' : 'guide-row'}`;
    }
    if (dot) {
      dot.classList.toggle('col-mode', this.cell11Mode === 'col');
    }
    soundEngine.playTap();

    if (this.currentStep === 3) {
      this.executeStep3Success();
    }
  }

  public bindEvents(): void {
    const btnClose = document.getElementById('btn-tut-close');
    const btnSkip = document.getElementById('btn-tut-skip');
    const btnAction = document.getElementById('btn-tut-action');
    const boardWrapper = document.getElementById('tut-board-wrapper');

    if (btnClose) btnClose.addEventListener('click', () => this.close());
    if (btnSkip) btnSkip.addEventListener('click', () => this.skip());
    if (btnAction) btnAction.addEventListener('click', () => this.handleActionClick());

    if (boardWrapper) {
      boardWrapper.addEventListener(
        'touchstart',
        (e: TouchEvent) => {
          if (e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = boardWrapper.getBoundingClientRect();
            this.handleGestureStart(touch.clientX - rect.left, touch.clientY - rect.top);
          }
        },
        { passive: false }
      );

      boardWrapper.addEventListener(
        'touchend',
        (e: TouchEvent) => {
          if (e.changedTouches && e.changedTouches.length > 0) {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const rect = boardWrapper.getBoundingClientRect();
            this.handleGestureEnd(
              touch.clientX - rect.left,
              touch.clientY - rect.top,
              rect.width,
              rect.height
            );
          }
        },
        { passive: false }
      );

      boardWrapper.addEventListener('mousedown', (e: MouseEvent) => {
        const rect = boardWrapper.getBoundingClientRect();
        this.handleGestureStart(e.clientX - rect.left, e.clientY - rect.top);
      });

      boardWrapper.addEventListener('mouseup', (e: MouseEvent) => {
        const rect = boardWrapper.getBoundingClientRect();
        this.handleGestureEnd(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
      });
    }
  }

  public updateStepUI(): void {
    if (typeof document === 'undefined') return;
    const step = this.currentStep;

    document.querySelectorAll('.tut-step-dot').forEach((dot) => {
      const s = parseInt((dot as HTMLElement).dataset.step || '1', 10);
      dot.classList.toggle('active', s === step);
      dot.classList.toggle('completed', s < step);
    });

    const stepNameEl = document.getElementById('tut-step-name');
    const mainTextEl = document.getElementById('tut-main-text');
    const subTextEl = document.getElementById('tut-sub-text');
    const formulaCard = document.getElementById('tut-formula-card');
    const masterCard = document.getElementById('tut-master-card');
    const boardWrapper = document.getElementById('tut-board-wrapper');
    const fingerEl = document.getElementById('tut-finger');
    const btnActionText = document.getElementById('tut-btn-action-text');

    if (!stepNameEl || !mainTextEl) return;

    if (formulaCard) formulaCard.style.display = 'none';
    if (masterCard) masterCard.style.display = 'none';
    if (boardWrapper) boardWrapper.style.display = 'block';
    this.clearCellHighlights();

    switch (step) {
      case 1:
        stepNameEl.textContent = 'STEP 1. 게임의 목표';
        mainTextEl.textContent = '모든 타일을 0번 정위치로 일치시키는 것이 목표입니다!';
        if (subTextEl) subTextEl.textContent = '섞여 있는 강아지들을 모두 똑바로 선 앞면(0번 뱃지)으로 맞추면 승리!';
        if (fingerEl) fingerEl.style.display = 'none';
        this.boardOps = [D4.MX, D4.R90, D4.MY, D4.ID, D4.R180, D4.MX, D4.MY, D4.ID, D4.R90];
        if (btnActionText) btnActionText.textContent = '행렬 변환 배우기 (1/4) ➔';
        soundEngine.speak('모든 타일을 0번 정위치 앞면으로 일치시키는 것이 게임의 최종 목표입니다!');
        break;

      case 2:
        stepNameEl.textContent = 'STEP 2. 1행 1열 가로 대칭 변환';
        mainTextEl.textContent = '1행 1열을 가로(↔)로 쓱 그어보세요!';
        if (subTextEl) subTextEl.textContent = '1행 1열 타일을 스와이프하면 1행 전체가 가로 대칭(MX)으로 뒤집힙니다.';
        if (fingerEl) {
          fingerEl.style.display = 'block';
          fingerEl.className = 'tut-finger tut-finger-swipe-x';
          fingerEl.textContent = '👆';
        }
        this.highlightCells([0, 1, 2], 'highlight-row');
        this.boardOps = Array(9).fill(D4.ID);
        if (btnActionText) btnActionText.textContent = '직접 해보기 (2/4)';
        soundEngine.speak('1행 1열을 가로로 쓱 그어보세요!');
        break;

      case 3:
        stepNameEl.textContent = 'STEP 3. 1행 1열 모드 전환 (1행 ↔ 1열)';
        mainTextEl.textContent = '1행 1열 우측 하단의 점을 눌러보세요!';
        if (subTextEl) subTextEl.textContent = '점을 누르면 1행 조작에서 1열 조작 모드로 즉시 전환됩니다.';
        if (fingerEl) {
          fingerEl.style.display = 'block';
          fingerEl.className = 'tut-finger tut-finger-tap';
          fingerEl.textContent = '👉';
        }
        this.highlightCells([0], 'highlight-row');
        if (btnActionText) btnActionText.textContent = '모드 전환 해보기 (3/4)';
        soundEngine.speak('1행 1열 우측 하단의 점을 눌러보세요!');
        break;

      case 4:
        stepNameEl.textContent = 'STEP 4. 군론 행렬 퍼즐 완전 정복 🎉';
        mainTextEl.textContent = '축하합니다! 게임 목표와 군론 원리 마스터!';
        if (subTextEl) subTextEl.textContent = '이제 실전 행렬 큐브 퍼즐에서 0번을 향해 도전하세요!';
        if (boardWrapper) boardWrapper.style.display = 'none';
        if (masterCard) masterCard.style.display = 'block';
        if (btnActionText) btnActionText.textContent = '🎮 실전 퍼즐 시작하기';
        soundEngine.playClear();
        soundEngine.speak('축하합니다! 게임의 목표와 군론 대칭 변환 원리를 마스터하셨습니다!');
        break;
    }

    this.renderBoard();
  }

  private highlightCells(indices: number[], className: string): void {
    indices.forEach((idx) => {
      const cell = document.getElementById(`tut-cell-${idx}`);
      if (cell) cell.classList.add(className);
    });
  }

  private clearCellHighlights(): void {
    for (let i = 0; i < 9; i++) {
      const cell = document.getElementById(`tut-cell-${i}`);
      if (cell) {
        cell.className = 'tut-cell-box';
      }
    }
  }

  public handleGestureStart(x: number, y: number): void {
    this.dragStart = { x, y, time: Date.now() };
  }

  public handleGestureEnd(x: number, y: number, _w: number, h: number): void {
    if (!this.dragStart) return;
    const dx = x - this.dragStart.x;
    const dy = y - this.dragStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const startYRatio = this.dragStart.y / h;
    const isRow1 = startYRatio < 0.45;

    this.dragStart = null;

    if (this.currentStep === 1) {
      this.nextStep();
    } else if (this.currentStep === 2) {
      if ((Math.abs(dx) > 20 && Math.abs(dx) > Math.abs(dy) * 1.1 && isRow1) || (dist < 25 && isRow1)) {
        this.executeStep2Success();
      }
    } else if (this.currentStep === 3) {
      if (dist < 35 && startYRatio < 0.4) {
        this.handleDotClick();
      }
    }
  }

  public executeStep2Success(): void {
    this.boardOps[0] = D4.MX;
    this.boardOps[1] = D4.MX;
    this.boardOps[2] = D4.MX;
    this.renderBoard();
    soundEngine.playFlip();

    if (typeof document !== 'undefined') {
      const formulaCard = document.getElementById('tut-formula-card');
      const formulaBadge = document.getElementById('tut-formula-badge');
      const formulaText = document.getElementById('tut-formula-text');
      const formulaDesc = document.getElementById('tut-formula-desc');
      const btnActionText = document.getElementById('tut-btn-action-text');

      if (formulaBadge) formulaBadge.textContent = '💡 1행 변환 성공!';
      if (formulaText) formulaText.textContent = '1행 가로 대칭 (MX)';
      if (formulaDesc) formulaDesc.textContent = '1행 강아지들이 모두 뒤태(X 뱃지)로 뒤집혔습니다!';
      if (formulaCard) formulaCard.style.display = 'block';
      if (btnActionText) btnActionText.textContent = '모드 전환 배우기 ➔';
    }

    this.clearAutoTimer();
    this.autoTimer = setTimeout(() => {
      if (this.currentStep === 2 && this.isOpen) {
        this.nextStep();
      }
    }, 1500);
  }

  public executeStep3Success(): void {
    this.boardOps[0] = composeOps(D4.MX, D4.MY); // R180
    this.boardOps[3] = D4.MY;
    this.boardOps[6] = D4.MY;
    this.renderBoard();
    soundEngine.playCombo();

    if (typeof document !== 'undefined') {
      const formulaCard = document.getElementById('tut-formula-card');
      const formulaBadge = document.getElementById('tut-formula-badge');
      const formulaText = document.getElementById('tut-formula-text');
      const formulaDesc = document.getElementById('tut-formula-desc');
      const btnActionText = document.getElementById('tut-btn-action-text');

      if (formulaBadge) formulaBadge.textContent = '✨ 1열 모드 전환 성공!';
      if (formulaText) formulaText.textContent = '1행 ↔ 1열 변환 모드 자유자재!';
      if (formulaDesc) formulaDesc.textContent = '점을 눌러 1행과 1열을 언제든 바꿔서 변환할 수 있습니다.';
      if (formulaCard) formulaCard.style.display = 'block';
      if (btnActionText) btnActionText.textContent = '마스터 완료하기 ➔';
    }

    this.clearAutoTimer();
    this.autoTimer = setTimeout(() => {
      if (this.currentStep === 3 && this.isOpen) {
        this.nextStep();
      }
    }, 1600);
  }

  public handleActionClick(): void {
    if (this.currentStep === 1) {
      this.nextStep();
    } else if (this.currentStep === 2) {
      this.executeStep2Success();
    } else if (this.currentStep === 3) {
      this.handleDotClick();
    } else if (this.currentStep === 4) {
      this.completeTutorial();
    }
  }

  public renderBoard(): void {
    if (typeof document === 'undefined') return;
    for (let i = 0; i < 9; i++) {
      const cell = document.getElementById(`tut-cell-${i}`);
      if (!cell) continue;

      const canvas = cell.querySelector('.tut-cell-canvas') as HTMLCanvasElement;
      const badge = cell.querySelector('.tut-cell-badge') as HTMLElement;
      const op = this.boardOps[i] || D4.ID;

      if (canvas && this.imgDogFront && this.imgDogBack) {
        renderDogTileCanvas(canvas, op, this.imgDogFront, this.imgDogBack);
      }

      if (badge) {
        badge.textContent = getBadgeText(op);
        badge.dataset.op = op;
      }
    }
  }
}

let tutorialInstance: TutorialModalController | null = null;

export function showTutorialModal(startStep = 1): TutorialModalController {
  if (!tutorialInstance) {
    tutorialInstance = new TutorialModalController();
  }
  tutorialInstance.open(startStep);
  return tutorialInstance;
}
