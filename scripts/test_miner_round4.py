# -*- coding: utf-8 -*-
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent))
from formula_miner import *

print("=== 1. Searching d4-t-spine-flush-3 ===")
# T자형: cells {0, 1, 2, 4, 7}
# T-Spine: 1행(Row 0: 0, 1, 2) + 2열(Col 1: 1, 4, 7).
# 3, 5, 6, 8번 타일이 모두 ID(0)이고 T자 타일들이 비틀린 형태
t_candidates = []
for m1 in VALID_MOVES:
    for m2 in VALID_MOVES:
        if m2[0] == m1[0]: continue
        for m3 in VALID_MOVES:
            if m3[0] == m2[0]: continue
            moves = [m1, m2, m3]
            scramble = 0
            for l_id, op_i in reversed(moves):
                scramble = apply_inv_move(scramble, l_id, op_i)
            board = decode_board(scramble)
            # T자형 타일(0,1,2,4,7) 외에는 0
            if board[3] == 0 and board[5] == 0 and board[6] == 0 and board[8] == 0:
                non_zero_t = sum(1 for idx in [0, 1, 2, 4, 7] if board[idx] != 0)
                if non_zero_t >= 4:
                    path = solve_board_shortest(scramble, max_depth=4)
                    if path and len(path) == 3:
                        t_candidates.append((moves, board, path))
                        if len(t_candidates) >= 15:
                            break
        if len(t_candidates) >= 15: break
    if len(t_candidates) >= 15: break

print(f"Found {len(t_candidates)} candidates for T-Spine:")
for idx, (c_moves, c_board, path) in enumerate(t_candidates[:5]):
    m_str = " -> ".join([f"{LINES[l]['nameKo']} {INT_TO_OP[op]}" for l, op in c_moves])
    p_str = " -> ".join([f"{LINES[l]['nameKo']} {INT_TO_OP[op]}" for l, op in path])
    b_str = [INT_TO_OP[o] for o in c_board]
    print(f"[{idx+1}] Solution: {m_str}")
    print(f"    Shortest BFS: {p_str}")
    print(f"    Board (0-8): {b_str}")

print("\n=== 2. Searching d4-checkerboard-super-4 ===")
# 체커보드:
# X자 (0, 2, 4, 6, 8)와 십자 (1, 3, 5, 7)의 위상차
# 예: X자 타일들이 동일한 위상(예: R180, MD, MAD 등)이고 십자 타일들이 또 다른 위상(예: ID이거나 다른 연산자)
# 또는 X자와 십자가 교차 패턴을 이루는 형태
checker_candidates = []
# 4수 조합 탐색 (행/열/대각선 조합)
# 대각선 2개(6, 7)와 행/열(0,1,2,3,4,5) 또는 행/열 4개
# 특히 체커보드는 주대각선(6)과 부대각선(7)을 사용하면 X자(0,2,4,6,8)를 조작하고,
# 2행(1)과 2열(4)을 사용하면 십자(1,3,4,5,7)를 조작함!
test_lines_set = [
    (6, 7, 1, 4), # MD, MAD, Row 2, Col 2
    (1, 4, 6, 7),
    (6, 1, 7, 4),
    (0, 2, 3, 5), # Row 1, Row 3, Col 1, Col 3
    (3, 5, 0, 2)
]

for l0, l1, l2, l3 in test_lines_set:
    for o0 in range(1, 8):
        for o1 in range(1, 8):
            for o2 in range(1, 8):
                for o3 in range(1, 8):
                    moves = [(l0, o0), (l1, o1), (l2, o2), (l3, o3)]
                    scramble = 0
                    for l_id, op_i in reversed(moves):
                        scramble = apply_inv_move(scramble, l_id, op_i)
                    board = decode_board(scramble)
                    # 체커보드 패턴 판정:
                    # X자 타일들 {0, 2, 6, 8}이 같은 값이고, 십자 타일들 {1, 3, 5, 7}이 같은 값(또는 대칭적)
                    x_vals = [board[0], board[2], board[6], board[8]]
                    plus_vals = [board[1], board[3], board[5], board[7]]
                    center_val = board[4]
                    if len(set(x_vals)) == 1 and len(set(plus_vals)) == 1:
                        # X자와 십자가 다르고, 적어도 하나는 0이 아님
                        if x_vals[0] != plus_vals[0] and (x_vals[0] != 0 or plus_vals[0] != 0):
                            path = solve_board_shortest(scramble, max_depth=5)
                            if path and len(path) == 4:
                                checker_candidates.append((moves, board, path))
                                if len(checker_candidates) >= 20: break
                if len(checker_candidates) >= 20: break
            if len(checker_candidates) >= 20: break
        if len(checker_candidates) >= 20: break
    if len(checker_candidates) >= 20: break

print(f"Found {len(checker_candidates)} checkerboard candidates:")
for idx, (c_moves, c_board, path) in enumerate(checker_candidates[:8]):
    m_str = " -> ".join([f"{LINES[l]['nameKo']} {INT_TO_OP[op]}" for l, op in c_moves])
    p_str = " -> ".join([f"{LINES[l]['nameKo']} {INT_TO_OP[op]}" for l, op in path])
    b_str = [INT_TO_OP[o] for o in c_board]
    print(f"[{idx+1}] Solution: {m_str}")
    print(f"    Shortest BFS: {p_str}")
    print(f"    Board (0-8): {b_str}")

print("\n=== 3. Searching d4-chiral-pinwheel-4 ===")
# 바람개비형 회전-반사 복합체:
# 4방향으로 회전-반사가 걸려 있는 카이랄 바람개비
# 코너 0, 2, 8, 6 과 변 1, 5, 7, 3이 90도 회전(순환)하면서 
# 회전(R90/R270)과 반사(MX/MY/MD/MAD)가 융합된 복합체!
pinwheel_candidates = []

# 둘레길 연산 4개 (Row 0, Col 2, Row 2, Col 0) 또는 대칭 축 4개
perimeter_lines = [0, 5, 2, 3] # 1행, 3열, 3행, 1열
# 회전과 반사가 복합된 moves 탐색
# 2개는 반사, 2개는 회전이거나, 회전-반사 교차
import itertools

op_pool_reflection = [OP_TO_INT['MX'], OP_TO_INT['MY'], OP_TO_INT['MD'], OP_TO_INT['MAD']]
op_pool_rotation = [OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270']]

# 혼합 패턴: [반사, 회전, 반사, 회전] 또는 [회전, 반사, 회전, 반사] 등
combos = [
    [0, 5, 2, 3], # 둘레길
    [0, 2, 3, 5],
    [6, 7, 0, 2],
    [6, 7, 3, 5],
    [6, 0, 7, 2],
]

for lines in combos:
    for o0 in [OP_TO_INT['MX'], OP_TO_INT['MY'], OP_TO_INT['MD'], OP_TO_INT['MAD'], OP_TO_INT['R90'], OP_TO_INT['R270']]:
        for o1 in [OP_TO_INT['MX'], OP_TO_INT['MY'], OP_TO_INT['MD'], OP_TO_INT['MAD'], OP_TO_INT['R90'], OP_TO_INT['R270']]:
            for o2 in [OP_TO_INT['MX'], OP_TO_INT['MY'], OP_TO_INT['MD'], OP_TO_INT['MAD'], OP_TO_INT['R90'], OP_TO_INT['R270']]:
                for o3 in [OP_TO_INT['MX'], OP_TO_INT['MY'], OP_TO_INT['MD'], OP_TO_INT['MAD'], OP_TO_INT['R90'], OP_TO_INT['R270']]:
                    moves = [(lines[0], o0), (lines[1], o1), (lines[2], o2), (lines[3], o3)]
                    # 회전과 반사가 모두 포함되어야 복합체
                    has_refl = any(INT_TO_OP[op] in ['MX', 'MY', 'MD', 'MAD'] for _, op in moves)
                    has_rot = any(INT_TO_OP[op] in ['R90', 'R180', 'R270'] for _, op in moves)
                    if not (has_refl and has_rot):
                        continue
                    
                    scramble = 0
                    for l_id, op_i in reversed(moves):
                        scramble = apply_inv_move(scramble, l_id, op_i)
                    board = decode_board(scramble)

                    # 바람개비성 체크:
                    # 4개 코너(0, 2, 8, 6)와 4개 변(1, 5, 7, 3)의 패턴
                    # 비항등원 타일이 6개 이상이고 중심(4)은 대칭적이거나 ID
                    non_zero_cnt = sum(1 for o in board if o != 0)
                    if non_zero_cnt >= 6:
                        # 4변(1, 5, 7, 3)과 4코너(0, 2, 8, 6) 관찰
                        path = solve_board_shortest(scramble, max_depth=5)
                        if path and len(path) == 4:
                            pinwheel_candidates.append((moves, board, path))
                            if len(pinwheel_candidates) >= 15: break
                if len(pinwheel_candidates) >= 15: break
            if len(pinwheel_candidates) >= 15: break
        if len(pinwheel_candidates) >= 15: break
    if len(pinwheel_candidates) >= 15: break

print(f"Found {len(pinwheel_candidates)} pinwheel candidates:")
for idx, (c_moves, c_board, path) in enumerate(pinwheel_candidates[:8]):
    m_str = " -> ".join([f"{LINES[l]['nameKo']} {INT_TO_OP[op]}" for l, op in c_moves])
    p_str = " -> ".join([f"{LINES[l]['nameKo']} {INT_TO_OP[op]}" for l, op in path])
    b_str = [INT_TO_OP[o] for o in c_board]
    print(f"[{idx+1}] Solution: {m_str}")
    print(f"    Shortest BFS: {p_str}")
    print(f"    Board (0-8): {b_str}")
