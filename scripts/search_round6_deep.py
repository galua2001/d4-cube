# -*- coding: utf-8 -*-
import sys
sys.path.append(r'C:\Users\user\matrix-cube\scripts')
from formula_miner import (
    LINES, VALID_MOVES, INT_TO_OP, OP_TO_INT,
    encode_board, decode_board, apply_move, apply_inv_move,
    solve_board_shortest
)
from itertools import product

# D0-D3
d0 = {0}
d1 = set()
for c in d0:
    for l_id, op in VALID_MOVES:
        nxt = apply_move(c, l_id, op)
        if nxt not in d0: d1.add(nxt)

d2 = set()
for c in d1:
    for l_id, op in VALID_MOVES:
        nxt = apply_move(c, l_id, op)
        if nxt not in d0 and nxt not in d1: d2.add(nxt)

d3 = set()
for c in d2:
    for l_id, op in VALID_MOVES:
        nxt = apply_move(c, l_id, op)
        if nxt not in d0 and nxt not in d1 and nxt not in d2: d3.add(nxt)

print("Precomputed D0-D3.")

def format_moves(moves):
    return " ➔ ".join([f"[{LINES[l]['nameKo']} {INT_TO_OP[op]}]" for l, op in moves])

# -------------------------------------------------------------
# 1. d4-twin-column-flux-4 정밀 탐색:
# 1열(col 0)과 3열(col 2)이 쌍둥이 열. 2열(1, 4, 7)은 전부 ID.
# 1열과 3열의 위상차가 극명하고 수순이 명료한 4수 공식.
# -------------------------------------------------------------
print("\n=== 1. d4-twin-column-flux-4 후보군 심층 분석 ===")
twin_results = []
# 라인 조합 후보:
# 1열과 3열을 직접 조작하고, 행이나 대각선과의 결합으로 4수
twin_line_combos = [
    (3, 1, 5, 1), # Col 1, Row 2, Col 3, Row 2 (1열-2행-3열-2행)
    (3, 0, 5, 2), # Col 1, Row 1, Col 3, Row 3
    (3, 2, 5, 0), # Col 1, Row 3, Col 3, Row 1
    (3, 6, 5, 7), # Col 1, Diag main, Col 3, Diag anti
    (1, 3, 1, 5), # Row 2, Col 1, Row 2, Col 3
]

for l_combo in twin_line_combos:
    for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY'], OP_TO_INT['MD'], OP_TO_INT['MAD']], repeat=4):
        moves = list(zip(l_combo, ops))
        scramble = 0
        for l_id, op_i in reversed(moves):
            scramble = apply_inv_move(scramble, l_id, op_i)
        
        if scramble in d0 or scramble in d1 or scramble in d2 or scramble in d3:
            continue
        
        b = decode_board(scramble)
        # 2열(1, 4, 7)은 완전 클리어(0)
        if b[1] == 0 and b[4] == 0 and b[7] == 0:
            # 1열 3개 타일이 모두 에러, 3열 3개 타일이 모두 에러
            if b[0] != 0 and b[3] != 0 and b[6] != 0 and b[2] != 0 and b[5] != 0 and b[8] != 0:
                col1 = [INT_TO_OP[b[0]], INT_TO_OP[b[3]], INT_TO_OP[b[6]]]
                col3 = [INT_TO_OP[b[2]], INT_TO_OP[b[5]], INT_TO_OP[b[8]]]
                twin_results.append((scramble, b, moves, col1, col3))

print(f"Twin column flux candidates: {len(twin_results)}")
# 1열과 3열이 균일하거나 반대 위상(R90 vs R270, 또는 거울 대칭 등)인 것 필터
for i, (scramble, b, moves, col1, col3) in enumerate(twin_results[:10]):
    print(f"Cand {i+1}:")
    print(f"  Col 1: {col1} | Col 3: {col3}")
    print(f"  Moves: {format_moves(moves)}")

# -------------------------------------------------------------
# 2. d4-h-bracket-smash-3 심층 분석:
# H자 모양: 1열, 2행, 3열 조작 (Col 1, Row 2, Col 3) -> 7개 에러 타일 올킬!
# -------------------------------------------------------------
print("\n=== 2. d4-h-bracket-smash-3 후보군 심층 분석 ===")
h_pure_line_combos = [
    (3, 1, 5), # Col 1, Row 2, Col 3
    (5, 1, 3), # Col 3, Row 2, Col 1
    (1, 3, 5), # Row 2, Col 1, Col 3
    (3, 5, 1), # Col 1, Col 3, Row 2
]
h_pure_results = []
for l_combo in h_pure_line_combos:
    for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY'], OP_TO_INT['MD'], OP_TO_INT['MAD']], repeat=3):
        moves = list(zip(l_combo, ops))
        scramble = 0
        for l_id, op_i in reversed(moves):
            scramble = apply_inv_move(scramble, l_id, op_i)
        
        if scramble in d0 or scramble in d1 or scramble in d2:
            continue
        if scramble not in d3:
            continue
        
        b = decode_board(scramble)
        # H자 브래킷 조건: 1번과 7번은 ID(0), 나머지 7개 [0, 3, 6, 2, 5, 8, 4]는 전부 에러(!=0)
        if b[1] == 0 and b[7] == 0 and all(b[idx] != 0 for idx in [0, 3, 6, 2, 5, 8, 4]):
            h_pure_results.append((scramble, b, moves))

print(f"H-bracket pure (Col 1, Row 2, Col 3 등) candidates: {len(h_pure_results)}")
for i, (scramble, b, moves) in enumerate(h_pure_results[:8]):
    b_names = [INT_TO_OP[x] for x in b]
    print(f"H Cand {i+1}:")
    print(f"  Board: {b_names}")
    print(f"  1열: {b_names[0]}, {b_names[3]}, {b_names[6]} | 3열: {b_names[2]}, {b_names[5]}, {b_names[8]} | 중심: {b_names[4]}")
    print(f"  Moves: {format_moves(moves)}")

# -------------------------------------------------------------
# 3. d4-star-burst-vortex-4 심층 분석:
# 외곽 8개 에러, 중심 ID, 최단 4수.
# 대각선 및 직교 라인이 결합된 환상적인 별빛 소용돌이 패턴!
# -------------------------------------------------------------
print("\n=== 3. d4-star-burst-vortex-4 후보군 심층 분석 ===")
star_line_combos = [
    (6, 7, 1, 4), # Diag main, Diag anti, Row 2, Col 2 (중심 교차 별빛!)
    (6, 7, 0, 2), # Diag main, Diag anti, Row 1, Row 3
    (6, 7, 3, 5), # Diag main, Diag anti, Col 1, Col 3
    (0, 2, 3, 5), # Row 1, Row 3, Col 1, Col 3 (외곽 4변 대칭)
    (0, 5, 2, 3), # Row 1, Col 3, Row 3, Col 1 (외곽 둘레길)
]
star_results = []
for l_combo in star_line_combos:
    for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY'], OP_TO_INT['MD'], OP_TO_INT['MAD']], repeat=4):
        moves = list(zip(l_combo, ops))
        scramble = 0
        for l_id, op_i in reversed(moves):
            scramble = apply_inv_move(scramble, l_id, op_i)
        
        if scramble in d0 or scramble in d1 or scramble in d2 or scramble in d3:
            continue
        
        b = decode_board(scramble)
        # 중심(4)은 완전 0(ID), 외곽 8개는 모두 != 0
        if b[4] == 0 and all(b[idx] != 0 for idx in [0, 1, 2, 3, 5, 6, 7, 8]):
            star_results.append((scramble, b, moves))

print(f"Star-burst candidates: {len(star_results)}")
for i, (scramble, b, moves) in enumerate(star_results[:10]):
    b_names = [INT_TO_OP[x] for x in b]
    print(f"Star Cand {i+1}:")
    print(f"  Board: {b_names}")
    print(f"  Corners: {b_names[0]}, {b_names[2]}, {b_names[6]}, {b_names[8]} | Edges: {b_names[1]}, {b_names[3]}, {b_names[5]}, {b_names[7]}")
    print(f"  Moves: {format_moves(moves)}")
