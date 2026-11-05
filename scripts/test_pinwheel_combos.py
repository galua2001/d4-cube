# -*- coding: utf-8 -*-
import sys
from pathlib import Path
sys.path.append(r'C:\Users\user\matrix-cube\scripts')
from formula_miner import *

combos = [
    # 둘레길 회전-반사 교차
    [(0, OP_TO_INT['R90']), (5, OP_TO_INT['MX']), (2, OP_TO_INT['R90']), (3, OP_TO_INT['MX'])],
    [(0, OP_TO_INT['R90']), (5, OP_TO_INT['MY']), (2, OP_TO_INT['R90']), (3, OP_TO_INT['MY'])],
    [(0, OP_TO_INT['R90']), (5, OP_TO_INT['MD']), (2, OP_TO_INT['R90']), (3, OP_TO_INT['MD'])],
    [(0, OP_TO_INT['R90']), (5, OP_TO_INT['MAD']), (2, OP_TO_INT['R90']), (3, OP_TO_INT['MAD'])],
    [(0, OP_TO_INT['MX']), (5, OP_TO_INT['R90']), (2, OP_TO_INT['MX']), (3, OP_TO_INT['R90'])],
    [(0, OP_TO_INT['MY']), (5, OP_TO_INT['R90']), (2, OP_TO_INT['MY']), (3, OP_TO_INT['R90'])],
    [(0, OP_TO_INT['MD']), (5, OP_TO_INT['R90']), (2, OP_TO_INT['MD']), (3, OP_TO_INT['R90'])],
    [(0, OP_TO_INT['MAD']), (5, OP_TO_INT['R90']), (2, OP_TO_INT['MAD']), (3, OP_TO_INT['R90'])],
    # 회전 1개 반사 3개 또는 반사 1개 회전 3개
    [(0, OP_TO_INT['R90']), (5, OP_TO_INT['R90']), (2, OP_TO_INT['R90']), (3, OP_TO_INT['MX'])],
    [(0, OP_TO_INT['R90']), (5, OP_TO_INT['R90']), (2, OP_TO_INT['R90']), (3, OP_TO_INT['MY'])],
]

for moves in combos:
    scramble = 0
    for l_id, op_i in reversed(moves):
        scramble = apply_inv_move(scramble, l_id, op_i)
    board = decode_board(scramble)
    path = solve_board_shortest(scramble, max_depth=5)
    m_str = ' -> '.join([f"{LINES[l]['nameKo']} {INT_TO_OP[op]}" for l, op in moves])
    p_str = ' -> '.join([f"{LINES[l]['nameKo']} {INT_TO_OP[op]}" for l, op in path]) if path else 'None'
    print(f"Moves: {m_str}")
    print(f"Shortest ({len(path) if path else 0}): {p_str}")
    print(f"Board: {[INT_TO_OP[o] for o in board]}")
    print("-" * 50)
