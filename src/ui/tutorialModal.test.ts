import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isTutorialCompleted,
  markTutorialCompleted,
  getBadgeText,
  TutorialModalController,
  TUTORIAL_STORAGE_KEY
} from './tutorialModal';
import { D4, composeOps } from '../core/group';

describe('TutorialModal & Group Theory Core Logic', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    const mockStorage = {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); }
    };
    vi.stubGlobal('localStorage', mockStorage);
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

  describe('TutorialModalController 슬라이드형 뷰어 네비게이션 & 4단계 흐름', () => {
    it('open(1) 호출 시 1단계(퍼즐의 목표 & 행렬 성분 구조)부터 시작해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      expect(ctrl.isOpen).toBe(true);
      expect(ctrl.currentStep).toBe(1);
      // 1단계: 뒤섞인 보드 상태 확인
      expect(ctrl.boardOps[0]).toBe(D4.MX);
      expect(ctrl.boardOps[4]).toBe(D4.R180);
    });

    it('2단계 진입 시 1행 가로 반사(MX) 변환 상태가 자동 시연되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(2);
      expect(ctrl.currentStep).toBe(2);
      expect(ctrl.boardOps[0]).toBe(D4.MX);
      expect(ctrl.boardOps[1]).toBe(D4.MX);
      expect(ctrl.boardOps[2]).toBe(D4.MX);
      expect(ctrl.boardOps[3]).toBe(D4.ID);
    });

    it('3단계 진입 시 1행 1열은 반사 합성으로 R180(V4 클라인 4원군)이어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(3);
      expect(ctrl.currentStep).toBe(3);
      expect(ctrl.boardOps[0]).toBe(D4.R180); // composeOps(D4.MX, D4.MY)
      expect(ctrl.boardOps[1]).toBe(D4.MX);
      expect(ctrl.boardOps[2]).toBe(D4.MX);
      expect(ctrl.boardOps[3]).toBe(D4.MY);
      expect(ctrl.boardOps[6]).toBe(D4.MY);
    });

    it('4단계 진입 시 모든 타일이 정위치 앞면(0번 ID) 상태로 완성되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(4);
      expect(ctrl.currentStep).toBe(4);
      expect(ctrl.boardOps.every(op => op === D4.ID)).toBe(true);
    });

    it('nextStep() 및 prevStep()으로 슬라이드가 앞뒤로 부드럽게 전환되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      ctrl.nextStep(); // 1 -> 2
      expect(ctrl.currentStep).toBe(2);
      expect(ctrl.boardOps[0]).toBe(D4.MX);

      ctrl.nextStep(); // 2 -> 3
      expect(ctrl.currentStep).toBe(3);
      expect(ctrl.boardOps[0]).toBe(D4.R180);

      ctrl.prevStep(); // 3 -> 2
      expect(ctrl.currentStep).toBe(2);
      expect(ctrl.boardOps[0]).toBe(D4.MX);

      ctrl.prevStep(); // 2 -> 1
      expect(ctrl.currentStep).toBe(1);

      // 1단계에서 이전 호출 시 1단계 유지
      ctrl.prevStep();
      expect(ctrl.currentStep).toBe(1);
    });

    it('goToStep(s)으로 원하는 단계를 임의로 점프할 수 있어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);

      ctrl.goToStep(3);
      expect(ctrl.currentStep).toBe(3);
      expect(ctrl.boardOps[0]).toBe(D4.R180);

      ctrl.goToStep(1);
      expect(ctrl.currentStep).toBe(1);

      // 범위 외 입력 시 클램핑
      ctrl.goToStep(10);
      expect(ctrl.currentStep).toBe(4);
      ctrl.goToStep(-1);
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

    it('4단계에서 다음(nextStep) 또는 completeTutorial 호출 시 튜토리얼 완료 처리되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(4);
      ctrl.nextStep(); // 4단계에서 다음 누르면 completeTutorial 실행
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
  });
});
