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
    it('가로 대칭(MX) + 세로 대칭(MY) 합성은 180도 회전(R180)이어야 함', () => {
      const result = composeOps(D4.MX, D4.MY);
      expect(result).toBe(D4.R180);
    });

    it('대칭 연산은 2회 합성 시 항등원(ID)으로 자기상쇄되어야 함 (S^2 = ID)', () => {
      expect(composeOps(D4.MX, D4.MX)).toBe(D4.ID);
      expect(composeOps(D4.MY, D4.MY)).toBe(D4.ID);
      expect(composeOps(D4.MD, D4.MD)).toBe(D4.ID);
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

  describe('TutorialModalController 4단계 핵심 흐름', () => {
    it('open 호출 시 1단계(게임의 최종 목표)부터 시작해야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(1);
      expect(ctrl.isOpen).toBe(true);
      expect(ctrl.currentStep).toBe(1);
    });

    it('2단계에서 1행 변환 성공 시 1행 타일들이 MX로 변경되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(2);
      ctrl.executeStep2Success();
      expect(ctrl.boardOps[0]).toBe(D4.MX);
      expect(ctrl.boardOps[1]).toBe(D4.MX);
      expect(ctrl.boardOps[2]).toBe(D4.MX);
    });

    it('3단계에서 모드 전환 시 1열 변환이 적용되어 1행 1열은 R180이 되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(3);
      ctrl.executeStep3Success();
      expect(ctrl.boardOps[0]).toBe(D4.R180);
      expect(ctrl.boardOps[3]).toBe(D4.MY);
      expect(ctrl.boardOps[6]).toBe(D4.MY);
    });

    it('4단계 완료 시 튜토리얼이 닫히고 완료 플래그가 기록되어야 함', () => {
      const ctrl = new TutorialModalController();
      ctrl.open(4);
      ctrl.completeTutorial();
      expect(ctrl.isOpen).toBe(false);
      expect(isTutorialCompleted()).toBe(true);
    });
  });
});
