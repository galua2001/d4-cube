with open('src/data/formulas.test.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update test 60: 26 -> 29
old_test60 = """    // 총 god-number 개수 정확히 26개 검증
    const godNumberFormulas = getFormulasByCategory('god-number');
    expect(godNumberFormulas.length).toBe(26);"""

new_test60 = """    // 총 god-number 개수 정확히 29개 검증
    const godNumberFormulas = getFormulasByCategory('god-number');
    expect(godNumberFormulas.length).toBe(29);"""

if old_test60 not in text:
    old_test60_crlf = old_test60.replace('\n', '\r\n')
    if old_test60_crlf in text:
        text = text.replace(old_test60_crlf, new_test60)
    else:
        raise RuntimeError('old_test60 not found')
else:
    text = text.replace(old_test60, new_test60)

new_tests = """
  it('61. [Round 9 마스터 공식: d4-spiral-core-vortex-4] 나선형 코어 볼텍스 4수 소거 공식 메타데이터 및 단계별 All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-spiral-core-vortex-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-spiral-core-vortex-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: 중심 4번은 ID, 코너 4개는 R180, 변 4개는 R270
    const s0 = f!.steps![0].boardOps;
    expect(s0[4]).toBe(D4.ID);
    [0, 2, 6, 8].forEach((idx) => expect(s0[idx]).toBe(D4.R180));
    [1, 3, 5, 7].forEach((idx) => expect(s0[idx]).toBe(D4.R270));

    // 1수: 1행(Row 1) R90 ➔ 1번 상단 변 소거 (R270 * R90 = ID), 0, 2번 코너 R270 전이
    const s1 = f!.steps![1].boardOps;
    expect(s1[1]).toBe(D4.ID);
    expect(s1[0]).toBe(D4.R270);
    expect(s1[2]).toBe(D4.R270);

    // 2수: 3열(Col 3) R90 ➔ 2번 코너와 5번 변 동시 더블 소거 (Double Cancel)
    const s2 = f!.steps![2].boardOps;
    expect(s2[2]).toBe(D4.ID);
    expect(s2[5]).toBe(D4.ID);

    // 3수: 3행(Row 3) R90 ➔ 7번 변과 8번 코너 연속 소거, 1열(0, 3, 6번)이 R270 균일 위상화
    const s3 = f!.steps![3].boardOps;
    expect(s3[7]).toBe(D4.ID);
    expect(s3[8]).toBe(D4.ID);
    expect(s3[0]).toBe(D4.R270);
    expect(s3[3]).toBe(D4.R270);
    expect(s3[6]).toBe(D4.R270);

    // 4수: 1열(Col 1) R90 ➔ 1열 3개 타일(0, 3, 6번) 일제 소거 (트리플 킬) ➔ 100% ID 올클리어
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('62. [Round 9 마스터 공식: d4-diamond-core-smash-3] 마름모꼴 다이아몬드 코어 3수 스매시 공식 메타데이터 및 단계별 All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-diamond-core-smash-3');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-diamond-core-smash-3');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(3);
    expect(f?.steps?.length).toBe(4); // 0단계(초기) + 3수

    // 0단계: 4대 코너(0, 2, 6, 8)는 ID, 십자 변(1, 3, 5, 7)은 MX, 중심 4번은 R180
    const s0 = f!.steps![0].boardOps;
    [0, 2, 6, 8].forEach((idx) => expect(s0[idx]).toBe(D4.ID));
    [1, 3, 5, 7].forEach((idx) => expect(s0[idx]).toBe(D4.MX));
    expect(s0[4]).toBe(D4.R180);

    // 1수: 2행(Row 2) R90 ➔ 좌우 변(3, 5)이 MD로 전이, 중심 4번이 R270으로 조작
    const s1 = f!.steps![1].boardOps;
    expect(s1[3]).toBe(D4.MD);
    expect(s1[5]).toBe(D4.MD);
    expect(s1[4]).toBe(D4.R270);

    // 2수: 2열(Col 2) MX ➔ 1번·7번 상하 변 동시 소거, 2행 전체(3, 4, 5번)가 MD 위상으로 통일
    const s2 = f!.steps![2].boardOps;
    expect(s2[1]).toBe(D4.ID);
    expect(s2[7]).toBe(D4.ID);
    expect(s2[3]).toBe(D4.MD);
    expect(s2[4]).toBe(D4.MD);
    expect(s2[5]).toBe(D4.MD);

    // 3수: 2행(Row 2) MD ➔ 2행 3개 타일(3, 4, 5번) 일제 MD 소거 (트리플 킬) ➔ 100% ID 올클리어
    const s3 = f!.steps![3].boardOps;
    expect(s3.every((op) => op === D4.ID)).toBe(true);
  });

  it('63. [Round 9 마스터 공식: d4-anti-checker-parity-4] 안티 체커 패리티 & 대각 반사 4수 올킬 공식 메타데이터 및 단계별 All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-anti-checker-parity-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-anti-checker-parity-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: 코너 4개(0, 2, 6, 8)는 MD, 십자 변 4개(1, 3, 5, 7)는 R180, 중심 4번은 ID
    const s0 = f!.steps![0].boardOps;
    expect(s0[4]).toBe(D4.ID);
    [0, 2, 6, 8].forEach((idx) => expect(s0[idx]).toBe(D4.MD));
    [1, 3, 5, 7].forEach((idx) => expect(s0[idx]).toBe(D4.R180));

    // 1수: 주대각선(↖) MD ➔ 0번과 8번 코너 즉각 소거 (더블 킬), 중심 4번은 MD 전이
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.ID);
    expect(s1[8]).toBe(D4.ID);
    expect(s1[4]).toBe(D4.MD);

    // 2수: 2행(Row 2) R180 ➔ 좌우 3번과 5번 타일 동시 소거 (더블 킬), 중심 4번은 MAD 전이
    const s2 = f!.steps![2].boardOps;
    expect(s2[3]).toBe(D4.ID);
    expect(s2[5]).toBe(D4.ID);
    expect(s2[4]).toBe(D4.MAD);

    // 3수: 부대각선(↗) MD ➔ 2번과 6번 코너 완전 소거 (더블 킬), 2열(1, 4, 7번)이 R180 위상으로 정합
    const s3 = f!.steps![3].boardOps;
    expect(s3[2]).toBe(D4.ID);
    expect(s3[6]).toBe(D4.ID);
    expect(s3[1]).toBe(D4.R180);
    expect(s3[4]).toBe(D4.R180);
    expect(s3[7]).toBe(D4.R180);

    // 4수: 2열(Col 2) R180 ➔ 2열 3개 타일(1, 4, 7번) 일제 소거 (트리플 킬 피니시) ➔ 100% ID 올클리어
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('64. [Round 9 i18n & 총 29개 god-number 완전성 검증] 신규 3선 다국어 및 전체 god-number 개수(29개) 검증', async () => {
    const { translations } = await import('../i18n/translations');
    expect(translations.ko['formula.item.d4SpiralCoreVortex4.title']).toContain('나선형 코어 볼텍스');
    expect(translations.en['formula.item.d4SpiralCoreVortex4.title']).toContain('Spiral Core Vortex');
    expect(translations.ko['formula.item.d4DiamondCoreSmash3.title']).toContain('다이아몬드 코어 3수 스매시');
    expect(translations.en['formula.item.d4DiamondCoreSmash3.title']).toContain('Diamond Core Smash');
    expect(translations.ko['formula.item.d4AntiCheckerParity4.title']).toContain('안티 체커 패리티');
    expect(translations.en['formula.item.d4AntiCheckerParity4.title']).toContain('Anti-Checker Parity');

    // 총 god-number 개수 정확히 29개 검증
    const godNumberFormulas = getFormulasByCategory('god-number');
    expect(godNumberFormulas.length).toBe(29);
    expect(godNumberFormulas.some((f) => f.id === 'd4-spiral-core-vortex-4')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-diamond-core-smash-3')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-anti-checker-parity-4')).toBe(true);
  });
"""

# Insert before closing });
idx_close = text.rfind('});')
if idx_close == -1:
    raise RuntimeError('closing }); not found')

text = text[:idx_close] + new_tests + '\n});\n'

with open('src/data/formulas.test.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated src/data/formulas.test.ts successfully!')
