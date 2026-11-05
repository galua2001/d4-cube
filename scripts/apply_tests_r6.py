# -*- coding: utf-8 -*-
import sys

file_path = r'C:\Users\user\matrix-cube\src\data\formulas.test.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. it 18에서 expect(godNumberFormulas.length).toBe(17); -> toBe(20);
content = content.replace("expect(godNumberFormulas.length).toBe(17);", "expect(godNumberFormulas.length).toBe(20);", 1)

# 2. it 46에서 expect(godNumberFormulas.length).toBe(17); -> toBe(20);
content = content.replace("expect(godNumberFormulas.length).toBe(17);", "expect(godNumberFormulas.length).toBe(20);", 1)

# 3. it 47에서 expect(godOnly.length).toBe(17); -> toBe(20);
content = content.replace("expect(godOnly.length).toBe(17);", "expect(godOnly.length).toBe(20);", 1)

# 4. it 48, 49, 50, 51 추가
target_end = """    // 7. 불일치 검색어 결과 비어있음 검증
    const empty = filterFormulas(FORMULAS, 'non-existent-xyz-random-12345', 'all', 'all');
    expect(empty.length).toBe(0);
  });

});"""

replace_end = """    // 7. 불일치 검색어 결과 비어있음 검증
    const empty = filterFormulas(FORMULAS, 'non-existent-xyz-random-12345', 'all', 'all');
    expect(empty.length).toBe(0);
  });

  it('48. [D4 4수 마스터 공식: d4-twin-column-flux-4] 쌍둥이 열 대칭 플럭스 4수 슈퍼 소거 메타데이터 & Multi-Step All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-twin-column-flux-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-twin-column-flux-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: 2열은 전원 ID, 1열(0, 3, 6)은 R270, 3열은 MX/MY
    const s0 = f!.steps![0].boardOps;
    expect(s0[1]).toBe(D4.ID);
    expect(s0[4]).toBe(D4.ID);
    expect(s0[7]).toBe(D4.ID);
    expect(s0[0]).toBe(D4.R270);
    expect(s0[3]).toBe(D4.R270);
    expect(s0[6]).toBe(D4.R270);
    expect(s0[2]).toBe(D4.MX);
    expect(s0[5]).toBe(D4.MY);
    expect(s0[8]).toBe(D4.MX);

    // 1수: 1열 R90 ➔ 0, 3, 6번 셀 일괄 소거 (트리플 킬)
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.ID);
    expect(s1[3]).toBe(D4.ID);
    expect(s1[6]).toBe(D4.ID);

    // 2수: 2행 R90 ➔ 2행 임시 비틀림 (3열 5번 셀 반사 켤레 준비)
    const s2 = f!.steps![2].boardOps;
    expect(s2[3]).toBe(D4.R90);
    expect(s2[4]).toBe(D4.R90);
    expect(s2[5]).toBe(D4.MAD);

    // 3수: 3열 MX ➔ 3열 3개 타일(2, 5, 8) 일제 소거 (트리플 킬), 2행 순수 R90 동기화
    const s3 = f!.steps![3].boardOps;
    expect(s3[2]).toBe(D4.ID);
    expect(s3[5]).toBe(D4.R90);
    expect(s3[8]).toBe(D4.ID);

    // 4수: 2행 R270 ➔ 2행 3, 4, 5번 셀 완전 복원 (트리플 킬 피니시) ➔ 전 타일 100% ID
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('49. [D4 3수 마스터 공식: d4-h-bracket-smash-3] H-브래킷 위상 도치 3수 킬 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-h-bracket-smash-3');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-h-bracket-smash-3');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(3);
    expect(f?.steps?.length).toBe(4); // 0단계(초기) + 3수

    // 0단계: 상하 변(1, 7)은 ID, 1열·3열·중심 7개 타일 에러
    const s0 = f!.steps![0].boardOps;
    expect(s0[1]).toBe(D4.ID);
    expect(s0[7]).toBe(D4.ID);
    expect(s0[0]).toBe(D4.R270);
    expect(s0[3]).toBe(D4.R180);
    expect(s0[6]).toBe(D4.R270);
    expect(s0[4]).toBe(D4.R270);
    expect(s0[2]).toBe(D4.R270);
    expect(s0[5]).toBe(D4.R180);
    expect(s0[8]).toBe(D4.R270);

    // 1수: 1열 R90 ➔ 0, 6번 코너 타일 소거 (더블 킬)
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.ID);
    expect(s1[6]).toBe(D4.ID);
    expect(s1[3]).toBe(D4.R270);

    // 2수: 2행 R90 ➔ 3, 4번 셀 소거 (더블 킬), 3열 전체(2, 5, 8)가 순수 R270 단일 위상으로 동기화
    const s2 = f!.steps![2].boardOps;
    expect(s2[3]).toBe(D4.ID);
    expect(s2[4]).toBe(D4.ID);
    expect(s2[2]).toBe(D4.R270);
    expect(s2[5]).toBe(D4.R270);
    expect(s2[8]).toBe(D4.R270);

    // 3수: 3열 R90 ➔ 3열 3개 타일(2, 5, 8) 일제 소거 (트리플 킬 피니시) ➔ 전 타일 100% ID
    const s3 = f!.steps![3].boardOps;
    expect(s3.every((op) => op === D4.ID)).toBe(true);
  });

  it('50. [D4 4수 마스터 공식: d4-star-burst-vortex-4] 8방향 별빛 소용돌이 4수 올킬 메타데이터 & All-ID 100% 클리어 검증', () => {
    const f = getFormulaById('d4-star-burst-vortex-4');
    expect(f).toBeDefined();
    expect(f?.id).toBe('d4-star-burst-vortex-4');
    expect(f?.category).toBe('god-number');
    expect(f?.difficulty).toBe(4);
    expect(f?.steps?.length).toBe(5); // 0단계(초기) + 4수

    // 0단계: 중심 4번은 ID, 외곽 8개 타일(모서리 R270, 변 R90)
    const s0 = f!.steps![0].boardOps;
    expect(s0[4]).toBe(D4.ID);
    [0, 2, 6, 8].forEach((idx) => expect(s0[idx]).toBe(D4.R270));
    [1, 3, 5, 7].forEach((idx) => expect(s0[idx]).toBe(D4.R90));

    // 1수: 주대각(↖) R90 ➔ 0, 8번 코너 타일 소거 (더블 킬)
    const s1 = f!.steps![1].boardOps;
    expect(s1[0]).toBe(D4.ID);
    expect(s1[8]).toBe(D4.ID);

    // 2수: 부대각(↗) R90 ➔ 2, 6번 코너 타일 소거 (더블 킬) ➔ 4대 코너 100% 소거 완료
    const s2 = f!.steps![2].boardOps;
    expect(s2[2]).toBe(D4.ID);
    expect(s2[6]).toBe(D4.ID);

    // 3수: 2행 R270 ➔ 3, 5번 변 타일 소거 (더블 킬), 2열 척추(1, 4, 7)가 R90 정렬
    const s3 = f!.steps![3].boardOps;
    expect(s3[3]).toBe(D4.ID);
    expect(s3[5]).toBe(D4.ID);
    expect(s3[1]).toBe(D4.R90);
    expect(s3[4]).toBe(D4.R90);
    expect(s3[7]).toBe(D4.R90);

    // 4수: 2열 R270 ➔ 1, 4, 7번 척추 타일 일제 소거 (트리플 킬 피니시) ➔ 전 타일 100% ID
    const s4 = f!.steps![4].boardOps;
    expect(s4.every((op) => op === D4.ID)).toBe(true);
  });

  it('51. D4 Round 6 신규 마스터 공식 3선 i18n 번역 키 및 god-number 총 20개 카테고리 완전성 검증', async () => {
    const { translations } = await import('../i18n/translations');
    expect(translations.ko['formula.item.d4TwinColumnFlux4.title']).toContain('쌍둥이 열 대칭 플럭스');
    expect(translations.en['formula.item.d4TwinColumnFlux4.title']).toContain('Twin Column Flux');
    expect(translations.ko['formula.item.d4HBracketSmash3.title']).toContain('H-브래킷 위상 도치');
    expect(translations.en['formula.item.d4HBracketSmash3.title']).toContain('H-Bracket Phase Inversion');
    expect(translations.ko['formula.item.d4StarBurstVortex4.title']).toContain('8방향 별빛 소용돌이');
    expect(translations.en['formula.item.d4StarBurstVortex4.title']).toContain('8-Way Starburst Vortex');

    // 시뮬레이터 속도 조절 & 공식 복사 다국어 키 검증
    expect(translations.ko['formula.speed05x']).toContain('0.5배속');
    expect(translations.en['formula.speed05x']).toBe('0.5x');
    expect(translations.ko['formula.speed1x']).toContain('1.0배속');
    expect(translations.en['formula.speed1x']).toBe('1.0x');
    expect(translations.ko['formula.speed2x']).toContain('2.0배속');
    expect(translations.en['formula.speed2x']).toBe('2.0x');
    expect(translations.ko['formula.btnCopy']).toContain('공식 복사');
    expect(translations.en['formula.btnCopy']).toContain('Copy Formula');
    expect(translations.ko['formula.copiedToast']).toContain('클립보드에 복사');
    expect(translations.en['formula.copiedToast']).toContain('copied to clipboard');

    // 총 god-number 개수 정확히 20개 검증
    const godNumberFormulas = getFormulasByCategory('god-number');
    expect(godNumberFormulas.length).toBe(20);
    expect(godNumberFormulas.some((f) => f.id === 'd4-twin-column-flux-4')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-h-bracket-smash-3')).toBe(true);
    expect(godNumberFormulas.some((f) => f.id === 'd4-star-burst-vortex-4')).toBe(true);
  });

});"""

if target_end not in content:
    target_end = target_end.replace('\n', '\r\n')

assert target_end in content, "target_end not found"
content = content.replace(target_end, replace_end, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("formulas.test.ts updated successfully with Round 6 tests!")
