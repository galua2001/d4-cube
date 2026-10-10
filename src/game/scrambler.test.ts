import { describe, it, expect } from 'vitest';
import { D4, SYMMETRY_GROUPS } from '../core/group';
import { generateLines, generateLineCells, applyLineMoveGeneric } from '../core/board';
import { solveBoard } from '../core/solver';

describe('Exact k-move Scrambler 검증', () => {
  it('4수 목표 셔플 시 solveBoard의 최단 풀이 길이가 정확히 4수여야 함', () => {
    const boardSize = 3;
    const currentGroup = 'D4';
    const isDiagonalEnabled = true;
    const targetMoves = 4;

    const lines = generateLines(boardSize);
    const lineCellsList = generateLineCells(boardSize);
    const groupDef = SYMMETRY_GROUPS[currentGroup];
    const validOps = groupDef.ops.filter(o => o !== D4.ID);
    const maxLineIdx = isDiagonalEnabled ? lines.length : boardSize * 2;

    let successCount = 0;
    // 5회 반복 검증
    for (let test = 0; test < 5; test++) {
      let ops = Array(boardSize * boardSize).fill(D4.ID);
      const maxAttempts = 150;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        let candidate = Array(boardSize * boardSize).fill(D4.ID);
        let lastLineId = -1;

        for (let i = 0; i < targetMoves; i++) {
          let lineId = Math.floor(Math.random() * maxLineIdx);
          if (targetMoves > 1 && lineId === lastLineId) {
            lineId = (lineId + 1) % maxLineIdx;
          }
          lastLineId = lineId;
          const randOp = validOps[Math.floor(Math.random() * validOps.length)];
          candidate = applyLineMoveGeneric(candidate, lineCellsList[lineId], randOp);
        }

        if (candidate.every(o => o === D4.ID)) continue;

        const steps = solveBoard(candidate, boardSize, currentGroup, isDiagonalEnabled);
        if (steps.length === targetMoves) {
          ops = candidate;
          break;
        }
      }

      const finalSteps = solveBoard(ops, boardSize, currentGroup, isDiagonalEnabled);
      expect(finalSteps.length).toBe(targetMoves);
      successCount++;
    }

    expect(successCount).toBe(5);
  });
});
