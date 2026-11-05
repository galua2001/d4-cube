# -*- coding: utf-8 -*-
translations_path = r'C:\Users\user\matrix-cube\src\i18n\translations.ts'

with open(translations_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. English 정렬 키 및 Round 8 공식 메타데이터
en_sort_keys = """
    // Formula Sort (Round 8)
    'formula.sortLabel': 'Sort by',
    'formula.sortDefault': 'Default Order',
    'formula.sortDiffAsc': 'Difficulty (Low ➔ High)',
    'formula.sortDiffDesc': 'Difficulty (High ➔ Low)',
    'formula.sortNameAsc': 'Name (A ➔ Z)',
    'formula.itemCount': '{count} Formulas',
"""

en_r8_formulas = """
    // Round 8 D4 Master Formulas (en)
    'formula.item.d4ZigzagDiagonalFlush4.title': 'D4 Zigzag Diagonal Flush 4-Move Formula',
    'formula.item.d4ZigzagDiagonalFlush4.subtitle': 'S-shaped zigzag pattern (0, 1, 4, 7, 8) cleared via dual diagonal and orthogonal sweeps in 4 moves',
    'formula.item.d4ZigzagDiagonalFlush4.desc': 'Clears an S-shaped zigzag pattern across cells 0, 1, 4, 7, 8 via dual diagonal and orthogonal sweeps in 4 minimal moves: [Main Diag R180] ➔ [Anti Diag MX] ➔ [Row 3 MX] ➔ [Row 1 MX] achieving 100% all-clear.',
    'formula.item.d4ZigzagDiagonalFlush4.tip': 'Main diagonal R180 aligns the zigzag path into MX phase. Anti Diag MX resolves the center tile, priming Rows 3 and 1 for consecutive clean triple-kills.',
    'formula.item.d4ZigzagDiagonalFlush4.step0': 'Initial State: S-shaped zigzag path (0, 1, 4, 7, 8) entangled with MY and MX phases',
    'formula.item.d4ZigzagDiagonalFlush4.step1': 'Move 1: Main Diag R180 (Diagonal ↖) ➔ MY ∘ R180 = MX aligns the zigzag path into MX phase',
    'formula.item.d4ZigzagDiagonalFlush4.step2': 'Move 2: Anti Diag MX (Diagonal ↗) ➔ Center tile 4 clears to ID via MX ∘ MX = ID; partitions board into Rows 1 & 3',
    'formula.item.d4ZigzagDiagonalFlush4.step3': 'Move 3: Row 3 MX (Horizontal flip) ➔ Tiles 6, 7, 8 wipe out simultaneously (Triple-Kill)',
    'formula.item.d4ZigzagDiagonalFlush4.step4': 'Move 4: Row 1 MX (Triple-Kill Finish) ➔ Tiles 0, 1, 2 vanish simultaneously via MX ∘ MX = ID, 100% all-clear!',

    'formula.item.d4CornerSandwich3.title': 'D4 Corner Sandwich Blitz 3-Move Formula',
    'formula.item.d4CornerSandwich3.subtitle': '4 corners and center sandwiching Column 2 eradicated in minimal 3 moves via orthogonal sweeps',
    'formula.item.d4CornerSandwich3.desc': 'Conquers 4 corners (0, 2, 6, 8) and center 4 sandwiching Column 2 in minimal 3 moves via orthogonal column and row interference cancellation: [Col 1 MX] ➔ [Col 3 MX] ➔ [Row 2 MX] achieving 100% all-clear.',
    'formula.item.d4CornerSandwich3.tip': 'Column moves create temporary intermediate phases at intersection tiles 3 and 5, which are wiped out simultaneously by the final Row 2 sweep.',
    'formula.item.d4CornerSandwich3.step0': 'Initial State: 4 corners (0, 2, 6, 8) and center (4) carrying MX phase in an X-sandwich shape',
    'formula.item.d4CornerSandwich3.step1': 'Move 1: Col 1 MX (Vertical swipe) ➔ Corners 0 and 6 clear to ID; intersection 3 armed with intermediate MX',
    'formula.item.d4CornerSandwich3.step2': 'Move 2: Col 3 MX (Vertical swipe) ➔ Corners 2 and 8 clear to ID; Row 2 (3, 4, 5) synchronizes uniformly to MX',
    'formula.item.d4CornerSandwich3.step3': 'Move 3: Row 2 MX (Triple-Kill Finish) ➔ Center row tiles (3, 4, 5) wipe out simultaneously via MX ∘ MX = ID, 100% all-clear!',

    'formula.item.d4CheckerSuperposition4.title': 'D4 Checker Superposition 4-Move Formula',
    'formula.item.d4CheckerSuperposition4.subtitle': 'Alternating checkerboard of 4 corners (R180) and 4 cross edges (MD) resolved via 4-fold symmetry',
    'formula.item.d4CheckerSuperposition4.desc': 'Solves an alternating checkerboard of 4 corners (R180) and 4 cross edges (MD) surrounding center ID via dual diagonal and dual orthogonal strokes in 4 minimal moves: [Main Diag R180] ➔ [Anti Diag R180] ➔ [Col 2 MD] ➔ [Row 2 MD] achieving 100% all-clear.',
    'formula.item.d4CheckerSuperposition4.tip': 'Sweeps all 4 corners first via dual diagonal 180° rotations, then detonates cross edges via Col 2 and Row 2 MD reflections.',
    'formula.item.d4CheckerSuperposition4.step0': 'Initial State: Checkerboard superposition with 4 corners in R180 and 4 cross edges in MD',
    'formula.item.d4CheckerSuperposition4.step1': 'Move 1: Main Diag R180 (Diagonal ↖) ➔ Corners 0 and 8 clear to ID; center 4 temporarily armed with R180',
    'formula.item.d4CheckerSuperposition4.step2': 'Move 2: Anti Diag R180 (Diagonal ↗) ➔ Corners 2 and 6 clear to ID; center 4 restored to ID via R180² = ID',
    'formula.item.d4CheckerSuperposition4.step3': 'Move 3: Col 2 MD (Diagonal reflection) ➔ Edges 1 and 7 clear to ID; Row 2 (3, 4, 5) synchronizes to pure MD phase',
    'formula.item.d4CheckerSuperposition4.step4': 'Move 4: Row 2 MD (Triple-Kill Finish) ➔ Center row tiles (3, 4, 5) wipe out simultaneously via MD ∘ MD = ID, 100% all-clear!',
"""

# 2. Korean 정렬 키 및 Round 8 공식 메타데이터
ko_sort_keys = """
    // 공식 정렬 (Round 8)
    'formula.sortLabel': '정렬 기준',
    'formula.sortDefault': '기본순',
    'formula.sortDiffAsc': '난이도 낮은순 (2수➔4수)',
    'formula.sortDiffDesc': '난이도 높은순 (4수➔2수)',
    'formula.sortNameAsc': '이름순 (가나다/ABC)',
    'formula.itemCount': '공식 ({count}개)',
"""

ko_r8_formulas = """
    // Round 8 신규 D4 마스터 공식 3선 (ko)
    'formula.item.d4ZigzagDiagonalFlush4.title': 'D4 지그재그 대각 소거 4수 공식',
    'formula.item.d4ZigzagDiagonalFlush4.subtitle': '0·1·4·7·8 S자 지그재그 경로를 대각선과 직교 2축 결합으로 4수 만에 소거하는 마스터 테크닉',
    'formula.item.d4ZigzagDiagonalFlush4.desc': '0번 코너에서 1, 4, 7, 8번으로 이어지는 S자 지그재그 경로로 뒤틀린 위상을 [주대각 R180] ➔ [부대각 MX] ➔ [3행 MX] ➔ [1행 MX] 4수로 대각 소거 후 상하 행 연속 트리플 킬로 마무리하는 D4 마스터 공식입니다.',
    'formula.item.d4ZigzagDiagonalFlush4.tip': '주대각선 R180으로 지그재그 축을 MX로 정렬하고, 부대각선 MX로 중심 타일을 소거한 뒤 3행과 1행을 연속 트리플 킬로 산산조각 냅니다.',
    'formula.item.d4ZigzagDiagonalFlush4.step0': '초기 상태: 0, 1, 4, 7, 8번 지그재그 경로를 따라 MY, MX 위상이 얽힌 거리 4 최단 병목',
    'formula.item.d4ZigzagDiagonalFlush4.step1': '1수: 주대각선(↖) 180° 회전 (R180) ➔ MY ∘ R180 = MX 변환으로 지그재그 축이 MX 단일 위상 정렬',
    'formula.item.d4ZigzagDiagonalFlush4.step2': '2수: 부대각선(↗) 상하 반사 (MX) ➔ 중심 4번 타일 MX ∘ MX = ID 소거 및 상하 1행·3행 위상 분배',
    'formula.item.d4ZigzagDiagonalFlush4.step3': '3수: 3행 상하 반사 (MX 트리플 킬) ➔ 6, 7, 8번 하단 타일 일제 소거 (트리플 킬 폭파)',
    'formula.item.d4ZigzagDiagonalFlush4.step4': '4수: 1행 상하 반사 (MX 피니시) ➔ 0, 1, 2번 상단 타일 일제 소거 (트리플 킬 피니시!), 100% All Clear!',

    'formula.item.d4CornerSandwich3.title': 'D4 코너 샌드위치 폭파 3수 공식',
    'formula.item.d4CornerSandwich3.subtitle': '4대 코너와 중심이 2열을 샌드위치처럼 감싸고 있는 X자 형태를 직교 간섭 소거로 3수 격파',
    'formula.item.d4CornerSandwich3.desc': '1열과 3열의 4대 코너(0, 2, 6, 8)와 중심(4)이 2열을 샌드위치처럼 감싸고 있는 X자 형태를 [1열 MX] ➔ [3열 MX] ➔ [2행 MX] 단 3수로 더블 킬 및 중심행 트리플 킬로 격파하는 마스터 공식입니다.',
    'formula.item.d4CornerSandwich3.tip': '1열과 3열 조작 시 교차점 3번과 5번에 일시적으로 생성된 MX 매개 위상이 마지막 2행 스와이프로 완벽히 동시 소멸합니다.',
    'formula.item.d4CornerSandwich3.step0': '초기 상태: 4개 모서리(0,2,6,8) 및 중심(4)이 가로 반사(MX)를 보유한 X자 코너 샌드위치 배치',
    'formula.item.d4CornerSandwich3.step1': '1수: 1열 상하 반사 (MX) ➔ 코너 0, 6 소거 및 교차점 3번에 매개 MX 위상 생성',
    'formula.item.d4CornerSandwich3.step2': '2수: 3열 상하 반사 (MX) ➔ 코너 2, 8 소거 및 2행 전체(3, 4, 5)가 순수 MX 단일 위상으로 동기화',
    'formula.item.d4CornerSandwich3.step3': '3수: 2행 상하 반사 (MX 피니시) ➔ 2행 3, 4, 5번 타일 일제 소거 (트리플 킬 피니시!), 100% All Clear!',

    'formula.item.d4CheckerSuperposition4.title': 'D4 슈퍼 중첩 체커보드 4수 공식',
    'formula.item.d4CheckerSuperposition4.subtitle': '모서리 R180, 십자 MD 체커보드 중첩을 대각선 2축과 십자 2축의 4중 대칭으로 4수 해결',
    'formula.item.d4CheckerSuperposition4.desc': '4개 코너(R180)와 십자 4개 에지(MD)가 체스판처럼 번갈아 중첩된 외곽 8방향 대칭 위상을 [주대각 R180] ➔ [부대각 R180] ➔ [2열 MD] ➔ [2행 MD] 4수로 양대각 코너 소거 후 십자 에지를 순차 폭파하는 마스터 올킬 공식입니다.',
    'formula.item.d4CheckerSuperposition4.tip': '양대각선 180° 회전으로 4대 코너를 먼저 쓸어 담은 뒤, 중심 2열과 2행의 MD 반사로 십자 에지를 순차 폭파하는 완벽한 4중 대칭 공식입니다.',
    'formula.item.d4CheckerSuperposition4.step0': '초기 상태: 모서리 4개 타일 R180, 십자 4개 타일 MD의 체커보드 중첩 8에러 배치',
    'formula.item.d4CheckerSuperposition4.step1': '1수: 주대각선(↖) 180° 회전 (R180) ➔ 0번 및 8번 코너 소거, 중심 4번에 R180 임시 생성',
    'formula.item.d4CheckerSuperposition4.step2': '2수: 부대각선(↗) 180° 회전 (R180) ➔ 2번 및 6번 코너 소거, 중심 4번 타일 R180² = ID 원상 복귀',
    'formula.item.d4CheckerSuperposition4.step3': '3수: 2열 주대각 반사 (MD) ➔ 1번 및 7번 수직 에지 소거, 중심 2행(3, 4, 5)이 순수 MD 위상으로 정렬',
    'formula.item.d4CheckerSuperposition4.step4': '4수: 2행 주대각 반사 (MD 피니시) ➔ 중심행 3, 4, 5번 타일 일제 소거 (트리플 킬 피니시!), 100% All Clear!',
"""

# en 섹션 삽입: 'formula.searchClearBtn': 'Clear search', 뒤에
target_en_anchor = "'formula.searchClearBtn': 'Clear search',"
if target_en_anchor in code:
    code = code.replace(target_en_anchor, target_en_anchor + "\n" + en_sort_keys)
    print("Injected en sort keys!")

# en 공식 삽입: 'formula.item.d4DiagonalWindmill4.step4' 뒤에
target_en_f_anchor = "'formula.item.d4DiagonalWindmill4.step4': 'Move 4: Row 2 MX"
f_en_idx = code.find(target_en_f_anchor)
if f_en_idx != -1:
    line_end = code.find("\n", f_en_idx)
    code = code[:line_end+1] + en_r8_formulas + code[line_end+1:]
    print("Injected en R8 formulas!")

# ko 섹션 정렬 키 삽입: 'formula.searchClearBtn': '검색어 지우기', 뒤에
target_ko_anchor = "'formula.searchClearBtn': '검색어 지우기',"
if target_ko_anchor in code:
    code = code.replace(target_ko_anchor, target_ko_anchor + "\n" + ko_sort_keys)
    print("Injected ko sort keys!")
else:
    # 대체 앵커 탐색
    alt_ko = "'formula.searchPlaceholder':"
    idx = code.find(alt_ko, code.find("ko: {"))
    if idx != -1:
        line_end = code.find("\n", idx)
        code = code[:line_end+1] + ko_sort_keys + code[line_end+1:]
        print("Injected ko sort keys via alt anchor!")

# ko 공식 삽입: 'formula.item.d4StarBurstVortex4.step4' 뒤에
target_ko_f_anchor = "'formula.item.d4StarBurstVortex4.step4':"
f_ko_idx = code.find(target_ko_f_anchor)
if f_ko_idx != -1:
    line_end = code.find("\n", f_ko_idx)
    code = code[:line_end+1] + ko_r8_formulas + code[line_end+1:]
    print("Injected ko R8 formulas!")

with open(translations_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("translations.ts successfully updated!")
