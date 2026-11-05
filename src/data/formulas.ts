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

// 15. [D4 신규 마스터 공식 1: D4 다이아몬드 십자 3수 폭파]
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

// 18. [D4 신규 마스터 공식 4: D4 가로/세로 십자 이중꼬임 4수 폭파]
// 초기 보드: ['ID', 'MX', 'R180', 'MY', 'R180', 'MX', 'R180', 'MY', 'ID']
// 2행(row 1) MX ➔ 2열(col 1) MY ➔ 1행(row 0) R180 ➔ 1열(col 0) R180 = 100% ID 올클리어
const d4DoubleCrossInitialBoard: D4Op[] = [
  D4.ID,   D4.MX,   D4.R180,
  D4.MY,   D4.R180, D4.MX,
  D4.R180, D4.MY,   D4.ID
];

const d4DoubleCrossSteps = createInteractiveSteps(d4DoubleCrossInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 1,
    op: D4.MX,
    actionDescKo: '1수: 2행 상하 반전 (MX 가로밀기)',
    actionDescEn: 'Move 1: Row 2 Vertical Flip (MX)',
    mathInsightKo: '2행에 MX를 적용하여 5번 타일(MX ∘ MX = ID) 즉시 소거! 중심 타일은 MY로 전환되어 2열과의 대칭 합성을 준비합니다.',
    mathInsightEn: 'Applying MX to Row 2 immediately cancels tile 5 (MX ∘ MX = ID)! The center tile shifts to MY, preparing symmetric composition with Col 2.',
    highlightCells: [3, 4, 5],
    formulaBadge: '1수: 2행 MX',
    formulaText: 'Row₂ ➔ MX',
    formulaDesc: '2행 상하 반전으로 5번 타일을 정위치 복원하고 중심 위상을 대칭 전환합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 1,
    op: D4.MY,
    actionDescKo: '2수: 2열 좌우 반전 (MY 세로밀기)',
    actionDescEn: 'Move 2: Col 2 Horizontal Flip (MY)',
    mathInsightKo: '2열에 MY를 가하여 7번 타일 소거 및 중심 4번 타일(MY ∘ MY = ID) 완전 복원! 보드가 1열(0, 3, 6)과 1행 잔여(1, 2) R180으로 단순화됩니다.',
    mathInsightEn: 'Applying MY to Col 2 clears tile 7 and perfectly restores center tile 4 (MY ∘ MY = ID)! Reduces the board to Col 1 (0, 3, 6) and Row 1 remaining (1, 2) in R180.',
    highlightCells: [1, 4, 7],
    formulaBadge: '2수: 2열 MY',
    formulaText: 'Col₂ ➔ MY',
    formulaDesc: '2열 좌우 반전으로 중심 4번 타일을 완전 복원하고 에러를 외곽 1행/1열로 압축합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R180,
    actionDescKo: '3수: 1행 180° 반전 (R180)',
    actionDescEn: 'Move 3: Row 1 Invert 180° (R180)',
    mathInsightKo: '1행에 R180을 적용하여 1번, 2번 타일(R180 ∘ R180 = ID) 동시 소거! 잔여 비틀림을 1열(0, 3, 6) 하나의 축으로 완전 몰아넣습니다.',
    mathInsightEn: 'Applying R180 to Row 1 clears tiles 1 and 2 (R180 ∘ R180 = ID) simultaneously! Concentrates all remaining twists into Col 1 (0, 3, 6).',
    highlightCells: [0, 1, 2],
    formulaBadge: '3수: 1행 R180',
    formulaText: 'Row₁ ➔ R180',
    formulaDesc: '1행 180° 반전으로 1, 2번 타일을 동시 소거하고 모든 잔여 에러를 1열로 몰아넣습니다.'
  },
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.R180,
    actionDescKo: '4수: 1열 180° 반전 (R180 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Col 1 Invert 180° (R180 Triple-Kill Finish)',
    mathInsightKo: '1열의 3개 타일(0, 3, 6번)에 R180을 일괄 작용시켜 R180 ∘ R180 = ID로 3중 동시 폭파(Triple Cancel)! 전 타일 100% ID 올클리어 완성!',
    mathInsightEn: 'Applying R180 to Col 1 resolves tiles 0, 3, and 6 simultaneously via R180 ∘ R180 = ID (Triple Cancel)! Completes 100% all-clear!',
    highlightCells: [0, 3, 6],
    formulaBadge: '4수: 1열 R180 트리플 킬',
    formulaText: 'Col₁ ➔ R180 ➔ 100% 클리어',
    formulaDesc: '1열 180° 반전으로 남아있던 1열 3개 타일을 한 번에 폭파하여 올클리어를 완성합니다.'
  }
]);

// 19. [D4 신규 마스터 공식 5: D4 4방향 소용돌이 4수 올킬]
// 초기 보드: ['R180', 'R270', 'R180', 'R270', 'ID', 'R270', 'R180', 'R270', 'R180']
// 1행(row 0) R90 ➔ 3열(col 2) R90 ➔ 3행(row 2) R90 ➔ 1열(col 0) R90 = 100% ID 올클리어
const d4SpiralVortexInitialBoard: D4Op[] = [
  D4.R180, D4.R270, D4.R180,
  D4.R270, D4.ID,   D4.R270,
  D4.R180, D4.R270, D4.R180
];

const d4SpiralVortexSteps = createInteractiveSteps(d4SpiralVortexInitialBoard, [
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '1수: 1행 90° 시계 회전 (R90)',
    actionDescEn: 'Move 1: Row 1 Rotate 90° (R90)',
    mathInsightKo: '1행에 R90을 적용하여 1번 변 타일(R270 ∘ R90 = ID) 즉시 소거! 코너 타일 0, 2번은 R270 위상으로 1단계 진입합니다.',
    mathInsightEn: 'Applying R90 to Row 1 clears edge tile 1 (R270 ∘ R90 = ID)! Corner tiles 0 & 2 transition to phase R270.',
    highlightCells: [0, 1, 2],
    formulaBadge: '1수: 1행 R90',
    formulaText: 'Row₁ ➔ R90',
    formulaDesc: '1행 시계 회전으로 1번 타일을 즉시 맞추고 상단 코너들을 R270 위상으로 준비합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '2수: 3열 90° 시계 회전 (R90 더블 킬)',
    actionDescEn: 'Move 2: Col 3 Rotate 90° (R90 Double-Kill)',
    mathInsightKo: '3열에 R90을 적용하여 2번 코너(R270 ∘ R90 = ID)와 5번 변(R270 ∘ R90 = ID)을 더블 킬(Double Cancel)! 8번 코너는 R270으로 전이됩니다.',
    mathInsightEn: 'Applying R90 to Col 3 achieves a Double-Kill on corner 2 and edge 5 (both R270 ∘ R90 = ID)! Corner 8 transitions to R270.',
    highlightCells: [2, 5, 8],
    formulaBadge: '2수: 3열 R90 더블 킬',
    formulaText: 'Col₃ ➔ R90',
    formulaDesc: '3열 시계 회전으로 2번 코너와 5번 변을 동시 소거하고 8번 코너를 정렬합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.R90,
    actionDescKo: '3수: 3행 90° 시계 회전 (R90 더블 킬)',
    actionDescEn: 'Move 3: Row 3 Rotate 90° (R90 Double-Kill)',
    mathInsightKo: '3행에 R90을 적용하여 8번 코너(R270 ∘ R90 = ID)와 7번 변(R270 ∘ R90 = ID)을 더블 킬! 이제 1열의 3개 타일(0, 3, 6)만 R270으로 완벽 동기화됩니다.',
    mathInsightEn: 'Applying R90 to Row 3 executes a Double-Kill on corner 8 and edge 7! Concentrates all remaining errors into Col 1 (0, 3, 6) as uniform R270.',
    highlightCells: [6, 7, 8],
    formulaBadge: '3수: 3행 R90 더블 킬',
    formulaText: 'Row₃ ➔ R90',
    formulaDesc: '3행 시계 회전으로 8번 코너와 7번 변을 동시 소거하고 마지막 1열 전체를 R270으로 정렬합니다.'
  },
  {
    lineType: 'col',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '4수: 1열 90° 시계 회전 (R90 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Col 1 Rotate 90° (R90 Triple-Kill Finish)',
    mathInsightKo: '1열에 마지막 R90을 적용하여 남은 3개 타일(0, 3, 6)이 R270 ∘ R90 = ID로 3중 동시 폭파(Triple Kill)! 둘레길 전 타일 100% ID 올클리어 완성!',
    mathInsightEn: 'Applying R90 to Col 1 resolves tiles 0, 3, 6 simultaneously via R270 ∘ R90 = ID (Triple-Kill)! Completes 100% perimeter all-clear!',
    highlightCells: [0, 3, 6],
    formulaBadge: '4수: 1열 R90 트리플 킬',
    formulaText: 'Col₁ ➔ R90 ➔ 100% 클리어',
    formulaDesc: '1열 시계 회전으로 남아있던 1열 3개 타일을 한 번에 폭파하여 소용돌이 퍼즐을 완성합니다.'
  }
]);

// 20. [D4 신규 마스터 공식 6: D4 양대각선 대칭교차 4수 동시폭파]
// 초기 보드: ['MY', 'R270', 'MX', 'ID', 'R180', 'ID', 'MY', 'R90', 'MX']
// 주대각선(main) MD ➔ 부대각선(anti) MAD ➔ 1행(row 0) R90 ➔ 3행(row 2) R270 = 100% ID 올클리어
const d4DualDiagonalBlitzInitialBoard: D4Op[] = [
  D4.MY,   D4.R270, D4.MX,
  D4.ID,   D4.R180, D4.ID,
  D4.MY,   D4.R90,  D4.MX
];

const d4DualDiagonalBlitzSteps = createInteractiveSteps(d4DualDiagonalBlitzInitialBoard, [
  {
    lineType: 'diag',
    lineIndex: 'main',
    op: D4.MD,
    actionDescKo: '1수: 주대각선(↖) 사선 반사 (MD 사선밀기)',
    actionDescEn: 'Move 1: Main Diag (↖) Diagonal Reflection (MD)',
    mathInsightKo: '주대각선(MD) 반사로 대각선 축 타일들을 회전 좌표계(0번 R270, 8번 R90)로 치환하고, 중심은 R180 ∘ MD = MAD로 유도합니다.',
    mathInsightEn: 'Applying MD to main diagonal transforms diagonal tiles into rotational frames (0: R270, 8: R90), driving center to R180 ∘ MD = MAD.',
    highlightCells: [0, 4, 8],
    formulaBadge: '1수: 주대각 MD',
    formulaText: 'Diag[main] ➔ MD',
    formulaDesc: '주대각선 사선 반사로 대각선 타일들을 회전계로 전환하고 중심 축을 부대각선과 정렬합니다.'
  },
  {
    lineType: 'diag',
    lineIndex: 'anti',
    op: D4.MAD,
    actionDescKo: '2수: 부대각선(↗) 역대각 반사 (MAD 역대각밀기)',
    actionDescEn: 'Move 2: Anti Diag (↗) Anti-Diagonal Reflection (MAD)',
    mathInsightKo: '부대각선(MAD) 반사로 중심 타일(MAD ∘ MAD = ID) 즉시 소거! 보드가 상단 1행 전체 R270, 하단 3행 전체 R90 층별 대칭으로 분할됩니다.',
    mathInsightEn: 'Applying MAD to anti diagonal clears center tile (MAD ∘ MAD = ID)! Partitions the board into Row 1 uniform R270 and Row 3 uniform R90.',
    highlightCells: [2, 4, 6],
    formulaBadge: '2수: 부대각 MAD',
    formulaText: 'Diag[anti] ➔ MAD',
    formulaDesc: '부대각선 반사로 중심 타일을 즉시 맞추고 상단과 하단을 각각 균일한 회전층으로 분할합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 0,
    op: D4.R90,
    actionDescKo: '3수: 1행 90° 시계 회전 (R90 트리플 킬)',
    actionDescEn: 'Move 3: Row 1 Rotate 90° (R90 Triple-Kill)',
    mathInsightKo: '1행에 R90을 적용하여 1행의 3개 타일(0, 1, 2)이 모두 R270 ∘ R90 = ID로 3중 동시 폭파(Triple Kill)! 상단부가 완전히 클리어됩니다.',
    mathInsightEn: 'Applying R90 to Row 1 executes a Triple-Kill on tiles 0, 1, 2 via R270 ∘ R90 = ID! Completely clears the top row.',
    highlightCells: [0, 1, 2],
    formulaBadge: '3수: 1행 R90 트리플 킬',
    formulaText: 'Row₁ ➔ R90',
    formulaDesc: '1행 시계 회전으로 상단 3개 타일을 일괄 폭파하여 상단 라인을 완성합니다.'
  },
  {
    lineType: 'row',
    lineIndex: 2,
    op: D4.R270,
    actionDescKo: '4수: 3행 90° 반시계 회전 (R270 트리플 킬 피니시)',
    actionDescEn: 'Move 4: Row 3 Rotate 90° CCW (R270 Triple-Kill Finish)',
    mathInsightKo: '3행에 R270을 가하여 남은 3개 타일(6, 7, 8)이 일제히 R90 ∘ R270 = ID로 3중 동시 폭파(Triple Kill)! 4수 만에 전 타일 100% 항등원 올클리어 완성!',
    mathInsightEn: 'Applying R270 to Row 3 executes a Triple-Kill on remaining tiles 6, 7, 8 via R90 ∘ R270 = ID! Completes 100% all-clear in 4 moves!',
    highlightCells: [6, 7, 8],
    formulaBadge: '4수: 3행 R270 트리플 킬',
    formulaText: 'Row₃ ➔ R270 ➔ 100% 클리어',
    formulaDesc: '3행 반시계 회전으로 하단 3개 타일을 한 번에 폭파하여 전 타일 올클리어를 완성합니다.'
  }
]);

// 21. [D4 신규 마스터 공식 7: D4 체커보드(X자/십자) 위상차 4수 슈퍼 소거]
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

const BASE_FORMULAS: FormulaItem[] = [
  {
    id: 'd4-double-cross-4',
    titleKo: 'D4 가로/세로 십자 교차 이중 꼬임 4수 폭파',
    titleEn: 'D4 Double-Cross Twist 4-Move Purge',
    category: 'god-number',
    badgeKo: '⚔️ D4 마스터 4수',
    badgeEn: '⚔️ D4 Master 4M',
    difficulty: 4,
    formulaSeq: '2행 MX ➔ 2열 MY ➔ 1행 R180 ➔ 1열 R180 = 전 타일 올클리어',
    summaryKo: '중심 십자축이 직교 반사로 뒤틀리고 코너가 180° 반전된 거리 4 병목을 [2행 MX] ➔ [2열 MY] ➔ [1행 R180] ➔ [1열 R180] 4수로 중심 소거 후 1열 3중 동시 폭파로 완성하는 D4 마스터 공식입니다.',
    summaryEn: 'A distance 4 bottleneck where the center cross is twisted by orthogonal reflections and corners by R180. Resolves in 4 moves: [Row 2 MX] ➔ [Col 2 MY] ➔ [Row 1 R180] ➔ [Col 1 R180] via center reduction and triple-cancel finish.',
    diagramType: 'interactive',
    steps: d4DoubleCrossSteps,
    latexFormula: '\\text{Row}_2(\\text{MX}) \\circ \\text{Col}_2(\\text{MY}) \\circ \\text{Row}_1(\\text{R180}) \\circ \\text{Col}_1(\\text{R180}) = \\text{ID}',
    notesKo: [
      '직교 십자축의 거울 반사 합성(MX ∘ MY = R180)과 중심 4번 타일의 자기상쇄를 활용합니다.',
      '외곽 잔여 에러를 1열로 완전히 몰아넣어 마지막 수에서 3중 동시 폭파(Triple Cancel)를 터뜨리는 정교한 공식입니다.'
    ],
    notesEn: [
      'Utilizes orthogonal reflection composition (MX ∘ MY = R180) and center tile self-cancellation.',
      'Concentrates remaining errors into Column 1 for a dramatic Triple Cancel finish.'
    ],
    tags: ['D4 마스터', '4수 폭파', '십자 이중꼬임', '신의 수', '고급 피니시', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-spiral-vortex-4',
    titleKo: 'D4 4방향 소용돌이 위상차 4수 올킬',
    titleEn: 'D4 4-Way Spiral Vortex 4-Move All-Clear',
    category: 'god-number',
    badgeKo: '🌀 D4 마스터 4수',
    badgeEn: '🌀 D4 Master 4M',
    difficulty: 4,
    formulaSeq: '1행 R90 ➔ 3열 R90 ➔ 3행 R90 ➔ 1열 R90 = 전 타일 올클리어',
    summaryKo: '외곽 8개 타일이 모서리 R180, 변 R270으로 소용돌이치는 병목을 [1행 R90] ➔ [3열 R90] ➔ [3행 R90] ➔ [1열 R90] 4변 둘레길 순환 펄스로 2회 경유 코너와 1회 경유 변을 차례로 소거하며 올킬하는 마스터 공식입니다.',
    summaryEn: 'A bottleneck where outer 8 tiles form a spiral of corner R180 and edge R270. Resolves in 4 moves along the perimeter loop: [Row 1 R90] ➔ [Col 3 R90] ➔ [Row 3 R90] ➔ [Col 1 R90] to achieve complete clearance.',
    diagramType: 'interactive',
    steps: d4SpiralVortexSteps,
    latexFormula: '\\text{Row}_1(\\text{R90}) \\circ \\text{Col}_3(\\text{R90}) \\circ \\text{Row}_3(\\text{R90}) \\circ \\text{Col}_1(\\text{R90}) = \\text{ID}',
    notesKo: [
      '4변 둘레길 순환 펄스로 모서리(2회 경유: R180 ∘ R90 ∘ R90 = ID)와 변(1회 경유: R270 ∘ R90 = ID)을 완벽 동기 소거합니다.',
      '2수에서 2개, 3수에서 2개, 4수에서 3개 타일을 연속 소거하는 최고의 다중 상쇄 시원함을 선사합니다.'
    ],
    notesEn: [
      'Perimeter loop pulses resolve corners (2 passes: R180 ∘ R90² = ID) and edges (1 pass: R270 ∘ R90 = ID).',
      'Cascades double-kills in moves 2 & 3, culminating in a triple-kill in move 4.'
    ],
    tags: ['D4 마스터', '4수 올킬', '소용돌이 둘레길', '신의 수', '고급 피니시', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-dual-diagonal-blitz-4',
    titleKo: 'D4 양대각선(↖, ↗) 대칭 교차 4수 동시 폭파',
    titleEn: 'D4 Dual-Diagonal Symmetry Blitz 4-Move Destruction',
    category: 'god-number',
    badgeKo: '⚡ D4 마스터 4수',
    badgeEn: '⚡ D4 Master 4M',
    difficulty: 4,
    formulaSeq: '주대각선 MD ➔ 부대각선 MAD ➔ 1행 R90 ➔ 3행 R270 = 전 타일 올클리어',
    summaryKo: '양대각선 축에 거울 반사가 걸려있고 상하 층별 위상이 어긋난 거리 4 병목을 [주대각 MD] ➔ [부대각 MAD] ➔ [1행 R90] ➔ [3행 R270] 4수로 중심 소거 및 상하 층별 분할 후 2연속 트리플 킬로 산산조각 내는 마스터 공식입니다.',
    summaryEn: 'A distance 4 bottleneck with dual diagonal reflections and row-wise phase splits. Solves in 4 moves: [Main Diag MD] ➔ [Anti Diag MAD] ➔ [Row 1 R90] ➔ [Row 3 R270] via center wipeout and dual triple-kills.',
    diagramType: 'interactive',
    steps: d4DualDiagonalBlitzSteps,
    latexFormula: '\\text{Diag}_{\\text{main}}(\\text{MD}) \\circ \\text{Diag}_{\\text{anti}}(\\text{MAD}) \\circ \\text{Row}_1(\\text{R90}) \\circ \\text{Row}_3(\\text{R270}) = \\text{ID}',
    notesKo: [
      '두 대각선 반사의 합성(MD ∘ MAD = R180)으로 중심 타일을 소거하고, 상단 1행(R270)과 하단 3행(R90)으로 층별 완벽 분리합니다.',
      '분할된 상단과 하단을 각각 반대 방향의 회전(R90, R270)으로 3개씩 2연속 폭파(Dual Triple-Kill)합니다.'
    ],
    notesEn: [
      'Dual diagonal reflection composition (MD ∘ MAD = R180) clears the center and segregates Row 1 (R270) and Row 3 (R90).',
      'Annihilates top and bottom rows via dual triple-kills using complementary 90° rotations.'
    ],
    tags: ['D4 마스터', '4수 동시폭파', '양대각선 대칭', '신의 수', '고급 피니시', '신의 수 테크닉'],
    isInteractive: true
  },
  {
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
    latexFormula: '\\text{Diag}_{\\text{main}}(R_{180}) \\circ \\text{Diag}_{\\text{anti}}(R_{180}) \\circ \\text{Row}_2(R_{90}) \\circ \\text{Col}_2(R_{90}) = \\text{ID}',
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
    latexFormula: '\\text{Row}_1(R_{90}) \\circ \\text{Col}_2(M_X) \\circ \\text{Row}_1(R_{90}) = \\text{ID}',
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
    latexFormula: '\\text{Row}_1(R_{90}) \\circ \\text{Col}_3(M_X) \\circ \\text{Row}_3(R_{90}) \\circ \\text{Col}_1(M_X) = \\text{ID}',
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


  {
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
    latexFormula: '\\text{Row}_2(\\text{R90}) \\circ \\text{Col}_2(\\text{MX}) \\circ \\text{Row}_2(\\text{R90}) = \\text{ID}',
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
    latexFormula: '\\text{Row}_1(\\text{R90}) \\circ \\text{Col}_3(\\text{MD}) \\circ \\text{Row}_1(\\text{R90}) = \\text{ID}',
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
    latexFormula: '\\text{Col}_2(\\text{R270}) \\circ \\text{Row}_3(\\text{R90}) \\circ \\text{Row}_1(\\text{R90}) = \\text{ID}',
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
  },
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

const baseIds = new Set(BASE_FORMULAS.map((f) => f.id));
export const FORMULAS: FormulaItem[] = [
  ...BASE_FORMULAS,
  ...MINED_FORMULAS.filter((f) => !baseIds.has(f.id))
];
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
