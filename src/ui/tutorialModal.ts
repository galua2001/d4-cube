import { D4, D4Op, composeOps } from '../core/group';
import { soundEngine } from '../audio/audioEngine';
import { renderDogTileCanvas } from './tileRenderer';

export const TUTORIAL_STORAGE_KEY = 'matrix_cube_tutorial_completed';

/**
 * 튜토리얼 완료 여부 확인
 */
export function isTutorialCompleted(): boolean {
  try {
    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * 튜토리얼 완료 기록 저장
 */
export function markTutorialCompleted(): void {
  try {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  } catch {
    // LocalStorage 접근 불가 환경 대비
  }
}

/**
 * 세포 상태 직관적 뱃지 텍스트
 */
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
 * 튜토리얼 모달 컨트롤러 클래스
 */
export class TutorialModalController {
  public isOpen = false;
  public currentStep = 1; // 1 ~ 5
  public boardOps: D4Op[] = Array(9).fill(D4.ID);
  public step3SubStep = 1; // 1: 1차 대각선, 2: 2차 대각선(자기상쇄)
  public step4TapCount = 0; // 0 ~ 4
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

  /**
   * 튜토리얼 모달 열기
   */
  public open(startStep = 1): void {
    this.isOpen = true;
    this.currentStep = Math.max(1, Math.min(5, startStep));
    this.step3SubStep = 1;
    this.step4TapCount = 0;
    this.boardOps = Array(9).fill(D4.ID);
    this.clearAutoTimer();

    this.buildDOM();
    this.updateStepUI();
    this.renderBoard();

    // 헤더 버튼의 펄스 애니메이션 제거
    this.removePulse();
    soundEngine.playTap();
  }

  /**
   * 튜토리얼 모달 닫기
   */
  public close(): void {
    this.clearAutoTimer();
    this.isOpen = false;
    const overlay = document.getElementById('tutorial-modal-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
      setTimeout(() => overlay.remove(), 250);
    }
  }

  /**
   * 튜토리얼 건너뛰기
   */
  public skip(): void {
    markTutorialCompleted();
    this.close();
    soundEngine.playTap();
  }

  /**
   * 다음 단계로 진행
   */
  public nextStep(): void {
    this.clearAutoTimer();
    if (this.currentStep < 5) {
      this.currentStep++;
      this.updateStepUI();
      soundEngine.playTap();
    } else {
      this.completeTutorial();
    }
  }

  /**
   * 튜토리얼 완료
   */
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
    const btnNav = document.getElementById('btn-header-tutorial');
    if (btnNav) {
      btnNav.classList.remove('pulse-active');
    }
  }

  /**
   * DOM 동적 생성
   */
  public buildDOM(): void {
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
            <span class="tutorial-header-badge">30초 마스터</span>
            <span class="tutorial-header-title">🎓 대칭 & 회전 연산 튜토리얼</span>
          </div>
          <button id="btn-tut-close" class="tutorial-header-close" title="닫기">✕</button>
        </div>

        <!-- 스텝 프로그레스 바 -->
        <div class="tutorial-steps-bar">
          <div class="tut-step-dot" data-step="1"></div>
          <div class="tut-step-dot" data-step="2"></div>
          <div class="tut-step-dot" data-step="3"></div>
          <div class="tut-step-dot" data-step="4"></div>
          <div class="tut-step-dot" data-step="5"></div>
        </div>

        <!-- 메인 본문 컨텐츠 영역 -->
        <div class="tutorial-body" id="tut-body">
          <!-- 가이드 텍스트 -->
          <div class="tut-guide-box" id="tut-guide-box">
            <div class="tut-guide-step-name" id="tut-step-name">STEP 1. 첫 번째 대칭</div>
            <div class="tut-guide-main-text" id="tut-main-text">1행을 가로(↔)로 쓱 그어보세요!</div>
            <div class="tut-guide-sub-text" id="tut-sub-text">손가락으로 1행 강아지들을 왼쪽에서 오른쪽으로 스와이프하세요.</div>
          </div>

          <!-- 3x3 인터랙티브 보드 -->
          <div class="tut-board-wrapper" id="tut-board-wrapper">
            <div class="tut-board-grid" id="tut-board-grid"></div>
            <!-- 제스처 가이드 레이어 (손가락 및 화살표) -->
            <div class="tut-gesture-layer" id="tut-gesture-layer">
              <div class="tut-finger tut-finger-swipe-x" id="tut-finger">👆</div>
            </div>
          </div>

          <!-- 공식 발견 팝업 카드 (성공 시 노출) -->
          <div class="tut-formula-card" id="tut-formula-card" style="display: none;">
            <span class="tut-formula-badge" id="tut-formula-badge">💡 연산 공식 발견</span>
            <div class="tut-formula-text" id="tut-formula-text">MX + MY = R180</div>
            <div class="tut-formula-desc" id="tut-formula-desc">가로 대칭 후 세로 대칭을 적용하면 180° 회전이 됩니다!</div>
          </div>

          <!-- 스텝 5 최종 마스터 카드 (스텝 5에서만 노출) -->
          <div class="tut-master-card" id="tut-master-card" style="display: none;">
            <div class="tut-master-badge-icon">🏆</div>
            <div class="tut-master-title">군론 대칭 연산 완전 정복!</div>
            <p style="font-size:0.88rem; color:#94a3b8; margin:0 0 10px 0;">대칭과 회전의 핵심 연산 관계를 모두 습득하셨습니다.</p>
            <div class="tut-rules-summary-list">
              <div class="tut-rule-item"><span>1️⃣</span> <span><b>MX + MY = R180</b> : 직교 대칭 2번 합성은 180° 회전</span></div>
              <div class="tut-rule-item"><span>2️⃣</span> <span><b>S² = ID (자기상쇄)</b> : 대칭 연산은 2번 반복하면 제자리</span></div>
              <div class="tut-rule-item"><span>3️⃣</span> <span><b>R⁴ = ID (4주기)</b> : 90° 회전은 4번 누적 시 360° 원상복구</span></div>
            </div>
          </div>
        </div>

        <!-- 하단 컨트롤 버튼 바 -->
        <div class="tutorial-footer">
          <button id="btn-tut-skip" class="tut-btn-skip">건너뛰기</button>
          <button id="btn-tut-action" class="tut-btn-action">
            <span id="tut-btn-action-text">다음 단계 (1/5) ➔</span>
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

        const badge = document.createElement('span');
        badge.className = 'tut-cell-badge';
        badge.textContent = '0';
        cell.appendChild(badge);

        grid.appendChild(cell);
      }
    }

    this.bindEvents();
  }

  private bindEvents(): void {
    const overlay = document.getElementById('tutorial-modal-overlay');
    const btnClose = document.getElementById('btn-tut-close');
    const btnSkip = document.getElementById('btn-tut-skip');
    const btnAction = document.getElementById('btn-tut-action');
    const boardWrapper = document.getElementById('tut-board-wrapper');

    btnClose?.addEventListener('click', () => this.close());
    btnSkip?.addEventListener('click', () => this.skip());
    btnAction?.addEventListener('click', () => this.handleActionClick());

    // 배경 클릭 시 닫기 (카드 외 영역)
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
      }
    });

    // 터치 및 마우스 제스처 이벤트
    if (boardWrapper) {
      // 터치 제스처
      boardWrapper.addEventListener(
        'touchstart',
        (e: TouchEvent) => {
          if (e.touches && e.touches.length > 0) {
            e.preventDefault();
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

      // 마우스 제스처
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

  /**
   * 스텝별 UI 갱신
   */
  public updateStepUI(): void {
    const step = this.currentStep;

    // 1. 프로그레스 바 상태 갱신
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
        stepNameEl.textContent = 'STEP 1. 첫 번째 대칭 (가로 뒤집기)';
        mainTextEl.textContent = '1행을 가로(↔)로 쓱 그어보세요!';
        if (subTextEl) subTextEl.textContent = '손가락으로 1행 강아지들을 가로질러 스와이프하세요.';
        if (fingerEl) {
          fingerEl.className = 'tut-finger tut-finger-swipe-x';
          fingerEl.textContent = '👆';
        }
        this.highlightCells([0, 1, 2], 'highlight-row');
        this.boardOps = Array(9).fill(D4.ID);
        if (btnActionText) btnActionText.textContent = '직접 해보기 (1/5)';
        soundEngine.speak('1행을 가로로 쓱 그어보세요!');
        break;

      case 2:
        stepNameEl.textContent = 'STEP 2. 두 번째 대칭 ➔ 회전 탄생!';
        mainTextEl.textContent = '이번엔 1행을 세로(↕)로 한 번 더 그어보세요!';
        if (subTextEl) subTextEl.textContent = '가로로 뒤집힌 1행을 위아래로 쓱 그어 세로 대칭(MY)을 줍니다.';
        if (fingerEl) {
          fingerEl.className = 'tut-finger tut-finger-swipe-y';
          fingerEl.textContent = '👆';
        }
        this.highlightCells([0, 1, 2], 'highlight-row');
        if (btnActionText) btnActionText.textContent = '직접 해보기 (2/5)';
        soundEngine.speak('이번엔 1행을 세로로 한 번 더 그어보세요!');
        break;

      case 3:
        this.step3SubStep = 1;
        this.boardOps = Array(9).fill(D4.ID);
        stepNameEl.textContent = 'STEP 3. 대칭의 자기상쇄 (2번 = 제자리)';
        mainTextEl.textContent = '주대각선(↖ ➔ ↘) 방향으로 그어보세요!';
        if (subTextEl) subTextEl.textContent = '좌상단에서 우하단 대각선으로 시원하게 그어보세요.';
        if (fingerEl) {
          fingerEl.className = 'tut-finger tut-finger-swipe-diag';
          fingerEl.textContent = '👆';
        }
        this.highlightCells([0, 4, 8], 'highlight-diag');
        if (btnActionText) btnActionText.textContent = '직접 해보기 (3/5)';
        soundEngine.speak('주대각선 방향으로 그어보세요!');
        break;

      case 4:
        this.step4TapCount = 0;
        this.boardOps = Array(9).fill(D4.ID);
        stepNameEl.textContent = 'STEP 4. 탭 회전의 4주기 (360° 제자리)';
        mainTextEl.textContent = '중앙 타일을 콕 탭해보세요! (0/4회)';
        if (subTextEl) subTextEl.textContent = '중앙 강아지를 탭할 때마다 90°씩 순환 회전합니다.';
        if (fingerEl) {
          fingerEl.className = 'tut-finger tut-finger-tap';
          fingerEl.textContent = '👉';
        }
        this.highlightCells([4], 'highlight-center');
        if (btnActionText) btnActionText.textContent = '직접 해보기 (4/5)';
        soundEngine.speak('중앙 타일을 콕 탭해보세요!');
        break;

      case 5:
        stepNameEl.textContent = 'STEP 5. 마스터 인증 완료 🎉';
        mainTextEl.textContent = '축하합니다! 대칭과 회전 연산 마스터!';
        if (subTextEl) subTextEl.textContent = '이제 실전 행렬 큐브 퍼즐에서 놀라운 실력을 발휘해 보세요!';
        if (boardWrapper) boardWrapper.style.display = 'none';
        if (masterCard) masterCard.style.display = 'block';
        if (btnActionText) btnActionText.textContent = '🎮 실전 퍼즐 시작하기';
        soundEngine.playClear();
        soundEngine.speak('축하합니다! 대칭과 회전 연산을 마스터하셨습니다!');
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

  /**
   * 제스처 시작
   */
  public handleGestureStart(x: number, y: number): void {
    this.dragStart = { x, y, time: Date.now() };
  }

  /**
   * 제스처 판정 및 성공 액션 실행
   */
  public handleGestureEnd(x: number, y: number, w: number, h: number): void {
    if (!this.dragStart) return;
    const dx = x - this.dragStart.x;
    const dy = y - this.dragStart.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const startYRatio = this.dragStart.y / h;
    const startXRatio = this.dragStart.x / w;
    const isRow1 = startYRatio < 0.42;

    this.dragStart = null;

    if (this.currentStep === 1) {
      if ((Math.abs(dx) > 25 && Math.abs(dx) > Math.abs(dy) * 1.1 && isRow1) || (dist < 25 && isRow1)) {
        this.executeStep1Success();
      }
    } else if (this.currentStep === 2) {
      if ((Math.abs(dy) > 20 && isRow1) || (dist < 25 && isRow1)) {
        this.executeStep2Success();
      }
    } else if (this.currentStep === 3) {
      if ((dx > 20 && dy > 20) || dist < 25) {
        this.executeStep3Success();
      }
    } else if (this.currentStep === 4) {
      if (dist < 35 && startXRatio > 0.25 && startXRatio < 0.75 && startYRatio > 0.25 && startYRatio < 0.75) {
        this.executeStep4Tap();
      }
    }
  }

  /**
   * STEP 1 성공 처리 (가로 대칭 MX)
   */
  public executeStep1Success(): void {
    this.boardOps[0] = D4.MX;
    this.boardOps[1] = D4.MX;
    this.boardOps[2] = D4.MX;
    this.renderBoard();
    soundEngine.playFlip();

    const formulaCard = document.getElementById('tut-formula-card');
    const formulaBadge = document.getElementById('tut-formula-badge');
    const formulaText = document.getElementById('tut-formula-text');
    const formulaDesc = document.getElementById('tut-formula-desc');
    const btnActionText = document.getElementById('tut-btn-action-text');

    if (formulaBadge) formulaBadge.textContent = '💡 1단계 완료: 가로 대칭';
    if (formulaText) formulaText.textContent = '앞면 (0) ➔ 뒤태 (X)';
    if (formulaDesc) formulaDesc.textContent = '가로(↔)로 그으니 1행 강아지들이 뒤태(X 뱃지)로 뒤집혔습니다!';
    if (formulaCard) formulaCard.style.display = 'block';
    if (btnActionText) btnActionText.textContent = '다음 연산 배우기 ➔';

    this.clearAutoTimer();
    this.autoTimer = setTimeout(() => {
      if (this.currentStep === 1 && this.isOpen) {
        this.nextStep();
      }
    }, 1600);
  }

  /**
   * STEP 2 성공 처리 (가로 대칭 + 세로 대칭 = 180도 회전)
   */
  public executeStep2Success(): void {
    const combined = composeOps(D4.MX, D4.MY); // D4.R180
    this.boardOps[0] = combined;
    this.boardOps[1] = combined;
    this.boardOps[2] = combined;
    this.renderBoard();
    soundEngine.playCombo();

    const formulaCard = document.getElementById('tut-formula-card');
    const formulaBadge = document.getElementById('tut-formula-badge');
    const formulaText = document.getElementById('tut-formula-text');
    const formulaDesc = document.getElementById('tut-formula-desc');
    const btnActionText = document.getElementById('tut-btn-action-text');

    if (formulaBadge) formulaBadge.textContent = '✨ 대박 공식 발견!';
    if (formulaText) formulaText.textContent = 'MX (가로 대칭) + MY (세로 대칭) = R180 (180° 회전)';
    if (formulaDesc) formulaDesc.textContent = '두 번 뒤집으니 회전이 탄생했습니다! (뒤태 ➔ 180° 거꾸로 선 앞면)';
    if (formulaCard) formulaCard.style.display = 'block';
    if (btnActionText) btnActionText.textContent = '대칭 자기상쇄 배우기 ➔';

    this.clearAutoTimer();
    this.autoTimer = setTimeout(() => {
      if (this.currentStep === 2 && this.isOpen) {
        this.nextStep();
      }
    }, 2000);
  }

  /**
   * STEP 3 성공 처리 (대각선 대칭 자기상쇄: MD^2 = ID)
   */
  public executeStep3Success(): void {
    const mainTextEl = document.getElementById('tut-main-text');
    const subTextEl = document.getElementById('tut-sub-text');
    const formulaCard = document.getElementById('tut-formula-card');
    const formulaBadge = document.getElementById('tut-formula-badge');
    const formulaText = document.getElementById('tut-formula-text');
    const formulaDesc = document.getElementById('tut-formula-desc');
    const btnActionText = document.getElementById('tut-btn-action-text');

    if (this.step3SubStep === 1) {
      // 1차 대각선 대칭 적용
      [0, 4, 8].forEach((i) => {
        this.boardOps[i] = D4.MD;
      });
      this.renderBoard();
      soundEngine.playFlip();

      this.step3SubStep = 2;
      if (mainTextEl) mainTextEl.textContent = '한 번 더 같은 주대각선(↖ ➔ ↘)을 그어보세요!';
      if (subTextEl) subTextEl.textContent = '대각선 대칭을 한 번 더 적용하면 어떻게 될까요?';
    } else {
      // 2차 대각선 대칭 적용 ➔ S^2 = ID 원상복구
      [0, 4, 8].forEach((i) => {
        this.boardOps[i] = composeOps(D4.MD, D4.MD); // D4.ID
      });
      this.renderBoard();
      soundEngine.playClear();

      if (formulaBadge) formulaBadge.textContent = '✨ 자기상쇄 공식 발견!';
      if (formulaText) formulaText.textContent = 'S² = ID (대칭 2회 = 원래대로 복구)';
      if (formulaDesc) formulaDesc.textContent = '모든 대칭 연산은 2번 누적되면 0번 원본으로 완벽 복원됩니다!';
      if (formulaCard) formulaCard.style.display = 'block';
      if (btnActionText) btnActionText.textContent = '회전 주기 배우기 ➔';

      this.clearAutoTimer();
      this.autoTimer = setTimeout(() => {
        if (this.currentStep === 3 && this.isOpen) {
          this.nextStep();
        }
      }, 2000);
    }
  }

  /**
   * STEP 4 탭 회전 처리 (R90 -> R180 -> R270 -> ID 4주기)
   */
  public executeStep4Tap(): void {
    this.step4TapCount++;
    const count = this.step4TapCount;
    const mainTextEl = document.getElementById('tut-main-text');
    const subTextEl = document.getElementById('tut-sub-text');
    const formulaCard = document.getElementById('tut-formula-card');
    const formulaBadge = document.getElementById('tut-formula-badge');
    const formulaText = document.getElementById('tut-formula-text');
    const formulaDesc = document.getElementById('tut-formula-desc');
    const btnActionText = document.getElementById('tut-btn-action-text');

    const cycleOps: D4Op[] = [D4.ID, D4.R90, D4.R180, D4.R270, D4.ID];
    const currentOp = cycleOps[count % 5];
    this.boardOps[4] = currentOp;
    this.renderBoard();

    if (count < 4) {
      soundEngine.playTap();
      if (mainTextEl) mainTextEl.textContent = `중앙 타일을 콕 탭해보세요! (${count}/4회)`;
      const degrees = count * 90;
      if (subTextEl) subTextEl.textContent = `현재 상태: ${degrees}° 회전 (${getBadgeText(currentOp)} 뱃지)`;
    } else {
      soundEngine.playClear();
      if (mainTextEl) mainTextEl.textContent = '중앙 타일 4회 탭 완료! (4/4회)';
      if (subTextEl) subTextEl.textContent = '360° 한 바퀴 돌아 완벽한 원본(0 뱃지)으로 복구되었습니다!';

      if (formulaBadge) formulaBadge.textContent = '✨ 4주기 순환 공식 발견!';
      if (formulaText) formulaText.textContent = 'R⁴ = ID (90° 회전 4회 = 360° 원상복구)';
      if (formulaDesc) formulaDesc.textContent = '90도 회전은 4번 누적되면 제자리로 돌아오는 순환군(C₄)입니다!';
      if (formulaCard) formulaCard.style.display = 'block';
      if (btnActionText) btnActionText.textContent = '마스터 완료하기 ➔';

      this.clearAutoTimer();
      this.autoTimer = setTimeout(() => {
        if (this.currentStep === 4 && this.isOpen) {
          this.nextStep();
        }
      }, 2000);
    }
  }

  /**
   * 하단 액션 버튼 클릭 핸들러 (사용자가 터치/제스처를 하지 않아도 자동 진행/시연)
   */
  public handleActionClick(): void {
    this.clearAutoTimer();

    if (this.currentStep === 1) {
      this.executeStep1Success();
    } else if (this.currentStep === 2) {
      this.executeStep2Success();
    } else if (this.currentStep === 3) {
      this.executeStep3Success();
    } else if (this.currentStep === 4) {
      if (this.step4TapCount < 4) {
        this.executeStep4Tap();
      } else {
        this.nextStep();
      }
    } else if (this.currentStep === 5) {
      this.completeTutorial();
    }
  }

  /**
   * 3x3 보드 렌더링
   */
  public renderBoard(): void {
    for (let i = 0; i < 9; i++) {
      const cell = document.getElementById(`tut-cell-${i}`);
      if (!cell) continue;

      const canvas = cell.querySelector('.tut-cell-canvas') as HTMLCanvasElement;
      const badge = cell.querySelector('.tut-cell-badge');
      const op = this.boardOps[i] || D4.ID;

      if (canvas && this.imgDogFront && this.imgDogBack) {
        renderDogTileCanvas(canvas, op, this.imgDogFront, this.imgDogBack);
      }

      if (badge) {
        badge.textContent = getBadgeText(op);
      }
    }
  }
}

// 싱글톤 인스턴스
export const tutorialController = new TutorialModalController();

/**
 * 전역 튜토리얼 모달 노출 함수
 */
export function showTutorialModal(startStep = 1): void {
  tutorialController.open(startStep);
}
