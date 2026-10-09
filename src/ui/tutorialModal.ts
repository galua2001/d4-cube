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
 * STEP 1. 각 행과 열의 첫 성분 조작에 따른 행/열 변환 실전 시연
 * 1) 11 성분 가로 쓱 밀기 ➔ 1행 전체 가로 반사(MX)
 * 2) 12 성분 세로 쓱 밀기 ➔ 1행이 MX인 상태에서 12를 세로로 밀어 MX ∘ MY = R180 (180° 회전) 합성!
 * 3) 31 성분 3회 클릭 ➔ 3행 전체 90°씩 3회 순차 회전(R90 ➔ R180 ➔ R270)
 * 4) 21 성분 대각선 긋기 ➔ 2행 첫 성분 21에서 ↖➔↘(MD) 및 ↗➔↙(MAD) 대각선 변환!
 */
export const STEP1_SUB_DEMOS: ExampleMoveStep[] = [
  {
    subStep: 0,
    label: '① 11 가로 밀기',
    boardOps: [
      D4.MX, D4.MX, D4.MX,
      D4.ID, D4.ID, D4.ID,
      D4.ID, D4.ID, D4.ID
    ],
    highlightCells: [0, 1, 2],
    formulaBadge: '💡 [11] 1행 첫 성분',
    formulaText: '11 가로 쓱 밀기 ➔ 1행 전체 가로 반사(MX)',
    formulaDesc: '1행의 첫 성분 11을 가로로 쓱 밀면 1행 전체가 일제히 뒤태(X 뱃지)로 뒤집혀요!'
  },
  {
    subStep: 1,
    label: '② 12 세로 밀기',
    boardOps: [
      D4.MX, D4.R180, D4.MX,
      D4.ID, D4.MY,   D4.ID,
      D4.ID, D4.MY,   D4.ID
    ],
    highlightCells: [1, 4, 7],
    formulaBadge: '✨ [12] 2열 첫 성분 (MX ∘ MY = R180)',
    formulaText: '12 세로 쓱 밀기 ➔ 12 타일 180° 회전!',
    formulaDesc: '1행이 가로 반사(MX)된 상태에서 12를 세로로 밀면(MY), 가로와 세로가 만나 180° 회전(R180)이 돼요!'
  },
  {
    subStep: 2,
    label: '③ 31 3회 클릭 (3행)',
    boardOps: [
      D4.MX,   D4.R180, D4.MX,
      D4.ID,   D4.MY,   D4.ID,
      D4.R270, D4.R270, D4.R270
    ],
    highlightCells: [6, 7, 8],
    formulaBadge: '↻ [31] 3행 첫 성분 (3행 전체 변환)',
    formulaText: '31 3회 클릭 ➔ 3행 전체 90°씩 3회 순차 회전!',
    formulaDesc: '3행의 첫 성분 31을 누르면 클릭할 때마다 3행 전체가 90° ➔ 180° ➔ 270°로 3번 회전해요!'
  },
  {
    subStep: 3,
    label: '④ 21 대각선 긋기 (2행)',
    boardOps: [
      D4.MX,   D4.R180, D4.MX,
      D4.MD,   D4.MD,   D4.MD,
      D4.R270, D4.R270, D4.R270
    ],
    highlightCells: [3, 4, 5],
    formulaBadge: '⚡ [21] 2행 첫 성분 대각선 변환',
    formulaText: '21 성분 대각선 긋기 ➔ 2행의 행들이 대각선 반사(MD/MAD)!',
    formulaDesc: '손가락이 21 성분에서 왼쪽 상단➔오른쪽 하단으로 쓱 그으면 2행이 주대각선 대칭(MD), 오른쪽 상단➔왼쪽 하단으로 쓱 움직이면 부대각선 대칭(MAD)이 돼요!'
  }
];

export const STEP2_SUB_DEMOS = STEP1_SUB_DEMOS;

/**
 * STEP 2. V4 클라인 4원군 4수 최단 해법 데이터
 * V4 모드는 {0, 180, X축(가로), Y축(세로)} 4가지 대칭 변환만 사용!
 * 초기 상태: [R180, R180, MX / MY, MY, ID / R180, R180, MX]
 * 1수: 3행 R180 (3행 1열(31) 타일 더블 탭 👆👆)
 * 2수: 3열 MY (1행 3열(13) 타일 세로 밀기 ↕)
 * 3수: 2행 MY (2행 1열(21) 타일 세로 밀기 ↕)
 * 4수: 1행 R180 (1행 1열(11) 타일 더블 탭 👆👆) -> 전체 0번 완성
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
    formulaBadge: '🧩 V4 모드 소개',
    formulaText: 'V4 원소: 0°, 180°, X축(가로), Y축(세로)',
    formulaDesc: 'V4 모드에서는 대각선과 90° 회전이 없습니다. 4가지 변환 상쇄로 4수 만에 풀어보세요!'
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
    formulaBadge: '⚡ 1수: 3행 180° 회전 (R180)',
    formulaText: '3행 1열(31) 더블 탭 👆👆 (R180)',
    formulaDesc: '3행에 180° 회전을 적용하면, 3행의 R180 타일 2개가 0번으로 깔끔하게 상쇄돼요!'
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
    formulaBadge: '⚡ 2수: 3열 세로 반사 (MY)',
    formulaText: '1행 3열(13) 세로 밀기 ↕ (MY)',
    formulaDesc: '가로 반사(MX) 타일에 세로 반사(MY)가 만나면 180° 회전(MX ∘ MY = R180)으로 합성돼요!'
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
    formulaBadge: '⚡ 3수: 2행 세로 반사 (MY)',
    formulaText: '2행 1열(21) 세로 밀기 ↕ (MY)',
    formulaDesc: '2행에 세로 반사를 적용하면, MY 타일들이 자기상쇄(MY² = 0)되어 정위치 0번이 돼요!'
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
    formulaBadge: '🎉 4수: 1행 180° 회전 (R180) - 완성!',
    formulaText: '1행 1열(11) 더블 탭 👆👆 (R180)',
    formulaDesc: '1행의 R180 타일들이 자기상쇄(180² = 0)되어 모든 강아지가 0번으로 일제히 완성!'
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
 * 슬라이드형 튜토리얼 뷰어 (총 3단계 완결):
 * STEP 1. 퍼즐 목표 & 행렬 변환 실전 시연
 * STEP 2. [V4 실전] V4 4수 최단 풀이 (0, 180, X, Y 4가지 변환)
 * STEP 3. [D4 실전] 8차 정이면체군 D4 5수 묘수 풀이 & 완전 정복 🎉
 */
export class TutorialModalController {
  public isOpen = false;
  public currentStep = 1; // 1 ~ 3
  public step1SubStep = 0; // 0 ~ 3
  public get step2SubStep(): number { return this.step1SubStep; }
  public set step2SubStep(val: number) { this.step1SubStep = val; }
  public v4SubStep = 0;   // 0 ~ 4
  public d4SubStep = 0;   // 0 ~ 5
  public boardOps: D4Op[] = Array(9).fill(D4.ID);
  public cell11Mode: 'row' | 'col' = 'row';

  private imgDogFront: HTMLImageElement | null = null;
  private imgDogBack: HTMLImageElement | null = null;
  private autoPlayTimer: any = null;
  private step1Timer: any = null;
  private step1AnimTimers: any[] = [];
  private v4AnimTimers: any[] = [];
  private d4AnimTimers: any[] = [];
  public get step2Timer(): any { return this.step1Timer; }
  public set step2Timer(v: any) { this.step1Timer = v; }
  public get step2AnimTimers(): any[] { return this.step1AnimTimers; }
  public set step2AnimTimers(v: any[]) { this.step1AnimTimers = v; }
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
    this.goToStep(Math.max(1, Math.min(3, startStep)), false);
    this.removePulse();
    soundEngine.playTap();
  }

  public close(): void {
    this.stopStep1DemoLoop();
    this.stopAutoPlay();
    this.clearV4AnimTimers();
    this.clearD4AnimTimers();
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
    this.clearV4AnimTimers();
    this.clearD4AnimTimers();
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
    if (this.currentStep < 3) {
      this.goToStep(this.currentStep + 1);
    } else {
      this.completeTutorial();
    }
  }

  public goToStep(step: number, playSound = true): void {
    this.stopStep1DemoLoop();
    this.stopAutoPlay();
    this.clearV4AnimTimers();
    this.clearD4AnimTimers();
    this.currentStep = Math.max(1, Math.min(3, step));

    if (this.currentStep === 1) {
      this.step1SubStep = 0;
    } else if (this.currentStep === 2) {
      this.v4SubStep = 0;
    } else if (this.currentStep === 3) {
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

        <!-- 스텝 탭 / 프로그레스 바 (총 3단계 완결) -->
        <div class="tutorial-steps-bar" id="tut-steps-bar">
          <div class="tut-step-dot" data-step="1" title="1단계: 퍼즐 목표 & 행렬 변환 실전 시연"></div>
          <div class="tut-step-dot" data-step="2" title="2단계: [V4 실전] V4 4수 최단 풀이"></div>
          <div class="tut-step-dot" data-step="3" title="3단계: [D4 실전] 8차 정이면체군 D4 5수 묘수 풀이"></div>
        </div>

        <!-- 메인 본문 컨텐츠 영역 -->
        <div class="tutorial-body" id="tut-body">
          <!-- 가이드 텍스트 -->
          <div class="tut-guide-box" id="tut-guide-box">
            <div class="tut-guide-step-name" id="tut-step-name">STEP 1. 게임의 목표 & 행렬 성분 구조</div>
            <div class="tut-guide-main-text" id="tut-main-text">뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키기</div>
            <div class="tut-guide-sub-text" id="tut-sub-text">뒤섞인 모든 타일을 항등원 '0번(정위치 앞면)'으로 일치시키는 것이 목표입니다! 3×3 행렬의 외곽 성분(1~3행, 1~3열)이 해당 라인의 행·열 대칭 변환을 이끄는 컨트롤러 역할을 합니다.</div>
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
              <div class="tut-rule-item"><span>📐</span> <span><b>행렬 컨트롤러</b> : 외곽 성분 타일(1~3행, 1~3열)을 조작하여 해당 라인의 행·열 대칭 변환</span></div>
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
              <span id="tut-btn-action-text">다음 (1/5) ➔</span>
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

        // 각 성분 위치별 컨트롤러 역할 가이드 라벨 및 11번 타일 스위치
        // 0번 타일(1행 1열, i === 0): 우측 세로 여백에 미려하고 컴팩트한 알약 스위치(.tut-tile-switch-11) 배치
        if (i === 0) {
          const sw = document.createElement('div');
          sw.className = `tile-switch-11 tut-tile-switch-11 ${this.cell11Mode === 'col' ? 'mode-col' : 'mode-row'}`;
          sw.id = 'tut-tile-switch-11';
          sw.title = '탭하여 1행 / 1열 변환 모드 전환';
          sw.innerHTML = `
            <span class="tile-switch-opt opt-row">1행</span>
            <span class="tile-switch-opt opt-col">1열</span>
          `;
          sw.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleDotClick();
          });
          cell.appendChild(sw);
        } else if (i === 1 || i === 2) {
          // 1: (0,1) 2열
          // 2: (0,2) 3열
          const guideTag = document.createElement('div');
          guideTag.className = 'controller-guide-label guide-col';
          guideTag.innerText = `${i + 1}열`;
          cell.appendChild(guideTag);
        } else if (i === 3 || i === 6) {
          // 3: (1,0) 2행
          // 6: (2,0) 3행
          const guideTag = document.createElement('div');
          guideTag.className = 'controller-guide-label guide-row';
          guideTag.innerText = `${Math.floor(i / 3) + 1}행`;
          cell.appendChild(guideTag);
        }
        // 4번(22), 5번(23), 7번(32), 8번(33)은 기본 행·열 컨트롤러가 아니므로 라벨을 일체 표시하지 않음

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
      const sw = document.getElementById('tut-tile-switch-11') || document.getElementById('tut-side-switch-11') || document.getElementById('tut-switch-11');
      if (sw) {
        sw.className = `tile-switch-11 tut-tile-switch-11 ${this.cell11Mode === 'col' ? 'mode-col' : 'mode-row'}`;
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
    const tutTileSwitch = document.getElementById('tut-tile-switch-11') || document.getElementById('tut-side-switch-11');

    if (tutTileSwitch) {
      tutTileSwitch.onclick = (e) => {
        e.stopPropagation();
        this.handleDotClick();
      };
    }

    if (btnClose) btnClose.addEventListener('click', () => this.close());
    if (btnSkip) btnSkip.addEventListener('click', () => this.skip());
    if (btnPrev) btnPrev.addEventListener('click', () => this.prevStep());
    if (btnAction) btnAction.addEventListener('click', () => this.nextStep());
    if (btnAutoPlay) btnAutoPlay.addEventListener('click', () => this.toggleAutoPlay());

    // 상단 스텝 프로그레스 도트 클릭 시 해당 단계로 즉시 점프
    document.querySelectorAll('.tut-step-dot').forEach((dot) => {
      dot.addEventListener('click', () => {
        const s = parseInt((dot as HTMLElement).dataset.step || '1', 10);
        if (s >= 1 && s <= 3) {
          this.goToStep(s);
        }
      });
    });
  }

  /**
   * 단계별 기본 보드 상태 설정 (총 3단계)
   */
  public applyStepState(step: number): void {
    switch (step) {
      case 1:
        // 1단계: STEP 1 서브 시연 보드 상태
        this.boardOps = [...STEP1_SUB_DEMOS[this.step1SubStep || 0].boardOps];
        break;
      case 2:
        // 2단계: [실전] V4 4수 마스터 상태
        this.boardOps = [...V4_EXAMPLE_STEPS[this.v4SubStep].boardOps];
        break;
      case 3:
        // 3단계: [실전] D4 5수 묘수 풀이 상태 (완결)
        this.boardOps = [...D4_EXAMPLE_STEPS[this.d4SubStep].boardOps];
        break;
    }
  }

  public executeStep2Success(): void {
    this.boardOps = [
      composeOps(D4.MX, D4.MY), D4.MX, D4.MX,
      D4.MY,                    D4.ID, D4.ID,
      D4.MY,                    D4.ID, D4.ID
    ];
  }

  public executeStep3Success(): void {
    this.executeStep2Success();
  }

  /**
   * 3x3 보드 상의 특정 타일 인덱스(0~8) 정중앙으로 손가락 안내 요소를 정밀 위치시킴
   */
  public positionHandAtCell(cellIdx: number): void {
    if (typeof document === 'undefined') return;
    const hand = document.getElementById('tut-hand-demo');
    if (!hand) return;

    const row = Math.floor(cellIdx / 3);
    const col = cellIdx % 3;

    // 1순위: 실제 렌더링된 DOM 좌표 기준 계산
    const cell = document.getElementById(`tut-cell-${cellIdx}`);
    const wrapper = document.getElementById('tut-board-wrapper');
    if (cell && wrapper && typeof cell.getBoundingClientRect === 'function' && typeof wrapper.getBoundingClientRect === 'function') {
      const cRect = cell.getBoundingClientRect();
      const wRect = wrapper.getBoundingClientRect();
      if (wRect.width > 0 && cRect.width > 0) {
        const cx = (cRect.left + cRect.width / 2) - wRect.left;
        const cy = (cRect.top + cRect.height / 2) - wRect.top;
        hand.style.left = `${cx}px`;
        hand.style.top = `${cy}px`;
        return;
      }
    }

    // 2순위 fallback: 3x3 균등 그리드 정중앙 퍼센티지
    const leftPercent = ((col * 2 + 1) / 6) * 100;
    const topPercent = ((row * 2 + 1) / 6) * 100;
    hand.style.left = `${leftPercent.toFixed(1)}%`;
    hand.style.top = `${topPercent.toFixed(1)}%`;
  }

  /**
   * 상단 [▶ 한 수씩 보기] 버튼 위치로 손가락 안내 요소를 정밀 위치시킴
   */
  public positionHandAtAutoplay(): void {
    if (typeof document === 'undefined') return;
    const hand = document.getElementById('tut-hand-demo');
    const btnAuto = document.getElementById('btn-tut-autoplay');
    const wrapper = document.getElementById('tut-board-wrapper');
    if (!hand || !wrapper) return;

    if (btnAuto && typeof btnAuto.getBoundingClientRect === 'function' && typeof wrapper.getBoundingClientRect === 'function') {
      const bRect = btnAuto.getBoundingClientRect();
      const wRect = wrapper.getBoundingClientRect();
      if (wRect.width > 0 && bRect.width > 0) {
        const cx = (bRect.left + bRect.width / 2) - wRect.left;
        const cy = (bRect.top + bRect.height + 14) - wRect.top;
        hand.style.left = `${cx}px`;
        hand.style.top = `${cy}px`;
        return;
      }
    }

    // fallback: 상단 우측 autoplay 버튼 위치
    hand.style.left = '78%';
    hand.style.top = '-16px';
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
        // STEP 1: 서브 시연별(11 가로, 12 세로, 13 대각선) 해당 성분 타일 중심에 정밀 위치
        {
          const demoIdx = subStep !== undefined ? subStep : this.step1SubStep;
          if (demoIdx === 0) {
            this.positionHandAtCell(0); // 11 (1행 1열, idx 0) 타일 정중앙
            hand.classList.add('hand-anim-cell-swipe-h');
            icon.textContent = '👆';
            bubble.textContent = '11 가로 쓱 밀기 (↔)';
          } else if (demoIdx === 1) {
            this.positionHandAtCell(1); // 12 (1행 2열, idx 1) 타일 정중앙
            hand.classList.add('hand-anim-cell-swipe-v');
            icon.textContent = '👆';
            bubble.textContent = '12 세로 쓱 밀기 (↕)';
          } else if (demoIdx === 2) {
            this.positionHandAtCell(6); // 31 (3행 1열, idx 6) 타일 정중앙
            hand.classList.add('hand-anim-cell-triple-tap');
            icon.textContent = '👆';
            bubble.textContent = '31 가운데 3회 클릭 (3행)';
          } else {
            this.positionHandAtCell(3); // 21 (2행 1열, idx 3) 성분 타일 정중앙
            hand.classList.add('hand-anim-cell-diag-combo');
            icon.textContent = '👆';
            bubble.textContent = '21 대각선 긋기 (2행)';
          }
        }
        break;

      case 2:
        // STEP 2: V4 실전 예제 각 수별 시연 (손가락 1개로 정밀 제스처 시연)
        icon.textContent = '👆';
        switch (subStep) {
          case 0:
            this.positionHandAtAutoplay(); // 상단 [▶ 한 수씩 보기] 버튼 가리키기
            hand.classList.add('hand-anim-point-up');
            bubble.textContent = '👆 [▶ 한 수씩 보기] 클릭!';
            break;
          case 1:
            // 1수: 3행 1열(31, idx 6) 손가락 1개로 두 번 클릭 (각 90°씩 회전)
            this.positionHandAtCell(6);
            hand.classList.add('hand-anim-single-double-tap');
            bubble.textContent = '31 두 번 클릭 (90°+90°=180°)';
            break;
          case 2:
            // 2수: 1행 3열(13, idx 2) 세로 쓱 그어 3열 변환
            this.positionHandAtCell(2);
            hand.classList.add('hand-anim-cell-swipe-v');
            bubble.textContent = '13 세로 쓱 그어 3열 변환 (↕)';
            break;
          case 3:
            // 3수: 2행 1열(21, idx 3) 세로 쓱 그어 2행 변환
            this.positionHandAtCell(3);
            hand.classList.add('hand-anim-cell-swipe-v');
            bubble.textContent = '21 세로 쓱 그어 2행 변환 (↕)';
            break;
          case 4:
            // 4수: 1행 1열(11, idx 0) 손가락 1개로 두 번 클릭 (각 90°씩 회전)
            this.positionHandAtCell(0);
            hand.classList.add('hand-anim-single-double-tap');
            bubble.textContent = '11 두 번 클릭 (90°+90°=180°)';
            break;
        }
        break;

      case 3:
        // STEP 3: [D4 실전] 8차 정이면체군 D4 5수 묘수 풀이 (손가락 1개로 정밀 제스처 시연)
        icon.textContent = '👆';
        switch (subStep) {
          case 0:
            this.positionHandAtAutoplay(); // 상단 [▶ 한 수씩 보기] 버튼 가리키기
            hand.classList.add('hand-anim-point-up');
            bubble.textContent = '👆 [▶ 한 수씩 보기] 클릭!';
            break;
          case 1:
            // 1수: 1행 1열(11, idx 0) 1회 탭 (1행 90° 회전)
            this.positionHandAtCell(0);
            hand.classList.add('hand-anim-tap');
            bubble.textContent = '11 1회 탭 (1행 90° 회전)';
            break;
          case 2:
            // 2수: 3행 1열(31, idx 6) 두 번 클릭 (3행 180° 회전)
            this.positionHandAtCell(6);
            hand.classList.add('hand-anim-single-double-tap');
            bubble.textContent = '31 두 번 클릭 (3행 180° 회전)';
            break;
          case 3:
            // 3수: 1행 3열(13, idx 2) 천천히 세로 쓱 그어 3열 변환
            this.positionHandAtCell(2);
            hand.classList.add('hand-anim-cell-swipe-v');
            bubble.textContent = '13 천천히 세로 쓱 (3열 세로 반사 ↕)';
            break;
          case 4:
            // 4수: 주대각선 컨트롤러(idx 8) 천천히 대각선 쓱 그어 주대각 변환
            this.positionHandAtCell(8);
            hand.classList.add('hand-anim-cell-diag-main');
            bubble.textContent = '↘ 대각선 천천히 쓱 (주대각선 반사)';
            break;
          case 5:
            // 5수: 1행 2열(12, idx 1) 천천히 가로 쓱 밀어 2열 변환 (완성!)
            this.positionHandAtCell(1);
            hand.classList.add('hand-anim-cell-swipe-h');
            bubble.textContent = '12 천천히 가로 쓱 (2열 가로 반사 ↔)';
            break;
        }
        break;

      default:
        hand.style.display = 'none';
        break;
    }
  }

  private clearStep1AnimTimers(): void {
    if (this.step1AnimTimers && this.step1AnimTimers.length > 0) {
      this.step1AnimTimers.forEach((t) => clearTimeout(t));
      this.step1AnimTimers = [];
    }
  }

  private clearV4AnimTimers(): void {
    if (this.v4AnimTimers && this.v4AnimTimers.length > 0) {
      this.v4AnimTimers.forEach((t) => clearTimeout(t));
      this.v4AnimTimers = [];
    }
  }

  private clearD4AnimTimers(): void {
    if (this.d4AnimTimers && this.d4AnimTimers.length > 0) {
      this.d4AnimTimers.forEach((t) => clearTimeout(t));
      this.d4AnimTimers = [];
    }
  }

  private addCellAnimClass(indices: number[], className: string): void {
    if (typeof document === 'undefined') return;
    indices.forEach((idx) => {
      const cell = document.getElementById(`tut-cell-${idx}`);
      if (cell) cell.classList.add(className);
    });
  }

  private removeCellAnimClass(indices: number[], className: string): void {
    if (typeof document === 'undefined') return;
    indices.forEach((idx) => {
      const cell = document.getElementById(`tut-cell-${idx}`);
      if (cell) cell.classList.remove(className);
    });
  }

  /**
   * STEP 1. 서브 시연 변경 (① 11 가로 밀기, ② 12 세로 밀기)
   * 손가락과 보드 타일이 실전 퍼즐처럼 동기화되어 부드럽게 함께 3D 플립 연출
   */
  public goToStep1SubStep(subStep: number, playSound = true): void {
    this.clearStep1AnimTimers();
    this.step1SubStep = Math.max(0, Math.min(STEP1_SUB_DEMOS.length - 1, subStep));
    const stepData = STEP1_SUB_DEMOS[this.step1SubStep];

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

      this.updateMovePillsActive(this.step1SubStep);
      this.updateHandDemo(1, this.step1SubStep);
    }

    // [핵심 인터랙션] 손동작 이동과 보드 타일 3D 플립의 정밀 동기화
    if (this.step1SubStep === 0) {
      // ① 11 가로 쓱 밀기:
      // 시작: 9개 타일 모두 정위치 앞면(ID)
      this.boardOps = [
        D4.ID, D4.ID, D4.ID,
        D4.ID, D4.ID, D4.ID,
        D4.ID, D4.ID, D4.ID
      ];
      this.renderBoard();

      // 손가락이 11 타일 왼쪽 중간에서 오른쪽 중간으로 쓱 이동하는 순간 동시에 1행 타일들(idx 0, 1, 2) 3D 가로 플립 시작!
      const t1 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 0) {
          this.addCellAnimClass([0, 1, 2], 'tut-cell-flipping-h');
          soundEngine.playFlip();
        }
      }, 50);

      // 플립 중간 90도 회전 시점: 1행 타일들이 일제히 가로 반사(MX, 뒷면)로 뒤집힘
      const t2 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 0) {
          this.boardOps = [...stepData.boardOps];
          this.renderBoard();
        }
      }, 350);

      // 플립 완료 시점: 플립 클래스 제거
      const t3 = setTimeout(() => {
        this.removeCellAnimClass([0, 1, 2], 'tut-cell-flipping-h');
      }, 750);

      this.step1AnimTimers.push(t1, t2, t3);

    } else if (this.step1SubStep === 1) {
      // ② 12 세로 쓱 밀기:
      // 1행이 가로 반사(MX)된 상태에서 손가락이 12 타일 중앙에서 상 ➔ 하로 쓱 이동
      this.boardOps = [
        D4.MX, D4.MX, D4.MX,
        D4.ID, D4.ID, D4.ID,
        D4.ID, D4.ID, D4.ID
      ];
      this.renderBoard();

      // 손가락이 세로로 쓱 미는 타이밍에 2열 타일들(idx 1, 4, 7) 3D 세로 플립 시작
      // 특히 12 타일(idx 1)은 MX ∘ MY = R180 (180° 회전) 스핀 플립 적용!
      const t1 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 1) {
          this.addCellAnimClass([1], 'tut-cell-flipping-v-r180');
          this.addCellAnimClass([4, 7], 'tut-cell-flipping-v');
          soundEngine.playFlip();
        }
      }, 350);

      // 플립 중간 90도 시점: 12 타일은 180° 회전(R180), 2열 다른 타일은 MY로 갱신
      const t2 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 1) {
          this.boardOps = [...stepData.boardOps];
          this.renderBoard();
        }
      }, 600);

      // 플립 완료 시점: 플립 클래스 제거
      const t3 = setTimeout(() => {
        this.removeCellAnimClass([1], 'tut-cell-flipping-v-r180');
        this.removeCellAnimClass([4, 7], 'tut-cell-flipping-v');
      }, 1050);

      this.step1AnimTimers.push(t1, t2, t3);
    } else if (this.step1SubStep === 2) {
      // ③ 31 성분 3회 클릭 (3행 전체 변환): 3행 첫 성분을 3번 클릭하여 90° ➔ 180° ➔ 270°로 3번 순차 변환
      // 시작 상태: 1행 MX, 12는 R180, 2열 MY 상태에서 3행(idx 6, 7, 8)을 정위치 ID로 준비
      this.boardOps = [
        D4.MX, D4.R180, D4.MX,
        D4.ID, D4.MY,   D4.ID,
        D4.ID, D4.ID,   D4.ID
      ];
      this.clearCellHighlights();
      this.highlightCells([6, 7, 8], 'highlight-row');
      this.renderBoard();

      // [1회 클릭] t = 450ms: 3행 전체(idx 6, 7, 8) 90° 시계 회전 (R90)
      const t1 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 2) {
          this.addCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
          this.boardOps[6] = D4.R90;
          this.boardOps[7] = D4.R90;
          this.boardOps[8] = D4.R90;
          this.renderBoard();
          soundEngine.playTap();

          const bubble = document.getElementById('tut-hand-bubble');
          if (bubble) bubble.textContent = '1회 클릭 ➔ 3행 90° 회전';
          const fBadge = document.getElementById('tut-formula-badge');
          const fText = document.getElementById('tut-formula-text');
          if (fBadge) fBadge.textContent = '↻ [31] 3행 1회 클릭 (90°)';
          if (fText) fText.textContent = '1) 31 1회 클릭 ➔ 3행 전체 90° 시계 회전 (R90)';
        }
      }, 450);

      const t2 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 2) {
          this.removeCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
        }
      }, 850);

      // [2회 클릭] t = 1350ms: 3행 전체(idx 6, 7, 8) 180° 반전 회전 (R180)
      const t3 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 2) {
          this.addCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
          this.boardOps[6] = D4.R180;
          this.boardOps[7] = D4.R180;
          this.boardOps[8] = D4.R180;
          this.renderBoard();
          soundEngine.playTap();

          const bubble = document.getElementById('tut-hand-bubble');
          if (bubble) bubble.textContent = '2회 클릭 ➔ 3행 180° 반전';
          const fBadge = document.getElementById('tut-formula-badge');
          const fText = document.getElementById('tut-formula-text');
          if (fBadge) fBadge.textContent = '🔄 [31] 3행 2회 클릭 (180°)';
          if (fText) fText.textContent = '2) 31 2회 클릭 ➔ 3행 전체 180° 반전 (R180)';
        }
      }, 1350);

      const t4 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 2) {
          this.removeCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
        }
      }, 1750);

      // [3회 클릭] t = 2250ms: 3행 전체(idx 6, 7, 8) 270° 회전 (R270 완성)
      const t5 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 2) {
          this.addCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
          this.boardOps[6] = D4.R270;
          this.boardOps[7] = D4.R270;
          this.boardOps[8] = D4.R270;
          this.renderBoard();
          soundEngine.playTap();

          const bubble = document.getElementById('tut-hand-bubble');
          if (bubble) bubble.textContent = '3회 클릭 ➔ 3행 270° 회전 완성!';
          const fBadge = document.getElementById('tut-formula-badge');
          const fText = document.getElementById('tut-formula-text');
          const fDesc = document.getElementById('tut-formula-desc');
          if (fBadge) fBadge.textContent = '✨ [31] 3행 3회 클릭 완료 (R270)';
          if (fText) fText.textContent = '3) 31 3회 클릭 ➔ 3행 전체 270° 회전 완성 (R270)';
          if (fDesc) fDesc.textContent = '3행 첫 성분 31을 누르면 클릭할 때마다 3행 전체 강아지가 90° ➔ 180° ➔ 270°로 3번 회전해요!';
        }
      }, 2250);

      const t6 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 2) {
          this.removeCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
        }
      }, 2650);

      this.step1AnimTimers.push(t1, t2, t3, t4, t5, t6);
    } else if (this.step1SubStep === 3) {
      // ④ 21 대각선 긋기: 21 성분(idx 3)에서 대각선을 그으면 2행 전체([3, 4, 5])가 대각선 반사(MD ➔ MAD)
      this.positionHandAtCell(3);
      this.boardOps = [
        D4.MX,   D4.R180, D4.MX,
        D4.ID,   D4.MY,   D4.ID,
        D4.R270, D4.R270, D4.R270
      ];
      this.clearCellHighlights();
      this.highlightCells([3, 4, 5], 'highlight-row'); // 2행 전체 하이라이트!
      this.renderBoard();

      // [1단계: 주대각선] t = 450ms: 손가락이 왼쪽 상단에서 오른쪽 하단으로 쓱 그을 때 (↖ ➔ ↘ MD)
      const t1 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 3) {
          this.addCellAnimClass([3, 4, 5], 'tut-cell-flipping-diag');
          this.boardOps[3] = D4.MD;
          this.boardOps[4] = D4.MD;
          this.boardOps[5] = D4.MD;
          this.renderBoard();
          soundEngine.playFlip();

          const bubble = document.getElementById('tut-hand-bubble');
          if (bubble) bubble.textContent = '1) ↖➔↘ 주대각 긋기 (2행 MD)';
          const fBadge = document.getElementById('tut-formula-badge');
          const fText = document.getElementById('tut-formula-text');
          if (fBadge) fBadge.textContent = '⚡ [21] 2행 주대각선 대칭 (MD)';
          if (fText) fText.textContent = '21에서 ↖➔↘로 쓱 그으면 ➔ 2행이 주대각선 대칭(MD)!';
        }
      }, 450);

      const t2 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 3) {
          this.removeCellAnimClass([3, 4, 5], 'tut-cell-flipping-diag');
        }
      }, 1000);

      // [2단계: 부대각선] t = 1700ms: 손가락이 오른쪽 상단에서 왼쪽 하단으로 쓱 움직일 때 (↗ ➔ ↙ MAD)
      const t3 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 3) {
          this.clearCellHighlights();
          this.highlightCells([3, 4, 5], 'highlight-row'); // 2행 전체 하이라이트!
          this.addCellAnimClass([3, 4, 5], 'tut-cell-flipping-diag');
          this.boardOps[3] = D4.MAD;
          this.boardOps[4] = D4.MAD;
          this.boardOps[5] = D4.MAD;
          this.renderBoard();
          soundEngine.playFlip();

          const bubble = document.getElementById('tut-hand-bubble');
          if (bubble) bubble.textContent = '2) ↗➔↙ 부대각 긋기 (2행 MAD)';
          const fBadge = document.getElementById('tut-formula-badge');
          const fText = document.getElementById('tut-formula-text');
          const fDesc = document.getElementById('tut-formula-desc');
          if (fBadge) fBadge.textContent = '⚡ [21] 2행 부대각선 대칭 (MAD)';
          if (fText) fText.textContent = '21에서 ↗➔↙로 쓱 움직이면 ➔ 2행이 부대각선 대칭(MAD)!';
          if (fDesc) fDesc.textContent = '손가락이 21 성분에서 왼쪽 상단➔오른쪽 하단으로 쓱 그으면 2행이 주대각선 대칭(MD), 오른쪽 상단➔왼쪽 하단으로 쓱 움직이면 부대각선 대칭(MAD)이 돼요!';
        }
      }, 1700);

      const t4 = setTimeout(() => {
        if (this.currentStep === 1 && this.step1SubStep === 3) {
          this.removeCellAnimClass([3, 4, 5], 'tut-cell-flipping-diag');
        }
      }, 2250);

      this.step1AnimTimers.push(t1, t2, t3, t4);
    } else {
      this.boardOps = [...stepData.boardOps];
      this.renderBoard();
    }

    if (playSound) soundEngine.playTap();
  }

  // 하위 호환성 래퍼
  public goToStep2SubStep(subStep: number, playSound = true): void {
    this.goToStep1SubStep(subStep, playSound);
  }

  public startStep1DemoLoop(): void {
    this.stopStep1DemoLoop();
    this.step1Timer = setInterval(() => {
      if (this.currentStep === 1) {
        // 31 성분 3회 회전이 완전히 끝나고 넉넉히 관찰할 수 있도록 보장
        const nextSub = (this.step1SubStep + 1) % STEP1_SUB_DEMOS.length;
        this.goToStep1SubStep(nextSub, false);
      } else {
        this.stopStep1DemoLoop();
      }
    }, 4500);
  }

  public stopStep1DemoLoop(): void {
    if (this.step1Timer) {
      clearInterval(this.step1Timer);
      this.step1Timer = null;
    }
    this.clearStep1AnimTimers();
  }

  public startStep2DemoLoop(): void {
    this.startStep1DemoLoop();
  }

  public stopStep2DemoLoop(): void {
    this.stopStep1DemoLoop();
  }

  /**
   * V4 실전 예제 서브 스텝 변경
   * 1수: 31 두 번 클릭 -> 각 클릭마다 90°씩 회전하여 180° 회전 상쇄
   * 2수: 13 세로 쓱 그을 때 동시에 3열 세로 반사 플립
   * 3수: 21 세로 쓱 그을 때 동시에 2행 세로 반사 플립
   * 4수: 11 손가락 1개로 두 번 톡톡 -> 각 클릭마다 90°씩 회전하여 최종 완성
   */
  public goToV4SubStep(subStep: number, playSound = true): void {
    this.clearV4AnimTimers();
    this.v4SubStep = Math.max(0, Math.min(V4_EXAMPLE_STEPS.length - 1, subStep));
    const stepData = V4_EXAMPLE_STEPS[this.v4SubStep];

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
      this.updateHandDemo(2, this.v4SubStep);
    }

    if (this.v4SubStep === 0) {
      // 0수 (초기 상태)
      this.boardOps = [...stepData.boardOps];
      this.renderBoard();
      if (playSound) soundEngine.playTap();

    } else if (this.v4SubStep === 1) {
      // 1수: 31 두 번 클릭 -> 1회 클릭 시 90도 회전, 2회 클릭 시 또 90도 회전해서 총 180도 회전 완성!
      this.boardOps = [...V4_EXAMPLE_STEPS[0].boardOps];
      this.renderBoard();

      // [1회 톡] t = 200ms: 손가락이 31을 톡 누르는 순간 3행 전체([6, 7, 8]) 90° 시계 회전!
      const t1 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 1) {
          this.addCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
          this.boardOps[6] = composeOps(V4_EXAMPLE_STEPS[0].boardOps[6], D4.R90);
          this.boardOps[7] = composeOps(V4_EXAMPLE_STEPS[0].boardOps[7], D4.R90);
          this.boardOps[8] = composeOps(V4_EXAMPLE_STEPS[0].boardOps[8], D4.R90);
          this.renderBoard();
          soundEngine.playTap();
        }
      }, 200);

      const t2 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 1) {
          this.removeCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
        }
      }, 520);

      // [2회 톡] t = 620ms: 손가락이 31을 다시 톡 누르는 순간 3행 전체 다시 90° 추가 회전 (총 180° 회전 완성!)
      const t3 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 1) {
          this.addCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
          this.boardOps = [...V4_EXAMPLE_STEPS[1].boardOps];
          this.renderBoard();
          soundEngine.playTap();
        }
      }, 620);

      const t4 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 1) {
          this.removeCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
        }
      }, 980);

      this.v4AnimTimers.push(t1, t2, t3, t4);

    } else if (this.v4SubStep === 2) {
      // 2수: 13 세로 그을 때 손가락 움직임 속도에 맞춰 천천히 3열([2, 5, 8]) 세로 반사 플립!
      this.boardOps = [...V4_EXAMPLE_STEPS[1].boardOps];
      this.renderBoard();

      // 손가락이 13에서 아래로 쓱 내려가기 시작하는 순간(t = 250ms)에 3열 3D 플립 발동
      const t1 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 2) {
          this.addCellAnimClass([2, 5, 8], 'tut-cell-flipping-v');
          soundEngine.playFlip();
        }
      }, 250);

      // 플립 회전 중간 시점(t = 650ms): 3열 타일들이 세로 반사로 갱신 (MX ∘ MY = R180 합성)
      const t2 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 2) {
          this.boardOps = [...V4_EXAMPLE_STEPS[2].boardOps];
          this.renderBoard();
        }
      }, 650);

      const t3 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 2) {
          this.removeCellAnimClass([2, 5, 8], 'tut-cell-flipping-v');
        }
      }, 1100);

      this.v4AnimTimers.push(t1, t2, t3);

    } else if (this.v4SubStep === 3) {
      // 3수: 21 세로 그을 때 손가락 움직임 속도에 맞춰 천천히 2행([3, 4, 5]) 세로 반사 플립!
      this.boardOps = [...V4_EXAMPLE_STEPS[2].boardOps];
      this.renderBoard();

      // 손가락이 21에서 아래로 쓱 내려가기 시작하는 순간(t = 250ms)에 2행 3D 플립 발동
      const t1 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 3) {
          this.addCellAnimClass([3, 4, 5], 'tut-cell-flipping-v');
          soundEngine.playFlip();
        }
      }, 250);

      // 플립 회전 중간 시점(t = 650ms): 2행 타일들이 세로 반사로 갱신 (MY² = 0 상쇄)
      const t2 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 3) {
          this.boardOps = [...V4_EXAMPLE_STEPS[3].boardOps];
          this.renderBoard();
        }
      }, 650);

      const t3 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 3) {
          this.removeCellAnimClass([3, 4, 5], 'tut-cell-flipping-v');
        }
      }, 1100);

      this.v4AnimTimers.push(t1, t2, t3);

    } else if (this.v4SubStep === 4) {
      // 4수: 11 손가락 1개로 두 번 톡톡 -> 그때마다 90도씩 회전해서 180도 회전 완성!
      this.boardOps = [...V4_EXAMPLE_STEPS[3].boardOps];
      this.renderBoard();

      // [1회 톡] t = 200ms: 손가락이 11을 톡 누르는 순간 1행 전체([0, 1, 2]) 90° 시계 회전!
      const t1 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 4) {
          this.addCellAnimClass([0, 1, 2], 'tut-cell-rotating-90');
          this.boardOps[0] = composeOps(V4_EXAMPLE_STEPS[3].boardOps[0], D4.R90);
          this.boardOps[1] = composeOps(V4_EXAMPLE_STEPS[3].boardOps[1], D4.R90);
          this.boardOps[2] = composeOps(V4_EXAMPLE_STEPS[3].boardOps[2], D4.R90);
          this.renderBoard();
          soundEngine.playTap();
        }
      }, 200);

      const t2 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 4) {
          this.removeCellAnimClass([0, 1, 2], 'tut-cell-rotating-90');
        }
      }, 520);

      // [2회 톡] t = 620ms: 손가락이 11을 다시 톡 누르는 순간 1행 전체 다시 90° 추가 회전 (총 180° 회전 및 전체 0번 완성!)
      const t3 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 4) {
          this.addCellAnimClass([0, 1, 2], 'tut-cell-rotating-90');
          this.boardOps = [...V4_EXAMPLE_STEPS[4].boardOps];
          this.renderBoard();
          soundEngine.playWin();
        }
      }, 620);

      const t4 = setTimeout(() => {
        if (this.currentStep === 2 && this.v4SubStep === 4) {
          this.removeCellAnimClass([0, 1, 2], 'tut-cell-rotating-90');
        }
      }, 980);

      this.v4AnimTimers.push(t1, t2, t3, t4);
    }
  }

  /**
   * D4 실전 예제 서브 스텝 변경
   * 1수: 11 1회 탭 -> 1행 90° 시계 회전
   * 2수: 31 두 번 클릭 -> 3행 180° 회전 (각 90°씩 순차 회전)
   * 3수: 13 세로 쓱 그을 때 손가락 속도에 맞춰 3열 세로 반사 플립
   * 4수: 주대각선 ↘ 쓱 그을 때 손가락 속도에 맞춰 주대각선 대각 반사 플립
   * 5수: 12 가로 ↔ 쓱 밀 때 손가락 속도에 맞춰 2열 가로 반사 플립 및 전체 0번 완성!
   */
  public goToD4SubStep(subStep: number, playSound = true): void {
    this.clearD4AnimTimers();
    this.d4SubStep = Math.max(0, Math.min(D4_EXAMPLE_STEPS.length - 1, subStep));
    const stepData = D4_EXAMPLE_STEPS[this.d4SubStep];

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
      this.updateHandDemo(3, this.d4SubStep);
    }

    if (this.d4SubStep === 0) {
      // 0수 (초기 상태)
      this.boardOps = [...stepData.boardOps];
      this.renderBoard();
      if (playSound) soundEngine.playTap();

    } else if (this.d4SubStep === 1) {
      // 1수: 1행 1열 1회 탭 -> 1행 전체([0, 1, 2]) 90° 시계 회전!
      this.boardOps = [...D4_EXAMPLE_STEPS[0].boardOps];
      this.renderBoard();

      const t1 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 1) {
          this.addCellAnimClass([0, 1, 2], 'tut-cell-rotating-90');
          this.boardOps = [...D4_EXAMPLE_STEPS[1].boardOps];
          this.renderBoard();
          soundEngine.playTap();
        }
      }, 150);

      const t2 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 1) {
          this.removeCellAnimClass([0, 1, 2], 'tut-cell-rotating-90');
        }
      }, 550);

      this.d4AnimTimers.push(t1, t2);

    } else if (this.d4SubStep === 2) {
      // 2수: 3행 1열 두 번 톡톡 -> 3행 전체([6, 7, 8]) 180° 회전!
      this.boardOps = [...D4_EXAMPLE_STEPS[1].boardOps];
      this.renderBoard();

      // [1회 톡] t = 200ms: 3행 90° 회전
      const t1 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 2) {
          this.addCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
          this.boardOps[6] = composeOps(D4_EXAMPLE_STEPS[1].boardOps[6], D4.R90);
          this.boardOps[7] = composeOps(D4_EXAMPLE_STEPS[1].boardOps[7], D4.R90);
          this.boardOps[8] = composeOps(D4_EXAMPLE_STEPS[1].boardOps[8], D4.R90);
          this.renderBoard();
          soundEngine.playTap();
        }
      }, 200);

      const t2 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 2) {
          this.removeCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
        }
      }, 520);

      // [2회 톡] t = 620ms: 3행 추가 90° 회전 (총 180° 회전 완성!)
      const t3 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 2) {
          this.addCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
          this.boardOps = [...D4_EXAMPLE_STEPS[2].boardOps];
          this.renderBoard();
          soundEngine.playTap();
        }
      }, 620);

      const t4 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 2) {
          this.removeCellAnimClass([6, 7, 8], 'tut-cell-rotating-90');
        }
      }, 980);

      this.d4AnimTimers.push(t1, t2, t3, t4);

    } else if (this.d4SubStep === 3) {
      // 3수: 13 성분 세로 쓱 그을 때 손가락 이동 속도(약 0.8s)에 맞춰 천천히 3열([2, 5, 8]) 세로 반사 플립!
      this.boardOps = [...D4_EXAMPLE_STEPS[2].boardOps];
      this.renderBoard();

      const t1 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 3) {
          this.addCellAnimClass([2, 5, 8], 'tut-cell-flipping-v');
          soundEngine.playFlip();
        }
      }, 80);

      const t2 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 3) {
          this.boardOps = [...D4_EXAMPLE_STEPS[3].boardOps];
          this.renderBoard();
        }
      }, 400);

      const t3 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 3) {
          this.removeCellAnimClass([2, 5, 8], 'tut-cell-flipping-v');
        }
      }, 880);

      this.d4AnimTimers.push(t1, t2, t3);

    } else if (this.d4SubStep === 4) {
      // 4수: 주대각(idx 8) 대각선 쓱 그을 때 손가락 이동 속도(약 0.8s)에 맞춰 천천히 주대각([0, 4, 8]) 대각 반사 플립!
      this.boardOps = [...D4_EXAMPLE_STEPS[3].boardOps];
      this.renderBoard();

      const t1 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 4) {
          this.addCellAnimClass([0, 4, 8], 'tut-cell-flipping-diag');
          soundEngine.playFlip();
        }
      }, 80);

      const t2 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 4) {
          this.boardOps = [...D4_EXAMPLE_STEPS[4].boardOps];
          this.renderBoard();
        }
      }, 400);

      const t3 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 4) {
          this.removeCellAnimClass([0, 4, 8], 'tut-cell-flipping-diag');
        }
      }, 880);

      this.d4AnimTimers.push(t1, t2, t3);

    } else if (this.d4SubStep === 5) {
      // 5수: 12 성분 가로 쓱 밀 때 손가락 이동 속도(약 0.8s)에 맞춰 천천히 2열([1, 4, 7]) 가로 반사 플립 및 전체 0번 완성!
      this.boardOps = [...D4_EXAMPLE_STEPS[4].boardOps];
      this.renderBoard();

      const t1 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 5) {
          this.addCellAnimClass([1, 4, 7], 'tut-cell-flipping-h');
          soundEngine.playFlip();
        }
      }, 80);

      const t2 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 5) {
          this.boardOps = [...D4_EXAMPLE_STEPS[5].boardOps];
          this.renderBoard();
          soundEngine.playWin();
          const btnActionText = document.getElementById('tut-btn-action-text');
          if (btnActionText) {
            btnActionText.textContent = '🎮 실전 퍼즐 시작하기';
          }
        }
      }, 400);

      const t3 = setTimeout(() => {
        if (this.currentStep === 3 && this.d4SubStep === 5) {
          this.removeCellAnimClass([1, 4, 7], 'tut-cell-flipping-h');
        }
      }, 880);

      this.d4AnimTimers.push(t1, t2, t3);
    }
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
      if (this.currentStep === 2) {
        const nextSub = (this.v4SubStep + 1) % V4_EXAMPLE_STEPS.length;
        this.goToV4SubStep(nextSub, false);
      } else if (this.currentStep === 3) {
        const nextSub = (this.d4SubStep + 1) % D4_EXAMPLE_STEPS.length;
        this.goToD4SubStep(nextSub, false);
      } else {
        this.stopAutoPlay();
      }
    }, 1400);
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
    const btnAuto = document.getElementById('btn-tut-autoplay');
    if (btnAuto) btnAuto.style.display = 'block';
    if (formulaCard) formulaCard.style.display = 'none';
    if (gestureCard) gestureCard.style.display = 'none';
    if (masterCard) masterCard.style.display = 'none';
    if (boardWrapper) boardWrapper.style.display = 'block';

    switch (step) {
      case 1:
        stepNameEl.textContent = 'STEP 1. 퍼즐 목표 & 행렬 변환 실전 시연';
        mainTextEl.textContent = '난이도와 모드에 따라 행과 열의 회전과 반사로 뒤섞인 모든 강아지들을, 행과 열 변환만으로 모두 처음의 강아지로 만드는 것이 목적이에요';
        subTextEl.textContent = '① 11 가로 쓱(1행 반사 MX) ➔ ② 12 세로 쓱(180° 회전 R180) ➔ ③ 31 3회 클릭(3행 회전 R270) ➔ ④ 21 대각선 긋기(2행 대각 변환)';
        if (moveController) {
          moveController.style.display = 'flex';
          if (btnAuto) btnAuto.style.display = 'none';
        }
        this.renderMovePills(STEP1_SUB_DEMOS, this.step1SubStep, (idx) => {
          this.stopStep1DemoLoop();
          this.goToStep1SubStep(idx);
        });
        this.goToStep1SubStep(this.step1SubStep, false);
        this.startStep1DemoLoop();
        if (btnActionText) btnActionText.textContent = '다음 (1/3) ➔';
        soundEngine.speak('난이도와 모드에 따라 행과 열의 회전과 반사로 뒤섞인 모든 강아지들을, 행과 열 변환만으로 모두 처음의 강아지로 만드는 것이 목적이에요.');
        break;

      case 2:
        stepNameEl.textContent = 'STEP 2. [V4 실전] V4 4수 최단 풀이';
        mainTextEl.textContent = 'V4 모드는 {0, 180, X축(가로), Y축(세로)} 4가지 대칭 변환만 사용해요!';
        subTextEl.textContent = '👆 위의 [1수], [2수]... 버튼을 차례로 누르거나 [▶ 한 수씩 보기]를 누르면 손동작과 함께 4수 풀이가 실시간으로 펼쳐져요!';
        if (moveController) moveController.style.display = 'flex';
        this.renderMovePills(V4_EXAMPLE_STEPS, this.v4SubStep, (idx) => this.goToV4SubStep(idx));
        this.goToV4SubStep(this.v4SubStep, false);
        if (btnActionText) btnActionText.textContent = '다음 (2/3) ➔';
        soundEngine.speak('V4 모드에서는 0도, 180도, X축 대칭, Y축 대칭 변환만 사용해요. 위의 수 버튼을 눌러 4수 풀이 과정을 확인해 보세요.');
        break;

      case 3:
        stepNameEl.textContent = 'STEP 3. [D4 실전] 8차 정이면체군 D4 5수 묘수 풀이';
        mainTextEl.textContent = 'D4 모드는 회전 4종(0°, 90°, 180°, 270°)과 반사 4종(가로, 세로, 주대각, 부대각) 총 8가지 변환을 사용해요!';
        subTextEl.textContent = '👆 위의 [1수] ~ [5수] 버튼이나 [▶ 한 수씩 보기]를 누르면 대각선과 회전이 어우러진 5수 묘수 풀이가 실시간으로 펼쳐져요!';
        if (moveController) moveController.style.display = 'flex';
        this.renderMovePills(D4_EXAMPLE_STEPS, this.d4SubStep, (idx) => this.goToD4SubStep(idx));
        this.goToD4SubStep(this.d4SubStep, false);
        if (btnActionText) btnActionText.textContent = '🎮 실전 퍼즐 시작하기';
        soundEngine.speak('D4 모드에서는 회전 네 가지와 반사 네 가지 총 여덟 가지 대칭 변환을 모두 사용해요. 대각선 반사와 회전으로 단 5수 만에 완성하는 묘수 풀이를 보여드릴게요.');
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
