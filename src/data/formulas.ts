/**
 * @file formulas.ts
 * @description 갈루아 큐브 공식 비법서(Formula Guidebook) 모듈형 레지스트리 및 시뮬레이터
 * D4 정이면체군 및 V4 클라인 4원군 핵심 수학 법칙과 실전 테크닉 스텝 데이터
 */

import { D4, D4Op } from '../core/group';
import { LINE_CELLS_3X3, applyLineMoveGeneric } from '../core/board';
import minedFormulasRaw from './minedFormulas.json';
export { minedFormulasRaw };

export type FormulaCategory =
  | 'all'
  | 'basics'
  | 'basic'
  | 'rotation'
  | 'reflection'
  | 'godTechnique'
  | 'god-number'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'ai-mined';

export interface FormulaStep {
  stepIndex: number;
  labelKo: string;
  labelEn: string;
  boardOps: D4Op[];
  highlightCells?: number[];
  highlightLine?: {
    type: 'row' | 'col' | 'diag';
    index: number | 'main' | 'anti';
  };
  actionDescKo: string;
  actionDescEn: string;
  mathInsightKo?: string;
  mathInsightEn?: string;
  // 호환성 속성
  subStep?: number;
  label?: string;
  formulaBadge?: string;
  formulaText?: string;
  formulaDesc?: string;
  actionDesc?: string;
}

export interface FormulaItem {
  id: string;
  titleKo: string;
  titleEn: string;
  category: FormulaCategory;
  badgeKo: string;
  badgeEn: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  formulaSeq: string;
  summaryKo: string;
  summaryEn: string;
  diagramType: 'interactive' | 'grid-svg' | 'table';
  steps?: FormulaStep[];
  svgDiagramKey?: string;
  latexFormula?: string;
  notesKo?: string[];
  notesEn?: string[];
  // 호환성 속성
  title?: string;
  subtitle?: string;
  mathNotation?: string;
  description?: string;
  tip?: string;
  badge?: string;
  tags?: string[];
  isInteractive?: boolean;
}

/**
 * 라인 타입 및 인덱스로부터 3x3 보드의 셀 인덱스 배열 반환
 */
export function getLineCells(lineType: 'row' | 'col' | 'diag', index: number | 'main' | 'anti'): number[] {
  if (lineType === 'row') {
    const r = Number(index);
    return LINE_CELLS_3X3[r]; // 0, 1, 2
  } else if (lineType === 'col') {
    const c = Number(index);
    return LINE_CELLS_3X3[3 + c]; // 3, 4, 5
  } else {
    return index === 'main' ? LINE_CELLS_3X3[6] : LINE_CELLS_3X3[7];
  }
}

/**
 * 일련의 연산을 시뮬레이션하여 단계별 FormulaStep 배열을 생성
 */
export function createInteractiveSteps(
  initialOps: D4Op[],
  moves: Array<{
    lineType: 'row' | 'col' | 'diag';
    lineIndex: number | 'main' | 'anti';
    op: D4Op;
    actionDescKo: string;
    actionDescEn: string;
    mathInsightKo?: string;
    mathInsightEn?: string;
    highlightCells?: number[];
    formulaBadge?: string;
    formulaText?: string;
    formulaDesc?: string;
  }>
): FormulaStep[] {
  const steps: FormulaStep[] = [];
  let currentOps = [...initialOps];

  // 0단계: 시작 상태
  steps.push({
    stepIndex: 0,
    subStep: 0,
    labelKo: '시작 상태 (Initial State)',
    labelEn: 'Initial State',
    label: '시작 상태',
    boardOps: [...currentOps],
    highlightCells: moves[0]?.highlightCells ?? [],
    actionDescKo: '공식 적용 전 초기 상태입니다.',
    actionDescEn: 'Initial board state before applying formula.',
    mathInsightKo: '각 타일의 지향점 변화를 관찰하세요.',
    mathInsightEn: 'Observe the orientation change of target tiles.',
    formulaBadge: '초기 상태',
    formulaText: 'Initial State',
    formulaDesc: '공식 적용 전 초기 상태'
  });

  moves.forEach((m, idx) => {
    const targetCells = getLineCells(m.lineType, m.lineIndex);
    currentOps = applyLineMoveGeneric(currentOps, targetCells, m.op);

    steps.push({
      stepIndex: idx + 1,
      subStep: idx + 1,
      labelKo: `단계 ${idx + 1}: ${m.actionDescKo}`,
      labelEn: `Step ${idx + 1}: ${m.actionDescEn}`,
      label: `단계 ${idx + 1}: ${m.actionDescKo}`,
      boardOps: [...currentOps],
      highlightCells: m.highlightCells ?? targetCells,
      highlightLine: {
        type: m.lineType,
        index: m.lineIndex
      },
      actionDescKo: m.actionDescKo,
      actionDescEn: m.actionDescEn,
      mathInsightKo: m.mathInsightKo,
      mathInsightEn: m.mathInsightEn,
      formulaBadge: m.formulaBadge ?? `${idx + 1}수: ${m.actionDescKo}`,
      formulaText: m.formulaText ?? `${m.lineType}[${m.lineIndex}] ➔ ${m.op}`,
      formulaDesc: m.formulaDesc ?? (m.mathInsightKo || m.actionDescKo)
    });
  });

  return steps;
}

const emptyBoard: D4Op[] = Array(9).fill(D4.ID);

// 1. [공식 1: 중심 타일 180° 반전 공식 (Center Inversion)]
// 2행 R90 -> 2열 MX -> 2행 R270 -> 2열 MX
// 교환자 [R, MX] = R MX R^-1 MX = R180 적용 -> 오직 교차점인 4번(중심)만 R180 반전되고 나머지 8타일 ID 보존
const centerInversionSteps = createInteractiveSteps(emptyBoard, [
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '2행 90° 시계 회전 (R90)',
    actionDescEn: 'Row 2 Rotate 90° (R90)',
    mathInsightKo: '2행 3개 타일에 90° 회전 변환 적용',
    mathInsightEn: 'Apply 90° rotation to Row 2',
    highlightCells: [4],
    formulaBadge: '1수: 2행 R90',
    formulaText: 'Row₂ ➔ R90',
    formulaDesc: '2행 전체에 90° 시계 회전 변환을 적용합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '2열 상하 반전 (MX)',
    actionDescEn: 'Col 2 Vertical Flip (MX)',
    mathInsightKo: '중심 타일(4번)에서 R90과 MX가 합성되어 사선 대칭 형성',
    mathInsightEn: 'Center tile composes R90 and MX into diagonal symmetry',
    highlightCells: [4],
    formulaBadge: '2수: 2열 MX',
    formulaText: 'Col₂ ➔ MX',
    formulaDesc: '중심 타일(4번)에서 R90과 MX가 합성되어 사선 대칭이 형성됩니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R270,
    actionDescKo: '2행 90° 반시계 역회전 (R270)',
    actionDescEn: 'Row 2 Rotate Counter-Clockwise (R270)',
    mathInsightKo: '2행의 좌우 타일은 R90 ∘ R270 = ID로 원상 복구',
    mathInsightEn: 'Row 2 left and right tiles restore via R90 ∘ R270 = ID',
    highlightCells: [4],
    formulaBadge: '3수: 2행 R270 (역원)',
    formulaText: 'Row₂ ➔ R270',
    formulaDesc: '2행의 좌우 타일이 R90 ∘ R270 = ID로 원상 복구됩니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '2열 상하 반전 재적용 (MX)',
    actionDescEn: 'Col 2 Vertical Flip Restore (MX)',
    mathInsightKo: '2열의 상하 타일은 MX ∘ MX = ID로 복구, 중심은 [R90, MX] = R180 완전 고립 반전!',
    mathInsightEn: 'Col 2 top and bottom tiles restore, leaving only center tile isolated at R180!',
    highlightCells: [4],
    formulaBadge: '4수: 2열 MX 복원',
    formulaText: '[R90, MX] = R180',
    formulaDesc: '외곽 타일은 모두 복원되고, 오직 정중앙 4번 타일만 180° 반전 완성!'
  }
]);

// 2. [공식 2: 3개 타일 90° 순환 교환자 (3-Cycle Commutator)]
// 1행 R90 -> 2열 R90 -> 1행 R270 -> 2열 R270
const threeCycleSteps = createInteractiveSteps(emptyBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1행 90° 시계 회전 (R90)',
    actionDescEn: 'Row 1 Rotate 90° (R90)',
    mathInsightKo: '1행 전체(0, 1, 2번 타일)에 R90 작용',
    mathInsightEn: 'Apply R90 to Row 1',
    highlightCells: [1],
    formulaBadge: '1수: 1행 R90',
    formulaText: 'Row₁ ➔ R90',
    formulaDesc: '1행 전체에 90° 시계 회전을 적용합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.R90,
    actionDescKo: '2열 90° 시계 회전 (R90)',
    actionDescEn: 'Col 2 Rotate 90° (R90)',
    mathInsightKo: '2열 전체(1, 4, 7번 타일)에 R90 작용, 교차 타일(1번)은 R180 합성',
    mathInsightEn: 'Apply R90 to Col 2, intersection tile 1 becomes R180',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 R90',
    formulaText: 'Col₂ ➔ R90',
    formulaDesc: '2열 전체에 R90 작용, 교차 타일(1번)은 R180으로 합성됩니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R270,
    actionDescKo: '1행 90° 반시계 역회전 (R270)',
    actionDescEn: 'Row 1 Counter-Rotate (R270)',
    mathInsightKo: '0, 2번 타일은 즉시 ID 복구, 1번 타일은 R90 상태로 전이',
    mathInsightEn: 'Tiles 0 and 2 restore to ID, tile 1 transitions to R90',
    highlightCells: [1, 4, 7],
    formulaBadge: '3수: 1행 R270',
    formulaText: 'Row₁ ➔ R270',
    formulaDesc: '0, 2번 타일은 즉시 ID로 복구되고 교차점만 순환 치환됩니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.R270,
    actionDescKo: '2열 90° 반시계 역회전 (R270)',
    actionDescEn: 'Col 2 Counter-Rotate (R270)',
    mathInsightKo: '4, 7번 타일은 원상 복구되며 교차점 타일만 대칭 변환 보존',
    mathInsightEn: 'Tiles 4 and 7 restore, leaving minimal isolated permutation',
    highlightCells: [1],
    formulaBadge: '4수: 2열 R270',
    formulaText: '[Row₁, Col₂] = 3-Cycle',
    formulaDesc: '나머지 비교차 타일들은 모두 복귀하고 3개 타일만 순환 변환 완료!'
  }
]);

// 3. [공식 3: 대각선 반사 상쇄 공식 (Diagonal Reflection Pair)]
// 주대각선 MD -> 1행 MX -> 주대각선 MD -> 1행 MX
const diagonalPairSteps = createInteractiveSteps(emptyBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MD,
    actionDescKo: '주대각선 사선 반사 (MD)',
    actionDescEn: 'Main Diagonal Reflection (MD)',
    mathInsightKo: '주대각선 0, 4, 8번 타일 대각 축 반사',
    mathInsightEn: 'Reflect main diagonal tiles (0, 4, 8)',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 MD',
    formulaText: 'Diag ➔ MD',
    formulaDesc: '주대각선(0, 4, 8번) 타일 축 반사 작용'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '1행 상하 반전 (MX)',
    actionDescEn: 'Row 1 Vertical Flip (MX)',
    mathInsightKo: '0번 타일에서 MD와 MX가 결합하여 90° 회전 성분 생성',
    mathInsightEn: 'MD and MX compose on tile 0 into 90° rotation',
    highlightCells: [0],
    formulaBadge: '2수: 1행 MX',
    formulaText: 'Row₁ ➔ MX',
    formulaDesc: '0번 타일에서 MD와 MX가 결합하여 회전 성분을 생성합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MD,
    actionDescKo: '주대각선 사선 반사 복원 (MD)',
    actionDescEn: 'Main Diagonal Reflection Restore (MD)',
    mathInsightKo: '대각선 켤레(Conjugation) 변환 작용',
    mathInsightEn: 'Conjugate transformation acting along diagonal',
    highlightCells: [0],
    formulaBadge: '3수: 주대각 MD (역원)',
    formulaText: 'Diag ➔ MD',
    formulaDesc: '대각선 켤레(Conjugate) 변환으로 행 연산이 열 연산으로 전환됩니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '1행 상하 반전 복원 (MX)',
    actionDescEn: 'Row 1 Vertical Flip Restore (MX)',
    mathInsightKo: '코너 0번 타일에만 R180 반전이 국소적으로 발생하고 나머지 복원',
    mathInsightEn: 'Tile 0 receives isolated transformation while others restore',
    highlightCells: [0],
    formulaBadge: '4수: 1행 MX 복원',
    formulaText: 'MD ∘ MX ∘ MD ∘ MX = R180',
    formulaDesc: '코너 0번 타일에만 국소적 180° 반전이 유도되고 나머지 보존 완료!'
  }
]);

// 4. [공식 4: V4 클라인 4원군 4수 최단 정복 인터랙티브 스텝]
// 초기 스크램블 보드: Row3(R180) -> Col3(MY) -> Row2(MY) -> Row1(R180)의 역산
const v4ScrambledBoard: D4Op[] = [
  D4.R180, D4.MY,   D4.MX,
  D4.ID,   D4.MY,   D4.MY,
  D4.R180, D4.MY,   D4.MX
];

const v4ConquestSteps = createInteractiveSteps(v4ScrambledBoard, [
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.R180,
    actionDescKo: '3행 180° 회전 (R180 더블탭)',
    actionDescEn: 'Row 3 Rotate 180° (R180)',
    mathInsightKo: '3행 1열(6번 셀)을 즉시 0번(ID) 정위치로 일치시킴',
    mathInsightEn: 'Aligns Row 3 Col 1 (cell 6) to ID immediately',
    highlightCells: [6, 7, 8],
    formulaBadge: '1수: 3행 R180',
    formulaText: 'Row₃ ➔ R180',
    formulaDesc: '3행 더블탭으로 3행 1열을 즉시 0번으로 맞춥니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.MY,
    actionDescKo: '3열 좌우 반전 (MY 세로밀기)',
    actionDescEn: 'Col 3 Horizontal Flip (MY)',
    mathInsightKo: '3열 전체(2, 5, 8번 타일)가 일괄 0번(ID)으로 동기화',
    mathInsightEn: 'Synchronizes Col 3 (cells 2, 5, 8) to ID in one move',
    highlightCells: [2, 5, 8],
    formulaBadge: '2수: 3열 MY',
    formulaText: 'Col₃ ➔ MY',
    formulaDesc: '3열 세로밀기로 3열 전체(2, 5, 8번 타일)를 정위치로 복원합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.MY,
    actionDescKo: '2행 좌우 반전 (MY 세로밀기)',
    actionDescEn: 'Row 2 Horizontal Flip (MY)',
    mathInsightKo: '가환군 특성을 이용해 2행의 잔여 MY를 소거',
    mathInsightEn: 'Eliminates remaining MY in Row 2 using commutativity',
    highlightCells: [3, 4, 5],
    formulaBadge: '3수: 2행 MY',
    formulaText: 'Row₂ ➔ MY',
    formulaDesc: '2행 세로밀기로 2행과 3행을 완전히 클리어합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R180,
    actionDescKo: '1행 180° 회전 (R180 더블탭)',
    actionDescEn: 'Row 1 Rotate 180° (R180)',
    mathInsightKo: '남은 1행 전체가 0번(ID)으로 수렴하며 전 타일 올클리어 완성!',
    mathInsightEn: 'All remaining tiles converge to ID: 100% puzzle complete!',
    highlightCells: [0, 1, 2],
    formulaBadge: '4수: 1행 R180',
    formulaText: 'Row₁ ➔ R180 ➔ 0번 올클리어',
    formulaDesc: '1행 더블탭으로 전 타일 0번 완성! V4 4수 정복 완료!'
  }
]);

// 5. [공식 5: 같은 줄 180° 쌍(Pair) 상쇄 공식 (Parallel 180° Pair)]
// 1행의 [0번, 1번] 타일만 180° 회전된 상태에서 3열 MX -> 1행 R180 -> 3열 MX
const parallel180InitialBoard: D4Op[] = [
  D4.R180, D4.R180, D4.ID,
  D4.ID,   D4.ID,   D4.ID,
  D4.ID,   D4.ID,   D4.ID
];

const parallel180PairSteps = createInteractiveSteps(parallel180InitialBoard, [
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.MX,
    actionDescKo: '3열 상하 반전 (MX 가로밀기)',
    actionDescEn: 'Col 3 Vertical Flip (MX)',
    mathInsightKo: '3열 타일들을 거울 반사(MX)로 임시 변환하여 1행 연산과의 교차 기점 확보',
    mathInsightEn: 'Temporarily transforms Col 3 via MX reflection to prepare intersection pivot',
    highlightCells: [2, 5, 8],
    formulaBadge: '1수: 3열 MX',
    formulaText: 'Col₃ ➔ MX',
    formulaDesc: '3열 가로 반사로 교차 기점을 준비합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R180,
    actionDescKo: '1행 180° 회전 (R180 더블탭)',
    actionDescEn: 'Row 1 Rotate 180° (R180)',
    mathInsightKo: '1행의 0번, 1번 타일이 R180 ∘ R180 = ID로 즉시 상쇄! 교차점(2번)은 MY로 합성',
    mathInsightEn: 'Tiles 0 and 1 cancel out via R180 ∘ R180 = ID! Intersection tile becomes MY',
    highlightCells: [0, 1, 2],
    formulaBadge: '2수: 1행 R180',
    formulaText: 'Row₁ ➔ R180',
    formulaDesc: '1행 전체에 180° 회전을 적용하여 문제의 180° 쌍을 상쇄합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.MX,
    actionDescKo: '3열 상하 반전 복원 (MX 가로밀기)',
    actionDescEn: 'Col 3 Vertical Flip Restore (MX)',
    mathInsightKo: '3열 타일들이 원상 복구(MX² = ID)되며 1행의 남았던 180도 쌍이 완전히 0번으로 상쇄!',
    mathInsightEn: 'Col 3 restores via MX² = ID, completing the cancellation of the 180° pair in Row 1!',
    highlightCells: [2, 5, 8],
    formulaBadge: '3수: 3열 MX 복원',
    formulaText: 'Col₃ ➔ MX (원복)',
    formulaDesc: '3열 반사를 복원하여 1행 180° 쌍 상쇄를 완성합니다.'
  }
]);

// 6. [공식 6: 대각선 모서리 180° 쌍(Pair) 소거 공식 (Diagonal 180° Pair)]
// 주대각선 [0번, 8번] 모서리만 180° 회전된 상태에서 주대각 MD -> 1행 R180 -> 3열 R180 -> 주대각 MD
const diagonal180InitialBoard: D4Op[] = [
  D4.R180, D4.ID, D4.ID,
  D4.ID,   D4.ID, D4.ID,
  D4.ID,   D4.ID, D4.R180
];

const diagonal180PairSteps = createInteractiveSteps(diagonal180InitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MD,
    actionDescKo: '주대각선 사선 반사 (MD 사선밀기)',
    actionDescEn: 'Main Diagonal Reflection (MD)',
    mathInsightKo: '양 코너 타일이 R180 ∘ MD = MAD로 전이되며 대각 축 켤레 변환 준비',
    mathInsightEn: 'Corner tiles transition to MAD via R180 ∘ MD, preparing diagonal conjugation',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 MD',
    formulaText: 'Diag ➔ MD',
    formulaDesc: '주대각선 사선 반사를 적용합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R180,
    actionDescKo: '1행 180° 회전 (R180 더블탭)',
    actionDescEn: 'Row 1 Rotate 180° (R180)',
    mathInsightKo: '1행 1열 코너 타일이 MAD ∘ R180 = MD 상태로 정렬',
    mathInsightEn: 'Row 1 Col 1 corner aligns to MD via MAD ∘ R180 = MD',
    highlightCells: [0, 1, 2],
    formulaBadge: '2수: 1행 R180',
    formulaText: 'Row₁ ➔ R180',
    formulaDesc: '1행 180° 회전으로 1열 모서리 위상을 정렬합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.R180,
    actionDescKo: '3열 180° 회전 (R180 더블탭)',
    actionDescEn: 'Col 3 Rotate 180° (R180)',
    mathInsightKo: '3행 3열 코너 타일이 MAD ∘ R180 = MD 상태로 정렬되며 2번 셀 ID 복구',
    mathInsightEn: 'Row 3 Col 3 corner aligns to MD via MAD ∘ R180 = MD and cell 2 restores',
    highlightCells: [2, 5, 8],
    formulaBadge: '3수: 3열 R180',
    formulaText: 'Col₃ ➔ R180',
    formulaDesc: '3열 180° 회전으로 3열 모서리 위상을 정렬합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MD,
    actionDescKo: '주대각선 사선 반사 복원 (MD 사선밀기)',
    actionDescEn: 'Main Diagonal Reflection Restore (MD)',
    mathInsightKo: 'MD ∘ MD = ID로 0번, 8번 코너 및 4번 중심이 모두 깔끔하게 ID로 동시 소거 완성!',
    mathInsightEn: 'Via MD² = ID, corners 0, 8 and center 4 restore to ID: 180° pair eliminated!',
    highlightCells: [0, 4, 8],
    formulaBadge: '4수: 주대각 MD 복원',
    formulaText: 'Diag ➔ MD (원복)',
    formulaDesc: '주대각선을 복원하여 양 끝 모서리 180° 쌍을 동시 소거합니다.'
  }
]);

// 7. [기초 법칙 1: 반사 + 반사 = 회전 인터랙티브 스텝]
const basicsReflectionCompSteps = createInteractiveSteps(emptyBoard, [
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '2행 상하 반전 (MX 가로밀기)',
    actionDescEn: 'Row 2 Vertical Flip (MX)',
    mathInsightKo: '2행 타일들이 거울 반전(MX) 상태가 됨',
    mathInsightEn: 'Row 2 tiles enter reflection state (MX)',
    highlightCells: [3, 4, 5],
    formulaBadge: '1수: 2행 MX',
    formulaText: 'Row₂ ➔ MX',
    formulaDesc: '2행 타일들에 가로 반사(상하 반전)를 적용합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MY,
    actionDescKo: '2열 좌우 반전 (MY 세로밀기)',
    actionDescEn: 'Col 2 Horizontal Flip (MY)',
    mathInsightKo: '교차점(중심 타일 4번)에서 MX ∘ MY = R180 순수 회전으로 합성!',
    mathInsightEn: 'At intersection tile 4, MX ∘ MY = R180 synthesizes pure rotation!',
    highlightCells: [4],
    formulaBadge: '2수: 2열 MY',
    formulaText: 'MX ∘ MY = R180',
    formulaDesc: '수직인 두 반사가 결합하여 180° 점대칭 회전으로 합성됩니다!'
  }
]);

// 6. [기초 법칙 2: 대칭원의 자기 상쇄 (A² = ID) 인터랙티브 스텝]
const basicsSelfInverseSteps = createInteractiveSteps(emptyBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '1행 상하 반전 (MX 가로밀기)',
    actionDescEn: 'Row 1 Vertical Flip (MX)',
    mathInsightKo: '1행 전체(0, 1, 2번 타일)가 반사 상태로 전이',
    mathInsightEn: 'Row 1 tiles transition to reflection state',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 1행 MX',
    formulaText: 'Row₁ ➔ MX',
    formulaDesc: '1행의 세 타일이 상하 거울 반전(MX) 상태가 됩니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '1행 상하 반전 동일 조작 재적용 (MX)',
    actionDescEn: 'Row 1 Vertical Flip Repeated (MX)',
    mathInsightKo: 'MX ∘ MX = ID 성질에 의해 원래의 0번(항등원)으로 완벽 복원!',
    mathInsightEn: 'By MX ∘ MX = ID, tiles perfectly restore to 0 (identity)!',
    highlightCells: [0, 1, 2],
    formulaBadge: '2수: 1행 MX 재적용',
    formulaText: 'MX² = ID (자기상쇄)',
    formulaDesc: '동일 라인에 같은 반사를 적용하면 즉시 원래 상태로 원상 복구됩니다!'
  }
]);

// 8. [3단계 마스터 일반 해법 인터랙티브 스텝]
// 초기 상태: 외곽 소거, 반사 정리, 피니시 대상이 섞여 있는 스크램블
const master3StepInitialBoard: D4Op[] = [
  D4.MX, D4.MX, D4.R180,
  D4.R180, D4.R180, D4.MX,
  D4.ID, D4.ID, D4.MY
];

const masterMethod3StepSteps = createInteractiveSteps(master3StepInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '1단계: 1행 상하 반전 (외곽 1행 소거)',
    actionDescEn: 'Step 1: Row 1 Vertical Flip (Outer Row 1 Reduction)',
    mathInsightKo: '가장 먼저 외곽 라인을 맞춰 0번, 1번 타일을 항등원(ID)으로 즉시 소거합니다.',
    mathInsightEn: 'Align boundary lines first, immediately resolving tiles 0 and 1 to Identity (ID).',
    highlightCells: [0, 1, 2],
    formulaBadge: '1단계: 외곽 소거',
    formulaText: 'Row₁ ➔ MX',
    formulaDesc: '외곽 타일을 먼저 맞추어 미해결 영역을 중앙과 특정 열로 좁힙니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.MY,
    actionDescKo: '2단계: 3열 좌우 반전 (반사 성분 짝맞춤 정리)',
    actionDescEn: 'Step 2: Col 3 Horizontal Flip (Reflection Parity Cleanup)',
    mathInsightKo: '직교 반사(MY)를 합성하여 뒤집힌 외곽 타일(2번, 8번)을 정리하고 남은 타일을 순수 회전으로 수렴시킵니다.',
    mathInsightEn: 'Compose orthogonal reflection (MY) to clean outer tiles (2, 8) and convert remaining tiles into pure rotations.',
    highlightCells: [2, 5, 8],
    formulaBadge: '2단계: 반사 정리',
    formulaText: 'Col₃ ➔ MY',
    formulaDesc: '반사 성분을 정리하여 외곽을 모두 맞추고 마지막 1개 라인으로 피니시 환경을 구축합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R180,
    actionDescKo: '3단계: 2행 180° 회전 (피니시 공식 올클리어)',
    actionDescEn: 'Step 3: Row 2 Rotate 180° (Surgical Finish Formula)',
    mathInsightKo: 'R180의 위수 2 자기상쇄(Involution)를 이용하여 남은 2행 전체를 0번(ID)으로 올클리어!',
    mathInsightEn: 'Utilize order-2 self-inverse of R180 to finish the entire remaining line into 100% ID!',
    highlightCells: [3, 4, 5],
    formulaBadge: '3단계: 피니시 공식',
    formulaText: 'Row₂ ➔ R180 ➔ 100% 클리어',
    formulaDesc: '남아있는 고립 라인/타일에 피니시 공식을 적용하여 퍼즐을 완벽하게 완성합니다!'
  }
]);

// 9. [90° 회전 패리티 법칙 & 3-Cycle 인터랙티브 스텝]
const parity90CycleSteps = createInteractiveSteps(emptyBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1수: 1행 90° 시계 회전 (3개 타일 동시 발생)',
    actionDescEn: 'Move 1: Row 1 Rotate 90° (3 Tiles Triplet Generated)',
    mathInsightKo: '90° 회전은 단독 1개나 2개만 생길 수 없으며, 반드시 최소 3개 단위(3-Cycle)로 발생합니다.',
    mathInsightEn: '90° rotation can never occur on isolated 1 or 2 tiles; it always occurs in units of at least 3 tiles (3-Cycle).',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 90° 3-Cycle 발생',
    formulaText: 'Row₁ ➔ R90',
    formulaDesc: '1행 3개 타일에 90° 회전이 동시에 부여되어 최소 회전 단위 패리티를 증명합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.R270,
    actionDescKo: '2수: 3행 270° 회전 (90° + 270° 상쇄쌍 형성)',
    actionDescEn: 'Move 2: Row 3 Rotate 270° (90° + 270° Cancellation Pair)',
    mathInsightKo: '1행(+90°)과 3행(-90°/270°)의 회전각 합은 360° ≡ 0°이 되어 전체 패리티 보존 상쇄쌍을 이룹니다.',
    mathInsightEn: 'The sum of Row 1 (+90°) and Row 3 (270° / -90°) equals 360° ≡ 0°, forming a conserved parity pair.',
    highlightCells: [6, 7, 8],
    formulaBadge: '2수: 상쇄쌍 형성',
    formulaText: 'Row₃ ➔ R270',
    formulaDesc: '+90°와 +270°가 결합하여 큐브 전체 각도 불변량을 만족하는 상쇄쌍을 형성합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R270,
    actionDescKo: '3수: 1행 270° 역회전 (90° 3개 원샷 3-Cycle 해결)',
    actionDescEn: 'Move 3: Row 1 Rotate 270° (90° Triplet One-Shot 3-Cycle Clear)',
    mathInsightKo: 'R90 ∘ R270 = ID 성질로 1행 3개 타일이 단 1수로 동시 해결됩니다!',
    mathInsightEn: 'Via R90 ∘ R270 = ID, the 3 tiles of Row 1 resolve simultaneously in a single stroke!',
    highlightCells: [0, 1, 2],
    formulaBadge: '3수: 90° 3개 원샷 해결',
    formulaText: 'Row₁ ➔ R270 ➔ ID',
    formulaDesc: '1행 3개 타일이 90° 역원 조작으로 즉시 0번(ID)으로 올클리어 복원됩니다.'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '4수: 3행 90° 회전 (상쇄쌍 잔여 타일 올클리어 완성)',
    actionDescEn: 'Move 4: Row 3 Rotate 90° (Cancellation Pair Final Full Clear)',
    mathInsightKo: 'R270 ∘ R90 = ID로 3행 타일까지 모두 0번으로 복원되어 전 타일 완전 클리어!',
    mathInsightEn: 'Via R270 ∘ R90 = ID, Row 3 fully restores to ID, completing 100% board clearance!',
    highlightCells: [6, 7, 8],
    formulaBadge: '4수: 전 타일 복원',
    formulaText: 'Row₃ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '상쇄쌍의 반대편 270° 타일들까지 모두 회수되어 보드가 완전 해결됩니다.'
  }
]);

// 10. [실전 1위: L자형 5개 에러 2수 피니시 인터랙티브 스텝]
// 초기 보드: Row1(MX) + Col1(MY) 적용 상태 -> 교차점 셀 0은 R180, 셀 1, 2는 MX, 셀 3, 6은 MY
const finishLShapeInitialBoard: D4Op[] = [
  D4.R180, D4.MX, D4.MX,
  D4.MY,   D4.ID, D4.ID,
  D4.MY,   D4.ID, D4.ID
];

const finishLShapeSteps = createInteractiveSteps(finishLShapeInitialBoard, [
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.MY,
    actionDescKo: '1수: 1열 좌우 반전 (MY 세로밀기)',
    actionDescEn: 'Move 1: Col 1 Horizontal Flip (MY Vertical Swipe)',
    mathInsightKo: '1열의 3, 6번 타일이 MY² = ID로 복구되고, 코너 0번 타일은 R180 ∘ MY = MX로 전이되어 1행 전체가 MX로 동기화됩니다.',
    mathInsightEn: 'Col 1 tiles (3, 6) restore via MY² = ID, and corner tile 0 becomes R180 ∘ MY = MX, aligning Row 1 uniformly to MX.',
    highlightCells: [0, 3, 6],
    formulaBadge: '1수: 1열 MY',
    formulaText: 'Col₁ ➔ MY',
    formulaDesc: '1열 세로밀기로 1열의 에러를 잡고 코너 위상을 1행과 정렬합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '2수: 1행 상하 반전 (MX 가로밀기)',
    actionDescEn: 'Move 2: Row 1 Vertical Flip (MX Horizontal Swipe)',
    mathInsightKo: '동기화된 1행의 0, 1, 2번 타일이 MX² = ID로 일괄 소거되며 전 타일 100% 올클리어 완성!',
    mathInsightEn: 'All tiles (0, 1, 2) in Row 1 clear simultaneously via MX² = ID, completing 100% board clearance!',
    highlightCells: [0, 1, 2],
    formulaBadge: '2수: 1행 MX 피니시',
    formulaText: 'Row₁ ➔ MX ➔ 100% 클리어',
    formulaDesc: '1행 가로밀기로 남아있던 1행 전체를 정위치로 일괄 복원합니다.'
  }
]);

// 11. [실전 2위: 십자 날개 엇갈림 4개 에러 2수 피니시 인터랙티브 스텝]
// 초기 보드: Row2(R180) + Col2(R180) -> 중심(4번)은 R180² = ID 상쇄, 상하좌우 날개(1, 3, 5, 7)만 R180
const finishWingCrossInitialBoard: D4Op[] = [
  D4.ID,   D4.R180, D4.ID,
  D4.R180, D4.ID,   D4.R180,
  D4.ID,   D4.R180, D4.ID
];

const finishWingCrossSteps = createInteractiveSteps(finishWingCrossInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R180,
    actionDescKo: '1수: 2행 180° 회전 (R180 더블탭)',
    actionDescEn: 'Move 1: Row 2 Rotate 180° (R180 Double Tap)',
    mathInsightKo: '좌우 날개(3, 5번)가 R180² = ID로 즉시 정위치 복원되며, 중심 타일(4번)은 R180 상태로 임시 전이됩니다.',
    mathInsightEn: 'Left and right wings (3, 5) restore via R180² = ID, and the center tile temporarily becomes R180.',
    highlightCells: [3, 4, 5],
    formulaBadge: '1수: 2행 R180',
    formulaText: 'Row₂ ➔ R180',
    formulaDesc: '2행 더블탭으로 좌우 날개를 맞추고 중심 타일을 임시 전이시킵니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.R180,
    actionDescKo: '2수: 2열 180° 회전 (R180 더블탭)',
    actionDescEn: 'Move 2: Col 2 Rotate 180° (R180 Double Tap)',
    mathInsightKo: '상하 날개(1, 7번)가 복원되고, 중심 4번 타일은 R180 ∘ R180 = ID로 자기상쇄되어 전 타일 100% ID 완성!',
    mathInsightEn: 'Top and bottom wings (1, 7) restore, and center tile cancels out via R180² = ID to complete 100% board clearance!',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 R180 피니시',
    formulaText: 'Col₂ ➔ R180 ➔ 100% 클리어',
    formulaDesc: '2열 더블탭으로 상하 날개와 중심을 동시 소거하여 퍼즐을 완성합니다.'
  }
]);

// 12. [실전 3위: 반사-회전 하이브리드 L자 동시소거 2수 피니시 인터랙티브 스텝]
// 초기 보드: Row1(R180) + Col1(MX) -> 교차점 0번은 R180 ∘ MX = MY, 1행(1, 2번)은 R180, 1열(3, 6번)은 MX
const finishHybridInitialBoard: D4Op[] = [
  D4.MY,   D4.R180, D4.R180,
  D4.MX,   D4.ID,   D4.ID,
  D4.MX,   D4.ID,   D4.ID
];

const finishHybridSteps = createInteractiveSteps(finishHybridInitialBoard, [
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '1수: 1열 상하 반전 (MX 가로밀기)',
    actionDescEn: 'Move 1: Col 1 Vertical Flip (MX Horizontal Swipe)',
    mathInsightKo: '1열의 3, 6번 반사 타일이 MX² = ID로 소거되고, 교차점 0번 타일은 MY ∘ MX = R180 순수 회전으로 변환되어 1행 전체가 R180으로 동기화됩니다.',
    mathInsightEn: 'Col 1 reflection tiles (3, 6) cancel via MX² = ID, and corner tile 0 converts to pure rotation MY ∘ MX = R180, aligning Row 1 uniformly to R180.',
    highlightCells: [0, 3, 6],
    formulaBadge: '1수: 1열 MX',
    formulaText: 'Col₁ ➔ MX',
    formulaDesc: '1열 가로밀기로 반사 에러를 소거하고 코너 타일을 순수 회전으로 전환합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R180,
    actionDescKo: '2수: 1행 180° 회전 (R180 더블탭)',
    actionDescEn: 'Move 2: Row 1 Rotate 180° (R180 Double Tap)',
    mathInsightKo: '순수 회전으로 정렬된 1행의 0, 1, 2번 타일이 R180² = ID로 한 방에 상쇄되며 전 타일 100% ID 올클리어 완성!',
    mathInsightEn: 'All tiles (0, 1, 2) in Row 1 clear simultaneously via R180² = ID, completing 100% board clearance!',
    highlightCells: [0, 1, 2],
    formulaBadge: '2수: 1행 R180 피니시',
    formulaText: 'Row₁ ➔ R180 ➔ 100% 클리어',
    formulaDesc: '1행 더블탭으로 남은 1행 전체를 정위치로 일괄 복원합니다.'
  }
]);

// 13. [4코너 올킬 3수 파괴 공식 인터랙티브 스텝]
// 초기 보드: 4개 모서리(0, 2, 6, 8)가 MX, 중심(4)이 R180
const quadCornerInitialBoard: D4Op[] = [
  D4.MX,   D4.ID,   D4.MX,
  D4.ID,   D4.R180, D4.ID,
  D4.MX,   D4.ID,   D4.MX
];

const quadCornerSteps = createInteractiveSteps(quadCornerInitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MAD,
    actionDescKo: '1수: 주대각선 부대각 반사 (MAD)',
    actionDescEn: 'Move 1: Main Diagonal Anti-Diagonal Flip (MAD)',
    mathInsightKo: '0, 8번 코너가 MX ∘ MAD = R270으로 전이되고, 중심 4번은 R180 ∘ MAD = MD로 변환됩니다.',
    mathInsightEn: 'Corners 0 and 8 transition to MX ∘ MAD = R270, while center tile 4 converts to R180 ∘ MAD = MD.',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 MAD',
    formulaText: 'Diag(Main) ➔ MAD',
    formulaDesc: '주대각선에 MAD를 적용하여 0, 8번 코너를 270° 회전 상태로 유도합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.MX,
    actionDescKo: '2수: 부대각선 상하 반전 (MX)',
    actionDescEn: 'Move 2: Anti-Diagonal Vertical Flip (MX)',
    mathInsightKo: '부대각선 코너(2, 6번)가 MX² = ID로 즉시 소거되고, 중심 4번은 MD ∘ MX = R270으로 변환되어 주대각선 전체(0, 4, 8)가 R270으로 완벽 동기화됩니다.',
    mathInsightEn: 'Anti-diagonal corners (2, 6) instantly clear via MX² = ID, and center tile converts to MD ∘ MX = R270, synchronizing the entire main diagonal (0, 4, 8) to R270.',
    highlightCells: [2, 4, 6],
    formulaBadge: '2수: 부대각 MX',
    formulaText: 'Diag(Anti) ➔ MX',
    formulaDesc: '부대각선 코너 2개를 즉각 클리어하고, 주대각선 3개 타일을 R270으로 동기화합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.R90,
    actionDescKo: '3수: 주대각선 90° 회전 (R90 피니시)',
    actionDescEn: 'Move 3: Main Diagonal Rotate 90° (R90 Finish)',
    mathInsightKo: '주대각선에 동기화되었던 0, 4, 8번 타일이 R270 ∘ R90 = ID로 일괄 소거되며 보드 전체 100% 올클리어 완성!',
    mathInsightEn: 'Synchronized tiles (0, 4, 8) on the main diagonal resolve simultaneously via R270 ∘ R90 = ID, completing 100% board clearance!',
    highlightCells: [0, 4, 8],
    formulaBadge: '3수: 주대각 R90 피니시',
    formulaText: 'Diag(Main) ➔ R90 ➔ 100% 클리어',
    formulaDesc: '주대각선 90° 시계 회전으로 남아있는 3개 타일을 정위치로 일괄 복원합니다.'
  }
]);

// 14. [사선 척추-외곽 상쇄 3수 공식 인터랙티브 스텝]
// 초기 보드: 1행 모서리(0, 2)가 MAD, 척추(4, 7)가 MD
const diagSpineFlushInitialBoard: D4Op[] = [
  D4.MAD, D4.ID, D4.MAD,
  D4.ID,  D4.MD, D4.ID,
  D4.ID,  D4.MD, D4.ID
];

const diagSpineFlushSteps = createInteractiveSteps(diagSpineFlushInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.MY,
    actionDescKo: '1수: 1행 좌우 반전 (MY 세로밀기)',
    actionDescEn: 'Move 1: Row 1 Horizontal Flip (MY Vertical Swipe)',
    mathInsightKo: '1행 모서리(0, 2번)가 MAD ∘ MY = R270으로 전이되고, 중앙 1번 타일은 MY 상태가 됩니다.',
    mathInsightEn: 'Row 1 corners (0, 2) transition to MAD ∘ MY = R270, and center tile 1 becomes MY.',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 1행 MY',
    formulaText: 'Row₁ ➔ MY',
    formulaDesc: '1행 좌우 반전으로 모서리 사선 반사를 270° 회전으로 전환합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MD,
    actionDescKo: '2수: 2열 주대각 반사 (MD)',
    actionDescEn: 'Move 2: Col 2 Main Diagonal Flip (MD)',
    mathInsightKo: '척추 라인의 4, 7번 타일이 MD² = ID로 즉시 동시 소거되고, 교차점 1번 타일은 MY ∘ MD = R270으로 변환되어 1행 전체(0, 1, 2)가 R270으로 완벽 동기화됩니다.',
    mathInsightEn: 'Spine tiles (4, 7) eliminate via MD² = ID, and intersection tile 1 converts to MY ∘ MD = R270, synchronizing all Row 1 tiles (0, 1, 2) to R270.',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 MD 척추 상쇄',
    formulaText: 'Col₂ ➔ MD',
    formulaDesc: '2열 척추 라인을 일괄 소거하고 교차점 1번 타일을 1행과 동기화합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '3수: 1행 90° 회전 (R90 피니시)',
    actionDescEn: 'Move 3: Row 1 Rotate 90° (R90 Finish)',
    mathInsightKo: '동기화된 1행의 0, 1, 2번 타일이 R270 ∘ R90 = ID로 일괄 소거되며 보드 전체 100% 올클리어 완성!',
    mathInsightEn: 'Synchronized Row 1 tiles (0, 1, 2) resolve simultaneously via R270 ∘ R90 = ID, achieving 100% all-clear!',
    highlightCells: [0, 1, 2],
    formulaBadge: '3수: 1행 R90 피니시',
    formulaText: 'Row₁ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '1행 90° 시계 회전으로 남아있는 1행 전체를 정위치로 일괄 복원합니다.'
  }
]);

// 15. [다이아몬드 십자 3수 파괴 공식 인터랙티브 스텝]
// 초기 보드: 십자 에지와 대각 모서리가 결합된 다이아몬드 십자 형태
const diamondCrossInitialBoard: D4Op[] = [
  D4.MD, D4.MY,  D4.ID,
  D4.MX, D4.MAD, D4.MX,
  D4.ID, D4.MY,  D4.MD
];

const diamondCrossSteps = createInteractiveSteps(diamondCrossInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '1수: 2행 상하 반전 (MX)',
    actionDescEn: 'Move 1: Row 2 Vertical Flip (MX)',
    mathInsightKo: '2행의 좌우 에지(3, 5번)가 MX² = ID로 즉시 소거되고, 중심 4번은 MAD ∘ MX = R90으로 변환됩니다.',
    mathInsightEn: 'Row 2 left/right edges (3, 5) clear via MX² = ID, and center 4 transitions via MAD ∘ MX = R90.',
    highlightCells: [3, 4, 5],
    formulaBadge: '1수: 2행 MX',
    formulaText: 'Row₂ ➔ MX',
    formulaDesc: '2행 상하 반전으로 좌우 에지를 소거하고 중심 타일을 90° 위상으로 전환합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MY,
    actionDescKo: '2수: 2열 좌우 반전 (MY)',
    actionDescEn: 'Move 2: Col 2 Horizontal Flip (MY)',
    mathInsightKo: '2열의 상하 에지(1, 7번)가 MY² = ID로 소거되고, 중심 4번은 R90 ∘ MY = MD로 변환되어 주대각선 전체(0, 4, 8)가 MD로 동기화됩니다.',
    mathInsightEn: 'Col 2 top/bottom edges (1, 7) clear via MY² = ID, and center 4 converts to MD, synchronizing main diagonal (0, 4, 8) to MD.',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 MY',
    formulaText: 'Col₂ ➔ MY',
    formulaDesc: '2열 좌우 반전으로 상하 에지를 소거하고 주대각선 3개 타일을 MD로 동기화합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MD,
    actionDescKo: '3수: 주대각선 주대각 반사 (MD 피니시)',
    actionDescEn: 'Move 3: Main Diagonal Reflection (MD Finish)',
    mathInsightKo: '주대각선에 정렬된 0, 4, 8번 타일이 MD² = ID로 일괄 소거되며 보드 전체 100% 올클리어 완성!',
    mathInsightEn: 'Synchronized tiles (0, 4, 8) on the main diagonal resolve via MD² = ID, completing 100% all-clear!',
    highlightCells: [0, 4, 8],
    formulaBadge: '3수: 주대각 MD 피니시',
    formulaText: 'Diag(Main) ➔ MD ➔ 100% 클리어',
    formulaDesc: '주대각선 대칭 반사로 남아있는 대각선 전체를 정위치로 일괄 복원합니다.'
  }
]);

// 16. [ㄱ자 사선연계 3수 공식 인터랙티브 스텝]
// 초기 보드: 1행과 1열의 'ㄱ자' 테두리와 부대각선이 얽힌 형태
const lDiagCascadeInitialBoard: D4Op[] = [
  D4.R180, D4.MY,  D4.R270,
  D4.MX,   D4.MAD, D4.ID,
  D4.R90,  D4.ID,  D4.ID
];

const lDiagCascadeSteps = createInteractiveSteps(lDiagCascadeInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.MY,
    actionDescKo: '1수: 1행 좌우 반전 (MY)',
    actionDescEn: 'Move 1: Row 1 Horizontal Flip (MY)',
    mathInsightKo: '1행의 1번 에지가 MY² = ID로 소거되고, 코너 0번은 MX, 2번은 MAD로 변환됩니다.',
    mathInsightEn: 'Row 1 edge 1 clears via MY² = ID; corner 0 transitions to MX and corner 2 to MAD.',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 1행 MY',
    formulaText: 'Row₁ ➔ MY',
    formulaDesc: '1행 좌우 반전으로 1번 타일을 소거하고 코너의 위상을 정렬합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.MX,
    actionDescKo: '2수: 1열 상하 반전 (MX)',
    actionDescEn: 'Move 2: Col 1 Vertical Flip (MX)',
    mathInsightKo: '1열의 0, 3번 타일이 MX² = ID로 동시 소거되고, 6번 타일은 R90 ∘ MX = MAD로 변환되어 부대각선(2, 4, 6)이 모두 MAD로 통일됩니다.',
    mathInsightEn: 'Col 1 tiles 0 and 3 eliminate via MX² = ID, and tile 6 becomes MAD, unifying the entire anti-diagonal (2, 4, 6) into MAD.',
    highlightCells: [0, 3, 6],
    formulaBadge: '2수: 1열 MX',
    formulaText: 'Col₁ ➔ MX',
    formulaDesc: '1열 상하 반전으로 1열을 완전 소거하고 부대각선 전체를 MAD로 동기화합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.MAD,
    actionDescKo: '3수: 부대각선 부대각 반사 (MAD 피니시)',
    actionDescEn: 'Move 3: Anti-Diagonal Reflection (MAD Finish)',
    mathInsightKo: '동기화된 부대각선(2, 4, 6번) 타일이 MAD² = ID로 일괄 소거되며 보드 전체 100% 올클리어 완성!',
    mathInsightEn: 'Synchronized anti-diagonal tiles (2, 4, 6) eliminate simultaneously via MAD² = ID, achieving 100% all-clear!',
    highlightCells: [2, 4, 6],
    formulaBadge: '3수: 부대각 MAD 피니시',
    formulaText: 'Diag(Anti) ➔ MAD ➔ 100% 클리어',
    formulaDesc: '부대각선 반사로 남아있는 부대각선 3개 타일을 정위치로 일괄 복원합니다.'
  }
]);

// 17. [X-크로스 3수 공식 인터랙티브 스텝]
// 초기 보드: 주대각선, 부대각선 교차와 2행 날개가 결합된 X자 대칭 패턴
const xCrossInitialBoard: D4Op[] = [
  D4.MD,   D4.ID,  D4.MAD,
  D4.R180, D4.ID,  D4.R180,
  D4.MAD,  D4.ID,  D4.MD
];

const xCrossSteps = createInteractiveSteps(xCrossInitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MD,
    actionDescKo: '1수: 주대각선 주대각 반사 (MD)',
    actionDescEn: 'Move 1: Main Diagonal Reflection (MD)',
    mathInsightKo: '주대각선 코너(0, 8번)가 MD² = ID로 즉시 소거되고, 중심 4번 타일은 ID ∘ MD = MD 상태로 변환됩니다.',
    mathInsightEn: 'Main diagonal corners (0, 8) instantly clear via MD² = ID, and center tile 4 becomes MD.',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 MD',
    formulaText: 'Diag(Main) ➔ MD',
    formulaDesc: '주대각선 반사로 0, 8번 코너를 소거하고 중심 타일을 전이합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.MAD,
    actionDescKo: '2수: 부대각선 부대각 반사 (MAD)',
    actionDescEn: 'Move 2: Anti-Diagonal Reflection (MAD)',
    mathInsightKo: '부대각선 코너(2, 6번)가 MAD² = ID로 즉시 소거되고, 중심 4번은 MD ∘ MAD = R180으로 합성되어 2행 전체(3, 4, 5)가 R180으로 동기화됩니다.',
    mathInsightEn: 'Anti-diagonal corners (2, 6) clear via MAD² = ID, and center 4 composes into MD ∘ MAD = R180, synchronizing all Row 2 tiles (3, 4, 5) to R180.',
    highlightCells: [2, 4, 6],
    formulaBadge: '2수: 부대각 MAD',
    formulaText: 'Diag(Anti) ➔ MAD',
    formulaDesc: '부대각선 코너를 소거하고 2행(3, 4, 5) 전체를 180° 회전으로 통일합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.R180,
    actionDescKo: '3수: 2행 180° 회전 (R180 피니시)',
    actionDescEn: 'Move 3: Row 2 Rotate 180° (R180 Finish)',
    mathInsightKo: '동기화된 2행의 3, 4, 5번 타일이 R180² = ID로 일괄 소거되며 보드 전체 100% 올클리어 완성!',
    mathInsightEn: 'Synchronized Row 2 tiles (3, 4, 5) resolve via R180² = ID, completing 100% board clearance!',
    highlightCells: [3, 4, 5],
    formulaBadge: '3수: 2행 R180 피니시',
    formulaText: 'Row₂ ➔ R180 ➔ 100% 클리어',
    formulaDesc: '2행 더블탭으로 남아있는 2행 전체를 정위치로 일괄 복원합니다.'
  }
]);


const BASE_FORMULAS: FormulaItem[] = [
  {
    id: 'master-method-3step',
    titleKo: '3단계 마스터 일반 해법',
    titleEn: '3-Step Master General Method',
    category: 'beginner',
    badgeKo: '3단계 일반 해법',
    badgeEn: '3-Step Method',
    difficulty: 2,
    formulaSeq: '1단계 외곽소거 ➔ 2단계 반사정리 ➔ 3단계 피니시 공식',
    summaryKo: '수백 개의 공식을 외울 필요 없이 [1단계: 외곽 소거] ➔ [2단계: 반사 정리] ➔ [3단계: 피니시 공식] 단 3단계 구조화 해법으로 어떤 스크램블이든 100% 풀어내는 갈루아 큐브의 정석 마스터 해법입니다.',
    summaryEn: 'No need to memorize hundreds of formulas: solve any scrambled state via [Step 1: Outer Reduction] ➔ [Step 2: Reflection Cleanup] ➔ [Step 3: Surgical Finish Formula].',
    diagramType: 'interactive',
    steps: masterMethod3StepSteps,
    latexFormula: '\\text{State} \\xrightarrow{\\text{Outer Reduction}} \\text{Clean Boundary} \\xrightarrow{\\text{Reflection Conjugation}} \\text{Pure Rotation} \\xrightarrow{\\text{Finish Commutator}} \\text{ID}',
    notesKo: [
      '1단계 [외곽 소거]: 외곽 행과 열을 우선적으로 스와이프하여 모서리 타일들을 일치시킵니다. 다른 영역이 흐트러지는 것을 두려워하지 마세요.',
      '2단계 [반사 정리]: 뒷면(거울 반사) 타일들을 직교 반사(MX, MY) 짝맞춤을 통해 앞면(순수 회전) 상태로 승화시킵니다.',
      '3단계 [피니시 공식]: 남은 1~3개의 국소 타일은 중심 180° 반전 공식, 180° 쌍 상쇄 공식, 또는 3-Cycle 교환자로 깔끔하게 마무리합니다.'
    ],
    notesEn: [
      'Step 1 [Outer Reduction]: Align outer rows and columns first. Do not fear temporary disturbances in untouched areas.',
      'Step 2 [Reflection Cleanup]: Pair perpendicular reflections (MX, MY) to flip mirror tiles into pure rotations.',
      'Step 3 [Finish Formulas]: Resolve the remaining 1-3 isolated tiles using Center Inversion, 180° Pair, or 3-Cycle Commutator.'
    ],
    tags: ['마스터 해법', '일반 해법', '3단계 공략', '초보자 추천', '외곽소거', '구조적 해법'],
    isInteractive: true
  },
  {
    id: 'parity-90-cycle',
    titleKo: '90° 회전 패리티 법칙 & 3-Cycle 해법',
    titleEn: '90° Rotation Parity Law & 3-Cycle Solution',
    category: 'intermediate',
    badgeKo: '90° 패리티 법칙',
    badgeEn: '90° Parity & 3-Cycle',
    difficulty: 3,
    formulaSeq: '90° 1개/2개 ➔ 불가능(패리티 위반), 90° 3개 ➔ 3-Cycle 가능, 90°+270° ➔ 상쇄쌍',
    summaryKo: '갈루아 큐브에서 90° 회전 타일은 1개나 2개만 단독으로 존재할 수 없으며(패리티 위반), 반드시 [3개 동시 순환(3-Cycle)] 또는 [90° + 270° 상쇄쌍] 형태로만 존재합니다. 3-Cycle 원샷 조작으로 완벽하게 해결할 수 있습니다.',
    summaryEn: 'Isolated 1 or 2 90° rotated tiles are mathematically impossible in Galois Cube due to parity laws. 90° rotations always exist as [3-Cycle Triplets] or [90° + 270° Cancellation Pairs], resolvable in one shot.',
    diagramType: 'interactive',
    steps: parity90CycleSteps,
    latexFormula: '\\sum_{k} \\theta_k \\equiv 0 \\pmod{360^\\circ} \\quad (\\text{Parity Conservation})',
    notesKo: [
      'Q: "90° 회전된 타일이 딱 1개(또는 2개)만 남았는데 버그인가요?" ➔ A: 패리티 불변량 법칙상 정상적인 조작에서는 1개/2개 90° 상태가 절대 생길 수 없습니다. 반드시 다른 타일의 회전(270° 등)이나 반사가 쌍으로 숨어 있습니다!',
      '90° + 270° 상쇄쌍 원리: +90° 회전과 +270°(-90°) 회전의 합은 360° ≡ 0°으로 큐브 전체 각도 패리티를 완벽히 보존합니다.',
      '3-Cycle 원샷 해결: 같은 라인에 위치한 90° 타일 3개는 단 1수의 역회전(R270)으로 한 방에 올클리어됩니다.'
    ],
    notesEn: [
      'Q: "Is it a bug if only 1 or 2 tiles are 90° rotated?" ➔ A: Parity laws strictly forbid isolated 1 or 2 90° tiles in valid states. A paired rotation (like 270°) or reflection is always present!',
      '90° + 270° Cancellation Pair: +90° and +270° (-90°) sum to 360° ≡ 0°, strictly conserving the global angular parity.',
      '3-Cycle One-Shot Clear: Three 90° tiles on the same line are instantly resolved with a single reverse rotation (R270).'
    ],
    tags: ['패리티 법칙', '90도 공식', '3-Cycle', '상쇄쌍', '군론 불변량', '원샷 해법'],
    isInteractive: true
  },
  {
    id: 'finish-l-shape-5',
    titleKo: '[실전 1위] L자형 5개 에러 2수 피니시',
    titleEn: '[Rank #1] L-Shape 5-Tile Error 2-Move Finish',
    category: 'god-number',
    badgeKo: '실전 1위 피니시',
    badgeEn: 'Top #1 Finish',
    difficulty: 2,
    formulaSeq: '1열 MY ➔ 1행 MX = 전 타일 올클리어',
    summaryKo: '실전 게임에서 가장 빈번하게 발생하는 직교 2선 교차 패턴! 교차 코너 타일을 포함한 5개 에러를 [1열 세로밀기] ➔ [1행 가로밀기] 단 2수로 완벽하게 0번(정위치)으로 매듭짓는 실전 최다 빈출 피니시 공식입니다.',
    summaryEn: 'The most frequent pattern in actual matches: 2 perpendicular lines intersecting. Resolves 5 error tiles including the corner tile in just 2 moves: [Col 1 MY] ➔ [Row 1 MX] to achieve 100% all-clear.',
    diagramType: 'interactive',
    steps: finishLShapeSteps,
    latexFormula: '\\\\text{Col}_1(\\\\text{MY}) \\\\circ \\\\text{Row}_1(\\\\text{MX}) = \\\\text{ID}',
    notesKo: [
      'L자 형태로 5개 타일이 어긋났을 때 당황하지 마세요. 직교하는 두 선의 단 2수 피니시로 즉시 해결됩니다.',
      '1열의 반사를 먼저 풀어 코너 타일의 위상을 1행과 일치시킨 뒤, 1행을 한 방에 쓸어 담는 것이 핵심입니다.'
    ],
    notesEn: [
      'Do not panic when 5 tiles form an L-shaped error. It is solved cleanly in 2 moves using perpendicular lines.',
      'Resolve Col 1 first to align the corner tile orientation with Row 1, then sweep Row 1 in a single move.'
    ],
    tags: ['실전 피니시', '2수 피니시', 'L자형', '신의 수', 'TOP 3', '고빈출', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'finish-wing-cross-4',
    titleKo: '[실전 2위] 십자 날개 엇갈림 4개 에러 2수 피니시',
    titleEn: '[Rank #2] Wing Cross 4-Tile Misalignment 2-Move Finish',
    category: 'god-number',
    badgeKo: '실전 2위 피니시',
    badgeEn: 'Top #2 Finish',
    difficulty: 3,
    formulaSeq: '2행 R180 ➔ 2열 R180 = 전 타일 올클리어',
    summaryKo: '중심과 모서리는 모두 맞았는데 상하좌우 십자 날개(1, 3, 5, 7번) 4개 타일만 180° 회전된 고난도 대칭 난제! [2행 더블탭] ➔ [2열 더블탭] 2수로 중심 상쇄(R180² = ID)를 유도해 단 2수 만에 4개 날개를 동시 소거합니다.',
    summaryEn: 'A high-level dilemma where the center and 4 corners are solved, but the 4 cross wings (1, 3, 5, 7) are flipped by 180°. [Row 2 R180] ➔ [Col 2 R180] cancels out the center via R180² = ID and finishes all 4 wings in 2 moves.',
    diagramType: 'interactive',
    steps: finishWingCrossSteps,
    latexFormula: '\\\\text{Row}_2(\\\\text{R180}) \\\\circ \\\\text{Col}_2(\\\\text{R180}) = \\\\text{ID}',
    notesKo: [
      '중심을 공유하는 2행과 2열의 위수 2 회전이 교차점에서 자기상쇄(R180² = ID)되는 군론적 기적을 활용합니다.',
      '십자 날개 4개가 180°로 뒤집혀 있을 때 가장 빠르고 우아하게 끝내는 2수 비법입니다.'
    ],
    notesEn: [
      'Leverages the group miracle where order-2 rotations of Row 2 and Col 2 cancel out at the center (R180² = ID).',
      'The fastest and most elegant 2-move method when all 4 cross wings are flipped by 180°.'
    ],
    tags: ['실전 피니시', '2수 피니시', '십자 날개', '신의 수', 'TOP 3', 'R180 상쇄', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'finish-hybrid-cancel',
    titleKo: '[실전 3위] 반사-회전 하이브리드 L자 동시소거 2수 피니시',
    titleEn: '[Rank #3] Hybrid Reflection-Rotation L-Shape 2-Move Finish',
    category: 'god-number',
    badgeKo: '실전 3위 피니시',
    badgeEn: 'Top #3 Finish',
    difficulty: 3,
    formulaSeq: '1열 MX ➔ 1행 R180 = 전 타일 올클리어',
    summaryKo: '한쪽 줄은 뒤집힌 거울 반사(MX)이고 다른 쪽 줄은 머리가 돌아간 회전(R180)인 난감한 하이브리드 혼합 에러! [1열 가로밀기] ➔ [1행 더블탭] 2수로 반사 성분을 먼저 소거하며 교차점 위상을 회전으로 동기화시켜 단 2수로 올클리어합니다.',
    summaryEn: 'A tricky hybrid error where one line is mirror-reflected (MX) and the intersecting line is rotated (R180). [Col 1 MX] ➔ [Row 1 R180] eliminates reflection first, aligns the intersection phase to rotation, and resolves the entire board in 2 moves.',
    diagramType: 'interactive',
    steps: finishHybridSteps,
    latexFormula: '\\\\text{Col}_1(\\\\text{MX}) \\\\circ \\\\text{Row}_1(\\\\text{R180}) = \\\\text{ID}',
    notesKo: [
      '반사 타일과 회전 타일이 섞여 있을 때, 반사를 먼저 조작하여 교차점을 회전 성분으로 승화시키는 것이 하이브리드 해법의 본질입니다.',
      'D4 군론의 비가환성(MY ∘ MX = R180)을 역이용하여 반사 문제와 회전 문제를 동시에 해결하는 실전 고급 테크닉입니다.'
    ],
    notesEn: [
      'When reflection and rotation coexist, manipulating reflection first to elevate the intersection into rotation is the essence of hybrid solving.',
      'An advanced practical technique exploiting D4 non-commutativity (MY ∘ MX = R180) to resolve reflection and rotation simultaneously.'
    ],
    tags: ['실전 피니시', '2수 피니시', '하이브리드', '신의 수', 'TOP 3', '반사회전', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'quad-corner-finish',
    titleKo: '4코너 올킬 3수 파괴 공식',
    titleEn: 'Quad-Corner Annihilation 3-Move Finish',
    category: 'god-number',
    badgeKo: '4코너 올킬',
    badgeEn: 'Quad-Corner Kill',
    difficulty: 3,
    formulaSeq: '주대각 MAD ➔ 부대각 MX ➔ 주대각 R90 = 4코너 올클리어',
    summaryKo: '모든 코너(4개)가 거울 반사(MX)되고 중심이 180° 회전된 난공불락의 에러 패턴! [주대각 MAD] ➔ [부대각 MX] ➔ [주대각 R90] 단 3수로 4개 모서리와 중심을 일괄 소거하는 신의 수 파괴 공식입니다.',
    summaryEn: 'A formidable pattern where all 4 corners are mirror-reflected (MX) and the center is flipped by 180°. [Main Diag MAD] ➔ [Anti Diag MX] ➔ [Main Diag R90] annihilates all 4 corners and the center simultaneously in just 3 moves.',
    diagramType: 'interactive',
    steps: quadCornerSteps,
    latexFormula: '\\\\text{Diag}_M(\\\\text{MAD}) \\\\circ \\\\text{Diag}_A(\\\\text{MX}) \\\\circ \\\\text{Diag}_M(\\\\text{R90}) = \\\\text{ID}',
    notesKo: [
      '4개 코너 전체가 반사되어 있을 때 대각선 조작 2회와 회전 1회로 깔끔하게 정리하는 고급 대칭 공식입니다.',
      '부대각선 MX 조작으로 2, 6번 코너를 즉시 소거하고, 남은 주대각선 타일들을 동일 위상(R270)으로 통일하는 것이 핵심입니다.'
    ],
    notesEn: [
      'An advanced symmetry algorithm cleanly resolving all 4 reflected corners using two diagonal swipes and one rotation.',
      'The key is to immediately clear corners 2 and 6 with anti-diagonal MX, unifying the remaining main diagonal tiles into the same phase (R270).'
    ],
    tags: ['4코너 올킬', '3수 피니시', '대각선 공식', '신의 수', '고급 피니시', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'diagonal-spine-flush',
    titleKo: '사선 척추-외곽 상쇄 3수 공식',
    titleEn: 'Diagonal Spine-Perimeter Flush 3-Move Formula',
    category: 'god-number',
    badgeKo: '사선 척추 상쇄',
    badgeEn: 'Spine Flush',
    difficulty: 4,
    formulaSeq: '1행 MY ➔ 2열 MD ➔ 1행 R90 = 전 타일 올클리어',
    summaryKo: '1행 양쪽 모서리의 사선 반사(MAD)와 중앙 척추 라인(2열)의 사선 반사(MD)가 교차 결합된 난이도 높은 기하학적 엇갈림! [1행 MY] ➔ [2열 MD] ➔ [1행 R90] 3수로 사선 척추를 완전히 소거하고 1행을 동기화하여 올클리어합니다.',
    summaryEn: 'A high-difficulty geometric entanglement combining anti-diagonal reflections (MAD) on Row 1 edges with diagonal reflections (MD) along the spine (Col 2). [Row 1 MY] ➔ [Col 2 MD] ➔ [Row 1 R90] flushes the spine and synchronizes Row 1 for 100% clearance.',
    diagramType: 'interactive',
    steps: diagSpineFlushSteps,
    latexFormula: '\\\\text{Row}_1(\\\\text{MY}) \\\\circ \\\\text{Col}_2(\\\\text{MD}) \\\\circ \\\\text{Row}_1(\\\\text{R90}) = \\\\text{ID}',
    notesKo: [
      '사선 반사와 축 반사가 얽혀 있을 때, 척추 라인의 대칭 상쇄(MD² = ID)를 유도하는 것이 비법의 핵심입니다.',
      '교차점인 1번 타일의 위상을 MY ∘ MD = R270으로 합성하여 1행 전체를 한 번에 쓸어 담습니다.'
    ],
    notesEn: [
      'When diagonal and axial reflections intertwine, inducing symmetric cancellation along the spine (MD² = ID) is the key.',
      'Synthesizes intersection tile 1 phase via MY ∘ MD = R270 to sweep the entire Row 1 in a single final stroke.'
    ],
    tags: ['사선 척추 상쇄', '3수 피니시', '사선 반사', '신의 수', '척추 소거', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'diamond-cross-3m',
    titleKo: '다이아몬드 십자 3수 파괴 공식',
    titleEn: 'Diamond Cross 3-Move Break Formula',
    category: 'god-number',
    badgeKo: '다이아몬드 십자',
    badgeEn: 'Diamond Cross',
    difficulty: 4,
    formulaSeq: '2행 MX ➔ 2열 MY ➔ 주대각 MD = 전 타일 올클리어',
    summaryKo: '십자 에지(1, 3, 5, 7)와 대각 모서리가 교차하는 다이아몬드 십자형 뒤틀림! [2행 MX] ➔ [2열 MY] ➔ [주대각 MD] 단 3수로 십자축과 대각선을 완벽 소거하며 올클리어합니다.',
    summaryEn: 'A diamond cross distortion where cross edges and diagonal corners intersect! [Row 2 MX] ➔ [Col 2 MY] ➔ [Main Diag MD] completely purges axes and diagonals in 3 moves.',
    diagramType: 'interactive',
    steps: diamondCrossSteps,
    latexFormula: '\\text{Row}_2(\\text{MX}) \\circ \\text{Col}_2(\\text{MY}) \\circ \\text{Diag}_M(\\text{MD}) = \\text{ID}',
    notesKo: [
      '2행 MX와 2열 MY를 순차 실행하여 십자 에지 4개를 소거하고, 중심 타일을 대각선과 동기화합니다.',
      '최종 3수째 주대각선 MD 반사로 0, 4, 8번 타일을 동시 소거하며 퍼즐을 완벽 클리어합니다.'
    ],
    notesEn: [
      'Sequential Row 2 MX and Col 2 MY clears all 4 cross edges and aligns center tile with the diagonal.',
      'Final Main Diag MD simultaneous purge clears tiles 0, 4, and 8 for a perfect solve.'
    ],
    tags: ['다이아몬드 십자', '3수 피니시', '십자 에지', '대각선 공식', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'l-diag-cascade-3m',
    titleKo: 'ㄱ자 사선연계 3수 공식',
    titleEn: 'L-Shape Diagonal Cascade 3-Move Formula',
    category: 'god-number',
    badgeKo: 'ㄱ자 사선연계',
    badgeEn: 'L-Diag Cascade',
    difficulty: 3,
    formulaSeq: '1행 MY ➔ 1열 MX ➔ 부대각 MAD = 전 타일 올클리어',
    summaryKo: '1행과 1열의 \'ㄱ자\' 테두리와 부대각선 축이 서로 얽힌 기하학적 난패턴! [1행 MY] ➔ [1열 MX] ➔ [부대각 MAD] 3수의 연속 파동으로 직교와 사선을 일거에 정리합니다.',
    summaryEn: 'An intricate geometric pattern entangling an \'L-shape\' frame (Row 1, Col 1) with the anti-diagonal! [Row 1 MY] ➔ [Col 1 MX] ➔ [Anti Diag MAD] purges orthogonal and diagonal lines in 3 moves.',
    diagramType: 'interactive',
    steps: lDiagCascadeSteps,
    latexFormula: '\\text{Row}_1(\\text{MY}) \\circ \\text{Col}_1(\\text{MX}) \\circ \\text{Diag}_A(\\text{MAD}) = \\text{ID}',
    notesKo: [
      '1행 MY와 1열 MX의 연속 직교 반사로 테두리 타일들을 소거하고, 6번 코너를 부대각선 위상으로 전환합니다.',
      '부대각선(2, 4, 6번)이 모두 동일한 MAD 위상으로 통일되어 마지막 부대각 반사 한 방으로 클리어됩니다.'
    ],
    notesEn: [
      'Sequential Row 1 MY and Col 1 MX clears perimeter tiles and transitions corner 6 into anti-diagonal phase.',
      'Anti-diagonal (2, 4, 6) becomes completely unified in MAD phase, resolved with a single final swipe.'
    ],
    tags: ['ㄱ자 사선연계', '3수 피니시', 'L자 테두리', '부대각선 공식', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'x-cross-3m',
    titleKo: 'X-크로스 3수 공식',
    titleEn: 'X-Cross 3-Move Formula',
    category: 'god-number',
    badgeKo: 'X-크로스 3수',
    badgeEn: 'X-Cross 3M',
    difficulty: 3,
    formulaSeq: '주대각 MD ➔ 부대각 MAD ➔ 2행 R180 = 전 타일 올클리어',
    summaryKo: '주대각선과 부대각선의 교차점과 2행의 양 날개가 \'X자\' 형태로 뒤틀린 대칭 패턴! [주대각 MD] ➔ [부대각 MAD] ➔ [2행 R180] 단 3수로 2개 대각선과 중심축을 정복합니다.',
    summaryEn: 'A symmetric \'X-Cross\' pattern where intersecting diagonals and Row 2 wings are twisted! [Main Diag MD] ➔ [Anti Diag MAD] ➔ [Row 2 R180] completely conquers diagonals and central axis in 3 moves.',
    diagramType: 'interactive',
    steps: xCrossSteps,
    latexFormula: '\\text{Diag}_M(\\text{MD}) \\circ \\text{Diag}_A(\\text{MAD}) \\circ \\text{Row}_2(\\text{R180}) = \\text{ID}',
    notesKo: [
      '주대각선과 부대각선을 연속 반사하여 4개 코너(0, 2, 6, 8)를 즉시 소거하고 중심을 180° 회전으로 합성합니다.',
      '중심 4번과 좌우 3, 5번이 모두 R180으로 완벽 동기화되어 2행 180° 회전으로 한 번에 종결됩니다.'
    ],
    notesEn: [
      'Successive diagonal reflections clear all 4 corners (0, 2, 6, 8) and compose the center into 180° rotation.',
      'Center tile 4 and wings 3, 5 become unified in R180, finishing cleanly in a single Row 2 swipe.'
    ],
    tags: ['X-크로스', '3수 피니시', '대각선 크로스', '신의 수 테크닉'],
    isInteractive: true
  },

  {
    id: 'center-inversion',
    titleKo: '중심 타일 180° 반전 공식',
    titleEn: 'Center Tile 180° Inversion (Center Inversion)',
    category: 'beginner',
    badgeKo: '중심 180° 반전',
    badgeEn: 'Center Inversion',
    difficulty: 2,
    formulaSeq: '2행 R90 ➔ 2열 MX ➔ 2행 R270 ➔ 2열 MX',
    summaryKo: '외곽 8개 타일의 상태를 완벽히 보존하면서, 오직 4번 중심 타일 1개만 180° 반전시키는 핵심 테크닉입니다.',
    summaryEn: 'Preserves all 8 surrounding tiles while isolating a 180° inversion strictly on the central tile.',
    diagramType: 'interactive',
    steps: centerInversionSteps,
    notesKo: [
      '2행과 2열의 교환자 [R90, MX]를 활용하여 교차점만 선택 조작합니다.',
      '중심 타일만 뒤집혀 마지막 1수 정리에 막혔을 때 필살기로 사용됩니다.'
    ],
    notesEn: [
      'Uses the commutator [R90, MX] to strictly isolate the intersection point.',
      'Essential master move when only the center tile remains flipped.'
    ],
    tags: ['회전 공식', '중심 반전', '교차선 합성', '2수 기법'],
    isInteractive: true
  },
  {
    id: 'three-cycle-commutator',
    titleKo: '3개 타일 90° 순환 교환자',
    titleEn: '3-Cycle 90° Commutator',
    category: 'intermediate',
    badgeKo: '3-Cycle 순환',
    badgeEn: '3-Cycle Commutator',
    difficulty: 4,
    formulaSeq: '1행 R90 ➔ 2열 R90 ➔ 1행 R270 ➔ 2열 R270',
    summaryKo: '교환자 [R₁, C₂]를 통해 나머지 타일의 교란을 최소화하며 특정 교차 타일만 90° 순환 치환합니다.',
    summaryEn: 'Minimizes perturbations using commutator [R1, C2] to cyclically permute target intersection tiles.',
    diagramType: 'interactive',
    steps: threeCycleSteps,
    notesKo: [
      '대칭군의 교환자 부분군 [D4, D4] 성질을 직접 체험할 수 있습니다.',
      '고난도 퍼즐의 최종 마무리에 활용됩니다.'
    ],
    notesEn: [
      'Directly demonstrates the commutator subgroup [D4, D4].',
      'Used for final state solving in advanced difficulty.'
    ],
    tags: ['신의 수 테크닉', '교환자', '3-Cycle', '루빅스 큐브'],
    isInteractive: true
  },
  {
    id: 'diagonal-reflection-pair',
    titleKo: '대각선 반사 상쇄 공식',
    titleEn: 'Diagonal Reflection Conjugation Pair',
    category: 'intermediate',
    badgeKo: '대각선 켤레',
    badgeEn: 'Diagonal Pair',
    difficulty: 3,
    formulaSeq: '주대각 MD ➔ 1행 MX ➔ 주대각 MD ➔ 1행 MX',
    summaryKo: '사선 대칭(MD)과 축 대칭(MX)의 비가환성을 이용해 좌상단 코너 타일의 위상을 정밀 제어합니다.',
    summaryEn: 'Utilizes non-commutativity of diagonal (MD) and axial (MX) reflections to manipulate the corner tile.',
    diagramType: 'interactive',
    steps: diagonalPairSteps,
    notesKo: [
      '대각선 옵션이 켜져 있을 때 코너 타일 교정에 매우 강력합니다.',
      'MD와 MX의 합성은 90° 회전을 유발합니다.'
    ],
    notesEn: [
      'Powerful corner adjustment when diagonal moves are enabled.',
      'MD composed with MX generates 90° rotation.'
    ],
    tags: ['반사 공식', '주대각선 MD', '대각 상쇄', '켤레 변환'],
    isInteractive: true
  },
  {
    id: 'v4-klein-optimal',
    titleKo: 'V4 클라인 4원군 4수 최단 정복',
    titleEn: 'Klein-4 Group Optimal 4-Move Algorithm',
    category: 'advanced',
    badgeKo: 'V4 4수 마스터',
    badgeEn: 'V4 God’s 4',
    difficulty: 3,
    formulaSeq: '3행 R180 ➔ 3열 MY ➔ 2행 MY ➔ 1행 R180 = ID',
    summaryKo: '클라인 4원군 V4는 가환군이므로 조작 순서와 무관하게 1차 연립방정식으로 4수 이내 100% 클리어 가능합니다.',
    summaryEn: 'Since Klein-4 is Abelian, any scrambled state is 100% solvable within 4 moves using parity decoupling.',
    diagramType: 'interactive',
    steps: v4ConquestSteps,
    notesKo: [
      '행 조작은 세로 반전(MX)만, 열 조작은 가로 반전(MY)만 독립적으로 관할합니다.',
      '어떠한 상태라도 최대 4수 안에 신의 수로 정복할 수 있습니다.'
    ],
    notesEn: [
      'Row moves strictly govern MX, column moves strictly govern MY.',
      'Guaranteed God’s number ≤ 4 moves from any valid state.'
    ],
    tags: ['신의 수 테크닉', 'V4 클라인 4원군', '4수 해법', '정석 솔루션'],
    isInteractive: true
  },
  {
    id: 'parallel-180-pair',
    titleKo: '같은 줄 180° 쌍(Pair) 상쇄 공식',
    titleEn: 'Parallel 180° Pair Inversion Cancellation',
    category: 'beginner',
    badgeKo: '같은 줄 180° 쌍',
    badgeEn: 'Parallel 180° Pair',
    difficulty: 3,
    formulaSeq: '3열 MX ➔ 1행 R180 ➔ 3열 MX',
    summaryKo: '한 줄에 180° 회전 타일이 2개 나란히 발생했을 때, 직교하는 3열의 임시 반사(MX)를 가교 삼아 1행 R180으로 잔여 쌍을 깔끔하게 0번(정위치)으로 상쇄하는 실전 비법입니다.',
    summaryEn: 'When two 180° flipped tiles appear side-by-side in a row, using orthogonal Col 3 reflection (MX) as a bridge enables Row 1 R180 to cancel the pair cleanly back to identity.',
    diagramType: 'interactive',
    steps: parallel180PairSteps,
    notesKo: [
      '같은 줄에 180°가 2개 남았을 때 한 번에 해결하는 핵심 테크닉입니다.',
      '3열의 임시 반사(MX)가 교차점 위상을 보호하여 1행 1, 2열의 쌍을 정확히 0번으로 상쇄합니다.'
    ],
    notesEn: [
      'Key practical technique when two 180° flips remain in the same row.',
      'The temporary Col 3 reflection (MX) protects the pivot tile, cleanly canceling the pair in Row 1.'
    ],
    tags: ['회전 공식', '180° 쌍', '평행 쌍 상쇄', '실전 테크닉'],
    isInteractive: true
  },
  {
    id: 'diagonal-180-pair',
    titleKo: '대각선 모서리 180° 쌍(Pair) 소거 공식',
    titleEn: 'Diagonal Corner 180° Pair Elimination',
    category: 'intermediate',
    badgeKo: '대각선 180° 쌍',
    badgeEn: 'Diagonal 180° Pair',
    difficulty: 4,
    formulaSeq: '주대각 MD ➔ 1행 R180 ➔ 3열 R180 ➔ 주대각 MD',
    summaryKo: '주대각선의 양 끝 모서리인 [1행1열, 3행3열]에 180° 회전이 쌍으로 남았을 때, 주대각선 사선 반사(MD)와 직교 회전들을 결합하여 두 모서리를 깔끔하게 동시 소거하는 고급 공식입니다.',
    summaryEn: 'When opposite diagonal corners [1,1] and [3,3] are flipped by 180°, combining diagonal reflection (MD) with orthogonal rotations eliminates both corner flips simultaneously.',
    diagramType: 'interactive',
    steps: diagonal180PairSteps,
    notesKo: [
      '대각선 옵션이 켜져 있을 때 양 끝 모서리의 180° 쌍을 단 4수 만에 소거합니다.',
      '주대각선 반사(MD)와 두 직교 라인의 180° 회전이 결합된 고차원 켤레 변환입니다.'
    ],
    notesEn: [
      'Eliminates opposite corner 180° pairs in just 4 moves when diagonal moves are enabled.',
      'High-order conjugation combining diagonal reflection (MD) and orthogonal rotations.'
    ],
    tags: ['회전 공식', '대각선 공식', '180° 쌍', '모서리 소거', '고급 테크닉'],
    isInteractive: true
  },
  {
    id: 'basics-reflection-composition',
    titleKo: '기초 법칙 1: 반사 + 반사 = 회전',
    titleEn: 'Basic Axiom 1: Reflection + Reflection = Rotation',
    category: 'basics',
    badgeKo: '반사의 합성',
    badgeEn: 'Reflection Comp',
    difficulty: 1,
    formulaSeq: 'MX ∘ MY = R180,  MD ∘ MAD = R180',
    summaryKo: '두 개의 서로 다른 선대칭 반사를 연속으로 적용하면 순수 회전이 발생합니다. 직교 반사는 180°, 45° 사선 반사는 90° 회전을 만듭니다.',
    summaryEn: 'Composing two distinct line reflections yields a pure rotation: orthogonal lines yield 180°, 45° lines yield 90°.',
    diagramType: 'interactive',
    steps: basicsReflectionCompSteps,
    svgDiagramKey: 'reflection-composition',
    latexFormula: 's_1 \\circ s_2 = r_{2\\theta}',
    notesKo: [
      '타일이 뒤집힌 상태(뒷면)에서 다른 축으로 뒤집으면 다시 앞면으로 돌아옵니다.',
      '회전 제스처가 어렵다면 두 번의 반사 스와이프로 동일한 회전을 만들 수 있습니다.'
    ],
    notesEn: [
      'Flipping a reversed tile along another axis restores it to the front face.',
      'If rotation gestures are hard, two reflection swipes achieve the exact same rotation.'
    ],
    tags: ['기초 법칙', '반사 합성', '회전 생성', '직교 대칭'],
    isInteractive: true
  },
  {
    id: 'basics-self-inverse',
    titleKo: '기초 법칙 2: 대칭원의 자기 상쇄 (A² = ID)',
    titleEn: 'Basic Axiom 2: Self-Inverse Involutions (A² = ID)',
    category: 'basics',
    badgeKo: '자기 상쇄 (0수)',
    badgeEn: 'Self Inverse',
    difficulty: 1,
    formulaSeq: 'MX² = ID,  MY² = ID,  MD² = ID,  R180² = ID',
    summaryKo: '모든 반사 연산과 180° 회전은 2회 적용 시 자기 자신을 상쇄하여 항등원(ID)으로 복귀합니다.',
    summaryEn: 'Every reflection operation and 180° rotation has order 2: applying it twice restores the identity.',
    diagramType: 'interactive',
    steps: basicsSelfInverseSteps,
    svgDiagramKey: 'self-inverse',
    latexFormula: 'A^2 = e \\implies A^{-1} = A',
    notesKo: [
      '같은 라인에 동일한 반사를 두 번 하면 낭비수(0수)가 됩니다.',
      '실수를 즉시 만회하려면 방금 한 스와이프를 한 번 더 실행하세요.'
    ],
    notesEn: [
      'Applying the same reflection twice to the same line cancels out to 0 moves.',
      'To immediately undo a mistake, simply repeat the same swipe.'
    ],
    tags: ['기초 법칙', '위수 2', '자기상쇄', 'Involution'],
    isInteractive: true
  },
  {
    id: 'basics-commutator-principle',
    titleKo: '기초 법칙 3: 교환자 원리 ([A, B] = A B A⁻¹ B⁻¹)',
    titleEn: 'Basic Axiom 3: Commutator Principle ([A, B] = ABA⁻¹B⁻¹)',
    category: 'basics',
    badgeKo: '국소 고립의 원리',
    badgeEn: 'Commutator Principle',
    difficulty: 2,
    formulaSeq: '[A, B] = A ∘ B ∘ A⁻¹ ∘ B⁻¹',
    summaryKo: '두 조작이 겹치는 단 1개의 교차점 타일만 변화를 받고, 겹치지 않는 나머지 타일들은 자동으로 상쇄 복원됩니다.',
    summaryEn: 'Only the intersection tile shared by both lines receives the composed transformation; all other tiles cancel out.',
    diagramType: 'interactive',
    steps: threeCycleSteps,
    svgDiagramKey: 'commutator',
    latexFormula: '[A, B] = A B A^{-1} B^{-1}',
    notesKo: [
      '루빅스 큐브의 고급 해법과 완전히 동일한 군론적 불변량 원리입니다.',
      '특정 타일 1개만 골라서 맞추고 싶을 때 모든 공식의 기본 뼈대가 됩니다.'
    ],
    notesEn: [
      'The exact same group-theoretic invariant principle used in Rubik’s cube speedsolving.',
      'Serves as the foundation for isolating single tiles without messing up solved areas.'
    ],
    tags: ['기초 법칙', '교환자', '국소 고립'],
    isInteractive: true
  }
];

export const MINED_FORMULAS: FormulaItem[] = Array.isArray(minedFormulasRaw)
  ? (minedFormulasRaw as unknown as FormulaItem[])
  : [];

export const FORMULAS: FormulaItem[] = [...BASE_FORMULAS, ...MINED_FORMULAS];
export const FORMULA_LIST: FormulaItem[] = FORMULAS;

/**
 * 카테고리 매핑 헬퍼
 */
export function getFormulasByCategory(category: FormulaCategory | 'all' | string = 'all'): FormulaItem[] {
  if (category === 'all') {
    return FORMULAS;
  }
  if (category === 'ai-mined') {
    return FORMULAS.filter((f) => f.category === 'ai-mined');
  }
  if (category === 'basics') {
    return FORMULAS.filter((f) => f.category === 'basics');
  }
  if (category === 'beginner') {
    return FORMULAS.filter((f) => f.category === 'beginner');
  }
  if (category === 'intermediate') {
    return FORMULAS.filter((f) => f.category === 'intermediate');
  }
  if (category === 'advanced') {
    return FORMULAS.filter((f) => f.category === 'advanced');
  }
  if (category === 'god-number') {
    return FORMULAS.filter((f) => f.category === 'god-number');
  }
  return FORMULAS.filter((f) => {
    if (category === 'ai-mined') return f.category === 'ai-mined';
    if (category === 'basic') return f.category === 'basics';
    if (category === 'rotation') return f.category === 'beginner' || f.tags?.includes('회전 공식');
    if (category === 'reflection') return f.category === 'intermediate' || f.tags?.includes('반사 공식');
    if (category === 'godTechnique') return f.category === 'advanced' || f.category === 'god-number' || f.tags?.includes('신의 수 테크닉');
    return f.category === category;
  });
}

export function getFormulaById(id: string): FormulaItem | undefined {
  return FORMULAS.find((f) => f.id === id);
}
