import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  TUTORIAL_STORAGE_KEY,
  isTutorialCompleted,
  markTutorialCompleted,
  getBadgeText,
  TutorialModalController,
  showTutorialModal
} from './tutorialModal';
import { D4, D4Op, composeOps } from '../core/group';

describe('튜토리얼 및 D4 연산 합성 공식 단위 테스트', () => {
  beforeEach(() => {
    // LocalStorage 및 브라우저 환경 Mock
    const storage: Record<string, string> = {};
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (k: string) => storage[k] ?? null,
        setItem: (k: string, v: string) => { storage[k] = String(v); },
        removeItem: (k: string) => { delete storage[k]; },
        clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); }
      },
      writable: true,
      configurable: true
    });

    class MockImage {
      public src = '';
      public onload: (() => void) | null = null;
      public complete = true;
    }
    Object.defineProperty(globalThis, 'Image', {
      value: MockImage,
      writable: true,
      configurable: true
    });

    // Mock DOM
    const elements: Record<string, any> = {};
    const mockElement = (id = '') => ({
      id,
      className: '',
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
        toggle: vi.fn()
      },
      style: {},
      textContent: '',
      innerText: '',
      innerHTML: '',
      children: [],
      appendChild: vi.fn(),
      querySelector: vi.fn().mockReturnValue(null),
      querySelectorAll: vi.fn().mockReturnValue([]),
      addEventListener: vi.fn(),
      remove: vi.fn(),
      dataset: {}
    });

    Object.defineProperty(globalThis, 'document', {
      value: {
        getElementById: (id: string) => {
          if (!elements[id]) {
            elements[id] = mockElement(id);
          }
          return elements[id];
        },
        querySelectorAll: () => [],
        createElement: (tag: string) => {
          const el = mockElement();
          (el as any).tagName = tag;
          return el;
        },
        body: mockElement('body')
      },
      writable: true,
      configurable: true
    });

    vi.useFakeTimers();
  });

  describe('1. D4 군론 연산 합성 수학 공식 검증', () => {
    it('STEP 1 & 2: 직교 대칭 2번 합성은 180도 회전 (MX + MY = R180)', () => {
      // 가로 대칭(MX) 후 세로 대칭(MY) 합성
      const res = composeOps(D4.MX, D4.MY);
      expect(res).toBe(D4.R180);

      // 교환 대칭(MY + MX = R180) 역시 180도 회전
      const resReverse = composeOps(D4.MY, D4.MX);
      expect(resReverse).toBe(D4.R180);
    });

    it('STEP 3: 대칭의 자기상쇄 (S² = ID)', () => {
      // 주대각선(MD) 2회 연속 적용은 항등원(ID)
      expect(composeOps(D4.MD, D4.MD)).toBe(D4.ID);
      // 부대각선(MAD) 2회 연속 적용도 항등원(ID)
      expect(composeOps(D4.MAD, D4.MAD)).toBe(D4.ID);
      // 가로 및 세로 대칭 2회 연속 적용도 항등원(ID)
      expect(composeOps(D4.MX, D4.MX)).toBe(D4.ID);
      expect(composeOps(D4.MY, D4.MY)).toBe(D4.ID);
    });

    it('STEP 4: 90도 회전 4주기 순환군 (R⁴ = ID)', () => {
      let current: D4Op = D4.ID;
      // 1회: 90도
      current = composeOps(current, D4.R90);
      expect(current).toBe(D4.R90);

      // 2회: 180도
      current = composeOps(current, D4.R90);
      expect(current).toBe(D4.R180);

      // 3회: 270도
      current = composeOps(current, D4.R90);
      expect(current).toBe(D4.R270);

      // 4회: 360도 제자리 (ID)
      current = composeOps(current, D4.R90);
      expect(current).toBe(D4.ID);
    });
  });

  describe('2. showTutorialModal 전역 함수 테스트', () => {
    it('showTutorialModal 함수가 정상 정의되고 모달을 띄워야 함', () => {
      expect(typeof showTutorialModal).toBe('function');
      showTutorialModal(1);
      expect(document.getElementById('tutorial-modal-overlay')).toBeDefined();
    });
  });

  describe('2. 타일 뱃지 텍스트 매핑 (getBadgeText)', () => {
    it('각 D4 연산에 맞는 직관적 뱃지 텍스트 반환', () => {
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

  describe('3. LocalStorage 튜토리얼 완료 상태 관리', () => {
    it('초기 미방문 시 isTutorialCompleted는 false여야 함', () => {
      expect(isTutorialCompleted()).toBe(false);
    });

    it('markTutorialCompleted 호출 시 true로 저장되어야 함', () => {
      markTutorialCompleted();
      expect(isTutorialCompleted()).toBe(true);
      expect(localStorage.getItem(TUTORIAL_STORAGE_KEY)).toBe('true');
    });
  });

  describe('4. TutorialModalController 5단계 인터랙션 제어', () => {
    it('Step 1: 가로 스와이프 성공 시 1행(0, 1, 2)이 MX로 변환', () => {
      const controller = new TutorialModalController();
      controller.open(1);
      expect(controller.currentStep).toBe(1);

      controller.executeStep1Success();
      expect(controller.boardOps[0]).toBe(D4.MX);
      expect(controller.boardOps[1]).toBe(D4.MX);
      expect(controller.boardOps[2]).toBe(D4.MX);
      expect(controller.boardOps[3]).toBe(D4.ID); // 2행은 불변
    });

    it('Step 2: 세로 스와이프 성공 시 1행이 R180으로 변환 (MX + MY)', () => {
      const controller = new TutorialModalController();
      controller.open(2);
      controller.executeStep2Success();

      expect(controller.boardOps[0]).toBe(D4.R180);
      expect(controller.boardOps[1]).toBe(D4.R180);
      expect(controller.boardOps[2]).toBe(D4.R180);
    });

    it('Step 3: 주대각선(0, 4, 8) 1차(MD) 후 2차(MD)로 자기상쇄(ID)', () => {
      const controller = new TutorialModalController();
      controller.open(3);
      expect(controller.step3SubStep).toBe(1);

      // 1차 적용 -> MD
      controller.executeStep3Success();
      expect(controller.boardOps[0]).toBe(D4.MD);
      expect(controller.boardOps[4]).toBe(D4.MD);
      expect(controller.boardOps[8]).toBe(D4.MD);
      expect(controller.step3SubStep).toBe(2);

      // 2차 적용 -> MD + MD = ID (자기상쇄)
      controller.executeStep3Success();
      expect(controller.boardOps[0]).toBe(D4.ID);
      expect(controller.boardOps[4]).toBe(D4.ID);
      expect(controller.boardOps[8]).toBe(D4.ID);
    });

    it('Step 4: 중앙 셀 4회 탭 시 R90 -> R180 -> R270 -> ID 순환', () => {
      const controller = new TutorialModalController();
      controller.open(4);
      expect(controller.step4TapCount).toBe(0);

      // 1회 탭 -> R90
      controller.executeStep4Tap();
      expect(controller.step4TapCount).toBe(1);
      expect(controller.boardOps[4]).toBe(D4.R90);

      // 2회 탭 -> R180
      controller.executeStep4Tap();
      expect(controller.step4TapCount).toBe(2);
      expect(controller.boardOps[4]).toBe(D4.R180);

      // 3회 탭 -> R270
      controller.executeStep4Tap();
      expect(controller.step4TapCount).toBe(3);
      expect(controller.boardOps[4]).toBe(D4.R270);

      // 4회 탭 -> ID (360도 원상복구)
      controller.executeStep4Tap();
      expect(controller.step4TapCount).toBe(4);
      expect(controller.boardOps[4]).toBe(D4.ID);
    });

    it('Step 5: 완료 시 markTutorialCompleted 호출 및 모달 닫힘', () => {
      const controller = new TutorialModalController();
      controller.open(5);
      controller.completeTutorial();

      expect(isTutorialCompleted()).toBe(true);
      expect(controller.isOpen).toBe(false);
    });

    it('하단 액션 버튼 handleActionClick을 통한 단계별 자동 시연 동작', () => {
      const controller = new TutorialModalController();
      controller.open(1);

      // Step 1 자동 실행
      controller.handleActionClick();
      expect(controller.boardOps[0]).toBe(D4.MX);

      // Step 2로 이동 후 자동 실행
      controller.nextStep();
      expect(controller.currentStep).toBe(2);
      controller.handleActionClick();
      expect(controller.boardOps[0]).toBe(D4.R180);
    });

    it('건너뛰기(skip) 시 완료 처리되고 모달 닫힘', () => {
      const controller = new TutorialModalController();
      controller.open(1);
      controller.skip();

      expect(isTutorialCompleted()).toBe(true);
      expect(controller.isOpen).toBe(false);
    });
  });
});
