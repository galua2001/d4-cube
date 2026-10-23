import { D4, D4Op, SymmetryGroupKey, SYMMETRY_GROUPS, OP_TO_INT } from '../core/group';
import { generateLines, generateLineCells, decodeBoardOps, applyLineMoveGeneric, applyInvMoveInt } from '../core/board';
import { solveBoard } from '../core/solver';
import { D4_GOD8_CODES } from './god8Seeds';

/**
 * 대칭군 및 대각선 활성화 여부에 따른 수학적 최대 직경(God's Number) 반환
 * - C2: Diag OFF -> 3, Diag ON -> 5
 * - V4: Diag OFF -> 4, Diag ON -> 6
 * - D4: Diag OFF -> 8, Diag ON -> 6
 */
export function getMaxGodNumber(
  groupKey: SymmetryGroupKey,
  isDiagonalEnabled: boolean,
  boardSize = 3
): number {
  if (boardSize <= 3) {
    if (groupKey === 'C2') return isDiagonalEnabled ? 5 : 3;
    if (groupKey === 'V4') return isDiagonalEnabled ? 6 : 4;
    if (groupKey === 'D4') return isDiagonalEnabled ? 6 : 8;
    return isDiagonalEnabled ? 6 : 8;
  }
  if (boardSize === 4) return 12;
  return 15;
}

export class ScrambleValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScrambleValidationError';
  }
}

/**
 * 목표 k수에 대해 k-1수 이하의 지름길이 절대 존재하지 않는 엄격한 보드 상태 생성
 * (Zero-Shortcut Guarantee: 최적해의 길이가 반드시 targetK와 일치)
 */
export function generateExactKScramble(
  targetK: number,
  groupKey: SymmetryGroupKey,
  isDiagonalEnabled: boolean,
  boardSize = 3
): D4Op[] {
  const maxGod = getMaxGodNumber(groupKey, isDiagonalEnabled, boardSize);
  const effectiveK = Math.max(1, Math.min(targetK, maxGod));

  // 4x4 이상 보드에 대한 처리
  if (boardSize !== 3) {
    return generateGenericScramble(effectiveK, groupKey, isDiagonalEnabled, boardSize);
  }

  // 3x3 보드: 수학적 엄밀 보장 생성 알고리즘

  // 1. D4 & Diag OFF & k === 8 (사전 계산된 192개 극단 시드 O(1) 선택)
  if (groupKey === 'D4' && !isDiagonalEnabled && effectiveK === 8) {
    const randIdx = Math.floor(Math.random() * D4_GOD8_CODES.length);
    const code = D4_GOD8_CODES[randIdx];
    const ops = decodeBoardOps(code, 3);
    const steps = solveBoard(ops, 3, groupKey, isDiagonalEnabled);
    if (steps.length !== 8) {
      throw new ScrambleValidationError(`D4 8수 시드 검증 실패: 최적해 길이 ${steps.length} !== 8`);
    }
    return ops;
  }

  // 2. D4 & Diag OFF & k === 7 (8수 시드의 역연산 인접 상태에서 추출)
  if (groupKey === 'D4' && !isDiagonalEnabled && effectiveK === 7) {
    const groupDef = SYMMETRY_GROUPS.D4;
    const validOpsInt = groupDef.ops
      .filter(o => o !== D4.ID)
      .map(o => OP_TO_INT[o]);
    const numLines = 6;

    for (let attempt = 0; attempt < 50; attempt++) {
      const randIdx = Math.floor(Math.random() * D4_GOD8_CODES.length);
      const code8 = D4_GOD8_CODES[randIdx];

      // 무작위 1개 역연산 적용하여 7수 상태 탐색
      const lineId = Math.floor(Math.random() * numLines);
      const opInt = validOpsInt[Math.floor(Math.random() * validOpsInt.length)];
      const candidateCode = applyInvMoveInt(code8, lineId, opInt);
      const candidateOps = decodeBoardOps(candidateCode, 3);

      const steps = solveBoard(candidateOps, 3, groupKey, isDiagonalEnabled);
      if (steps.length === 7) {
        return candidateOps;
      }
    }
    // 인접 탐색 실패 시 아래의 점증적 탐색기로 폴백
  }

  // 3. 점증적 거리 증가 탐색기 (Incremental Distance-Increasing Walker)
  // k in [1..6] 또는 7수 폴백
  const lines = generateLines(3);
  const lineCellsList = generateLineCells(3);
  const groupDef = SYMMETRY_GROUPS[groupKey];
  const validOps = groupDef.ops.filter(o => o !== D4.ID);
  const maxLineIdx = isDiagonalEnabled ? lines.length : 6;

  for (let retry = 0; retry < 100; retry++) {
    let currentOps = Array(9).fill(D4.ID);
    let currentDist = 0;
    let failedStep = false;

    for (let step = 1; step <= effectiveK; step++) {
      let stepFound = false;

      // 가능한 라인과 연산들을 무작위 셔플하여 탐색
      const candidates: Array<{ lineId: number; op: D4Op }> = [];
      for (let l = 0; l < maxLineIdx; l++) {
        for (const op of validOps) {
          candidates.push({ lineId: l, op });
        }
      }
      // Shuffle
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }

      for (const cand of candidates) {
        const nextOps = applyLineMoveGeneric(currentOps, lineCellsList[cand.lineId], cand.op);
        const nextSteps = solveBoard(nextOps, 3, groupKey, isDiagonalEnabled);
        if (nextSteps.length === step) {
          currentOps = nextOps;
          currentDist = step;
          stepFound = true;
          break;
        }
      }

      if (!stepFound) {
        failedStep = true;
        break;
      }
    }

    if (!failedStep && currentDist === effectiveK) {
      // 최종 검증 가드 (Zero-Tolerance Verification Guard)
      const finalSteps = solveBoard(currentOps, 3, groupKey, isDiagonalEnabled);
      if (finalSteps.length === effectiveK) {
        return currentOps;
      }
    }
  }

  throw new ScrambleValidationError(
    `정확히 ${effectiveK}수 퍼즐 생성에 실패했습니다. (Zero Shortcut Guarantee 위반)`
  );
}

/**
 * 4x4, 5x5 등 대형 보드를 위한 기본 셔플
 */
function generateGenericScramble(
  targetMoves: number,
  groupKey: SymmetryGroupKey,
  isDiagonalEnabled: boolean,
  boardSize: number
): D4Op[] {
  const lines = generateLines(boardSize);
  const lineCellsList = generateLineCells(boardSize);
  const groupDef = SYMMETRY_GROUPS[groupKey];
  const validOps = groupDef.ops.filter(o => o !== D4.ID);
  const maxLineIdx = isDiagonalEnabled ? lines.length : boardSize * 2;

  let ops = Array(boardSize * boardSize).fill(D4.ID);
  let lastLineId = -1;

  for (let i = 0; i < targetMoves; i++) {
    let lineId = Math.floor(Math.random() * maxLineIdx);
    if (targetMoves > 1 && lineId === lastLineId) {
      lineId = (lineId + 1) % maxLineIdx;
    }
    lastLineId = lineId;
    const randOp = validOps[Math.floor(Math.random() * validOps.length)];
    ops = applyLineMoveGeneric(ops, lineCellsList[lineId], randOp);
  }

  if (ops.every(o => o === D4.ID)) {
    const lineId = Math.floor(Math.random() * maxLineIdx);
    const randOp = validOps[Math.floor(Math.random() * validOps.length)];
    ops = applyLineMoveGeneric(ops, lineCellsList[lineId], randOp);
  }

  return ops;
}
