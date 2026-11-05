# -*- coding: utf-8 -*-
with open('src/i18n/translations.ts', 'r', encoding='utf-8') as f:
    text = f.read()

en_block = """    'formula.item.diagonalSpineFlush.step3': 'Move 3: Row 1 R90 (Finish) ➔ Row 1 resolves via R270 ∘ R90 = ID, 100% full clear!',

    'formula.item.d4DiamondCross3.title': 'D4 Diamond Cross 3-Move Finish',
    'formula.item.d4DiamondCross3.subtitle': 'Synchronizing center and cross wings into uniform R270 phase for a clean 3-move wipe',
    'formula.item.d4DiamondCross3.desc': 'A high-tier dilemma where wings and center are twisted in a cross pattern. Solves wings and center phase alignment in just 3 moves: [Row 2 R90] ➔ [Col 2 MX] ➔ [Row 2 R90] to achieve 100% all-clear.',
    'formula.item.d4DiamondCross3.tip': 'Rotating Row 2 by 90° transitions side wings into R270, then Column 2 vertical flip (MX) restores top/bottom wings and synthesizes the center into R270. Row 2 R90 then wipes the line clean in one stroke.',
    'formula.item.d4DiamondCross3.step0': 'Initial State: Cross wings (1, 7: MX; 3, 5: R180) and center (4: MX) form diamond cross pattern',
    'formula.item.d4DiamondCross3.step1': 'Move 1: Row 2 R90 (Clockwise 90°) ➔ Wings 3 & 5 become R270, center tile 4 becomes MD',
    'formula.item.d4DiamondCross3.step2': 'Move 2: Col 2 MX (Vertical flip) ➔ Wings 1 & 7 clear via MX² = ID, center tile 4 becomes R270',
    'formula.item.d4DiamondCross3.step3': 'Move 3: Row 2 R90 (Finish wipe) ➔ All Row 2 tiles clear via R270 ∘ R90 = ID, 100% all-clear!',

    'formula.item.d4LDiagCombo3.title': 'D4 L-Diagonal Combo 3-Move Finish',
    'formula.item.d4LDiagCombo3.subtitle': 'Harmonizing diagonal reflection with orthogonal rotation to all-kill an L-shaped cascade',
    'formula.item.d4LDiagCombo3.desc': 'Resolves a 5-error L-shape intersecting Row 1 and Col 3 in just 3 moves: [Row 1 R90] ➔ [Col 3 MD] ➔ [Row 1 R90], utilizing non-commutativity of diagonal symmetry to sweep the entire line.',
    'formula.item.d4LDiagCombo3.tip': 'Rotate Row 1 first to prepare corner phase, then swipe Column 3 with diagonal reflection (MD) to clear Column 3 and focus all remaining errors into Row 1 for a single finish swipe.',
    'formula.item.d4LDiagCombo3.step0': 'Initial State: L-shape error with Row 1 (cells 0, 1: R180) and Col 3 (cells 2, 5, 8: MD)',
    'formula.item.d4LDiagCombo3.step1': 'Move 1: Row 1 R90 (Clockwise 90°) ➔ Tiles 0 & 1 become R270, corner tile 2 becomes MY',
    'formula.item.d4LDiagCombo3.step2': 'Move 2: Col 3 MD (Diagonal swipe) ➔ Tiles 5 & 8 clear via MD² = ID, corner tile 2 becomes R270',
    'formula.item.d4LDiagCombo3.step3': 'Move 3: Row 1 R90 (Finish wipe) ➔ Entire Row 1 clears via R270 ∘ R90 = ID, 100% all-clear!',

    'formula.item.d4XCross3.title': 'D4 X-Cross Corner 3-Move Finish',
    'formula.item.d4XCross3.subtitle': 'Segregating 4 corner errors into clean horizontal lines to annihilate corners in 3 moves',
    'formula.item.d4XCross3.desc': 'Conquers the X-cross dilemma where 4 corners (0, 2, 6, 8) and center (4) are entangled. [Col 2 R270] restores center and synchronizes top/bottom rows into R270, followed by [Row 3 R90] and [Row 1 R90] for complete clearance.',
    'formula.item.d4XCross3.tip': 'Col 2 R270 cancels out center tile 4 (R90 ∘ R270 = ID) while segregating corners into Row 1 and Row 3. Two R90 swipes then clear each row in turn.',
    'formula.item.d4XCross3.step0': 'Initial State: 4 corners (0, 2, 6, 8: R270) and center (4: R90) form an X-cross pattern',
    'formula.item.d4XCross3.step1': 'Move 1: Col 2 R270 (Counter-clockwise 90°) ➔ Center 4 clears to ID, Rows 1 & 3 become pure R270 lines',
    'formula.item.d4XCross3.step2': 'Move 2: Row 3 R90 (Row 3 wipe) ➔ Row 3 tiles (6, 7, 8) clear via R270 ∘ R90 = ID',
    'formula.item.d4XCross3.step3': 'Move 3: Row 1 R90 (Finish wipe) ➔ Row 1 tiles (0, 1, 2) clear via R270 ∘ R90 = ID, 100% all-clear!'"""

ko_block = """    'formula.item.diagonalSpineFlush.step3': '3수: 1행 90° 회전 (R90) ➔ 1행 전체 R270 ∘ R90 = ID 일괄 소거, 100% 올클리어 완성!',

    'formula.item.d4DiamondCross3.title': 'D4 다이아몬드 십자 3수 폭파',
    'formula.item.d4DiamondCross3.subtitle': '중심과 상하좌우 십자 날개의 위상을 단일 R270으로 동기화하여 3수에 일괄 폭파',
    'formula.item.d4DiamondCross3.desc': '상하좌우 날개와 중심이 십자 형태로 뒤틀린 난제를 [2행 R90] ➔ [2열 MX] ➔ [2행 R90] 단 3수로 중심 및 날개 위상을 동기화하여 시원하게 폭파 올클리어하는 D4 핵심 마스터 공식입니다.',
    'formula.item.d4DiamondCross3.tip': '2행 회전으로 좌우 날개를 R270으로 전환한 뒤, 2열 상하 반전(MX)으로 상하 날개를 복구하며 중심을 R270으로 합성시킵니다. 마지막 2행 R90으로 남아있던 2행 전체를 한 방에 폭파합니다.',
    'formula.item.d4DiamondCross3.step0': '초기 상태: 상하 날개(1, 7번: MX), 좌우 날개(3, 5번: R180), 중심(4번: MX)의 다이아몬드 십자 형태',
    'formula.item.d4DiamondCross3.step1': '1수: 2행 90° 시계 회전 (R90) ➔ 좌우 날개(3, 5번) R270 변환, 중심 4번 MD 합성',
    'formula.item.d4DiamondCross3.step2': '2수: 2열 상하 반전 (MX 가로밀기) ➔ 상하 날개(1, 7번) MX² = ID 즉시 복구, 중심 4번 R270 합성 완료',
    'formula.item.d4DiamondCross3.step3': '3수: 2행 90° 시계 회전 (R90 피니시) ➔ 2행 전체 R270 ∘ R90 = ID 일괄 자기상쇄, 100% 올클리어 완성!',

    'formula.item.d4LDiagCombo3.title': 'D4 ㄱ자 사선연계 3수 올킬',
    'formula.item.d4LDiagCombo3.subtitle': '사선 대칭과 직교 회전의 비가환성을 결합해 외곽 ㄱ자 5개 에러를 단 3수에 올킬',
    'formula.item.d4LDiagCombo3.desc': '1행과 3열이 만나는 ㄱ자 형태의 5개 에러를 [1행 R90] ➔ [3열 MD] ➔ [1행 R90] 단 3수로 사선 대칭과 회전의 비가환성을 이용해 1행으로 위상을 집중시켜 한 방에 올킬하는 실전 공식입니다.',
    'formula.item.d4LDiagCombo3.tip': '1행을 먼저 회전시켜 코너 위상을 반사(MY)로 유도한 뒤, 3열 사선 반사(MD)로 3열을 즉시 소거하고 1행 전체를 R270으로 동기화합니다. 마지막 1행 R90으로 한 번에 올킬합니다.',
    'formula.item.d4LDiagCombo3.step0': '초기 상태: 1행(0, 1번: R180)과 3열(2, 5, 8번: MD)이 만나는 ㄱ자형 에러 배치',
    'formula.item.d4LDiagCombo3.step1': '1수: 1행 90° 시계 회전 (R90) ➔ 0, 1번 타일 R270 전이, 코너 2번 타일 MY 변환',
    'formula.item.d4LDiagCombo3.step2': '2수: 3열 사선 반사 (MD 사선밀기) ➔ 5, 8번 타일 MD² = ID 즉시 복구, 코너 2번 타일 R270 합성',
    'formula.item.d4LDiagCombo3.step3': '3수: 1행 90° 시계 회전 (R90 피니시) ➔ 1행 전체 R270 ∘ R90 = ID 일괄 소거, 100% 올클리어 완성!',

    'formula.item.d4XCross3.title': 'D4 X-크로스 모서리동시 3수 폭파',
    'formula.item.d4XCross3.subtitle': '4개 모서리 에러를 상하 라인으로 분리 정렬하여 3수 만에 모서리를 동시 폭파',
    'formula.item.d4XCross3.desc': '4개 모서리(0, 2, 6, 8번)와 중심(4번)이 X자 형태로 얽힌 대칭 난제를 [2열 R270] ➔ [3행 R90] ➔ [1행 R90] 3수로 중심을 먼저 맞추며 상하 라인을 동기화한 뒤 연속 폭파하는 궁극의 모서리 피니시입니다.',
    'formula.item.d4XCross3.tip': '2열 반시계 회전(R270)으로 중심 타일을 자기상쇄(R90 ∘ R270 = ID)시키는 동시에 모서리들을 1행과 3행의 R270 라인으로 정렬합니다. 이후 3행과 1행을 차례로 R90 회전하여 올클리어합니다.',
    'formula.item.d4XCross3.step0': '초기 상태: 4개 모서리(0, 2, 6, 8번: R270)와 중심(4번: R90)이 뒤틀린 X-크로스 패턴',
    'formula.item.d4XCross3.step1': '1수: 2열 90° 반시계 회전 (R270) ➔ 중심 4번 ID 즉시 복구, 1행과 3행이 각각 완전한 R270 라인으로 정렬',
    'formula.item.d4XCross3.step2': '2수: 3행 90° 시계 회전 (R90) ➔ 3행 전체(6, 7, 8번) R270 ∘ R90 = ID 일괄 소거',
    'formula.item.d4XCross3.step3': '3수: 1행 90° 시계 회전 (R90 피니시) ➔ 1행 전체(0, 1, 2번) R270 ∘ R90 = ID 일괄 소거, 100% 올클리어 완성!'"""

target_en = "'formula.item.diagonalSpineFlush.step3': 'Move 3: Row 1 R90 (Finish) ➔ Row 1 resolves via R270 ∘ R90 = ID, 100% full clear!'"
target_ko = "'formula.item.diagonalSpineFlush.step3': '3수: 1행 90° 회전 (R90) ➔ 1행 전체 R270 ∘ R90 = ID 일괄 소거, 100% 올클리어 완성!'"

if target_en not in text:
    print("Error: target_en not found")
if target_ko not in text:
    print("Error: target_ko not found")

text = text.replace(f"    {target_en}", en_block, 1)
text = text.replace(f"    {target_ko}", ko_block, 1)

with open('src/i18n/translations.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print("translations.ts updated successfully!")
