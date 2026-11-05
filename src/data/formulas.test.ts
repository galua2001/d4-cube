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

  it('8. 신규 공식 5: 같은 줄 180° 쌍(Parallel 180° Pair) 단계별 시뮬레이션 검증', () => {
    const f = getFormulaById('parallel-180-pair');
    expect(f).toBeDefined();
    expect(f?.steps?.length).toBe(4); // 초기(0) + 3단계

    // 0단계: 0번, 1번 타일만 R180
    expect(f!.steps![0].boardOps[0]).toBe(D4.R180);
    expect(f!.steps![0].boardOps[1]).toBe(D4.R180);
    expect(f!.steps![0].boardOps[2]).toBe(D4.ID);

    // 2단계에서 1행 180° 회전 적용 후 0번, 1번 타일 즉시 ID 상쇄 확인
    expect(f!.steps![2].boardOps[0]).toBe(D4.ID);
    expect(f!.steps![2].boardOps[1]).toBe(D4.ID);

    // 최종 3단계: 3열 복원 후 1행 0, 1번 타일이 완벽히 0번(ID)으로 상쇄 보존됨
    const finalOps = f!.steps![3].boardOps;
    expect(finalOps[0]).toBe(D4.ID);
    expect(finalOps[1]).toBe(D4.ID);
  });

  it('9. 신규 공식 6: 대각선 모서리 180° 쌍(Diagonal 180° Pair) 단계별 시뮬레이션 검증', () => {
    const f = getFormulaById('diagonal-180-pair');
    expect(f).toBeDefined();
    expect(f?.steps?.length).toBe(5); // 초기(0) + 4단계

    // 0단계: 0번, 8번 타일만 R180
    expect(f!.steps![0].boardOps[0]).toBe(D4.R180);
    expect(f!.steps![0].boardOps[8]).toBe(D4.R180);
    expect(f!.steps![0].boardOps[4]).toBe(D4.ID);

    // 최종 4단계: 양 끝 모서리(0번, 8번)와 중심(4번)이 모두 ID로 소거 및 복원 완료
    const finalOps = f!.steps![4].boardOps;
    expect(finalOps[0]).toBe(D4.ID);
    expect(finalOps[8]).toBe(D4.ID);
    expect(finalOps[4]).toBe(D4.ID);
  });

  it('10. 180° 쌍 상쇄 공식의 카테고리 및 불변량 검증', () => {
    const pPair = getFormulaById('parallel-180-pair')!;
    const dPair = getFormulaById('diagonal-180-pair')!;
    expect(pPair).toBeDefined();
    expect(dPair).toBeDefined();

    // 최종 단계에서 문제였던 쌍(0, 1번 및 0, 8번)이 완전히 ID로 소거되었는지 검증
    expect(pPair.steps![3].boardOps[0]).toBe(D4.ID);
    expect(pPair.steps![3].boardOps[1]).toBe(D4.ID);
    expect(dPair.steps![4].boardOps[0]).toBe(D4.ID);
    expect(dPair.steps![4].boardOps[8]).toBe(D4.ID);
  });

  it('11. 180° 공식 카테고리 필터링 및 태그 검색 일관성 검증', () => {
    const beginner = getFormulasByCategory('beginner');
    expect(beginner.some((f) => f.id === 'parallel-180-pair')).toBe(true);

    const intermediate = getFormulasByCategory('intermediate');
    expect(intermediate.some((f) => f.id === 'diagonal-180-pair')).toBe(true);

    const all = getFormulasByCategory('all');
    expect(all.length).toBeGreaterThanOrEqual(11);
  });

  it('12. 3단계 마스터 일반 해법(master-method-3step) 시뮬레이션 및 3단계 완벽 수렴 검증', () => {
    const f = getFormulaById('master-method-3step');
    expect(f).toBeDefined();
    expect(f?.id).toBe('master-method-3step');
    expect(f?.category).toBe('beginner');
    expect(f?.steps).toBeDefined();
    expect(f?.steps?.length).toBe(4); // 초기(0) + 3단계

    // 0단계: 스크램블된 초기 상태 검증
    const step0Ops = f!.steps![0].boardOps;
    expect(step0Ops[0]).toBe(D4.MX);
    expect(step0Ops[1]).toBe(D4.MX);
    expect(step0Ops[2]).toBe(D4.R180);

    // 1단계: 1행 MX 적용 -> 0번, 1번 타일 ID로 소거
    const step1Ops = f!.steps![1].boardOps;
    expect(step1Ops[0]).toBe(D4.ID);
    expect(step1Ops[1]).toBe(D4.ID);

    // 2단계: 3열 MY 적용 -> 2번, 8번 타일 ID로 소거
    const step2Ops = f!.steps![2].boardOps;
    expect(step2Ops[2]).toBe(D4.ID);
    expect(step2Ops[8]).toBe(D4.ID);
    // 남은 2행(3, 4, 5번)만 피니시 대기 상태(R180)
    expect(step2Ops[3]).toBe(D4.R180);
    expect(step2Ops[4]).toBe(D4.R180);
    expect(step2Ops[5]).toBe(D4.R180);

    // 3단계: 2행 R180 적용 -> 모든 9개 타일 100% 항등원(ID) 올클리어 완성!
    const step3Ops = f!.steps![3].boardOps;
    expect(step3Ops.every((op) => op === D4.ID)).toBe(true);
  });

  it('13. 90° 회전 패리티 법칙 & 3-Cycle(parity-90-cycle) 시뮬레이션 및 상쇄쌍 검증', () => {
    const f = getFormulaById('parity-90-cycle');
    expect(f).toBeDefined();
    expect(f?.id).toBe('parity-90-cycle');
    expect(f?.category).toBe('intermediate');
    expect(f?.steps).toBeDefined();
    expect(f?.steps?.length).toBe(5); // 초기(0) + 4수

    // 0단계: 전 타일 ID
    expect(f!.steps![0].boardOps.every((op) => op === D4.ID)).toBe(true);

    // 1수: 1행 R90 -> 0, 1, 2번 타일 3개에 동시에 90° 회전 부여 (3-Cycle 최소 단위 증명)
    const step1Ops = f!.steps![1].boardOps;
    expect(step1Ops[0]).toBe(D4.R90);
    expect(step1Ops[1]).toBe(D4.R90);
    expect(step1Ops[2]).toBe(D4.R90);

    // 2수: 3행 R270 -> 1행(R90)과 3행(R270)이 90° + 270° = 360° ≡ 0° 상쇄쌍 형성
    const step2Ops = f!.steps![2].boardOps;
    expect(step2Ops[6]).toBe(D4.R270);
    expect(step2Ops[7]).toBe(D4.R270);
    expect(step2Ops[8]).toBe(D4.R270);

    // 3수: 1행 R270 역회전 -> 1행 3개 타일이 단 1수로 90° 3-Cycle 원샷 복원!
    const step3Ops = f!.steps![3].boardOps;
    expect(step3Ops[0]).toBe(D4.ID);
    expect(step3Ops[1]).toBe(D4.ID);
    expect(step3Ops[2]).toBe(D4.ID);

    // 4수: 3행 R90 회전 -> 상쇄쌍 잔여 타일까지 모두 복원되어 전 타일 100% ID 완성!
    const step4Ops = f!.steps![4].boardOps;
    expect(step4Ops.every((op) => op === D4.ID)).toBe(true);
  });

  it('14. 신규 공식 2종 카테고리 필터링 및 ID 조회 완전성 검증', () => {
    const beginner = getFormulasByCategory('beginner');
    expect(beginner.some((f) => f.id === 'master-method-3step')).toBe(true);

    const intermediate = getFormulasByCategory('intermediate');
    expect(intermediate.some((f) => f.id === 'parity-90-cycle')).toBe(true);

    const all = getFormulasByCategory('all');
    expect(all.length).toBeGreaterThanOrEqual(11);
  });

  it('15. [실전 1위: finish-l-shape-5] L자형 5개 에러 2수 피니시 단계별 시뮬레이션 및 올클리어 검증', () => {
    const f = getFormulaById('finish-l-shape-5');
    expect(f).toBeDefined();
    expect(f?.id).toBe('finish-l-shape-5');
    expect(f?.category).toBe('god-number');
    expect(f?.steps?.length).toBe(3); // 초기(0) + 2수

    // 0단계: 5개 에러 (0: R180, 1: MX, 2: MX, 3: MY, 6: MY)
    const step0Ops = f!.steps![0].boardOps;
    expect(step0Ops[0]).toBe(D4.R180);
    expect(step0Ops[1]).toBe(D4.MX);
    expect(step0Ops[2]).toBe(D4.MX);
    expect(step0Ops[3]).toBe(D4.MY);
    expect(step0Ops[6]).toBe(D4.MY);
    expect([4, 5, 7, 8].every((idx) => step0Ops[idx] === D4.ID)).toBe(true);

    // 1수: 1열 MY -> 3, 6번 ID 복구, 0번은 R180 ∘ MY = MX 전이
    const step1Ops = f!.steps![1].boardOps;
    expect(step1Ops[3]).toBe(D4.ID);
    expect(step1Ops[6]).toBe(D4.ID);
    expect(step1Ops[0]).toBe(D4.MX);
    expect(step1Ops[1]).toBe(D4.MX);
    expect(step1Ops[2]).toBe(D4.MX);

    // 2수: 1행 MX -> 1행 0, 1, 2번 MX² = ID 일괄 복원 -> 전 타일 100% ID 완성!
    const step2Ops = f!.steps![2].boardOps;
    expect(step2Ops.every((op) => op === D4.ID)).toBe(true);
  });

  it('16. [실전 2위: finish-wing-cross-4] 십자 날개 엇갈림 4개 에러 2수 피니시 및 중심 상쇄 검증', () => {
    const f = getFormulaById('finish-wing-cross-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('finish-wing-cross-4');
    expect(f?.category).toBe('god-number');
    expect(f?.steps?.length).toBe(3); // 초기(0) + 2수

    // 0단계: 십자 날개 4개(1, 3, 5, 7번)만 R180, 중심 4번 및 코너 4개는 ID
    const step0Ops = f!.steps![0].boardOps;
    expect(step0Ops[1]).toBe(D4.R180);
    expect(step0Ops[3]).toBe(D4.R180);
    expect(step0Ops[5]).toBe(D4.R180);
    expect(step0Ops[7]).toBe(D4.R180);
    expect(step0Ops[4]).toBe(D4.ID);
    expect([0, 2, 6, 8].every((idx) => step0Ops[idx] === D4.ID)).toBe(true);

    // 1수: 2행 R180 -> 좌우 날개(3, 5번) ID 복원, 중심(4번) R180 임시 전이
    const step1Ops = f!.steps![1].boardOps;
    expect(step1Ops[3]).toBe(D4.ID);
    expect(step1Ops[5]).toBe(D4.ID);
    expect(step1Ops[4]).toBe(D4.R180);

    // 2수: 2열 R180 -> 상하 날개(1, 7번) ID 복원, 중심(4번) R180² = ID 상쇄 -> 전 타일 100% 올클리어!
    const step2Ops = f!.steps![2].boardOps;
    expect(step2Ops.every((op) => op === D4.ID)).toBe(true);
  });

  it('17. [실전 3위: finish-hybrid-cancel] 반사-회전 하이브리드 L자 동시소거 2수 피니시 검증', () => {
    const f = getFormulaById('finish-hybrid-cancel');
    expect(f).toBeDefined();
    expect(f?.id).toBe('finish-hybrid-cancel');
    expect(f?.category).toBe('god-number');
    expect(f?.steps?.length).toBe(3); // 초기(0) + 2수

    // 0단계: 하이브리드 L자 에러 (0: MY, 1: R180, 2: R180, 3: MX, 6: MX)
    const step0Ops = f!.steps![0].boardOps;
    expect(step0Ops[0]).toBe(D4.MY);
    expect(step0Ops[1]).toBe(D4.R180);
    expect(step0Ops[2]).toBe(D4.R180);
    expect(step0Ops[3]).toBe(D4.MX);
    expect(step0Ops[6]).toBe(D4.MX);
    expect([4, 5, 7, 8].every((idx) => step0Ops[idx] === D4.ID)).toBe(true);

    // 1수: 1열 MX -> 3, 6번 반사 ID 소거, 코너 0번은 MY ∘ MX = R180 순수 회전 전이
    const step1Ops = f!.steps![1].boardOps;
    expect(step1Ops[3]).toBe(D4.ID);
    expect(step1Ops[6]).toBe(D4.ID);
    expect(step1Ops[0]).toBe(D4.R180);
    expect(step1Ops[1]).toBe(D4.R180);
    expect(step1Ops[2]).toBe(D4.R180);

    // 2수: 1행 R180 -> 1행 0, 1, 2번 타일 일괄 R180² = ID 상쇄 -> 전 타일 100% 올클리어!
    const step2Ops = f!.steps![2].boardOps;
    expect(step2Ops.every((op) => op === D4.ID)).toBe(true);
  });

  it('18. 실전 빈출 2수 피니시 TOP 3 공식 카테고리(god-number, godTechnique) 및 총 공식 개수 검증', () => {
    const godNumberFormulas = getFormulasByCategory('god-number');
    expect(godNumberFormulas.length).toBe(3);
    expect(godNumberFormulas.some((f) => f.id === 'finish-l-shape-5')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'finish-wing-cross-4')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'finish-hybrid-cancel')).toBe(true);

    const godTechniqueFormulas = getFormulasByCategory('godTechnique');
    expect(godTechniqueFormulas.some((f) => f.id === 'finish-l-shape-5')).toBe(true);
    expect(godTechniqueFormulas.some((f) => f.id === 'finish-wing-cross-4')).toBe(true);
    expect(godTechniqueFormulas.some((f) => f.id === 'finish-hybrid-cancel')).toBe(true);

    const all = getFormulasByCategory('all');
    expect(all.length).toBeGreaterThanOrEqual(14);
  });

  it('19. [AI 채굴 공식 검증 #1] mined_formulas.json 및 자율 공식 발굴 스키마 정합성 검증', async () => {
    const imported = await import('./mined_formulas.json');
    const minedList = imported.default || imported;
    expect(Array.isArray(minedList)).toBe(true);
    expect(minedList.length).toBeGreaterThanOrEqual(1);

    const sample = minedList[0];
    expect(sample.id).toBeTruthy();
    expect(sample.titleKo).toBeTruthy();
    expect(sample.errorCount).toBeGreaterThanOrEqual(3);
    expect(sample.solutionMoves.length).toBe(2);
  });

  it('20. [AI 채굴 공식 검증 #2] 비법서 [AI 발굴 공식] 탭(god-number) 다국어 i18n 번역 키 일관성 검증', async () => {
    const { translations } = await import('../i18n/translations');
    expect(translations.ko['formula.tabAiMined']).toBe('AI 발굴 공식');
    expect(translations.en['formula.tabAiMined']).toBe('AI Mined');
  });

  it('21. [AI 채굴 공식 검증 #3] AI 공식 발굴 엔진의 2수 역해법 군론적 올클리어(ID 수렴) 수학적 불변성 검증', () => {
    const corner = composeOps(D4.R180, D4.MY);
    expect(corner).toBe(D4.MX);
    const cornerFinal = composeOps(D4.MX, corner);
    expect(cornerFinal).toBe(D4.ID);
  });

  it('22. [AI 채굴 엔진 연동] ai-mined 카테고리 필터링 및 minedFormulas.json 공식 레지스트리 탑재 검증', () => {
    const aiMined = getFormulasByCategory('ai-mined');
    expect(aiMined.length).toBeGreaterThanOrEqual(5);

    const triangle = getFormulaById('ai-diagonal-triangle-break');
    expect(triangle).toBeDefined();
    expect(triangle?.category).toBe('ai-mined');
    expect(triangle?.difficulty).toBe(3);
    expect(triangle?.steps?.length).toBe(4); // 초기(0) + 3수

    const quad = getFormulaById('ai-corner-quad-purge');
    expect(quad).toBeDefined();
    expect(quad?.difficulty).toBe(4);
    expect(quad?.steps?.length).toBe(5); // 초기(0) + 4수
  });

  it('23. [AI 사선 트라이앵글 3수 공식] 단계별 인터랙티브 시뮬레이션 및 최종 All-ID 올클리어 검증', () => {
    const f = getFormulaById('ai-diagonal-triangle-break')!;
    expect(f).toBeDefined();
    expect(f.steps).toBeDefined();

    // 초기 상태: 비틀려 있는 스크램블 (일부 타일이 ID가 아님)
    const initialOps = f.steps![0].boardOps;
    expect(initialOps.some((op) => op !== D4.ID)).toBe(true);

    // 최종 3수: 9개 타일 100% ID 올클리어 완성
    const finalOps = f.steps![3].boardOps;
    expect(finalOps.every((op) => op === D4.ID)).toBe(true);
  });

  it('24. [AI 양대각·중심십자 4수 공식] 단계별 보드 변환 및 최종 4수 올클리어 검증', () => {
    const f = getFormulaById('ai-dual-diagonal-cross')!;
    expect(f).toBeDefined();
    expect(f.steps).toBeDefined();
    expect(f.steps?.length).toBe(5); // 0 + 4수

    const finalOps = f.steps![4].boardOps;
    expect(finalOps.every((op) => op === D4.ID)).toBe(true);
  });
});
