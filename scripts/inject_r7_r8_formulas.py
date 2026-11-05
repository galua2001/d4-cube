# -*- coding: utf-8 -*-
import json
import re

formulas_path = r'C:\Users\user\matrix-cube\src\data\formulas.ts'
mined_path = r'C:\Users\user\matrix-cube\src\data\minedFormulas.json'

with open(formulas_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. 스텝 정의 생성
steps_code = """
// 30. [Round 7 마스터 공식 16: 코너 연 플럭스 4수 소거]
// 초기 보드: ['MX', 'ID', 'ID', 'ID', 'ID', 'MX', 'ID', 'MX', 'MX']
// 주대각선(main) MX ➔ 부대각선(anti) MX ➔ 3열(col 2) MX ➔ 3행(row 2) MX = 100% ID 올클리어
const d4CornerKiteFluxInitialBoard: D4Op[] = [
  D4.MX, D4.ID, D4.ID,
  D4.ID, D4.ID, D4.MX,
  D4.ID, D4.MX, D4.MX
];

const d4CornerKiteFluxSteps = createInteractiveSteps(d4CornerKiteFluxInitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MX,
    actionDescKo: '1수: 주대각선(↖) 가로축 반사 (MX 더블 킬)',
    actionDescEn: 'Move 1: Main Diag (↖) Reflection (MX Double-Kill)',
    mathInsightKo: '0번과 8번 코너 타일에 MX를 합성하여 즉시 ID로 동시 소거(Double Cancel)하고, 중심 4번을 임시 매개 상태로 만듭니다.',
    mathInsightEn: 'Applies MX to the main diagonal, instantly double-cancelling corner tiles 0 and 8 to ID while transitioning center tile 4.',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 MX',
    formulaText: 'Diag[main] ➔ MX',
    formulaDesc: '0번·8번 코너 동시 소거'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.MX,
    actionDescKo: '2수: 부대각선(↗) 가로축 반사 (MX 중심 소거)',
    actionDescEn: 'Move 2: Anti Diag (↗) Reflection (MX Center Clear)',
    mathInsightKo: '중심 4번의 MX를 ID로 소거하고, 외곽 반사 위상을 직교 스위프가 가능한 형태로 위상 분배합니다.',
    mathInsightEn: 'Clears center tile 4 back to ID and distributes phases across the perimeter for orthogonal alignment.',
    highlightCells: [2, 4, 6],
    formulaBadge: '2수: 부대각 MX',
    formulaText: 'Diag[anti] ➔ MX',
    formulaDesc: '중심 4번 소거 및 직교 위상 정렬'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.MX,
    actionDescKo: '3수: 3열 세로축 가로 반사 (MX 더블 킬)',
    actionDescEn: 'Move 3: Col 3 Horizontal Reflection (MX Double-Kill)',
    mathInsightKo: '3열에 위치한 2번과 5번 타일의 MX 위상을 일격에 소거! 이제 보드에는 마지막 3행(6, 7, 8)만 남습니다.',
    mathInsightEn: 'Clears tiles 2 and 5 in Col 3 simultaneously! Only Row 3 (cells 6, 7, 8) remains.',
    highlightCells: [2, 5, 8],
    formulaBadge: '3수: 3열 MX',
    formulaText: 'Col₃ ➔ MX',
    formulaDesc: '2번·5번 타일 더블 킬 소거'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.MX,
    actionDescKo: '4수: 3행 가로축 반사 (MX 트리플 킬 종결)',
    actionDescEn: 'Move 4: Row 3 Horizontal Reflection (MX Triple-Kill Finale)',
    mathInsightKo: '3행의 6, 7, 8번 타일 전체를 단 한 번의 스트라이크로 트리플 킬(Triple Cancel)! 4수만에 100% ID 완성!',
    mathInsightEn: 'Triple-cancels tiles 6, 7, 8 on Row 3 in a single strike! 100% ID achieved in exactly 4 moves!',
    highlightCells: [6, 7, 8],
    formulaBadge: '4수: 3행 MX 피니시',
    formulaText: 'Row₃ ➔ MX ➔ 100% 클리어',
    formulaDesc: '3행 트리플 킬로 100% 완전 정복'
  }
]);

// 31. [Round 7 마스터 공식 17: 십자 변 & 대각 반사 오메가 3수 킬]
// 초기 보드: ['MD', 'MAD', 'ID', 'MAD', 'MD', 'MAD', 'ID', 'MAD', 'MD']
// 2행(row 1) MAD ➔ 2열(col 1) MAD ➔ 주대각선(main) MD = 100% ID 올클리어
const d4PlusOmegaCrossInitialBoard: D4Op[] = [
  D4.MD,  D4.MAD, D4.ID,
  D4.MAD, D4.MD,  D4.MAD,
  D4.ID,  D4.MAD, D4.MD
];

const d4PlusOmegaCrossSteps = createInteractiveSteps(d4PlusOmegaCrossInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.MAD,
    actionDescKo: '1수: 2행 부대각 반사 (MAD 더블 킬)',
    actionDescEn: 'Move 1: Row 2 Anti-Diagonal Reflection (MAD Double-Kill)',
    mathInsightKo: '좌우 십자 변(3, 5번)의 MAD를 즉시 더블 킬 소거하고, 중심 타일(4번)은 MD ∘ MAD = R180으로 변환됩니다.',
    mathInsightEn: 'Instantly double-cancels left/right cross edges 3 and 5, while center tile 4 transitions from MD ∘ MAD to R180.',
    highlightCells: [3, 4, 5],
    formulaBadge: '1수: 2행 MAD',
    formulaText: 'Row₂ ➔ MAD',
    formulaDesc: '좌우 십자 변 즉시 동시 소거'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MAD,
    actionDescKo: '2수: 2열 부대각 반사 (MAD 더블 킬 & 주대각 동기화)',
    actionDescEn: 'Move 2: Col 2 Anti-Diagonal Reflection (MAD Double-Kill & Sync)',
    mathInsightKo: '상하 십자 변(1, 7번)의 MAD를 마저 소거하고, 중심 타일(4번)은 R180 ∘ MAD = MD로 정렬되어 주대각선 전체가 완벽한 MD 단일 위상으로 정렬됩니다!',
    mathInsightEn: 'Cancels remaining cross edges 1 and 7, while center tile transitions to MD, perfectly synchronizing the entire main diagonal to MD!',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 MAD',
    formulaText: 'Col₂ ➔ MAD',
    formulaDesc: '상하 십자 변 완제 및 주대각선 MD 동기화'
  },
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MD,
    actionDescKo: '3수: 주대각선 (↖) 주대각 반사 (MD 트리플 킬 종결)',
    actionDescEn: 'Move 3: Main Diag (↖) Reflection (MD Triple-Kill Finale)',
    mathInsightKo: 'MD ∘ MD = ID 자기상쇄의 법칙(Involution)에 따라 주대각선의 0, 4, 8번 타일이 일격에 동시 소거되며 100% 클리어 완성!',
    mathInsightEn: 'By the law of involution (MD ∘ MD = ID), tiles 0, 4, 8 vanish simultaneously into ID, completing the 3-move kill!',
    highlightCells: [0, 4, 8],
    formulaBadge: '3수: 주대각 MD 피니시',
    formulaText: 'Diag[main] ➔ MD ➔ 100% 클리어',
    formulaDesc: '주대각선 트리플 킬로 퍼즐 완전 종결'
  }
]);

// 32. [Round 7 마스터 공식 18: 초입방체 외곽 프레임 4수 종결 공식]
// 초기 보드: ['R180', 'R270', 'R180', 'R270', 'ID', 'R270', 'R180', 'R270', 'R180']
// 1행(row 0) R90 ➔ 3행(row 2) R90 ➔ 1열(col 0) R90 ➔ 3열(col 2) R90 = 100% ID 올클리어
const d4HyperCubeFrameInitialBoard: D4Op[] = [
  D4.R180, D4.R270, D4.R180,
  D4.R270, D4.ID,   D4.R270,
  D4.R180, D4.R270, D4.R180
];

const d4HyperCubeFrameSteps = createInteractiveSteps(d4HyperCubeFrameInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1수: 1행 90° 시계 회전 (R90 원샷 소거)',
    actionDescEn: 'Move 1: Row 1 Rotate 90° CW (R90 Single-Kill)',
    mathInsightKo: '상단 엣지(1번)는 R270 ∘ R90 = ID로 즉시 소거되고, 0번과 2번 코너는 R270으로 변환됩니다.',
    mathInsightEn: 'Top edge 1 is cleared to ID (R270 ∘ R90 = ID), while corners 0 and 2 transition to R270.',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 1행 R90',
    formulaText: 'Row₁ ➔ R90',
    formulaDesc: '1번 엣지 소거 및 0·2번 코너 R270 정렬'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '2수: 3행 90° 시계 회전 (R90 원샷 소거 & 양 외곽열 동기화)',
    actionDescEn: 'Move 2: Row 3 Rotate 90° CW (R90 Single-Kill & Col Sync)',
    mathInsightKo: '하단 엣지(7번)가 ID로 소거되며, 6번과 8번 코너가 R270으로 변환됩니다. 이제 1열과 3열의 6개 타일이 모두 R270으로 완벽 동기화되었습니다!',
    mathInsightEn: 'Bottom edge 7 is cleared to ID, corners 6 and 8 become R270. All 6 tiles in Col 1 and Col 3 are now fully synchronized to R270!',
    highlightCells: [6, 7, 8],
    formulaBadge: '2수: 3행 R90',
    formulaText: 'Row₃ ➔ R90',
    formulaDesc: '7번 엣지 소거 및 양 외곽열 R270 동기화'
  },
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '3수: 1열 90° 시계 회전 (R90 트리플 킬 폭파)',
    actionDescEn: 'Move 3: Col 1 Rotate 90° CW (R90 Triple-Kill)',
    mathInsightKo: '1열 전체(0, 3, 6번)가 R270 ∘ R90 = ID로 단 한 번의 스트라이크로 트리플 킬(Triple Cancel) 소거됩니다!',
    mathInsightEn: 'Entire Col 1 (cells 0, 3, 6) is wiped out to pure ID in a single strike (Triple Cancel)!',
    highlightCells: [0, 3, 6],
    formulaBadge: '3수: 1열 R90 트리플 킬',
    formulaText: 'Col₁ ➔ R90',
    formulaDesc: '1열 3개 타일 트리플 킬 동시 소거'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '4수: 3열 90° 시계 회전 (R90 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Col 3 Rotate 90° CW (R90 Triple-Kill Finish)',
    mathInsightKo: '마지막 남은 3열(2, 5, 8번)의 3개 타일이 일괄 ID로 소거되며 외곽 프레임 8타일 퍼즐이 단 4수만에 종결됩니다!',
    mathInsightEn: 'The remaining 3 tiles on Col 3 (cells 2, 5, 8) vanish into ID simultaneously, completing the grand 4-move frame finale!',
    highlightCells: [2, 5, 8],
    formulaBadge: '4수: 3열 R90 피니시',
    formulaText: 'Col₃ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '3열 트리플 킬로 외곽 프레임 완전 종결'
  }
]);

// 33. [Round 8 마스터 공식 19: D4 지그재그 대각 소거 4수 공식]
// 초기 보드: ['MY', 'MX', 'ID', 'ID', 'MY', 'ID', 'ID', 'MX', 'MY']
// 주대각선(main) R180 ➔ 부대각선(anti) MX ➔ 3행(row 2) MX ➔ 1행(row 0) MX = 100% ID 올클리어
const d4ZigzagDiagonalFlushInitialBoard: D4Op[] = [
  D4.MY, D4.MX, D4.ID,
  D4.ID, D4.MY, D4.ID,
  D4.ID, D4.MX, D4.MY
];

const d4ZigzagDiagonalFlushSteps = createInteractiveSteps(d4ZigzagDiagonalFlushInitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.R180,
    actionDescKo: '1수: 주대각선(↖) 180° 회전 (R180 코너·중심 반전 정렬)',
    actionDescEn: 'Move 1: Main Diag (↖) Rotate 180° (R180 Corner & Center Alignment)',
    mathInsightKo: '주대각선 {0,4,8}에 R180 적용: MY ∘ R180 = MX로 변환되어 지그재그 축이 MX 단일 위상으로 정렬됩니다.',
    mathInsightEn: 'Applying R180 to Main Diag converts MY ∘ R180 = MX, aligning the zigzag path into MX phase.',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 R180',
    formulaText: 'Diag[main] ➔ R180',
    formulaDesc: '주대각선 180° 회전으로 지그재그 축을 MX로 정렬합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.MX,
    actionDescKo: '2수: 부대각선(↗) 상하 반사 (중심 4번 소거 및 상하 분배)',
    actionDescEn: 'Move 2: Anti Diag (↗) Horizontal Reflection (Center Clear & Orthogonal Sync)',
    mathInsightKo: '부대각선 {2,4,6}에 MX 적용: 중심(4)이 MX ∘ MX = ID로 소거되고, 잔여 위상이 1행과 3행으로 완벽히 분배됩니다.',
    mathInsightEn: 'Anti Diag MX clears center 4 via MX ∘ MX = ID, distributing residual errors to Rows 1 and 3.',
    highlightCells: [2, 4, 6],
    formulaBadge: '2수: 부대각 MX',
    formulaText: 'Diag[anti] ➔ MX',
    formulaDesc: '부대각선 가로 반사로 중심을 소거하고 상하 행으로 위상을 분배합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.MX,
    actionDescKo: '3수: 3행 상하 반사 (MX 트리플 킬 폭파)',
    actionDescEn: 'Move 3: Row 3 Horizontal Reflection (MX Triple-Kill)',
    mathInsightKo: '3행 {6,7,8}의 MX 3개가 MX ∘ MX = ID로 일제히 트리플 킬 폭파!',
    mathInsightEn: 'Row 3 MX triggers a Triple-Kill on cells 6, 7, 8 via MX ∘ MX = ID!',
    highlightCells: [6, 7, 8],
    formulaBadge: '3수: 3행 MX 트리플 킬',
    formulaText: 'Row₃ ➔ MX',
    formulaDesc: '3행 가로 반사로 하단 3개 타일을 일제히 폭파합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '4수: 1행 상하 반사 (MX 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Row 1 Horizontal Reflection (MX Triple-Kill Finish)',
    mathInsightKo: '1행 {0,1,2}의 MX 3개가 일제히 소거되며 100% ID 올클리어 완성!',
    mathInsightEn: 'Row 1 MX eliminates cells 0, 1, 2 for a dramatic Triple-Kill Finish, 100% All Clear!',
    highlightCells: [0, 1, 2],
    formulaBadge: '4수: 1행 MX 피니시',
    formulaText: 'Row₁ ➔ MX ➔ 100% 클리어',
    formulaDesc: '1행 가로 반사로 상단 3개 타일을 소거하여 올클리어를 달성합니다.'
  }
]);

// 34. [Round 8 마스터 공식 20: D4 코너 샌드위치 폭파 3수 공식]
// 초기 보드: ['MX', 'ID', 'MX', 'ID', 'MX', 'ID', 'MX', 'ID', 'MX']
// 1열(col 0) MX ➔ 3열(col 2) MX ➔ 2행(row 1) MX = 100% ID 올클리어
const d4CornerSandwichInitialBoard: D4Op[] = [
  D4.MX, D4.ID, D4.MX,
  D4.ID, D4.MX, D4.ID,
  D4.MX, D4.ID, D4.MX
];

const d4CornerSandwichSteps = createInteractiveSteps(d4CornerSandwichInitialBoard, [
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '1수: 1열 상하 반사 (코너 0, 6 소거 및 교차점 3 생성)',
    actionDescEn: 'Move 1: Col 1 Horizontal Reflection (Corners 0, 6 Cleared & Intersection 3 Armed)',
    mathInsightKo: '1열 {0,3,6} 조작: 코너 0, 6이 MX ∘ MX = ID로 소거되고, 교차점 3에 매개 MX가 생성됩니다.',
    mathInsightEn: 'Col 1 MX clears corners 0 and 6 to ID, arming intersection 3 with intermediate MX.',
    highlightCells: [0, 3, 6],
    formulaBadge: '1수: 1열 MX',
    formulaText: 'Col₁ ➔ MX',
    formulaDesc: '1열 가로 반사로 0번과 6번 코너를 소거합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.MX,
    actionDescKo: '2수: 3열 상하 반사 (코너 2, 8 소거 및 2행 정렬)',
    actionDescEn: 'Move 2: Col 3 Horizontal Reflection (Corners 2, 8 Cleared & Row 2 Aligned)',
    mathInsightKo: '3열 {2,5,8} 조작: 코너 2, 8이 소거되고, 교차점 5에 MX 생성! 2행 전체(3, 4, 5)가 순수 MX 단일 위상으로 동기화됩니다.',
    mathInsightEn: 'Col 3 MX clears corners 2 and 8, arming cell 5; synchronizes Row 2 (3, 4, 5) into uniform MX phase.',
    highlightCells: [2, 5, 8],
    formulaBadge: '2수: 3열 MX',
    formulaText: 'Col₃ ➔ MX',
    formulaDesc: '3열 가로 반사로 2번과 8번 코너를 소거하고 2행을 동기화합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '3수: 2행 상하 반사 (중심행 트리플 킬 피니시)',
    actionDescEn: 'Move 3: Row 2 Horizontal Reflection (Row 2 Triple-Kill Finish)',
    mathInsightKo: '2행 {3,4,5}에 MX 적용: 남은 3개 셀이 동시 소거(트리플 킬 폭파)! 100% ID 올클리어 완성!',
    mathInsightEn: 'Row 2 MX wipes tiles 3, 4, 5 simultaneously via MX ∘ MX = ID (Triple-Kill Finish), 100% All Clear!',
    highlightCells: [3, 4, 5],
    formulaBadge: '3수: 2행 MX 피니시',
    formulaText: 'Row₂ ➔ MX ➔ 100% 클리어',
    formulaDesc: '2행 가로 반사로 2행 3개 타일을 일제히 폭파하여 올클리어를 달성합니다.'
  }
]);

// 35. [Round 8 마스터 공식 21: D4 슈퍼 중첩 체커보드 4수 공식]
// 초기 보드: ['R180', 'MD', 'R180', 'MD', 'ID', 'MD', 'R180', 'MD', 'R180']
// 주대각선(main) R180 ➔ 부대각선(anti) R180 ➔ 2열(col 1) MD ➔ 2행(row 1) MD = 100% ID 올클리어
const d4CheckerSuperpositionInitialBoard: D4Op[] = [
  D4.R180, D4.MD, D4.R180,
  D4.MD,   D4.ID, D4.MD,
  D4.R180, D4.MD, D4.R180
];

const d4CheckerSuperpositionSteps = createInteractiveSteps(d4CheckerSuperpositionInitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.R180,
    actionDescKo: '1수: 주대각선(↖) 180° 회전 (코너 0, 8 소거 & 중심 생성)',
    actionDescEn: 'Move 1: Main Diag (↖) Rotate 180° (Corners 0, 8 Cleared & Center Transition)',
    mathInsightKo: '주대각선 {0,4,8}에 R180 작용: 코너 0, 8이 R180 ∘ R180 = ID로 소거되고, 중심 4번에 R180이 일시 생성됩니다.',
    mathInsightEn: 'Main Diag R180 wipes corners 0 and 8 to ID while arming center 4 with R180.',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 R180',
    formulaText: 'Diag[main] ➔ R180',
    formulaDesc: '주대각선 180° 회전으로 0번과 8번 코너를 소거합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.R180,
    actionDescKo: '2수: 부대각선(↗) 180° 회전 (코너 2, 6 소거 & 중심 복귀)',
    actionDescEn: 'Move 2: Anti Diag (↗) Rotate 180° (Corners 2, 6 Cleared & Center Restored)',
    mathInsightKo: '부대각선 {2,4,6}에 R180 작용: 코너 2, 6 소거! 중심 4번은 R180 ∘ R180 = ID로 즉시 원상 복귀합니다.',
    mathInsightEn: 'Anti Diag R180 wipes corners 2 and 6, and restores center 4 back to ID via R180² = ID.',
    highlightCells: [2, 4, 6],
    formulaBadge: '2수: 부대각 R180',
    formulaText: 'Diag[anti] ➔ R180',
    formulaDesc: '부대각선 180° 회전으로 2번과 6번 코너를 소거하고 중심을 복구합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MD,
    actionDescKo: '3수: 2열 주대각 반사 (에지 1, 7 소거 & 중심 MD 정렬)',
    actionDescEn: 'Move 3: Col 2 Diagonal Reflection (Edges 1, 7 Cleared & Center Armed)',
    mathInsightKo: '2열 {1,4,7}에 MD 작용: 셀 1, 7이 MD ∘ MD = ID로 소거되고, 중심 4번에 MD가 부여되어 2행 전체(3, 4, 5)가 순수 MD 위상으로 정렬됩니다.',
    mathInsightEn: 'Col 2 MD cancels edges 1 and 7, setting center 4 to MD; synchronizes Row 2 (3, 4, 5) uniformly to MD phase.',
    highlightCells: [1, 4, 7],
    formulaBadge: '3수: 2열 MD',
    formulaText: 'Col₂ ➔ MD',
    formulaDesc: '2열 대각 반사로 1번과 7번 에지를 소거하고 2행을 동기화합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.MD,
    actionDescKo: '4수: 2행 주대각 반사 (중심행 MD 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Row 2 Diagonal Reflection (Row 2 MD Triple-Kill Finish)',
    mathInsightKo: '2행 {3,4,5}에 MD 작용: 셀 3, 4, 5가 일제히 MD ∘ MD = ID로 소거(트리플 킬 폭파)! 100% ID 올클리어 완성!',
    mathInsightEn: 'Row 2 MD wipes tiles 3, 4, 5 simultaneously via MD ∘ MD = ID (Triple-Kill Finish), achieving 100% All Clear!',
    highlightCells: [3, 4, 5],
    formulaBadge: '4수: 2행 MD 피니시',
    formulaText: 'Row₂ ➔ MD ➔ 100% 클리어',
    formulaDesc: '2행 대각 반사로 중심행 3개 타일을 일제히 폭파하여 올클리어를 달성합니다.'
  }
]);
"""

# Place steps_code before 'const BASE_FORMULAS: FormulaItem[] = ['
target_anchor = "const BASE_FORMULAS: FormulaItem[] = ["
if target_anchor in code:
    code = code.replace(target_anchor, steps_code + "\n" + target_anchor)
    print("Injected step definitions before BASE_FORMULAS!")
else:
    print("ERROR: BASE_FORMULAS anchor not found!")

# 2. FormulaItem 객체들을 BASE_FORMULAS 배열의 앞부분(또는 끝부분)에 추가
# BASE_FORMULAS에 신규 6선(Round 7 3선 + Round 8 3선) 추가
items_code = """
  {
    id: 'd4-corner-kite-flux-4',
    titleKo: '코너 연(Kite) 플럭스 4수 소거 공식',
    titleEn: 'Corner Kite Flux 4-Move Purge Formula',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 4수',
    badgeEn: '🏁 D4 Master 4M',
    difficulty: 4,
    formulaSeq: '주대각 MX ➔ 부대각 MX ➔ 3열 MX ➔ 3행 MX = 전 타일 올클리어',
    summaryKo: '주대각선(↖) 축을 따라 연(Kite) 형태로 얽힌 4개 타일(0, 5, 7, 8번 타일의 MX 위상)을 양대각선 교차 반사와 외곽 직교 스위프로 단 4수만에 완전 소거합니다.',
    summaryEn: 'Eliminates a 4-tile diagonal kite pattern (cells 0, 5, 7, 8 carrying MX) in exactly 4 moves via dual diagonal cross-reflections and orthogonal sweeps.',
    diagramType: 'interactive',
    steps: d4CornerKiteFluxSteps,
    latexFormula: '\\\\text{Row}_3(M_X) \\\\circ \\\\text{Col}_3(M_X) \\\\circ \\\\text{Diag}_{\\\\text{anti}}(M_X) \\\\circ \\\\text{Diag}_{\\\\text{main}}(M_X) = \\\\text{ID}',
    notesKo: [
      'BFS 전수 탐색으로 증명된 지름길 없는(Zero-Shortcut) 엄격한 4수 마스터 공식입니다.',
      '1수에서 주대각선(↖) 반사로 0번·8번 코너를 소거하고, 2수에서 부대각선(↗)으로 중심을 소거한 뒤, Col 3과 Row 3으로 연속 격파합니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 4-move sequence (Zero-Shortcut) verified by full BFS exploration.',
      'Dual diagonal cross-reflections clear corners and center, followed by Col 3 and Row 3 sweeps to achieve 100% ID.'
    ],
    tags: ['4수', '연 모양', '대각선 축', 'D4 마스터', 'Kite Flux', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-plus-omega-cross-3',
    titleKo: '십자 변 & 대각 반사 오메가 3수 킬',
    titleEn: 'Plus-Omega Cross 3-Move Kill Formula',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 3수',
    badgeEn: '🏁 D4 Master 3M',
    difficulty: 3,
    formulaSeq: '2행 MAD ➔ 2열 MAD ➔ 주대각 MD = 전 타일 올클리어',
    summaryKo: '십자 변 4개(1, 3, 5, 7번)의 부대각 반사(MAD)와 주대각선(0, 4, 8번)의 주대각 반사(MD)가 결합된 최고난도 위상을 단 3수의 교차 연산으로 일격 킬합니다.',
    summaryEn: 'A lethal 3-move killer formula eradicating all 4 cross edges (MAD) and main diagonal (MD) via orthogonal anti-reflections and diagonal stroke.',
    diagramType: 'interactive',
    steps: d4PlusOmegaCrossSteps,
    latexFormula: '\\\\text{Diag}_{\\\\text{main}}(M_D) \\\\circ \\\\text{Col}_2(M_{AD}) \\\\circ \\\\text{Row}_2(M_{AD}) = \\\\text{ID}',
    notesKo: [
      'BFS 전수 탐색으로 증명된 지름길 없는(Zero-Shortcut) 엄격한 3수 마스터 공식입니다.',
      '중심 십자축(2행, 2열)에 MAD를 연속 가하여 십자 변 4개를 양방향 소거한 뒤, 주대각선 MD로 남은 3개 타일을 한 번에 종결합니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 3-move sequence (Zero-Shortcut) verified by full BFS exploration.',
      'Cross edge purge via dual MAD operations on middle axes, followed by a final MD stroke on main diagonal.'
    ],
    tags: ['3수', '십자 변', '오메가 킬', 'D4 마스터', 'Plus-Omega', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-hyper-cube-frame-4',
    titleKo: '초입방체 외곽 프레임 4수 종결 공식',
    titleEn: 'Hyper-Cube Frame 4-Move Finale',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 4수',
    badgeEn: '🏁 D4 Master 4M',
    difficulty: 4,
    formulaSeq: '1행 R90 ➔ 3행 R90 ➔ 1열 R90 ➔ 3열 R90 = 전 타일 올클리어',
    summaryKo: '외곽 프레임 전체 8개 타일(4개 코너 R180, 4개 변 R270)의 고난도 회전 대칭을 4개의 외곽 행·열 90도 스위프로 단 4수만에 종결합니다.',
    summaryEn: 'Terminates the full 8-tile outer frame rotational symmetry (4 corners R180, 4 edges R270) in exactly 4 moves via outer perimeter R90 sweeps.',
    diagramType: 'interactive',
    steps: d4HyperCubeFrameSteps,
    latexFormula: '\\\\text{Col}_3(R_{90}) \\\\circ \\\\text{Col}_1(R_{90}) \\\\circ \\\\text{Row}_3(R_{90}) \\\\circ \\\\text{Row}_1(R_{90}) = \\\\text{ID}',
    notesKo: [
      'BFS 전수 탐색으로 증명된 지름길 없는(Zero-Shortcut) 엄격한 4수 마스터 공식입니다.',
      '중심 타일(4번)은 완전한 ID를 유지한 채, 외곽 8개 타일만을 행/열 스위프로 완벽하게 동기화 및 동시 소거합니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 4-move sequence (Zero-Shortcut) verified by full BFS exploration.',
      'The center tile remains pure ID while all 8 outer border tiles are synchronized and cleared by outer perimeter sweeps.'
    ],
    tags: ['4수', '외곽 프레임', '초입방체', 'D4 마스터', 'Hyper-Cube', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-zigzag-diagonal-flush-4',
    titleKo: 'D4 지그재그 대각 소거 4수 공식',
    titleEn: 'D4 Zigzag Diagonal Flush 4-Move Formula',
    category: 'god-number',
    badgeKo: '⚡ 지그재그 대각 4수',
    badgeEn: '⚡ Zigzag Flush 4M',
    difficulty: 4,
    formulaSeq: '주대각 R180 ➔ 부대각 MX ➔ 3행 MX ➔ 1행 MX = 전 타일 올클리어',
    summaryKo: '0번 코너에서 1, 4, 7, 8번으로 이어지는 S자 지그재그 경로로 뒤틀린 위상을 대각선-직교 결합 4수로 한 번에 클리어하는 고급 마스터 테크닉입니다.',
    summaryEn: 'Clears an S-shaped zigzag pattern across cells 0, 1, 4, 7, 8 via dual diagonal and orthogonal sweeps in 4 minimal moves.',
    diagramType: 'interactive',
    steps: d4ZigzagDiagonalFlushSteps,
    latexFormula: '\\\\text{Row}_1(M_X) \\\\circ \\\\text{Row}_3(M_X) \\\\circ \\\\text{Diag}_{\\\\text{anti}}(M_X) \\\\circ \\\\text{Diag}_{\\\\text{main}}(R_{180}) = \\\\text{ID}',
    notesKo: [
      '0-1-4-7-8 지그재그 경로를 대각선 2축과 직교 2축의 결합으로 최단 4수(Zero-Shortcut)에 돌파합니다.',
      '부대각선 MX로 중심 타일을 소거한 뒤 3행과 1행을 연속 트리플 킬로 마무리하는 정교한 공식입니다.'
    ],
    notesEn: [
      'Conquers an S-shaped zigzag path (0-1-4-7-8) in minimal 4 moves via dual diagonal and orthogonal coupling.',
      'Anti Diag MX resolves the center tile, priming Rows 3 and 1 for consecutive clean triple-kills.'
    ],
    tags: ['4수', '지그재그', '대각선', '반사', '회전', '마스터', 'D4', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-corner-sandwich-3',
    titleKo: 'D4 코너 샌드위치 폭파 3수 공식',
    titleEn: 'D4 Corner Sandwich Blitz 3-Move Formula',
    category: 'god-number',
    badgeKo: '🥪 코너 샌드위치 3수',
    badgeEn: '🥪 Sandwich Blitz 3M',
    difficulty: 3,
    formulaSeq: '1열 MX ➔ 3열 MX ➔ 2행 MX = 전 타일 올클리어',
    summaryKo: '1열과 3열의 4대 코너(0, 2, 6, 8)와 중심(4)이 2열을 샌드위치처럼 감싸고 있는 X자 형태를 직교 열과 행의 간섭 소거로 단 3수에 격파하는 마스터 공식입니다.',
    summaryEn: 'Conquers 4 corners (0, 2, 6, 8) and center 4 sandwiching Column 2 in minimal 3 moves via orthogonal column and row interference cancellation.',
    diagramType: 'interactive',
    steps: d4CornerSandwichSteps,
    latexFormula: '\\\\text{Row}_2(M_X) \\\\circ \\\\text{Col}_3(M_X) \\\\circ \\\\text{Col}_1(M_X) = \\\\text{ID}',
    notesKo: [
      '교차점 상쇄 원리: 1열과 2행의 교차점(3), 3열과 2행의 교차점(5)이 일시적으로 MX를 받았다가 마지막 2행 스와이프로 완벽히 소멸합니다.',
      '4대 코너와 중심이 얽힌 5타일 위상을 최단 3수(Zero-Shortcut)에 격파하는 강력한 실전 피니시입니다.'
    ],
    notesEn: [
      'Intersection cancellation principle: intermediate phases on cells 3 and 5 are created by column moves and wiped out by the final Row 2 sweep.',
      'An optimal 3-move weapon (Zero-Shortcut) to clear 4 corners and center simultaneously.'
    ],
    tags: ['3수', '샌드위치', '코너', '반사', '마스터', 'D4', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-checker-superposition-4',
    titleKo: 'D4 슈퍼 중첩 체커보드 4수 공식',
    titleEn: 'D4 Checker Superposition 4-Move Formula',
    category: 'god-number',
    badgeKo: '🏁 중첩 체커 4수',
    badgeEn: '🏁 Super-Checker 4M',
    difficulty: 4,
    formulaSeq: '주대각 R180 ➔ 부대각 R180 ➔ 2열 MD ➔ 2행 MD = 전 타일 올클리어',
    summaryKo: '4개 코너(R180)와 십자 4개 에지(MD)가 체스판처럼 번갈아 중첩된 외곽 8방향 대칭 위상을 대각선 2축과 십자 2축의 4중 대칭 조작으로 완전 해결하는 마스터 올킬 공식입니다.',
    summaryEn: 'Solves an alternating checkerboard of 4 corners (R180) and 4 cross edges (MD) surrounding center ID via dual diagonal and dual orthogonal strokes in 4 minimal moves.',
    diagramType: 'interactive',
    steps: d4CheckerSuperpositionSteps,
    latexFormula: '\\\\text{Row}_2(M_D) \\\\circ \\\\text{Col}_2(M_D) \\\\circ \\\\text{Diag}_{\\\\text{anti}}(R_{180}) \\\\circ \\\\text{Diag}_{\\\\text{main}}(R_{180}) = \\\\text{ID}',
    notesKo: [
      '양대각선 180° 회전으로 4대 코너를 먼저 쓸어 담은 뒤, 중심 2열과 2행의 MD 반사로 십자 에지를 순차 폭파하는 완벽한 4중 대칭 공식입니다.',
      '회전과 사선 반사가 체커보드로 얽힌 최고 난도 위상을 지름길 없이 최단 4수(Zero-Shortcut)에 정복합니다.'
    ],
    notesEn: [
      'Sweeps all 4 corners first via dual diagonal 180° rotations, then detonates the cross edges via Col 2 and Row 2 MD reflections.',
      'Conquers an entangled rotational and reflection checkerboard in minimal 4 moves with zero shortcuts.'
    ],
    tags: ['4수', '체커보드', '중첩', '회전', '반사', '마스터', 'D4', '신의 수 테크닉'],
    isInteractive: true
  },
"""

code = code.replace("const BASE_FORMULAS: FormulaItem[] = [", "const BASE_FORMULAS: FormulaItem[] = [" + items_code)

with open(formulas_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated formulas.ts with 6 new formulas!")
