import { describe, it, expect } from 'vitest';
import { FORMULAS, getFormulasByCategory, getFormulaById, filterFormulas } from './formulas';
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
    expect(godNumberFormulas.length).toBe(17);
    expect(godNumberFormulas.some((f) => f.id === 'd4-double-cross-4')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-spiral-vortex-4')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-dual-diagonal-blitz-4')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-diamond-cross-3')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-l-diag-combo-3')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-x-cross-3')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'quad-corner-finish')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'diagonal-spine-flush')).toBe(true);
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


  it('25. [마스터 공식: quad-corner-finish] 4코너 올킬 3수 파괴 공식 단계별 인터랙티브 시뮬레이션 및 전 타일 All-ID 올클리어 검증', () => {
    const f = getFormulaById('quad-corner-finish');
    expect(f).toBeDefined();
    expect(f?.id).toBe('quad-corner-finish');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(3);
    expect(f?.steps?.length).toBe(4); // 초기(0) + 3수

    // 0단계: 4개 모서리(0, 2, 6, 8)가 MX, 중심(4)이 R180
    const step0Ops = f!.steps![0].boardOps;
    expect(step0Ops[0]).toBe(D4.MX);
    expect(step0Ops[2]).toBe(D4.MX);
    expect(step0Ops[6]).toBe(D4.MX);
    expect(step0Ops[8]).toBe(D4.MX);
    expect(step0Ops[4]).toBe(D4.R180);
    expect([1, 3, 5, 7].every((idx) => step0Ops[idx] === D4.ID)).toBe(true);

    // 1수: 주대각선 MAD -> 0, 8번은 MX ∘ MAD = R270, 중심 4번은 R180 ∘ MAD = MD
    const step1Ops = f!.steps![1].boardOps;
    expect(step1Ops[0]).toBe(D4.R270);
    expect(step1Ops[8]).toBe(D4.R270);
    expect(step1Ops[4]).toBe(D4.MD);
    expect(step1Ops[2]).toBe(D4.MX);
    expect(step1Ops[6]).toBe(D4.MX);

    // 2수: 부대각선 MX -> 2, 6번 코너는 MX² = ID 즉시 소거, 중심 4번은 MD ∘ MX = R270
    // => 주대각선 전체(0, 4, 8)가 R270으로 완전 동기화!
    const step2Ops = f!.steps![2].boardOps;
    expect(step2Ops[2]).toBe(D4.ID);
    expect(step2Ops[6]).toBe(D4.ID);
    expect(step2Ops[0]).toBe(D4.R270);
    expect(step2Ops[4]).toBe(D4.R270);
    expect(step2Ops[8]).toBe(D4.R270);

    // 3수: 주대각선 R90 -> 동기화된 0, 4, 8번 타일이 R270 ∘ R90 = ID로 일괄 소거되어 9개 타일 100% ID 완성!
    const step3Ops = f!.steps![3].boardOps;
    expect(step3Ops.every((op) => op === D4.ID)).toBe(true);
  });

  it('26. [마스터 공식: diagonal-spine-flush] 사선 척추-외곽 상쇄 3수 공식 단계별 인터랙티브 시뮬레이션 및 전 타일 All-ID 올클리어 검증', () => {
    const f = getFormulaById('diagonal-spine-flush');
    expect(f).toBeDefined();
    expect(f?.id).toBe('diagonal-spine-flush');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(4); // 초기(0) + 3수

    // 0단계: 1행 모서리(0, 2)가 MAD, 척추(4, 7)가 MD
    const step0Ops = f!.steps![0].boardOps;
    expect(step0Ops[0]).toBe(D4.MAD);
    expect(step0Ops[2]).toBe(D4.MAD);
    expect(step0Ops[4]).toBe(D4.MD);
    expect(step0Ops[7]).toBe(D4.MD);
    expect([1, 3, 5, 6, 8].every((idx) => step0Ops[idx] === D4.ID)).toBe(true);

    // 1수: 1행 MY -> 0, 2번은 MAD ∘ MY = R270, 1번은 MY 상태
    const step1Ops = f!.steps![1].boardOps;
    expect(step1Ops[0]).toBe(D4.R270);
    expect(step1Ops[2]).toBe(D4.R270);
    expect(step1Ops[1]).toBe(D4.MY);
    expect(step1Ops[4]).toBe(D4.MD);
    expect(step1Ops[7]).toBe(D4.MD);

    // 2수: 2열 MD -> 척추 4, 7번은 MD² = ID로 즉시 소거, 교차점 1번은 MY ∘ MD = R270
    // => 1행 전체(0, 1, 2)가 R270으로 완전 동기화!
    const step2Ops = f!.steps![2].boardOps;
    expect(step2Ops[4]).toBe(D4.ID);
    expect(step2Ops[7]).toBe(D4.ID);
    expect(step2Ops[0]).toBe(D4.R270);
    expect(step2Ops[1]).toBe(D4.R270);
    expect(step2Ops[2]).toBe(D4.R270);

    // 3수: 1행 R90 -> 동기화된 1행 0, 1, 2번 타일이 R270 ∘ R90 = ID로 일괄 소거되어 9개 타일 100% ID 완성!
    const step3Ops = f!.steps![3].boardOps;
    expect(step3Ops.every((op) => op === D4.ID)).toBe(true);
  });

  it('27. 신규 마스터 공식 2종 i18n 번역 키 및 godTechnique 카테고리 연계 무결성 검증', async () => {
    const { translations } = await import('../i18n/translations');
    expect(translations.ko['formula.item.quadCornerFinish.title']).toContain('4코너 올킬');
    expect(translations.en['formula.item.quadCornerFinish.title']).toContain('Quad-Corner');
    expect(translations.ko['formula.item.diagonalSpineFlush.title']).toContain('사선 척추-외곽 상쇄');
    expect(translations.en['formula.item.diagonalSpineFlush.title']).toContain('Diagonal Spine');

    const godTech = getFormulasByCategory('godTechnique');
    expect(godTech.some((f) => f.id === 'quad-corner-finish')).toBe(true);
    expect(godTech.some((f) => f.id === 'diagonal-spine-flush')).toBe(true);
  });

  it('28. [D4 마스터 공식: d4-diamond-cross-3] D4 다이아몬드 십자 3수 폭파 메타데이터 및 등록 검증', () => {
    const f = getFormulaById('d4-diamond-cross-3');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-diamond-cross-3');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(3);
    expect(f?.steps?.length).toBe(4); // 0 + 3수
    expect(f?.tags).toContain('다이아몬드 십자');
    expect(f?.isInteractive).toBe(true);
  });

  it('29. [D4 마스터 공식: d4-diamond-cross-3] 단계별 인터랙티브 시뮬레이션 및 전 타일 All-ID 올클리어 검증', () => {
    const f = getFormulaById('d4-diamond-cross-3')!;
    expect(f).toBeDefined();

    // 0단계: 상하 날개(1, 7번: MX), 좌우 날개(3, 5번: R180), 중심(4번: MX)
    const s0 = f.steps![0].boardOps;
    expect(s0[1]).toBe(D4.MX);
    expect(s0[7]).toBe(D4.MX);
    expect(s0[3]).toBe(D4.R180);
    expect(s0[5]).toBe(D4.R180);
    expect(s0[4]).toBe(D4.MX);
    expect([0, 2, 6, 8].every((idx) => s0[idx] === D4.ID)).toBe(true);

    // 1수: 2행 R90 -> 3, 5번 셀 R270, 4번 셀 MD
    const s1 = f.steps![1].boardOps;
    expect(s1[3]).toBe(D4.R270);
    expect(s1[5]).toBe(D4.R270);
    expect(s1[4]).toBe(D4.MD);

    // 2수: 2열 MX -> 1, 7번 셀 ID 복구, 4번 셀 MD ∘ MX = R270 (2행 3, 4, 5번 모두 R270으로 완전 동기화!)
    const s2 = f.steps![2].boardOps;
    expect(s2[1]).toBe(D4.ID);
    expect(s2[7]).toBe(D4.ID);
    expect(s2[3]).toBe(D4.R270);
    expect(s2[4]).toBe(D4.R270);
    expect(s2[5]).toBe(D4.R270);

    // 3수: 2행 R90 -> R270 ∘ R90 = ID 소거, 전 타일 100% All-ID 클리어
    const s3 = f.steps![3].boardOps;
    expect(s3.every((op) => op === D4.ID)).toBe(true);
  });

  it('30. [D4 마스터 공식: d4-l-diag-combo-3] D4 ㄱ자 사선연계 3수 올킬 메타데이터 및 등록 검증', () => {
    const f = getFormulaById('d4-l-diag-combo-3');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-l-diag-combo-3');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(3);
    expect(f?.steps?.length).toBe(4); // 0 + 3수
    expect(f?.tags).toContain('ㄱ자 사선연계');
    expect(f?.isInteractive).toBe(true);
  });

  it('31. [D4 마스터 공식: d4-l-diag-combo-3] 단계별 인터랙티브 시뮬레이션 및 전 타일 All-ID 올클리어 검증', () => {
    const f = getFormulaById('d4-l-diag-combo-3')!;
    expect(f).toBeDefined();

    // 0단계: 1행(0, 1번: R180)과 3열(2, 5, 8번: MD)
    const s0 = f.steps![0].boardOps;
    expect(s0[0]).toBe(D4.R180);
    expect(s0[1]).toBe(D4.R180);
    expect(s0[2]).toBe(D4.MD);
    expect(s0[5]).toBe(D4.MD);
    expect(s0[8]).toBe(D4.MD);
    expect([3, 4, 6, 7].every((idx) => s0[idx] === D4.ID)).toBe(true);

    // 1수: 1행 R90 -> 0, 1번 셀 R270, 코너 2번 셀 MD ∘ R90 = MY
    const s1 = f.steps![1].boardOps;
    expect(s1[0]).toBe(D4.R270);
    expect(s1[1]).toBe(D4.R270);
    expect(s1[2]).toBe(D4.MY);

    // 2수: 3열 MD -> 5, 8번 타일 MD² = ID 복구, 코너 2번 타일 MY ∘ MD = R270 (1행 전체 0, 1, 2번이 R270으로 완전 동기화!)
    const s2 = f.steps![2].boardOps;
    expect(s2[5]).toBe(D4.ID);
    expect(s2[8]).toBe(D4.ID);
    expect(s2[0]).toBe(D4.R270);
    expect(s2[1]).toBe(D4.R270);
    expect(s2[2]).toBe(D4.R270);

    // 3수: 1행 R90 -> R270 ∘ R90 = ID 소거, 전 타일 100% All-ID 클리어
    const s3 = f.steps![3].boardOps;
    expect(s3.every((op) => op === D4.ID)).toBe(true);
  });

  it('32. [D4 마스터 공식: d4-x-cross-3] D4 X-크로스 모서리동시 3수 폭파 메타데이터 및 등록 검증', () => {
    const f = getFormulaById('d4-x-cross-3');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-x-cross-3');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(4); // 0 + 3수
    expect(f?.tags).toContain('X-크로스');
    expect(f?.isInteractive).toBe(true);
  });

  it('33. [D4 마스터 공식: d4-x-cross-3] 단계별 인터랙티브 시뮬레이션 및 전 타일 All-ID 올클리어 검증', () => {
    const f = getFormulaById('d4-x-cross-3')!;
    expect(f).toBeDefined();

    // 0단계: 4개 코너(0, 2, 6, 8번: R270)와 중심(4번: R90), 십자 날개 4개(ID)
    const s0 = f.steps![0].boardOps;
    expect(s0[0]).toBe(D4.R270);
    expect(s0[2]).toBe(D4.R270);
    expect(s0[6]).toBe(D4.R270);
    expect(s0[8]).toBe(D4.R270);
    expect(s0[4]).toBe(D4.R90);
    expect([1, 3, 5, 7].every((idx) => s0[idx] === D4.ID)).toBe(true);

    // 1수: 2열 R270 -> 중심 4번 R90 ∘ R270 = ID 즉시 복구, 1, 7번 R270 (1행과 3행이 각각 완전한 R270 라인으로 정렬!)
    const s1 = f.steps![1].boardOps;
    expect(s1[4]).toBe(D4.ID);
    expect(s1[0]).toBe(D4.R270);
    expect(s1[1]).toBe(D4.R270);
    expect(s1[2]).toBe(D4.R270);
    expect(s1[6]).toBe(D4.R270);
    expect(s1[7]).toBe(D4.R270);
    expect(s1[8]).toBe(D4.R270);

    // 2수: 3행 R90 -> 3행 전체(6, 7, 8번) R270 ∘ R90 = ID 일괄 소거
    const s2 = f.steps![2].boardOps;
    expect(s2[6]).toBe(D4.ID);
    expect(s2[7]).toBe(D4.ID);
    expect(s2[8]).toBe(D4.ID);

    // 3수: 1행 R90 -> 1행 전체(0, 1, 2번) R270 ∘ R90 = ID 일괄 소거, 전 타일 100% All-ID 클리어
    const s3 = f.steps![3].boardOps;
    expect(s3.every((op) => op === D4.ID)).toBe(true);
  });

  it('34. D4 신규 마스터 공식 3선 i18n 번역 키 및 god-number 카테고리 등록 검증', async () => {
    const { translations } = await import('../i18n/translations');
    expect(translations.ko['formula.item.d4DiamondCross3.title']).toContain('다이아몬드 십자');
    expect(translations.en['formula.item.d4DiamondCross3.title']).toContain('Diamond Cross');
    expect(translations.ko['formula.item.d4LDiagCombo3.title']).toContain('ㄱ자 사선연계');
    expect(translations.en['formula.item.d4LDiagCombo3.title']).toContain('L-Diagonal');
    expect(translations.ko['formula.item.d4XCross3.title']).toContain('X-크로스');
    expect(translations.en['formula.item.d4XCross3.title']).toContain('X-Cross');

    const godNumberFormulas = getFormulasByCategory('god-number');
    expect(godNumberFormulas.some((f) => f.id === 'd4-diamond-cross-3')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-l-diag-combo-3')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-x-cross-3')).toBe(true);
  });

  it('35. [D4 4수 마스터 공식: d4-double-cross-4] 직교 십자축 이중 꼬임 4수 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-double-cross-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-double-cross-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 초기 보드 확인
    expect(f!.steps![0].boardOps[4]).toBe(D4.R180);

    // 최종 4수 적용 후: 전 타일 100% All-ID 클리어
    const finalOps = f!.steps![4].boardOps;
    expect(finalOps.every((op) => op === D4.ID)).toBe(true);
  });

  it('36. [D4 4수 마스터 공식: d4-spiral-vortex-4] 4방향 소용돌이 위상차 4수 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-spiral-vortex-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-spiral-vortex-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계 + 4수

    // 초기 보드: 중심 ID, 코너 R180, 변 R270
    expect(f!.steps![0].boardOps[4]).toBe(D4.ID);
    expect(f!.steps![0].boardOps[0]).toBe(D4.R180);
    expect(f!.steps![0].boardOps[1]).toBe(D4.R270);

    // 최종 4수 적용 후: 전 타일 100% All-ID 클리어
    const finalOps = f!.steps![4].boardOps;
    expect(finalOps.every((op) => op === D4.ID)).toBe(true);
  });

  it('37. [D4 4수 마스터 공식: d4-dual-diagonal-blitz-4] 양대각선(↖, ↗) 대칭 교차 4수 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-dual-diagonal-blitz-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-dual-diagonal-blitz-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계 + 4수

    // 초기 보드: 중심 R180
    expect(f!.steps![0].boardOps[4]).toBe(D4.R180);

    // 최종 4수 적용 후: 전 타일 100% All-ID 클리어
    const finalOps = f!.steps![4].boardOps;
    expect(finalOps.every((op) => op === D4.ID)).toBe(true);
  });

  it('38. D4 거리 4 마스터 공식 3선 i18n 번역 키 및 다국어 사전 등록 검증', async () => {
    const { translations } = await import('../i18n/translations');
    expect(translations.ko['formula.item.d4DoubleCross4.title']).toContain('가로/세로 십자');
    expect(translations.en['formula.item.d4DoubleCross4.title']).toContain('Double-Cross Twist');
    expect(translations.ko['formula.item.d4SpiralVortex4.title']).toContain('4방향 소용돌이');
    expect(translations.en['formula.item.d4SpiralVortex4.title']).toContain('4-Way Spiral Vortex');
    expect(translations.ko['formula.item.d4DualDiagonalBlitz4.title']).toContain('양대각선');
    expect(translations.en['formula.item.d4DualDiagonalBlitz4.title']).toContain('Dual-Diagonal');
  });

  it('39. [D4 4수 마스터 공식: d4-checkerboard-super-4] 체커보드(X자/십자) 위상차 4수 메타데이터 & 단계별 Multi-Cancel All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-checkerboard-super-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-checkerboard-super-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: X자 타일(0, 2, 4, 6, 8)은 R180, 십자 타일(1, 3, 5, 7)은 R270
    const s0 = f!.steps![0].boardOps;
    [0, 2, 4, 6, 8].forEach(idx => expect(s0[idx]).toBe(D4.R180));
    [1, 3, 5, 7].forEach(idx => expect(s0[idx]).toBe(D4.R270));

    // 1수: 주대각선(↖) R180 ➔ 0, 4, 8번 셀 3개 동시 소거(트리플 킬)
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.ID);
    expect(s1[4]).toBe(D4.ID);
    expect(s1[8]).toBe(D4.ID);

    // 2수: 부대각선(↗) R180 ➔ 2, 6번 코너 더블 킬 소거
    const s2 = f!.steps![2].boardOps;
    expect(s2[2]).toBe(D4.ID);
    expect(s2[6]).toBe(D4.ID);

    // 3수: 2행 R90 ➔ 3, 5번 변 더블 킬 소거
    const s3 = f!.steps![3].boardOps;
    expect(s3[3]).toBe(D4.ID);
    expect(s3[5]).toBe(D4.ID);

    // 4수: 2열 R90 ➔ 1, 4, 7번 2열 일제 소거 (트리플 킬 피니시) ➔ 전 타일 100% ID
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('40. [D4 3수 마스터 공식: d4-t-spine-flush-3] T자형(1행+2열) 척추 정렬 3수 폭파 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-t-spine-flush-3');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-t-spine-flush-3');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(3);
    expect(f?.steps?.length).toBe(4); // 0단계(초기) + 3수

    // 0단계: 1행(0, 1, 2)과 2열 척추(4, 7)만 뒤틀림 (외곽 3, 5, 6, 8은 이미 ID)
    const s0 = f!.steps![0].boardOps;
    expect(s0[0]).toBe(D4.R180);
    expect(s0[1]).toBe(D4.MX);
    expect(s0[2]).toBe(D4.R180);
    expect(s0[4]).toBe(D4.MX);
    expect(s0[7]).toBe(D4.MX);
    [3, 5, 6, 8].forEach(idx => expect(s0[idx]).toBe(D4.ID));

    // 1수: 1행 R90 ➔ 1번 타일 MX ∘ R90 = MD 위상 결합
    const s1 = f!.steps![1].boardOps;
    expect(s1[1]).toBe(D4.MD);

    // 2수: 2열 MX ➔ 4, 7번 척추 소거 (더블 킬), 1번 타일 R270 동기화
    const s2 = f!.steps![2].boardOps;
    expect(s2[4]).toBe(D4.ID);
    expect(s2[7]).toBe(D4.ID);
    expect(s2[0]).toBe(D4.R270);
    expect(s2[1]).toBe(D4.R270);
    expect(s2[2]).toBe(D4.R270);

    // 3수: 1행 R90 ➔ 1행 전체 3개 타일(0, 1, 2) 일제 소거 (트리플 킬 폭파) ➔ 전 타일 100% ID
    const s3 = f!.steps![3].boardOps;
    expect(s3.every((op) => op === D4.ID)).toBe(true);
  });

  it('41. [D4 4수 마스터 공식: d4-chiral-pinwheel-4] 4방향 바람개비형 회전-반사 복합체 4수 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-chiral-pinwheel-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-chiral-pinwheel-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: 중심 4번 ID, 변은 R270/MX 교차, 코너는 MAD/MD
    const s0 = f!.steps![0].boardOps;
    expect(s0[4]).toBe(D4.ID);
    expect(s0[1]).toBe(D4.R270);
    expect(s0[3]).toBe(D4.MX);
    expect(s0[5]).toBe(D4.MX);
    expect(s0[7]).toBe(D4.R270);

    // 1수: 1행 R90 ➔ 1번 변 타일 소거
    const s1 = f!.steps![1].boardOps;
    expect(s1[1]).toBe(D4.ID);

    // 2수: 3열 MX ➔ 2번 코너, 5번 변 더블 킬 소거
    const s2 = f!.steps![2].boardOps;
    expect(s2[2]).toBe(D4.ID);
    expect(s2[5]).toBe(D4.ID);

    // 3수: 3행 R90 ➔ 7번 변, 8번 코너 더블 킬 소거
    const s3 = f!.steps![3].boardOps;
    expect(s3[7]).toBe(D4.ID);
    expect(s3[8]).toBe(D4.ID);

    // 4수: 1열 MX ➔ 0, 3, 6번 셀 1열 일제 소거 (트리플 킬 폭파) ➔ 전 타일 100% ID
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('42. D4 신규 마스터 공식 3선 i18n 번역 키 및 다국어 사전 등록 검증', async () => {
    const { translations } = await import('../i18n/translations');
    expect(translations.ko['formula.item.d4CheckerboardSuper4.title']).toContain('체커보드');
    expect(translations.en['formula.item.d4CheckerboardSuper4.title']).toContain('Checkerboard');
    expect(translations.ko['formula.item.d4TSpineFlush3.title']).toContain('T자형');
    expect(translations.en['formula.item.d4TSpineFlush3.title']).toContain('T-Spine');
    expect(translations.ko['formula.item.d4ChiralPinwheel4.title']).toContain('바람개비');
    expect(translations.en['formula.item.d4ChiralPinwheel4.title']).toContain('Pinwheel');

    // 실전 보드 연습 관련 키 검증
    expect(translations.ko['formula.btnPracticeOnBoard']).toContain('이 공식 직접 풀어보기');
    expect(translations.en['formula.btnPracticeOnBoard']).toContain('Practice on Board');
    expect(translations.ko['practice.badgeTitle']).toContain('연습 모드');
    expect(translations.en['practice.badgeTitle']).toContain('Practice');
  });

  it('43. [Round 5 D4 마스터 공식 1: d4-corner-ring-blitz-4] 4대 코너 링 블리츠 4수 단계별 소거 및 All-ID 검증', () => {
    const f = getFormulaById('d4-corner-ring-blitz-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-corner-ring-blitz-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: 중앙 4번 ID, 코너 0, 2, 6, 8은 R180, 변 1, 3, 5, 7은 R270
    const s0 = f!.steps![0].boardOps;
    expect(s0[4]).toBe(D4.ID);
    [0, 2, 6, 8].forEach((idx) => expect(s0[idx]).toBe(D4.R180));
    [1, 3, 5, 7].forEach((idx) => expect(s0[idx]).toBe(D4.R270));

    // 1수: 1행 R90 ➔ 1번 변 소거 (R270 ∘ R90 = ID), 남은 에러 7개
    const s1 = f!.steps![1].boardOps;
    expect(s1[1]).toBe(D4.ID);
    expect(s1[4]).toBe(D4.ID);
    expect(s1.filter((op) => op !== D4.ID).length).toBe(7);

    // 2수: 3열 R90 ➔ 2번 코너, 5번 변 동시 소거 (더블 킬), 남은 에러 5개
    const s2 = f!.steps![2].boardOps;
    expect(s2[2]).toBe(D4.ID);
    expect(s2[5]).toBe(D4.ID);
    expect(s2.filter((op) => op !== D4.ID).length).toBe(5);

    // 3수: 3행 R90 ➔ 7번 변, 8번 코너 동시 소거 (더블 킬), 남은 에러 3개
    const s3 = f!.steps![3].boardOps;
    expect(s3[7]).toBe(D4.ID);
    expect(s3[8]).toBe(D4.ID);
    expect(s3.filter((op) => op !== D4.ID).length).toBe(3);

    // 4수: 1열 R90 ➔ 0번, 3번, 6번 일제 소거 (트리플 킬 피니시) ➔ 전 타일 100% ID
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('44. [Round 5 D4 마스터 공식 2: d4-cross-inversion-3] 십자 변·중심 위상 도치 3수 킬 단계별 소거 및 All-ID 검증', () => {
    const f = getFormulaById('d4-cross-inversion-3');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-cross-inversion-3');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(3);
    expect(f?.steps?.length).toBe(4); // 0단계(초기) + 3수

    // 0단계: 코너 0, 2, 6, 8은 ID, 십자 1, 3, 4, 5, 7만 뒤틀림
    const s0 = f!.steps![0].boardOps;
    [0, 2, 6, 8].forEach((idx) => expect(s0[idx]).toBe(D4.ID));
    expect(s0[1]).toBe(D4.MX);
    expect(s0[3]).toBe(D4.R180);
    expect(s0[4]).toBe(D4.MX);
    expect(s0[5]).toBe(D4.R180);
    expect(s0[7]).toBe(D4.MX);

    // 1수: 2행 R90 ➔ 상태 전이 레버리지 형성
    const s1 = f!.steps![1].boardOps;
    [0, 2, 6, 8].forEach((idx) => expect(s1[idx]).toBe(D4.ID));
    expect(s1[4]).toBe(D4.MD);

    // 2수: 2열 MX ➔ 1번, 7번 상하 변 동시 소거 (더블 킬, MX ∘ MX = ID), 남은 에러 3개
    const s2 = f!.steps![2].boardOps;
    expect(s2[1]).toBe(D4.ID);
    expect(s2[7]).toBe(D4.ID);
    expect(s2[3]).toBe(D4.R270);
    expect(s2[4]).toBe(D4.R270);
    expect(s2[5]).toBe(D4.R270);

    // 3수: 2행 R90 ➔ 3번, 4번, 5번 중심행 타일 일제 소거 (트리플 킬 폭파) ➔ 전 타일 100% ID
    const s3 = f!.steps![3].boardOps;
    expect(s3.every((op) => op === D4.ID)).toBe(true);
  });

  it('45. [Round 5 D4 마스터 공식 3: d4-diagonal-windmill-4] 대각선·직교 풍차형 위상차 4수 올킬 단계별 소거 및 All-ID 검증', () => {
    const f = getFormulaById('d4-diagonal-windmill-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-diagonal-windmill-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: 9개 전 타일 풍차형 위상차 (0, 1, 2, 6, 7, 8: R270 / 3, 5: MX / 4: MD)
    const s0 = f!.steps![0].boardOps;
    [0, 1, 2, 6, 7, 8].forEach((idx) => expect(s0[idx]).toBe(D4.R270));
    expect(s0[3]).toBe(D4.MX);
    expect(s0[5]).toBe(D4.MX);
    expect(s0[4]).toBe(D4.MD);

    // 1수: 주대각선(↖) R90 ➔ 0번, 8번 대각 코너 동시 소거 (더블 킬)
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.ID);
    expect(s1[8]).toBe(D4.ID);

    // 2수: 2열 R90 ➔ 1번, 7번 수직 변 동시 소거 (더블 킬)
    const s2 = f!.steps![2].boardOps;
    expect(s2[1]).toBe(D4.ID);
    expect(s2[7]).toBe(D4.ID);

    // 3수: 부대각선(↗) R90 ➔ 2번, 6번 반대편 대각 코너 동시 소거 (더블 킬)
    const s3 = f!.steps![3].boardOps;
    expect(s3[2]).toBe(D4.ID);
    expect(s3[6]).toBe(D4.ID);
    // 중심 2행(3, 4, 5)만 MX로 단일 동기화
    expect(s3[3]).toBe(D4.MX);
    expect(s3[4]).toBe(D4.MX);
    expect(s3[5]).toBe(D4.MX);

    // 4수: 2행 MX ➔ 3번, 4번, 5번 중심행 타일 일제 소거 (트리플 킬 폭파) ➔ 전 타일 100% ID
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('46. [Round 5 i18n & 카테고리 검증] Round 5 신규 공식 3선 i18n 번역 키 및 god-number 총 개수(17개) 검증', async () => {
    const { translations } = await import('../i18n/translations');
    expect(translations.ko['formula.item.d4CornerRingBlitz4.title']).toContain('코너 링');
    expect(translations.en['formula.item.d4CornerRingBlitz4.title']).toContain('Corner Ring');
    expect(translations.ko['formula.item.d4CrossInversion3.title']).toContain('십자 변');
    expect(translations.en['formula.item.d4CrossInversion3.title']).toContain('Cross Inversion');
    expect(translations.ko['formula.item.d4DiagonalWindmill4.title']).toContain('풍차');
    expect(translations.en['formula.item.d4DiagonalWindmill4.title']).toContain('Windmill');

    // 검색 관련 키 검증
    expect(translations.ko['formula.searchPlaceholder']).toContain('검색');
    expect(translations.en['formula.searchPlaceholder']).toContain('Search');
    expect(translations.ko['formula.searchEmptyMsg']).toContain('결과');
    expect(translations.en['formula.searchEmptyMsg']).toContain('No matching');
    expect(translations.ko['formula.searchClearBtn']).toContain('지우기');
    expect(translations.en['formula.searchClearBtn']).toContain('Clear');

    const godNumberFormulas = getFormulasByCategory('god-number');
    expect(godNumberFormulas.length).toBe(17);
    expect(godNumberFormulas.some((f) => f.id === 'd4-corner-ring-blitz-4')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-cross-inversion-3')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-diagonal-windmill-4')).toBe(true);
  });

  it('47. [Round 5 비법서 실시간 검색 & 다차원 태그 칩 필터링: filterFormulas] 검색 로직 단위 검증', () => {
    // 1. 전체 검색 (빈 쿼리)
    const all = filterFormulas(FORMULAS, '', 'all', 'all');
    expect(all.length).toBe(FORMULAS.length);

    // 2. 카테고리 필터링
    const basics = filterFormulas(FORMULAS, '', 'basics', 'all');
    expect(basics.every((f) => f.category === 'basics')).toBe(true);

    const godOnly = filterFormulas(FORMULAS, '', 'god-number', 'all');
    expect(godOnly.length).toBe(17);

    // 3. 태그 칩 필터링
    const tag4Move = filterFormulas(FORMULAS, '', 'all', '4수');
    expect(tag4Move.length).toBeGreaterThanOrEqual(2);
    expect(tag4Move.every((f) => f.tags?.some((t) => t.includes('4수')))).toBe(true);

    // 4. 키워드 검색 (제목 검색)
    const searchWindmill = filterFormulas(FORMULAS, '풍차', 'all', 'all');
    expect(searchWindmill.some((f) => f.id === 'd4-diagonal-windmill-4')).toBe(true);

    // 5. ID 검색
    const searchById = filterFormulas(FORMULAS, 'd4-corner-ring', 'all', 'all');
    expect(searchById.length).toBe(1);
    expect(searchById[0].id).toBe('d4-corner-ring-blitz-4');

    // 6. 복합 AND 필터링: god-number 카테고리 + 3수 태그 + 십자 검색
    const combo = filterFormulas(FORMULAS, '십자', 'god-number', '3수');
    expect(combo.some((f) => f.id === 'd4-cross-inversion-3')).toBe(true);

    // 7. 불일치 검색어 결과 비어있음 검증
    const empty = filterFormulas(FORMULAS, 'non-existent-xyz-random-12345', 'all', 'all');
    expect(empty.length).toBe(0);
  });

});
