# update_translations_r9.py
with open('src/i18n/translations.ts', 'r', encoding='utf-8') as f:
    text = f.read()

en_additions = """    // Round 9 D4 Master Formulas 3 (en)
    'formula.item.d4SpiralCoreVortex4.title': 'Spiral Core Vortex 4-Move Purge Formula',
    'formula.item.d4SpiralCoreVortex4.subtitle': 'Clockwise perimeter 4-sweep collapsing an 8-tile outer spiral vortex',
    'formula.item.d4SpiralCoreVortex4.desc': 'Eliminates a perimeter spiral vortex pattern (8 outer tiles rotating around the core) via a 4-move clockwise perimeter sweep (Row 1 ➔ Col 3 ➔ Row 3 ➔ Col 1) using 90° rotations.',
    'formula.item.d4SpiralCoreVortex4.tip': 'The center core (cell 4) stays in ID as the calm eye of the hurricane, while the outer ring is sequentially neutralized via a clockwise perimeter cascade.',
    'formula.item.d4SpiralCoreVortex4.step0': 'Initial State: Perimeter spiral vortex entanglement (corners R180, edges R270)',
    'formula.item.d4SpiralCoreVortex4.step1': 'Move 1: Row 1 R90 ➔ Tile 1 neutralized (R270 * R90 = ID)',
    'formula.item.d4SpiralCoreVortex4.step2': 'Move 2: Col 3 R90 ➔ Tiles 2 and 5 simultaneously cancel (Double Cancel)',
    'formula.item.d4SpiralCoreVortex4.step3': 'Move 3: Row 3 R90 ➔ Tiles 7 and 8 cancel; Col 1 aligned to R270',
    'formula.item.d4SpiralCoreVortex4.step4': 'Move 4: Col 1 R90 ➔ Col 1 triple-cancels to ID, 100% All Clear',

    'formula.item.d4DiamondCoreSmash3.title': 'Diamond Core Smash 3-Move Finish Formula',
    'formula.item.d4DiamondCoreSmash3.subtitle': 'Orthogonal cross-strikes shattering a 5-tile diamond cross phase in 3 lightning moves',
    'formula.item.d4DiamondCoreSmash3.desc': 'Crushes a pure diamond cross phase (center 4 + cross edges 1, 3, 5, 7) in exactly 3 moves via orthogonal Row 2 and Col 2 cross-strikes.',
    'formula.item.d4DiamondCoreSmash3.tip': 'All 4 corners remain pristine ID, surgically smashing only the 5 diamond core tiles.',
    'formula.item.d4DiamondCoreSmash3.step0': 'Initial State: Pure diamond cross 5-tile configuration (edges MX, core R180)',
    'formula.item.d4DiamondCoreSmash3.step1': 'Move 1: Row 2 R90 ➔ Row 2 transitions to MD and center to R270',
    'formula.item.d4DiamondCoreSmash3.step2': 'Move 2: Col 2 MX ➔ Top/bottom edges cancel to ID; Row 2 unified to MD',
    'formula.item.d4DiamondCoreSmash3.step3': 'Move 3: Row 2 MD ➔ Row 2 triple-cancels via MD self-inversion, 100% All Clear',

    'formula.item.d4AntiCheckerParity4.title': 'Anti-Checker Parity & Diagonal 4-Move All-Kill Formula',
    'formula.item.d4AntiCheckerParity4.subtitle': 'Alternating diagonal and orthogonal cross-sweeps eliminating anti-checker parity in 4 moves',
    'formula.item.d4AntiCheckerParity4.desc': 'Eliminates an anti-checker parity state (corners carrying MD diagonal reflection vs edges carrying R180 point reflection) via alternating diagonal and orthogonal cross-sweeps.',
    'formula.item.d4AntiCheckerParity4.tip': 'Main/Anti diagonals (MD) and orthogonal Row 2/Col 2 (R180) form an alternating zigzag duality.',
    'formula.item.d4AntiCheckerParity4.step0': 'Initial State: Anti-checker parity with MD corners vs R180 edges',
    'formula.item.d4AntiCheckerParity4.step1': 'Move 1: Main Diag MD ➔ Corners 0 and 8 immediately cancel to ID',
    'formula.item.d4AntiCheckerParity4.step2': 'Move 2: Row 2 R180 ➔ Edges 3 and 5 double-cancel to ID',
    'formula.item.d4AntiCheckerParity4.step3': 'Move 3: Anti Diag MD ➔ Corners 2 and 6 cancel to ID; Col 2 aligned',
    'formula.item.d4AntiCheckerParity4.step4': 'Move 4: Col 2 R180 ➔ Col 2 triple-cancels to ID, 100% All Clear',
"""

ko_additions = """    // Round 9 D4 마스터 공식 3선 (KO)
    'formula.item.d4SpiralCoreVortex4.title': '나선형 코어 볼텍스 4수 소거 공식',
    'formula.item.d4SpiralCoreVortex4.subtitle': '외곽 8타일 나선형 회오리를 시계방향 4단 외곽 스위프로 완전 소거',
    'formula.item.d4SpiralCoreVortex4.desc': '외곽 8개 타일이 중심을 축으로 회전하는 나선형 와류(Vortex) 배치를 1행·3열·3행·1열의 시계방향 나선 4단 90° 회전으로 완벽 소거합니다.',
    'formula.item.d4SpiralCoreVortex4.tip': '중심(4번)은 항등원(ID)인 태풍의 눈 상태를 유지하며, 외곽 둘레를 1행(Row 1) ➔ 3열(Col 3) ➔ 3행(Row 3) ➔ 1열(Col 1) 순으로 감아 돌며 위상을 차례로 중화합니다.',
    'formula.item.d4SpiralCoreVortex4.step0': '초기 배치: 나선형 코어 볼텍스 외곽 8개 얽힘 (코너 R180, 변 R270)',
    'formula.item.d4SpiralCoreVortex4.step1': '1수: 1행 R90 ➔ 1번 상단 변 즉각 소거',
    'formula.item.d4SpiralCoreVortex4.step2': '2수: 3열 R90 ➔ 2번·5번 타일 동시 더블 소거',
    'formula.item.d4SpiralCoreVortex4.step3': '3수: 3행 R90 ➔ 7번·8번 타일 소거 및 1열 균일 정렬',
    'formula.item.d4SpiralCoreVortex4.step4': '4수: 1열 R90 ➔ 1열 트리플 킬로 100% 완전 정복',

    'formula.item.d4DiamondCoreSmash3.title': '마름모꼴 다이아몬드 코어 3수 스매시 공식',
    'formula.item.d4DiamondCoreSmash3.subtitle': '중심 코어와 십자 변의 마름모꼴 위상을 십자 교차 스트라이크로 단 3수만에 격파',
    'formula.item.d4DiamondCoreSmash3.desc': '중심 코어(4번)와 십자 변(1, 3, 5, 7번)으로 이루어진 순수 마름모꼴 위상을 Row 2와 Col 2의 십자 교차 스트라이크로 단 3수만에 격파합니다.',
    'formula.item.d4DiamondCoreSmash3.tip': '외곽 4개 코너(0, 2, 6, 8)가 완전히 깨끗한 ID 상태를 유지하며 오직 다이아몬드 코어 5개 타일만 선별 타격합니다.',
    'formula.item.d4DiamondCoreSmash3.step0': '초기 배치: 순수 마름모 다이아몬드 5개 타일 (변 MX, 코어 R180)',
    'formula.item.d4DiamondCoreSmash3.step1': '1수: 2행 R90 ➔ 중앙 2행 대각 반사 위상 전이',
    'formula.item.d4DiamondCoreSmash3.step2': '2수: 2열 MX ➔ 1번·7번 상하 변 동시 소거 및 2행 단일 위상화',
    'formula.item.d4DiamondCoreSmash3.step3': '3수: 2행 MD ➔ 2행 트리플 킬로 마름모 코어 완전 격파',

    'formula.item.d4AntiCheckerParity4.title': '안티 체커 패리티 & 대각 반사 4수 올킬 공식',
    'formula.item.d4AntiCheckerParity4.subtitle': '체커보드 대각 반사와 점대칭의 엇갈림을 대각선과 십자축 교차 핑퐁 연산으로 4수만에 완전 소거',
    'formula.item.d4AntiCheckerParity4.desc': '체커보드 흑/백 타일이 대각 반사(MD)와 점대칭(R180)으로 엇갈린 안티 패리티 위상을 양대각선과 십자축의 교차 핑퐁 연산으로 4수만에 완전 소거합니다.',
    'formula.item.d4AntiCheckerParity4.tip': '주대각선(↖)과 부대각선(↗)의 대각 반사(MD) 연산과 중앙 Row 2, Col 2의 점대칭(R180) 회전이 완벽한 지그재그 쌍대성을 이룹니다.',
    'formula.item.d4AntiCheckerParity4.step0': '초기 배치: 체커보드 대각 반사 vs 점대칭 안티 패리티 (코너 MD, 변 R180)',
    'formula.item.d4AntiCheckerParity4.step1': '1수: 주대각선(↖) MD ➔ 0번·8번 코너 즉각 소거',
    'formula.item.d4AntiCheckerParity4.step2': '2수: 2행 R180 ➔ 3번·5번 타일 동시 더블 소거',
    'formula.item.d4AntiCheckerParity4.step3': '3수: 부대각선(↗) MD ➔ 2번·6번 코너 소거 및 2열 정렬',
    'formula.item.d4AntiCheckerParity4.step4': '4수: 2열 R180 ➔ 2열 트리플 킬로 안티 체커 완전 정복',
"""

# Insert EN before '  },\n\n  ko: {'
en_target = "  },\n\n  ko: {"
if en_target not in text:
    en_target = "  },\r\n\r\n  ko: {"
if en_target not in text:
    raise RuntimeError("en_target not found")

idx_en = text.find(en_target)
text = text[:idx_en] + en_additions + text[idx_en:]

# Insert KO before '  }\n};' at the end of translations
ko_target = "  }\n};"
if ko_target not in text:
    ko_target = "  }\r\n};"
if ko_target not in text:
    raise RuntimeError("ko_target not found")

idx_ko = text.rfind(ko_target)
text = text[:idx_ko] + ko_additions + text[idx_ko:]

with open('src/i18n/translations.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated translations.ts successfully!')
