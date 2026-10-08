import { describe, it, expect } from 'vitest';
import { composeOps, D4, OP_TO_INT } from './group';
import { encodeBoardOps, decodeBoardOps, applyMoveInt } from './board';
import { solveBoard } from './solver';

describe('D4 대칭군 수학 코어 테스트', () => {
  it('D4 원소 곱셈 및 결합법칙', () => {
    // R90 o R90 = R180
    expect(composeOps(D4.R90, D4.R90)).toBe(D4.R180);
    // R180 o R180 = ID
    expect(composeOps(D4.R180, D4.R180)).toBe(D4.ID);
    // MX o MX = ID
    expect(composeOps(D4.MX, D4.MX)).toBe(D4.ID);
    // MY o MY = ID
    expect(composeOps(D4.MY, D4.MY)).toBe(D4.ID);
  });

  it('보드 인코딩 및 디코딩 일치성', () => {
    const ops = [D4.ID, D4.R90, D4.R180, D4.R270, D4.MX, D4.MY, D4.MD, D4.MAD, D4.ID];
    const code = encodeBoardOps(ops);
    const decoded = decodeBoardOps(code);
    expect(decoded).toEqual(ops);
  });

  it('솔버 최단 풀이 검증 - 1수 스크램블', () => {
    // 1행에 R90 적용
    const startCode = applyMoveInt(0, 0, OP_TO_INT[D4.R90]);
    const startOps = decodeBoardOps(startCode);
    const solution = solveBoard(startOps, 3, 'D4');

    expect(solution.length).toBe(1);
    expect(solution[0].lineId).toBe(0); // 1행
    expect(solution[0].op).toBe(D4.R270); // R90의 역원 = R270
  });

  it('솔버 최단 풀이 검증 - 2수 스크램블', () => {
    // 1행 R180, 2열 MX 적용
    let code = applyMoveInt(0, 0, OP_TO_INT[D4.R180]);
    code = applyMoveInt(code, 4, OP_TO_INT[D4.MX]);
    const startOps = decodeBoardOps(code);
    const solution = solveBoard(startOps, 3, 'D4');

    expect(solution.length).toBeLessThanOrEqual(2);
  });
});
