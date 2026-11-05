import re

p = r'C:/Users/user/matrix-cube/src/i18n/translations.ts'
with open(p, 'r', encoding='utf-8') as f:
    text = f.read()

en_r8 = """    // Round 8 D4 Master Formulas (en)
    'formula.item.d4ZigzagDiagonalFlush4.title': 'D4 Zigzag Diagonal Flush 4-Move Technique',
    'formula.item.d4ZigzagDiagonalFlush4.subtitle': 'Clear the S-shaped 0-1-4-7-8 zigzag path in 4 moves combining diagonal and orthogonal axes',
    'formula.item.d4ZigzagDiagonalFlush4.desc': 'A master formula resolving the twisted S-shaped zigzag path (0, 1, 4, 7, 8) via [Main Diag R180] ➔ [Anti Diag MX] ➔ [Row 3 MX] ➔ [Row 1 MX] in 4 moves, finishing with consecutive orthogonal triple-kills.',
    'formula.item.d4ZigzagDiagonalFlush4.tip': 'Align the zigzag axis to MX with Main Diag R180, neutralize center tile with Anti Diag MX, then blast Row 3 and Row 1 with back-to-back triple-kills.',
    'formula.item.d4ZigzagDiagonalFlush4.step0': 'Initial State: 0, 1, 4, 7, 8 zigzag path entangled in MY and MX phases at optimal distance 4',
    'formula.item.d4ZigzagDiagonalFlush4.step1': 'Move 1: Main Diag (↖) 180° rotation (R180) ➔ MY ∘ R180 = MX transforms zigzag axis into uniform MX phase',
    'formula.item.d4ZigzagDiagonalFlush4.step2': 'Move 2: Anti Diag (↗) vertical reflection (MX) ➔ Center tile 4 cleared via MX ∘ MX = ID and phases distributed to Row 1 & 3',
    'formula.item.d4ZigzagDiagonalFlush4.step3': 'Move 3: Row 3 vertical reflection (MX Triple-Kill) ➔ Bottom tiles 6, 7, 8 wiped out simultaneously',
    'formula.item.d4ZigzagDiagonalFlush4.step4': 'Move 4: Row 1 vertical reflection (MX Finish) ➔ Top tiles 0, 1, 2 wiped out simultaneously, 100% All Clear!',

    'formula.item.d4CornerSandwich3.title': 'D4 Corner Sandwich Blast 3-Move Technique',
    'formula.item.d4CornerSandwich3.subtitle': 'Sandwiched X-formation corners and center blasted in 3 moves via orthogonal interference',
    'formula.item.d4CornerSandwich3.desc': 'An X-formation where corners (0, 2, 6, 8) and center 4 sandwich Col 2, eliminated in just 3 moves: [Col 1 MX] ➔ [Col 3 MX] ➔ [Row 2 MX] using double-kills and a central triple-kill finish.',
    'formula.item.d4CornerSandwich3.tip': 'Temporary intermediate MX phases created on intersection tiles 3 and 5 vanish completely on the final Row 2 swipe.',
    'formula.item.d4CornerSandwich3.step0': 'Initial State: 4 corners (0,2,6,8) and center 4 with horizontal reflections (MX) in an X sandwich pattern',
    'formula.item.d4CornerSandwich3.step1': 'Move 1: Col 1 vertical reflection (MX) ➔ Corners 0, 6 cleared; intermediate MX phase placed on tile 3',
    'formula.item.d4CornerSandwich3.step2': 'Move 2: Col 3 vertical reflection (MX) ➔ Corners 2, 8 cleared; entire Row 2 synchronized to pure MX',
    'formula.item.d4CornerSandwich3.step3': 'Move 3: Row 2 vertical reflection (MX Finish) ➔ Row 2 tiles 3, 4, 5 wiped out simultaneously, 100% All Clear!',

    'formula.item.d4CheckerSuperposition4.title': 'D4 Superposed Checkerboard 4-Move Technique',
    'formula.item.d4CheckerSuperposition4.subtitle': 'Corner R180 and cross MD checkerboard solved in 4 moves via diagonal and orthogonal 4-fold symmetry',
    'formula.item.d4CheckerSuperposition4.desc': 'Checkerboard superposition of 4 corners (R180) and 4 cross edges (MD) across 8 directions resolved via [Main Diag R180] ➔ [Anti Diag R180] ➔ [Col 2 MD] ➔ [Row 2 MD] in 4 moves.',
    'formula.item.d4CheckerSuperposition4.tip': 'Sweep all 4 corners with dual diagonal R180 rotations, then blast remaining cross edges with central Col 2 and Row 2 MD reflections.',
    'formula.item.d4CheckerSuperposition4.step0': 'Initial State: 4 corners at R180, 4 cross edges at MD in an 8-error checkerboard superposition',
    'formula.item.d4CheckerSuperposition4.step1': 'Move 1: Main Diag (↖) 180° rotation (R180) ➔ Corners 0 and 8 cleared; center 4 temporarily transitions to R180',
    'formula.item.d4CheckerSuperposition4.step2': 'Move 2: Anti Diag (↗) 180° rotation (R180) ➔ Corners 2 and 6 cleared; center 4 restored to ID via R180² = ID',
    'formula.item.d4CheckerSuperposition4.step3': 'Move 3: Col 2 main diagonal reflection (MD) ➔ Vertical edges 1 and 7 cleared; Row 2 aligned to pure MD',
    'formula.item.d4CheckerSuperposition4.step4': 'Move 4: Row 2 main diagonal reflection (MD Finish) ➔ Center row tiles 3, 4, 5 wiped out simultaneously, 100% All Clear!'"""

ko_r8 = """    // Round 8 신규 D4 마스터 공식 3선 (ko)
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
    'formula.item.d4CheckerSuperposition4.step4': '4수: 2행 주대각 반사 (MD 피니시) ➔ 중심행 3, 4, 5번 타일 일제 소거 (트리플 킬 피니시!), 100% All Clear!'"""

en_target_start = '// Round 8 신규 D4 마스터 공식 3선 (ko)'
en_target_end = "100% All Clear!',"

idx1 = text.find(en_target_start)
idx2 = text.find(en_target_end, idx1) + len(en_target_end)

if idx1 != -1 and idx2 != -1:
    text = text[:idx1] + en_r8.strip() + '\n\n' + text[idx2:]
    print('Replaced en block successfully')
else:
    print('Failed to find en block', idx1, idx2)

ko_end_anchor = "'formula.item.d4HyperCubeFrame4.step4': '4수: 3열 R90 ➔ 3열 2, 5, 8번 타일 일제 소거 (트리플 킬 피니시), 100% 올클리어',"
idx3 = text.find(ko_end_anchor)
if idx3 != -1:
    insert_pos = idx3 + len(ko_end_anchor)
    text = text[:insert_pos] + '\n\n' + ko_r8.strip() + '\n' + text[insert_pos:]
    print('Added ko block successfully')
else:
    print('Failed to find ko anchor')

with open(p, 'w', encoding='utf-8') as f:
    f.write(text)
print('Done!')
