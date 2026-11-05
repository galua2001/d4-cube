# -*- coding: utf-8 -*-
import sys

file_path = r'C:\Users\user\matrix-cube\src\data\formulas.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Step 정의 추가
step_target = "  }\n]);\n\nconst BASE_FORMULAS: FormulaItem[] = ["
assert step_target in content, "step_target not found"

r6_steps = """  }
]);

// 27. [D4 신규 마스터 공식 13: 쌍둥이 열 대칭 플럭스 4수 슈퍼 소거]
// 초기 보드: ['R270', 'ID', 'MX', 'R270', 'ID', 'MY', 'R270', 'ID', 'MX']
// 1열(col 0) R90 ➔ 2행(row 1) R90 ➔ 3열(col 2) MX ➔ 2행(row 1) R270 = 100% ID 올클리어
const d4TwinColumnFluxInitialBoard: D4Op[] = [
  D4.R270, D4.ID, D4.MX,
  D4.R270, D4.ID, D4.MY,
  D4.R270, D4.ID, D4.MX
];

const d4TwinColumnFluxSteps = createInteractiveSteps(d4TwinColumnFluxInitialBoard, [
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1수: 1열 90° 시계 회전 (R90 트리플 킬 폭파)',
    actionDescEn: 'Move 1: Col 1 Rotate 90° CW (R90 Triple-Kill)',
    mathInsightKo: '1열에 R90을 가하여 0, 3, 6번 셀을 R270 ∘ R90 = ID로 일괄 소거(트리플 킬)!',
    mathInsightEn: 'Col 1 R90 wipes cells 0, 3, 6 simultaneously via R270 ∘ R90 = ID (Triple-Kill)!',
    highlightCells: [0, 3, 6],
    formulaBadge: '1수: 1열 R90 트리플 킬',
    formulaText: 'Col₁ ➔ R90',
    formulaDesc: '1열 시계 회전으로 1열 3개 타일을 일제히 소거합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '2수: 2행 90° 시계 회전 (R90 임시 비틀림)',
    actionDescEn: 'Move 2: Row 2 Rotate 90° CW (R90 Phase Twist)',
    mathInsightKo: '2행에 R90을 적용하여 3열 5번 셀의 반사 위상 켤레(MY ∘ R90 = MAD)를 준비합니다.',
    mathInsightEn: 'Row 2 R90 prepares the reflection conjugate on Col 3 tile 5 (MY ∘ R90 = MAD).',
    highlightCells: [3, 4, 5],
    formulaBadge: '2수: 2행 R90',
    formulaText: 'Row₂ ➔ R90',
    formulaDesc: '2행 시계 회전으로 3열 반사 상쇄를 위한 교량을 형성합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.MX,
    actionDescKo: '3수: 3열 상하 가로 반사 (MX 트리플 킬 폭파)',
    actionDescEn: 'Move 3: Col 3 Horizontal Reflection (MX Triple-Kill)',
    mathInsightKo: '3열에 MX를 가하여 2, 5, 8번 셀을 전원 소거(트리플 킬)! 2행 전체가 순수 R90 단일 위상으로 동기화됩니다.',
    mathInsightEn: 'Col 3 MX triggers a Triple-Kill on tiles 2, 5, 8; synchronizes Row 2 into pure R90 phase.',
    highlightCells: [2, 5, 8],
    formulaBadge: '3수: 3열 MX 트리플 킬',
    formulaText: 'Col₃ ➔ MX',
    formulaDesc: '3열 가로 반사로 3열 3개 타일을 일제히 소거합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R270,
    actionDescKo: '4수: 2행 90° 반시계 역회전 (R270 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Row 2 Rotate 90° CCW (R270 Triple-Kill Finish)',
    mathInsightKo: '2행에 R270 역회전을 적용하여 남은 3, 4, 5번 셀을 R90 ∘ R270 = ID로 완전 소거! 100% ID 올클리어 완성!',
    mathInsightEn: 'Row 2 R270 cancels tiles 3, 4, 5 via R90 ∘ R270 = ID (Triple-Kill Finish), achieving 100% All Clear!',
    highlightCells: [3, 4, 5],
    formulaBadge: '4수: 2행 R270 피니시',
    formulaText: 'Row₂ ➔ R270 ➔ 100% 클리어',
    formulaDesc: '2행 반시계 역회전으로 중심행을 완전히 복원하여 올클리어를 달성합니다.'
  }
]);

// 28. [D4 신규 마스터 공식 14: H-브래킷 위상 도치 3수 킬]
// 초기 보드: ['R270', 'ID', 'R270', 'R180', 'R270', 'R180', 'R270', 'ID', 'R270']
// 1열(col 0) R90 ➔ 2행(row 1) R90 ➔ 3열(col 2) R90 = 100% ID 올클리어
const d4HBracketSmashInitialBoard: D4Op[] = [
  D4.R270, D4.ID,   D4.R270,
  D4.R180, D4.R270, D4.R180,
  D4.R270, D4.ID,   D4.R270
];

const d4HBracketSmashSteps = createInteractiveSteps(d4HBracketSmashInitialBoard, [
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1수: 1열 90° 시계 회전 (R90 더블 킬 폭파)',
    actionDescEn: 'Move 1: Col 1 Rotate 90° CW (R90 Double-Kill)',
    mathInsightKo: '1열에 R90을 적용하여 0번과 6번 코너 타일(R270 ∘ R90 = ID) 동시 소거(더블 킬)! 3번 셀은 R270으로 전이됩니다.',
    mathInsightEn: 'Col 1 R90 wipes corners 0 and 6 simultaneously (R270 ∘ R90 = ID Double-Kill); tile 3 shifts to R270.',
    highlightCells: [0, 3, 6],
    formulaBadge: '1수: 1열 R90 더블 킬',
    formulaText: 'Col₁ ➔ R90',
    formulaDesc: '1열 시계 회전으로 0번과 6번 코너 타일을 동시 소거합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '2수: 2행 90° 시계 회전 (R90 더블 킬 & 위상 동기화)',
    actionDescEn: 'Move 2: Row 2 Rotate 90° CW (R90 Double-Kill & Phase Sync)',
    mathInsightKo: '2행에 R90을 적용하여 3번과 4번 셀 동시 소거(더블 킬)! 3열 전체(2, 5, 8)가 순수 R270 단일 위상으로 동기화됩니다.',
    mathInsightEn: 'Row 2 R90 clears tiles 3 and 4 (Double-Kill); synchronizes Column 3 (2, 5, 8) into pure R270 phase.',
    highlightCells: [3, 4, 5],
    formulaBadge: '2수: 2행 R90 더블 킬',
    formulaText: 'Row₂ ➔ R90',
    formulaDesc: '2행 시계 회전으로 중심 십자를 정리하고 3열을 동기화합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '3수: 3열 90° 시계 회전 (R90 트리플 킬 피니시)',
    actionDescEn: 'Move 3: Col 3 Rotate 90° CW (R90 Triple-Kill Finish)',
    mathInsightKo: '3열에 R90을 적용하여 동기화된 2, 5, 8번 셀 3개 타일 일제 소거(트리플 킬 폭파)! 100% ID 올클리어 완성!',
    mathInsightEn: 'Col 3 R90 wipes synchronized tiles 2, 5, 8 simultaneously (R270 ∘ R90 = ID Triple-Kill Finish), 100% All Clear!',
    highlightCells: [2, 5, 8],
    formulaBadge: '3수: 3열 R90 트리플 킬',
    formulaText: 'Col₃ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '3열 시계 회전으로 3열 전체를 일제히 폭파하여 올클리어를 달성합니다.'
  }
]);

// 29. [D4 신규 마스터 공식 15: 8방향 별빛 소용돌이 4수 올킬]
// 초기 보드: ['R270', 'R90', 'R270', 'R90', 'ID', 'R90', 'R270', 'R90', 'R270']
// 주대각선(main) R90 ➔ 부대각선(anti) R90 ➔ 2행(row 1) R270 ➔ 2열(col 1) R270 = 100% ID 올클리어
const d4StarBurstVortexInitialBoard: D4Op[] = [
  D4.R270, D4.R90,  D4.R270,
  D4.R90,  D4.ID,   D4.R90,
  D4.R270, D4.R90,  D4.R270
];

const d4StarBurstVortexSteps = createInteractiveSteps(d4StarBurstVortexInitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.R90,
    actionDescKo: '1수: 주대각선(↖) 90° 시계 회전 (R90 더블 킬 폭파)',
    actionDescEn: 'Move 1: Main Diag (↖) Rotate 90° CW (R90 Double-Kill)',
    mathInsightKo: '주대각선에 R90을 적용하여 0번과 8번 대각 코너 타일(R270 ∘ R90 = ID) 동시 소거(더블 킬)!',
    mathInsightEn: 'Main Diag R90 wipes corners 0 and 8 simultaneously via R270 ∘ R90 = ID (Double-Kill)!',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 R90 더블 킬',
    formulaText: 'Diag[main] ➔ R90',
    formulaDesc: '주대각선 시계 회전으로 0번과 8번 코너 타일을 동시 소거합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.R90,
    actionDescKo: '2수: 부대각선(↗) 90° 시계 회전 (R90 더블 킬, 4대 코너 올킬)',
    actionDescEn: 'Move 2: Anti Diag (↗) Rotate 90° CW (R90 Double-Kill, 4-Corner Clear)',
    mathInsightKo: '부대각선에 R90을 적용하여 2번과 6번 코너 타일 동시 소거(더블 킬)! 4대 코너 100% 소거 완료, 중심 십자만 남김.',
    mathInsightEn: 'Anti Diag R90 wipes corners 2 and 6 (Double-Kill), completely clearing all 4 corners and isolating central cross.',
    highlightCells: [2, 4, 6],
    formulaBadge: '2수: 부대각 R90 더블 킬',
    formulaText: 'Diag[anti] ➔ R90',
    formulaDesc: '부대각선 시계 회전으로 2번과 6번 코너를 소거하여 4대 코너를 모두 정복합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R270,
    actionDescKo: '3수: 2행 90° 반시계 역회전 (R270 더블 킬 & 수직 정렬)',
    actionDescEn: 'Move 3: Row 2 Rotate 90° CCW (R270 Double-Kill & Vertical Sync)',
    mathInsightKo: '2행에 R270을 적용하여 3번과 5번 변 타일 소거(더블 킬)! 2열 척추(1, 4, 7)가 순수 R90 단일 위상으로 정렬됩니다.',
    mathInsightEn: 'Row 2 R270 clears edges 3 and 5 (Double-Kill); aligns vertical spine (1, 4, 7) into pure R90 phase.',
    highlightCells: [3, 4, 5],
    formulaBadge: '3수: 2행 R270 더블 킬',
    formulaText: 'Row₂ ➔ R270',
    formulaDesc: '2행 반시계 역회전으로 좌우 변 타일을 소거하고 2열 척추를 정렬합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.R270,
    actionDescKo: '4수: 2열 90° 반시계 역회전 (R270 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Col 2 Rotate 90° CCW (R270 Triple-Kill Finish)',
    mathInsightKo: '2열에 R270을 가하여 1, 4, 7번 셀 3개 타일 일제 소거(트리플 킬 폭파)! 100% ID 올클리어 완성!',
    mathInsightEn: 'Col 2 R270 wipes spine tiles 1, 4, 7 simultaneously via R90 ∘ R270 = ID (Triple-Kill Finish), 100% All Clear!',
    highlightCells: [1, 4, 7],
    formulaBadge: '4수: 2열 R270 피니시',
    formulaText: 'Col₂ ➔ R270 ➔ 100% 클리어',
    formulaDesc: '2열 반시계 역회전으로 중심 척추를 완전히 소거하여 올클리어를 달성합니다.'
  }
]);

const BASE_FORMULAS: FormulaItem[] = ["""

content = content.replace(step_target, r6_steps, 1)

# 2. BASE_FORMULAS에 항목 추가
r5_base_end = "    tags: ['4수', '대각선', '풍차', '반사', '마스터', 'D4', '신의 수 테크닉'],\n    isInteractive: true\n  },"
assert r5_base_end in content, "r5_base_end not found"

r6_base_items = """    tags: ['4수', '대각선', '풍차', '반사', '마스터', 'D4', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-twin-column-flux-4',
    titleKo: '쌍둥이 열 대칭 플럭스 4수 슈퍼 소거',
    titleEn: 'Twin Column Flux (4-Move Super Finish)',
    category: 'god-number',
    badgeKo: '⚡ 쌍둥이 플럭스 4수',
    badgeEn: '⚡ Twin Flux 4M',
    difficulty: 4,
    formulaSeq: '1열 R90 ➔ 2행 R90 ➔ 3열 MX ➔ 2행 R270 = 전 타일 올클리어',
    summaryKo: '중앙 2열은 완전한 정위치(ID)를 유지한 채, 1열(R270)과 3열(MX/MY)이 쌍둥이로 뒤틀린 6개 에러 패턴을 [1열 R90] ➔ [2행 R90] ➔ [3열 MX] ➔ [2행 R270] 4수로 2행을 매개로 양 열을 분리 정복하는 D4 마스터 공식입니다.',
    summaryEn: 'A twin-column flux state where Columns 1 and 3 are phase-split while Column 2 is completely intact. Cleared in 4 moves: [Col 1 R90] ➔ [Row 2 R90] ➔ [Col 3 MX] ➔ [Row 2 R270] using Row 2 orthogonal coupling.',
    diagramType: 'interactive',
    steps: d4TwinColumnFluxSteps,
    latexFormula: '\\\\text{Col}_1(\\\\text{R90}) \\\\circ \\\\text{Row}_2(\\\\text{R90}) \\\\circ \\\\text{Col}_3(\\\\text{MX}) \\\\circ \\\\text{Row}_2(\\\\text{R270}) = \\\\text{ID}',
    notesKo: [
      '1열과 3열의 위상차는 2행을 교량으로 삼아 회전-반사 켤레를 적용하면 중앙 2열을 전혀 흩트리지 않고 단 4수 만에 양쪽 열을 모두 소거할 수 있습니다.',
      '1수 1열 트리플 킬 ➔ 2수 2행 임시 비틀림 ➔ 3수 3열 트리플 킬 ➔ 4수 2행 역회전 복원의 완벽한 4수 대칭 플럭스 사이클입니다.'
    ],
    notesEn: [
      'Col 1 and Col 3 exhibit opposing phase shifts. Using Row 2 as a bridge with alternating rotations and reflections decouples both columns without disturbing Column 2.',
      'Follows a perfect 4-move flux cycle: Col 1 triple-kill ➔ Row 2 temporary twist ➔ Col 3 triple-kill ➔ Row 2 reverse restoration finish.'
    ],
    tags: ['4수', '플럭스', '쌍둥이열', '반사', '회전', '마스터', 'D4', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-h-bracket-smash-3',
    titleKo: 'H-브래킷 위상 도치 3수 킬',
    titleEn: 'H-Bracket Phase Inversion 3-Move Kill',
    category: 'god-number',
    badgeKo: '💥 H-브래킷 3수',
    badgeEn: '💥 H-Bracket 3M',
    difficulty: 3,
    formulaSeq: '1열 R90 ➔ 2행 R90 ➔ 3열 R90 = 전 타일 올클리어',
    summaryKo: '1열, 3열, 그리고 중앙 4번 셀이 H자 형태로 뒤틀리고 상하 변(1, 7번)만 ID로 보존된 고밀도 7개 에러 난제를 [1열 R90] ➔ [2행 R90] ➔ [3열 R90] 단 3수 만에 더블 킬 2회 및 3열 트리플 킬로 일격 분쇄하는 D4 마스터 공식입니다.',
    summaryEn: 'A dense 7-error H-bracket pattern where only top/bottom center edges (1, 7) are solved. Cleared in just 3 moves: [Col 1 R90] ➔ [Row 2 R90] ➔ [Col 3 R90] through double-kill, center double-kill, and Col 3 triple-kill finish.',
    diagramType: 'interactive',
    steps: d4HBracketSmashSteps,
    latexFormula: '\\\\text{Col}_1(\\\\text{R90}) \\\\circ \\\\text{Row}_2(\\\\text{R90}) \\\\circ \\\\text{Col}_3(\\\\text{R90}) = \\\\text{ID}',
    notesKo: [
      '1열 ➔ 2행 ➔ 3열로 이어지는 3연속 R90 회전 스위프는 1, 7번 타일을 전혀 건드리지 않고 H자 전체를 깔끔하게 지워냅니다.',
      '1수 1열 더블 킬 ➔ 2수 2행 더블 킬 및 3열 R270 동기화 ➔ 3수 3열 트리플 킬로 전 타일 올클리어를 달성합니다.'
    ],
    notesEn: [
      'Symmetric three-step R90 sweep (Col 1 ➔ Row 2 ➔ Col 3) uses Row 2 to link both outer columns, annihilating the entire H-bracket without touching edges 1 and 7.',
      'Scores double-kill on move 1, center double-kill and Col 3 R270 alignment on move 2, followed by a Col 3 triple-kill finish.'
    ],
    tags: ['3수', 'H브래킷', '회전', '마스터', 'D4', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-star-burst-vortex-4',
    titleKo: '8방향 별빛 소용돌이 4수 올킬',
    titleEn: '8-Way Starburst Vortex 4-Move All-Kill',
    category: 'god-number',
    badgeKo: '✨ 별빛 소용돌이 4수',
    badgeEn: '✨ Starburst 4M',
    difficulty: 4,
    formulaSeq: '주대각 R90 ➔ 부대각 R90 ➔ 2행 R270 ➔ 2열 R270 = 전 타일 올클리어',
    summaryKo: '중심(4번)은 정위치이고 외곽 8개 타일(모서리 R270, 변 R90)이 대칭 소용돌이로 얽힌 난제를 [주대각 R90] ➔ [부대각 R90] ➔ [2행 R270] ➔ [2열 R270] 4수로 대각선에서 4개 코너를 먼저 깬 뒤 중심 십자를 쓸어 담는 D4 마스터 공식입니다.',
    summaryEn: 'An 8-way vortex where center tile 4 is solved while all 8 outer tiles are twisted in alternating R270/R90 phases. Cleared in 4 moves: [Main Diag R90] ➔ [Anti Diag R90] ➔ [Row 2 R270] ➔ [Col 2 R270] via diagonal cross collapses and orthogonal double/triple kills.',
    diagramType: 'interactive',
    steps: d4StarBurstVortexSteps,
    latexFormula: '\\\\text{Diag}_{\\\\text{main}}(\\\\text{R90}) \\\\circ \\\\text{Diag}_{\\\\text{anti}}(\\\\text{R90}) \\\\circ \\\\text{Row}_2(\\\\text{R270}) \\\\circ \\\\text{Col}_2(\\\\text{R270}) = \\\\text{ID}',
    notesKo: [
      '양대각선(주대각/부대각) R90으로 4대 코너(0, 2, 6, 8)를 완전히 소거한 뒤, 남은 중심 십자(1, 3, 4, 5, 7)를 2행과 2열의 연속 R270으로 한 번에 종결합니다.',
      '대각선 2연속 더블 킬로 4대 코너를 모두 쓸어 담고 중심 십자를 분리 정렬하는 최고 난이도 테크닉입니다.'
    ],
    notesEn: [
      'Dual diagonal R90 moves neutralize all 4 corners while concentrating residual error into the central cross. Subsequent Row 2 and Col 2 R270 sweeps wipe out the remaining cross effortlessly.',
      'Two consecutive diagonal double-kills eliminate all four corners and align the central cross for a surgical orthogonal finish.'
    ],
    tags: ['4수', '별빛', '소용돌이', '대각선', '회전', '마스터', 'D4', '신의 수 테크닉'],
    isInteractive: true
  },"""

content = content.replace(r5_base_end, r6_base_items, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("formulas.ts successfully updated with Round 6 formulas!")
