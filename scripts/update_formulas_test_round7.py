# -*- coding: utf-8 -*-
filepath = 'C:/Users/user/matrix-cube/src/data/formulas.test.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# Update expectations of 20 to 23
text = text.replace("expect(godNumberFormulas.length).toBe(20);", "expect(godNumberFormulas.length).toBe(23);")
text = text.replace("expect(godOnly.length).toBe(20);", "expect(godOnly.length).toBe(23);")

new_tests = """
  it('52. [D4 4수 마스터 공식: d4-corner-kite-flux-4] 코너 카이트 플럭스 4수 슈퍼 소거 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-corner-kite-flux-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-corner-kite-flux-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: 주대각선 축 연(Kite) 형태 4개 타일(0, 5, 7, 8) MX 에러
    const s0 = f!.steps![0].boardOps;
    expect(s0[0]).toBe(D4.MX);
    expect(s0[5]).toBe(D4.MX);
    expect(s0[7]).toBe(D4.MX);
    expect(s0[8]).toBe(D4.MX);
    [1, 2, 3, 4, 6].forEach((idx) => expect(s0[idx]).toBe(D4.ID));

    // 1수: 주대각(↖) MX ➔ 0, 8번 코너 타일 소거 (더블 킬)
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.ID);
    expect(s1[8]).toBe(D4.ID);
    expect(s1[4]).toBe(D4.MX);
    expect(s1[5]).toBe(D4.MX);
    expect(s1[7]).toBe(D4.MX);

    // 2수: 부대각(↗) MX ➔ 중심 4번 타일 소거, 2번·6번 타일 임시 매개
    const s2 = f!.steps![2].boardOps;
    expect(s2[4]).toBe(D4.ID);
    expect(s2[2]).toBe(D4.MX);
    expect(s2[5]).toBe(D4.MX);
    expect(s2[6]).toBe(D4.MX);
    expect(s2[7]).toBe(D4.MX);

    // 3수: 3열 MX ➔ 2번, 5번 타일 소거, 3행(6, 7, 8) 전체가 순수 MX로 정렬
    const s3 = f!.steps![3].boardOps;
    expect(s3[2]).toBe(D4.ID);
    expect(s3[5]).toBe(D4.ID);
    expect(s3[6]).toBe(D4.MX);
    expect(s3[7]).toBe(D4.MX);
    expect(s3[8]).toBe(D4.MX);

    // 4수: 3행 MX ➔ 3행 6, 7, 8번 타일 일제 소거 (트리플 킬 피니시) ➔ 전 타일 100% ID
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('53. [D4 3수 마스터 공식: d4-plus-omega-cross-3] 오메가 십자 대각 복합 3수 킬 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-plus-omega-cross-3');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-plus-omega-cross-3');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(3);
    expect(f?.steps?.length).toBe(4); // 0단계(초기) + 3수

    // 0단계: 십자 변 4개는 MAD, 주대각선 3개는 MD
    const s0 = f!.steps![0].boardOps;
    expect(s0[1]).toBe(D4.MAD);
    expect(s0[3]).toBe(D4.MAD);
    expect(s0[5]).toBe(D4.MAD);
    expect(s0[7]).toBe(D4.MAD);
    expect(s0[0]).toBe(D4.MD);
    expect(s0[4]).toBe(D4.MD);
    expect(s0[8]).toBe(D4.MD);
    expect(s0[2]).toBe(D4.ID);
    expect(s0[6]).toBe(D4.ID);

    // 1수: 2행 MAD ➔ 3, 5번 좌우 십자 변 소거 (더블 킬), 중심 4번은 MD * MAD = R180
    const s1 = f!.steps![1].boardOps;
    expect(s1[3]).toBe(D4.ID);
    expect(s1[5]).toBe(D4.ID);
    expect(s1[4]).toBe(D4.R180);

    // 2수: 2열 MAD ➔ 1, 7번 상하 십자 변 소거 (더블 킬), 중심 4번은 R180 * MAD = MD ➔ 주대각선(0, 4, 8) MD 동기화
    const s2 = f!.steps![2].boardOps;
    expect(s2[1]).toBe(D4.ID);
    expect(s2[7]).toBe(D4.ID);
    expect(s2[0]).toBe(D4.MD);
    expect(s2[4]).toBe(D4.MD);
    expect(s2[8]).toBe(D4.MD);

    // 3수: 주대각(↖) MD ➔ 주대각선 0, 4, 8번 타일 일제 소거 (트리플 킬 피니시) ➔ 전 타일 100% ID
    const s3 = f!.steps![3].boardOps;
    expect(s3.every((op) => op === D4.ID)).toBe(true);
  });

  it('54. [D4 4수 마스터 공식: d4-hyper-cube-frame-4] 하이퍼 프레임 4수 피니시 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-hyper-cube-frame-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-hyper-cube-frame-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: 중심 4번은 ID, 외곽 코너 4개 R180, 외곽 변 4개 R270
    const s0 = f!.steps![0].boardOps;
    expect(s0[4]).toBe(D4.ID);
    [0, 2, 6, 8].forEach((idx) => expect(s0[idx]).toBe(D4.R180));
    [1, 3, 5, 7].forEach((idx) => expect(s0[idx]).toBe(D4.R270));

    // 1수: 1행 R90 ➔ 1번 엣지 소거, 0·2번 코너 R270 변환
    const s1 = f!.steps![1].boardOps;
    expect(s1[1]).toBe(D4.ID);
    expect(s1[0]).toBe(D4.R270);
    expect(s1[2]).toBe(D4.R270);

    // 2수: 3행 R90 ➔ 7번 엣지 소거, 6·8번 코너 R270 변환 ➔ 1열(0, 3, 6) 및 3열(2, 5, 8) 6개 타일 전체 R270 동기화
    const s2 = f!.steps![2].boardOps;
    expect(s2[7]).toBe(D4.ID);
    expect(s2[6]).toBe(D4.R270);
    expect(s2[8]).toBe(D4.R270);
    [0, 3, 6, 2, 5, 8].forEach((idx) => expect(s2[idx]).toBe(D4.R270));

    // 3수: 1열 R90 ➔ 1열 0, 3, 6번 타일 일제 소거 (트리플 킬)
    const s3 = f!.steps![3].boardOps;
    expect(s3[0]).toBe(D4.ID);
    expect(s3[3]).toBe(D4.ID);
    expect(s3[6]).toBe(D4.ID);

    // 4수: 3열 R90 ➔ 3열 2, 5, 8번 타일 일제 소거 (트리플 킬 피니시) ➔ 전 타일 100% ID
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('55. D4 Round 7 신규 마스터 공식 3선 i18n 번역 키 및 god-number 총 23개 카테고리 완전성 검증', async () => {
    const { translations } = await import('../i18n/translations');
    expect(translations.ko['formula.item.d4CornerKiteFlux4.title']).toContain('코너 카이트 플럭스');
    expect(translations.en['formula.item.d4CornerKiteFlux4.title']).toContain('Corner Kite Flux');
    expect(translations.ko['formula.item.d4PlusOmegaCross3.title']).toContain('오메가 십자 대각 복합');
    expect(translations.en['formula.item.d4PlusOmegaCross3.title']).toContain('Plus-Omega Cross');
    expect(translations.ko['formula.item.d4HyperCubeFrame4.title']).toContain('하이퍼 프레임');
    expect(translations.en['formula.item.d4HyperCubeFrame4.title']).toContain('Hyper-Cube Frame');

    // 즐겨찾기 관련 다국어 키 검증
    expect(translations.ko['formula.tabFavorites']).toContain('즐겨찾기');
    expect(translations.en['formula.tabFavorites']).toBe('Favorites');
    expect(translations.ko['formula.favoriteEmptyMsg']).toContain('즐겨찾기한 공식이 없습니다');
    expect(translations.en['formula.favoriteEmptyMsg']).toContain('No favorite formulas');
    expect(translations.ko['formula.btnAddToFavorites']).toBe('즐겨찾기에 추가');
    expect(translations.en['formula.btnAddToFavorites']).toBe('Add to Favorites');
    expect(translations.ko['formula.btnRemoveFromFavorites']).toBe('즐겨찾기에서 제거');
    expect(translations.en['formula.btnRemoveFromFavorites']).toBe('Remove from Favorites');

    // 총 god-number 개수 정확히 23개 검증
    const godNumberFormulas = getFormulasByCategory('god-number');
    expect(godNumberFormulas.length).toBe(23);
    expect(godNumberFormulas.some((f) => f.id === 'd4-corner-kite-flux-4')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-plus-omega-cross-3')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-hyper-cube-frame-4')).toBe(true);
  });
"""

# Insert new tests right before the last closing });
last_brace = text.rfind('});')
text = text[:last_brace] + new_tests + '\n});\n'

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print('formulas.test.ts successfully updated with Round 7 tests!')
