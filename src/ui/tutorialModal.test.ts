import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isTutorialCompleted,
  markTutorialCompleted,
  getBadgeText,
  TutorialModalController,
  TUTORIAL_STORAGE_KEY,
  STEP2_SUB_DEMOS,
  V4_EXAMPLE_STEPS,
  D4_EXAMPLE_STEPS
} from './tutorialModal';
import { D4, composeOps } from '../core/group';

describe('TutorialModal & Group Theory Core Logic (7단계 슬라이드 및 실전 예제)', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    const mockStorage = {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); }
    };
    vi.stubGlobal('localStorage', mockStorage);

    // 가상 Document Mock
    const elements: Record<string, any> = {};
    const getOrCreateEl = (id: string) => {
      if (!elements[id]) {
        elements[id] = {
          id,
          style: {},
          classList: {
            classes: new Set<string>(),
            add(c: string) { this.classes.add(c); },
            remove(c: string) { this.classes.delete(c); },
            contains(c: string) { return this.classes.has(c); },
            toggle(c: string, force?: boolean) {
              if (force === true) this.classes.add(c);
              else if (force === false) this.classes.delete(c);
              else if (this.classes.has(c)) this.classes.delete(c);
              else this.classes.add(c);
            }
          },
          dataset: {},
          textContent: '',
          innerText: '',
          querySelector: vi.fn(),
          appendChild: vi.fn(),
          remove: vi.fn(),
          addEventListener: vi.fn()
        };
      }
      return elements[id];
    };

    const mockDocument = {
      getElementById: (id: string) => getOrCreateEl(id),
      querySelectorAll: (_sel: string) => [],
      createElement: (tag: string) => getOrCreateEl(`gen-${tag}-${Math.random()}`),
      body: { appendChild: vi.fn() }
    };
    vi.stubGlobal('document', mockDocument);

    vi.restoreAllMocks();
  });

  describe('D4 군론 수학 공식 합성 검증', () => {
    it('가로 대칭(MX) + 세로 대칭(MY) 합성은 180도 회전(R180)이어야 함 (반사 + 반사 = 회전)', () => {
      const result = composeOps(D4.MX, D4.MY);
      expect(result).toBe(D4.R180);
    });

    it('대칭 연산은 2회 합성 시 항등원(ID)으로 자기상쇄되어야 함 (S^2 = ID)', () => {
      expect(composeOps(D4.MX, D4.MX)).toBe(D4.ID);
      expect(composeOps(D4.MY, D4.MY)).toBe(D4.ID);
      expect(composeOps(D4.MD, D4.MD)).toBe(D4.ID);
    });

    it('V4 클라인 4원군 부분군 {ID, MX, MY, R180}의 닫힘성과 교환법칙 검증', () => {
      // MX ∘ MY = MY ∘ MX = R180
      expect(composeOps(D4.MX, D4.MY)).toBe(D4.R180);
      expect(composeOps(D4.MY, D4.MX)).toBe(D4.R180);
      // R180 ∘ MX = MY, R180 ∘ MY = MX
      expect(composeOps(D4.R180, D4.MX)).toBe(D4.MY);
      expect(composeOps(D4.R180, D4.MY)).toBe(D4.MX);
    });
  });

  describe('뱃지 텍스트 매핑', () => {
    it('각 D4 상태에 대응하는 뱃지 텍스트를 정확히 반환해야 함', () => {
      expect(getBadgeText(D4.ID)).toBe('0');
      expect(getBadgeText(D4.MX)).toBe('X');
      expect(getBadgeText(D4.MY)).toBe('Y');
      expect(getBadgeText(D4.R180)).toBe('180');
      expect(getBadgeText(D4.R90)).toBe('90');
      expect(getBadgeText(D4.R270)).toBe('270');
      expect(getBadgeText(D4.MD)).toBe('D');
      expect(getBadgeText(D4.MAD)).toBe('AD');
    });
  });

  describe('로컬스토리지 완료 상태 관리', () => {
    it('초기에는 튜토리얼 미완료 상태여야 함', () => {
      expect(isTutorialCompleted()).toBe(false);
    });

    it('markTutorialCompleted 호출 시 로컬스토리지에 true로 저장되어야 함', () => {
      markTutorialCompleted();
      expect(isTutorialCompleted()).toBe(true);
      expect(localStorage.getItem(TUTORIAL_STORAGE_KEY)).toBe('true');
    });
  });

  describe('[STEP 5] V4 클라인 4원군 4수 실전 예제 수학적 완전 검증', () => {
    it('V4_EXAMPLE_STEPS의 각 단계(0~4수)가 정확한 보드 상태를 가지며 4수 후 모든 타일이 ID여야 함', () => {
      expect(V4_EXAMPLE_STEPS.length).toBe(5);

      // 0수 (초기)
      expect(V4_EXAMPLE_STEPS[0].boardOps).toEqual([
        D4.R180, D4.R180, D4.MX,
        D4.MY,   D4.MY,   D4.ID,
        D4.R180, D4.R180, D4.MX
      ]);

      // 1수 (3행 R180 적용)
      expect(V4_EXAMPLE_STEPS[1].boardOps).toEqual([
        D4.R180, D4.R180, D4.MX,
        D4.MY,   D4.MY,   D4.ID,
        D4.ID,   D4.ID,   D4.MY
      ]);

      // 2수 (3열 MY 적용)
      expect(V4_EXAMPLE_STEPS[2].boardOps).toEqual([
        D4.R180, D4.R180, D4.R180,
        D4.MY,   D4.MY,   D4.MY,
        D4.ID,   D4.ID,   D4.ID
      ]);

      // 3수 (2행 MY 적용)
      expect(V4_EXAMPLE_STEPS[3].boardOps).toEqual([
        D4.R180, D4.R180, D4.R180,
        D4.ID,   D4.ID,   D4.ID,
        D4.ID,   D4.ID,   D4.ID
      ]);

      // 4수 (1행 R180 적용 -> 전체 완성!)
      expect(V4_EXAMPLE_STEPS[4].boardOps.every(op => op === D4.ID)).toBe(true);
    });
  });

  describe('[STEP 6] D4 정이면체군 5수 묘수 풀이 수학적 완전 검증', () => {
    it('D4_EXAMPLE_STEPS의 각 단계(0~5수)가 정확한 보드 상태를 가지며 5수 후 모든 타일이 ID여야 함', () => {
      expect(D4_EXAMPLE_STEPS.length).toBe(6);

      // 0수 (초기)
      expect(D4_EXAMPLE_STEPS[0].boardOps).toEqual([
        D4.MX,   D4.MAD, D4.MD,
        D4.ID,   D4.R90, D4.MY,
        D4.R180, D4.MY,  D4.R270
      ]);

      // 1수 (1행 R90 적용)
      expect(D4_EXAMPLE_STEPS[1].boardOps).toEqual([
        D4.MD,   D4.MX,  D4.MY,
        D4.ID,   D4.R90, D4.MY,
        D4.R180, D4.MY,  D4.R270
      ]);

      // 2수 (3행 R180 적용)
      expect(D4_EXAMPLE_STEPS[2].boardOps).toEqual([
        D4.MD,   D4.MX,  D4.MY,
        D4.ID,   D4.R90, D4.MY,
        D4.ID,   D4.MX,  D4.R90
      ]);

      // 3수 (3열 MY 적용)
      expect(D4_EXAMPLE_STEPS[3].boardOps).toEqual([
        D4.MD,   D4.MX,  D4.ID,
        D4.ID,   D4.R90, D4.ID,
        D4.ID,   D4.MX,  D4.MD
      ]);

      // 4수 (↖ 주대각선 MD 적용)
      expect(D4_EXAMPLE_STEPS[4].boardOps).toEqual([
        D4.ID, D4.MX, D4.ID,
        D4.ID, D4.MX, D4.ID,
        D4.ID, D4.MX, D4.ID
      ]);

      // 5수 (2열 MX 적용 -> 전체 완성!)
      expect(D4_EXAMPLE_STEPS[5].boardOps.every(op => op === D4.ID)).toBe(true);
    });
  });

  describe('TutorialModalController 총 7단계 슬라이드 뷰어 네비게이션 & 실전 수 조작', () => {
    it('open(1) 호출 시 1단계(퍼즐의 목표 & 행렬 성분 구조)부터 시작해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      expect(ctrl.isOpen).toBe(true);
      expect(ctrl.currentStep).toBe(1);
      expect(ctrl.boardOps[0]).toBe(D4.MX);
      expect(ctrl.boardOps[4]).toBe(D4.ID);
    });

    it('2단계 진입 시 1행 가로 반사(MX) 변환 상태 및 서브 시연이 준비되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(2);
      expect(ctrl.currentStep).toBe(2);
      expect(ctrl.step2SubStep).toBe(0);
      expect(STEP2_SUB_DEMOS[0].boardOps[0]).toBe(D4.MX);
      expect(STEP2_SUB_DEMOS[0].boardOps[1]).toBe(D4.MX);
      expect(STEP2_SUB_DEMOS[0].boardOps[2]).toBe(D4.MX);
    });

    it('3단계 진입 시 1행 1열은 반사 합성으로 R180(V4 클라인 4원군)이어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(3);
      expect(ctrl.currentStep).toBe(3);
      expect(ctrl.boardOps[0]).toBe(D4.R180);
      expect(ctrl.boardOps[1]).toBe(D4.MX);
      expect(ctrl.boardOps[2]).toBe(D4.MX);
      expect(ctrl.boardOps[3]).toBe(D4.MY);
      expect(ctrl.boardOps[6]).toBe(D4.MY);
    });

    it('4단계 진입 시 D4 8가지 원소 예시 보드가 시연되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(4);
      expect(ctrl.currentStep).toBe(4);
      expect(ctrl.boardOps[1]).toBe(D4.R90);
      expect(ctrl.boardOps[2]).toBe(D4.R180);
      expect(ctrl.boardOps[3]).toBe(D4.R270);
    });

    it('5단계 진입 시 V4 실전 예제 초기 상태가 로드되고 goToV4SubStep으로 서브 스텝 탐색이 가능해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(5);
      expect(ctrl.currentStep).toBe(5);
      expect(ctrl.v4SubStep).toBe(0);
      expect(ctrl.boardOps).toEqual(V4_EXAMPLE_STEPS[0].boardOps);

      // 1수로 변경
      ctrl.goToV4SubStep(1);
      expect(ctrl.v4SubStep).toBe(1);
      expect(ctrl.boardOps).toEqual(V4_EXAMPLE_STEPS[1].boardOps);

      // 4수(완성)로 변경
      ctrl.goToV4SubStep(4);
      expect(ctrl.v4SubStep).toBe(4);
      expect(ctrl.boardOps.every(op => op === D4.ID)).toBe(true);
    });

    it('6단계 진입 시 D4 실전 예제 초기 상태가 로드되고 goToD4SubStep으로 서브 스텝 탐색이 가능해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(6);
      expect(ctrl.currentStep).toBe(6);
      expect(ctrl.d4SubStep).toBe(0);
      expect(ctrl.boardOps).toEqual(D4_EXAMPLE_STEPS[0].boardOps);

      // 2수로 변경
      ctrl.goToD4SubStep(2);
      expect(ctrl.d4SubStep).toBe(2);
      expect(ctrl.boardOps).toEqual(D4_EXAMPLE_STEPS[2].boardOps);

      // 5수(완성)로 변경
      ctrl.goToD4SubStep(5);
      expect(ctrl.d4SubStep).toBe(5);
      expect(ctrl.boardOps.every(op => op === D4.ID)).toBe(true);
    });

    it('7단계 진입 시 모든 타일이 0번(ID) 상태이며 마스터 카드가 준비되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(7);
      expect(ctrl.currentStep).toBe(7);
      expect(ctrl.boardOps.every(op => op === D4.ID)).toBe(true);
    });

    it('nextStep() 및 prevStep()으로 1단계부터 7단계까지 부드럽게 순회되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      ctrl.nextStep(); // 1 -> 2
      expect(ctrl.currentStep).toBe(2);

      ctrl.nextStep(); // 2 -> 3
      expect(ctrl.currentStep).toBe(3);

      ctrl.nextStep(); // 3 -> 4
      expect(ctrl.currentStep).toBe(4);

      ctrl.nextStep(); // 4 -> 5
      expect(ctrl.currentStep).toBe(5);

      ctrl.nextStep(); // 5 -> 6
      expect(ctrl.currentStep).toBe(6);

      ctrl.nextStep(); // 6 -> 7
      expect(ctrl.currentStep).toBe(7);

      ctrl.prevStep(); // 7 -> 6
      expect(ctrl.currentStep).toBe(6);

      ctrl.prevStep(); // 6 -> 5
      expect(ctrl.currentStep).toBe(5);
    });

    it('goToStep(s)으로 1~7 범위를 안전하게 클램핑하며 점프해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      ctrl.goToStep(5);
      expect(ctrl.currentStep).toBe(5);

      ctrl.goToStep(10);
      expect(ctrl.currentStep).toBe(7);

      ctrl.goToStep(-2);
      expect(ctrl.currentStep).toBe(1);
    });

    it('1행 1열 점 클릭 시 행 모드와 열 모드가 자유롭게 토글되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      expect(ctrl.cell11Mode).toBe('row');

      ctrl.handleDotClick();
      expect(ctrl.cell11Mode).toBe('col');

      ctrl.handleDotClick();
      expect(ctrl.cell11Mode).toBe('row');
    });

    it('7단계에서 nextStep 또는 completeTutorial 호출 시 튜토리얼 완료 처리되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(7);
      ctrl.nextStep(); // 7단계에서 다음 누르면 completeTutorial 실행
      expect(ctrl.isOpen).toBe(false);
      expect(isTutorialCompleted()).toBe(true);
    });

    it('skip() 호출 시 튜토리얼이 즉시 닫히고 완료 처리되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      ctrl.skip();
      expect(ctrl.isOpen).toBe(false);
      expect(isTutorialCompleted()).toBe(true);
    });

    it('한 수씩 보기(AutoPlay) 토글 및 정지가 올바르게 작동해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(5);
      expect(ctrl.isAutoPlaying).toBe(false);

      ctrl.toggleAutoPlay();
      expect(ctrl.isAutoPlaying).toBe(true);

      ctrl.stopAutoPlay();
      expect(ctrl.isAutoPlaying).toBe(false);
    });

    it('가상 손가락 애니메이션 요소가 DOM에 생성되고 단계별 제스처 클래스가 올바르게 부여되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      const handEl = document.getElementById('tut-hand-demo');
      const iconEl = document.getElementById('tut-hand-icon');
      const bubbleEl = document.getElementById('tut-hand-bubble');
      expect(handEl).not.toBeNull();
      expect(iconEl).not.toBeNull();
      expect(bubbleEl).not.toBeNull();

      // 1단계: 0번 강아지 정위치 포인팅
      expect(handEl?.classList.contains('hand-anim-point-0')).toBe(true);

      // 2단계: 첫 성분 조작 서브 시연 (11 가로 밀기, 12 세로 밀기, 21 3회 클릭)
      ctrl.goToStep(2);
      expect(handEl?.classList.contains('hand-anim-cell-swipe-h')).toBe(true);
      expect(bubbleEl?.textContent).toContain('11 가로');

      ctrl.goToStep2SubStep(1);
      expect(handEl?.classList.contains('hand-anim-cell-swipe-v')).toBe(true);
      expect(bubbleEl?.textContent).toContain('12 세로');

      ctrl.goToStep2SubStep(2);
      expect(handEl?.classList.contains('hand-anim-cell-triple-tap')).toBe(true);
      expect(bubbleEl?.textContent).toContain('21 클릭');

      // 3단계: 세로 밀기 스와이프
      ctrl.goToStep(3);
      expect(handEl?.classList.contains('hand-anim-swipe-v')).toBe(true);
      expect(bubbleEl?.textContent).toContain('세로');

      // 5단계 V4 서브 스텝별 손동작
      ctrl.goToStep(5);
      ctrl.goToV4SubStep(1); // 1수: 3행 더블탭
      expect(handEl?.classList.contains('hand-anim-double-tap')).toBe(true);

      ctrl.goToV4SubStep(2); // 2수: 3열 세로 밀기
      expect(handEl?.classList.contains('hand-anim-swipe-col3')).toBe(true);

      // 6단계 D4 서브 스텝별 손동작
      ctrl.goToStep(6);
      ctrl.goToD4SubStep(1); // 1수: 1행 1회 탭
      expect(handEl?.classList.contains('hand-anim-tap')).toBe(true);

      ctrl.goToD4SubStep(4); // 4수: 대각선 밀기
      expect(handEl?.classList.contains('hand-anim-swipe-diag')).toBe(true);

      // 7단계: 완료 시 보드 및 손가락 숨김
      ctrl.goToStep(7);
      expect(handEl?.style.display).toBe('none');
    });

    it('설명글이 직관적이고 간결한 핵심 문장으로 반영되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      const mainTextEl = document.getElementById('tut-main-text');
      expect(mainTextEl?.textContent).toBe('난이도에 따라 뒤섞인 모든 강아지를 바른 앞면(0번)으로 맞추면 성공이에요!');

      ctrl.goToStep(2);
      expect(mainTextEl?.textContent).toBe('각 행과 열의 첫 성분에 회전(가운데 클릭)과 반사를 주면 해당되는 행과 열이 같은 변환을 해요');

      ctrl.goToStep(3);
      expect(mainTextEl?.textContent).toContain('180° 회전이 돼요');

      ctrl.goToStep(7);
      expect(mainTextEl?.textContent).toBe('준비 완료! 이제 실전 퍼즐에 도전해 보세요');
    });
  });
});
