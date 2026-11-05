/**
 * @file formulas.ts
 * @description 갈루아 큐브 공식 비법서(Formula Guidebook) 모듈형 레지스트리 및 시뮬레이터
 * D4 정이면체군 및 V4 클라인 4원군 핵심 수학 법칙과 실전 테크닉 스텝 데이터
 */

import { D4, D4Op } from '../core/group';
import { LINE_CELLS_3X3, applyLineMoveGeneric } from '../core/board';

export type FormulaCategory =
  | 'all'
  | 'basics'
  | 'basic'
  | 'rotation'
  | 'reflection'
  | 'godTechnique'
  | 'beginner'
  | 'intermediate'
  | 'advanced';

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

// 5. [기초 법칙 1: 반사 + 반사 = 회전 인터랙티브 스텝]
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

export const FORMULAS: FormulaItem[] = [
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

export const FORMULA_LIST: FormulaItem[] = FORMULAS;

/**
 * 카테고리 매핑 헬퍼
 */
export function getFormulasByCategory(category: FormulaCategory | 'all' | string = 'all'): FormulaItem[] {
  if (category === 'all') {
    return FORMULAS;
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
  return FORMULAS.filter((f) => {
    if (category === 'basic') return f.category === 'basics';
    if (category === 'rotation') return f.category === 'beginner' || f.tags?.includes('회전 공식');
    if (category === 'reflection') return f.category === 'intermediate' || f.tags?.includes('반사 공식');
    if (category === 'godTechnique') return f.category === 'advanced' || f.tags?.includes('신의 수 테크닉');
    return f.category === category;
  });
}

export function getFormulaById(id: string): FormulaItem | undefined {
  return FORMULAS.find((f) => f.id === id);
}
