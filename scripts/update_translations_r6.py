# -*- coding: utf-8 -*-
import re

file_path = r'C:\Users\user\matrix-cube\src\i18n\translations.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 영어 공통 키 추가
en_target = "'formula.btnReset': '↺ Reset',"
en_replace = """'formula.btnReset': '↺ Reset',
    'formula.speed05x': '0.5x',
    'formula.speed1x': '1.0x',
    'formula.speed2x': '2.0x',
    'formula.btnCopy': '📋 Copy Formula',
    'formula.copiedToast': 'Formula copied to clipboard!',"""
assert en_target in content, "en_target not found"
content = content.replace(en_target, en_replace, 1)

# 2. 영어 중복 키 제거
en_dup = """    // Formula Search & Filters (Round 5)
    'formula.searchPlaceholder': 'Search formulas by name, ID, moves, or tags...',
    'formula.searchEmptyMsg': 'No matching formulas found. Try a different keyword.',
    'formula.searchClearBtn': 'Clear search',
    'formula.tagAll': 'All',"""
if en_dup in content:
    content = content.replace(en_dup, "")
else:
    # CRLF 체크
    en_dup_crlf = en_dup.replace('\n', '\r\n')
    assert en_dup_crlf in content, "en_dup not found"
    content = content.replace(en_dup_crlf, "")

# 3. 영어 Round 6 3선 추가 (Round 5 끝나는 지점 다음)
r5_en_end = "'formula.item.d4DiagonalWindmill4.step4': 'Move 4: Row 2 MX ➔ Row 2 tiles (3, 4, 5) wiped simultaneously via MX ∘ MX = ID (Triple-Kill Finish), 100% all-clear!',"
r6_en_add = """'formula.item.d4DiagonalWindmill4.step4': 'Move 4: Row 2 MX ➔ Row 2 tiles (3, 4, 5) wiped simultaneously via MX ∘ MX = ID (Triple-Kill Finish), 100% all-clear!',

    // Round 6 Master Formulas 3 (en)
    'formula.item.d4TwinColumnFlux4.title': 'Twin Column Flux (4-Move Super Finish)',
    'formula.item.d4TwinColumnFlux4.subtitle': 'Symmetric flux between Col 1 and Col 3 resolved in 4 moves via Row 2 orthogonal alternation',
    'formula.item.d4TwinColumnFlux4.desc': 'A twin-column flux state where Columns 1 and 3 are phase-split while Column 2 is completely intact. Cleared in 4 moves: [Col 1 R90] ➔ [Row 2 R90] ➔ [Col 3 MX] ➔ [Row 2 R270] using Row 2 orthogonal coupling.',
    'formula.item.d4TwinColumnFlux4.tip': 'Col 1 and Col 3 exhibit opposing phase shifts. Using Row 2 as a bridge with alternating rotations and reflections decouples both columns without disturbing Column 2.',
    'formula.item.d4TwinColumnFlux4.step0': 'Initial State: 6-error twin columns (Col 1 & Col 3) with Column 2 completely solved',
    'formula.item.d4TwinColumnFlux4.step1': 'Move 1: Col 1 R90 ➔ Column 1 cleared via R270 ∘ R90 = ID (Triple-Kill)',
    'formula.item.d4TwinColumnFlux4.step2': 'Move 2: Row 2 R90 ➔ Row 2 temporary twist sets up mirror conjugate on tile 5',
    'formula.item.d4TwinColumnFlux4.step3': 'Move 3: Col 3 MX ➔ Column 3 cleared via reflection cancel (Triple-Kill); Row 2 aligned to R90',
    'formula.item.d4TwinColumnFlux4.step4': 'Move 4: Row 2 R270 ➔ Row 2 restored via R90 ∘ R270 = ID (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4HBracketSmash3.title': 'H-Bracket Phase Inversion 3-Move Kill',
    'formula.item.d4HBracketSmash3.subtitle': 'A 7-error H-shaped frame shattered in 3 surgical R90 moves',
    'formula.item.d4HBracketSmash3.desc': 'A dense 7-error H-bracket pattern where only top/bottom center edges (1, 7) are solved. Cleared in just 3 moves: [Col 1 R90] ➔ [Row 2 R90] ➔ [Col 3 R90] through double-kill, center double-kill, and Col 3 triple-kill finish.',
    'formula.item.d4HBracketSmash3.tip': 'Symmetric three-step R90 sweep (Col 1 ➔ Row 2 ➔ Col 3) uses Row 2 to link both outer columns, annihilating the entire H-bracket without touching edges 1 and 7.',
    'formula.item.d4HBracketSmash3.step0': 'Initial State: 7-error H-bracket pattern with edges 1 and 7 intact',
    'formula.item.d4HBracketSmash3.step1': 'Move 1: Col 1 R90 ➔ Corners 0 and 6 cleared via R270 ∘ R90 = ID (Double-Kill)',
    'formula.item.d4HBracketSmash3.step2': 'Move 2: Row 2 R90 ➔ Tiles 3 and 4 cleared (Double-Kill); Column 3 aligned into pure R270 phase',
    'formula.item.d4HBracketSmash3.step3': 'Move 3: Col 3 R90 ➔ Column 3 (2, 5, 8) wiped simultaneously via R270 ∘ R90 = ID (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4StarBurstVortex4.title': '8-Way Starburst Vortex 4-Move All-Kill',
    'formula.item.d4StarBurstVortex4.subtitle': 'Dual diagonal rotations followed by central cross orthogonal sweeps collapsing all 8 outer tiles',
    'formula.item.d4StarBurstVortex4.desc': 'An 8-way vortex where center tile 4 is solved while all 8 outer tiles are twisted in alternating R270/R90 phases. Cleared in 4 moves: [Main Diag R90] ➔ [Anti Diag R90] ➔ [Row 2 R270] ➔ [Col 2 R270] via diagonal cross collapses and orthogonal double/triple kills.',
    'formula.item.d4StarBurstVortex4.tip': 'Dual diagonal R90 moves neutralize all 4 corners while concentrating residual error into the central cross. Subsequent Row 2 and Col 2 R270 sweeps wipe out the remaining cross effortlessly.',
    'formula.item.d4StarBurstVortex4.step0': 'Initial State: Center tile 4 solved, all 8 outer perimeter and corner tiles trapped in starburst vortex',
    'formula.item.d4StarBurstVortex4.step1': 'Move 1: Main Diag R90 ➔ Corners 0 and 8 cleared via R270 ∘ R90 = ID (Double-Kill)',
    'formula.item.d4StarBurstVortex4.step2': 'Move 2: Anti Diag R90 ➔ Corners 2 and 6 cleared (Double-Kill); center 4 transitions to R180',
    'formula.item.d4StarBurstVortex4.step3': 'Move 3: Row 2 R270 ➔ Center row tiles (3, 5) cleared (Double-Kill); vertical spine aligned to R90',
    'formula.item.d4StarBurstVortex4.step4': 'Move 4: Col 2 R270 ➔ Col 2 tiles (1, 4, 7) wiped simultaneously (Triple-Kill Finish), 100% all-clear!',"""

assert r5_en_end in content, "r5_en_end not found"
content = content.replace(r5_en_end, r6_en_add, 1)

# 4. 한국어 공통 키 추가
ko_target = "'formula.btnReset': '↺ 처음으로',"
ko_replace = """'formula.btnReset': '↺ 처음으로',
    'formula.speed05x': '0.5배속',
    'formula.speed1x': '1.0배속',
    'formula.speed2x': '2.0배속',
    'formula.btnCopy': '📋 공식 복사',
    'formula.copiedToast': '공식이 클립보드에 복사되었습니다!',"""
assert ko_target in content, "ko_target not found"
content = content.replace(ko_target, ko_replace, 1)

# 5. 한국어 중복 키 제거
ko_dup = """    // 공식 실시간 검색 & 태그 필터 (Round 5)
    'formula.searchPlaceholder': '공식 이름, 번호, 태그, 수순 실시간 검색...',
    'formula.searchEmptyMsg': '검색 결과와 일치하는 공식이 없습니다. 다른 키워드를 입력해 보세요.',
    'formula.searchClearBtn': '검색어 지우기',
    'formula.tagAll': '전체',"""
if ko_dup in content:
    content = content.replace(ko_dup, "")
else:
    ko_dup_crlf = ko_dup.replace('\n', '\r\n')
    assert ko_dup_crlf in content, "ko_dup not found"
    content = content.replace(ko_dup_crlf, "")

# 6. 한국어 Round 6 3선 추가
r5_ko_end = "'formula.item.d4DiagonalWindmill4.step4': '4수: 2행 상하 가로 반사(MX)로 2행 3개 타일(3, 4, 5) 일제 소거 (트리플 킬 피니시), 100% 올클리어!',"
r6_ko_add = """'formula.item.d4DiagonalWindmill4.step4': '4수: 2행 상하 가로 반사(MX)로 2행 3개 타일(3, 4, 5) 일제 소거 (트리플 킬 피니시), 100% 올클리어!',

    // Round 6 신규 D4 마스터 공식 3선 (ko)
    'formula.item.d4TwinColumnFlux4.title': '쌍둥이 열 대칭 플럭스 4수 슈퍼 소거',
    'formula.item.d4TwinColumnFlux4.subtitle': '1열과 3열의 대칭 위상차를 2행 직교 연계로 4수 만에 분쇄하는 플럭스 마스터 공식',
    'formula.item.d4TwinColumnFlux4.desc': '중앙 2열은 완전한 정위치(ID)를 유지한 채, 1열(R270)과 3열(MX/MY)이 쌍둥이로 뒤틀린 6개 에러 패턴을 [1열 R90] ➔ [2행 R90] ➔ [3열 MX] ➔ [2행 R270] 4수로 2행을 매개로 양 열을 분리 정복하는 D4 마스터 공식입니다.',
    'formula.item.d4TwinColumnFlux4.tip': '1열과 3열의 위상차는 2행을 교량으로 삼아 회전-반사 켤레를 적용하면 중앙 2열을 전혀 흩트리지 않고 단 4수 만에 양쪽 열을 모두 소거할 수 있습니다.',
    'formula.item.d4TwinColumnFlux4.step0': '초기 상태: 2열은 전원 ID, 1열(R270)과 3열(MX/MY)이 대칭 뒤틀림 상태인 6개 에러',
    'formula.item.d4TwinColumnFlux4.step1': '1수: 1열 R90 ➔ 1열 3개 타일(0, 3, 6) 일제 소거 (트리플 킬 폭파)',
    'formula.item.d4TwinColumnFlux4.step2': '2수: 2행 R90 ➔ 2행 임시 비틀림으로 3열 5번 셀의 반사 위상 켤레 준비',
    'formula.item.d4TwinColumnFlux4.step3': '3수: 3열 MX ➔ 3열 3개 타일(2, 5, 8) 일제 소거 (트리플 킬 폭파), 2행 순수 R90 동기화',
    'formula.item.d4TwinColumnFlux4.step4': '4수: 2행 R270 ➔ 2행 3개 타일(3, 4, 5) 역회전 상쇄 복원 (트리플 킬 피니시), 100% 올클리어!',

    'formula.item.d4HBracketSmash3.title': 'H-브래킷 위상 도치 3수 킬',
    'formula.item.d4HBracketSmash3.subtitle': '상하 변(1, 7)을 제외한 H자 7개 에러 타일을 단 3수의 R90 연타로 종결하는 마스터 공식',
    'formula.item.d4HBracketSmash3.desc': '1열, 3열, 그리고 중앙 4번 셀이 H자 형태로 뒤틀리고 상하 변(1, 7번)만 ID로 보존된 고밀도 7개 에러 난제를 [1열 R90] ➔ [2행 R90] ➔ [3열 R90] 단 3수 만에 더블 킬 2회 및 3열 트리플 킬로 일격 분쇄하는 D4 마스터 공식입니다.',
    'formula.item.d4HBracketSmash3.tip': '1열 ➔ 2행 ➔ 3열로 이어지는 3연속 R90 회전 스위프는 1, 7번 타일을 전혀 건드리지 않고 H자 전체를 깔끔하게 지워냅니다.',
    'formula.item.d4HBracketSmash3.step0': '초기 상태: 상하 변(1, 7)은 보존되고 1열·3열·중심이 뒤틀린 H자 7개 에러',
    'formula.item.d4HBracketSmash3.step1': '1수: 1열 R90 ➔ 0번과 6번 코너 타일 소거 (더블 킬 폭파)',
    'formula.item.d4HBracketSmash3.step2': '2수: 2행 R90 ➔ 3번과 4번 셀 소거 (더블 킬), 3열 전체가 순수 R270 단일 위상으로 동기화',
    'formula.item.d4HBracketSmash3.step3': '3수: 3열 R90 ➔ 3열 3개 타일(2, 5, 8) 일제 소거 (트리플 킬 피니시), 100% 올클리어!',

    'formula.item.d4StarBurstVortex4.title': '8방향 별빛 소용돌이 4수 올킬',
    'formula.item.d4StarBurstVortex4.subtitle': '양대각선 회전 후 중심 십자 직교 스위프로 외곽 8개 에러를 완전 소멸시키는 4수 올킬',
    'formula.item.d4StarBurstVortex4.desc': '중심(4번)은 정위치이고 외곽 8개 타일(모서리 R270, 변 R90)이 대칭 소용돌이로 얽힌 난제를 [주대각 R90] ➔ [부대각 R90] ➔ [2행 R270] ➔ [2열 R270] 4수로 대각선에서 4개 코너를 먼저 깬 뒤 중심 십자를 쓸어 담는 D4 마스터 공식입니다.',
    'formula.item.d4StarBurstVortex4.tip': '양대각선(주대각/부대각) R90으로 4대 코너(0, 2, 6, 8)를 완전히 소거한 뒤, 남은 중심 십자(1, 3, 4, 5, 7)를 2행과 2열의 연속 R270으로 한 번에 종결합니다.',
    'formula.item.d4StarBurstVortex4.step0': '초기 상태: 중심 4번은 ID, 외곽 8개 타일(모서리 R270, 변 R90)이 소용돌이치는 8개 에러',
    'formula.item.d4StarBurstVortex4.step1': '1수: 주대각선(↖) R90 ➔ 0번과 8번 코너 타일 소거 (더블 킬 폭파)',
    'formula.item.d4StarBurstVortex4.step2': '2수: 부대각선(↗) R90 ➔ 2번과 6번 코너 타일 소거 (더블 킬), 4대 코너 완전 정복',
    'formula.item.d4StarBurstVortex4.step3': '3수: 2행 R270 ➔ 3번과 5번 변 타일 소거 (더블 킬), 2열 척추가 R90 단일 위상으로 정렬',
    'formula.item.d4StarBurstVortex4.step4': '4수: 2열 R270 ➔ 2열 3개 타일(1, 4, 7) 일제 소거 (트리플 킬 피니시), 100% 올클리어!',"""

assert r5_ko_end in content, "r5_ko_end not found"
content = content.replace(r5_ko_end, r6_ko_add, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("translations.ts updated successfully!")
