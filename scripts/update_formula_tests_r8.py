# -*- coding: utf-8 -*-
test_path = r'C:\Users\user\matrix-cube\src\data\formulas.test.ts'

with open(test_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. import에 sortFormulas 추가
if 'sortFormulas' not in code:
    code = code.replace("filterFormulas } from './formulas';", "filterFormulas, sortFormulas } from './formulas';")
    print("Added sortFormulas to imports!")

# 2. 모든 이전 god-number 카운트 단언(toBe(17), toBe(20), toBe(23))을 26으로 통일
code = code.replace("expect(godNumberFormulas.length).toBe(17);", "expect(godNumberFormulas.length).toBe(26);")
code = code.replace("expect(godNumberFormulas.length).toBe(20);", "expect(godNumberFormulas.length).toBe(26);")
code = code.replace("expect(godNumberFormulas.length).toBe(23);", "expect(godNumberFormulas.length).toBe(26);")
code = code.replace("expect(godOnly.length).toBe(17);", "expect(godOnly.length).toBe(26);")
code = code.replace("expect(godOnly.length).toBe(20);", "expect(godOnly.length).toBe(26);")
code = code.replace("expect(godOnly.length).toBe(23);", "expect(godOnly.length).toBe(26);")
print("Updated all god-number length expectations to 26!")

# 3. 신규 Round 8 공식 3선 및 정렬 테스트 블록 작성
r8_tests = """
  it('56. [D4 4수 마스터 공식: d4-zigzag-diagonal-flush-4] D4 지그재그 대각 소거 4수 단계별 소거 및 All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-zigzag-diagonal-flush-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-zigzag-diagonal-flush-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 초기(0) + 4수

    // 0단계: 0, 1, 4, 7, 8번 지그재그 경로 에러 (0: MY, 1: MX, 4: MY, 7: MX, 8: MY)
    const s0 = f!.steps![0].boardOps;
    expect(s0[0]).toBe(D4.MY);
    expect(s0[1]).toBe(D4.MX);
    expect(s0[4]).toBe(D4.MY);
    expect(s0[7]).toBe(D4.MX);
    expect(s0[8]).toBe(D4.MY);
    [2, 3, 5, 6].forEach((idx) => expect(s0[idx]).toBe(D4.ID));

    // 1수: 주대각선(↖) R180 ➔ MY ∘ R180 = MX로 지그재그 축이 MX 단일 위상 정렬
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.MX);
    expect(s1[1]).toBe(D4.MX);
    expect(s1[4]).toBe(D4.MX);
    expect(s1[7]).toBe(D4.MX);
    expect(s1[8]).toBe(D4.MX);

    // 2수: 부대각선(↗) MX ➔ 중심 4번 타일 MX ∘ MX = ID 소거 및 상하 1행·3행 위상 분배
    const s2 = f!.steps![2].boardOps;
    expect(s2[4]).toBe(D4.ID);
    expect(s2[0]).toBe(D4.MX);
    expect(s2[1]).toBe(D4.MX);
    expect(s2[2]).toBe(D4.MX);
    expect(s2[6]).toBe(D4.MX);
    expect(s2[7]).toBe(D4.MX);
    expect(s2[8]).toBe(D4.MX);

    // 3수: 3행 MX ➔ 6, 7, 8번 하단 타일 일제 소거 (트리플 킬 폭파)
    const s3 = f!.steps![3].boardOps;
    expect(s3[6]).toBe(D4.ID);
    expect(s3[7]).toBe(D4.ID);
    expect(s3[8]).toBe(D4.ID);
    expect(s3[0]).toBe(D4.MX);
    expect(s3[1]).toBe(D4.MX);
    expect(s3[2]).toBe(D4.MX);

    // 4수: 1행 MX ➔ 0, 1, 2번 상단 타일 일제 소거 (트리플 킬 피니시!) ➔ 100% ID 올클리어
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('57. [D4 3수 마스터 공식: d4-corner-sandwich-3] D4 코너 샌드위치 폭파 3수 단계별 소거 및 All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-corner-sandwich-3');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-corner-sandwich-3');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(3);
    expect(f?.steps?.length).toBe(4); // 초기(0) + 3수

    // 0단계: 4대 코너(0, 2, 6, 8) 및 중심(4)에 MX 에러
    const s0 = f!.steps![0].boardOps;
    [0, 2, 4, 6, 8].forEach((idx) => expect(s0[idx]).toBe(D4.MX));
    [1, 3, 5, 7].forEach((idx) => expect(s0[idx]).toBe(D4.ID));

    // 1수: 1열 MX ➔ 코너 0, 6 소거 및 교차점 3에 매개 MX 생성
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.ID);
    expect(s1[6]).toBe(D4.ID);
    expect(s1[3]).toBe(D4.MX);

    // 2수: 3열 MX ➔ 코너 2, 8 소거 및 2행 전체(3, 4, 5)가 순수 MX 단일 위상 동기화
    const s2 = f!.steps![2].boardOps;
    expect(s2[2]).toBe(D4.ID);
    expect(s2[8]).toBe(D4.ID);
    expect(s2[3]).toBe(D4.MX);
    expect(s2[4]).toBe(D4.MX);
    expect(s2[5]).toBe(D4.MX);

    // 3수: 2행 MX ➔ 2행 3, 4, 5번 타일 일제 소거 (트리플 킬 피니시!) ➔ 100% ID 올클리어
    const s3 = f!.steps![3].boardOps;
    expect(s3.every((op) => op === D4.ID)).toBe(true);
  });

  it('58. [D4 4수 마스터 공식: d4-checker-superposition-4] D4 슈퍼 중첩 체커보드 4수 단계별 소거 및 All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-checker-superposition-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-checker-superposition-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 초기(0) + 4수

    // 0단계: 코너 4개(0, 2, 6, 8) R180, 십자 4개(1, 3, 5, 7) MD, 중심(4) ID
    const s0 = f!.steps![0].boardOps;
    [0, 2, 6, 8].forEach((idx) => expect(s0[idx]).toBe(D4.R180));
    [1, 3, 5, 7].forEach((idx) => expect(s0[idx]).toBe(D4.MD));
    expect(s0[4]).toBe(D4.ID);

    // 1수: 주대각선(↖) R180 ➔ 코너 0, 8 소거, 중심 4번에 R180 임시 생성
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.ID);
    expect(s1[8]).toBe(D4.ID);
    expect(s1[4]).toBe(D4.R180);

    // 2수: 부대각선(↗) R180 ➔ 코너 2, 6 소거, 중심 4번 타일 R180² = ID 원상 복귀
    const s2 = f!.steps![2].boardOps;
    expect(s2[2]).toBe(D4.ID);
    expect(s2[6]).toBe(D4.ID);
    expect(s2[4]).toBe(D4.ID);

    // 3수: 2열 MD ➔ 1번 및 7번 수직 에지 소거, 중심 2행(3, 4, 5)이 순수 MD 위상 정렬
    const s3 = f!.steps![3].boardOps;
    expect(s3[1]).toBe(D4.ID);
    expect(s3[7]).toBe(D4.ID);
    expect(s3[3]).toBe(D4.MD);
    expect(s3[4]).toBe(D4.MD);
    expect(s3[5]).toBe(D4.MD);

    // 4수: 2행 MD ➔ 중심행 3, 4, 5번 타일 일제 소거 (트리플 킬 피니시!) ➔ 100% ID 올클리어
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('59. [Round 8 비법서 공식 정렬: sortFormulas] 기본순, 난이도 오름/내림차순, 이름순 정렬 단위 검증', () => {
    // 1. 기본순 (default): 원본 배열의 순서 보존
    const defaultSorted = sortFormulas(FORMULAS, 'default', 'ko');
    expect(defaultSorted.map((f) => f.id)).toEqual(FORMULAS.map((f) => f.id));

    // 2. 난이도 낮은순 (diff-asc): difficulty 1 -> 2 -> 3 -> 4 -> 5 오름차순
    const diffAsc = sortFormulas(FORMULAS, 'diff-asc', 'ko');
    for (let i = 0; i < diffAsc.length - 1; i++) {
      expect(diffAsc[i].difficulty).toBeLessThanOrEqual(diffAsc[i + 1].difficulty);
    }
    expect(diffAsc[0].difficulty).toBeLessThanOrEqual(2);

    // 3. 난이도 높은순 (diff-desc): difficulty 5 -> 4 -> 3 -> 2 -> 1 내림차순
    const diffDesc = sortFormulas(FORMULAS, 'diff-desc', 'ko');
    for (let i = 0; i < diffDesc.length - 1; i++) {
      expect(diffDesc[i].difficulty).toBeGreaterThanOrEqual(diffDesc[i + 1].difficulty);
    }
    expect(diffDesc[0].difficulty).toBeGreaterThanOrEqual(4);

    // 4. 이름순 (name-asc, 한국어): titleKo 가나다 사전순
    const nameAscKo = sortFormulas(FORMULAS, 'name-asc', 'ko');
    for (let i = 0; i < nameAscKo.length - 1; i++) {
      const titleA = nameAscKo[i].titleKo || '';
      const titleB = nameAscKo[i + 1].titleKo || '';
      expect(titleA.localeCompare(titleB, 'ko')).toBeLessThanOrEqual(0);
    }

    // 5. 이름순 (name-asc, 영어): titleEn ABC 사전순
    const nameAscEn = sortFormulas(FORMULAS, 'name-asc', 'en');
    for (let i = 0; i < nameAscEn.length - 1; i++) {
      const titleA = nameAscEn[i].titleEn || '';
      const titleB = nameAscEn[i + 1].titleEn || '';
      expect(titleA.localeCompare(titleB, 'en')).toBeLessThanOrEqual(0);
    }
  });

  it('60. [Round 8 i18n & 총 26개 god-number 완전성 검증] 신규 3선 다국어 및 전체 god-number 개수 검증', async () => {
    const { translations } = await import('../i18n/translations');

    // 신규 공식 3선 제목 검증
    expect(translations.ko['formula.item.d4ZigzagDiagonalFlush4.title']).toContain('지그재그');
    expect(translations.en['formula.item.d4ZigzagDiagonalFlush4.title']).toContain('Zigzag');
    expect(translations.ko['formula.item.d4CornerSandwich3.title']).toContain('샌드위치');
    expect(translations.en['formula.item.d4CornerSandwich3.title']).toContain('Sandwich');
    expect(translations.ko['formula.item.d4CheckerSuperposition4.title']).toContain('슈퍼 중첩 체커보드');
    expect(translations.en['formula.item.d4CheckerSuperposition4.title']).toContain('Checker Superposition');

    // 정렬 관련 다국어 키 검증
    expect(translations.ko['formula.sortLabel']).toBe('정렬 기준');
    expect(translations.en['formula.sortLabel']).toBe('Sort by');
    expect(translations.ko['formula.sortDefault']).toBe('기본순');
    expect(translations.en['formula.sortDefault']).toBe('Default Order');
    expect(translations.ko['formula.sortDiffAsc']).toContain('난이도 낮은순');
    expect(translations.en['formula.sortDiffAsc']).toContain('Low ➔ High');
    expect(translations.ko['formula.sortDiffDesc']).toContain('난이도 높은순');
    expect(translations.en['formula.sortDiffDesc']).toContain('High ➔ Low');
    expect(translations.ko['formula.sortNameAsc']).toContain('이름순');
    expect(translations.en['formula.sortNameAsc']).toContain('Name');

    // 총 god-number 개수 정확히 26개 검증
    const godNumberFormulas = getFormulasByCategory('god-number');
    expect(godNumberFormulas.length).toBe(26);
    expect(godNumberFormulas.some((f) => f.id === 'd4-zigzag-diagonal-flush-4')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-corner-sandwich-3')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-checker-superposition-4')).toBe(true);
  });
"""

# Place r8_tests right before the last closing line '});'
last_closing = code.rfind("});")
if last_closing != -1:
    code = code[:last_closing] + r8_tests + "\n});\n"
    print("Injected Round 8 tests 56, 57, 58, 59, 60!")

with open(test_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("formulas.test.ts successfully updated!")
