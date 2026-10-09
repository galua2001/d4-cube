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

export interface ExampleMoveStep {
  subStep: number;
  label: string;
  boardOps: D4Op[];
  highlightCells: number[];
  formulaBadge: string;
  formulaText: string;
  formulaDesc: string;
}

/**
 * STEP 5. V4 클라인 4원군 4수 최단 해법 데이터
 * 초기 상태: [R180, R180, MX / MY, MY, ID / R180, R180, MX]
 * 1수: 3행 R180 (3행 1열 타일 더블 탭 👆👆)
 * 2수: 3열 MY (1행 3열 타일 세로 밀기 ↕)
 * 3수: 2행 MY (2행 1열 타일 세로 밀기 ↕)
 * 4수: 1행 R180 (1행 1열 타일 더블 탭 👆👆) -> 전체 0번 완성
 */
export const V4_EXAMPLE_STEPS: ExampleMoveStep[] = [
  {
    subStep: 0,
    label: '초기',
    boardOps: [
      D4.R180, D4.R180, D4.MX,
      D4.MY,   D4.MY,   D4.ID,
      D4.R180, D4.R180, D4.MX
    ],
    highlightCells: [],
    formulaBadge: '🧩 V4 실전 문제',
    formulaText: 'V4 클라인 4원군 스크램블',
    formulaDesc: '반사와 회전의 대칭 상쇄를 이용해 4수 만에 모든 타일을 0번으로 맞춥니다.'
  },
  {
    subStep: 1,
    label: '1수',
    boardOps: [
      D4.R180, D4.R180, D4.MX,
      D4.MY,   D4.MY,   D4.ID,
      D4.ID,   D4.ID,   D4.MY
    ],
    highlightCells: [6, 7, 8],
    formulaBadge: '⚡ 1수: 3행 R180 (👆👆 3행 타일 더블 탭)',
    formulaText: '3행 R180 (180° 회전 합성)',
    formulaDesc: '3행의 R180 타일 2개가 R180² = ID(0번)로 상쇄되고, MX는 MY로 변환됩니다.'
  },
  {
    subStep: 2,
    label: '2수',
    boardOps: [
      D4.R180, D4.R180, D4.R180,
      D4.MY,   D4.MY,   D4.MY,
      D4.ID,   D4.ID,   D4.ID
    ],
    highlightCells: [2, 5, 8],
    formulaBadge: '⚡ 2수: 3열 MY (↕ 3열 타일 세로 스와이프)',
    formulaText: '3열 MY (세로 반사)',
    formulaDesc: '3열의 MX 타일이 MY와 만나 R180으로 합성(MX ∘ MY = R180)되고, 3행 타일은 MY² = ID로 복원!'
  },
  {
    subStep: 3,
    label: '3수',
    boardOps: [
      D4.R180, D4.R180, D4.R180,
      D4.ID,   D4.ID,   D4.ID,
      D4.ID,   D4.ID,   D4.ID
    ],
    highlightCells: [3, 4, 5],
    formulaBadge: '⚡ 3수: 2행 MY (↕ 2행 타일 세로 스와이프)',
    formulaText: '2행 MY (세로 반사 상쇄)',
    formulaDesc: '2행의 모든 MY 타일이 MY² = ID(0번)로 일제히 상쇄되어 정위치 앞면이 됩니다!'
  },
  {
    subStep: 4,
    label: '4수 (완성)',
    boardOps: [
      D4.ID, D4.ID, D4.ID,
      D4.ID, D4.ID, D4.ID,
      D4.ID, D4.ID, D4.ID
    ],
    highlightCells: [0, 1, 2],
    formulaBadge: '🎉 4수: 1행 R180 (👆👆 1행 타일 더블 탭)',
    formulaText: '1행 R180 (R180² = ID 상쇄)',
    formulaDesc: '1행의 R180 타일 3개가 일제히 ID(0번)로 상쇄되어 4수 만에 전체 완료!'
  }
];

/**
 * STEP 6. D4 정이면체군 5수 묘수 풀이 데이터
 * 초기 상태: [MX, MAD, MD / ID, R90, MY / R180, MY, R270]
 * 1수: 1행 R90 (1행 1열 타일 한 번 탭 👆)
 * 2수: 3행 R180 (3행 1열 타일 더블 탭 👆👆)
 * 3수: 3열 MY (1행 3열 타일 세로 밀기 ↕)
 * 4수: ↖ 주대각선 MD (우측하단 타일 대각선 밀기 ↘)
 * 5수: 2열 MX (1행 2열 타일 가로 밀기 ↔) -> 전체 0번 완성
 */
export const D4_EXAMPLE_STEPS: ExampleMoveStep[] = [
  {
    subStep: 0,
    label: '초기',
    boardOps: [
      D4.MX,   D4.MAD, D4.MD,
      D4.ID,   D4.R90, D4.MY,
      D4.R180, D4.MY,  D4.R270
    ],
    highlightCells: [],
    formulaBadge: '🧩 D4 실전 묘수 문제',
    formulaText: '8차 정이면체군 복합 스크램블',
    formulaDesc: '대각선 반사와 회전이 얽힌 고난도 퍼즐의 수학적 5수 최단 해법입니다.'
  },
  {
    subStep: 1,
    label: '1수',
    boardOps: [
      D4.MD,   D4.MX,  D4.MY,
      D4.ID,   D4.R90, D4.MY,
      D4.R180, D4.MY,  D4.R270
    ],
    highlightCells: [0, 1, 2],
    formulaBadge: '⚡ 1수: 1행 R90 (👆 1행 타일 1회 탭)',
    formulaText: '1행 R90 (90° 시계 회전)',
    formulaDesc: '1행의 MX, MAD, MD 성분들이 R90과 결합하여 MD, MX, MY로 재배치됩니다.'
  },
  {
    subStep: 2,
    label: '2수',
    boardOps: [
      D4.MD,   D4.MX,  D4.MY,
      D4.ID,   D4.R90, D4.MY,
      D4.ID,   D4.MX,  D4.R90
    ],
    highlightCells: [6, 7, 8],
    formulaBadge: '⚡ 2수: 3행 R180 (👆👆 3행 타일 더블 탭)',
    formulaText: '3행 R180 (180° 회전 상쇄)',
    formulaDesc: '3행의 R180이 즉시 ID로 상쇄되고, MY는 MX로, R270은 R90으로 정렬됩니다.'
  },
  {
    subStep: 3,
    label: '3수',
    boardOps: [
      D4.MD,   D4.MX,  D4.ID,
      D4.ID,   D4.R90, D4.ID,
      D4.ID,   D4.MX,  D4.MD
    ],
    highlightCells: [2, 5, 8],
    formulaBadge: '⚡ 3수: 3열 MY (↕ 3열 타일 세로 스와이프)',
    formulaText: '3열 MY (세로 반사 상쇄)',
    formulaDesc: '3열의 1·2행 MY 타일들이 MY² = ID로 상쇄되어 0번이 되고, 3행은 MD로 합성!'
  },
  {
    subStep: 4,
    label: '4수',
    boardOps: [
      D4.ID, D4.MX, D4.ID,
      D4.ID, D4.MX, D4.ID,
      D4.ID, D4.MX, D4.ID
    ],
    highlightCells: [0, 4, 8],
    formulaBadge: '⚡ 4수: ↖ 주대각선 MD (↘ 우측하단 대각 스와이프)',
    formulaText: '↖ 주대각선 MD (대각 반사 합성)',
    formulaDesc: '양 끝의 MD 타일이 MD² = ID로 복원되며, 2열 전체(1, 4, 7번)가 MX로 정렬!'
  },
  {
    subStep: 5,
    label: '5수 (완성)',
    boardOps: [
      D4.ID, D4.ID, D4.ID,
      D4.ID, D4.ID, D4.ID,
      D4.ID, D4.ID, D4.ID
    ],
    highlightCells: [1, 4, 7],
    formulaBadge: '🎉 5수: 2열 MX (↔ 2열 타일 가로 스와이프)',
    formulaText: '2열 MX (MX² = ID 완전 상쇄)',
    formulaDesc: '2열의 모든 MX 타일이 가로 반사 상쇄로 ID(0번)가 되어 5수 만에 전체 완성!'
  }
];

/**
 * 슬라이드형 튜토리얼 뷰어 (체계적 7단계):
 * STEP 1. 퍼즐의 목표 & 행렬 성분 구조
 * STEP 2. 성분별 컨트롤러 지도 & 제스처(손동작) 조작법
 * STEP 3. 군론의 핵심 원리: 반사 + 반사 = 회전 (V4 클라인 4원군)
 * STEP 4. 완전한 대칭 군 D4 원리
 * STEP 5. [실전 예제 1] V4 클라인 4원군 4수 마스터
 * STEP 6. [실전 예제 2] D4 정이면체군 5수 묘수 풀이
 * STEP 7. 군론 행렬 퍼즐 완전 정복 🎉
 */
export class TutorialModalController {
  public isOpen = false;
  public currentStep = 1; // 1 ~ 7
  public v4SubStep = 0;   // 0 ~ 4
  public d4SubStep = 0;   // 0 ~ 5
  public boardOps: D4Op[] = Array(9).fill(D4.ID);
  public cell11Mode: 'row' | 'col' = 'row';

  private imgDogFront: HTMLImageElement | null = null;
  private imgDogBack: HTMLImageElement | null = null;
  private autoPlayTimer: any = null;
  public isAutoPlaying = false;

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
    this.goToStep(Math.max(1, Math.min(7, startStep)), false);
    this.removePulse();
    soundEngine.playTap();
  }

  public close(): void {
    this.stopAutoPlay();
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
    this.stopAutoPlay();
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
    if (this.currentStep < 7) {
      this.goToStep(this.currentStep + 1);
    } else {
      this.completeTutorial();
    }
  }

  public goToStep(step: number, playSound = true): void {
    this.stopAutoPlay();
    this.currentStep = Math.max(1, Math.min(7, step));

    if (this.currentStep === 5) {
      this.v4SubStep = 0;
    } else if (this.currentStep === 6) {
      this.d4SubStep = 0;
    }

    this.applyStepState(this.currentStep);
    this.updateStepUI();
    this.renderBoard();
    if (playSound) {
      soundEngine.playTap();
    }
  }

  public completeTutorial(): void {
    this.stopAutoPlay();
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

        <!-- 스텝 탭 / 프로그레스 바 (총 7단계) -->
        <div class="tutorial-steps-bar" id="tut-steps-bar">
          <div class="tut-step-dot" data-step="1" title="1단계: 게임 목표 & 행렬 구조"></div>
          <div class="tut-step-dot" data-step="2" title="2단계: 성분별 변환 & 손동작 조작"></div>
          <div class="tut-step-dot" data-step="3" title="3단계: 반사+반사=회전 (V4)"></div>
          <div class="tut-step-dot" data-step="4" title="4단계: 완전한 대칭 군 D4"></div>
          <div class="tut-step-dot" data-step="5" title="5단계: [실전] V4 4수 마스터"></div>
          <div class="tut-step-dot" data-step="6" title="6단계: [실전] D4 5수 묘수 풀이"></div>
          <div class="tut-step-dot" data-step="7" title="7단계: 군론 행렬 퍼즐 완전 정복"></div>
        </div>

        <!-- 메인 본문 컨텐츠 영역 -->
        <div class="tutorial-body" id="tut-body">
          <!-- 가이드 텍스트 -->
          <div class="tut-guide-box" id="tut-guide-box">
            <div class="tut-guide-step-name" id="tut-step-name">STEP 1. 게임의 목표 & 행렬 성분 구조</div>
            <div class="tut-guide-main-text" id="tut-main-text">뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키기</div>
            <div class="tut-guide-sub-text" id="tut-sub-text">뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키는 것이 목표입니다! 3×3 행렬의 각 성분(1~3행, 1~3열)이 해당 라인의 대칭 변환을 이끄는 컨트롤러 역할을 합니다.</div>
          </div>

          <!-- 실전 예제 수별 컨트롤러 (Step 5, Step 6에서만 표시) -->
          <div class="tut-move-controller" id="tut-move-controller" style="display: none;">
            <div class="tut-move-pills" id="tut-move-pills"></div>
            <button id="btn-tut-autoplay" class="tut-btn-autoplay" title="자동 한 수씩 보기">▶ 한 수씩 보기</button>
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

          <!-- 손동작(제스처) 조작법 인포그래픽 치트시트 카드 -->
          <div class="tut-gesture-card" id="tut-gesture-card" style="display: none;">
            <div class="tut-gesture-header">
              <span class="tut-gesture-title">🎮 제스처(손동작) 조작법 안내</span>
              <span class="tut-gesture-subtitle">터치/밀기로 원하는 대칭 변환 적용</span>
            </div>
            <div class="tut-gesture-grid">
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">👆</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">1회 탭</span>
                  <span class="tut-gesture-result">90° 시계 회전 (R90)</span>
                </div>
              </div>
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">👆👆</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">더블 탭</span>
                  <span class="tut-gesture-result">180° 반전 회전 (R180)</span>
                </div>
              </div>
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">⏱️</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">길게 누르기</span>
                  <span class="tut-gesture-result">270° 회전 (R270)</span>
                </div>
              </div>
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">↔</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">가로 밀기</span>
                  <span class="tut-gesture-result">가로 반사 (MX, 상하반전)</span>
                </div>
              </div>
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">↕</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">세로 밀기</span>
                  <span class="tut-gesture-result">세로 반사 (MY, 좌우반전)</span>
                </div>
              </div>
              <div class="tut-gesture-item">
                <div class="tut-gesture-icon-wrap">↘</div>
                <div class="tut-gesture-info">
                  <span class="tut-gesture-action">대각선 밀기</span>
                  <span class="tut-gesture-result">대각 반사 (MD / MAD)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 스텝 7 최종 마스터 카드 -->
          <div class="tut-master-card" id="tut-master-card" style="display: none;">
            <div class="tut-master-badge-icon">🏆</div>
            <div class="tut-master-title">군론 행렬 퍼즐 완전 정복!</div>
            <p style="font-size:0.88rem; color:#94a3b8; margin:0 0 10px 0;">게임의 목표와 D4 정이면체군 대칭 변환 원리, 실전 해법을 모두 마스터하셨습니다.</p>
            <div class="tut-rules-summary-list">
              <div class="tut-rule-item"><span>🎯</span> <span><b>게임 목표</b> : 뒤섞인 모든 타일을 <b>0번(항등원·정위치 앞면)</b>으로 완성</span></div>
              <div class="tut-rule-item"><span>📐</span> <span><b>행렬 컨트롤러</b> : 테두리 타일(1~3행, 1~3열, 대각선)을 조작하여 해당 라인 전체 변환</span></div>
              <div class="tut-rule-item"><span>🔄</span> <span><b>1행 1열 점(Dot)</b> : 보라색 점 클릭으로 1행 조작 ↔ 1열 조작 모드 자유 전환</span></div>
              <div class="tut-rule-item"><span>🎮</span> <span><b>손동작 변환</b> : 탭(90°), 더블탭(180°), 롱프레스(270°), 가로밀기(MX), 세로밀기(MY), 대각밀기(MD)</span></div>
              <div class="tut-rule-item"><span>⚡</span> <span><b>반사 + 반사 = 회전</b> : MX ∘ MY = R180 (클라인 4원군 V4)</span></div>
              <div class="tut-rule-item"><span>🌌</span> <span><b>8차 정이면체군 D4</b> : 회전 4종(0°, 90°, 180°, 270°) + 반사 4종(MX, MY, MD, MAD)</span></div>
              <div class="tut-rule-item"><span>🧩</span> <span><b>V4 4수 최단 해법</b> : 3행 R180 ➔ 3열 MY ➔ 2행 MY ➔ 1행 R180 완성!</span></div>
              <div class="tut-rule-item"><span>💎</span> <span><b>D4 5수 묘수 풀이</b> : 1행 R90 ➔ 3행 R180 ➔ 3열 MY ➔ 주대각 MD ➔ 2열 MX 완성!</span></div>
            </div>
          </div>
        </div>

        <!-- 하단 슬라이드 네비게이션 버튼 바 -->
        <div class="tutorial-footer">
          <button id="btn-tut-skip" class="tut-btn-skip">닫기</button>
          <div class="tut-footer-nav">
            <button id="btn-tut-prev" class="tut-btn-prev" style="display: none;">◀ 이전</button>
            <button id="btn-tut-action" class="tut-btn-action">
              <span id="tut-btn-action-text">다음 (1/7) ➔</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // 3x3 타일 셀 및 각 성분별 컨트롤러 가이드 라벨 생성
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

        // 각 성분 위치별 컨트롤러 역할 가이드 라벨
        // 0: (0,0) 1행 (보라점 토글 시 1열)
        // 1: (0,1) 2열
        // 2: (0,2) 3열
        // 3: (1,0) 2행
        // 4: (1,1) 2행(중앙)
        // 5: (1,2) ↗부대각
        // 6: (2,0) 3행
        // 7: (2,1) 내부 성분
        // 8: (2,2) ↖주대각
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
        } else if (i === 4) {
          const guideTag = document.createElement('div');
          guideTag.className = 'controller-guide-label guide-row';
          guideTag.innerText = '2행';
          cell.appendChild(guideTag);
        } else if (i === 5) {
          const guideTag = document.createElement('div');
          guideTag.className = 'controller-guide-label guide-diag';
          guideTag.innerText = '↗부대각';
          cell.appendChild(guideTag);
        } else if (i === 8) {
          const guideTag = document.createElement('div');
          guideTag.className = 'controller-guide-label guide-diag';
          guideTag.innerText = '↖주대각';
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
    const btnAutoPlay = document.getElementById('btn-tut-autoplay');

    if (btnClose) btnClose.addEventListener('click', () => this.close());
    if (btnSkip) btnSkip.addEventListener('click', () => this.skip());
    if (btnPrev) btnPrev.addEventListener('click', () => this.prevStep());
    if (btnAction) btnAction.addEventListener('click', () => this.nextStep());
    if (btnAutoPlay) btnAutoPlay.addEventListener('click', () => this.toggleAutoPlay());

    // 상단 스텝 프로그레스 도트 클릭 시 해당 단계로 즉시 점프
    document.querySelectorAll('.tut-step-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const s = parseInt((dot as HTMLElement).dataset.step || '1', 10);
        if (s >= 1 && s <= 7) {
          this.goToStep(s);
        }
      });
    });
  }

  /**
   * 단계별 기본 보드 상태 설정
   */
  public applyStepState(step: number): void {
    switch (step) {
      case 1:
        // 1단계: 뒤섞인 타일 상태
        this.boardOps = [D4.MX, D4.R90, D4.MY, D4.ID, D4.R180, D4.MX, D4.MY, D4.ID, D4.R90];
        break;
      case 2:
        // 2단계: 1행 가로 반사(MX)
        this.executeStep2Success();
        break;
      case 3:
        // 3단계: 반사 + 반사 = R180
        this.executeStep3Success();
        break;
      case 4:
        // 4단계: D4 8가지 원소 전개
        this.boardOps = [
          D4.ID,  D4.R90, D4.R180,
          D4.R270, D4.MX,  D4.MY,
          D4.MD,  D4.MAD, D4.ID
        ];
        break;
      case 5:
        // 5단계: V4 4수 실전 예제 초기 상태
        this.boardOps = [...V4_EXAMPLE_STEPS[this.v4SubStep].boardOps];
        break;
      case 6:
        // 6단계: D4 5수 묘수 풀이 초기 상태
        this.boardOps = [...D4_EXAMPLE_STEPS[this.d4SubStep].boardOps];
        break;
      case 7:
        // 7단계: 완료 상태 (0번 전체 일치)
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
    this.boardOps = [
      composeOps(D4.MX, D4.MY), D4.MX, D4.MX,
      D4.MY,                    D4.ID, D4.ID,
      D4.MY,                    D4.ID, D4.ID
    ];
  }

  /**
   * V4 실전 예제 서브 스텝 변경
   */
  public goToV4SubStep(subStep: number, playSound = true): void {
    this.v4SubStep = Math.max(0, Math.min(V4_EXAMPLE_STEPS.length - 1, subStep));
    const stepData = V4_EXAMPLE_STEPS[this.v4SubStep];
    this.boardOps = [...stepData.boardOps];

    this.clearCellHighlights();
    if (stepData.highlightCells.length > 0) {
      this.highlightCells(stepData.highlightCells, 'highlight-row');
    }

    if (typeof document !== 'undefined') {
      const formulaCard = document.getElementById('tut-formula-card');
      const formulaBadge = document.getElementById('tut-formula-badge');
      const formulaText = document.getElementById('tut-formula-text');
      const formulaDesc = document.getElementById('tut-formula-desc');
      if (formulaCard) formulaCard.style.display = 'block';
      if (formulaBadge) formulaBadge.textContent = stepData.formulaBadge;
      if (formulaText) formulaText.textContent = stepData.formulaText;
      if (formulaDesc) formulaDesc.textContent = stepData.formulaDesc;

      this.updateMovePillsActive(this.v4SubStep);
      this.renderBoard();
    }
    if (playSound) soundEngine.playTap();
  }

  /**
   * D4 실전 예제 서브 스텝 변경
   */
  public goToD4SubStep(subStep: number, playSound = true): void {
    this.d4SubStep = Math.max(0, Math.min(D4_EXAMPLE_STEPS.length - 1, subStep));
    const stepData = D4_EXAMPLE_STEPS[this.d4SubStep];
    this.boardOps = [...stepData.boardOps];

    this.clearCellHighlights();
    if (stepData.highlightCells.length > 0) {
      this.highlightCells(stepData.highlightCells, 'highlight-row');
    }

    if (typeof document !== 'undefined') {
      const formulaCard = document.getElementById('tut-formula-card');
      const formulaBadge = document.getElementById('tut-formula-badge');
      const formulaText = document.getElementById('tut-formula-text');
      const formulaDesc = document.getElementById('tut-formula-desc');
      if (formulaCard) formulaCard.style.display = 'block';
      if (formulaBadge) formulaBadge.textContent = stepData.formulaBadge;
      if (formulaText) formulaText.textContent = stepData.formulaText;
      if (formulaDesc) formulaDesc.textContent = stepData.formulaDesc;

      this.updateMovePillsActive(this.d4SubStep);
      this.renderBoard();
    }
    if (playSound) soundEngine.playTap();
  }

  public toggleAutoPlay(): void {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  public startAutoPlay(): void {
    this.stopAutoPlay();
    this.isAutoPlaying = true;
    this.updateAutoPlayButtonState(true);

    this.autoPlayTimer = setInterval(() => {
      if (this.currentStep === 5) {
        const nextSub = (this.v4SubStep + 1) % V4_EXAMPLE_STEPS.length;
        this.goToV4SubStep(nextSub, false);
      } else if (this.currentStep === 6) {
        const nextSub = (this.d4SubStep + 1) % D4_EXAMPLE_STEPS.length;
        this.goToD4SubStep(nextSub, false);
      } else {
        this.stopAutoPlay();
      }
    }, 1200);
  }

  public stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
    this.isAutoPlaying = false;
    this.updateAutoPlayButtonState(false);
  }

  private updateAutoPlayButtonState(isPlaying: boolean): void {
    if (typeof document === 'undefined') return;
    const btnAutoPlay = document.getElementById('btn-tut-autoplay');
    if (btnAutoPlay) {
      btnAutoPlay.textContent = isPlaying ? '⏸ 일시정지' : '▶ 한 수씩 보기';
      btnAutoPlay.classList.toggle('playing', isPlaying);
    }
  }

  private renderMovePills(steps: ExampleMoveStep[], activeIdx: number, onSelect: (idx: number) => void): void {
    if (typeof document === 'undefined') return;
    const pillsContainer = document.getElementById('tut-move-pills');
    if (!pillsContainer) return;

    pillsContainer.innerHTML = '';
    steps.forEach((step, idx) => {
      const pill = document.createElement('button');
      pill.className = `tut-move-pill ${idx === activeIdx ? 'active' : ''}`;
      pill.textContent = step.label;
      pill.addEventListener('click', () => {
        this.stopAutoPlay();
        onSelect(idx);
      });
      pillsContainer.appendChild(pill);
    });
  }

  private updateMovePillsActive(activeIdx: number): void {
    if (typeof document === 'undefined') return;
    const pills = document.querySelectorAll('.tut-move-pill');
    pills.forEach((p, idx) => {
      p.classList.toggle('active', idx === activeIdx);
    });
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
    const gestureCard = document.getElementById('tut-gesture-card');
    const masterCard = document.getElementById('tut-master-card');
    const boardWrapper = document.getElementById('tut-board-wrapper');
    const moveController = document.getElementById('tut-move-controller');
    const btnPrev = document.getElementById('btn-tut-prev');
    const btnActionText = document.getElementById('tut-btn-action-text');

    if (!stepNameEl || !mainTextEl || !subTextEl) return;

    this.clearCellHighlights();

    // 이전 버튼 토글 (1단계일 때는 숨김)
    if (btnPrev) {
      btnPrev.style.display = step > 1 ? 'block' : 'none';
    }

    // 기본 가시성 세팅
    if (moveController) moveController.style.display = 'none';
    if (formulaCard) formulaCard.style.display = 'none';
    if (gestureCard) gestureCard.style.display = 'none';
    if (masterCard) masterCard.style.display = 'none';
    if (boardWrapper) boardWrapper.style.display = 'block';

    switch (step) {
      case 1:
        stepNameEl.textContent = 'STEP 1. 게임의 목표 & 행렬 성분 구조';
        mainTextEl.textContent = "뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키기";
        subTextEl.textContent = "뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키는 것이 목표입니다! 3×3 행렬의 각 성분(1~3행, 1~3열)이 해당 라인의 대칭 변환을 이끄는 컨트롤러 역할을 합니다.";
        if (btnActionText) btnActionText.textContent = '다음 (1/7) ➔';
        soundEngine.speak('모든 타일을 0번 정위치 앞면으로 일치시키는 것이 게임의 최종 목표입니다. 3행 3열 행렬의 각 성분이 대칭 변환을 이끕니다.');
        break;

      case 2:
        stepNameEl.textContent = 'STEP 2. 성분별 컨트롤러 지도 & 제스처(손동작) 조작법';
        mainTextEl.textContent = '각 타일의 컨트롤러 역할과 손동작에 따른 대칭 변환!';
        subTextEl.textContent = "보드 타일 위의 네온 라벨(1행, 2열, 3열, 2행, 3행, ↖주대각, ↗부대각)이 해당 라인의 컨트롤러입니다.\n1행 1열의 점(Dot)을 누르면 1행 ↔ 1열 모드가 자유롭게 전환됩니다!\n아래 손동작 안내에 따라 탭(회전)이나 스와이프(반사)를 적용해 보세요.";
        this.highlightCells([0, 1, 2], 'highlight-row');
        if (formulaCard) {
          formulaCard.style.display = 'block';
          if (formulaBadge) formulaBadge.textContent = '💡 성분별 대칭 변환 예시';
          if (formulaText) formulaText.textContent = '1행 가로 반사 (↔ 스와이프)';
          if (formulaDesc) formulaDesc.textContent = '1행 타일을 가로로 밀면 1행 전체가 가로 반사(MX)되어 일제히 뒷면(X 뱃지)으로 뒤집힙니다.';
        }
        if (gestureCard) gestureCard.style.display = 'flex';
        if (btnActionText) btnActionText.textContent = '다음 (2/7) ➔';
        soundEngine.speak('보드의 각 타일이 해당 라인을 제어하며, 탭은 회전, 스와이프는 반사 변환을 일으킵니다. 1행 1열의 점으로 1행과 1열 모드를 전환할 수 있습니다.');
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
        if (btnActionText) btnActionText.textContent = '다음 (3/7) ➔';
        soundEngine.speak('가로 반사와 세로 반사가 만나면 앞면으로 복원되며 180도 회전이 탄생합니다. 이는 반사끼리 만나면 회전이 되는 군론과 클라인 4원군의 원리입니다.');
        break;

      case 4:
        stepNameEl.textContent = 'STEP 4. 완전한 대칭 군 D4 원리';
        mainTextEl.textContent = '90° 단위 회전과 대각선 대칭까지 품은 8차 정이면체군 D4!';
        subTextEl.textContent = "회전 4가지(0°, 90°, 180°, 270°)와 반사 4가지(가로 MX, 세로 MY, 주대각선 MD, 역대각선 MAD)가 모여 총 8가지 대칭을 이루는 '8차 정이면체군 D4'를 완성합니다! 이 대칭 규칙을 활용하면 복잡하게 꼬인 보드도 최단 수로 풀어낼 수 있습니다.";
        if (formulaCard) {
          formulaCard.style.display = 'block';
          if (formulaBadge) formulaBadge.textContent = '🌌 완전한 대칭 군 D4';
          if (formulaText) formulaText.textContent = '회전 4종 + 반사 4종 (총 8개 원소)';
          if (formulaDesc) formulaDesc.textContent = '0°, 90°, 180°, 270° 회전과 4방향 거울 대칭이 비가환 대칭 군을 이룹니다.';
        }
        if (gestureCard) gestureCard.style.display = 'flex';
        if (btnActionText) btnActionText.textContent = '다음 (4/7) ➔';
        soundEngine.speak('회전 4가지와 반사 4가지가 모여 정이면체군 D4를 완성합니다. 대각선 반사와 90도 회전의 원리를 익혀보세요.');
        break;

      case 5:
        stepNameEl.textContent = 'STEP 5. [실전 예제 1] V4 클라인 4원군 4수 마스터';
        mainTextEl.textContent = '대칭 상쇄와 반사 합성으로 4수 만에 0번 완성!';
        subTextEl.textContent = '클라인 4원군(V4)에서는 같은 반사를 두 번 적용하면 항등원(ID)으로 상쇄되고, 서로 다른 두 반사는 180° 회전으로 합성됩니다. 아래 수 버튼을 눌러 단계별 변화를 직접 확인해 보세요!';
        if (moveController) moveController.style.display = 'flex';
        this.renderMovePills(V4_EXAMPLE_STEPS, this.v4SubStep, (idx) => this.goToV4SubStep(idx));
        this.goToV4SubStep(this.v4SubStep, false);
        if (btnActionText) btnActionText.textContent = '다음 (5/7) ➔';
        soundEngine.speak('V4 클라인 4원군의 4수 실전 예제입니다. 반사와 회전의 대칭 상쇄로 4수 만에 모든 타일이 0번으로 완성됩니다.');
        break;

      case 6:
        stepNameEl.textContent = 'STEP 6. [실전 예제 2] D4 정이면체군 5수 묘수 풀이';
        mainTextEl.textContent = '대각선 반사(MD)와 90° 회전을 결합한 5수 묘수!';
        subTextEl.textContent = '8차 정이면체군 D4의 정수를 담은 고난도 실전 예제입니다. 대각선 반사와 회전이 어우러져 단 5수 만에 3×3 보드의 모든 타일이 0번 정위치로 맞춰지는 기적을 체험해 보세요!';
        if (moveController) moveController.style.display = 'flex';
        this.renderMovePills(D4_EXAMPLE_STEPS, this.d4SubStep, (idx) => this.goToD4SubStep(idx));
        this.goToD4SubStep(this.d4SubStep, false);
        if (btnActionText) btnActionText.textContent = '다음 (6/7) ➔';
        soundEngine.speak('8차 정이면체군 D4의 5수 실전 예제입니다. 대각선 반사와 회전이 어우러져 단 5수 만에 0번 정위치로 완성됩니다.');
        break;

      case 7:
        stepNameEl.textContent = 'STEP 7. 군론 행렬 퍼즐 완전 정복 🎉';
        mainTextEl.textContent = '축하합니다! 이제 실전 퍼즐에서 최고 기록에 도전하세요!';
        subTextEl.textContent = '기초 변환 원리부터 V4 4수, D4 5수 묘수 풀이까지 완벽하게 정복하셨습니다. 지금 바로 실전 게임을 시작하세요!';
        if (boardWrapper) boardWrapper.style.display = 'none';
        if (masterCard) masterCard.style.display = 'block';
        if (btnActionText) btnActionText.textContent = '🎮 실전 퍼즐 시작하기';
        soundEngine.playClear();
        soundEngine.speak('축하합니다! 게임의 모든 원리와 V4, D4 실전 해법을 완벽히 정복하셨습니다. 이제 실전 큐브에서 최고 기록을 달성해 보세요!');
        break;
    }
  }

  private highlightCells(indices: number[], className: string): void {
    if (typeof document === 'undefined') return;
    indices.forEach((idx) => {
      const cell = document.getElementById(`tut-cell-${idx}`);
      if (cell) cell.classList.add(className);
    });
  }

  private clearCellHighlights(): void {
    if (typeof document === 'undefined') return;
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
