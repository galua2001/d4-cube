import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isTutorialCompleted,
  markTutorialCompleted,
  getBadgeText,
  TutorialModalController,
  TUTORIAL_STORAGE_KEY,
  STEP1_SUB_DEMOS,
  STEP2_SUB_DEMOS,
  V4_EXAMPLE_STEPS,
  D4_EXAMPLE_STEPS
} from './tutorialModal';
import { D4, composeOps } from '../core/group';

describe('TutorialModal & Group Theory Core Logic (6단계 슬라이드 및 실전 예제)', () => {
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
        let elId = id;
        const classSet = new Set<string>();
        let rawClassName = '';
        const elObj: any = {
          get id() { return elId; },
          set id(val: string) {
            delete elements[elId];
            elId = val;
            elements[val] = elObj;
          },
          style: {},
          get className() { return rawClassName; },
          set className(val: string) {
            rawClassName = val;
            classSet.clear();
            val.split(/\s+/).filter(Boolean).forEach(c => classSet.add(c));
          },
          classList: {
            classes: classSet,
            add(c: string) { classSet.add(c); rawClassName = Array.from(classSet).join(' '); },
            remove(c: string) { classSet.delete(c); rawClassName = Array.from(classSet).join(' '); },
            contains(c: string) { return classSet.has(c); },
            toggle(c: string, force?: boolean) {
              if (force === true) this.add(c);
              else if (force === false) this.remove(c);
              else if (classSet.has(c)) this.remove(c);
              else this.add(c);
            }
          },
          dataset: {},
          textContent: '',
          innerText: '',
          children: [] as any[],
          querySelector: vi.fn(),
          appendChild: vi.fn(function(child: any) {
            elObj.children.push(child);
            return child;
          }),
          remove: vi.fn(),
          addEventListener: vi.fn()
        };
        elements[id] = elObj;
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

  describe('로컬스토리지 완료 상태 관리 및 하위 호환성', () => {
    it('초기에는 튜토리얼 미완료 상태여야 함', () => {
      expect(isTutorialCompleted()).toBe(false);
    });

    it('markTutorialCompleted 호출 시 로컬스토리지에 true로 저장되어야 함', () => {
      markTutorialCompleted();
      expect(isTutorialCompleted()).toBe(true);
      expect(localStorage.getItem(TUTORIAL_STORAGE_KEY)).toBe('true');
    });

    it('하위 호환성을 위해 STEP2_SUB_DEMOS는 STEP1_SUB_DEMOS와 동일하게 유지되어야 함', () => {
      expect(STEP2_SUB_DEMOS).toBe(STEP1_SUB_DEMOS);
    });
  });

  describe('[STEP 4] V4 클라인 4원군 4수 실전 예제 수학적 완전 검증', () => {
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

  describe('[STEP 5] D4 정이면체군 5수 묘수 풀이 수학적 완전 검증', () => {
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

  describe('TutorialModalController 총 6단계 슬라이드 뷰어 네비게이션 & 실전 수 조작', () => {
    it('open(1) 호출 시 1단계(퍼즐 목표 & 행렬 변환 실전 시연)부터 시작해야 하며 STEP1_SUB_DEMOS가 3개 탑재되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      expect(ctrl.isOpen).toBe(true);
      expect(ctrl.currentStep).toBe(1);
      expect(ctrl.step1SubStep).toBe(0);

      // STEP1_SUB_DEMOS 3종 검증
      expect(STEP1_SUB_DEMOS.length).toBe(3);
      // ① 11 가로 반사 MX
      expect(STEP1_SUB_DEMOS[0].boardOps[0]).toBe(D4.MX);
      expect(STEP1_SUB_DEMOS[0].highlightCells).toEqual([0, 1, 2]);
      // ② 12 180° 회전 R180
      expect(STEP1_SUB_DEMOS[1].boardOps[1]).toBe(D4.R180);
      expect(STEP1_SUB_DEMOS[1].highlightCells).toEqual([1, 4, 7]);
      // ③ 31 대각선 변환 MD/MAD
      expect(STEP1_SUB_DEMOS[2].label).toContain('31 대각선 변환');
      expect(STEP1_SUB_DEMOS[2].boardOps[2]).toBe(D4.MAD);
      expect(STEP1_SUB_DEMOS[2].highlightCells).toEqual([2, 4, 6]);
    });

    it('2단계 진입 시 반사+반사=회전 원리(V4 클라인 4원군)가 시연되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(2);
      expect(ctrl.currentStep).toBe(2);
      expect(ctrl.boardOps[0]).toBe(D4.R180);
      expect(ctrl.boardOps[1]).toBe(D4.MX);
      expect(ctrl.boardOps[2]).toBe(D4.MX);
      expect(ctrl.boardOps[3]).toBe(D4.MY);
      expect(ctrl.boardOps[6]).toBe(D4.MY);
    });

    it('3단계 진입 시 D4 8가지 원소 예시 보드가 시연되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(3);
      expect(ctrl.currentStep).toBe(3);
      expect(ctrl.boardOps[1]).toBe(D4.R90);
      expect(ctrl.boardOps[2]).toBe(D4.R180);
      expect(ctrl.boardOps[3]).toBe(D4.R270);
    });

    it('4단계 진입 시 V4 실전 예제 초기 상태가 로드되고 goToV4SubStep으로 서브 스텝 탐색이 가능해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(4);
      expect(ctrl.currentStep).toBe(4);
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

    it('5단계 진입 시 D4 실전 예제 초기 상태가 로드되고 goToD4SubStep으로 서브 스텝 탐색이 가능해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(5);
      expect(ctrl.currentStep).toBe(5);
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

    it('6단계 진입 시 모든 타일이 0번(ID) 상태이며 마스터 카드가 준비되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(6);
      expect(ctrl.currentStep).toBe(6);
      expect(ctrl.boardOps.every(op => op === D4.ID)).toBe(true);
    });

    it('nextStep() 및 prevStep()으로 1단계부터 6단계까지 부드럽게 순회되어야 함', () => {
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

      ctrl.prevStep(); // 6 -> 5
      expect(ctrl.currentStep).toBe(5);

      ctrl.prevStep(); // 5 -> 4
      expect(ctrl.currentStep).toBe(4);
    });

    it('goToStep(s)으로 1~6 범위를 안전하게 클램핑하며 점프해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      ctrl.goToStep(4);
      expect(ctrl.currentStep).toBe(4);

      ctrl.goToStep(10);
      expect(ctrl.currentStep).toBe(6);

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

    it('3×3 보드의 타일 라벨 생성 시 외곽 컨트롤러 5개만 라벨이 표시되고 내부/대각 성분(4, 5, 7, 8)에는 라벨이 없어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      // 0번: 1행/1열 듀얼 스위치 보유
      const cell0 = document.getElementById('tut-cell-0') as any;
      const hasSwitch0 = cell0?.children.some((c: any) => c.classList.contains('dual-switch-11'));
      expect(hasSwitch0).toBe(true);

      // 1번 (0,1): 2열 라벨
      const cell1 = document.getElementById('tut-cell-1') as any;
      const label1 = cell1?.children.find((c: any) => c.classList.contains('controller-guide-label'));
      expect(label1?.innerText).toBe('2열');

      // 2번 (0,2): 3열 라벨
      const cell2 = document.getElementById('tut-cell-2') as any;
      const label2 = cell2?.children.find((c: any) => c.classList.contains('controller-guide-label'));
      expect(label2?.innerText).toBe('3열');

      // 3번 (1,0): 2행 라벨
      const cell3 = document.getElementById('tut-cell-3') as any;
      const label3 = cell3?.children.find((c: any) => c.classList.contains('controller-guide-label'));
      expect(label3?.innerText).toBe('2행');

      // 6번 (2,0): 3행 라벨
      const cell6 = document.getElementById('tut-cell-6') as any;
      const label6 = cell6?.children.find((c: any) => c.classList.contains('controller-guide-label'));
      expect(label6?.innerText).toBe('3행');

      // 4번(22), 5번(23), 7번(32), 8번(33): 어떠한 컨트롤러 가이드 라벨도 없어야 함
      [4, 5, 7, 8].forEach((idx) => {
        const cell = document.getElementById(`tut-cell-${idx}`) as any;
        const hasGuideLabel = cell?.children.some((c: any) => c.classList.contains('controller-guide-label'));
        const hasSwitch = cell?.children.some((c: any) => c.classList.contains('dual-switch-11'));
        expect(hasGuideLabel).toBe(false);
        expect(hasSwitch).toBe(false);
      });
    });

    it('6단계에서 nextStep 또는 completeTutorial 호출 시 튜토리얼 완료 처리되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(6);
      ctrl.nextStep(); // 6단계에서 다음 누르면 completeTutorial 실행
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
      ctrl.open(4);
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

      // 1단계 서브 시연 1: 11 가로 밀기 시연
      expect(handEl?.classList.contains('hand-anim-cell-swipe-h')).toBe(true);
      expect(bubbleEl?.textContent).toContain('11 가로');

      // 1단계 서브 시연 2: 12 세로 밀기 시연
      ctrl.goToStep1SubStep(1);
      expect(handEl?.classList.contains('hand-anim-cell-swipe-v')).toBe(true);
      expect(bubbleEl?.textContent).toContain('12 세로');

      // 1단계 서브 시연 3: 31 대각선 변환 시연
      ctrl.goToStep1SubStep(2);
      expect(handEl?.classList.contains('hand-anim-cell-diag-combo')).toBe(true);
      expect(bubbleEl?.textContent).toContain('31 대각선');

      // 2단계: 세로 밀기 스와이프
      ctrl.goToStep(2);
      expect(handEl?.classList.contains('hand-anim-swipe-v')).toBe(true);
      expect(bubbleEl?.textContent).toContain('세로');

      // 3단계: D4 8차 대칭군 안내
      ctrl.goToStep(3);
      expect(handEl?.classList.contains('hand-anim-tap')).toBe(true);

      // 4단계 V4 서브 스텝별 손동작
      ctrl.goToStep(4);
      ctrl.goToV4SubStep(1); // 1수: 3행 더블탭
      expect(handEl?.classList.contains('hand-anim-double-tap')).toBe(true);

      ctrl.goToV4SubStep(2); // 2수: 3열 세로 밀기
      expect(handEl?.classList.contains('hand-anim-swipe-col3')).toBe(true);

      // 5단계 D4 서브 스텝별 손동작
      ctrl.goToStep(5);
      ctrl.goToD4SubStep(1); // 1수: 1행 1회 탭
      expect(handEl?.classList.contains('hand-anim-tap')).toBe(true);

      ctrl.goToD4SubStep(4); // 4수: 대각선 밀기
      expect(handEl?.classList.contains('hand-anim-swipe-diag')).toBe(true);

      // 6단계: 완료 시 보드 및 손가락 숨김
      ctrl.goToStep(6);
      expect(handEl?.style.display).toBe('none');
    });

    it('1단계 서브 시연 이동 시 실시간 보드 변환 및 타일 플립 애니메이션 클래스가 올바르게 부여되어야 함', () => {
      vi.useFakeTimers();
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      ctrl.stopStep1DemoLoop();

      // 11 가로 밀기 플립 애니메이션
      ctrl.goToStep1SubStep(0);
      vi.advanceTimersByTime(350);
      const cell0 = document.getElementById('tut-cell-0');
      expect(cell0?.classList.contains('tut-cell-flipping-h')).toBe(true);

      vi.advanceTimersByTime(300); // 650ms 시점
      expect(ctrl.boardOps[0]).toBe(D4.MX);

      vi.advanceTimersByTime(500); // 1150ms 시점 (애니메이션 완료 후 제거)
      expect(cell0?.classList.contains('tut-cell-flipping-h')).toBe(false);

      // 12 세로 밀기 플립 애니메이션
      ctrl.goToStep1SubStep(1);
      vi.advanceTimersByTime(350);
      const cell1 = document.getElementById('tut-cell-1');
      expect(cell1?.classList.contains('tut-cell-flipping-v-r180')).toBe(true);

      vi.advanceTimersByTime(300);
      expect(ctrl.boardOps[1]).toBe(D4.R180);

      // 13 3단 대각선 변환 (주대각 MD ➔ 부대각 MAD ➔ 다시 부대각 복원 ID)
      ctrl.goToStep1SubStep(2);
      // 1단계 (t = 350ms): 주대각선 [0, 4, 8] 플립
      vi.advanceTimersByTime(350);
      const cell0Diag = document.getElementById('tut-cell-0');
      expect(cell0Diag?.classList.contains('tut-cell-flipping-diag')).toBe(true);

      vi.advanceTimersByTime(300); // 650ms
      expect(ctrl.boardOps[0]).toBe(D4.MD);

      // 2단계 (t = 1250ms): 부대각선 [2, 4, 6] 플립
      vi.advanceTimersByTime(600); // 누적 1250ms
      const cell2 = document.getElementById('tut-cell-2');
      expect(cell2?.classList.contains('tut-cell-flipping-diag')).toBe(true);

      vi.advanceTimersByTime(300); // 누적 1550ms
      expect(ctrl.boardOps[2]).toBe(D4.MAD);

      // 3단계 (t = 2450ms): 다시 부대각선 플립으로 ID 복원 (MAD² = ID)
      vi.advanceTimersByTime(900); // 누적 2450ms
      expect(ctrl.boardOps[2]).toBe(D4.ID);

      vi.useRealTimers();
    });

    it('설명글과 하단 버튼 텍스트가 6단계 공식 규격에 완벽히 부합해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      const mainTextEl = document.getElementById('tut-main-text');
      const btnActionText = document.getElementById('tut-btn-action-text');

      expect(mainTextEl?.textContent).toBe('난이도와 모드에 따라 행과 열의 회전과 반사로 뒤섞인 모든 강아지들을, 행과 열 변환만으로 모두 처음의 강아지로 만드는 것이 목적이에요');
      expect(btnActionText?.textContent).toBe('다음 (1/6) ➔');

      ctrl.goToStep(2);
      expect(mainTextEl?.textContent).toContain('180° 회전이 돼요');
      expect(btnActionText?.textContent).toBe('다음 (2/6) ➔');

      ctrl.goToStep(3);
      expect(mainTextEl?.textContent).toContain('8차 대칭군 D4');
      expect(btnActionText?.textContent).toBe('다음 (3/6) ➔');

      ctrl.goToStep(4);
      expect(mainTextEl?.textContent).toContain('V4 실전 예제');
      expect(btnActionText?.textContent).toBe('다음 (4/6) ➔');

      ctrl.goToStep(5);
      expect(mainTextEl?.textContent).toContain('D4 실전 예제');
      expect(btnActionText?.textContent).toBe('다음 (5/6) ➔');

      ctrl.goToStep(6);
      expect(mainTextEl?.textContent).toBe('준비 완료! 이제 실전 퍼즐에 도전해 보세요');
      expect(btnActionText?.textContent).toBe('🎮 실전 퍼즐 시작하기');
    });
  });
});
