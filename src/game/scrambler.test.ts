import { describe, it, expect } from 'vitest';
import { getMaxGodNumber, generateExactKScramble } from './scrambler';
import { solveBoard } from '../core/solver';

describe('엄격한 k수 보장 스크램블러(Scrambler) 단위 테스트', () => {
  describe('getMaxGodNumber 수학적 최대 직경 상한 검증', () => {
    it('C2 모드 최대 직경 검증 (OFF: 3, ON: 5)', () => {
      expect(getMaxGodNumber('C2', false, 3)).toBe(3);
      expect(getMaxGodNumber('C2', true, 3)).toBe(5);
    });

    it('V4 모드 최대 직경 검증 (OFF: 4, ON: 6)', () => {
      expect(getMaxGodNumber('V4', false, 3)).toBe(4);
      expect(getMaxGodNumber('V4', true, 3)).toBe(6);
    });

    it('D4 모드 최대 직경 검증 (OFF: 8, ON: 6)', () => {
      expect(getMaxGodNumber('D4', false, 3)).toBe(8);
      expect(getMaxGodNumber('D4', true, 3)).toBe(6);
    });
  });

  describe('D4 Diag OFF (십자 6라인) Zero-Shortcut 무결점 검증', () => {
    // 3수부터 8수까지 각 난이도 검증
    for (const k of [3, 4, 5, 6, 7, 8]) {
      it(`D4 Diag OFF ${k}수 생성 시 최단 풀이가 정확히 ${k}수여야 함 (지름길 0%)`, () => {
        for (let iter = 0; iter < 3; iter++) {
          const ops = generateExactKScramble(k, 'D4', false, 3);
          const steps = solveBoard(ops, 3, 'D4', false);
          expect(steps.length).toBe(k);
        }
      });
    }
  });

  describe('D4 Diag ON (대각선 8라인) Zero-Shortcut 무결점 검증', () => {
    for (const k of [3, 4, 5, 6]) {
      it(`D4 Diag ON ${k}수 생성 시 최단 풀이가 정확히 ${k}수여야 함`, () => {
        const ops = generateExactKScramble(k, 'D4', true, 3);
        const steps = solveBoard(ops, 3, 'D4', true);
        expect(steps.length).toBe(k);
      });
    }
  });

  describe('V4 모드 Zero-Shortcut 무결점 검증', () => {
    it('V4 Diag OFF 2~4수 생성 검증', () => {
      for (const k of [2, 3, 4]) {
        const ops = generateExactKScramble(k, 'V4', false, 3);
        const steps = solveBoard(ops, 3, 'V4', false);
        expect(steps.length).toBe(k);
      }
    });

    it('V4 Diag ON 2~6수 생성 검증', () => {
      for (const k of [2, 3, 4, 5, 6]) {
        const ops = generateExactKScramble(k, 'V4', true, 3);
        const steps = solveBoard(ops, 3, 'V4', true);
        expect(steps.length).toBe(k);
      }
    });
  });

  describe('C2 모드 Zero-Shortcut 무결점 검증', () => {
    it('C2 Diag OFF 2~3수 생성 검증', () => {
      for (const k of [2, 3]) {
        const ops = generateExactKScramble(k, 'C2', false, 3);
        const steps = solveBoard(ops, 3, 'C2', false);
        expect(steps.length).toBe(k);
      }
    });

    it('C2 Diag ON 2~5수 생성 검증', () => {
      for (const k of [2, 3, 4, 5]) {
        const ops = generateExactKScramble(k, 'C2', true, 3);
        const steps = solveBoard(ops, 3, 'C2', true);
        expect(steps.length).toBe(k);
      }
    });
  });

  describe('상한 초과 k 입력 시 자동 클램프 검증', () => {
    it('C2 Diag OFF에서 8수 요청 시 3수로 자동 클램프', () => {
      const ops = generateExactKScramble(8, 'C2', false, 3);
      const steps = solveBoard(ops, 3, 'C2', false);
      expect(steps.length).toBe(3);
    });

    it('V4 Diag OFF에서 8수 요청 시 4수로 자동 클램프', () => {
      const ops = generateExactKScramble(8, 'V4', false, 3);
      const steps = solveBoard(ops, 3, 'V4', false);
      expect(steps.length).toBe(4);
    });

    it('D4 Diag ON에서 8수 요청 시 6수로 자동 클램프', () => {
      const ops = generateExactKScramble(8, 'D4', true, 3);
      const steps = solveBoard(ops, 3, 'D4', true);
      expect(steps.length).toBe(6);
    });
  });
});
