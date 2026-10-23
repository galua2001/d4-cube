import { describe, it, expect } from 'vitest';
import { getMaxGodNumber, generateExactKScramble } from './scrambler';
import { solveBoard } from '../core/solver';
import { SymmetryGroupKey } from '../core/group';

describe('모든 모드 및 모든 수(k) 전수 지름길 검증 (Comprehensive Zero-Shortcut Test)', () => {
  const configs: Array<{ group: SymmetryGroupKey; diag: boolean }> = [
    { group: 'C2', diag: false }, // max 3
    { group: 'C2', diag: true },  // max 5
    { group: 'V4', diag: false }, // max 4
    { group: 'V4', diag: true },  // max 6
    { group: 'D4', diag: false }, // max 8
    { group: 'D4', diag: true },  // max 6
  ];

  for (const { group, diag } of configs) {
    const maxK = getMaxGodNumber(group, diag, 3);
    const startK = group === 'D4' ? 3 : 2;

    for (let k = startK; k <= maxK; k++) {
      it(`[${group} | Diag ${diag ? 'ON' : 'OFF'}] ${k}수 난이도: 10회 연속 생성 시 최단 풀이 정확히 ${k}수 일치 검증`, () => {
        const REPEATS = 10;
        let mismatchCount = 0;
        const observedDistances: number[] = [];

        for (let iter = 0; iter < REPEATS; iter++) {
          const boardOps = generateExactKScramble(k, group, diag, 3);
          const solution = solveBoard(boardOps, 3, group, diag);
          observedDistances.push(solution.length);

          if (solution.length !== k) {
            mismatchCount++;
          }
          expect(solution.length).toBe(k);
        }

        console.log(`[PASS] ${group} Diag:${diag ? 'ON' : 'OFF'} k=${k} -> 10회 모두 최단거리 ${k}수 확인 (결과: ${observedDistances.join(', ')})`);
        expect(mismatchCount).toBe(0);
      });
    }
  }
});
