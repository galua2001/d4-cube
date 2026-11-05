import { describe, it, expect } from 'vitest';
import { FORMULAS, getFormulasByCategory, getFormulaById } from './formulas';
import { D4, composeOps } from '../core/group';

describe('갈루아 큐브 공식 비법서 (Formula Guidebook) 레지스트리 및 수학적 정밀성 검증', () => {
  it('1. 공식 레지스트리 필수 항목 및 카테고리 완전성 검증', () => {
    expect(FORMULAS.length).toBeGreaterThanOrEqual(7);

    const categories = new Set(FORMULAS.map((f) => f.category));
    expect(categories.has('basics')).toBe(true);
    expect(categories.has('beginner')).toBe(true);
    expect(categories.has('intermediate')).toBe(true);
    expect(categories.has('advanced')).toBe(true);

    FORMULAS.forEach((f) => {
      expect(f.id).toBeTruthy();
      expect(f.titleKo).toBeTruthy();
      expect(f.titleEn).toBeTruthy();
      expect(f.formulaSeq).toBeTruthy();
      expect(f.difficulty).toBeGreaterThanOrEqual(1);
      expect(f.difficulty).toBeLessThanOrEqual(5);
    });
  });

  it('2. 카테고리 필터링 (getFormulasByCategory) 동작 무결성', () => {
    const all = getFormulasByCategory('all');
    expect(all.length).toBe(FORMULAS.length);

    const basics = getFormulasByCategory('basics');
    expect(basics.every((f) => f.category === 'basics')).toBe(true);
    expect(basics.length).toBe(3);

    const beginner = getFormulasByCategory('beginner');
    expect(beginner.every((f) => f.category === 'beginner')).toBe(true);
    expect(beginner.length).toBeGreaterThanOrEqual(1);

    const intermediate = getFormulasByCategory('intermediate');
    expect(intermediate.every((f) => f.category === 'intermediate')).toBe(true);
    expect(intermediate.length).toBeGreaterThanOrEqual(2);

    const advanced = getFormulasByCategory('advanced');
    expect(advanced.every((f) => f.category === 'advanced')).toBe(true);
    expect(advanced.length).toBeGreaterThanOrEqual(1);
  });

  it('3. 단일 공식 ID 검색 (getFormulaById) 검증', () => {
    const center = getFormulaById('center-inversion');
    expect(center).toBeDefined();
    expect(center?.id).toBe('center-inversion');
    expect(center?.diagramType).toBe('interactive');

    const nonExistent = getFormulaById('invalid-id-xyz');
    expect(nonExistent).toBeUndefined();
  });

  it('4. 공식 1: 중심 타일 180° 반전 (Center Inversion) 단계별 보드 시뮬레이션 무결성', () => {
    const f = getFormulaById('center-inversion')!;
    expect(f.steps).toBeDefined();
    expect(f.steps?.length).toBe(5); // 초기(0) + 4단계

    // 0단계: 전 타일 ID
    expect(f.steps![0].boardOps.every((op) => op === D4.ID)).toBe(true);

    // 최종 4단계: 오직 4번(중심) 타일만 R180이고, 외곽 8개 타일은 모두 ID 복원
    const finalOps = f.steps![4].boardOps;
    expect(finalOps[4]).toBe(D4.R180);

    const outerIndices = [0, 1, 2, 3, 5, 6, 7, 8];
    outerIndices.forEach((idx) => {
      expect(finalOps[idx]).toBe(D4.ID);
    });
  });

  it('5. 공식 2: 3개 타일 90° 순환 교환자 (3-Cycle Commutator) 단계별 시뮬레이션 검증', () => {
    const f = getFormulaById('three-cycle-commutator')!;
    expect(f.steps).toBeDefined();
    expect(f.steps?.length).toBe(5);

    // 0단계: 전 타일 ID
    expect(f.steps![0].boardOps.every((op) => op === D4.ID)).toBe(true);

    // 1행과 2열의 교환자이므로, 1행과 2열에 속하지 않는 타일 (3, 5, 6, 8번 타일)은 100% ID 보존
    const finalOps = f.steps![4].boardOps;
    [3, 5, 6, 8].forEach((idx) => {
      expect(finalOps[idx]).toBe(D4.ID);
    });
  });

  it('6. 공식 3: 대각선 반사 상쇄 (Diagonal Reflection Pair) 보드 시뮬레이션 검증', () => {
    const f = getFormulaById('diagonal-reflection-pair')!;
    expect(f.steps).toBeDefined();
    expect(f.steps?.length).toBe(5);

    // 0단계: 전 타일 ID
    expect(f.steps![0].boardOps.every((op) => op === D4.ID)).toBe(true);

    // 최종 단계 검증: 주대각선과 1행의 교차점인 0번 타일에 변환 발생
    const finalOps = f.steps![4].boardOps;
    expect(finalOps[0]).toBe(D4.R180);
  });

  it('7. 기초 대칭군 연산 불변량 수학적 공리 (Basic Axioms) 일치성 검증', () => {
    // 1) 반사 + 반사 = 회전
    expect(composeOps(D4.MX, D4.MY)).toBe(D4.R180);
    expect(composeOps(D4.MX, D4.MD)).toBe(D4.R90);
    expect(composeOps(D4.MY, D4.MD)).toBe(D4.R270);

    // 2) 자기 상쇄 (Order 2)
    expect(composeOps(D4.MX, D4.MX)).toBe(D4.ID);
    expect(composeOps(D4.MY, D4.MY)).toBe(D4.ID);
    expect(composeOps(D4.MD, D4.MD)).toBe(D4.ID);
    expect(composeOps(D4.R180, D4.R180)).toBe(D4.ID);
  });

  it('8. 신규 공식: 같은 줄 180° 쌍 상쇄 공식(row-two-180-pair) 보드 시뮬레이션 무결성 검증', () => {
    const f = getFormulaById('row-two-180-pair');
    expect(f).toBeDefined();
    expect(f?.id).toBe('row-two-180-pair');
    expect(f?.steps).toBeDefined();
    expect(f?.steps?.length).toBe(5);

    // 0단계: 전 타일 ID
    expect(f!.steps![0].boardOps.every((op) => op === D4.ID)).toBe(true);

    // 4단계: 0번과 2번 타일만 R180, 나머지 7개 타일은 모두 ID 복원
    const finalOps = f!.steps![4].boardOps;
    expect(finalOps[0]).toBe(D4.R180);
    expect(finalOps[2]).toBe(D4.R180);

    const preservedIndices = [1, 3, 4, 5, 6, 7, 8];
    preservedIndices.forEach((idx) => {
      expect(finalOps[idx]).toBe(D4.ID);
    });
  });

  it('9. 신규 공식: 대각선 모서리 180° 쌍 상쇄 공식(diagonal-corner-180-pair) 보드 시뮬레이션 무결성 검증', () => {
    const f = getFormulaById('diagonal-corner-180-pair');
    expect(f).toBeDefined();
    expect(f?.id).toBe('diagonal-corner-180-pair');
    expect(f?.steps).toBeDefined();
    expect(f?.steps?.length).toBe(5);

    // 0단계: 전 타일 ID
    expect(f!.steps![0].boardOps.every((op) => op === D4.ID)).toBe(true);

    // 4단계: 0번과 8번 주대각 모서리 타일만 R180, 나머지 7개 타일은 모두 ID 복원
    const finalOps = f!.steps![4].boardOps;
    expect(finalOps[0]).toBe(D4.R180);
    expect(finalOps[8]).toBe(D4.R180);

    const preservedIndices = [1, 2, 3, 4, 5, 6, 7];
    preservedIndices.forEach((idx) => {
      expect(finalOps[idx]).toBe(D4.ID);
    });
  });

  it('10. 180° 쌍 상쇄 공식의 역연산 및 스크램블 해법 자가 상쇄(Self-Neutralization) 검증', () => {
    const rowPair = getFormulaById('row-two-180-pair')!;
    const diagPair = getFormulaById('diagonal-corner-180-pair')!;

    // 같은 줄 180°: 4단계를 다시 한 번 거치면(R180 ∘ R180 = ID) 완전히 초기 ID로 환원
    const rowOps = [...rowPair.steps![4].boardOps];
    expect(rowOps[0]).toBe(D4.R180);
    expect(rowOps[2]).toBe(D4.R180);

    // 대각선 모서리 180°: R180 위수 2 성질 확인
    expect(composeOps(diagPair.steps![4].boardOps[0], D4.R180)).toBe(D4.ID);
    expect(composeOps(diagPair.steps![4].boardOps[8], D4.R180)).toBe(D4.ID);
  });

  it('11. 180° 공식 카테고리 필터링 및 태그 검색 일관성 검증', () => {
    const intermediate = getFormulasByCategory('intermediate');
    expect(intermediate.some((f) => f.id === 'row-two-180-pair')).toBe(true);

    const advanced = getFormulasByCategory('advanced');
    expect(advanced.some((f) => f.id === 'diagonal-corner-180-pair')).toBe(true);

    const all = getFormulasByCategory('all');
    expect(all.length).toBeGreaterThanOrEqual(9);
  });
});
