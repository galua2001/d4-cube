export const D4 = {
  ID: 'ID',
  R90: 'R90',
  R180: 'R180',
  R270: 'R270',
  MX: 'MX',
  MY: 'MY',
  MD: 'MD',
  MAD: 'MAD'
} as const;

export type D4Op = typeof D4[keyof typeof D4];

export const D4_OPS: D4Op[] = [
  D4.ID, D4.R90, D4.R180, D4.R270, D4.MX, D4.MY, D4.MD, D4.MAD
];

export const OP_TO_INT: Record<D4Op, number> = {
  [D4.ID]: 0,
  [D4.R90]: 1,
  [D4.R180]: 2,
  [D4.R270]: 3,
  [D4.MX]: 4,
  [D4.MY]: 5,
  [D4.MD]: 6,
  [D4.MAD]: 7
};

export const INT_TO_OP: D4Op[] = [
  D4.ID, D4.R90, D4.R180, D4.R270, D4.MX, D4.MY, D4.MD, D4.MAD
];

export function transformPoint(pt: { x: number; y: number }, op: D4Op): { x: number; y: number } {
  const { x, y } = pt;
  switch (op) {
    case D4.ID: return { x, y };
    case D4.R90: return { x: 1 - y, y: x };
    case D4.R180: return { x: 1 - x, y: 1 - y };
    case D4.R270: return { x: y, y: 1 - x };
    case D4.MX: return { x, y: 1 - y };
    case D4.MY: return { x: 1 - x, y };
    case D4.MD: return { x: y, y: x };
    case D4.MAD: return { x: 1 - y, y: 1 - x };
    default: return { x, y };
  }
}

export function composeOps(op1: D4Op, op2: D4Op): D4Op {
  const test = { x: 0.23, y: 0.79 };
  const p1 = transformPoint(test, op1);
  const p2 = transformPoint(p1, op2);
  for (const key of Object.keys(D4) as Array<keyof typeof D4>) {
    const pk = transformPoint(test, D4[key]);
    if (Math.abs(pk.x - p2.x) < 0.001 && Math.abs(pk.y - p2.y) < 0.001) {
      return D4[key];
    }
  }
  return D4.ID;
}

// 64-entry Composition table & 8-entry Inversion table
export const COMPOSE_TABLE = new Uint8Array(64);
export const INV_TABLE = new Uint8Array(8);

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    const resOp = composeOps(INT_TO_OP[i], INT_TO_OP[j]);
    COMPOSE_TABLE[i * 8 + j] = OP_TO_INT[resOp] ?? 0;
  }
}

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    if (COMPOSE_TABLE[i * 8 + j] === 0) {
      INV_TABLE[i] = j;
      break;
    }
  }
}

export type SymmetryGroupKey = 'C2' | 'V4' | 'D4';

export interface SymmetryGroupDef {
  key: SymmetryGroupKey;
  name: string;
  ops: D4Op[];
  desc: string;
}

export const SYMMETRY_GROUPS: Record<SymmetryGroupKey, SymmetryGroupDef> = {
  C2: {
    key: 'C2',
    name: 'C₂ (180° 회전군)',
    ops: [D4.ID, D4.R180],
    desc: '180° 회전만 사용하는 2원 대칭군 입문 모드 (최대 5수 해결)'
  },
  V4: {
    key: 'V4',
    name: 'V₄ (클라인 4원군)',
    ops: [D4.ID, D4.R180, D4.MX, D4.MY],
    desc: '가로/세로 반전 및 180° 회전을 사용하는 4원 대칭군 (최대 5수 해결)'
  },
  D4: {
    key: 'D4',
    name: 'D₄ (정사면 대칭군)',
    ops: [D4.ID, D4.R90, D4.R180, D4.R270, D4.MX, D4.MY, D4.MD, D4.MAD],
    desc: '90° 회전 및 대각선 대칭을 포함한 풀 D4 정사각 대칭군 (최대 8수)'
  }
};
