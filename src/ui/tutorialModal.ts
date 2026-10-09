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
    formulaBadge: '🧩 V4 문제',
    formulaText: 'V4 스크램블 (초기)',
    formulaDesc: '반사와 회전 상쇄로 4수 만에 0번 완성!'
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
    formulaBadge: '⚡ 1수: 3행 180° 회전',
    formulaText: '3행 더블 탭 👆👆 (R180)',
    formulaDesc: '3행의 R180 타일 2개가 0번으로 상쇄돼요.'
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
    formulaBadge: '⚡ 2수: 3열 세로 반사',
    formulaText: '3열 세로 밀기 ↕ (MY)',
    formulaDesc: 'MX와 MY가 만나 180° 회전(MX ∘ MY = R180) 합성!'
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
    formulaBadge: '⚡ 3수: 2행 세로 반사',
    formulaText: '2행 세로 밀기 ↕ (MY)',
    formulaDesc: '2행의 MY 타일들이 정위치 0번으로 상쇄돼요.'
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
    formulaBadge: '🎉 4수: 1행 180° 회전',
    formulaText: '1행 더블 탭 👆👆 (R180)',
    formulaDesc: '1행의 R180 타일들이 0번으로 상쇄되어 전체 완성!'
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
    formulaBadge: '🧩 D4 묘수 문제',
    formulaText: 'D4 복합 스크램블 (초기)',
    formulaDesc: '대각선 반사와 회전을 결합한 5수 최단 해법!'
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
    formulaBadge: '⚡ 1수: 1행 90° 회전',
    formulaText: '1행 1회 탭 👆 (R90)',
    formulaDesc: '1행 타일들이 시계 방향 90° 회전돼요.'
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
    formulaBadge: '⚡ 2수: 3행 180° 회전',
    formulaText: '3행 더블 탭 👆👆 (R180)',
    formulaDesc: '3행의 R180이 0번으로 상쇄되고 타일들이 재정렬돼요.'
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
    formulaBadge: '⚡ 3수: 3열 세로 반사',
    formulaText: '3열 세로 밀기 ↕ (MY)',
    formulaDesc: '3열의 1·2행 타일들이 0번으로 상쇄돼요.'
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
    formulaBadge: '⚡ 4수: 대각선 반사',
    formulaText: '대각선 밀기 ↘ (MD)',
    formulaDesc: '양 끝의 MD가 상쇄되고 2열이 MX로 정렬돼요.'
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
    formulaBadge: '🎉 5수: 2열 가로 반사',
    formulaText: '2열 가로 밀기 ↔ (MX)',
    formulaDesc: '2열의 모든 MX가 상쇄되어 5수 만에 전체 완성!'
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
            <div class="tut-hand-demo" id="tut-hand-demo" style="display: none;">
              <span class="tut-hand-icon" id="tut-hand-icon">👆</span>
              <span class="tut-hand-bubble" id="tut-hand-bubble">가로 밀기</span>
            </div>
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
              <div class="tut-rule-item"><span>🔄</span> <span><b>1행 1열 스위치</b> : [↔1행|↕1열] 탭으로 1행 ↔ 1열 조작 모드 자유 전환</span></div>
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
        canvas.width = 160;
        canvas.height = 160;
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
          const switch11 = document.createElement('div');
          switch11.className = `dual-switch-11 ${this.cell11Mode === 'col' ? 'mode-col' : 'mode-row'}`;
          switch11.id = 'tut-switch-11';
          switch11.title = '탭하여 1행 / 1열 모드 전환';
          switch11.innerHTML = `
            <span class="switch-opt switch-row">↔ 1행</span>
            <span class="switch-divider">|</span>
            <span class="switch-opt switch-col">↕ 1열</span>
          `;
          switch11.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDotClick();
          });
          cell.appendChild(switch11);
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
      const sw = document.getElementById('tut-switch-11');
      if (sw) {
        sw.className = `dual-switch-11 ${this.cell11Mode === 'col' ? 'mode-col' : 'mode-row'}`;
      }
      const tag = document.getElementById('tut-guide-tag-11');
      if (tag) {
        tag.innerText = this.cell11Mode === 'col' ? '1열' : '1행';
        tag.className = `controller-guide-label ${this.cell11Mode === 'col' ? 'guide-col' : 'guide-row'}`;
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
   * 가상 손가락 애니메이션 (.tut-hand-demo) 동적 갱신
   */
  public updateHandDemo(step: number, subStep = 0): void {
    if (typeof document === 'undefined') return;
    const hand = document.getElementById('tut-hand-demo');
    const icon = document.getElementById('tut-hand-icon');
    const bubble = document.getElementById('tut-hand-bubble');
    if (!hand || !icon || !bubble) return;

    // 기존 애니메이션 클래스 및 인라인 스타일 리셋
    hand.className = 'tut-hand-demo';
    hand.style.top = '';
    hand.style.left = '';
    hand.style.display = 'flex';

    switch (step) {
      case 1:
        // STEP 1: 모든 강아지를 0번으로! (중앙 안내)
        hand.style.top = '36%';
        hand.style.left = '40%';
        hand.classList.add('hand-anim-tap');
        icon.textContent = '👆';
        bubble.textContent = '모두 0번 앞면으로!';
        break;

      case 2:
        // STEP 2: 1행 가로 밀기 시연 (1행 1열에서 쓱 스와이프)
        hand.classList.add('hand-anim-swipe-h');
        icon.textContent = '👆';
        bubble.textContent = '가로로 쓱 밀기 (↔)';
        break;

      case 3:
        // STEP 3: 세로 밀기 시연 (1열에서 쓱 스와이프)
        hand.classList.add('hand-anim-swipe-v');
        icon.textContent = '👆';
        bubble.textContent = '세로로 또 밀기 (↕)';
        break;

      case 4:
        // STEP 4: D4 8가지 대칭 안내
        hand.style.top = '36%';
        hand.style.left = '40%';
        hand.classList.add('hand-anim-tap');
        icon.textContent = '✨';
        bubble.textContent = '8차 대칭군 D4';
        break;

      case 5:
        // STEP 5: V4 실전 예제 각 수별 시연
        switch (subStep) {
          case 0:
            hand.style.top = '66%';
            hand.style.left = '10%';
            hand.classList.add('hand-anim-double-tap');
            icon.textContent = '👆👆';
            bubble.textContent = '1수: 3행 더블 탭';
            break;
          case 1:
            // 1수: 3행 타일 6 더블 탭 시연
            hand.style.top = '66%';
            hand.style.left = '10%';
            hand.classList.add('hand-anim-double-tap');
            icon.textContent = '👆👆';
            bubble.textContent = '3행 더블 탭 (180°)';
            break;
          case 2:
            // 2수: 3열 타일 2 세로 밀기
            hand.style.top = '6%';
            hand.style.left = '72%';
            hand.classList.add('hand-anim-swipe-col3');
            icon.textContent = '👆';
            bubble.textContent = '3열 세로 밀기 (↕)';
            break;
          case 3:
            // 3수: 2행 타일 3 세로 밀기
            hand.style.top = '36%';
            hand.style.left = '10%';
            hand.classList.add('hand-anim-swipe-v');
            icon.textContent = '👆';
            bubble.textContent = '2행 세로 밀기 (↕)';
            break;
          case 4:
            // 4수: 1행 타일 0 더블 탭
            hand.style.top = '6%';
            hand.style.left = '10%';
            hand.classList.add('hand-anim-double-tap');
            icon.textContent = '👆👆';
            bubble.textContent = '1행 더블 탭 (180°)';
            break;
        }
        break;

      case 6:
        // STEP 6: D4 실전 예제 각 수별 시연
        switch (subStep) {
          case 0:
            hand.style.top = '6%';
            hand.style.left = '10%';
            hand.classList.add('hand-anim-tap');
            icon.textContent = '👆';
            bubble.textContent = '1수: 1행 1회 탭';
            break;
          case 1:
            // 1수: 1행 타일 0 1회 탭 (R90)
            hand.style.top = '6%';
            hand.style.left = '10%';
            hand.classList.add('hand-anim-tap');
            icon.textContent = '👆';
            bubble.textContent = '1행 1회 탭 (90°)';
            break;
          case 2:
            // 2수: 3행 타일 6 더블 탭 (R180)
            hand.style.top = '66%';
            hand.style.left = '10%';
            hand.classList.add('hand-anim-double-tap');
            icon.textContent = '👆👆';
            bubble.textContent = '3행 더블 탭 (180°)';
            break;
          case 3:
            // 3수: 3열 타일 2 세로 밀기 (MY)
            hand.style.top = '6%';
            hand.style.left = '72%';
            hand.classList.add('hand-anim-swipe-col3');
            icon.textContent = '👆';
            bubble.textContent = '3열 세로 밀기 (↕)';
            break;
          case 4:
            // 4수: 주대각 타일 8 대각선 밀기 (MD)
            hand.style.top = '66%';
            hand.style.left = '72%';
            hand.classList.add('hand-anim-swipe-diag');
            icon.textContent = '👆';
            bubble.textContent = '대각선 밀기 (↘)';
            break;
          case 5:
            // 5수: 2열 타일 1 가로 밀기 (MX)
            hand.style.top = '6%';
            hand.style.left = '41%';
            hand.classList.add('hand-anim-swipe-row2');
            icon.textContent = '👆';
            bubble.textContent = '2열 가로 밀기 (↔)';
            break;
        }
        break;

      default:
        hand.style.display = 'none';
        break;
    }
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
      this.updateHandDemo(5, this.v4SubStep);
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
      this.updateHandDemo(6, this.d4SubStep);
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
        stepNameEl.textContent = 'STEP 1. 퍼즐 목표 & 행렬 구조';
        mainTextEl.textContent = '모든 강아지를 바른 앞면(0번)으로 맞추면 성공!';
        subTextEl.textContent = '뒤섞인 타일을 모두 정위치 앞면(0번)으로 정렬해 보세요.';
        if (btnActionText) btnActionText.textContent = '다음 (1/7) ➔';
        soundEngine.speak('뒤섞인 강아지들을 모두 바르게 세워 0번으로 맞추면 성공이에요!');
        this.updateHandDemo(1);
        break;

      case 2:
        stepNameEl.textContent = 'STEP 2. 성분별 변환 & 손동작 조작';
        mainTextEl.textContent = '1행 타일을 ↔ 가로로 밀면 1행 전체가 뒤집혀요';
        subTextEl.textContent = '스위치 칩([↔1행|↕1열])을 누르면 1열 모드로 전환돼요.';
        this.highlightCells([0, 1, 2], 'highlight-row');
        if (formulaCard) {
          formulaCard.style.display = 'block';
          if (formulaBadge) formulaBadge.textContent = '💡 1행 가로 반사';
          if (formulaText) formulaText.textContent = '↔ 가로 밀기 (MX)';
          if (formulaDesc) formulaDesc.textContent = '1행 전체가 뒤로 휙 뒤집혀요.';
        }
        if (btnActionText) btnActionText.textContent = '다음 (2/7) ➔';
        soundEngine.speak('1행 타일을 옆으로 쓱 밀면, 1행 강아지들이 모두 뒤로 휙 뒤집혀요.');
        this.updateHandDemo(2);
        break;

      case 3:
        stepNameEl.textContent = 'STEP 3. 반사 + 반사 = 회전 (V4)';
        mainTextEl.textContent = '가로 반사 후 세로 반사를 하면 신기하게 180° 회전이 돼요! (MX ∘ MY = R180)';
        subTextEl.textContent = '반사 두 번이 만나면 다시 앞면으로 오며 180도 회전 완성!';
        this.highlightCells([0], 'highlight-center');
        this.highlightCells([1, 2], 'highlight-row');
        this.highlightCells([3, 6], 'highlight-row');
        if (formulaCard) {
          formulaCard.style.display = 'block';
          if (formulaBadge) formulaBadge.textContent = '✨ 반사 + 반사 = 회전';
          if (formulaText) formulaText.textContent = 'MX ∘ MY = R180';
          if (formulaDesc) formulaDesc.textContent = '가로 반사 후 세로 반사로 180° 회전 탄생!';
        }
        if (btnActionText) btnActionText.textContent = '다음 (3/7) ➔';
        soundEngine.speak('가로로 뒤집고 세로로 또 뒤집으면, 신기하게 180도 돌아간 앞면이 돼요.');
        this.updateHandDemo(3);
        break;

      case 4:
        stepNameEl.textContent = 'STEP 4. 완전한 대칭 군 D4';
        mainTextEl.textContent = '회전과 반사가 모두 모여 완성되는 8차 대칭군 D4!';
        subTextEl.textContent = '회전 4종(0°, 90°, 180°, 270°)과 반사 4종(가로·세로·대각선)의 조화';
        if (formulaCard) {
          formulaCard.style.display = 'block';
          if (formulaBadge) formulaBadge.textContent = '🌌 8차 대칭군 D4';
          if (formulaText) formulaText.textContent = '회전 4종 + 반사 4종';
          if (formulaDesc) formulaDesc.textContent = '회전과 반사가 모여 완벽한 대칭을 이룹니다.';
        }
        if (btnActionText) btnActionText.textContent = '다음 (4/7) ➔';
        soundEngine.speak('회전과 반사가 모두 모여 8가지 완벽한 대칭을 이룹니다.');
        this.updateHandDemo(4);
        break;

      case 5:
        stepNameEl.textContent = 'STEP 5. [실전] V4 4수 마스터';
        mainTextEl.textContent = 'V4 실전 예제: 반사와 회전의 4수 상쇄 풀이';
        subTextEl.textContent = '단계별 손동작을 따라가며 4수 만에 0번으로 풀어보세요.';
        if (moveController) moveController.style.display = 'flex';
        this.renderMovePills(V4_EXAMPLE_STEPS, this.v4SubStep, (idx) => this.goToV4SubStep(idx));
        this.goToV4SubStep(this.v4SubStep, false);
        if (btnActionText) btnActionText.textContent = '다음 (5/7) ➔';
        soundEngine.speak('반사와 회전을 차례로 맞춰 4수 만에 0번으로 푸는 모습이에요.');
        break;

      case 6:
        stepNameEl.textContent = 'STEP 6. [실전] D4 5수 묘수 풀이';
        mainTextEl.textContent = 'D4 실전 예제: 대각선까지 포함한 5수 묘수 풀이';
        subTextEl.textContent = '대각선 반사와 회전이 어우러져 단 5수 만에 깔끔하게 해결!';
        if (moveController) moveController.style.display = 'flex';
        this.renderMovePills(D4_EXAMPLE_STEPS, this.d4SubStep, (idx) => this.goToD4SubStep(idx));
        this.goToD4SubStep(this.d4SubStep, false);
        if (btnActionText) btnActionText.textContent = '다음 (6/7) ➔';
        soundEngine.speak('대각선까지 섞여 있어도 5수 만에 깔끔하게 해결돼요!');
        break;

      case 7:
        stepNameEl.textContent = 'STEP 7. 군론 행렬 퍼즐 정복';
        mainTextEl.textContent = '준비 완료! 이제 실전 퍼즐에 도전해 보세요';
        subTextEl.textContent = '배운 손동작과 대칭 원리로 최단 기록을 달성해 보세요!';
        if (boardWrapper) boardWrapper.style.display = 'none';
        if (masterCard) masterCard.style.display = 'block';
        if (btnActionText) btnActionText.textContent = '🎮 실전 퍼즐 시작하기';
        soundEngine.playClear();
        soundEngine.speak('자, 이제 실전 퍼즐을 신나게 맞춰볼까요?');
        this.updateHandDemo(7);
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

      const canvas = typeof cell.querySelector === 'function' ? (cell.querySelector('.tut-cell-canvas') as HTMLCanvasElement) : null;
      const badge = typeof cell.querySelector === 'function' ? (cell.querySelector('.tut-cell-badge') as HTMLElement) : null;
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
