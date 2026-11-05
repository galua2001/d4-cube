# -*- coding: utf-8 -*-
"""
apply_round5_masters.py
갈루아 큐브 Round 5 D4 마스터 공식 3선 및 다국어, JSON 데이터 자동 주입 스크립트
"""

import json
from pathlib import Path

BASE_DIR = Path(r"C:\Users\user\matrix-cube")
FORMULAS_TS = BASE_DIR / "src" / "data" / "formulas.ts"
MINED_JSON = BASE_DIR / "src" / "data" / "minedFormulas.json"
TRANSLATIONS_TS = BASE_DIR / "src" / "i18n" / "translations.ts"

# ==============================================================================
# 1. src/data/formulas.ts 업데이트
# ==============================================================================
def update_formulas_ts():
    content = FORMULAS_TS.read_text(encoding="utf-8")

    # 1.1 스텝 코드 생성
    steps_code = '''// 24. [D4 신규 마스터 공식 10: 4대 코너 링 블리츠 4수 소거]
// 초기 보드: ['R180', 'R270', 'R180', 'R270', 'ID', 'R270', 'R180', 'R270', 'R180']
// 1행(row 0) R90 ➔ 3열(col 2) R90 ➔ 3행(row 2) R90 ➔ 1열(col 0) R90 = 100% ID 올클리어
const d4CornerRingBlitzInitialBoard: D4Op[] = [
  D4.R180, D4.R270, D4.R180,
  D4.R270, D4.ID,   D4.R270,
  D4.R180, D4.R270, D4.R180
];

const d4CornerRingBlitzSteps = createInteractiveSteps(d4CornerRingBlitzInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1수: 1행 90° 시계 회전 (R90 원샷 소거)',
    actionDescEn: 'Move 1: Row 1 Rotate 90° CW (R90 Single-Kill)',
    mathInsightKo: '1행에 R90을 적용하여 상단 1번 변 타일(R270 ∘ R90 = ID) 즉시 소거! 코너 타일 0, 2번은 R270으로 전이됩니다.',
    mathInsightEn: 'Applying R90 to Row 1 clears edge tile 1 (R270 ∘ R90 = ID)! Corners 0 & 2 transition to phase R270.',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 1행 R90',
    formulaText: 'Row₁ ➔ R90',
    formulaDesc: '1행 시계 회전으로 1번 변 타일을 즉시 소거하고 상단 코너를 정돈합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '2수: 3열 90° 시계 회전 (R90 더블 킬)',
    actionDescEn: 'Move 2: Col 3 Rotate 90° CW (R90 Double-Kill)',
    mathInsightKo: '3열에 R90을 적용하여 2번 코너와 5번 변 2개 타일을 동시 소거(더블 킬)! 외곽 포위망을 단숨에 압축합니다.',
    mathInsightEn: 'Applying R90 to Col 3 achieves a Double-Kill on corner 2 and edge 5 (both R270 ∘ R90 = ID)!',
    highlightCells: [2, 5, 8],
    formulaBadge: '2수: 3열 R90 더블 킬',
    formulaText: 'Col₃ ➔ R90',
    formulaDesc: '3열 시계 회전으로 2번 코너와 5번 변을 동시 소거합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '3수: 3행 90° 시계 회전 (R90 더블 킬)',
    actionDescEn: 'Move 3: Row 3 Rotate 90° CW (R90 Double-Kill)',
    mathInsightKo: '3행에 R90을 적용하여 7번 변과 8번 코너 타일을 동시 소거(더블 킬)! 이제 1열 3개 타일(0, 3, 6)만 R270으로 결집됩니다.',
    mathInsightEn: 'Applying R90 to Row 3 executes a Double-Kill on edge 7 and corner 8! Concentrates remaining errors into Column 1.',
    highlightCells: [6, 7, 8],
    formulaBadge: '3수: 3행 R90 더블 킬',
    formulaText: 'Row₃ ➔ R90',
    formulaDesc: '3행 시계 회전으로 7번 변과 8번 코너를 동시 소거합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '4수: 1열 90° 시계 회전 (R90 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Col 1 Rotate 90° CW (R90 Triple-Kill Finish)',
    mathInsightKo: '1열에 R90을 작용시켜 0번 코너, 3번 변, 6번 코너 3개 타일 일제 소거(트리플 킬)! 100% ID 완전 복원 All Clear!',
    mathInsightEn: 'Col 1 R90 triggers an explosive Triple-Kill on Column 1 (0, 3, 6), achieving 100% All Clear!',
    highlightCells: [0, 3, 6],
    formulaBadge: '4수: 1열 R90 트리플 킬',
    formulaText: 'Col₁ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '1열 90° 회전으로 1열 전체를 폭파하여 전 타일 올클리어를 완성합니다.'
  }
]);

// 25. [D4 신규 마스터 공식 11: 십자 변·중심 위상 도치 3수 킬]
// 초기 보드: ['ID', 'MX', 'ID', 'R180', 'MX', 'R180', 'ID', 'MX', 'ID']
// 2행(row 1) R90 ➔ 2열(col 1) MX ➔ 2행(row 1) R90 = 100% ID 올클리어
const d4CrossInversionInitialBoard: D4Op[] = [
  D4.ID,   D4.MX, D4.ID,
  D4.R180, D4.MX, D4.R180,
  D4.ID,   D4.MX, D4.ID
];

const d4CrossInversionSteps = createInteractiveSteps(d4CrossInversionInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '1수: 2행 90° 시계 회전 (R90 위상 비틀림)',
    actionDescEn: 'Move 1: Row 2 Rotate 90° CW (R90 Phase Twist)',
    mathInsightKo: '중심 2행을 90° 회전시켜 수평 위상차를 수직 축과의 교차 반사 상쇄 레버리지 상태로 전환합니다.',
    mathInsightEn: 'Row 2 R90 twists horizontal phases to align with vertical axis for reflection cancellation leverage.',
    highlightCells: [3, 4, 5],
    formulaBadge: '1수: 2행 R90',
    formulaText: 'Row₂ ➔ R90',
    formulaDesc: '중심 2행 회전으로 수평 위상차를 수직 축으로 비틀어 상쇄 레버리지를 만듭니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '2수: 2열 상하 가로 반사 (MX 더블 킬)',
    actionDescEn: 'Move 2: Col 2 Horizontal Reflection (MX Double-Kill)',
    mathInsightKo: '중심 2열에 상하 반사(MX)를 가하여 상단(1) 및 하단(7) 십자 타일 동시 소거(MX ∘ MX = ID 더블 킬)!',
    mathInsightEn: 'Col 2 MX delivers a Double-Kill on top (1) and bottom (7) cross tiles via MX ∘ MX = ID!',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 MX 더블 킬',
    formulaText: 'Col₂ ➔ MX',
    formulaDesc: '2열 상하 반사로 1번과 7번 십자 타일을 동시 소거합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '3수: 2행 90° 시계 회전 (R90 트리플 킬 피니시)',
    actionDescEn: 'Move 3: Row 2 Rotate 90° CW (R90 Triple-Kill Finish)',
    mathInsightKo: '2행에 R90 추가 회전으로 중심(4)과 좌우(3, 5) 3개 타일 일제 소거(트리플 킬 폭파)! 100% ID 완전 복원!',
    mathInsightEn: 'Row 2 R90 completes the sequence with an explosive Triple-Kill on tiles 3, 4, 5, restoring 100% ID!',
    highlightCells: [3, 4, 5],
    formulaBadge: '3수: 2행 R90 트리플 킬',
    formulaText: 'Row₂ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '2행 시계 회전으로 2행 3개 타일을 일제히 폭파하여 올클리어를 완성합니다.'
  }
]);

// 26. [D4 신규 마스터 공식 12: 대각선·직교 풍차형 위상차 4수 올킬]
// 초기 보드: ['R270', 'R270', 'R270', 'MX', 'MD', 'MX', 'R270', 'R270', 'R270']
// 주대각선(main) R90 ➔ 2열(col 1) R90 ➔ 부대각선(anti) R90 ➔ 2행(row 1) MX = 100% ID 올클리어
const d4DiagonalWindmillInitialBoard: D4Op[] = [
  D4.R270, D4.R270, D4.R270,
  D4.MX,   D4.MD,   D4.MX,
  D4.R270, D4.R270, D4.R270
];

const d4DiagonalWindmillSteps = createInteractiveSteps(d4DiagonalWindmillInitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.R90,
    actionDescKo: '1수: 주대각선(↖) 90° 시계 회전 (R90 더블 킬)',
    actionDescEn: 'Move 1: Main Diag (↖) Rotate 90° CW (R90 Double-Kill)',
    mathInsightKo: '주대각선에 R90을 적용하여 0번과 8번 대각 코너 타일(R270 ∘ R90 = ID) 동시 소거(더블 킬)!',
    mathInsightEn: 'Main Diag R90 clears corners 0 and 8 simultaneously (R270 ∘ R90 = ID Double-Kill)!',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 R90 더블 킬',
    formulaText: 'Diag[main] ➔ R90',
    formulaDesc: '주대각선 시계 회전으로 0번과 8번 코너 타일을 동시 소거합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '2수: 2열 90° 시계 회전 (R90 더블 킬)',
    actionDescEn: 'Move 2: Col 2 Rotate 90° CW (R90 Double-Kill)',
    mathInsightKo: '중심 2열에 R90을 가하여 수직 십자 변인 1번과 7번 타일(R270 ∘ R90 = ID) 동시 소거(더블 킬)!',
    mathInsightEn: 'Col 2 R90 clears vertical edge tiles 1 and 7 (R270 ∘ R90 = ID Double-Kill)!',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 R90 더블 킬',
    formulaText: 'Col₂ ➔ R90',
    formulaDesc: '2열 시계 회전으로 1번과 7번 변 타일을 동시 소거합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.R90,
    actionDescKo: '3수: 부대각선(↗) 90° 시계 회전 (R90 더블 킬)',
    actionDescEn: 'Move 3: Anti Diag (↗) Rotate 90° CW (R90 Double-Kill)',
    mathInsightKo: '부대각선에 R90을 가하여 2번과 6번 반대편 대각 코너 타일(R270 ∘ R90 = ID) 동시 소거(더블 킬)! 잔여 에러를 2행(3, 4, 5)으로 집결!',
    mathInsightEn: 'Anti Diag R90 clears corners 2 and 6 (R270 ∘ R90 = ID Double-Kill), isolating errors into Row 2.',
    highlightCells: [2, 4, 6],
    formulaBadge: '3수: 부대각 R90 더블 킬',
    formulaText: 'Diag[anti] ➔ R90',
    formulaDesc: '부대각선 시계 회전으로 2번과 6번 코너 타일을 동시 소거합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '4수: 2행 상하 가로 반사 (MX 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Row 2 Horizontal Reflection (MX Triple-Kill Finish)',
    mathInsightKo: '2행에 가로 반사(MX)를 가하여 남은 중심행 타일(3, 4, 5)을 일제히 소거(트리플 킬 폭파)! 100% ID 완전 복원 All Clear!',
    mathInsightEn: 'Row 2 MX triggers an explosive Triple-Kill on Row 2 (3, 4, 5), achieving 100% All Clear!',
    highlightCells: [3, 4, 5],
    formulaBadge: '4수: 2행 MX 트리플 킬',
    formulaText: 'Row₂ ➔ MX ➔ 100% 클리어',
    formulaDesc: '2행 가로 반사로 2행 전체를 폭파하여 전 타일 올클리어를 완성합니다.'
  }
]);
'''

    if "d4CornerRingBlitzSteps" not in content:
        anchor = "const BASE_FORMULAS: FormulaItem[] = ["
        content = content.replace(anchor, steps_code + "\n" + anchor)

    # 1.2 BASE_FORMULAS 아이템 추가
    items_code = '''  {
    id: 'd4-corner-ring-blitz-4',
    titleKo: '4대 코너 링 블리츠 (0·2·6·8 외곽 순환 4수 소거)',
    titleEn: 'Corner Ring Blitz (4-Corner Outer Perimeter 4-Move Wipeout)',
    category: 'god-number',
    badgeKo: '⚡ 코너 링 4수',
    badgeEn: '⚡ Corner Ring 4M',
    difficulty: 4,
    formulaSeq: '1행 R90 ➔ 3열 R90 ➔ 3행 R90 ➔ 1열 R90 = 전 타일 올클리어',
    summaryKo: '중앙 타일(4번)은 완전한 ID를 유지하고 외곽 8개 타일이 R180/R270 위상차로 갇힌 외곽 링 병목을 [1행 R90] ➔ [3열 R90] ➔ [3행 R90] ➔ [1열 R90] 4변 둘레길 순환으로 연속 더블 킬 및 트리플 킬로 제압하는 D4 마스터 공식입니다.',
    summaryEn: 'A bottleneck where center tile 4 is solved and 8 outer perimeter tiles are trapped in R180/R270 phase splits. Solved in 4 perimeter moves: [Row 1 R90] ➔ [Col 3 R90] ➔ [Row 3 R90] ➔ [Col 1 R90] via sequential double and triple kills.',
    diagramType: 'interactive',
    steps: d4CornerRingBlitzSteps,
    latexFormula: '\\\\text{Row}_1(\\\\text{R90}) \\\\circ \\\\text{Col}_3(\\\\text{R90}) \\\\circ \\\\text{Row}_3(\\\\text{R90}) \\\\circ \\\\text{Col}_1(\\\\text{R90}) = \\\\text{ID}',
    notesKo: [
      '중앙 타일(4번)은 완벽히 보존된 채 외곽 8개 둘레길만 갇혀 있는 전형적인 코너 링 병목입니다.',
      '1행 ➔ 3열 ➔ 3행 ➔ 1열의 시계방향 둘레길 순환으로 더블 킬 2회 및 트리플 킬 1회를 연속 폭파합니다.'
    ],
    notesEn: [
      'A classic outer perimeter bottleneck with center tile intact and 8 outer tiles trapped.',
      'Clockwise perimeter sequence (Row 1 ➔ Col 3 ➔ Row 3 ➔ Col 1) triggers consecutive double and triple kills.'
    ],
    tags: ['4수', '회전', '코너', '마스터', 'D4', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-cross-inversion-3',
    titleKo: '십자 변·중심 위상 도치 3수 킬 (Cross Inversion)',
    titleEn: 'Cross Inversion (3-Move Center-Cross Phase Annihilation)',
    category: 'god-number',
    badgeKo: '✝️ 십자 도치 3수',
    badgeEn: '✝️ Cross Inversion 3M',
    difficulty: 3,
    formulaSeq: '2행 R90 ➔ 2열 MX ➔ 2행 R90 = 전 타일 올클리어',
    summaryKo: '외곽 4대 코너는 완벽한 ID를 유지한 채, 십자 5개 타일(1, 3, 4, 5, 7)만 MX 반사 및 R180 회전으로 도치된 순수 십자 패턴을 [2행 R90] ➔ [2열 MX] ➔ [2행 R90] 단 3수로 더블 킬 및 트리플 킬 종결하는 마스터 공식입니다.',
    summaryEn: 'A pure cross pattern where 4 corners are preserved and only 5 cross tiles (1, 3, 4, 5, 7) are inverted by MX and R180. Cleared in 3 swift moves: [Row 2 R90] ➔ [Col 2 MX] ➔ [Row 2 R90] via double-kill and center-row triple-kill.',
    diagramType: 'interactive',
    steps: d4CrossInversionSteps,
    latexFormula: '\\\\text{Row}_2(\\\\text{R90}) \\\\circ \\\\text{Col}_2(\\\\text{MX}) \\\\circ \\\\text{Row}_2(\\\\text{R90}) = \\\\text{ID}',
    notesKo: [
      '코너 4개 타일(0, 2, 6, 8)은 건드리지 않고 십자 5개 타일만 골라 소거하는 순수 십자 해법입니다.',
      '2행(R90) ➔ 2열(MX) ➔ 2행(R90)의 직교 샌드위치 구조로 3수 최단 올킬을 달성합니다.'
    ],
    notesEn: [
      'A pure cross resolution leaving all 4 corners completely untouched while clearing 5 cross tiles.',
      'Orthogonal sandwich structure (Row 2 R90 ➔ Col 2 MX ➔ Row 2 R90) achieves minimal 3-move victory.'
    ],
    tags: ['3수', '십자', '반사', '회전', '마스터', 'D4', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-diagonal-windmill-4',
    titleKo: '대각선·직교 풍차형 위상차 4수 올킬 (Diagonal Windmill)',
    titleEn: 'Diagonal Windmill (4-Move Diagonal-Orthogonal Phase Blitz)',
    category: 'god-number',
    badgeKo: '🌪️ 풍차 올킬 4수',
    badgeEn: '🌪️ Windmill Blitz 4M',
    difficulty: 4,
    formulaSeq: '주대각 R90 ➔ 2열 R90 ➔ 부대각 R90 ➔ 2행 MX = 전 타일 올클리어',
    summaryKo: '주대각선 반사(MD), 수평 가로 반사(MX), 회전 위상이 9개 타일 전체에 걸쳐 대각-직교 풍차 구조를 형성한 고난도 배치를 [주대각 R90] ➔ [2열 R90] ➔ [부대각 R90] ➔ [2행 MX] 4수로 연속 3회 더블 킬 및 중심행 트리플 킬로 분쇄하는 마스터 공식입니다.',
    summaryEn: 'A complex windmill pattern where diagonal reflection (MD), horizontal reflection (MX), and rotations entangle all 9 tiles. Cleared in 4 moves: [Main Diag R90] ➔ [Col 2 R90] ➔ [Anti Diag R90] ➔ [Row 2 MX] through three consecutive double-kills and a center-row triple-kill finish.',
    diagramType: 'interactive',
    steps: d4DiagonalWindmillSteps,
    latexFormula: '\\\\text{Diag}_{\\\\text{main}}(\\\\text{R90}) \\\\circ \\\\text{Col}_2(\\\\text{R90}) \\\\circ \\\\text{Diag}_{\\\\text{anti}}(\\\\text{R90}) \\\\circ \\\\text{Row}_2(\\\\text{MX}) = \\\\text{ID}',
    notesKo: [
      '주대각선 반사(MD), 수평 반사(MX), 회전이 바람개비 형태로 결합된 9개 타일 전체 위상차 패턴입니다.',
      '주대각 ➔ 2열 ➔ 부대각 ➔ 2행의 대각-직교 교차 연산으로 3연속 더블 킬 후 2행 트리플 킬로 깔끔하게 올킬합니다.'
    ],
    notesEn: [
      'A 9-tile windmill pattern coupling diagonal reflection (MD), horizontal reflection (MX), and rotations.',
      'Diagonal-orthogonal alternation (Main Diag ➔ Col 2 ➔ Anti Diag ➔ Row 2) scores 3 consecutive double-kills and a triple-kill finish.'
    ],
    tags: ['4수', '대각선', '풍차', '반사', '마스터', 'D4', '신의 수 테크닉'],
    isInteractive: true
  },'''

    if "d4-corner-ring-blitz-4" not in content:
        anchor = "id: 'd4-x-cross-3',"
        # d4-x-cross-3 공식이 끝나는 지점을 찾아서 뒤에 삽입
        target_str = "    isInteractive: true\n  },\n  {\n    id: 'master-method-3step',"
        replacement_str = "    isInteractive: true\n  },\n" + items_code + "\n  {\n    id: 'master-method-3step',"
        if target_str in content:
            content = content.replace(target_str, replacement_str)
        else:
            # fallback: BASE_FORMULAS 선언 바로 아래에 추가
            anchor = "const BASE_FORMULAS: FormulaItem[] = ["
            content = content.replace(anchor, anchor + "\n" + items_code)

    # 1.3 filterFormulas 함수 추가
    filter_func_code = '''
/**
 * 실시간 검색 및 다차원 태그 칩 필터링 함수 (명세서 5.3 준수)
 */
export function filterFormulas(
  formulas: FormulaItem[],
  query: string,
  category: FormulaCategory | 'all' = 'all',
  activeTag: string | 'all' = 'all'
): FormulaItem[] {
  const q = query.trim().toLowerCase();
  return formulas.filter((item) => {
    // 1. 카테고리 필터
    if (category !== 'all') {
      if (category === 'basics' && item.category !== 'basics') return false;
      if (category === 'beginner' && item.category !== 'beginner') return false;
      if (category === 'intermediate' && item.category !== 'intermediate') return false;
      if (category === 'advanced' && item.category !== 'advanced') return false;
      if (category === 'god-number' && item.category !== 'god-number') return false;
      if (category === 'ai-mined' && item.category !== 'ai-mined') return false;
      if (category === 'rotation' && !(item.category === 'beginner' || item.tags?.includes('회전 공식') || item.tags?.includes('회전'))) return false;
      if (category === 'reflection' && !(item.category === 'intermediate' || item.tags?.includes('반사 공식') || item.tags?.includes('반사'))) return false;
      if (category === 'godTechnique' && !(item.category === 'advanced' || item.category === 'god-number' || item.tags?.includes('신의 수 테크닉') || item.tags?.includes('신의 수'))) return false;
    }

    // 2. 태그 칩 필터
    if (activeTag !== 'all') {
      if (!item.tags || !item.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())) {
        return false;
      }
    }

    // 3. 실시간 텍스트 검색 (제목, ID, 태그, 수순, 설명 키워드)
    if (!q) return true;
    const matchTitle = (item.titleKo && item.titleKo.toLowerCase().includes(q)) ||
                       (item.titleEn && item.titleEn.toLowerCase().includes(q));
    const matchId = item.id.toLowerCase().includes(q);
    const matchSeq = item.formulaSeq && item.formulaSeq.toLowerCase().includes(q);
    const matchTags = item.tags && item.tags.some((t) => t.toLowerCase().includes(q));
    const matchSummary = (item.summaryKo && item.summaryKo.toLowerCase().includes(q)) ||
                         (item.summaryEn && item.summaryEn.toLowerCase().includes(q));
    const matchNotes = (item.notesKo && item.notesKo.some((n) => n.toLowerCase().includes(q))) ||
                       (item.notesEn && item.notesEn.some((n) => n.toLowerCase().includes(q)));

    return Boolean(matchTitle || matchId || matchSeq || matchTags || matchSummary || matchNotes);
  });
}
'''
    if "export function filterFormulas" not in content:
        content += filter_func_code

    FORMULAS_TS.write_text(content, encoding="utf-8")
    print("[SUCCESS] src/data/formulas.ts 업데이트 완료")


# ==============================================================================
# 2. src/data/minedFormulas.json 업데이트
# ==============================================================================
def update_mined_json():
    data = json.loads(MINED_JSON.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in data}

    new_items = [
        {
            "id": "d4-corner-ring-blitz-4",
            "titleKo": "4대 코너 링 블리츠 (0·2·6·8 외곽 순환 4수 소거)",
            "titleEn": "Corner Ring Blitz (4-Corner Outer Perimeter 4-Move Wipeout)",
            "category": "ai-mined",
            "badgeKo": "⚡ 코너 링 4수",
            "badgeEn": "⚡ Corner Ring 4M",
            "difficulty": 4,
            "kMoves": 4,
            "formulaSeq": "Row 1 R90 ➔ Col 3 R90 ➔ Row 3 R90 ➔ Col 1 R90",
            "summaryKo": "중앙 타일(4번)은 완전한 ID를 유지하고 외곽 8개 타일이 R180/R270 위상차로 갇힌 외곽 링 병목을 [1행 R90] ➔ [3열 R90] ➔ [3행 R90] ➔ [1열 R90] 4변 둘레길 순환으로 연속 더블 킬 및 트리플 킬로 제압하는 D4 마스터 공식입니다.",
            "summaryEn": "A bottleneck where center tile 4 is solved and 8 outer perimeter tiles are trapped in R180/R270 phase splits. Solved in 4 perimeter moves: [Row 1 R90] ➔ [Col 3 R90] ➔ [Row 3 R90] ➔ [Col 1 R90] via sequential double and triple kills.",
            "diagramType": "interactive",
            "steps": [
                {
                    "stepIndex": 0,
                    "subStep": 0,
                    "labelKo": "초기 배치 (외곽 8타일 둘레길 병목)",
                    "labelEn": "Initial State (8-Tile Outer Perimeter Bottleneck)",
                    "label": "초기 배치",
                    "boardOps": ["R180", "R270", "R180", "R270", "ID", "R270", "R180", "R270", "R180"],
                    "highlightCells": [0, 1, 2, 3, 5, 6, 7, 8],
                    "actionDescKo": "중앙 타일(4번)은 완벽히 ID로 안정되어 있고, 4개 코너(R180)와 4개 변(R270)이 외곽 링을 형성하고 있습니다.",
                    "actionDescEn": "Center tile 4 is solved, with 4 corners (R180) and 4 edges (R270) forming an outer bottleneck ring.",
                    "mathInsightKo": "외곽 8개 타일이 90°/180° 위상차로 갇혀 있는 고유 병목 패턴입니다.",
                    "mathInsightEn": "Perimeter ring bottleneck with corners at R180 and edges at R270.",
                    "formulaBadge": "초기 상태",
                    "formulaText": "Initial Board",
                    "formulaDesc": "외곽 8타일 둘레길 병목 배치"
                },
                {
                    "stepIndex": 1,
                    "subStep": 1,
                    "labelKo": "1수: 1행 90° 시계 회전 (R90 원샷 소거)",
                    "labelEn": "Move 1: Row 1 Rotate 90° CW (R90 Single-Kill)",
                    "label": "1수: 1행 90° 시계 회전 (R90)",
                    "boardOps": ["R270", "ID", "R270", "R270", "ID", "R270", "R180", "R270", "R180"],
                    "highlightCells": [0, 1, 2],
                    "highlightLine": {"type": "row", "index": 0},
                    "actionDescKo": "1행 90° 시계 회전 (R90 원샷 소거)",
                    "actionDescEn": "Row 1 Rotate 90° CW (R90 Single-Kill)",
                    "mathInsightKo": "1행에 R90을 적용하여 상단 1번 변 타일(R270 ∘ R90 = ID) 즉시 소거! 코너 타일 0, 2번은 R270으로 전이됩니다.",
                    "mathInsightEn": "Applying R90 to Row 1 clears edge tile 1 (R270 ∘ R90 = ID)! Corners 0 & 2 transition to phase R270.",
                    "formulaBadge": "1수: 1행 R90",
                    "formulaText": "Row[0] ➔ R90",
                    "formulaDesc": "1행 시계 회전으로 1번 변 타일을 즉시 소거하고 상단 코너를 정돈합니다."
                },
                {
                    "stepIndex": 2,
                    "subStep": 2,
                    "labelKo": "2수: 3열 90° 시계 회전 (R90 더블 킬)",
                    "labelEn": "Move 2: Col 3 Rotate 90° CW (R90 Double-Kill)",
                    "label": "2수: 3열 90° 시계 회전 (R90)",
                    "boardOps": ["R270", "ID", "ID", "R270", "ID", "ID", "R180", "R270", "R270"],
                    "highlightCells": [2, 5, 8],
                    "highlightLine": {"type": "col", "index": 2},
                    "actionDescKo": "3열 90° 시계 회전 (R90 더블 킬)",
                    "actionDescEn": "Col 3 Rotate 90° CW (R90 Double-Kill)",
                    "mathInsightKo": "3열에 R90을 적용하여 2번 코너와 5번 변 2개 타일을 동시 소거(더블 킬)! 외곽 포위망을 단숨에 압축합니다.",
                    "mathInsightEn": "Applying R90 to Col 3 achieves a Double-Kill on corner 2 and edge 5 (both R270 ∘ R90 = ID)!",
                    "formulaBadge": "2수: 3열 R90 더블 킬",
                    "formulaText": "Col[2] ➔ R90",
                    "formulaDesc": "3열 시계 회전으로 2번 코너와 5번 변을 동시 소거합니다."
                },
                {
                    "stepIndex": 3,
                    "subStep": 3,
                    "labelKo": "3수: 3행 90° 시계 회전 (R90 더블 킬)",
                    "labelEn": "Move 3: Row 3 Rotate 90° CW (R90 Double-Kill)",
                    "label": "3수: 3행 90° 시계 회전 (R90)",
                    "boardOps": ["R270", "ID", "ID", "R270", "ID", "ID", "R270", "ID", "ID"],
                    "highlightCells": [6, 7, 8],
                    "highlightLine": {"type": "row", "index": 2},
                    "actionDescKo": "3행 90° 시계 회전 (R90 더블 킬)",
                    "actionDescEn": "Row 3 Rotate 90° CW (R90 Double-Kill)",
                    "mathInsightKo": "3행에 R90을 적용하여 7번 변과 8번 코너 타일을 동시 소거(더블 킬)! 이제 1열 3개 타일(0, 3, 6)만 R270으로 결집됩니다.",
                    "mathInsightEn": "Applying R90 to Row 3 executes a Double-Kill on edge 7 and corner 8! Concentrates remaining errors into Column 1.",
                    "formulaBadge": "3수: 3행 R90 더블 킬",
                    "formulaText": "Row[2] ➔ R90",
                    "formulaDesc": "3행 시계 회전으로 7번 변과 8번 코너를 동시 소거합니다."
                },
                {
                    "stepIndex": 4,
                    "subStep": 4,
                    "labelKo": "4수: 1열 90° 시계 회전 (R90 트리플 킬 피니시)",
                    "labelEn": "Move 4: Col 1 Rotate 90° CW (R90 Triple-Kill Finish)",
                    "label": "4수: 1열 90° 시계 회전 (R90 피니시)",
                    "boardOps": ["ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID"],
                    "highlightCells": [0, 3, 6],
                    "highlightLine": {"type": "col", "index": 0},
                    "actionDescKo": "1열 90° 시계 회전 (R90 트리플 킬 피니시)",
                    "actionDescEn": "Col 1 Rotate 90° CW (R90 Triple-Kill Finish)",
                    "mathInsightKo": "1열에 R90을 작용시켜 0번 코너, 3번 변, 6번 코너 3개 타일 일제 소거(트리플 킬)! 100% ID 완전 복원 All Clear!",
                    "mathInsightEn": "Col 1 R90 triggers an explosive Triple-Kill on Column 1 (0, 3, 6), achieving 100% All Clear!",
                    "formulaBadge": "4수: 1열 R90 트리플 킬",
                    "formulaText": "Col[0] ➔ R90 ➔ 100% 클리어",
                    "formulaDesc": "1열 90° 회전으로 1열 전체를 폭파하여 전 타일 올클리어를 완성합니다."
                }
            ],
            "tags": ["4수", "회전", "코너", "마스터", "D4", "신의 수 테크닉"],
            "isInteractive": True,
            "notesKo": [
                "중앙 타일(4번)은 완벽히 보존된 채 외곽 8개 둘레길만 갇혀 있는 전형적인 코너 링 병목입니다.",
                "1행 ➔ 3열 ➔ 3행 ➔ 1열의 시계방향 둘레길 순환으로 더블 킬 2회 및 트리플 킬 1회를 연속 폭파합니다."
            ],
            "notesEn": [
                "A classic outer perimeter bottleneck with center tile intact and 8 outer tiles trapped.",
                "Clockwise perimeter sequence (Row 1 ➔ Col 3 ➔ Row 3 ➔ Col 1) triggers consecutive double and triple kills."
            ]
        },
        {
            "id": "d4-cross-inversion-3",
            "titleKo": "십자 변·중심 위상 도치 3수 킬 (Cross Inversion)",
            "titleEn": "Cross Inversion (3-Move Center-Cross Phase Annihilation)",
            "category": "ai-mined",
            "badgeKo": "✝️ 십자 도치 3수",
            "badgeEn": "✝️ Cross Inversion 3M",
            "difficulty": 3,
            "kMoves": 3,
            "formulaSeq": "Row 2 R90 ➔ Col 2 MX ➔ Row 2 R90",
            "summaryKo": "외곽 4대 코너는 완벽한 ID를 유지한 채, 십자 5개 타일(1, 3, 4, 5, 7)만 MX 반사 및 R180 회전으로 도치된 순수 십자 패턴을 [2행 R90] ➔ [2열 MX] ➔ [2행 R90] 단 3수로 더블 킬 및 트리플 킬 종결하는 마스터 공식입니다.",
            "summaryEn": "A pure cross pattern where 4 corners are preserved and only 5 cross tiles (1, 3, 4, 5, 7) are inverted by MX and R180. Cleared in 3 swift moves: [Row 2 R90] ➔ [Col 2 MX] ➔ [Row 2 R90] via double-kill and center-row triple-kill.",
            "diagramType": "interactive",
            "steps": [
                {
                    "stepIndex": 0,
                    "subStep": 0,
                    "labelKo": "초기 배치 (순수 십자 반사-회전 도치)",
                    "labelEn": "Initial State (Pure Cross Inversion Pattern)",
                    "label": "초기 배치",
                    "boardOps": ["ID", "MX", "ID", "R180", "MX", "R180", "ID", "MX", "ID"],
                    "highlightCells": [1, 3, 4, 5, 7],
                    "actionDescKo": "4개 코너(0, 2, 6, 8)는 완벽한 ID를 유지한 채, 십자 5개 타일만 반사 및 회전으로 도치된 순수 십자 병목입니다.",
                    "actionDescEn": "Corners are preserved while 5 cross tiles (1, 3, 4, 5, 7) are inverted in MX and R180 phases.",
                    "mathInsightKo": "순수 십자 5개 타일만 도치된 패턴으로, 코너 교란 없이 십자만 정밀 타격하는 최단 수순입니다.",
                    "mathInsightEn": "Pure cross inversion pattern solved via optimal orthogonal moves without touching corners.",
                    "formulaBadge": "초기 상태",
                    "formulaText": "Initial Board",
                    "formulaDesc": "순수 십자 반사-회전 도치 배치"
                },
                {
                    "stepIndex": 1,
                    "subStep": 1,
                    "labelKo": "1수: 2행 90° 시계 회전 (R90 위상 비틀림)",
                    "labelEn": "Move 1: Row 2 Rotate 90° CW (R90 Phase Twist)",
                    "label": "1수: 2행 90° 시계 회전 (R90)",
                    "boardOps": ["ID", "MX", "ID", "R270", "MD", "R270", "ID", "MX", "ID"],
                    "highlightCells": [3, 4, 5],
                    "highlightLine": {"type": "row", "index": 1},
                    "actionDescKo": "2행 90° 시계 회전 (R90 위상 비틀림)",
                    "actionDescEn": "Row 2 Rotate 90° CW (R90 Phase Twist)",
                    "mathInsightKo": "중심 2행을 90° 회전시켜 수평 위상차를 수직 축과의 교차 반사 상쇄 레버리지 상태로 전환합니다.",
                    "mathInsightEn": "Row 2 R90 twists horizontal phases to align with vertical axis for reflection cancellation leverage.",
                    "formulaBadge": "1수: 2행 R90",
                    "formulaText": "Row[1] ➔ R90",
                    "formulaDesc": "중심 2행 회전으로 수평 위상차를 수직 축으로 비틀어 상쇄 레버리지를 만듭니다."
                },
                {
                    "stepIndex": 2,
                    "subStep": 2,
                    "labelKo": "2수: 2열 상하 가로 반사 (MX 더블 킬)",
                    "labelEn": "Move 2: Col 2 Horizontal Reflection (MX Double-Kill)",
                    "label": "2수: 2열 상하 가로 반사 (MX)",
                    "boardOps": ["ID", "ID", "ID", "R270", "R270", "R270", "ID", "ID", "ID"],
                    "highlightCells": [1, 4, 7],
                    "highlightLine": {"type": "col", "index": 1},
                    "actionDescKo": "2열 상하 가로 반사 (MX 더블 킬)",
                    "actionDescEn": "Col 2 Horizontal Reflection (MX Double-Kill)",
                    "mathInsightKo": "중심 2열에 상하 반사(MX)를 가하여 상단(1) 및 하단(7) 십자 타일 동시 소거(MX ∘ MX = ID 더블 킬)! 4번 중심은 R270으로 동기화됩니다.",
                    "mathInsightEn": "Col 2 MX delivers a Double-Kill on top (1) and bottom (7) cross tiles via MX ∘ MX = ID; center transitions to R270.",
                    "formulaBadge": "2수: 2열 MX 더블 킬",
                    "formulaText": "Col[1] ➔ MX",
                    "formulaDesc": "2열 상하 반사로 1번과 7번 십자 타일을 동시 소거합니다."
                },
                {
                    "stepIndex": 3,
                    "subStep": 3,
                    "labelKo": "3수: 2행 90° 시계 회전 (R90 트리플 킬 피니시)",
                    "labelEn": "Move 3: Row 2 Rotate 90° CW (R90 Triple-Kill Finish)",
                    "label": "3수: 2행 90° 시계 회전 (R90 피니시)",
                    "boardOps": ["ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID"],
                    "highlightCells": [3, 4, 5],
                    "highlightLine": {"type": "row", "index": 1},
                    "actionDescKo": "2행 90° 시계 회전 (R90 트리플 킬 피니시)",
                    "actionDescEn": "Row 2 Rotate 90° CW (R90 Triple-Kill Finish)",
                    "mathInsightKo": "2행에 R90 추가 회전으로 중심(4)과 좌우(3, 5) 3개 타일 일제 소거(트리플 킬 폭파)! 100% ID 완전 복원!",
                    "mathInsightEn": "Row 2 R90 completes the sequence with an explosive Triple-Kill on tiles 3, 4, 5, restoring 100% ID!",
                    "formulaBadge": "3수: 2행 R90 트리플 킬",
                    "formulaText": "Row[1] ➔ R90 ➔ 100% 클리어",
                    "formulaDesc": "2행 시계 회전으로 2행 3개 타일을 일제히 폭파하여 올클리어를 완성합니다."
                }
            ],
            "tags": ["3수", "십자", "반사", "회전", "마스터", "D4", "신의 수 테크닉"],
            "isInteractive": True,
            "notesKo": [
                "코너 4개 타일(0, 2, 6, 8)은 건드리지 않고 십자 5개 타일만 골라 소거하는 순수 십자 해법입니다.",
                "2행(R90) ➔ 2열(MX) ➔ 2행(R90)의 직교 샌드위치 구조로 3수 최단 올킬을 달성합니다."
            ],
            "notesEn": [
                "A pure cross resolution leaving all 4 corners completely untouched while clearing 5 cross tiles.",
                "Orthogonal sandwich structure (Row 2 R90 ➔ Col 2 MX ➔ Row 2 R90) achieves minimal 3-move victory."
            ]
        },
        {
            "id": "d4-diagonal-windmill-4",
            "titleKo": "대각선·직교 풍차형 위상차 4수 올킬 (Diagonal Windmill)",
            "titleEn": "Diagonal Windmill (4-Move Diagonal-Orthogonal Phase Blitz)",
            "category": "ai-mined",
            "badgeKo": "🌪️ 풍차 올킬 4수",
            "badgeEn": "🌪️ Windmill Blitz 4M",
            "difficulty": 4,
            "kMoves": 4,
            "formulaSeq": "Diag Main R90 ➔ Col 2 R90 ➔ Diag Anti R90 ➔ Row 2 MX",
            "summaryKo": "주대각선 반사(MD), 수평 가로 반사(MX), 회전 위상이 9개 타일 전체에 걸쳐 대각-직교 풍차 구조를 형성한 고난도 배치를 [주대각 R90] ➔ [2열 R90] ➔ [부대각 R90] ➔ [2행 MX] 4수로 연속 3회 더블 킬 및 중심행 트리플 킬로 분쇄하는 마스터 공식입니다.",
            "summaryEn": "A complex windmill pattern where diagonal reflection (MD), horizontal reflection (MX), and rotations entangle all 9 tiles. Cleared in 4 moves: [Main Diag R90] ➔ [Col 2 R90] ➔ [Anti Diag R90] ➔ [Row 2 MX] through three consecutive double-kills and a center-row triple-kill finish.",
            "diagramType": "interactive",
            "steps": [
                {
                    "stepIndex": 0,
                    "subStep": 0,
                    "labelKo": "초기 배치 (대각-직교 풍차형 위상차)",
                    "labelEn": "Initial State (Diagonal-Orthogonal Windmill Dilemma)",
                    "label": "초기 배치",
                    "boardOps": ["R270", "R270", "R270", "MX", "MD", "MX", "R270", "R270", "R270"],
                    "highlightCells": [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    "actionDescKo": "9개 전 타일에 주대각선 반사(MD), 수평 반사(MX), 회전 위상이 풍차형으로 얽혀 있는 최고난도 병목입니다.",
                    "actionDescEn": "A complex dilemma where all 9 tiles are entangled with diagonal reflection (MD), orthogonal reflection (MX), and rotations.",
                    "mathInsightKo": "주대각선 반사와 직교 반사, 회전 위상이 전 타일에 걸쳐 바람개비형으로 결합된 고차원 병목입니다.",
                    "mathInsightEn": "High-order windmill dilemma coupling diagonal reflection (MD) and horizontal reflections (MX).",
                    "formulaBadge": "초기 상태",
                    "formulaText": "Initial Board",
                    "formulaDesc": "대각-직교 풍차형 위상차 배치"
                },
                {
                    "stepIndex": 1,
                    "subStep": 1,
                    "labelKo": "1수: 주대각선(↖) 90° 시계 회전 (R90 더블 킬)",
                    "labelEn": "Move 1: Main Diag (↖) Rotate 90° CW (R90 Double-Kill)",
                    "label": "1수: 주대각선(↖) 90° 회전 (R90)",
                    "boardOps": ["ID", "R270", "R270", "MX", "MY", "MX", "R270", "R270", "ID"],
                    "highlightCells": [0, 4, 8],
                    "highlightLine": {"type": "diag", "index": "main"},
                    "actionDescKo": "주대각선(↖) 90° 시계 회전 (R90 더블 킬)",
                    "actionDescEn": "Main Diag (↖) Rotate 90° CW (R90 Double-Kill)",
                    "mathInsightKo": "주대각선에 R90을 적용하여 0번과 8번 대각 코너 타일(R270 ∘ R90 = ID) 동시 소거(더블 킬)! 4번 중심은 MY로 전이됩니다.",
                    "mathInsightEn": "Main Diag R90 clears corners 0 and 8 simultaneously (R270 ∘ R90 = ID Double-Kill); center transitions to MY.",
                    "formulaBadge": "1수: 주대각 R90 더블 킬",
                    "formulaText": "Diag[main] ➔ R90",
                    "formulaDesc": "주대각선 시계 회전으로 0번과 8번 코너 타일을 동시 소거합니다."
                },
                {
                    "stepIndex": 2,
                    "subStep": 2,
                    "labelKo": "2수: 2열 90° 시계 회전 (R90 더블 킬)",
                    "labelEn": "Move 2: Col 2 Rotate 90° CW (R90 Double-Kill)",
                    "label": "2수: 2열 90° 시계 회전 (R90)",
                    "boardOps": ["ID", "ID", "R270", "MX", "MAD", "MX", "R270", "ID", "ID"],
                    "highlightCells": [1, 4, 7],
                    "highlightLine": {"type": "col", "index": 1},
                    "actionDescKo": "2열 90° 시계 회전 (R90 더블 킬)",
                    "actionDescEn": "Col 2 Rotate 90° CW (R90 Double-Kill)",
                    "mathInsightKo": "중심 2열에 R90을 가하여 수직 십자 변인 1번과 7번 타일(R270 ∘ R90 = ID) 동시 소거(더블 킬)! 중심은 MAD로 전환됩니다.",
                    "mathInsightEn": "Col 2 R90 clears vertical edge tiles 1 and 7 (R270 ∘ R90 = ID Double-Kill); center transitions to MAD.",
                    "formulaBadge": "2수: 2열 R90 더블 킬",
                    "formulaText": "Col[1] ➔ R90",
                    "formulaDesc": "2열 시계 회전으로 1번과 7번 변 타일을 동시 소거합니다."
                },
                {
                    "stepIndex": 3,
                    "subStep": 3,
                    "labelKo": "3수: 부대각선(↗) 90° 시계 회전 (R90 더블 킬)",
                    "labelEn": "Move 3: Anti Diag (↗) Rotate 90° CW (R90 Double-Kill)",
                    "label": "3수: 부대각선(↗) 90° 회전 (R90)",
                    "boardOps": ["ID", "ID", "ID", "MX", "MX", "MX", "ID", "ID", "ID"],
                    "highlightCells": [2, 4, 6],
                    "highlightLine": {"type": "diag", "index": "anti"},
                    "actionDescKo": "부대각선(↗) 90° 시계 회전 (R90 더블 킬)",
                    "actionDescEn": "Anti Diag (↗) Rotate 90° CW (R90 Double-Kill)",
                    "mathInsightKo": "부대각선에 R90을 가하여 2번과 6번 반대편 대각 코너 타일(R270 ∘ R90 = ID) 동시 소거(더블 킬)! 중심 타일이 MX로 동기화되어 2행(3, 4, 5) 전체가 순수 MX로 완성!",
                    "mathInsightEn": "Anti Diag R90 clears corners 2 and 6 (R270 ∘ R90 = ID Double-Kill); synchronizes Row 2 (3, 4, 5) into pure MX.",
                    "formulaBadge": "3수: 부대각 R90 더블 킬",
                    "formulaText": "Diag[anti] ➔ R90",
                    "formulaDesc": "부대각선 시계 회전으로 2번과 6번 코너 타일을 동시 소거합니다."
                },
                {
                    "stepIndex": 4,
                    "subStep": 4,
                    "labelKo": "4수: 2행 상하 가로 반사 (MX 트리플 킬 피니시)",
                    "labelEn": "Move 4: Row 2 Horizontal Reflection (MX Triple-Kill Finish)",
                    "label": "4수: 2행 상하 가로 반사 (MX 피니시)",
                    "boardOps": ["ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID"],
                    "highlightCells": [3, 4, 5],
                    "highlightLine": {"type": "row", "index": 1},
                    "actionDescKo": "2행 상하 가로 반사 (MX 트리플 킬 피니시)",
                    "actionDescEn": "Row 2 Horizontal Reflection (MX Triple-Kill Finish)",
                    "mathInsightKo": "2행에 가로 반사(MX)를 가하여 남은 중심행 타일(3, 4, 5)을 일제히 소거(트리플 킬 폭파)! 100% ID 완전 복원 All Clear!",
                    "mathInsightEn": "Row 2 MX triggers an explosive Triple-Kill on Row 2 (3, 4, 5), achieving 100% All Clear!",
                    "formulaBadge": "4수: 2행 MX 트리플 킬",
                    "formulaText": "Row[1] ➔ MX ➔ 100% 클리어",
                    "formulaDesc": "2행 가로 반사로 2행 전체를 폭파하여 전 타일 올클리어를 완성합니다."
                }
            ],
            "tags": ["4수", "대각선", "풍차", "반사", "마스터", "D4", "신의 수 테크닉"],
            "isInteractive": True,
            "notesKo": [
                "주대각선 반사(MD), 수평 반사(MX), 회전이 바람개비 형태로 결합된 9개 타일 전체 위상차 패턴입니다.",
                "주대각 ➔ 2열 ➔ 부대각 ➔ 2행의 대각-직교 교차 연산으로 3연속 더블 킬 후 2행 트리플 킬로 깔끔하게 올킬합니다."
            ],
            "notesEn": [
                "A 9-tile windmill pattern coupling diagonal reflection (MD), horizontal reflection (MX), and rotations.",
                "Diagonal-orthogonal alternation (Main Diag ➔ Col 2 ➔ Anti Diag ➔ Row 2) scores 3 consecutive double-kills and a triple-kill finish."
            ]
        }
    ]

    for item in new_items:
        if item["id"] not in existing_ids:
            data.append(item)

    MINED_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[SUCCESS] src/data/minedFormulas.json 업데이트 완료 (총 {len(data)}개 공식)")


# ==============================================================================
# 3. src/i18n/translations.ts 업데이트
# ==============================================================================
def update_translations_ts():
    content = TRANSLATIONS_TS.read_text(encoding="utf-8")

    # 3.1 영어 번역 추가
    en_new_keys = '''    // Formula Search & Filters (Round 5)
    'formula.searchPlaceholder': 'Search formulas by name, ID, moves, or tags...',
    'formula.searchEmptyMsg': 'No matching formulas found. Try a different keyword.',
    'formula.searchClearBtn': 'Clear search',
    'formula.tagAll': 'All',

    // Round 5 Master Formulas 3 (en)
    'formula.item.d4CornerRingBlitz4.title': 'Corner Ring Blitz (4-Corner Outer Perimeter 4-Move Wipeout)',
    'formula.item.d4CornerRingBlitz4.subtitle': 'Clockwise perimeter sequence of 4 R90 rotations wiping out all 8 outer tiles',
    'formula.item.d4CornerRingBlitz4.desc': 'A perimeter ring bottleneck where center tile 4 is solved and 8 outer tiles are trapped in R180/R270 phase splits. Solved in 4 perimeter moves: [Row 1 R90] ➔ [Col 3 R90] ➔ [Row 3 R90] ➔ [Col 1 R90] via sequential double and triple kills.',
    'formula.item.d4CornerRingBlitz4.tip': 'Cycles clockwise along the outer perimeter (Row 1 ➔ Col 3 ➔ Row 3 ➔ Col 1) to execute consecutive double-kills and a triple-kill finish.',
    'formula.item.d4CornerRingBlitz4.step0': 'Initial State: Center tile 4 intact with 8 outer perimeter tiles in R180/R270 phase splits',
    'formula.item.d4CornerRingBlitz4.step1': 'Move 1: Row 1 R90 ➔ Top edge tile 1 clears via R270 ∘ R90 = ID (Single-Kill)',
    'formula.item.d4CornerRingBlitz4.step2': 'Move 2: Col 3 R90 ➔ Corner 2 and edge 5 cleared simultaneously via R270 ∘ R90 = ID (Double-Kill)',
    'formula.item.d4CornerRingBlitz4.step3': 'Move 3: Row 3 R90 ➔ Edge 7 and corner 8 cleared (Double-Kill); isolates Column 1 into R270 phase',
    'formula.item.d4CornerRingBlitz4.step4': 'Move 4: Col 1 R90 ➔ Column 1 (0, 3, 6) wiped simultaneously via R270 ∘ R90 = ID (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4CrossInversion3.title': 'Cross Inversion (3-Move Center-Cross Phase Annihilation)',
    'formula.item.d4CrossInversion3.subtitle': 'Orthogonal sandwich sequence resolving 5 cross tiles while preserving all 4 corners',
    'formula.item.d4CrossInversion3.desc': 'A pure cross pattern where 4 corners are preserved and only 5 cross tiles (1, 3, 4, 5, 7) are inverted by MX and R180. Cleared in 3 swift moves: [Row 2 R90] ➔ [Col 2 MX] ➔ [Row 2 R90] via double-kill and center-row triple-kill.',
    'formula.item.d4CrossInversion3.tip': 'Orthogonal sandwich (Row 2 R90 ➔ Col 2 MX ➔ Row 2 R90) isolates and annihilates all 5 cross tiles in just 3 moves without touching corners.',
    'formula.item.d4CrossInversion3.step0': 'Initial State: 4 corners preserved with 5 cross tiles inverted in MX and R180 phases',
    'formula.item.d4CrossInversion3.step1': 'Move 1: Row 2 R90 ➔ Twists horizontal phases into vertical reflection alignment',
    'formula.item.d4CrossInversion3.step2': 'Move 2: Col 2 MX ➔ Top (1) and bottom (7) cross tiles cleared via MX ∘ MX = ID (Double-Kill)',
    'formula.item.d4CrossInversion3.step3': 'Move 3: Row 2 R90 ➔ Row 2 tiles (3, 4, 5) wiped simultaneously via R270 ∘ R90 = ID (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4DiagonalWindmill4.title': 'Diagonal Windmill (4-Move Diagonal-Orthogonal Phase Blitz)',
    'formula.item.d4DiagonalWindmill4.subtitle': 'Alternating diagonal and orthogonal moves collapsing complex windmill phase splits',
    'formula.item.d4DiagonalWindmill4.desc': 'A complex windmill pattern where diagonal reflection (MD), horizontal reflection (MX), and rotations entangle all 9 tiles. Cleared in 4 moves: [Main Diag R90] ➔ [Col 2 R90] ➔ [Anti Diag R90] ➔ [Row 2 MX] through three consecutive double-kills and a center-row triple-kill finish.',
    'formula.item.d4DiagonalWindmill4.tip': 'Alternating diagonal and orthogonal operations (Main Diag ➔ Col 2 ➔ Anti Diag ➔ Row 2) scores 3 consecutive double-kills followed by a clean Row 2 triple-kill finish.',
    'formula.item.d4DiagonalWindmill4.step0': 'Initial State: All 9 tiles entangled in diagonal-orthogonal windmill phase splits',
    'formula.item.d4DiagonalWindmill4.step1': 'Move 1: Main Diag R90 ➔ Corners 0 and 8 cleared simultaneously via R270 ∘ R90 = ID (Double-Kill)',
    'formula.item.d4DiagonalWindmill4.step2': 'Move 2: Col 2 R90 ➔ Vertical edges 1 and 7 cleared simultaneously via R270 ∘ R90 = ID (Double-Kill)',
    'formula.item.d4DiagonalWindmill4.step3': 'Move 3: Anti Diag R90 ➔ Opposite corners 2 and 6 cleared (Double-Kill); isolates Row 2 into pure MX phase',
    'formula.item.d4DiagonalWindmill4.step4': 'Move 4: Row 2 MX ➔ Row 2 tiles (3, 4, 5) wiped simultaneously via MX ∘ MX = ID (Triple-Kill Finish), 100% all-clear!',
'''

    # 3.2 한국어 번역 추가
    ko_new_keys = '''    // 공식 실시간 검색 & 태그 필터 (Round 5)
    'formula.searchPlaceholder': '공식 이름, 번호, 태그, 수순 실시간 검색...',
    'formula.searchEmptyMsg': '검색 결과와 일치하는 공식이 없습니다. 다른 키워드를 입력해 보세요.',
    'formula.searchClearBtn': '검색어 지우기',
    'formula.tagAll': '전체',

    // Round 5 신규 D4 마스터 공식 3선 (ko)
    'formula.item.d4CornerRingBlitz4.title': '4대 코너 링 블리츠 (0·2·6·8 외곽 순환 4수 소거)',
    'formula.item.d4CornerRingBlitz4.subtitle': '외곽 둘레길 4개 라인의 시계방향 90° 순환 펄스로 외곽 8개 타일 완전 정복',
    'formula.item.d4CornerRingBlitz4.desc': '중앙 타일(4번)은 완전한 ID를 유지하고 외곽 8개 타일이 R180/R270 위상차로 갇힌 외곽 링 병목을 [1행 R90] ➔ [3열 R90] ➔ [3행 R90] ➔ [1열 R90] 4변 둘레길 순환으로 연속 더블 킬 및 트리플 킬로 제압하는 D4 마스터 공식입니다.',
    'formula.item.d4CornerRingBlitz4.tip': '1행 ➔ 3열 ➔ 3행 ➔ 1열의 시계방향 둘레길을 순환하며 더블 킬 2회 및 트리플 킬 1회를 연속 폭파하여 올클리어를 달성합니다.',
    'formula.item.d4CornerRingBlitz4.step0': '초기 상태: 중앙 타일(4) 보존, 외곽 8개 둘레길 타일이 R180/R270 위상차로 포위된 링 병목',
    'formula.item.d4CornerRingBlitz4.step1': '1수: 1행 90° 시계 회전 (R90) ➔ 1번 변 타일 R270 ∘ R90 = ID 원샷 소거, 상단 코너 R270 치환',
    'formula.item.d4CornerRingBlitz4.step2': '2수: 3열 90° 시계 회전 (R90 더블 킬) ➔ 2번 코너, 5번 변 동시 소거 (더블 킬!)',
    'formula.item.d4CornerRingBlitz4.step3': '3수: 3행 90° 시계 회전 (R90 더블 킬) ➔ 7번 변, 8번 코너 동시 소거 (더블 킬!), 1열 R270 집결',
    'formula.item.d4CornerRingBlitz4.step4': '4수: 1열 90° 시계 회전 (R90 트리플 킬 피니시) ➔ 0번, 3번, 6번 3개 타일 일제 소거 (트리플 킬 폭파!), 100% All Clear!',

    'formula.item.d4CrossInversion3.title': '십자 변·중심 위상 도치 3수 킬 (Cross Inversion)',
    'formula.item.d4CrossInversion3.subtitle': '4대 코너를 건드리지 않고 십자 5개 타일만 직교 샌드위치로 3수 번개 소거',
    'formula.item.d4CrossInversion3.desc': '외곽 4대 코너는 완벽한 ID를 유지한 채, 십자 5개 타일(1, 3, 4, 5, 7)만 MX 반사 및 R180 회전으로 도치된 순수 십자 패턴을 [2행 R90] ➔ [2열 MX] ➔ [2행 R90] 단 3수로 더블 킬 및 트리플 킬 종결하는 마스터 공식입니다.',
    'formula.item.d4CrossInversion3.tip': '코너 4개는 보존한 채 2행(R90) ➔ 2열(MX) ➔ 2행(R90)의 직교 샌드위치 구조로 3수 최단 올킬을 달성합니다.',
    'formula.item.d4CrossInversion3.step0': '초기 상태: 외곽 4대 코너 100% 보존, 십자 5개 타일만 MX/R180으로 도치된 순수 십자 병목',
    'formula.item.d4CrossInversion3.step1': '1수: 2행 90° 시계 회전 (R90) ➔ 수평 위상차를 수직 축과의 교차 반사 상쇄 레버리지 상태로 전환',
    'formula.item.d4CrossInversion3.step2': '2수: 2열 상하 가로 반사 (MX 더블 킬) ➔ 상단 1번 및 하단 7번 십자 타일 동시 소거 (더블 킬!)',
    'formula.item.d4CrossInversion3.step3': '3수: 2행 90° 시계 회전 (R90 트리플 킬 피니시) ➔ 3번, 4번, 5번 중심행 타일 일제 소거 (트리플 킬 폭파!), 100% All Clear!',

    'formula.item.d4DiagonalWindmill4.title': '대각선·직교 풍차형 위상차 4수 올킬 (Diagonal Windmill)',
    'formula.item.d4DiagonalWindmill4.subtitle': '대각선과 직교 라인의 교차 순환으로 3연속 더블 킬 및 2행 트리플 킬 4수 제압',
    'formula.item.d4DiagonalWindmill4.desc': '주대각선 반사(MD), 수평 가로 반사(MX), 회전 위상이 9개 타일 전체에 걸쳐 대각-직교 풍차 구조를 형성한 고난도 배치를 [주대각 R90] ➔ [2열 R90] ➔ [부대각 R90] ➔ [2행 MX] 4수로 연속 3회 더블 킬 및 중심행 트리플 킬로 분쇄하는 마스터 공식입니다.',
    'formula.item.d4DiagonalWindmill4.tip': '대각선과 직교 라인을 번갈아 조작(주대각 ➔ 2열 ➔ 부대각 ➔ 2행)하여 3연속 더블 킬 후 2행 트리플 킬로 올킬합니다.',
    'formula.item.d4DiagonalWindmill4.step0': '초기 상태: 전 9개 타일에 걸쳐 주대각선 반사, 수평 반사, 회전 위상이 결합된 풍차형 배치',
    'formula.item.d4DiagonalWindmill4.step1': '1수: 주대각선(↖) 90° 시계 회전 (R90 더블 킬) ➔ 0번 및 8번 대각 코너 타일 동시 소거 (더블 킬!)',
    'formula.item.d4DiagonalWindmill4.step2': '2수: 2열 90° 시계 회전 (R90 더블 킬) ➔ 1번 및 7번 수직 십자 변 타일 동시 소거 (더블 킬!)',
    'formula.item.d4DiagonalWindmill4.step3': '3수: 부대각선(↗) 90° 시계 회전 (R90 더블 킬) ➔ 2번 및 6번 반대편 대각 코너 타일 동시 소거 (더블 킬!), 2행 MX 집결',
    'formula.item.d4DiagonalWindmill4.step4': '4수: 2행 상하 가로 반사 (MX 트리플 킬 피니시) ➔ 3번, 4번, 5번 중심행 타일 일제 소거 (트리플 킬 폭파!), 100% All Clear!',
'''

    if "'formula.item.d4CornerRingBlitz4.title'" not in content:
        # en 섹션 삽입
        en_anchor = "    'formula.item.d4ChiralPinwheel4.step4': 'Move 4: Col 1 MX ➔ Column 1 (0, 3, 6) wiped simultaneously via MX ∘ MX = ID (Triple-Kill Finish), 100% all-clear!'"
        content = content.replace(en_anchor, en_anchor + "\n\n" + en_new_keys)

        # ko 섹션 삽입
        ko_anchor = "    'formula.item.d4ChiralPinwheel4.step4': '4수: 1열 상하 가로 반사 (MX 피니시) ➔ 1열 전체(0, 3, 6번) MX ∘ MX = ID 트리플 킬 폭파!, 100% 올클리어 완성!'"
        content = content.replace(ko_anchor, ko_anchor + "\n\n" + ko_new_keys)

    TRANSLATIONS_TS.write_text(content, encoding="utf-8")
    print("[SUCCESS] src/i18n/translations.ts 업데이트 완료")


if __name__ == "__main__":
    update_formulas_ts()
    update_mined_json()
    update_translations_ts()
    print("Round 5 마스터 공식 및 i18n 데이터 주입 완료!")
