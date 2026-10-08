import { D4, D4Op, INT_TO_OP, OP_TO_INT, COMPOSE_TABLE, INV_TABLE } from './group';

export type LineType = 'row' | 'col' | 'diag';

export interface LineTarget {
  type: LineType;
  idx: number | 'main' | 'anti';
  label: string;
}

export function generateLines(size: number): LineTarget[] {
  const lines: LineTarget[] = [];
  for (let r = 0; r < size; r++) {
    lines.push({ type: 'row', idx: r, label: `${r + 1}행` });
  }
  for (let c = 0; c < size; c++) {
    lines.push({ type: 'col', idx: c, label: `${c + 1}열` });
  }
  lines.push({ type: 'diag', idx: 'main', label: '↖ 주대각선' });
  lines.push({ type: 'diag', idx: 'anti', label: '↗ 부대각선' });
  return lines;
}

export function generateLineCells(size: number): number[][] {
  const lineCells: number[][] = [];
  // Rows
  for (let r = 0; r < size; r++) {
    const rowCells: number[] = [];
    for (let c = 0; c < size; c++) {
      rowCells.push(r * size + c);
    }
    lineCells.push(rowCells);
  }
  // Cols
  for (let c = 0; c < size; c++) {
    const colCells: number[] = [];
    for (let r = 0; r < size; r++) {
      colCells.push(r * size + c);
    }
    lineCells.push(colCells);
  }
  // Main Diag
  const mainDiag: number[] = [];
  for (let i = 0; i < size; i++) {
    mainDiag.push(i * size + i);
  }
  lineCells.push(mainDiag);

  // Anti Diag
  const antiDiag: number[] = [];
  for (let i = 0; i < size; i++) {
    antiDiag.push(i * size + (size - 1 - i));
  }
  lineCells.push(antiDiag);

  return lineCells;
}

export const LINES_3X3: LineTarget[] = generateLines(3);
export const LINE_CELLS_3X3: number[][] = generateLineCells(3);

export function encodeBoardOps(ops: D4Op[] | number[]): number {
  let code = 0;
  for (let i = 0; i < Math.min(ops.length, 9); i++) {
    const v = typeof ops[i] === 'number' ? (ops[i] as number) : OP_TO_INT[ops[i] as D4Op];
    code |= (v << (i * 3));
  }
  return code;
}

export function decodeBoardOps(code: number, size = 3): D4Op[] {
  const count = size * size;
  const ops: D4Op[] = [];
  for (let i = 0; i < count; i++) {
    if (i < 10) {
      ops.push(INT_TO_OP[(code >> (i * 3)) & 7] || D4.ID);
    } else {
      ops.push(D4.ID);
    }
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

// 임의 보드 크기(3, 4, 5)에 대한 라인 연산 적용 함수
export function applyLineMoveGeneric(ops: D4Op[], lineCells: number[], op: D4Op): D4Op[] {
  const newOps = [...ops];
  const opInt = OP_TO_INT[op];
  for (let i = 0; i < lineCells.length; i++) {
    const cellIdx = lineCells[i];
    const curInt = OP_TO_INT[newOps[cellIdx]];
    const nextInt = COMPOSE_TABLE[curInt * 8 + opInt];
    newOps[cellIdx] = INT_TO_OP[nextInt];
  }
  return newOps;
}
