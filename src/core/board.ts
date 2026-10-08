import { D4, D4Op, INT_TO_OP, OP_TO_INT, COMPOSE_TABLE, INV_TABLE } from './group';

export type LineType = 'row' | 'col' | 'diag';

export interface LineTarget {
  type: LineType;
  idx: number | 'main' | 'anti';
  label: string;
}

export const LINES_3X3: LineTarget[] = [
  { type: 'row', idx: 0, label: '1행' },
  { type: 'row', idx: 1, label: '2행' },
  { type: 'row', idx: 2, label: '3행' },
  { type: 'col', idx: 0, label: '1열' },
  { type: 'col', idx: 1, label: '2열' },
  { type: 'col', idx: 2, label: '3열' },
  { type: 'diag', idx: 'main', label: '↖ 주대각선' },
  { type: 'diag', idx: 'anti', label: '↗ 부대각선' },
];

export const LINE_CELLS_3X3: number[][] = [
  [0, 1, 2], // 0: Row 0
  [3, 4, 5], // 1: Row 1
  [6, 7, 8], // 2: Row 2
  [0, 3, 6], // 3: Col 0
  [1, 4, 7], // 4: Col 1
  [2, 5, 8], // 5: Col 2
  [0, 4, 8], // 6: Main Diag
  [2, 4, 6], // 7: Anti Diag
];

export function encodeBoardOps(ops: D4Op[] | number[]): number {
  let code = 0;
  for (let i = 0; i < 9; i++) {
    const v = typeof ops[i] === 'number' ? (ops[i] as number) : OP_TO_INT[ops[i] as D4Op];
    code |= (v << (i * 3));
  }
  return code;
}

export function decodeBoardOps(code: number): D4Op[] {
  const ops: D4Op[] = [];
  for (let i = 0; i < 9; i++) {
    ops.push(INT_TO_OP[(code >> (i * 3)) & 7] || D4.ID);
  }
  return ops;
}

export function applyMoveInt(code: number, lineId: number, opInt: number): number {
  const cells = LINE_CELLS_3X3[lineId];
  let nextCode = code;
  for (let i = 0; i < cells.length; i++) {
    const cellIdx = cells[i];
    const shift = cellIdx * 3;
    const curOp = (nextCode >> shift) & 7;
    const nextOp = COMPOSE_TABLE[curOp * 8 + opInt];
    nextCode = (nextCode & ~(7 << shift)) | (nextOp << shift);
  }
  return nextCode;
}

export function applyInvMoveInt(code: number, lineId: number, opInt: number): number {
  const invOpInt = INV_TABLE[opInt];
  return applyMoveInt(code, lineId, invOpInt);
}
