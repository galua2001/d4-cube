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

describe('TutorialModal & Group Theory Core Logic (3단계 슬라이드 및 실전 예제)', () => {
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

  describe('[STEP 2] V4 클라인 4원군 4수 실전 예제 수학적 완전 검증', () => {
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

  describe('[STEP 3] D4 정이면체군 5수 묘수 풀이 수학적 완전 검증', () => {
    it('D4_EXAMPLE_STEPS의 각 단계(0~5수)가 정확한 보드 상태를 가지며 5수 후 모든 타일이 ID여야 함', () => {
      expect(D4_EXAMPLE_STEPS.length).toBe(6);

      // 0수 (초기)
      expect(D4_EXAMPLE_STEPS[0].boardOps).toEqual([
        D4.R270, D4.MAD, D4.MD,
        D4.MD,   D4.R90, D4.R90,
        D4.R180, D4.MY,  D4.MX
      ]);

      // 1수 (1행 R90 적용)
      expect(D4_EXAMPLE_STEPS[1].boardOps).toEqual([
        D4.ID,   D4.MX,  D4.MY,
        D4.MD,   D4.R90, D4.R90,
        D4.R180, D4.MY,  D4.MX
      ]);

      // 2수 (3행 R180 적용)
      expect(D4_EXAMPLE_STEPS[2].boardOps).toEqual([
        D4.ID,   D4.MX,  D4.MY,
        D4.MD,   D4.R90, D4.R90,
        D4.ID,   D4.MX,  D4.MY
      ]);

      // 3수 (3열 MY 적용)
      expect(D4_EXAMPLE_STEPS[3].boardOps).toEqual([
        D4.ID,   D4.MX,  D4.ID,
        D4.MD,   D4.R90, D4.MD,
        D4.ID,   D4.MX,  D4.ID
      ]);

      // 4수 (2행 MD 적용)
      expect(D4_EXAMPLE_STEPS[4].boardOps).toEqual([
        D4.ID, D4.MX, D4.ID,
        D4.ID, D4.MX, D4.ID,
        D4.ID, D4.MX, D4.ID
      ]);

      // 5수 (2열 MX 적용 -> 전체 완성!)
      expect(D4_EXAMPLE_STEPS[5].boardOps.every(op => op === D4.ID)).toBe(true);
    });
  });

  describe('TutorialModalController 총 3단계 슬라이드 뷰어 네비게이션 & 실전 수 조작', () => {
    it('open(1) 호출 시 1단계(퍼즐 목표 & 행렬 변환 실전 시연)부터 시작해야 하며 STEP1_SUB_DEMOS가 4개 탑재되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      expect(ctrl.isOpen).toBe(true);
      expect(ctrl.currentStep).toBe(1);
      expect(ctrl.step1SubStep).toBe(0);

      // STEP1_SUB_DEMOS 4종 검증
      expect(STEP1_SUB_DEMOS.length).toBe(4);
      // ① 11 가로 반사 MX
      expect(STEP1_SUB_DEMOS[0].boardOps[0]).toBe(D4.MX);
      expect(STEP1_SUB_DEMOS[0].highlightCells).toEqual([0, 1, 2]);
      // ② 12 180° 회전 R180
      expect(STEP1_SUB_DEMOS[1].boardOps[1]).toBe(D4.R180);
      expect(STEP1_SUB_DEMOS[1].highlightCells).toEqual([1, 4, 7]);
      // ③ 31 3회 클릭 (3행 전체 회전)
      expect(STEP1_SUB_DEMOS[2].label).toContain('31 3회 클릭');
      expect(STEP1_SUB_DEMOS[2].boardOps[6]).toBe(D4.R270);
      expect(STEP1_SUB_DEMOS[2].highlightCells).toEqual([6, 7, 8]);
      // ④ 21 대각선 긋기 (2행 변환)
      expect(STEP1_SUB_DEMOS[3].label).toContain('21 대각선 긋기');
      expect(STEP1_SUB_DEMOS[3].formulaBadge).toContain('[21]');
      expect(STEP1_SUB_DEMOS[3].formulaText).toContain('21 성분 대각선 긋기');
      expect(STEP1_SUB_DEMOS[3].boardOps[3]).toBe(D4.MD);
      expect(STEP1_SUB_DEMOS[3].boardOps[4]).toBe(D4.MD);
      expect(STEP1_SUB_DEMOS[3].boardOps[5]).toBe(D4.MD);
      expect(STEP1_SUB_DEMOS[3].highlightCells).toEqual([3, 4, 5]);
    });

    it('open(2) 호출 시 2단계([V4 실전] V4 4수 최단 풀이) 진입 및 V4 초기 보드 상태 로드와 goToV4SubStep(1~4) 서브 스텝 탐색이 원활히 동작해야 함', () => {
      vi.useFakeTimers();
      const ctrl = new TutorialModalController();
      ctrl.open(2);
      expect(ctrl.currentStep).toBe(2);
      expect(ctrl.v4SubStep).toBe(0);
      expect(ctrl.boardOps).toEqual(V4_EXAMPLE_STEPS[0].boardOps);

      // 1수로 변경 (31 두 번 클릭하여 180도 회전 완성)
      ctrl.goToV4SubStep(1);
      expect(ctrl.v4SubStep).toBe(1);
      vi.advanceTimersByTime(1100);
      expect(ctrl.boardOps).toEqual(V4_EXAMPLE_STEPS[1].boardOps);

      // 2수로 변경 (13 세로 그어 3열 변환)
      ctrl.goToV4SubStep(2);
      expect(ctrl.v4SubStep).toBe(2);
      vi.advanceTimersByTime(800);
      expect(ctrl.boardOps).toEqual(V4_EXAMPLE_STEPS[2].boardOps);

      // 3수로 변경 (21 세로 그어 2행 변환)
      ctrl.goToV4SubStep(3);
      expect(ctrl.v4SubStep).toBe(3);
      vi.advanceTimersByTime(800);
      expect(ctrl.boardOps).toEqual(V4_EXAMPLE_STEPS[3].boardOps);

      // 4수(완성)로 변경 (11 두 번 클릭하여 전체 완성)
      ctrl.goToV4SubStep(4);
      expect(ctrl.v4SubStep).toBe(4);
      vi.advanceTimersByTime(1100);
      expect(ctrl.boardOps.every(op => op === D4.ID)).toBe(true);
      vi.useRealTimers();
    });

    it('open(3) 호출 시 3단계([D4 실전] 8차 정이면체군 D4 5수 묘수 풀이) 진입 및 D4 초기 상태 로드와 goToD4SubStep 서브 스텝 탐색이 가능해야 함', () => {
      vi.useFakeTimers();
      const ctrl = new TutorialModalController();
      ctrl.open(3);
      expect(ctrl.currentStep).toBe(3);
      expect(ctrl.d4SubStep).toBe(0);
      expect(ctrl.boardOps).toEqual(D4_EXAMPLE_STEPS[0].boardOps);

      // 2수로 변경
      ctrl.goToD4SubStep(2);
      expect(ctrl.d4SubStep).toBe(2);
      vi.advanceTimersByTime(1100);
      expect(ctrl.boardOps).toEqual(D4_EXAMPLE_STEPS[2].boardOps);

      // 5수(완성)로 변경
      ctrl.goToD4SubStep(5);
      expect(ctrl.d4SubStep).toBe(5);
      vi.advanceTimersByTime(1100);
      expect(ctrl.boardOps.every(op => op === D4.ID)).toBe(true);
      vi.useRealTimers();
    });

    it('nextStep() 및 prevStep()으로 1단계부터 3단계까지 순회되고 3단계에서 다음 누르면 completeTutorial()이 호출되어 완료 처리되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      ctrl.nextStep(); // 1 -> 2
      expect(ctrl.currentStep).toBe(2);

      ctrl.nextStep(); // 2 -> 3
      expect(ctrl.currentStep).toBe(3);

      ctrl.prevStep(); // 3 -> 2
      expect(ctrl.currentStep).toBe(2);

      ctrl.prevStep(); // 2 -> 1
      expect(ctrl.currentStep).toBe(1);

      // 1 -> 2 -> 3 재이동 후 3단계에서 다음 누르면 completeTutorial 호출되어 닫힘
      ctrl.nextStep(); // 1 -> 2
      ctrl.nextStep(); // 2 -> 3
      expect(ctrl.currentStep).toBe(3);

      ctrl.nextStep(); // 3단계에서 다음 누르면 완료!
      expect(ctrl.isOpen).toBe(false);
      expect(isTutorialCompleted()).toBe(true);
    });

    it('goToStep(s)으로 1~3 범위를 안전하게 클램핑하며 점프해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      ctrl.goToStep(2);
      expect(ctrl.currentStep).toBe(2);

      ctrl.goToStep(3);
      expect(ctrl.currentStep).toBe(3);

      ctrl.goToStep(10);
      expect(ctrl.currentStep).toBe(3); // 3으로 클램핑

      ctrl.goToStep(-2);
      expect(ctrl.currentStep).toBe(1); // 1로 클램핑
    });

    it('1행 1열 점 클릭 시 행 모드와 열 모드가 자유롭게 토글되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      const tileSwitch = document.getElementById('tut-tile-switch-11') as any;
      expect(ctrl.cell11Mode).toBe('row');
      expect(tileSwitch?.classList.contains('mode-row')).toBe(true);

      ctrl.handleDotClick();
      expect(ctrl.cell11Mode).toBe('col');
      expect(tileSwitch?.classList.contains('mode-col')).toBe(true);

      ctrl.handleDotClick();
      expect(ctrl.cell11Mode).toBe('row');
      expect(tileSwitch?.classList.contains('mode-row')).toBe(true);
    });

    it('3×3 보드의 타일 라벨 생성 시 외곽 컨트롤러 5개만 라벨이 표시되고 내부/대각 성분(4, 5, 7, 8)에는 라벨이 없어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      // 0번 타일: 우측 세로 여백에 세로 알약형 스위치(.tut-tile-switch-11)가 배치됨
      const cell0 = document.getElementById('tut-cell-0') as any;
      const tileSwitch0 = cell0?.children.find((c: any) => c.id === 'tut-tile-switch-11' || c.classList.contains('tut-tile-switch-11'));
      expect(tileSwitch0).toBeDefined();
      expect(tileSwitch0?.classList.contains('mode-row')).toBe(true);

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

    it('skip() 호출 시 튜토리얼이 즉시 닫히고 완료 처리되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      ctrl.skip();
      expect(ctrl.isOpen).toBe(false);
      expect(isTutorialCompleted()).toBe(true);
    });

    it('한 수씩 보기(AutoPlay) 토글 및 정지가 올바르게 작동해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(2);
      expect(ctrl.isAutoPlaying).toBe(false);

      ctrl.toggleAutoPlay();
      expect(ctrl.isAutoPlaying).toBe(true);

      ctrl.stopAutoPlay();
      expect(ctrl.isAutoPlaying).toBe(false);

      // 3단계에서도 토글 가능
      ctrl.goToStep(3);
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

      // 1단계 서브 시연 3: 31 3회 클릭 (3행 전체 회전) 시연
      ctrl.goToStep1SubStep(2);
      expect(handEl?.classList.contains('hand-anim-cell-triple-tap')).toBe(true);
      expect(bubbleEl?.textContent).toContain('31');

      // 1단계 서브 시연 4: 21 대각선 긋기 (2행 변환) 시연
      ctrl.goToStep1SubStep(3);
      expect(handEl?.classList.contains('hand-anim-cell-diag-combo')).toBe(true);
      expect(bubbleEl?.textContent).toContain('21 대각선');
      // 손가락 위치: 21 성분 (2행 1열, idx 3) 정중앙
      expect(handEl?.style.left).toBe('16.7%');
      expect(handEl?.style.top).toBe('50.0%');

      // 2단계: V4 서브 스텝별 손동작 및 positionHandAtCell 연동
      ctrl.goToStep(2);
      ctrl.goToV4SubStep(0); // 0수: 상단 [▶ 한 수씩 보기] 버튼 포인팅
      expect(handEl?.classList.contains('hand-anim-point-up')).toBe(true);

      ctrl.goToV4SubStep(1); // 1수: 3행 1열 (idx 6) 손가락 1개로 두 번 클릭
      expect(handEl?.classList.contains('hand-anim-single-double-tap')).toBe(true);
      expect(iconEl?.textContent).toBe('👆');
      expect(handEl?.style.left).toBe('16.7%');
      expect(handEl?.style.top).toBe('83.3%');

      ctrl.goToV4SubStep(2); // 2수: 1행 3열 (idx 2) 세로 밀기
      expect(handEl?.classList.contains('hand-anim-cell-swipe-v')).toBe(true);
      expect(handEl?.style.left).toBe('83.3%');
      expect(handEl?.style.top).toBe('16.7%');

      ctrl.goToV4SubStep(3); // 3수: 2행 1열 (idx 3) 세로 밀기
      expect(handEl?.classList.contains('hand-anim-cell-swipe-v')).toBe(true);
      expect(handEl?.style.left).toBe('16.7%');
      expect(handEl?.style.top).toBe('50.0%');

      ctrl.goToV4SubStep(4); // 4수: 1행 1열 (idx 0) 손가락 1개로 두 번 클릭
      expect(handEl?.classList.contains('hand-anim-single-double-tap')).toBe(true);
      expect(iconEl?.textContent).toBe('👆');
      expect(handEl?.style.left).toBe('16.7%');
      expect(handEl?.style.top).toBe('16.7%');

      // 3단계: [D4 실전] 8차 정이면체군 D4 5수 묘수 풀이 서브 스텝별 손동작
      ctrl.goToStep(3);
      ctrl.goToD4SubStep(0); // 0수: 상단 [▶ 한 수씩 보기] 버튼 포인팅
      expect(handEl?.classList.contains('hand-anim-point-up')).toBe(true);

      ctrl.goToD4SubStep(1); // 1수: 11 1회 탭
      expect(handEl?.classList.contains('hand-anim-tap')).toBe(true);

      ctrl.goToD4SubStep(2); // 2수: 31 두 번 클릭
      expect(handEl?.classList.contains('hand-anim-single-double-tap')).toBe(true);

      ctrl.goToD4SubStep(3); // 3수: 13 세로 쓱
      expect(handEl?.classList.contains('hand-anim-cell-swipe-v')).toBe(true);

      ctrl.goToD4SubStep(4); // 4수: 대각선 쓱
      expect(handEl?.classList.contains('hand-anim-cell-diag-main')).toBe(true);

      ctrl.goToD4SubStep(5); // 5수: 12 가로 쓱
      expect(handEl?.classList.contains('hand-anim-cell-swipe-h')).toBe(true);
    });

    it('1단계 서브 시연 이동 시 실시간 보드 변환 및 타일 플립 애니메이션 클래스가 올바르게 부여되어야 함', () => {
      vi.useFakeTimers();
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      ctrl.stopStep1DemoLoop();

      // 11 가로 밀기 플립 애니메이션
      ctrl.goToStep1SubStep(0);
      vi.advanceTimersByTime(380);
      const cell0 = document.getElementById('tut-cell-0');
      expect(cell0?.classList.contains('tut-cell-flipping-h')).toBe(true);

      vi.advanceTimersByTime(400); // 780ms 시점
      expect(ctrl.boardOps[0]).toBe(D4.MX);

      vi.advanceTimersByTime(450); // 1230ms 시점 (애니메이션 완료 후 제거)
      expect(cell0?.classList.contains('tut-cell-flipping-h')).toBe(false);

      // 12 세로 밀기 플립 애니메이션
      ctrl.goToStep1SubStep(1);
      vi.advanceTimersByTime(350);
      const cell1 = document.getElementById('tut-cell-1');
      expect(cell1?.classList.contains('tut-cell-flipping-v-r180')).toBe(true);

      vi.advanceTimersByTime(300);
      expect(ctrl.boardOps[1]).toBe(D4.R180);

      // 31 3회 클릭 (3행 전체 90°씩 순차 회전: 뒤집힘 없이 tut-cell-rotating-90 적용)
      ctrl.goToStep1SubStep(2);
      const cell6 = document.getElementById('tut-cell-6');
      const cell7 = document.getElementById('tut-cell-7');
      const cell8 = document.getElementById('tut-cell-8');

      // 1회 클릭 (t = 450ms): 3행 [6, 7, 8] 90° 회전 (R90), 회전 애니메이션 클래스 부여 (플립 아님)
      vi.advanceTimersByTime(450);
      expect(cell6?.classList.contains('tut-cell-rotating-90')).toBe(true);
      expect(cell6?.classList.contains('tut-cell-flipping-v')).toBe(false);
      expect(cell7?.classList.contains('tut-cell-rotating-90')).toBe(true);
      expect(cell8?.classList.contains('tut-cell-rotating-90')).toBe(true);
      expect(ctrl.boardOps[6]).toBe(D4.R90);
      expect(ctrl.boardOps[7]).toBe(D4.R90);
      expect(ctrl.boardOps[8]).toBe(D4.R90);

      // t = 850ms: 1회차 회전 애니메이션 클래스 제거
      vi.advanceTimersByTime(400);
      expect(cell6?.classList.contains('tut-cell-rotating-90')).toBe(false);

      // 2회 클릭 (t = 1350ms): 3행 [6, 7, 8] 180° 회전 (R180), 2회차 회전 애니메이션 클래스 부여
      vi.advanceTimersByTime(500); // 누적 1350ms
      expect(cell6?.classList.contains('tut-cell-rotating-90')).toBe(true);
      expect(cell6?.classList.contains('tut-cell-flipping-v')).toBe(false);
      expect(ctrl.boardOps[6]).toBe(D4.R180);
      expect(ctrl.boardOps[7]).toBe(D4.R180);
      expect(ctrl.boardOps[8]).toBe(D4.R180);

      // t = 1750ms: 2회차 회전 애니메이션 클래스 제거
      vi.advanceTimersByTime(400);
      expect(cell6?.classList.contains('tut-cell-rotating-90')).toBe(false);

      // 3회 클릭 (t = 2250ms): 3행 [6, 7, 8] 270° 회전 완성 (R270), 3회차 회전 애니메이션 클래스 부여
      vi.advanceTimersByTime(500); // 누적 2250ms
      expect(cell6?.classList.contains('tut-cell-rotating-90')).toBe(true);
      expect(cell6?.classList.contains('tut-cell-flipping-v')).toBe(false);
      expect(ctrl.boardOps[6]).toBe(D4.R270);
      expect(ctrl.boardOps[7]).toBe(D4.R270);
      expect(ctrl.boardOps[8]).toBe(D4.R270);

      // t = 2650ms: 3회차 회전 애니메이션 클래스 제거
      vi.advanceTimersByTime(400);
      expect(cell6?.classList.contains('tut-cell-rotating-90')).toBe(false);

      // 21 대각선 긋기: 2행 전체([3, 4, 5]) 대각선 반사 (MD ➔ MAD)
      ctrl.goToStep1SubStep(3);
      const cell3 = document.getElementById('tut-cell-3');
      const cell4 = document.getElementById('tut-cell-4');
      const cell5 = document.getElementById('tut-cell-5');

      // 1) 주대각 변환 (t = 450ms): 2행 [3, 4, 5] MD 변환 및 주대각 플립 클래스 부여
      vi.advanceTimersByTime(450);
      expect(cell3?.classList.contains('tut-cell-flipping-diag-main')).toBe(true);
      expect(cell4?.classList.contains('tut-cell-flipping-diag-main')).toBe(true);
      expect(cell5?.classList.contains('tut-cell-flipping-diag-main')).toBe(true);
      expect(ctrl.boardOps[3]).toBe(D4.MD);
      expect(ctrl.boardOps[4]).toBe(D4.MD);
      expect(ctrl.boardOps[5]).toBe(D4.MD);

      // t = 1000ms: 1단계 플립 클래스 제거
      vi.advanceTimersByTime(550);
      expect(cell3?.classList.contains('tut-cell-flipping-diag-main')).toBe(false);

      // 2) 부대각 변환 (t = 1700ms): 누적 700ms 추가(총 1700ms) 시 2행 [3, 4, 5] MAD 변환 및 부대각 플립 클래스 부여
      vi.advanceTimersByTime(700);
      expect(cell3?.classList.contains('tut-cell-flipping-diag-anti')).toBe(true);
      expect(ctrl.boardOps[3]).toBe(D4.MAD);
      expect(ctrl.boardOps[4]).toBe(D4.MAD);
      expect(ctrl.boardOps[5]).toBe(D4.MAD);

      // t = 2250ms: 2단계 플립 클래스 제거
      vi.advanceTimersByTime(550);
      expect(cell3?.classList.contains('tut-cell-flipping-diag-anti')).toBe(false);

      vi.useRealTimers();
    });

    it('설명글과 하단 버튼 텍스트가 3단계 공식 규격에 완벽히 부합해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      const mainTextEl = document.getElementById('tut-main-text');
      const btnActionText = document.getElementById('tut-btn-action-text');

      expect(mainTextEl?.textContent).toBe('난이도와 모드에 따라 행과 열의 회전과 반사로 뒤섞인 모든 강아지들을, 행과 열 변환만으로 모두 처음의 강아지로 만드는 것이 목적이에요');
      expect(btnActionText?.textContent).toBe('다음 (1/3) ➔');

      ctrl.goToStep(2);
      expect(mainTextEl?.textContent).toContain('0, 180');
      expect(btnActionText?.textContent).toBe('다음 (2/3) ➔');

      ctrl.goToStep(3);
      expect(mainTextEl?.textContent).toContain('D4 모드는 회전 4종');
      expect(btnActionText?.textContent).toBe('🎮 실전 퍼즐 시작하기');
    });

    it('3단계 D4 실전 5수 풀이 시 손가락 모션(약 0.8s)과 타일 3D 플립 애니메이션이 정밀 동기화되어야 함', () => {
      vi.useFakeTimers();
      const ctrl = new TutorialModalController();
      ctrl.open(3);

      // 1수: 11 성분 1회 탭 -> 1행 90° 회전
      ctrl.goToD4SubStep(1);
      vi.advanceTimersByTime(200);
      const cell0 = document.getElementById('tut-cell-0');
      const cell1 = document.getElementById('tut-cell-1');
      const cell2 = document.getElementById('tut-cell-2');
      expect(cell0?.classList.contains('tut-cell-rotating-90')).toBe(true);
      expect(ctrl.boardOps[0]).toBe(D4.ID);

      vi.advanceTimersByTime(400); // 600ms 시점
      expect(cell0?.classList.contains('tut-cell-rotating-90')).toBe(false);

      // 2수: 31 성분 두 번 톡톡 -> 3행 180° 회전 (각 90°씩 순차 회전)
      ctrl.goToD4SubStep(2);
      const cell6 = document.getElementById('tut-cell-6');
      vi.advanceTimersByTime(200);
      expect(cell6?.classList.contains('tut-cell-rotating-90')).toBe(true);
      vi.advanceTimersByTime(320); // 520ms 시점
      expect(cell6?.classList.contains('tut-cell-rotating-90')).toBe(false);
      vi.advanceTimersByTime(100); // 620ms 시점: 2회차 톡
      expect(cell6?.classList.contains('tut-cell-rotating-90')).toBe(true);
      expect(ctrl.boardOps[6]).toBe(D4.ID);
      vi.advanceTimersByTime(360); // 980ms 시점
      expect(cell6?.classList.contains('tut-cell-rotating-90')).toBe(false);

      // 3수: 13 성분 세로 쓱 그을 때 ➔ 3열 전체([2, 5, 8]) 손가락 이동 속도에 맞춰 천천히 세로 플립
      ctrl.goToD4SubStep(3);
      vi.advanceTimersByTime(250);
      const cell5 = document.getElementById('tut-cell-5');
      const cell8 = document.getElementById('tut-cell-8');
      expect(cell2?.classList.contains('tut-cell-flipping-v')).toBe(true);
      expect(cell5?.classList.contains('tut-cell-flipping-v')).toBe(true);
      expect(cell8?.classList.contains('tut-cell-flipping-v')).toBe(true);

      vi.advanceTimersByTime(400); // 650ms 시점: 보드 상태 갱신
      expect(ctrl.boardOps[2]).toBe(D4.ID);
      expect(ctrl.boardOps[5]).toBe(D4.MD);
      expect(ctrl.boardOps[8]).toBe(D4.ID);

      vi.advanceTimersByTime(450); // 1100ms 시점: 플립 클래스 제거
      expect(cell2?.classList.contains('tut-cell-flipping-v')).toBe(false);
      expect(cell5?.classList.contains('tut-cell-flipping-v')).toBe(false);

      // 4수: 21 성분(idx 3) ↖➔↘ 대각선 쓱 그을 때 ➔ 2행 전체([3, 4, 5]) 손가락 이동 속도에 맞춰 천천히 2행 주대각 플립
      ctrl.goToD4SubStep(4);
      vi.advanceTimersByTime(250);
      const cell3 = document.getElementById('tut-cell-3');
      const cell4 = document.getElementById('tut-cell-4');
      expect(cell3?.classList.contains('tut-cell-flipping-diag-main')).toBe(true);
      expect(cell4?.classList.contains('tut-cell-flipping-diag-main')).toBe(true);
      expect(cell5?.classList.contains('tut-cell-flipping-diag-main')).toBe(true);

      vi.advanceTimersByTime(400); // 650ms 시점
      expect(ctrl.boardOps[3]).toBe(D4.ID);
      expect(ctrl.boardOps[4]).toBe(D4.MX);
      expect(ctrl.boardOps[5]).toBe(D4.ID);

      vi.advanceTimersByTime(450); // 1100ms 시점
      expect(cell3?.classList.contains('tut-cell-flipping-diag-main')).toBe(false);

      // 5수: 12 성분 가로 쓱 밀 때 ➔ 2열 전체([1, 4, 7]) 손가락 이동 속도에 맞춰 천천히 가로 플립 및 완성
      ctrl.goToD4SubStep(5);
      vi.advanceTimersByTime(250);
      const cell7 = document.getElementById('tut-cell-7');
      expect(cell1?.classList.contains('tut-cell-flipping-h')).toBe(true);
      expect(cell4?.classList.contains('tut-cell-flipping-h')).toBe(true);
      expect(cell7?.classList.contains('tut-cell-flipping-h')).toBe(true);

      vi.advanceTimersByTime(400); // 650ms 시점: 전체 0번 완성!
      expect(ctrl.boardOps.every(op => op === D4.ID)).toBe(true);
      const btnAction = document.getElementById('tut-btn-action-text');
      expect(btnAction?.textContent).toBe('🎮 실전 퍼즐 시작하기');

      vi.advanceTimersByTime(450); // 1100ms 시점: 플립 클래스 제거
      expect(cell1?.classList.contains('tut-cell-flipping-h')).toBe(false);
      expect(cell4?.classList.contains('tut-cell-flipping-h')).toBe(false);
      expect(cell7?.classList.contains('tut-cell-flipping-h')).toBe(false);

      vi.useRealTimers();
    });
  });
});
