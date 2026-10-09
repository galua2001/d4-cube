import { D4Op, INT_TO_OP, OP_TO_INT, SYMMETRY_GROUPS, SymmetryGroupKey } from './group';
import { applyInvMoveInt, applyMoveInt, encodeBoardOps, generateLines, generateLineCells, LineTarget, applyLineMoveGeneric } from './board';

export interface MoveStep {
  lineId: number;
  line: LineTarget;
  op: D4Op;
  opInt: number;
}

// 3x3 양방향 BFS 고속 솔버
export function solveBoard3x3(curOps: D4Op[], groupKey: SymmetryGroupKey = 'D4', allowDiagonal: boolean = true): MoveStep[] {
  const startCode = encodeBoardOps(curOps);
  if (startCode === 0) return [];

  const lines = generateLines(3);
  const groupDef = SYMMETRY_GROUPS[groupKey] || SYMMETRY_GROUPS.D4;
  const groupOps = groupDef.ops.filter(op => op !== 'ID');
  const groupOpsInt = groupOps.map(op => OP_TO_INT[op]).filter(v => v !== undefined && v > 0);

  const numLines = allowDiagonal ? 8 : 6;
  const MOVES: Array<{ lineId: number; opInt: number; packed: number }> = [];
  for (let lineId = 0; lineId < numLines; lineId++) {
    for (const opInt of groupOpsInt) {
      MOVES.push({ lineId, opInt, packed: (lineId << 4) | opInt });
    }
  }

  interface ParentEntry {
    prevCode: number;
    lineId: number;
    opInt: number;
  }

  const fParent = new Map<number, ParentEntry | null>();
  const bParent = new Map<number, ParentEntry | null>();

  fParent.set(startCode, null);
  bParent.set(0, null);

  let fQueue = [startCode];
  let bQueue = [0];

  let meetCode = -1;
  const MAX_DEPTH = 8;
  let depth = 0;

  while (depth < MAX_DEPTH && meetCode === -1 && fQueue.length > 0 && bQueue.length > 0) {
    depth++;

    // Forward BFS
    const nextFQueue: number[] = [];
    for (let q = 0; q < fQueue.length; q++) {
      const cur = fQueue[q];
      for (let m = 0; m < MOVES.length; m++) {
        const mv = MOVES[m];
        const next = applyMoveInt(cur, mv.lineId, mv.opInt);
        if (!fParent.has(next)) {
          fParent.set(next, { prevCode: cur, lineId: mv.lineId, opInt: mv.opInt });
          if (bParent.has(next)) {
            meetCode = next;
            break;
          }
          nextFQueue.push(next);
        }
      }
      if (meetCode !== -1) break;
    }
    fQueue = nextFQueue;
    if (meetCode !== -1) break;

    // Backward BFS
    const nextBQueue: number[] = [];
    for (let q = 0; q < bQueue.length; q++) {
      const cur = bQueue[q];
      for (let m = 0; m < MOVES.length; m++) {
        const mv = MOVES[m];
        const prev = applyInvMoveInt(cur, mv.lineId, mv.opInt);
        if (!bParent.has(prev)) {
          // prev 상태에서 mv 연산을 적용하면 cur 상태(목표 쪽)가 됨
          bParent.set(prev, { prevCode: cur, lineId: mv.lineId, opInt: mv.opInt });
          if (fParent.has(prev)) {
            meetCode = prev;
            break;
          }
          nextBQueue.push(prev);
        }
      }
      if (meetCode !== -1) break;
    }
    bQueue = nextBQueue;
  }

  if (meetCode === -1) return [];

  // Path reconstruction
  const fPath: Array<{ lineId: number; opInt: number }> = [];
  let curr = meetCode;
  while (curr !== startCode) {
    const entry = fParent.get(curr);
    if (!entry) break;
    fPath.push({ lineId: entry.lineId, opInt: entry.opInt });
    curr = entry.prevCode;
  }
  fPath.reverse();

  const bPath: Array<{ lineId: number; opInt: number }> = [];
  curr = meetCode;
  while (curr !== 0) {
    const entry = bParent.get(curr);
    if (!entry) break;
    bPath.push({ lineId: entry.lineId, opInt: entry.opInt });
    curr = entry.prevCode;
  }

  const allMoves = [...fPath, ...bPath];

  return allMoves.map(m => ({
    lineId: m.lineId,
    line: lines[m.lineId],
    op: INT_TO_OP[m.opInt],
    opInt: m.opInt
  }));
}

// 4x4, 5x5 등 임의 크기 보드를 위한 범용 BFS 솔버 (최대 5수까지 빠른 탐색)
export function solveBoardGeneric(curOps: D4Op[], size: number, groupKey: SymmetryGroupKey = 'D4', maxDepth = 4, allowDiagonal: boolean = true): MoveStep[] {
  if (size === 3) {
    return solveBoard3x3(curOps, groupKey, allowDiagonal);
  }

  const isSolved = (ops: D4Op[]) => ops.every(o => o === 'ID');
  if (isSolved(curOps)) return [];

  const lines = generateLines(size);
  const lineCells = generateLineCells(size);
  const groupDef = SYMMETRY_GROUPS[groupKey] || SYMMETRY_GROUPS.D4;
  const groupOps = groupDef.ops.filter(op => op !== 'ID');

  // 대각선 허용 여부에 따라 탐색할 최대 라인 인덱스 제한 (대각선은 끝 2개: idx size*2, size*2+1)
  const maxLines = allowDiagonal ? lines.length : size * 2;

  interface StateNode {
    ops: D4Op[];
    path: MoveStep[];
  }

  const visited = new Set<string>();
  const encodeKey = (ops: D4Op[]) => ops.join(',');

  visited.add(encodeKey(curOps));
  let queue: StateNode[] = [{ ops: curOps, path: [] }];

  for (let depth = 0; depth < maxDepth; depth++) {
    const nextQueue: StateNode[] = [];
    for (const node of queue) {
      for (let lineId = 0; lineId < maxLines; lineId++) {
        for (const op of groupOps) {
          const nextOps = applyLineMoveGeneric(node.ops, lineCells[lineId], op);
          const nextStep: MoveStep = {
            lineId,
            line: lines[lineId],
            op,
            opInt: OP_TO_INT[op]
          };
          const nextPath = [...node.path, nextStep];

          if (isSolved(nextOps)) {
            return nextPath;
          }

          const key = encodeKey(nextOps);
          if (!visited.has(key)) {
            visited.add(key);
            nextQueue.push({ ops: nextOps, path: nextPath });
          }
        }
      }
    }
    queue = nextQueue;
    if (queue.length === 0 || queue.length > 25000) break; // 메모리 안전 가드
  }

  return [];
}

export function solveBoard(curOps: D4Op[], size: number, groupKey: SymmetryGroupKey = 'D4', allowDiagonal: boolean = true): MoveStep[] {
  if (size === 3) {
    return solveBoard3x3(curOps, groupKey, allowDiagonal);
  }
  return solveBoardGeneric(curOps, size, groupKey, 4, allowDiagonal);
}
