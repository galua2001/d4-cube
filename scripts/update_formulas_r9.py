import json

# Read formulas.ts
with open('src/data/formulas.ts', 'r', encoding='utf-8') as f:
    text = f.read()

target_step = 'const BASE_FORMULAS: FormulaItem[] = ['
if target_step not in text:
    raise RuntimeError('target_step not found in formulas.ts')

step_code = '''// 36. [Round 9 마스터 공식 22: D4 나선형 코어 볼텍스 4수 공식]
// 초기 보드: ['R180', 'R270', 'R180', 'R270', 'ID', 'R270', 'R180', 'R270', 'R180']
// 1행(row 0) R90 ➔ 3열(col 2) R90 ➔ 3행(row 2) R90 ➔ 1열(col 0) R90 = 100% ID 올클리어
const d4SpiralCoreVortexInitialBoard: D4Op[] = [
  D4.R180, D4.R270, D4.R180,
  D4.R270, D4.ID,   D4.R270,
  D4.R180, D4.R270, D4.R180
];

const d4SpiralCoreVortexSteps = createInteractiveSteps(d4SpiralCoreVortexInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1수: 1행(Row 1) 90° 시계방향 회전 (R90)',
    actionDescEn: 'Move 1: Row 1 90° Clockwise Rotation (R90)',
    mathInsightKo: '1번 상단 변 타일(R270 * R90 = ID)이 즉시 소거되고, 0번과 2번 코너 타일은 R270으로 전이되어 다음 열 스위프와 위상 정합을 이룹니다.',
    mathInsightEn: 'Tile 1 is neutralized to ID (R270 * R90 = ID), while corners 0 and 2 transition to R270 to align with the upcoming column sweep.',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 1행 R90',
    formulaText: 'Row[1] ➔ R90',
    formulaDesc: '1번 상단 변 즉각 소거'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '2수: 3열(Col 3) 90° 시계방향 회전 (R90)',
    actionDescEn: 'Move 2: Col 3 90° Clockwise Rotation (R90)',
    mathInsightKo: '우측 상단 2번 코너와 5번 변 타일이 동시에 ID로 더블 소거(Double Cancel)! 3열의 상단부가 완전 정돈됩니다.',
    mathInsightEn: 'Tiles 2 and 5 simultaneously cancel to ID (Double Cancel)! The upper right perimeter is fully solved.',
    highlightCells: [2, 5, 8],
    formulaBadge: '2수: 3열 R90',
    formulaText: 'Col[3] ➔ R90',
    formulaDesc: '2번·5번 타일 동시 더블 소거'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '3수: 3행(Row 3) 90° 시계방향 회전 (R90)',
    actionDescEn: 'Move 3: Row 3 90° Clockwise Rotation (R90)',
    mathInsightKo: '하단 7번 변과 8번 우하단 코너가 연속 소거! 이제 보드에는 좌측 1열(0, 3, 6번 타일)의 균일 위상(R270)만 남습니다.',
    mathInsightEn: 'Tiles 7 and 8 cancel out! Only Col 1 (cells 0, 3, 6) remains with uniform phase R270.',
    highlightCells: [6, 7, 8],
    formulaBadge: '3수: 3행 R90',
    formulaText: 'Row[3] ➔ R90',
    formulaDesc: '7번·8번 타일 소거 및 1열 균일 정렬'
  },
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '4수: 1열(Col 1) 90° 시계방향 회전 (R90) - 올 클리어',
    actionDescEn: 'Move 4: Col 1 90° Clockwise Rotation (R90) - Finale',
    mathInsightKo: '1열 전체(0, 3, 6번)가 일격에 트리플 킬(Triple Cancel)! 나선 회오리를 완벽히 진압하고 100% 항등 상태를 완성합니다.',
    mathInsightEn: 'Col 1 (cells 0, 3, 6) triple-cancels to ID in one stroke! The vortex is fully mastered.',
    highlightCells: [0, 3, 6],
    formulaBadge: '4수: 1열 R90 (종결)',
    formulaText: 'Col[1] ➔ R90 ➔ 100% 클리어',
    formulaDesc: '1열 트리플 킬로 100% 완전 정복'
  }
]);

// 37. [Round 9 마스터 공식 23: D4 다이아몬드 코어 분쇄 3수 공식]
// 초기 보드: ['ID', 'MX', 'ID', 'MX', 'R180', 'MX', 'ID', 'MX', 'ID']
// 2행(row 1) R90 ➔ 2열(col 1) MX ➔ 2행(row 1) MD = 100% ID 올클리어
const d4DiamondCoreSmashInitialBoard: D4Op[] = [
  D4.ID, D4.MX,   D4.ID,
  D4.MX, D4.R180, D4.MX,
  D4.ID, D4.MX,   D4.ID
];

const d4DiamondCoreSmashSteps = createInteractiveSteps(d4DiamondCoreSmashInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '1수: 2행(Row 2) 90° 시계방향 회전 (R90)',
    actionDescEn: 'Move 1: Row 2 90° Clockwise Rotation (R90)',
    mathInsightKo: '좌우 변(3, 5)이 MX에서 주대각 반사 MD로 전이되고, 중심 4번은 R180 * R90 = R270으로 조작되어 2수 십자 교차를 준비합니다.',
    mathInsightEn: 'Edges 3 and 5 transition to MD, and center 4 becomes R270, priming the board for the vertical cross-sweep.',
    highlightCells: [3, 4, 5],
    formulaBadge: '1수: 2행 R90',
    formulaText: 'Row[2] ➔ R90',
    formulaDesc: '중앙 2행 대각 반사 위상 전이'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '2수: 2열(Col 2) 가로축 반사 (MX)',
    actionDescEn: 'Move 2: Col 2 Horizontal Reflection (MX)',
    mathInsightKo: '상하 변(1, 7번)의 MX가 완벽 소거(ID)되고, 중심 4번 또한 MD로 변환되어 2행 전체(3, 4, 5)가 동일한 MD 위상으로 통합 정렬됩니다!',
    mathInsightEn: 'Top and bottom edges (1, 7) cancel to ID! Center 4 becomes MD, perfectly unifying Row 2 (3, 4, 5) into identical MD phase!',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 MX',
    formulaText: 'Col[2] ➔ MX',
    formulaDesc: '1번·7번 상하 변 동시 소거 및 2행 단일 위상화'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.MD,
    actionDescKo: '3수: 2행(Row 2) 주대각선 반사 (MD) - 일격 스매시 종결',
    actionDescEn: 'Move 3: Row 2 Main Diagonal Reflection (MD) - Smash Finale',
    mathInsightKo: '단일 위상 MD로 정렬된 2행 3개 타일(3, 4, 5번)을 MD의 자기역원 특성(MD * MD = ID)으로 트리플 킬! 3수만에 올 클리어!',
    mathInsightEn: 'Row 2 triple-cancels to ID using MD self-inversion (MD * MD = ID)! 100% ID reached in just 3 lightning moves!',
    highlightCells: [3, 4, 5],
    formulaBadge: '3수: 2행 MD (종결)',
    formulaText: 'Row[2] ➔ MD ➔ 100% 클리어',
    formulaDesc: '2행 트리플 킬로 마름모 코어 완전 격파'
  }
]);

// 38. [Round 9 마스터 공식 24: D4 안티 체커 패리티 4수 올킬 공식]
// 초기 보드: ['MD', 'R180', 'MD', 'R180', 'ID', 'R180', 'MD', 'R180', 'MD']
// 주대각선(main) MD ➔ 2행(row 1) R180 ➔ 부대각선(anti) MD ➔ 2열(col 1) R180 = 100% ID 올클리어
const d4AntiCheckerParityInitialBoard: D4Op[] = [
  D4.MD,   D4.R180, D4.MD,
  D4.R180, D4.ID,   D4.R180,
  D4.MD,   D4.R180, D4.MD
];

const d4AntiCheckerParitySteps = createInteractiveSteps(d4AntiCheckerParityInitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MD,
    actionDescKo: '1수: 주대각선(↖) 대각 반사 (MD)',
    actionDescEn: 'Move 1: Main Diag (↖) Diagonal Reflection (MD)',
    mathInsightKo: '0번과 8번 코너의 MD 위상이 즉각 소거(ID)되고, 중심 4번은 MD 위상으로 전이되어 2행의 중심 가교가 형성됩니다.',
    mathInsightEn: 'Corners 0 and 8 immediately cancel to ID, and center 4 transitions to MD to bridge Row 2.',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각선 (↖) MD',
    formulaText: 'Diag[main] ➔ MD',
    formulaDesc: '0번·8번 코너 즉각 소거'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R180,
    actionDescKo: '2수: 2행(Row 2) 180° 회전 (R180)',
    actionDescEn: 'Move 2: Row 2 180° Rotation (R180)',
    mathInsightKo: '좌우 3번과 5번 타일의 R180이 동시 소거(Double Cancel)! 중심 4번은 MAD로 전이되어 부대각선(↗) 축과 정확히 공명합니다.',
    mathInsightEn: 'Edges 3 and 5 double-cancel to ID! Center 4 transitions to MAD, resonating with the anti-diagonal axis.',
    highlightCells: [3, 4, 5],
    formulaBadge: '2수: 2행 R180',
    formulaText: 'Row[2] ➔ R180',
    formulaDesc: '3번·5번 타일 동시 더블 소거'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.MD,
    actionDescKo: '3수: 부대각선(↗) 대각 반사 (MD)',
    actionDescEn: 'Move 3: Anti Diag (↗) Diagonal Reflection (MD)',
    mathInsightKo: '우상단 2번과 좌하단 6번 코너가 완전히 소거(ID)! 이제 보드에는 중앙 2열(1, 4, 7번)의 균일 위상(R180)만 남습니다.',
    mathInsightEn: 'Corners 2 and 6 fully cancel to ID! Only Col 2 (cells 1, 4, 7) remains with uniform phase R180.',
    highlightCells: [2, 4, 6],
    formulaBadge: '3수: 부대각선 (↗) MD',
    formulaText: 'Diag[anti] ➔ MD',
    formulaDesc: '2번·6번 코너 소거 및 2열 정렬'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.R180,
    actionDescKo: '4수: 2열(Col 2) 180° 회전 (R180) - 100% 올킬 종결',
    actionDescEn: 'Move 4: Col 2 180° Rotation (R180) - All-Kill Finale',
    mathInsightKo: '중앙 2열 3개 타일(1, 4, 7번)을 R180으로 일격에 트리플 킬(Triple Cancel)! 복잡했던 체커 안티 패리티를 4수만에 완벽 평정합니다.',
    mathInsightEn: 'Col 2 (cells 1, 4, 7) triple-cancels to ID! The intricate anti-checker parity is completely solved in 4 moves!',
    highlightCells: [1, 4, 7],
    formulaBadge: '4수: 2열 R180 (종결)',
    formulaText: 'Col[2] ➔ R180 ➔ 100% 클리어',
    formulaDesc: '2열 트리플 킬로 안티 체커 완전 정복'
  }
]);

'''

item_code = '''  {
    id: 'd4-spiral-core-vortex-4',
    titleKo: '나선형 코어 볼텍스 4수 소거 공식',
    titleEn: 'Spiral Core Vortex 4-Move Purge Formula',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 4수',
    badgeEn: '🏁 D4 Master 4M',
    difficulty: 4,
    formulaSeq: 'Row 1 R90 ➔ Col 3 R90 ➔ Row 3 R90 ➔ Col 1 R90 = 전 타일 올클리어',
    summaryKo: '외곽 8개 타일이 중심을 축으로 회전하는 나선형 와류(Vortex) 배치를 1행·3열·3행·1열의 시계방향 나선 4단 90° 회전으로 완벽 소거합니다.',
    summaryEn: 'Eliminates a perimeter spiral vortex pattern (8 outer tiles rotating around the core) via a 4-move clockwise perimeter sweep (Row 1 ➔ Col 3 ➔ Row 3 ➔ Col 1) using 90° rotations.',
    diagramType: 'interactive',
    steps: d4SpiralCoreVortexSteps,
    latexFormula: '\\\\mathcal{F}_{\\\\text{vortex}} = \\\\text{Col}_1(R_{90}) \\\\circ \\\\text{Row}_3(R_{90}) \\\\circ \\\\text{Col}_3(R_{90}) \\\\circ \\\\text{Row}_1(R_{90})',
    notesKo: [
      'BFS 전수 탐색(754,922개 상태)으로 증명된 지름길 없는(Zero-Shortcut) 엄격한 4수 마스터 공식입니다.',
      '중심(4번)은 항등원(ID)인 태풍의 눈 상태를 유지하며, 외곽 둘레를 1행(Row 1) ➔ 3열(Col 3) ➔ 3행(Row 3) ➔ 1열(Col 1) 순으로 감아 돌며 위상을 차례로 중화합니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 4-move sequence (Zero-Shortcut) verified across 754,922 states.',
      'The center core (cell 4) stays in ID as the calm eye of the hurricane, while the outer ring is sequentially neutralized via a clockwise perimeter cascade.'
    ],
    tags: ['4수', '나선형', '회오리', 'Vortex', 'D4 마스터', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-diamond-core-smash-3',
    titleKo: '마름모꼴 다이아몬드 코어 3수 스매시 공식',
    titleEn: 'Diamond Core Smash 3-Move Finish Formula',
    category: 'god-number',
    badgeKo: '⚡ D4 스피드 3수',
    badgeEn: '⚡ D4 Speed 3M',
    difficulty: 3,
    formulaSeq: 'Row 2 R90 ➔ Col 2 MX ➔ Row 2 MD = 전 타일 올클리어',
    summaryKo: '중심 코어(4번)와 십자 변(1, 3, 5, 7번)으로 이루어진 순수 마름모꼴 위상을 Row 2와 Col 2의 십자 교차 스트라이크로 단 3수만에 격파합니다.',
    summaryEn: 'Crushes a pure diamond cross phase (center 4 + cross edges 1, 3, 5, 7) in exactly 3 moves via orthogonal Row 2 and Col 2 cross-strikes.',
    diagramType: 'interactive',
    steps: d4DiamondCoreSmashSteps,
    latexFormula: '\\\\mathcal{F}_{\\\\text{diamond}} = \\\\text{Row}_2(M_D) \\\\circ \\\\text{Col}_2(M_x) \\\\circ \\\\text{Row}_2(R_{90})',
    notesKo: [
      'BFS 전수 탐색으로 입증된 3수 극단 최단 거리(Zero-Shortcut k=3) 공식입니다.',
      '외곽 4개 코너(0, 2, 6, 8)가 완전히 깨끗한 ID 상태를 유지하며 오직 다이아몬드 코어 5개 타일만 선별 타격합니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 3-move sequence (Zero-Shortcut) with no 1- or 2-move shortcuts.',
      'All 4 corners (0, 2, 6, 8) remain pristine ID, surgically smashing only the 5 diamond core tiles.'
    ],
    tags: ['3수', '다이아몬드', '마름모꼴', 'Diamond Core', 'D4 마스터', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-anti-checker-parity-4',
    titleKo: '안티 체커 패리티 & 대각 반사 4수 올킬 공식',
    titleEn: 'Anti-Checker Parity & Diagonal 4-Move All-Kill Formula',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 4수',
    badgeEn: '🏁 D4 Master 4M',
    difficulty: 4,
    formulaSeq: 'Main Diag (↖) MD ➔ Row 2 R180 ➔ Anti Diag (↗) MD ➔ Col 2 R180 = 전 타일 올클리어',
    summaryKo: '체커보드 흑/백 타일이 대각 반사(MD)와 점대칭(R180)으로 엇갈린 안티 패리티 위상을 양대각선과 십자축의 교차 핑퐁 연산으로 4수만에 완전 소거합니다.',
    summaryEn: 'Eliminates an anti-checker parity state (corners carrying MD diagonal reflection vs edges carrying R180 point reflection) via alternating diagonal and orthogonal cross-sweeps.',
    diagramType: 'interactive',
    steps: d4AntiCheckerParitySteps,
    latexFormula: '\\\\mathcal{F}_{\\\\text{checker}} = \\\\text{Col}_2(R_{180}) \\\\circ \\\\Delta_2(M_D) \\\\circ \\\\text{Row}_2(R_{180}) \\\\circ \\\\Delta_1(M_D)',
    notesKo: [
      'BFS 전수 탐색(754,922개 상태)으로 증명된 지름길 없는(Zero-Shortcut) 엄격한 4수 마스터 공식입니다.',
      '주대각선(↖)과 부대각선(↗)의 대각 반사(MD) 연산과 중앙 Row 2, Col 2의 점대칭(R180) 회전이 완벽한 지그재그 쌍대성을 이룹니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 4-move sequence (Zero-Shortcut) verified across 754,922 states.',
      'Main/Anti diagonals (MD) and orthogonal Row 2/Col 2 (R180) form an alternating zigzag duality.'
    ],
    tags: ['4수', '체커보드', '대각 반사', 'Anti-Checker', 'D4 마스터', '신의 수 테크닉'],
    isInteractive: true
  },
'''

# 1. Insert step code
idx_step = text.find(target_step)
text = text[:idx_step] + step_code + text[idx_step:]

# 2. Insert items after d4-checker-superposition-4 item
target_item_end = "id: 'd4-checker-superposition-4'"
idx_item = text.find(target_item_end)
if idx_item == -1:
    raise RuntimeError('d4-checker-superposition-4 not found')

idx_close = text.find('  },', idx_item)
if idx_close == -1:
    raise RuntimeError('item close not found')
idx_insert = idx_close + len('  },') + 1

text = text[:idx_insert] + item_code + text[idx_insert:]

with open('src/data/formulas.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated src/data/formulas.ts successfully!')
