# -*- coding: utf-8 -*-
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parent))
from formula_miner import *

print("=== Precision Search for Perfect Chiral Pinwheel ===")

# 바람개비의 기하학적 정의:
# 중심(4) == 0 (ID)
# 변 타일: 1 (상), 5 (우), 7 (하), 3 (좌)
# 코너 타일: 0 (좌상), 2 (우상), 8 (우하), 6 (좌하)
# 4방향 바람개비는 90도 회전에 대해 일정한 위상차(카이랄 대칭)를 가짐.

# 둘레길 4라인: 0(Row 0), 5(Col 2), 2(Row 2), 3(Col 0)
lines = [0, 5, 2, 3]

results = []
# 둘레길 4개 라인에 연산자 배정
for o0 in range(1, 8):
    for o1 in range(1, 8):
        for o2 in range(1, 8):
            for o3 in range(1, 8):
                moves = [(0, o0), (5, o1), (2, o2), (3, o3)]
                
                # 회전과 반사가 모두 섞여 있어야 함
                ops = [INT_TO_OP[o] for o in [o0, o1, o2, o3]]
                has_refl = any(op in ['MX', 'MY', 'MD', 'MAD'] for op in ops)
                has_rot = any(op in ['R90', 'R180', 'R270'] for op in ops)
                if not (has_refl and has_rot):
                    continue

                scramble = 0
                for l_id, op_i in reversed(moves):
                    scramble = apply_inv_move(scramble, l_id, op_i)
                board = decode_board(scramble)

                # 중심은 0 (ID)
                if board[4] != 0:
                    continue

                # 4개 변 타일(1, 5, 7, 3)과 4개 코너 타일(0, 2, 8, 6)이 모두 0이 아닌 경우
                if all(board[i] != 0 for i in [0, 1, 2, 3, 5, 6, 7, 8]):
                    path = solve_board_shortest(scramble, max_depth=5)
                    if path and len(path) == 4:
                        # 4변 타일들의 값 분포
                        edge_ops = [board[1], board[5], board[7], board[3]]
                        corner_ops = [board[0], board[2], board[8], board[6]]
                        results.append((moves, board, path, edge_ops, corner_ops))

print(f"Total pure pinwheels found: {len(results)}")
for idx, (m, b, p, edges, corners) in enumerate(results[:10]):
    m_str = " -> ".join([f"{LINES[l]['nameKo']} {INT_TO_OP[op]}" for l, op in m])
    p_str = " -> ".join([f"{LINES[l]['nameKo']} {INT_TO_OP[op]}" for l, op in p])
    b_names = [INT_TO_OP[o] for o in b]
    edge_names = [INT_TO_OP[o] for o in edges]
    corner_names = [INT_TO_OP[o] for o in corners]
    print(f"--- Pinwheel Candidate #{idx+1} ---")
    print(f" Moves: {m_str}")
    print(f" Shortest: {p_str}")
    print(f" Board: {b_names}")
    print(f" Edges (N, E, S, W): {edge_names}")
    print(f" Corners (NW, NE, SE, SW): {corner_names}")
