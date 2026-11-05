# -*- coding: utf-8 -*-
import json

mined_path = r'C:\Users\user\matrix-cube\src\data\minedFormulas.json'
r7_path = r'C:\Users\user\unitess\new_formulas_round7.json'

with open(mined_path, 'r', encoding='utf-8') as f:
    mined = json.load(f)

existing_ids = {item['id'] for item in mined}

# 1. Round 7 공식들 로드
with open(r7_path, 'r', encoding='utf-8') as f:
    r7_formulas = json.load(f)

for f in r7_formulas:
    if f['id'] not in existing_ids:
        # Category를 god-number로 일치
        f['category'] = 'god-number'
        mined.append(f)
        existing_ids.add(f['id'])
        print(f"Added R7 formula to mined: {f['id']}")

# 2. Round 8 신규 3선 구성
r8_formulas = [
  {
    "id": "d4-zigzag-diagonal-flush-4",
    "titleKo": "D4 지그재그 대각 소거 4수 공식",
    "titleEn": "D4 Zigzag Diagonal Flush 4-Move Formula",
    "category": "god-number",
    "badgeKo": "⚡ 지그재그 대각 4수",
    "badgeEn": "⚡ Zigzag Flush 4M",
    "difficulty": 4,
    "formulaSeq": "주대각 R180 ➔ 부대각 MX ➔ 3행 MX ➔ 1행 MX = 전 타일 올클리어",
    "summaryKo": "0번 코너에서 1, 4, 7, 8번으로 이어지는 S자 지그재그 경로로 뒤틀린 위상을 대각선-직교 결합 4수로 한 번에 클리어하는 고급 마스터 테크닉입니다.",
    "summaryEn": "Clears an S-shaped zigzag pattern across cells 0, 1, 4, 7, 8 via dual diagonal and orthogonal sweeps in 4 minimal moves.",
    "latexFormula": "\\text{Row}_1(M_X) \\circ \\text{Row}_3(M_X) \\circ \\text{Diag}_{\\text{anti}}(M_X) \\circ \\text{Diag}_{\\text{main}}(R_{180}) = \\text{ID}",
    "isInteractive": True,
    "tags": ["4수", "지그재그", "대각선", "반사", "회전", "마스터", "D4", "신의 수 테크닉"],
    "notesKo": [
      "0-1-4-7-8 지그재그 경로를 대각선 2축과 직교 2축의 결합으로 최단 4수(Zero-Shortcut)에 돌파합니다.",
      "부대각선 MX로 중심 타일을 소거한 뒤 3행과 1행을 연속 트리플 킬로 마무리하는 정교한 공식입니다."
    ],
    "notesEn": [
      "Conquers an S-shaped zigzag path (0-1-4-7-8) in minimal 4 moves via dual diagonal and orthogonal coupling.",
      "Anti Diag MX resolves the center tile, priming Rows 3 and 1 for consecutive clean triple-kills."
    ],
    "steps": [
      {
        "stepIndex": 0,
        "subStep": 0,
        "labelKo": "초기 배치 (0-1-4-7-8 지그재그 꼬임)",
        "labelEn": "Initial State (0-1-4-7-8 Zigzag Twist)",
        "label": "초기 배치",
        "boardOps": ["MY", "MX", "ID", "ID", "MY", "ID", "ID", "MX", "MY"],
        "highlightCells": [0, 1, 4, 7, 8],
        "actionDescKo": "0, 1, 4, 7, 8번 지그재그 경로로 MY, MX 위상이 얽혀 있습니다.",
        "actionDescEn": "Zigzag path across cells 0, 1, 4, 7, 8 carries MY and MX phases.",
        "mathInsightKo": "지그재그 경로를 따라 비가환 대칭이 교차된 거리 4 최단 병목 위상입니다.",
        "mathInsightEn": "A distance-4 minimal bottleneck path intertwining non-abelian symmetries.",
        "formulaBadge": "초기 상태",
        "formulaText": "Initial Board",
        "formulaDesc": "지그재그 꼬임 초기 상태"
      },
      {
        "stepIndex": 1,
        "subStep": 1,
        "labelKo": "1수: 주대각선(↖) 180° 회전 (R180 코너·중심 반전 정렬)",
        "labelEn": "Move 1: Main Diag (↖) Rotate 180° (R180 Corner & Center Alignment)",
        "label": "1수: 주대각 R180",
        "boardOps": ["MX", "MX", "ID", "ID", "MX", "ID", "ID", "MX", "MX"],
        "highlightCells": [0, 4, 8],
        "highlightLine": {"type": "diag", "index": "main"},
        "actionDescKo": "1수: 주대각선(↖) 180° 회전 (R180 코너·중심 반전 정렬)",
        "actionDescEn": "Move 1: Main Diag (↖) Rotate 180° (R180 Corner & Center Alignment)",
        "mathInsightKo": "주대각선 {0,4,8}에 R180 적용: MY ∘ R180 = MX로 변환되어 지그재그 축이 MX 단일 위상으로 정렬됩니다.",
        "mathInsightEn": "Applying R180 to Main Diag converts MY ∘ R180 = MX, aligning the zigzag path into MX phase.",
        "formulaBadge": "1수: 주대각 R180",
        "formulaText": "Diag[main] ➔ R180",
        "formulaDesc": "주대각선 180° 회전으로 지그재그 축을 MX로 정렬합니다."
      },
      {
        "stepIndex": 2,
        "subStep": 2,
        "labelKo": "2수: 부대각선(↗) 상하 반사 (중심 4번 소거 및 상하 분배)",
        "labelEn": "Move 2: Anti Diag (↗) Horizontal Reflection (Center Clear & Orthogonal Sync)",
        "label": "2수: 부대각 MX",
        "boardOps": ["MX", "MX", "MX", "ID", "ID", "ID", "MX", "MX", "MX"],
        "highlightCells": [2, 4, 6],
        "highlightLine": {"type": "diag", "index": "anti"},
        "actionDescKo": "2수: 부대각선(↗) 상하 반사 (중심 4번 소거 및 상하 분배)",
        "actionDescEn": "Move 2: Anti Diag (↗) Horizontal Reflection (Center Clear & Orthogonal Sync)",
        "mathInsightKo": "부대각선 {2,4,6}에 MX 적용: 중심(4)이 MX ∘ MX = ID로 소거되고, 잔여 위상이 1행과 3행으로 완벽히 분배됩니다.",
        "mathInsightEn": "Anti Diag MX clears center 4 via MX ∘ MX = ID, distributing residual errors to Rows 1 and 3.",
        "formulaBadge": "2수: 부대각 MX",
        "formulaText": "Diag[anti] ➔ MX",
        "formulaDesc": "부대각선 가로 반사로 중심을 소거하고 상하 행으로 위상을 분배합니다."
      },
      {
        "stepIndex": 3,
        "subStep": 3,
        "labelKo": "3수: 3행 상하 반사 (MX 트리플 킬 폭파)",
        "labelEn": "Move 3: Row 3 Horizontal Reflection (MX Triple-Kill)",
        "label": "3수: 3행 MX",
        "boardOps": ["MX", "MX", "MX", "ID", "ID", "ID", "ID", "ID", "ID"],
        "highlightCells": [6, 7, 8],
        "highlightLine": {"type": "row", "index": 2},
        "actionDescKo": "3수: 3행 상하 반사 (MX 트리플 킬 폭파)",
        "actionDescEn": "Move 3: Row 3 Horizontal Reflection (MX Triple-Kill)",
        "mathInsightKo": "3행 {6,7,8}의 MX 3개가 MX ∘ MX = ID로 일제히 트리플 킬 폭파!",
        "mathInsightEn": "Row 3 MX triggers a Triple-Kill on cells 6, 7, 8 via MX ∘ MX = ID!",
        "formulaBadge": "3수: 3행 MX 트리플 킬",
        "formulaText": "Row₃ ➔ MX",
        "formulaDesc": "3행 가로 반사로 하단 3개 타일을 일제히 폭파합니다."
      },
      {
        "stepIndex": 4,
        "subStep": 4,
        "labelKo": "4수: 1행 상하 반사 (MX 트리플 킬 피니시)",
        "labelEn": "Move 4: Row 1 Horizontal Reflection (MX Triple-Kill Finish)",
        "label": "4수: 1행 MX",
        "boardOps": ["ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID"],
        "highlightCells": [0, 1, 2],
        "highlightLine": {"type": "row", "index": 0},
        "actionDescKo": "4수: 1행 상하 반사 (MX 트리플 킬 피니시)",
        "actionDescEn": "Move 4: Row 1 Horizontal Reflection (MX Triple-Kill Finish)",
        "mathInsightKo": "1행 {0,1,2}의 MX 3개가 일제히 소거되며 100% ID 올클리어 완성!",
        "mathInsightEn": "Row 1 MX eliminates cells 0, 1, 2 for a dramatic Triple-Kill Finish, 100% All Clear!",
        "formulaBadge": "4수: 1행 MX 피니시",
        "formulaText": "Row₁ ➔ MX ➔ 100% 클리어",
        "formulaDesc": "1행 가로 반사로 상단 3개 타일을 소거하여 올클리어를 달성합니다."
      }
    ]
  },
  {
    "id": "d4-corner-sandwich-3",
    "titleKo": "D4 코너 샌드위치 폭파 3수 공식",
    "titleEn": "D4 Corner Sandwich Blitz 3-Move Formula",
    "category": "god-number",
    "badgeKo": "🥪 코너 샌드위치 3수",
    "badgeEn": "🥪 Sandwich Blitz 3M",
    "difficulty": 3,
    "formulaSeq": "1열 MX ➔ 3열 MX ➔ 2행 MX = 전 타일 올클리어",
    "summaryKo": "1열과 3열의 4대 코너(0, 2, 6, 8)와 중심(4)이 2열을 샌드위치처럼 감싸고 있는 X자 형태를 직교 열과 행의 간섭 소거로 단 3수에 격파하는 마스터 공식입니다.",
    "summaryEn": "Conquers 4 corners (0, 2, 6, 8) and center 4 sandwiching Column 2 in minimal 3 moves via orthogonal column and row interference cancellation.",
    "latexFormula": "\\text{Row}_2(M_X) \\circ \\text{Col}_3(M_X) \\circ \\text{Col}_1(M_X) = \\text{ID}",
    "isInteractive": True,
    "tags": ["3수", "샌드위치", "코너", "반사", "마스터", "D4", "신의 수 테크닉"],
    "notesKo": [
      "교차점 상쇄 원리: 1열과 2행의 교차점(3), 3열과 2행의 교차점(5)이 일시적으로 MX를 받았다가 마지막 2행 스와이프로 완벽히 소멸합니다.",
      "4대 코너와 중심이 얽힌 5타일 위상을 최단 3수(Zero-Shortcut)에 격파하는 강력한 실전 피니시입니다."
    ],
    "notesEn": [
      "Intersection cancellation principle: intermediate phases on cells 3 and 5 are created by column moves and wiped out by the final Row 2 sweep.",
      "An optimal 3-move weapon (Zero-Shortcut) to clear 4 corners and center simultaneously."
    ],
    "steps": [
      {
        "stepIndex": 0,
        "subStep": 0,
        "labelKo": "초기 배치 (코너 샌드위치 X자 형태)",
        "labelEn": "Initial State (Corner Sandwich X-Shape)",
        "label": "초기 배치",
        "boardOps": ["MX", "ID", "MX", "ID", "MX", "ID", "MX", "ID", "MX"],
        "highlightCells": [0, 2, 4, 6, 8],
        "actionDescKo": "4개 모서리(0,2,6,8) 및 중심(4)에 MX 배치",
        "actionDescEn": "Four corners (0, 2, 6, 8) and center 4 carry MX phase.",
        "mathInsightKo": "중심과 4대 모서리가 상하 가로 반사로 결속된 대칭 패턴입니다.",
        "mathInsightEn": "A symmetric configuration coupling center and 4 corners in horizontal reflection.",
        "formulaBadge": "초기 상태",
        "formulaText": "Initial Board",
        "formulaDesc": "코너 샌드위치 배치"
      },
      {
        "stepIndex": 1,
        "subStep": 1,
        "labelKo": "1수: 1열 상하 반사 (코너 0, 6 소거 및 교차점 3 생성)",
        "labelEn": "Move 1: Col 1 Horizontal Reflection (Corners 0, 6 Cleared & Intersection 3 Armed)",
        "label": "1수: 1열 MX",
        "boardOps": ["ID", "ID", "MX", "MX", "MX", "ID", "ID", "ID", "MX"],
        "highlightCells": [0, 3, 6],
        "highlightLine": {"type": "col", "index": 0},
        "actionDescKo": "1수: 1열 상하 반사 (코너 0, 6 소거 및 교차점 3 생성)",
        "actionDescEn": "Move 1: Col 1 Horizontal Reflection (Corners 0, 6 Cleared & Intersection 3 Armed)",
        "mathInsightKo": "1열 {0,3,6} 조작: 코너 0, 6이 MX ∘ MX = ID로 소거되고, 교차점 3에 매개 MX가 생성됩니다.",
        "mathInsightEn": "Col 1 MX clears corners 0 and 6 to ID, arming intersection 3 with intermediate MX.",
        "formulaBadge": "1수: 1열 MX",
        "formulaText": "Col₁ ➔ MX",
        "formulaDesc": "1열 가로 반사로 0번과 6번 코너를 소거합니다."
      },
      {
        "stepIndex": 2,
        "subStep": 2,
        "labelKo": "2수: 3열 상하 반사 (코너 2, 8 소거 및 2행 정렬)",
        "labelEn": "Move 2: Col 3 Horizontal Reflection (Corners 2, 8 Cleared & Row 2 Aligned)",
        "label": "2수: 3열 MX",
        "boardOps": ["ID", "ID", "ID", "MX", "MX", "MX", "ID", "ID", "ID"],
        "highlightCells": [2, 5, 8],
        "highlightLine": {"type": "col", "index": 2},
        "actionDescKo": "2수: 3열 상하 반사 (코너 2, 8 소거 및 2행 정렬)",
        "actionDescEn": "Move 2: Col 3 Horizontal Reflection (Corners 2, 8 Cleared & Row 2 Aligned)",
        "mathInsightKo": "3열 {2,5,8} 조작: 코너 2, 8이 소거되고, 교차점 5에 MX 생성! 2행 전체(3, 4, 5)가 순수 MX 단일 위상으로 동기화됩니다.",
        "mathInsightEn": "Col 3 MX clears corners 2 and 8, arming cell 5; synchronizes Row 2 (3, 4, 5) into uniform MX phase.",
        "formulaBadge": "2수: 3열 MX",
        "formulaText": "Col₃ ➔ MX",
        "formulaDesc": "3열 가로 반사로 2번과 8번 코너를 소거하고 2행을 동기화합니다."
      },
      {
        "stepIndex": 3,
        "subStep": 3,
        "labelKo": "3수: 2행 상하 반사 (중심행 트리플 킬 피니시)",
        "labelEn": "Move 3: Row 2 Horizontal Reflection (Row 2 Triple-Kill Finish)",
        "label": "3수: 2행 MX 피니시",
        "boardOps": ["ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID"],
        "highlightCells": [3, 4, 5],
        "highlightLine": {"type": "row", "index": 1},
        "actionDescKo": "3수: 2행 상하 반사 (중심행 트리플 킬 피니시)",
        "actionDescEn": "Move 3: Row 2 Horizontal Reflection (Row 2 Triple-Kill Finish)",
        "mathInsightKo": "2행 {3,4,5}에 MX 적용: 남은 3개 셀이 동시 소거(트리플 킬 폭파)! 100% ID 올클리어 완성!",
        "mathInsightEn": "Row 2 MX wipes tiles 3, 4, 5 simultaneously via MX ∘ MX = ID (Triple-Kill Finish), 100% All Clear!",
        "formulaBadge": "3수: 2행 MX 피니시",
        "formulaText": "Row₂ ➔ MX ➔ 100% 클리어",
        "formulaDesc": "2행 가로 반사로 2행 3개 타일을 일제히 폭파하여 올클리어를 달성합니다."
      }
    ]
  },
  {
    "id": "d4-checker-superposition-4",
    "titleKo": "D4 슈퍼 중첩 체커보드 4수 공식",
    "titleEn": "D4 Checker Superposition 4-Move Formula",
    "category": "god-number",
    "badgeKo": "🏁 중첩 체커 4수",
    "badgeEn": "🏁 Super-Checker 4M",
    "difficulty": 4,
    "formulaSeq": "주대각 R180 ➔ 부대각 R180 ➔ 2열 MD ➔ 2행 MD = 전 타일 올클리어",
    "summaryKo": "4개 코너(R180)와 십자 4개 에지(MD)가 체스판처럼 번갈아 중첩된 외곽 8방향 대칭 위상을 대각선 2축과 십자 2축의 4중 대칭 조작으로 완전 해결하는 마스터 올킬 공식입니다.",
    "summaryEn": "Solves an alternating checkerboard of 4 corners (R180) and 4 cross edges (MD) surrounding center ID via dual diagonal and dual orthogonal strokes in 4 minimal moves.",
    "latexFormula": "\\text{Row}_2(M_D) \\circ \\text{Col}_2(M_D) \\circ \\text{Diag}_{\\text{anti}}(R_{180}) \\circ \\text{Diag}_{\\text{main}}(R_{180}) = \\text{ID}",
    "isInteractive": True,
    "tags": ["4수", "체커보드", "중첩", "회전", "반사", "마스터", "D4", "신의 수 테크닉"],
    "notesKo": [
      "양대각선 180° 회전으로 4대 코너를 먼저 쓸어 담은 뒤, 중심 2열과 2행의 MD 반사로 십자 에지를 순차 폭파하는 완벽한 4중 대칭 공식입니다.",
      "회전과 사선 반사가 체커보드로 얽힌 최고 난도 위상을 지름길 없이 최단 4수(Zero-Shortcut)에 정복합니다."
    ],
    "notesEn": [
      "Sweeps all 4 corners first via dual diagonal 180° rotations, then detonates the cross edges via Col 2 and Row 2 MD reflections.",
      "Conquers an entangled rotational and reflection checkerboard in minimal 4 moves with zero shortcuts."
    ],
    "steps": [
      {
        "stepIndex": 0,
        "subStep": 0,
        "labelKo": "초기 배치 (모서리 R180, 십자 MD 체커보드 중첩)",
        "labelEn": "Initial State (Corner R180, Cross MD Checkerboard)",
        "label": "초기 배치",
        "boardOps": ["R180", "MD", "R180", "MD", "ID", "MD", "R180", "MD", "R180"],
        "highlightCells": [0, 1, 2, 3, 5, 6, 7, 8],
        "actionDescKo": "모서리 R180, 십자 MD의 체커보드 중첩 위상",
        "actionDescEn": "Checkerboard superposition: corners carry R180, edges carry MD.",
        "mathInsightKo": "중심을 제외한 외곽 8방향이 회전과 사선 반사의 이중 대칭으로 얽힌 병목입니다.",
        "mathInsightEn": "An outer 8-directional bottleneck coupling rotations and diagonal reflections.",
        "formulaBadge": "초기 상태",
        "formulaText": "Initial Board",
        "formulaDesc": "체커보드 중첩 위상"
      },
      {
        "stepIndex": 1,
        "subStep": 1,
        "labelKo": "1수: 주대각선(↖) 180° 회전 (코너 0, 8 소거 & 중심 생성)",
        "labelEn": "Move 1: Main Diag (↖) Rotate 180° (Corners 0, 8 Cleared & Center Transition)",
        "label": "1수: 주대각 R180",
        "boardOps": ["ID", "MD", "R180", "MD", "R180", "MD", "R180", "MD", "ID"],
        "highlightCells": [0, 4, 8],
        "highlightLine": {"type": "diag", "index": "main"},
        "actionDescKo": "1수: 주대각선(↖) 180° 회전 (코너 0, 8 소거 & 중심 생성)",
        "actionDescEn": "Move 1: Main Diag (↖) Rotate 180° (Corners 0, 8 Cleared & Center Transition)",
        "mathInsightKo": "주대각선 {0,4,8}에 R180 작용: 코너 0, 8이 R180 ∘ R180 = ID로 소거되고, 중심 4번에 R180이 일시 생성됩니다.",
        "mathInsightEn": "Main Diag R180 wipes corners 0 and 8 to ID while arming center 4 with R180.",
        "formulaBadge": "1수: 주대각 R180",
        "formulaText": "Diag[main] ➔ R180",
        "formulaDesc": "주대각선 180° 회전으로 0번과 8번 코너를 소거합니다."
      },
      {
        "stepIndex": 2,
        "subStep": 2,
        "labelKo": "2수: 부대각선(↗) 180° 회전 (코너 2, 6 소거 & 중심 복귀)",
        "labelEn": "Move 2: Anti Diag (↗) Rotate 180° (Corners 2, 6 Cleared & Center Restored)",
        "label": "2수: 부대각 R180",
        "boardOps": ["ID", "MD", "ID", "MD", "ID", "MD", "ID", "MD", "ID"],
        "highlightCells": [2, 4, 6],
        "highlightLine": {"type": "diag", "index": "anti"},
        "actionDescKo": "2수: 부대각선(↗) 180° 회전 (코너 2, 6 소거 & 중심 복귀)",
        "actionDescEn": "Move 2: Anti Diag (↗) Rotate 180° (Corners 2, 6 Cleared & Center Restored)",
        "mathInsightKo": "부대각선 {2,4,6}에 R180 작용: 코너 2, 6 소거! 중심 4번은 R180 ∘ R180 = ID로 즉시 원상 복귀합니다.",
        "mathInsightEn": "Anti Diag R180 wipes corners 2 and 6, and restores center 4 back to ID via R180² = ID.",
        "formulaBadge": "2수: 부대각 R180",
        "formulaText": "Diag[anti] ➔ R180",
        "formulaDesc": "부대각선 180° 회전으로 2번과 6번 코너를 소거하고 중심을 복구합니다."
      },
      {
        "stepIndex": 3,
        "subStep": 3,
        "labelKo": "3수: 2열 주대각 반사 (에지 1, 7 소거 & 중심 MD 정렬)",
        "labelEn": "Move 3: Col 2 Diagonal Reflection (Edges 1, 7 Cleared & Center Armed)",
        "label": "3수: 2열 MD",
        "boardOps": ["ID", "ID", "ID", "MD", "MD", "MD", "ID", "ID", "ID"],
        "highlightCells": [1, 4, 7],
        "highlightLine": {"type": "col", "index": 1},
        "actionDescKo": "3수: 2열 주대각 반사 (에지 1, 7 소거 & 중심 MD 정렬)",
        "actionDescEn": "Move 3: Col 2 Diagonal Reflection (Edges 1, 7 Cleared & Center Armed)",
        "mathInsightKo": "2열 {1,4,7}에 MD 작용: 셀 1, 7이 MD ∘ MD = ID로 소거되고, 중심 4번에 MD가 부여되어 2행 전체(3, 4, 5)가 순수 MD 위상으로 정렬됩니다.",
        "mathInsightEn": "Col 2 MD cancels edges 1 and 7, setting center 4 to MD; synchronizes Row 2 (3, 4, 5) uniformly to MD phase.",
        "formulaBadge": "3수: 2열 MD",
        "formulaText": "Col₂ ➔ MD",
        "formulaDesc": "2열 대각 반사로 1번과 7번 에지를 소거하고 2행을 동기화합니다."
      },
      {
        "stepIndex": 4,
        "subStep": 4,
        "labelKo": "4수: 2행 주대각 반사 (중심행 MD 트리플 킬 피니시)",
        "labelEn": "Move 4: Row 2 Diagonal Reflection (Row 2 MD Triple-Kill Finish)",
        "label": "4수: 2행 MD 피니시",
        "boardOps": ["ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID", "ID"],
        "highlightCells": [3, 4, 5],
        "highlightLine": {"type": "row", "index": 1},
        "actionDescKo": "4수: 2행 주대각 반사 (중심행 MD 트리플 킬 피니시)",
        "actionDescEn": "Move 4: Row 2 Diagonal Reflection (Row 2 MD Triple-Kill Finish)",
        "mathInsightKo": "2행 {3,4,5}에 MD 작용: 셀 3, 4, 5가 일제히 MD ∘ MD = ID로 소거(트리플 킬 폭파)! 100% ID 올클리어 완성!",
        "mathInsightEn": "Row 2 MD wipes tiles 3, 4, 5 simultaneously via MD ∘ MD = ID (Triple-Kill Finish), achieving 100% All Clear!",
        "formulaBadge": "4수: 2행 MD 피니시",
        "formulaText": "Row₂ ➔ MD ➔ 100% 클리어",
        "formulaDesc": "2행 대각 반사로 중심행 3개 타일을 일제히 폭파하여 올클리어를 달성합니다."
      }
    ]
  }
]

for f in r8_formulas:
    if f['id'] not in existing_ids:
        mined.append(f)
        existing_ids.add(f['id'])
        print(f"Added R8 formula to mined: {f['id']}")

with open(mined_path, 'w', encoding='utf-8') as f:
    json.dump(mined, f, ensure_ascii=False, indent=2)

print(f"Total formulas in minedFormulas.json: {len(mined)}")
