# -*- coding: utf-8 -*-
import sys
from pathlib import Path
sys.path.append(r'C:\Users\user\matrix-cube\scripts')
from formula_miner import (
    LINES, VALID_MOVES, INT_TO_OP, OP_TO_INT,
    encode_board, decode_board, apply_move, apply_inv_move,
    solve_board_shortest
)
from itertools import product

print("=== 갈루아 큐브 Round 6 D4 마스터 공식 3선 탐색 및 BFS 증명 엔진 ===")

# 1. D0, D1, D2, D3 상태 공간 생성
d0 = {0}
d1 = set()
for c in d0:
    for l_id, op in VALID_MOVES:
        nxt = apply_move(c, l_id, op)
        if nxt not in d0:
            d1.add(nxt)

d2 = set()
for c in d1:
    for l_id, op in VALID_MOVES:
        nxt = apply_move(c, l_id, op)
        if nxt not in d0 and nxt not in d1:
            d2.add(nxt)

d3 = set()
for c in d2:
    for l_id, op in VALID_MOVES:
        nxt = apply_move(c, l_id, op)
        if nxt not in d0 and nxt not in d1 and nxt not in d2:
            d3.add(nxt)

print(f"상태 공간 사전 계산 완료: |D0|={len(d0)}, |D1|={len(d1)}, |D2|={len(d2)}, |D3|={len(d3)}")

# -------------------------------------------------------------------------
# [후보 2] d4-h-bracket-smash-3: H자 브래킷 7개 에러 타일 3수 집중 분쇄
# 1열(0, 3, 6), 3열(2, 5, 8), 중심(4) = 총 7개 에러, 1번 및 7번은 ID(0)
# -------------------------------------------------------------------------
print("\n--- [후보 2] d4-h-bracket-smash-3 후보군 탐색 (k=3) ---")
h_bracket_cands = []
for code in d3:
    b = decode_board(code)
    if b[1] == 0 and b[7] == 0:
        if all(b[i] != 0 for i in [0, 3, 6, 2, 5, 8, 4]):
            h_bracket_cands.append(code)

print(f"H자 브래킷 (에러 7개, 1/7번 ID) k=3 후보 개수: {len(h_bracket_cands)}")

def format_moves(moves):
    return " ➔ ".join([f"[{LINES[l]['nameKo']} {INT_TO_OP[op]}]" for l, op in moves])

# 대표적인 아름다운 H자 브래킷 후보군 선별 (대칭성과 군론적 우아함)
h_selected = []
for code in h_bracket_cands:
    b = decode_board(code)
    sol = solve_board_shortest(code, max_depth=3)
    if sol and len(sol) == 3:
        # 좌우 대칭 또는 대각 대칭 여부 점검
        # 1열 [b[0], b[3], b[6]], 3열 [b[2], b[5], b[8]]
        h_selected.append((code, b, sol))

print(f"H자 유효 솔루션 확인: {len(h_selected)}개")
# 상위 5개 출력
for idx, (code, b, sol) in enumerate(h_selected[:8]):
    b_names = [INT_TO_OP[x] for x in b]
    print(f"  H-후보 {idx+1}:")
    print(f"    보드: {b_names}")
    print(f"    1열: {b_names[0]}, {b_names[3]}, {b_names[6]} | 3열: {b_names[2]}, {b_names[5]}, {b_names[8]} | 중심: {b_names[4]}")
    print(f"    수순: {format_moves(sol)}")

# -------------------------------------------------------------------------
# [후보 1] d4-twin-column-flux-4: 1열과 3열 쌍둥이 열 위상차 소거 4수 공식
# 1열(0, 3, 6)과 3열(2, 5, 8)이 서로 반대 위상 (또는 대칭 위상차)
# 2열(1, 4, 7)은 ID(0)이거나 최소 에러, 최단거리 k=4
# -------------------------------------------------------------------------
print("\n--- [후보 1] d4-twin-column-flux-4 후보군 탐색 (k=4) ---")
# 1열, 3열, 그리고 행/대각선 등의 조합으로 4수 공식 탐색
# 1열과 3열이 쌍둥이로 뒤틀리고 2열(1, 4, 7)은 전부 ID인 6개 에러 패턴
twin_cands = []
# 4수 라인 조합: 예: Col 0, Col 2, Row x, Diag y 등
# 역방향으로 4수 조작을 거쳐 생성하되, 중간에 2열 조작 없이 1열과 3열 위상차 발생시키기
for l0, l1, l2, l3 in [
    (3, 5, 0, 2), # Col 1, Col 3, Row 1, Row 3
    (3, 0, 5, 2), # Col 1, Row 1, Col 3, Row 3
    (0, 3, 2, 5), # Row 1, Col 1, Row 3, Col 3
    (3, 1, 5, 1), # Col 1, Row 2, Col 3, Row 2
    (3, 6, 5, 7), # Col 1, Diag main, Col 3, Diag anti
    (0, 5, 2, 3), # Row 1, Col 3, Row 3, Col 1
]:
    for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY']], repeat=4):
        moves = [(l0, ops[0]), (l1, ops[1]), (l2, ops[2]), (l3, ops[3])]
        # scramble
        scramble = 0
        for l_id, op_i in reversed(moves):
            scramble = apply_inv_move(scramble, l_id, op_i)
        
        # 조건: 1, 2, 3수에 풀리지 않아야 함 -> scramble not in d0, d1, d2, d3
        if scramble in d0 or scramble in d1 or scramble in d2 or scramble in d3:
            continue
        
        b = decode_board(scramble)
        # 1열(0, 3, 6) != 0, 3열(2, 5, 8) != 0, 2열(1, 4, 7) == 0 (쌍둥이 열 6개 에러)
        if b[1] == 0 and b[4] == 0 and b[7] == 0:
            if b[0] != 0 and b[3] != 0 and b[6] != 0 and b[2] != 0 and b[5] != 0 and b[8] != 0:
                # 1열과 3열이 대칭적이거나 위상차 관계인지
                twin_cands.append((scramble, b, moves))

print(f"쌍둥이 열 순수 6에러(2열 완전 ID) k=4 후보 수: {len(twin_cands)}")
for idx, (code, b, moves) in enumerate(twin_cands[:5]):
    b_names = [INT_TO_OP[x] for x in b]
    print(f"  Twin-후보 {idx+1}:")
    print(f"    보드: {b_names}")
    print(f"    1열: {b_names[0]}, {b_names[3]}, {b_names[6]} | 3열: {b_names[2]}, {b_names[5]}, {b_names[8]}")
    print(f"    수순: {format_moves(moves)}")

# -------------------------------------------------------------------------
# [후보 3] d4-star-burst-vortex-4: 중심 제외 8방향 별빛 소용돌이 형태 4수 올킬
# 중심(4) == ID(0), 외곽 8개 타일(0, 1, 2, 3, 5, 6, 7, 8) 전부 에러(!=0) (8개 에러)
# 최단거리 k=4 (scramble not in d0, d1, d2, d3)
# -------------------------------------------------------------------------
print("\n--- [후보 3] d4-star-burst-vortex-4 후보군 탐색 (k=4) ---")
star_cands = []
for l0, l1, l2, l3 in [
    (0, 5, 2, 3), # Row 1, Col 3, Row 3, Col 1 (외곽 4변 순환)
    (0, 2, 3, 5), # Row 1, Row 3, Col 1, Col 3
    (6, 7, 0, 2), # Diag main, Diag anti, Row 1, Row 3
    (6, 7, 3, 5), # Diag main, Diag anti, Col 1, Col 3
    (6, 0, 7, 2), # Diag main, Row 1, Diag anti, Row 3
    (0, 6, 2, 7), # Row 1, Diag main, Row 3, Diag anti
]:
    for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY'], OP_TO_INT['MD'], OP_TO_INT['MAD']], repeat=4):
        moves = [(l0, ops[0]), (l1, ops[1]), (l2, ops[2]), (l3, ops[3])]
        scramble = 0
        for l_id, op_i in reversed(moves):
            scramble = apply_inv_move(scramble, l_id, op_i)
        
        # Zero-shortcut k=4 검증
        if scramble in d0 or scramble in d1 or scramble in d2 or scramble in d3:
            continue
        
        b = decode_board(scramble)
        # 중심(4) == 0 이고 외곽 8개 모두 != 0
        if b[4] == 0 and all(b[i] != 0 for i in [0, 1, 2, 3, 5, 6, 7, 8]):
            star_cands.append((scramble, b, moves))

print(f"중심 0, 외곽 8개 에러 별빛 소용돌이 k=4 후보 수: {len(star_cands)}")
for idx, (code, b, moves) in enumerate(star_cands[:5]):
    b_names = [INT_TO_OP[x] for x in b]
    print(f"  Star-후보 {idx+1}:")
    print(f"    보드: {b_names}")
    print(f"    외곽 8개: 모서리({b_names[0]}, {b_names[2]}, {b_names[6]}, {b_names[8]}), 변({b_names[1]}, {b_names[3]}, {b_names[5]}, {b_names[7]})")
    print(f"    수순: {format_moves(moves)}")
