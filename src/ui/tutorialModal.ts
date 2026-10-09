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
 * 끊김 없는 슬라이드형 튜토리얼 뷰어 (수학적 4단계):
 * STEP 1. 퍼즐의 목표 & 행렬 성분 구조
 * STEP 2. 성분별 행렬 변환 원리 (행 변환 & 열 변환)
 * STEP 3. 군론의 핵심 원리: 반사 + 반사 = 회전 (V4 클라인 4원군)
 * STEP 4. 완전한 대칭 군 D4와 마스터
 */
export class TutorialModalController {
  public isOpen = false;
  public currentStep = 1; // 1 ~ 4
  public boardOps: D4Op[] = Array(9).fill(D4.ID);
  public cell11Mode: 'row' | 'col' = 'row';

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
    this.cell11Mode = 'row';
    this.buildDOM();
    this.goToStep(Math.max(1, Math.min(4, startStep)), false);
    this.removePulse();
    soundEngine.playTap();
  }

  public close(): void {
    this.isOpen = false;
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

  public prevStep(): void {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  }

  public nextStep(): void {
    if (this.currentStep < 4) {
      this.goToStep(this.currentStep + 1);
    } else {
      this.completeTutorial();
    }
  }

  public goToStep(step: number, playSound = true): void {
    this.currentStep = Math.max(1, Math.min(4, step));
    this.applyStepState(this.currentStep);
    this.updateStepUI();
    this.renderBoard();
    if (playSound) {
      soundEngine.playTap();
    }
  }

  public completeTutorial(): void {
    markTutorialCompleted();
    this.close();
    soundEngine.playWin();
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
            <span class="tutorial-header-badge">군론 튜토리얼</span>
            <span class="tutorial-header-title">🎓 행렬 대칭 변환 가이드</span>
          </div>
          <button id="btn-tut-close" class="tutorial-header-close" title="닫기">✕</button>
        </div>

        <!-- 스텝 탭 / 프로그레스 바 -->
        <div class="tutorial-steps-bar" id="tut-steps-bar">
          <div class="tut-step-dot" data-step="1" title="1단계: 게임 목표 & 행렬 구조"></div>
          <div class="tut-step-dot" data-step="2" title="2단계: 성분별 변환 원리"></div>
          <div class="tut-step-dot" data-step="3" title="3단계: 반사+반사=회전 (V4)"></div>
          <div class="tut-step-dot" data-step="4" title="4단계: 완전한 대칭 군 D4"></div>
        </div>

        <!-- 메인 본문 컨텐츠 영역 -->
        <div class="tutorial-body" id="tut-body">
          <!-- 가이드 텍스트 -->
          <div class="tut-guide-box" id="tut-guide-box">
            <div class="tut-guide-step-name" id="tut-step-name">STEP 1. 퍼즐의 목표 & 행렬 성분 구조</div>
            <div class="tut-guide-main-text" id="tut-main-text">뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키기</div>
            <div class="tut-guide-sub-text" id="tut-sub-text">뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키는 것이 목표입니다! 3×3 행렬의 각 성분(1~3행, 1~3열)이 해당 라인의 대칭 변환을 이끄는 컨트롤러 역할을 합니다.</div>
          </div>

          <!-- 3x3 자동 시연 보드 -->
          <div class="tut-board-wrapper" id="tut-board-wrapper">
            <div class="tut-board-grid" id="tut-board-grid"></div>
          </div>

          <!-- 공식 설명 카드 -->
          <div class="tut-formula-card" id="tut-formula-card" style="display: none;">
            <span class="tut-formula-badge" id="tut-formula-badge">💡 성분별 대칭 변환</span>
            <div class="tut-formula-text" id="tut-formula-text">1행 가로 반사 (MX)</div>
            <div class="tut-formula-desc" id="tut-formula-desc">1행 성분들이 가로 반사로 일제히 뒤집힙니다.</div>
          </div>

          <!-- 스텝 4 최종 마스터 카드 -->
          <div class="tut-master-card" id="tut-master-card" style="display: none;">
            <div class="tut-master-badge-icon">🏆</div>
            <div class="tut-master-title">군론 행렬 퍼즐 완전 정복!</div>
            <p style="font-size:0.88rem; color:#94a3b8; margin:0 0 10px 0;">게임의 목표와 D4 정이면체군 대칭 변환 원리를 모두 마스터하셨습니다.</p>
            <div class="tut-rules-summary-list">
              <div class="tut-rule-item"><span>🎯</span> <span><b>게임 목표</b> : 뒤섞인 모든 타일을 <b>0번(항등원·정위치 앞면)</b>으로 완성</span></div>
              <div class="tut-rule-item"><span>📐</span> <span><b>행렬 성분 컨트롤</b> : 3×3 각 라인(행·열)을 선택하여 라인 전체 대칭 변환</span></div>
              <div class="tut-rule-item"><span>🔄</span> <span><b>1행 1열 점(Dot)</b> : 점 클릭으로 1행 조작 ↔ 1열 조작 모드 자유 전환</span></div>
              <div class="tut-rule-item"><span>⚡</span> <span><b>반사 + 반사 = 회전</b> : MX ∘ MY = R180 (클라인 4원군 V4)</span></div>
              <div class="tut-rule-item"><span>🌌</span> <span><b>8차 정이면체군 D4</b> : 회전 4종(0°, 90°, 180°, 270°) + 반사 4종(MX, MY, MD, MAD)</span></div>
            </div>
          </div>
        </div>

        <!-- 하단 슬라이드 네비게이션 버튼 바 -->
        <div class="tutorial-footer">
          <button id="btn-tut-skip" class="tut-btn-skip">닫기</button>
          <div class="tut-footer-nav">
            <button id="btn-tut-prev" class="tut-btn-prev" style="display: none;">◀ 이전</button>
            <button id="btn-tut-action" class="tut-btn-action">
              <span id="tut-btn-action-text">다음 (1/4) ➔</span>
            </button>
          </div>
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
          guideTag.innerText = this.cell11Mode === 'col' ? '1열' : '1행';
          cell.appendChild(guideTag);

          const dot = document.createElement('div');
          dot.className = `dot-toggle-11 ${this.cell11Mode === 'col' ? 'col-mode' : ''}`;
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

  public handleDotClick(): void {
    this.cell11Mode = this.cell11Mode === 'row' ? 'col' : 'row';
    if (typeof document !== 'undefined') {
      const tag = document.getElementById('tut-guide-tag-11');
      const dot = document.getElementById('tut-dot-11');
      if (tag) {
        tag.innerText = this.cell11Mode === 'col' ? '1열' : '1행';
        tag.className = `controller-guide-label ${this.cell11Mode === 'col' ? 'guide-col' : 'guide-row'}`;
      }
      if (dot) {
        dot.classList.toggle('col-mode', this.cell11Mode === 'col');
      }
    }
    soundEngine.playTap();
  }

  public bindEvents(): void {
    const btnClose = document.getElementById('btn-tut-close');
    const btnSkip = document.getElementById('btn-tut-skip');
    const btnPrev = document.getElementById('btn-tut-prev');
    const btnAction = document.getElementById('btn-tut-action');

    if (btnClose) btnClose.addEventListener('click', () => this.close());
    if (btnSkip) btnSkip.addEventListener('click', () => this.skip());
    if (btnPrev) btnPrev.addEventListener('click', () => this.prevStep());
    if (btnAction) btnAction.addEventListener('click', () => this.nextStep());

    // 상단 스텝 프로그레스 도트 클릭 시 해당 단계로 즉시 점프
    document.querySelectorAll('.tut-step-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const s = parseInt((dot as HTMLElement).dataset.step || '1', 10);
        if (s >= 1 && s <= 4) {
          this.goToStep(s);
        }
      });
    });
  }

  /**
   * 단계별 보드 상태 설정 (자동 시연 데이터 적용)
   */
  public applyStepState(step: number): void {
    switch (step) {
      case 1:
        // 1단계: 뒤섞인 타일 상태
        this.boardOps = [D4.MX, D4.R90, D4.MY, D4.ID, D4.R180, D4.MX, D4.MY, D4.ID, D4.R90];
        break;
      case 2:
        // 2단계: 1행 성분들이 가로 반사(MX)로 변환된 상태
        this.executeStep2Success();
        break;
      case 3:
        // 3단계: 1행(MX)과 1열(MY)이 만나 1행 1열이 R180으로 합성된 상태
        this.executeStep3Success();
        break;
      case 4:
        // 4단계: 모든 타일이 0번(항등원·완성) 상태
        this.boardOps = Array(9).fill(D4.ID);
        break;
    }
  }

  public executeStep2Success(): void {
    this.boardOps = [
      D4.MX, D4.MX, D4.MX,
      D4.ID, D4.ID, D4.ID,
      D4.ID, D4.ID, D4.ID
    ];
  }

  public executeStep3Success(): void {
    // 가로 반사(MX) + 세로 반사(MY) = 180도 회전(R180)
    this.boardOps = [
      composeOps(D4.MX, D4.MY), D4.MX, D4.MX,
      D4.MY,                    D4.ID, D4.ID,
      D4.MY,                    D4.ID, D4.ID
    ];
  }

  public updateStepUI(): void {
    if (typeof document === 'undefined') return;
    const step = this.currentStep;

    // 상단 도트 활성화 상태 갱신
    document.querySelectorAll('.tut-step-dot').forEach((dot) => {
      const s = parseInt((dot as HTMLElement).dataset.step || '1', 10);
      dot.classList.toggle('active', s === step);
      dot.classList.toggle('completed', s < step);
    });

    const stepNameEl = document.getElementById('tut-step-name');
    const mainTextEl = document.getElementById('tut-main-text');
    const subTextEl = document.getElementById('tut-sub-text');
    const formulaCard = document.getElementById('tut-formula-card');
    const formulaBadge = document.getElementById('tut-formula-badge');
    const formulaText = document.getElementById('tut-formula-text');
    const formulaDesc = document.getElementById('tut-formula-desc');
    const masterCard = document.getElementById('tut-master-card');
    const boardWrapper = document.getElementById('tut-board-wrapper');
    const btnPrev = document.getElementById('btn-tut-prev');
    const btnActionText = document.getElementById('tut-btn-action-text');

    if (!stepNameEl || !mainTextEl || !subTextEl) return;

    this.clearCellHighlights();

    // 이전 버튼 토글 (1단계일 때는 숨김)
    if (btnPrev) {
      btnPrev.style.display = step > 1 ? 'block' : 'none';
    }

    switch (step) {
      case 1:
        stepNameEl.textContent = 'STEP 1. 게임의 목표 & 행렬 성분 구조';
        mainTextEl.textContent = "뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키기";
        subTextEl.textContent = "뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키는 것이 목표입니다! 3×3 행렬의 각 성분(1~3행, 1~3열)이 해당 라인의 대칭 변환을 이끄는 컨트롤러 역할을 합니다.";
        if (formulaCard) formulaCard.style.display = 'none';
        if (masterCard) masterCard.style.display = 'none';
        if (boardWrapper) boardWrapper.style.display = 'block';
        if (btnActionText) btnActionText.textContent = '다음 (1/4) ➔';
        soundEngine.speak('모든 타일을 0번 정위치 앞면으로 일치시키는 것이 게임의 최종 목표입니다. 3행 3열 행렬의 각 성분이 대칭 변환을 이끕니다.');
        break;

      case 2:
        stepNameEl.textContent = 'STEP 2. 성분별 행렬 변환 원리';
        mainTextEl.textContent = '1행 성분을 조작하면 1행 전체가 가로 반사(MX)로 일제히 반전!';
        subTextEl.textContent = '1행 성분을 조작하면 1행 전체가 가로 반사(MX)로 일제히 뒤집힙니다! 특히 1행 1열의 점(Dot)을 누르면 1행과 1열 조작 모드가 자유롭게 전환되어 행과 열을 모두 컨트롤할 수 있습니다.';
        this.highlightCells([0, 1, 2], 'highlight-row');
        if (formulaCard) {
          formulaCard.style.display = 'block';
          if (formulaBadge) formulaBadge.textContent = '💡 성분별 대칭 변환';
          if (formulaText) formulaText.textContent = '1행 가로 반사 (MX)';
          if (formulaDesc) formulaDesc.textContent = '1행의 모든 성분이 가로 반사되어 일제히 뒷면(X 뱃지)으로 뒤집힙니다.';
        }
        if (masterCard) masterCard.style.display = 'none';
        if (boardWrapper) boardWrapper.style.display = 'block';
        if (btnActionText) btnActionText.textContent = '다음 (2/4) ➔';
        soundEngine.speak('1행을 조작하면 1행 성분들이 가로 반사로 일제히 뒤집히며, 1행 1열의 점으로 행과 열 조작 모드를 전환할 수 있습니다.');
        break;

      case 3:
        stepNameEl.textContent = 'STEP 3. 반사 + 반사 = 회전 (V4 클라인 4원군)';
        mainTextEl.textContent = '반사와 반사가 연속으로 만나면 180° 회전이 탄생합니다!';
        subTextEl.textContent = "거울 반사(가로 대칭 MX)와 세로 반사(MY)가 연속으로 만나면, 뒷면이 다시 앞면으로 돌아오면서 180도 회전(R180)이 탄생합니다! (MX ∘ MY = R180)\n이 4가지 원소 {항등 0, MX, MY, R180}는 수학적으로 교환법칙이 성립하는 아름다운 '클라인 4원군(V4)' 부분군을 형성합니다.";
        this.highlightCells([0], 'highlight-center');
        this.highlightCells([1, 2], 'highlight-row');
        this.highlightCells([3, 6], 'highlight-row');
        if (formulaCard) {
          formulaCard.style.display = 'block';
          if (formulaBadge) formulaBadge.textContent = '✨ 반사 + 반사 = 회전 (V4 군론)';
          if (formulaText) formulaText.textContent = 'MX ∘ MY = R180 (클라인 4원군)';
          if (formulaDesc) formulaDesc.textContent = '가로 반사 후 세로 반사를 적용하면 앞면으로 복원되며 180° 회전이 합성됩니다.';
        }
        if (masterCard) masterCard.style.display = 'none';
        if (boardWrapper) boardWrapper.style.display = 'block';
        if (btnActionText) btnActionText.textContent = '다음 (3/4) ➔';
        soundEngine.speak('가로 반사와 세로 반사가 만나면 앞면으로 복원되며 180도 회전이 탄생합니다. 이는 반사끼리 만나면 회전이 되는 군론과 클라인 4원군의 원리입니다.');
        break;

      case 4:
        stepNameEl.textContent = 'STEP 4. 완전한 대칭 군 D4와 마스터';
        mainTextEl.textContent = '8차 정이면체군 D4를 마스터하고 실전 퍼즐에 도전하세요!';
        subTextEl.textContent = "회전 4가지(0°, 90°, 180°, 270°)와 반사 4가지(가로 MX, 세로 MY, 주대각선 MD, 역대각선 MAD)가 모여 총 8가지 대칭을 이루는 '8차 정이면체군 D4'를 완성합니다! 이 대칭 규칙을 활용하여 최소 횟수로 모든 타일을 0번으로 맞춰보세요!";
        if (formulaCard) formulaCard.style.display = 'none';
        if (boardWrapper) boardWrapper.style.display = 'none';
        if (masterCard) masterCard.style.display = 'block';
        if (btnActionText) btnActionText.textContent = '🎮 실전 퍼즐 시작하기';
        soundEngine.playClear();
        soundEngine.speak('회전 4가지와 반사 4가지가 모여 정이면체군 D4를 완성합니다. 이제 실전 큐브에 도전해 보세요!');
        break;
    }
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
