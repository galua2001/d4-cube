import re

# 1. Update formulas.ts
with open('src/data/formulas.ts', 'r', encoding='utf-8') as f:
    formulas_ts = f.read()

new_steps = """// 15. [D4 신규 마스터 공식 1: D4 다이아몬드 십자 3수 폭파]
// 초기 보드: ['ID', 'MX', 'ID', 'R180', 'MX', 'R180', 'ID', 'MX', 'ID']
// 2행(row 1) R90 ➔ 2열(col 1) MX ➔ 2행(row 1) R90 = 100% ID 올클리어
const d4DiamondCrossInitialBoard: D4Op[] = [
  D4.ID,   D4.MX,   D4.ID,
  D4.R180, D4.MX,   D4.R180,
  D4.ID,   D4.MX,   D4.ID
];

const d4DiamondCrossSteps = createInteractiveSteps(d4DiamondCrossInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '1수: 2행 90° 시계 회전 (R90)',
    actionDescEn: 'Move 1: Row 2 Rotate 90° (R90)',
    mathInsightKo: '2행의 좌우 날개(3, 5번)가 R270으로 변환되고 중심 4번 타일은 MD로 합성됩니다.',
    mathInsightEn: 'Row 2 side tiles (3, 5) become R270 and center tile 4 composes into MD.',
    highlightCells: [3, 4, 5],
    formulaBadge: '1수: 2행 R90',
    formulaText: 'Row₂ ➔ R90',
    formulaDesc: '2행 회전으로 좌우 날개 위상을 R270으로 전환하고 중심 축을 대각으로 회전시킵니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '2수: 2열 상하 반전 (MX 가로밀기)',
    actionDescEn: 'Move 2: Col 2 Vertical Flip (MX Horizontal Swipe)',
    mathInsightKo: '상하 날개(1, 7번)가 MX² = ID로 즉시 정위치 복원되고, 중심 4번 타일은 MD ∘ MX = R270으로 합성되어 2행 전체가 R270으로 완벽 동기화됩니다.',
    mathInsightEn: 'Wings 1 and 7 restore via MX² = ID, and center tile 4 composes into R270, perfectly aligning Row 2 uniformly to R270.',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 MX',
    formulaText: 'Col₂ ➔ MX',
    formulaDesc: '2열 상하 반전으로 1번과 7번 날개를 즉시 정위치로 맞추고 2행 전체를 동일한 위상으로 정렬합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '3수: 2행 90° 시계 회전 (R90 3수 폭파 피니시)',
    actionDescEn: 'Move 3: Row 2 Rotate 90° (R90 3-Move Finish)',
    mathInsightKo: '동기화된 2행 전체(3, 4, 5번)가 R270 ∘ R90 = ID로 일괄 자기상쇄되며 전 타일 100% ID 올클리어 완성!',
    mathInsightEn: 'All synchronized Row 2 tiles (3, 4, 5) resolve via R270 ∘ R90 = ID, completing 100% board clearance!',
    highlightCells: [3, 4, 5],
    formulaBadge: '3수: 2행 R90 폭파',
    formulaText: 'Row₂ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '2행 시계방향 90° 회전으로 남아있던 2행 전체를 한 방에 폭파하여 정위치로 완성합니다.'
  }
]);

// 16. [D4 신규 마스터 공식 2: D4 ㄱ자 사선연계 3수 올킬]
// 초기 보드: ['R180', 'R180', 'MD', 'ID', 'ID', 'MD', 'ID', 'ID', 'MD']
// 1행(row 0) R90 ➔ 3열(col 2) MD ➔ 1행(row 0) R90 = 100% ID 올클리어
const d4LDiagComboInitialBoard: D4Op[] = [
  D4.R180, D4.R180, D4.MD,
  D4.ID,   D4.ID,   D4.MD,
  D4.ID,   D4.ID,   D4.MD
];

const d4LDiagComboSteps = createInteractiveSteps(d4LDiagComboInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1수: 1행 90° 시계 회전 (R90)',
    actionDescEn: 'Move 1: Row 1 Rotate 90° (R90)',
    mathInsightKo: '0, 1번 타일은 R180 ∘ R90 = R270 상태가 되고, 교차점 2번 코너 타일은 MD ∘ R90 = MY로 전이됩니다.',
    mathInsightEn: 'Tiles 0 and 1 transition to R270, and intersection corner tile 2 transitions to MD ∘ R90 = MY.',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 1행 R90',
    formulaText: 'Row₁ ➔ R90',
    formulaDesc: '1행 회전으로 1행 에러를 R270으로 바꾸고 코너 위상을 반사(MY)로 전이시킵니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.MD,
    actionDescKo: '2수: 3열 사선 반사 (MD 사선밀기)',
    actionDescEn: 'Move 2: Col 3 Diagonal Reflection (MD)',
    mathInsightKo: '3열의 5, 8번 타일이 MD² = ID로 즉시 정위치 복원되고, 코너 2번 타일은 MY ∘ MD = R270으로 합성되어 1행 전체가 R270으로 완벽 동기화됩니다.',
    mathInsightEn: 'Col 3 tiles (5, 8) restore via MD² = ID, and corner tile 2 becomes R270, synchronizing Row 1 uniformly to R270.',
    highlightCells: [2, 5, 8],
    formulaBadge: '2수: 3열 MD',
    formulaText: 'Col₃ ➔ MD',
    formulaDesc: '3열 사선 반사로 5, 8번 타일을 정위치 복원하고 코너 타일을 1행과 동일한 위상으로 정렬합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '3수: 1행 90° 시계 회전 (R90 올킬 피니시)',
    actionDescEn: 'Move 3: Row 1 Rotate 90° (R90 All-Kill Finish)',
    mathInsightKo: '동기화된 1행 0, 1, 2번 타일이 R270 ∘ R90 = ID로 단숨에 동시 소거되며 전 타일 100% ID 올클리어 완성!',
    mathInsightEn: 'All synchronized Row 1 tiles (0, 1, 2) resolve via R270 ∘ R90 = ID, completing 100% board clearance!',
    highlightCells: [0, 1, 2],
    formulaBadge: '3수: 1행 R90 올킬',
    formulaText: 'Row₁ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '1행 시계방향 90° 회전으로 남아있던 1행 3개 타일을 한 번에 올킬하여 퍼즐을 완성합니다.'
  }
]);

// 17. [D4 신규 마스터 공식 3: D4 X-크로스 모서리동시 3수 폭파]
// 초기 보드: ['R270', 'ID', 'R270', 'ID', 'R90', 'ID', 'R270', 'ID', 'R270']
// 2열(col 1) R270 ➔ 3행(row 2) R90 ➔ 1행(row 0) R90 = 100% ID 올클리어
const d4XCrossInitialBoard: D4Op[] = [
  D4.R270, D4.ID,   D4.R270,
  D4.ID,   D4.R90,  D4.ID,
  D4.R270, D4.ID,   D4.R270
];

const d4XCrossSteps = createInteractiveSteps(d4XCrossInitialBoard, [
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.R270,
    actionDescKo: '1수: 2열 90° 반시계 회전 (R270)',
    actionDescEn: 'Move 1: Col 2 Rotate Counter-Clockwise (R270)',
    mathInsightKo: '중심 4번 타일이 R90 ∘ R270 = ID로 즉시 정위치 복원되며, 상하 1, 7번 타일은 R270이 되어 1행과 3행이 각각 완전한 R270 라인으로 정렬됩니다.',
    mathInsightEn: 'Center tile 4 restores via R90 ∘ R270 = ID, and tiles 1 & 7 become R270, aligning Row 1 and Row 3 as complete R270 lines.',
    highlightCells: [1, 4, 7],
    formulaBadge: '1수: 2열 R270',
    formulaText: 'Col₂ ➔ R270',
    formulaDesc: '2열 반시계 회전으로 중심을 즉시 맞추고 1행과 3행을 각각 균일한 R270 라인으로 정렬합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '2수: 3행 90° 시계 회전 (R90 3행 소거)',
    actionDescEn: 'Move 2: Row 3 Rotate 90° (Row 3 Clear)',
    mathInsightKo: '정렬된 3행의 6, 7, 8번 타일이 R270 ∘ R90 = ID로 일괄 소거되며 하단 라인이 완벽하게 정위치 복원됩니다.',
    mathInsightEn: 'Row 3 tiles (6, 7, 8) clear simultaneously via R270 ∘ R90 = ID, perfectly restoring the bottom row.',
    highlightCells: [6, 7, 8],
    formulaBadge: '2수: 3행 R90',
    formulaText: 'Row₃ ➔ R90',
    formulaDesc: '3행 시계 회전으로 하단 3개 타일을 한 번에 정위치로 맞춥니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '3수: 1행 90° 시계 회전 (R90 모서리동시 폭파 피니시)',
    actionDescEn: 'Move 3: Row 1 Rotate 90° (Corner Simultaneous Finish)',
    mathInsightKo: '남아있던 1행의 0, 1, 2번 타일이 R270 ∘ R90 = ID로 한 방에 상쇄되며 전 타일 100% ID 올클리어 완성!',
    mathInsightEn: 'All remaining Row 1 tiles (0, 1, 2) resolve via R270 ∘ R90 = ID, completing 100% board clearance!',
    highlightCells: [0, 1, 2],
    formulaBadge: '3수: 1행 R90 폭파',
    formulaText: 'Row₁ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '1행 시계 회전으로 상단 3개 타일을 폭파하여 4개 모서리 동시 폭파를 완성합니다.'
  }
]);
"""

new_items = """  {
    id: 'd4-diamond-cross-3',
    titleKo: 'D4 다이아몬드 십자 3수 폭파',
    titleEn: 'D4 Diamond Cross 3-Move Finish',
    category: 'god-number',
    badgeKo: '다이아 십자 3수',
    badgeEn: 'Diamond Cross 3M',
    difficulty: 3,
    formulaSeq: '2행 R90 ➔ 2열 MX ➔ 2행 R90 = 전 타일 올클리어',
    summaryKo: '상하좌우 날개와 중심이 십자 형태로 뒤틀린 난제를 [2행 R90] ➔ [2열 MX] ➔ [2행 R90] 단 3수로 중심 및 날개 위상을 동기화하여 시원하게 폭파 올클리어하는 D4 핵심 마스터 공식입니다.',
    summaryEn: 'A high-tier dilemma where wings and center are twisted in a cross pattern. Solves wings and center phase alignment in just 3 moves: [Row 2 R90] ➔ [Col 2 MX] ➔ [Row 2 R90] to achieve 100% all-clear.',
    diagramType: 'interactive',
    steps: d4DiamondCrossSteps,
    latexFormula: '\\\\text{Row}_2(\\\\text{R90}) \\\\circ \\\\text{Col}_2(\\\\text{MX}) \\\\circ \\\\text{Row}_2(\\\\text{R90}) = \\\\text{ID}',
    notesKo: [
      '2행과 2열의 교차점(중심 4번)에서 회전과 반사가 합성(MD ∘ MX = R270)되어 2행 전체가 동일한 위상으로 정렬되는 군론적 기적을 활용합니다.',
      '십자 날개와 중심 타일이 얽혀 있을 때 단 3수 만에 가장 깔끔하게 끝내는 실전 필살기입니다.'
    ],
    notesEn: [
      'Exploits the group miracle where rotation and reflection compose at the center (MD ∘ MX = R270) to align the entire Row 2 uniformly.',
      'An essential master move when cross wings and center are entangled, resolving the board in just 3 moves.'
    ],
    tags: ['D4 마스터', '3수 폭파', '다이아몬드 십자', '신의 수', '고급 피니시', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-l-diag-combo-3',
    titleKo: 'D4 ㄱ자 사선연계 3수 올킬',
    titleEn: 'D4 L-Diagonal Combo 3-Move Finish',
    category: 'god-number',
    badgeKo: 'ㄱ자 사선 3수',
    badgeEn: 'L-Diag Combo 3M',
    difficulty: 3,
    formulaSeq: '1행 R90 ➔ 3열 MD ➔ 1행 R90 = 전 타일 올클리어',
    summaryKo: '1행과 3열이 만나는 ㄱ자 형태의 5개 에러를 [1행 R90] ➔ [3열 MD] ➔ [1행 R90] 단 3수로 사선 대칭과 회전의 비가환성을 이용해 1행으로 위상을 집중시켜 한 방에 올킬하는 실전 공식입니다.',
    summaryEn: 'Resolves a 5-error L-shape intersecting Row 1 and Col 3 in just 3 moves: [Row 1 R90] ➔ [Col 3 MD] ➔ [Row 1 R90], utilizing non-commutativity of diagonal symmetry to sweep the entire line.',
    diagramType: 'interactive',
    steps: d4LDiagComboSteps,
    latexFormula: '\\\\text{Row}_1(\\\\text{R90}) \\\\circ \\\\text{Col}_3(\\\\text{MD}) \\\\circ \\\\text{Row}_1(\\\\text{R90}) = \\\\text{ID}',
    notesKo: [
      '사선 반사(MD)와 90° 회전이 교차 코너 타일(2번 셀)에서 결합하여 1행 전체가 완벽하게 단일 위상(R270)으로 수렴합니다.',
      '외곽 ㄱ자 형태로 에러가 고립되었을 때 사선 연계를 통해 최단 3수 만에 끝내는 강력한 테크닉입니다.'
    ],
    notesEn: [
      'Diagonal reflection (MD) and 90° rotation combine at corner tile 2, converging Row 1 uniformly into R270.',
      'A powerful master technique to conquer outer L-shaped errors in minimal 3 moves via diagonal linkage.'
    ],
    tags: ['D4 마스터', '3수 올킬', 'ㄱ자 사선연계', '신의 수', '고급 피니시', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-x-cross-3',
    titleKo: 'D4 X-크로스 모서리동시 3수 폭파',
    titleEn: 'D4 X-Cross Corner 3-Move Finish',
    category: 'god-number',
    badgeKo: 'X-크로스 3수',
    badgeEn: 'X-Cross 3M',
    difficulty: 4,
    formulaSeq: '2열 R270 ➔ 3행 R90 ➔ 1행 R90 = 전 타일 올클리어',
    summaryKo: '4개 모서리(0, 2, 6, 8번)와 중심(4번)이 X자 형태로 얽힌 대칭 난제를 [2열 R270] ➔ [3행 R90] ➔ [1행 R90] 3수로 중심을 먼저 맞추며 상하 라인을 동기화한 뒤 연속 폭파하는 궁극의 모서리 피니시입니다.',
    summaryEn: 'Conquers the X-cross dilemma where 4 corners and center are entangled. [Col 2 R270] restores center and synchronizes top/bottom rows into R270, followed by [Row 3 R90] and [Row 1 R90] for complete clearance.',
    diagramType: 'interactive',
    steps: d4XCrossSteps,
    latexFormula: '\\\\text{Col}_2(\\\\text{R270}) \\\\circ \\\\text{Row}_3(\\\\text{R90}) \\\\circ \\\\text{Row}_1(\\\\text{R90}) = \\\\text{ID}',
    notesKo: [
      '2열 반시계 회전(R270)으로 중심 4번 타일을 자기상쇄(R90 ∘ R270 = ID)시키는 동시에 1행과 3행을 각각 완벽한 R270 라인으로 분리 정렬합니다.',
      '남은 1행과 3행을 R90으로 각각 쓸어 담으면 4개 모서리 에러가 단 3수 만에 흔적도 없이 사라집니다.'
    ],
    notesEn: [
      'Col 2 R270 cancels out center tile 4 (R90 ∘ R270 = ID) while simultaneously segregating Rows 1 & 3 into clean R270 lines.',
      'Applying R90 to Row 3 and Row 1 wipes out all 4 corner errors in a single surgical sequence.'
    ],
    tags: ['D4 마스터', '3수 폭파', 'X-크로스', '모서리 피니시', '신의 수', '신의 수 테크닉'],
    isInteractive: true
  },"""

# Replace steps block
steps_pattern = re.compile(r'// 15\. \[다이아몬드 십자 3수 파괴 공식 인터랙티브 스텝\].*?(?=const BASE_FORMULAS: FormulaItem\[\] = \[)', re.DOTALL)
formulas_ts = steps_pattern.sub(new_steps + '\n', formulas_ts)

# Replace items block
items_pattern = re.compile(r'  \{\s+id: \'diamond-cross-3m\'.*?(?=  \{\s+id: \'center-inversion\')', re.DOTALL)
formulas_ts = items_pattern.sub(new_items + '\n', formulas_ts)

with open('src/data/formulas.ts', 'w', encoding='utf-8') as f:
    f.write(formulas_ts)

print("Updated formulas.ts successfully!")
