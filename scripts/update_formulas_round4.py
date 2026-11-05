# -*- coding: utf-8 -*-
"""
formulas.ts 에 신규 D4 마스터 공식 3선 탑재 스크립트
"""
import sys

target_path = r'C:\Users\user\matrix-cube\src\data\formulas.ts'

with open(target_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 스텝 정의 삽입 (const BASE_FORMULAS: FormulaItem[] = [ 직전)
steps_code = '''// 21. [D4 신규 마스터 공식 7: D4 체커보드(X자/십자) 위상차 4수 슈퍼 소거]
// 초기 보드: ['R180', 'R270', 'R180', 'R270', 'R180', 'R270', 'R180', 'R270', 'R180']
// 주대각선(main) R180 ➔ 부대각선(anti) R180 ➔ 2행(row 1) R90 ➔ 2열(col 1) R90 = 100% ID 올클리어
const d4CheckerboardSuperInitialBoard: D4Op[] = [
  D4.R180, D4.R270, D4.R180,
  D4.R270, D4.R180, D4.R270,
  D4.R180, D4.R270, D4.R180
];

const d4CheckerboardSuperSteps = createInteractiveSteps(d4CheckerboardSuperInitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.R180,
    actionDescKo: '1수: 주대각선(↖) 180° 점대칭 반전 (R180 트리플 킬)',
    actionDescEn: 'Move 1: Main Diag (↖) 180° Inversion (R180 Triple-Kill)',
    mathInsightKo: 'R180 ∘ R180 = ID로 주대각선 상의 3개 타일(0, 4, 8) 동시 소거!',
    mathInsightEn: 'Cancels 3 tiles simultaneously on main diagonal via R180 ∘ R180 = ID!',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 R180 트리플 킬',
    formulaText: 'Diag[main] ➔ R180',
    formulaDesc: '주대각선 180° 반전으로 0, 4, 8번 타일을 동시 소거합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.R180,
    actionDescKo: '2수: 부대각선(↗) 180° 점대칭 반전 (R180 더블 킬)',
    actionDescEn: 'Move 2: Anti Diag (↗) 180° Inversion (R180 Double-Kill)',
    mathInsightKo: '2번, 6번 코너 즉시 소거! 4개 모서리 100% ID 정복 완료.',
    mathInsightEn: 'Corners 2 and 6 cleared instantly! All 4 corners conquered.',
    highlightCells: [2, 4, 6],
    formulaBadge: '2수: 부대각 R180 더블 킬',
    formulaText: 'Diag[anti] ➔ R180',
    formulaDesc: '부대각선 180° 반전으로 2, 6번 코너를 소거하고 4개 모서리를 완성합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '3수: 2행 90° 시계 회전 (R90 더블 킬)',
    actionDescEn: 'Move 3: Row 2 Rotate 90° CW (R90 Double-Kill)',
    mathInsightKo: 'R270 ∘ R90 = ID로 3번, 5번 소거. 잔여 비틀림이 2열(1, 4, 7)로 완전 집결!',
    mathInsightEn: 'Resolves cells 3 and 5 via R270 ∘ R90 = ID, isolating errors into Column 2.',
    highlightCells: [3, 4, 5],
    formulaBadge: '3수: 2행 R90 더블 킬',
    formulaText: 'Row₂ ➔ R90',
    formulaDesc: '2행 90° 시계 회전으로 3, 5번 변을 소거하고 남은 회전을 2열로 모읍니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '4수: 2열 90° 시계 회전 (R90 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Col 2 Rotate 90° CW (R90 Triple-Kill Finish)',
    mathInsightKo: 'R270 ∘ R90 = ID로 2열 3개 타일(1, 4, 7) 일제 소거! 100% 올 클리어 완성!',
    mathInsightEn: 'Simultaneously clears Column 2 (cells 1, 4, 7) via R270 ∘ R90 = ID! 100% all-clear achieved!',
    highlightCells: [1, 4, 7],
    formulaBadge: '4수: 2열 R90 트리플 킬',
    formulaText: 'Col₂ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '2열 90° 시계 회전으로 2열 전체를 한 번에 폭파하여 전 타일 올클리어를 완성합니다.'
  }
]);

// 22. [D4 신규 마스터 공식 8: D4 T자형(1행+2열) 척추 정렬 3수 폭파]
// 초기 보드: ['R180', 'MX', 'R180', 'ID', 'MX', 'ID', 'ID', 'MX', 'ID']
// 1행(row 0) R90 ➔ 2열(col 1) MX ➔ 1행(row 0) R90 = 100% ID 올클리어
const d4TSpineFlushInitialBoard: D4Op[] = [
  D4.R180, D4.MX, D4.R180,
  D4.ID,   D4.MX, D4.ID,
  D4.ID,   D4.MX, D4.ID
];

const d4TSpineFlushSteps = createInteractiveSteps(d4TSpineFlushInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1수: 1행 90° 시계 회전 (R90 위상 결합)',
    actionDescEn: 'Move 1: Row 1 Rotate 90° CW (R90 Phase Coupling)',
    mathInsightKo: 'MX ∘ R90 = MD. 1행의 위상을 치환하여 2열과의 대칭 결합 유도!',
    mathInsightEn: 'MX ∘ R90 = MD. Transforms Row 1 phase to couple symmetrically with Col 2!',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 1행 R90',
    formulaText: 'Row₁ ➔ R90',
    formulaDesc: '1행에 90° 회전을 주어 2열 척추와의 결합 대칭을 만듭니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '2수: 2열 상하 가로 반사 (MX 더블 킬)',
    actionDescEn: 'Move 2: Col 2 Horizontal Reflection (MX Double-Kill)',
    mathInsightKo: 'MX ∘ MX = ID로 4번, 7번 척추 소거! 1번 타일은 MD ∘ MX = R270으로 0, 2번과 동기화!',
    mathInsightEn: 'MX ∘ MX = ID resolves spine cells 4, 7! Cell 1 synchronizes to R270 via MD ∘ MX = R270!',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 MX 더블 킬',
    formulaText: 'Col₂ ➔ MX',
    formulaDesc: '2열 상하 반사로 4, 7번 척추를 소거하고 1행을 단일 위상으로 동기화합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '3수: 1행 90° 시계 회전 (R90 트리플 킬 피니시)',
    actionDescEn: 'Move 3: Row 1 Rotate 90° CW (R90 Triple-Kill Finish)',
    mathInsightKo: '1행의 세 타일이 동시에 R270 ∘ R90 = ID로 전멸! 단 3수 만에 완전 정복!',
    mathInsightEn: 'Row 1 tiles simultaneously resolve via R270 ∘ R90 = ID! Complete conquest in 3 moves!',
    highlightCells: [0, 1, 2],
    formulaBadge: '3수: 1행 R90 트리플 킬',
    formulaText: 'Row₁ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '1행 90° 시계 회전으로 1행 전체를 한 번에 폭파하여 전 타일 올클리어를 완성합니다.'
  }
]);

// 23. [D4 신규 마스터 공식 9: D4 4방향 바람개비형 회전-반사 복합체 4수 올킬]
// 초기 보드: ['MAD', 'R270', 'MAD', 'MX', 'ID', 'MX', 'MAD', 'R270', 'MD']
// 1행(row 0) R90 ➔ 3열(col 2) MX ➔ 3행(row 2) R90 ➔ 1열(col 0) MX = 100% ID 올클리어
const d4ChiralPinwheelInitialBoard: D4Op[] = [
  D4.MAD, D4.R270, D4.MAD,
  D4.MX,  D4.ID,   D4.MX,
  D4.MAD, D4.R270, D4.MD
];

const d4ChiralPinwheelSteps = createInteractiveSteps(d4ChiralPinwheelInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1수: 1행 90° 시계 회전 (R90 원샷 소거)',
    actionDescEn: 'Move 1: Row 1 Rotate 90° CW (R90 Single-Kill)',
    mathInsightKo: '상단 1번 변 타일 소거 (R270 ∘ R90 = ID). 코너는 MX로 치환!',
    mathInsightEn: 'Row 1 R90 cancels top edge (1) and transitions top corners into reflection phase.',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 1행 R90',
    formulaText: 'Row₁ ➔ R90',
    formulaDesc: '1행 시계 회전으로 1번 타일을 소거하고 상단 코너를 반사형으로 치환합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.MX,
    actionDescKo: '2수: 3열 상하 가로 반사 (MX 더블 킬)',
    actionDescEn: 'Move 2: Col 3 Horizontal Reflection (MX Double-Kill)',
    mathInsightKo: 'MX ∘ MX = ID로 2번 코너, 5번 변 동시 소거!',
    mathInsightEn: 'MX ∘ MX = ID scores a Double-Cancel on corner 2 and edge 5!',
    highlightCells: [2, 5, 8],
    formulaBadge: '2수: 3열 MX 더블 킬',
    formulaText: 'Col₃ ➔ MX',
    formulaDesc: '3열 상하 반사로 2번 코너와 5번 변 타일을 동시 소거합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '3수: 3행 90° 시계 회전 (R90 더블 킬)',
    actionDescEn: 'Move 3: Row 3 Rotate 90° CW (R90 Double-Kill)',
    mathInsightKo: '7번 변과 8번 코너 타일 동시 소거! 이제 1열의 3개 타일(0, 3, 6)만 MX로 집약됩니다.',
    mathInsightEn: 'Double-Cancel on edge 7 and corner 8, isolating Column 1 in pure MX phase.',
    highlightCells: [6, 7, 8],
    formulaBadge: '3수: 3행 R90 더블 킬',
    formulaText: 'Row₃ ➔ R90',
    formulaDesc: '3행 시계 회전으로 7, 8번 타일을 소거하고 남은 반사를 1열에 집결시킵니다.'
  },
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '4수: 1열 상하 가로 반사 (MX 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Col 1 Horizontal Reflection (MX Triple-Kill Finish)',
    mathInsightKo: '1열에 MX를 가하여 0번, 3번, 6번 3개 타일이 일제히 트리플 킬! 바람개비 100% 올 클리어!',
    mathInsightEn: 'Col 1 MX triggers a Triple-Kill on Column 1 (0, 3, 6), achieving 100% ID all-clear!',
    highlightCells: [0, 3, 6],
    formulaBadge: '4수: 1열 MX 트리플 킬',
    formulaText: 'Col₁ ➔ MX ➔ 100% 클리어',
    formulaDesc: '1열 상하 반사로 1열 3개 타일을 일제히 폭파하여 전 타일 올클리어를 완성합니다.'
  }
]);

'''

target_marker = 'const BASE_FORMULAS: FormulaItem[] = ['
if target_marker not in content:
    print(f'Error: marker {target_marker} not found!')
    sys.exit(1)

content = content.replace(target_marker, steps_code + target_marker, 1)

# 2. BASE_FORMULAS 배열 내 항목 추가 (d4-dual-diagonal-blitz-4 항목 다음)
formulas_items_code = '''  {
    id: 'd4-checkerboard-super-4',
    titleKo: 'D4 체커보드(X자/십자) 위상차 4수 슈퍼 소거',
    titleEn: 'D4 Checkerboard Phase-Shift 4-Move Super Purge',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 4수',
    badgeEn: '🏁 D4 Master 4M',
    difficulty: 4,
    formulaSeq: '주대각선 R180 ➔ 부대각선 R180 ➔ 2행 R90 ➔ 2열 R90 = 전 타일 올클리어',
    summaryKo: 'X자 타일 5개(R180)와 십자 타일 4개(R270)의 체커보드 위상차를 [주대각선 R180] ➔ [부대각선 R180] ➔ [2행 R90] ➔ [2열 R90] 4수로 양대각 소거 후 2열 트리플 킬로 마무리하는 D4 마스터 공식입니다.',
    summaryEn: 'A checkerboard bottleneck with 5 diagonal tiles (R180) and 4 orthogonal cross tiles (R270). Resolves in 4 moves: [Main Diag R180] ➔ [Anti Diag R180] ➔ [Row 2 R90] ➔ [Col 2 R90] via dual diagonal cancel and a Column 2 triple-kill finish.',
    diagramType: 'interactive',
    steps: d4CheckerboardSuperSteps,
    latexFormula: '\\\\text{Diag}_{\\\\text{main}}(R_{180}) \\\\circ \\\\text{Diag}_{\\\\text{anti}}(R_{180}) \\\\circ \\\\text{Row}_2(R_{90}) \\\\circ \\\\text{Col}_2(R_{90}) = \\\\text{ID}',
    notesKo: [
      '주대각선과 부대각선의 180° 반전으로 4개 모서리(0, 2, 6, 8)와 중심을 즉시 해결합니다.',
      '이후 2행과 2열의 연속 R90 회전으로 십자 타일들을 차례로 더블 킬, 트리플 킬하며 100% 올클리어합니다.'
    ],
    notesEn: [
      'Dual 180° diagonal inversions clear all 4 corners (0, 2, 6, 8) and the center immediately.',
      'Subsequent R90 rotations on Row 2 and Column 2 deliver double-kill and triple-kill clears.'
    ],
    tags: ['D4 마스터', '체커보드', '4수 슈퍼소거', '신의 수', '고급 피니시', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-t-spine-flush-3',
    titleKo: 'D4 T자형(1행+2열) 척추 정렬 3수 폭파',
    titleEn: 'D4 T-Spine Alignment 3-Move Flush',
    category: 'god-number',
    badgeKo: '⚡ D4 마스터 3수',
    badgeEn: '⚡ D4 Master 3M',
    difficulty: 3,
    formulaSeq: '1행 R90 ➔ 2열 MX ➔ 1행 R90 = 전 타일 올클리어',
    summaryKo: '1행(0, 1, 2)과 2열 척추(4, 7)만 뒤틀린 국소 T자형 배치를 [1행 R90] ➔ [2열 MX] ➔ [1행 R90] 단 3수로 척추 소거 및 1행 트리플 킬로 끝내는 D4 고속 마스터 공식입니다.',
    summaryEn: 'A localized T-spine bottleneck of Row 1 (0, 1, 2) and Col 2 spine (4, 7). Solves in 3 fast moves: [Row 1 R90] ➔ [Col 2 MX] ➔ [Row 1 R90] via spine cancel and Row 1 triple-kill finish.',
    diagramType: 'interactive',
    steps: d4TSpineFlushSteps,
    latexFormula: '\\\\text{Row}_1(R_{90}) \\\\circ \\\\text{Col}_2(M_X) \\\\circ \\\\text{Row}_1(R_{90}) = \\\\text{ID}',
    notesKo: [
      '1행 R90 회전으로 1번 타일을 MD로 치환한 뒤, 2열 MX 반사로 척추(4, 7) 소거와 동시에 1행 전체를 R270으로 동기화합니다.',
      '마지막 1행 R90 한 방으로 1행 전체가 3중 동시 폭파(Triple Kill)됩니다.'
    ],
    notesEn: [
      'Row 1 R90 transforms tile 1 to MD, then Col 2 MX cancels spine tiles (4, 7) while synchronizing Row 1 to R270.',
      'The final Row 1 R90 delivers an explosive Triple-Kill on Row 1 for an instant 3-move solve.'
    ],
    tags: ['D4 마스터', 'T자형 척추', '3수 폭파', '신의 수', '고급 피니시', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-chiral-pinwheel-4',
    titleKo: 'D4 4방향 바람개비형 회전-반사 복합체 4수 올킬',
    titleEn: 'D4 4-Way Chiral Pinwheel 4-Move All-Clear',
    category: 'god-number',
    badgeKo: '🌀 D4 마스터 4수',
    badgeEn: '🌀 D4 Master 4M',
    difficulty: 4,
    formulaSeq: '1행 R90 ➔ 3열 MX ➔ 3행 R90 ➔ 1열 MX = 전 타일 올클리어',
    summaryKo: '상하 변(R270), 좌우 변(MX), 4대각 코너가 카이랄 바람개비 위상으로 얽힌 난제를 [1행 R90] ➔ [3열 MX] ➔ [3행 R90] ➔ [1열 MX] 4변 둘레길 교차 순환으로 올킬하는 D4 궁극 마스터 공식입니다.',
    summaryEn: 'A chiral pinwheel dilemma with orthogonal edges (R270 / MX) and diagonal corners. Cleared in 4 perimeter moves: [Row 1 R90] ➔ [Col 3 MX] ➔ [Row 3 R90] ➔ [Col 1 MX] via perimeter cascade and Col 1 triple-kill.',
    diagramType: 'interactive',
    steps: d4ChiralPinwheelSteps,
    latexFormula: '\\\\text{Row}_1(R_{90}) \\\\circ \\\\text{Col}_3(M_X) \\\\circ \\\\text{Row}_3(R_{90}) \\\\circ \\\\text{Col}_1(M_X) = \\\\text{ID}',
    notesKo: [
      '회전과 반사가 교차하는 4방향 둘레길을 순환하며 변과 코너를 차례로 소거합니다.',
      '1수 원샷 소거, 2수 더블 킬, 3수 더블 킬에 이어 4수 1열 트리플 킬로 마무리되는 예술적인 상쇄 흐름을 갖습니다.'
    ],
    notesEn: [
      'Cycles through perimeter edges and corners in alternating rotation and reflection moves.',
      'Features a breathtaking cascade: single kill, double kill, double kill, and a final triple-kill on Column 1.'
    ],
    tags: ['D4 마스터', '바람개비', '카이랄 복합체', '4수 올킬', '신의 수', '고급 피니시', '신의 수 테크닉'],
    isInteractive: true
  },
'''

dual_blitz_end = "tags: ['D4 마스터', '4수 동시폭파', '양대각선 대칭', '신의 수', '고급 피니시', '신의 수 테크닉'],\n    isInteractive: true\n  },"
if dual_blitz_end not in content:
    print('Error: dual_blitz_end not found!')
    sys.exit(1)

content = content.replace(dual_blitz_end, dual_blitz_end + '\n' + formulas_items_code, 1)

# 3. FORMULAS 정의부 중복 제거 로직 강화
old_formulas_def = 'export const FORMULAS: FormulaItem[] = [...BASE_FORMULAS, ...MINED_FORMULAS];'
new_formulas_def = '''const baseIds = new Set(BASE_FORMULAS.map((f) => f.id));
export const FORMULAS: FormulaItem[] = [
  ...BASE_FORMULAS,
  ...MINED_FORMULAS.filter((f) => !baseIds.has(f.id))
];'''

if old_formulas_def in content:
    content = content.replace(old_formulas_def, new_formulas_def, 1)

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated formulas.ts with new D4 Master formulas!")
