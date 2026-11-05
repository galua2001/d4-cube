# -*- coding: utf-8 -*-
import sys
from pathlib import Path
sys.path.append(r'C:\Users\user\matrix-cube\scripts')
from formula_miner import *
from itertools import product

print("=== Round 5 마스터 공식 3선 후보 탐색 및 BFS 증명 스크립트 ===")

# -------------------------------------------------------------
# 후보 1 탐색: d4-corner-ring-blitz-4
# 코너 0, 2, 6, 8 및 외곽 링을 다루는 4수 조합
# 예: Diag main, Diag anti, Row 0, Row 2, Col 0, Col 2 등의 대칭 조합
# -------------------------------------------------------------
print("\n--- 1. d4-corner-ring-blitz-4 후보군 탐색 ---")

# 외곽 링/코너에 집중하는 라인 조합
# 예 1: (Diag_main, Diag_anti, Row 0, Row 2) 또는 (Row 0, Col 2, Row 2, Col 0 - 외곽 링 순환)
candidate_lines_1 = [
    [0, 5, 2, 3], # Row 0, Col 2, Row 2, Col 0 (외곽 링 4변 순환)
    [6, 7, 0, 2], # Main Diag, Anti Diag, Row 0, Row 2
    [6, 7, 3, 5], # Main Diag, Anti Diag, Col 0, Col 3
    [6, 0, 7, 2], # 교차 형태
]

def test_combination(moves, target_name, expected_k):
    # 역순으로 scramble 생성
    scramble = 0
    for l_id, op_i in reversed(moves):
        scramble = apply_inv_move(scramble, l_id, op_i)
    
    init_board = [INT_TO_OP[o] for o in decode_board(scramble)]
    error_cnt = sum(1 for o in init_board if o != 'ID')
    
    # BFS 최단 경로 검증
    shortest = solve_board_shortest(scramble, max_depth=expected_k + 1)
    if shortest is None:
        return None
    shortest_k = len(shortest)
    if shortest_k != expected_k:
        return None
    
    # 중간 과정 타일 추적
    curr = scramble
    boards = [init_board]
    for l_id, op_i in moves:
        curr = apply_move(curr, l_id, op_i)
        boards.append([INT_TO_OP[o] for o in decode_board(curr)])
    
    assert curr == 0
    return {
        'moves': moves,
        'k': shortest_k,
        'scramble': scramble,
        'init_board': init_board,
        'error_cnt': error_cnt,
        'boards': boards
    }

# 코너 링 블리츠 후보 탐색 (외곽 링 4변 순환: Row 0, Col 2, Row 2, Col 0)
# 연산자 후보: 회전과 반사 (R90, R180, R270, MX, MY)
best_blitz = []
# 링 형태: [0, 5, 2, 3] -> Row 0, Col 2, Row 2, Col 0 (시계방향 외곽 순환)
for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY']], repeat=4):
    moves = list(zip([0, 5, 2, 3], ops))
    res = test_combination(moves, 'corner-ring-blitz', 4)
    if res and res['error_cnt'] >= 6: # 많은 타일이 얽혀있는 박진감 있는 패턴
        # 코너(0, 2, 6, 8) 상태 체크
        c0, c2, c6, c8 = res['init_board'][0], res['init_board'][2], res['init_board'][6], res['init_board'][8]
        if c0 != 'ID' and c2 != 'ID' and c6 != 'ID' and c8 != 'ID':
            best_blitz.append(res)

print(f"외곽 링 순환 blitz 후보 수: {len(best_blitz)}")

# 대각선+외곽 라인 결합 blitz 후보도 탐색: [6, 7, 0, 2]
blitz_diag = []
for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['MX'], OP_TO_INT['MY']], repeat=4):
    moves = list(zip([6, 7, 0, 2], ops))
    res = test_combination(moves, 'corner-diag-blitz', 4)
    if res and res['error_cnt'] >= 6:
        c0, c2, c6, c8 = res['init_board'][0], res['init_board'][2], res['init_board'][6], res['init_board'][8]
        if c0 != 'ID' and c2 != 'ID' and c6 != 'ID' and c8 != 'ID':
            blitz_diag.append(res)
print(f"대각선+외곽 blitz 후보 수: {len(blitz_diag)}")

# -------------------------------------------------------------
# 후보 2 탐색: d4-cross-inversion-3
# 십자(1, 3, 5, 7) 및 중심(4)의 3수 소거
# 라인: Row 1(중심행), Col 1(중심열)을 포함하거나 대각선과의 조합
# -------------------------------------------------------------
print("\n--- 2. d4-cross-inversion-3 후보군 탐색 ---")
# 십자 변(1, 3, 5, 7)과 중심(4)이 주 타겟
# 3수 라인 후보:
# 예: (Col 1, Row 1, Col 1), (Row 1, Col 1, Row 1), 또는 (Row 1, Col 1, Diag), etc.
cross_lines_list = [
    [1, 4, 1], # Row 1, Col 1, Row 1
    [4, 1, 4], # Col 1, Row 1, Col 1
    [1, 4, 6], # Row 1, Col 1, Diag main
    [1, 4, 7], # Row 1, Col 1, Diag anti
]

best_cross = []
for lines in cross_lines_list:
    for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY']], repeat=3):
        # 연속 같은 라인이면 무의미
        if lines[0] == lines[1] or lines[1] == lines[2]:
            continue
        moves = list(zip(lines, ops))
        res = test_combination(moves, 'cross-inversion', 3)
        if res:
            # 십자 타일(1, 3, 5, 7) 및 중심(4) 체크
            b = res['init_board']
            # 중심(4)과 십자 변(1, 3, 5, 7) 중 에러가 중심에 집중된 패턴
            cross_errors = sum(1 for idx in [1, 3, 4, 5, 7] if b[idx] != 'ID')
            corner_errors = sum(1 for idx in [0, 2, 6, 8] if b[idx] != 'ID')
            if cross_errors == 5 and corner_errors == 0:
                # 순수 십자 완전 도치 패턴! (코너는 ID이고 십자 5개 타일만 에러)
                best_cross.append((res, "pure_cross"))
            elif cross_errors >= 4 and res['error_cnt'] >= 5:
                best_cross.append((res, "general_cross"))

print(f"cross-inversion 후보 수: {len(best_cross)}")

# -------------------------------------------------------------
# 후보 3 탐색: d4-diagonal-windmill-4
# 대각선 및 직교 반사가 결합된 풍차형 위상차 4수 올킬
# -------------------------------------------------------------
print("\n--- 3. d4-diagonal-windmill-4 후보군 탐색 ---")
# 대각선(6, 7)과 직교(행/열)가 번갈아 나오거나 풍차형 대칭을 이루는 라인 구성
windmill_lines_list = [
    [6, 1, 7, 4], # Main Diag, Row 1, Anti Diag, Col 1 (중심 십자+대각선 풍차)
    [6, 0, 7, 2], # Main Diag, Row 0, Anti Diag, Row 2
    [6, 3, 7, 5], # Main Diag, Col 0, Anti Diag, Col 2
    [0, 6, 2, 7], # Row 0, Main Diag, Row 2, Anti Diag
    [1, 6, 4, 7], # Row 1, Main Diag, Col 1, Anti Diag
]

best_windmill = []
for lines in windmill_lines_list:
    for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY']], repeat=4):
        moves = list(zip(lines, ops))
        res = test_combination(moves, 'diagonal-windmill', 4)
        if res and res['error_cnt'] >= 6:
            best_windmill.append(res)

print(f"diagonal-windmill 후보 수: {len(best_windmill)}")

