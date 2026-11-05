# -*- coding: utf-8 -*-
"""
translations.ts 에 신규 D4 마스터 공식 3선 및 실전 보드 연습 번역 키 탑재
"""
import sys

target_path = r'C:\Users\user\matrix-cube\src\i18n\translations.ts'

with open(target_path, 'r', encoding='utf-8') as f:
    content = f.read()

en_keys_to_add = '''
    // Practice on Board Mode
    'formula.btnPracticeOnBoard': '🚀 Practice on Board',
    'practice.badgeTitle': '[🎯 Practice: {title}]',
    'practice.targetMoves': 'Target: {moves} moves',
    'practice.perfectTitle': '🏆 Master Formula Perfected!',
    'practice.perfectDesc': '{title} (Completed in {moves} moves!)',
    'practice.shortcutTitle': '⚡ Shortcut Discovered!',
    'practice.shortcutDesc': 'Solved in {moves} moves, faster than target {target}!',
    'practice.clearedTitle': '🎉 Puzzle Solved!',
    'practice.clearedDesc': 'Target was {target} moves, but took {moves} moves.',
    'practice.retry': '↺ Retry Practice',
    'practice.exit': 'Back to Game',
    'practice.exitBtnTitle': 'Exit Practice',

    // New D4 Master Formulas (Round 4)
    'formula.item.d4CheckerboardSuper4.title': 'D4 Checkerboard Phase-Shift 4-Move Super Purge',
    'formula.item.d4CheckerboardSuper4.subtitle': 'Dual diagonal 180° inversions followed by Row 2 and Column 2 sweeps for a full checkerboard purge',
    'formula.item.d4CheckerboardSuper4.desc': 'A checkerboard bottleneck with 5 diagonal tiles (R180) and 4 orthogonal cross tiles (R270). Resolves in 4 moves: [Main Diag R180] ➔ [Anti Diag R180] ➔ [Row 2 R90] ➔ [Col 2 R90] via dual diagonal cancel and a Column 2 triple-kill finish.',
    'formula.item.d4CheckerboardSuper4.tip': 'Dual 180° diagonal inversions clear all 4 corners (0, 2, 6, 8) and the center immediately. Subsequent R90 rotations on Row 2 and Column 2 deliver double-kill and triple-kill clears.',
    'formula.item.d4CheckerboardSuper4.step0': 'Initial State: Checkerboard phase split with 5 diagonal tiles (R180) and 4 cross tiles (R270)',
    'formula.item.d4CheckerboardSuper4.step1': 'Move 1: Main Diag R180 ➔ Cancels tiles 0, 4, 8 simultaneously (Triple-Kill)',
    'formula.item.d4CheckerboardSuper4.step2': 'Move 2: Anti Diag R180 ➔ Cancels corners 2 and 6 (Double-Kill), conquering all 4 corners',
    'formula.item.d4CheckerboardSuper4.step3': 'Move 3: Row 2 R90 ➔ Cancels edge tiles 3 and 5 (Double-Kill), isolates errors into Column 2',
    'formula.item.d4CheckerboardSuper4.step4': 'Move 4: Col 2 R90 ➔ Column 2 tiles (1, 4, 7) wiped simultaneously (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4TSpineFlush3.title': 'D4 T-Spine Alignment 3-Move Flush',
    'formula.item.d4TSpineFlush3.subtitle': 'Row 1 phase coupling followed by Col 2 spine reflection and a final Row 1 triple-kill flush',
    'formula.item.d4TSpineFlush3.desc': 'A localized T-spine bottleneck of Row 1 (0, 1, 2) and Col 2 spine (4, 7). Solves in 3 fast moves: [Row 1 R90] ➔ [Col 2 MX] ➔ [Row 1 R90] via spine cancel and Row 1 triple-kill finish.',
    'formula.item.d4TSpineFlush3.tip': 'Row 1 R90 transforms tile 1 to MD, then Col 2 MX cancels spine tiles (4, 7) while synchronizing Row 1 to R270. The final Row 1 R90 delivers an explosive Triple-Kill.',
    'formula.item.d4TSpineFlush3.step0': 'Initial State: Localized T-spine bottleneck of Row 1 (0, 1, 2) and Col 2 spine (4, 7)',
    'formula.item.d4TSpineFlush3.step1': 'Move 1: Row 1 R90 ➔ Phase coupling (MX ∘ R90 = MD) prepares symmetry with Col 2',
    'formula.item.d4TSpineFlush3.step2': 'Move 2: Col 2 MX ➔ Spine cells 4, 7 cleared (Double-Kill); tile 1 synchronizes to R270',
    'formula.item.d4TSpineFlush3.step3': 'Move 3: Row 1 R90 ➔ Row 1 tiles (0, 1, 2) wipe out via R270 ∘ R90 = ID (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4ChiralPinwheel4.title': 'D4 4-Way Chiral Pinwheel 4-Move All-Clear',
    'formula.item.d4ChiralPinwheel4.subtitle': 'Perimeter loop sequence alternating rotations and reflections to collapse the chiral pinwheel',
    'formula.item.d4ChiralPinwheel4.desc': 'A chiral pinwheel dilemma with orthogonal edges (R270 / MX) and diagonal corners. Cleared in 4 perimeter moves: [Row 1 R90] ➔ [Col 3 MX] ➔ [Row 3 R90] ➔ [Col 1 MX] via perimeter cascade and Col 1 triple-kill.',
    'formula.item.d4ChiralPinwheel4.tip': 'Cycles through perimeter edges and corners in alternating rotation and reflection moves: 1-kill, 2-kill, 2-kill, ending in an explosive triple-kill on Column 1.',
    'formula.item.d4ChiralPinwheel4.step0': 'Initial State: 4-way orthogonal rotation-reflection composite around an identity center',
    'formula.item.d4ChiralPinwheel4.step1': 'Move 1: Row 1 R90 ➔ Top edge tile 1 clears via R270 ∘ R90 = ID (Single-Kill)',
    'formula.item.d4ChiralPinwheel4.step2': 'Move 2: Col 3 MX ➔ Corner 2 and edge 5 cleared simultaneously via MX ∘ MX = ID (Double-Kill)',
    'formula.item.d4ChiralPinwheel4.step3': 'Move 3: Row 3 R90 ➔ Edge 7 and corner 8 cleared (Double-Kill); isolates Column 1 into pure MX phase',
    'formula.item.d4ChiralPinwheel4.step4': 'Move 4: Col 1 MX ➔ Column 1 (0, 3, 6) wiped simultaneously via MX ∘ MX = ID (Triple-Kill Finish), 100% all-clear!'
'''

ko_keys_to_add = '''
    // 실전 보드 연습 모드
    'formula.btnPracticeOnBoard': '🚀 이 공식 직접 풀어보기',
    'practice.badgeTitle': '[🎯 연습 모드: {title}]',
    'practice.targetMoves': '목표: {moves}수',
    'practice.perfectTitle': '🏆 마스터 공식 완벽 마스터!',
    'practice.perfectDesc': '{title} ({moves}수 정타 성공!)',
    'practice.shortcutTitle': '⚡ 놀라운 지름길 발견!',
    'practice.shortcutDesc': '목표 {target}수보다 빠른 {moves}수 만에 완성!',
    'practice.clearedTitle': '🎉 클리어 성공!',
    'practice.clearedDesc': '목표는 {target}수였으나 {moves}수가 소요되었습니다.',
    'practice.retry': '↺ 다시 연습하기',
    'practice.exit': '일반 게임으로 복귀',
    'practice.exitBtnTitle': '연습 종료',

    // D4 신규 마스터 공식 (Round 4)
    'formula.item.d4CheckerboardSuper4.title': 'D4 체커보드(X자/십자) 위상차 4수 슈퍼 소거',
    'formula.item.d4CheckerboardSuper4.subtitle': '양대각선 180° 반전으로 모서리를 잡고 2행/2열 연속 회전으로 체커보드 완전 소거',
    'formula.item.d4CheckerboardSuper4.desc': 'X자 타일 5개(R180)와 십자 타일 4개(R270)의 체커보드 위상차를 [주대각선 R180] ➔ [부대각선 R180] ➔ [2행 R90] ➔ [2열 R90] 4수로 양대각 소거 후 2열 트리플 킬로 마무리하는 D4 마스터 공식입니다.',
    'formula.item.d4CheckerboardSuper4.tip': '주대각선과 부대각선의 180° 반전으로 4개 모서리(0, 2, 6, 8)와 중심을 즉시 해결한 뒤, 2행과 2열의 연속 R90 회전으로 십자 타일들을 차례로 더블 킬, 트리플 킬합니다.',
    'formula.item.d4CheckerboardSuper4.step0': '초기 상태: X자 대각 5개 타일(R180)과 십자 4개 타일(R270)의 체커보드 위상차 배치',
    'formula.item.d4CheckerboardSuper4.step1': '1수: 주대각선(↖) 180° 점대칭 반전 (R180) ➔ 0, 4, 8번 타일 동시 소거 (트리플 킬)',
    'formula.item.d4CheckerboardSuper4.step2': '2수: 부대각선(↗) 180° 점대칭 반전 (R180) ➔ 2번, 6번 코너 즉시 소거 (더블 킬), 4개 모서리 정복',
    'formula.item.d4CheckerboardSuper4.step3': '3수: 2행 90° 시계 회전 (R90) ➔ 3번, 5번 변 타일 소거 (더블 킬), 잔여 비틀림 2열 집결',
    'formula.item.d4CheckerboardSuper4.step4': '4수: 2열 90° 시계 회전 (R90 피니시) ➔ 2열 3개 타일(1, 4, 7번) 일제 소거 (트리플 킬 폭파!), 100% 올클리어 완성!',

    'formula.item.d4TSpineFlush3.title': 'D4 T자형(1행+2열) 척추 정렬 3수 폭파',
    'formula.item.d4TSpineFlush3.subtitle': '1행 위상 결합 후 2열 척추 반사와 1행 트리플 킬로 국소 T자형 병목 3수 완파',
    'formula.item.d4TSpineFlush3.desc': '1행(0, 1, 2)과 2열 척추(4, 7)만 뒤틀린 국소 T자형 배치를 [1행 R90] ➔ [2열 MX] ➔ [1행 R90] 단 3수로 척추 소거 및 1행 트리플 킬로 끝내는 D4 고속 마스터 공식입니다.',
    'formula.item.d4TSpineFlush3.tip': '1행 R90 회전으로 1번 타일을 MD로 치환한 뒤, 2열 MX 반사로 척추(4, 7) 소거와 동시에 1행 전체를 R270으로 동기화하여 마지막 1행 R90으로 폭파합니다.',
    'formula.item.d4TSpineFlush3.step0': '초기 상태: 외곽 4타일은 보존되고 1행과 2열 척추만 뒤틀린 T자형 병목 배치',
    'formula.item.d4TSpineFlush3.step1': '1수: 1행 90° 시계 회전 (R90) ➔ 위상 결합 유도 (MX ∘ R90 = MD)',
    'formula.item.d4TSpineFlush3.step2': '2수: 2열 상하 가로 반사 (MX) ➔ 4번, 7번 척추 소거 (더블 킬), 1번 타일 R270 동기화',
    'formula.item.d4TSpineFlush3.step3': '3수: 1행 90° 시계 회전 (R90 피니시) ➔ 1행 전체(0, 1, 2번) R270 ∘ R90 = ID 전멸 (트리플 킬 폭파!), 3수 종결 올클리어!',

    'formula.item.d4ChiralPinwheel4.title': 'D4 4방향 바람개비형 회전-반사 복합체 4수 올킬',
    'formula.item.d4ChiralPinwheel4.subtitle': '회전과 반사가 교차하는 4방향 둘레길 순환으로 카이랄 바람개비 복합체 완전 정복',
    'formula.item.d4ChiralPinwheel4.desc': '상하 변(R270), 좌우 변(MX), 4대각 코너가 카이랄 바람개비 위상으로 얽힌 난제를 [1행 R90] ➔ [3열 MX] ➔ [3행 R90] ➔ [1열 MX] 4변 둘레길 교차 순환으로 올킬하는 D4 궁극 마스터 공식입니다.',
    'formula.item.d4ChiralPinwheel4.tip': '회전과 반사가 교차하는 4방향 둘레길을 순환하며 1수 원샷 소거, 2수 더블 킬, 3수 더블 킬, 4수 1열 트리플 킬로 마무리됩니다.',
    'formula.item.d4ChiralPinwheel4.step0': '초기 상태: 중심(4) ID 고정, 변과 코너가 직교 회전-반사로 교차된 4방향 바람개비',
    'formula.item.d4ChiralPinwheel4.step1': '1수: 1행 90° 시계 회전 (R90) ➔ 1번 변 타일 R270 ∘ R90 = ID 원샷 소거, 코너 MX 치환',
    'formula.item.d4ChiralPinwheel4.step2': '2수: 3열 상하 가로 반사 (MX) ➔ 2번 코너, 5번 변 동시 소거 (더블 킬)',
    'formula.item.d4ChiralPinwheel4.step3': '3수: 3행 90° 시계 회전 (R90) ➔ 7번 변, 8번 코너 동시 소거 (더블 킬), 1열 MX 집결',
    'formula.item.d4ChiralPinwheel4.step4': '4수: 1열 상하 가로 반사 (MX 피니시) ➔ 1열 전체(0, 3, 6번) MX ∘ MX = ID 트리플 킬 폭파!, 100% 올클리어 완성!'
'''

en_target = "'formula.item.d4DualDiagonalBlitz4.step4': 'Move 4: Row 3 R270 (Triple-Kill Finish) ➔ Row 3 (6, 7, 8) clears via R90 ∘ R270 = ID, 100% all-clear!'"
if en_target not in content:
    print('Error: en_target not found!')
    sys.exit(1)

content = content.replace(en_target, en_target + ',\n' + en_keys_to_add, 1)

ko_target = "'formula.item.d4DualDiagonalBlitz4.step4': '4수: 3행 90° 반시계 회전 (R270 피니시) ➔ 3행 3개 타일 R90 ∘ R270 = ID 동시 소거, 100% 올클리어 완성!'"
if ko_target not in content:
    print('Error: ko_target not found!')
    sys.exit(1)

content = content.replace(ko_target, ko_target + ',\n' + ko_keys_to_add, 1)

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated translations.ts!")
