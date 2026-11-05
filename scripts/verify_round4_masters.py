# -*- coding: utf-8 -*-
import sys
from pathlib import Path
sys.path.append(r'C:\Users\user\matrix-cube\scripts')
from formula_miner import *

formulas = [
    {
        'id': 'd4-checkerboard-super-4',
        'name': '체커보드 위상차 4수 슈퍼 소거',
        'k': 4,
        'moves': [
            (6, OP_TO_INT['R180']), # 주대각선 R180
            (7, OP_TO_INT['R180']), # 부대각선 R180
            (1, OP_TO_INT['R90']),  # 2행 R90
            (4, OP_TO_INT['R90']),  # 2열 R90
        ]
    },
    {
        'id': 'd4-t-spine-flush-3',
        'name': 'T자형(1행+2열) 척추 정렬 3수 폭파',
        'k': 3,
        'moves': [
            (0, OP_TO_INT['R90']),  # 1행 R90
            (4, OP_TO_INT['MX']),   # 2열 MX
            (0, OP_TO_INT['R90']),  # 1행 R90
        ]
    },
    {
        'id': 'd4-chiral-pinwheel-4',
        'name': '4방향 바람개비형 회전-반사 복합체 4수 올킬',
        'k': 4,
        'moves': [
            (0, OP_TO_INT['R90']),  # 1행 R90
            (5, OP_TO_INT['MX']),   # 3열 MX
            (2, OP_TO_INT['R90']),  # 3행 R90
            (3, OP_TO_INT['MX']),   # 1열 MX
        ]
    }
]

print("=== 신규 D4 마스터 공식 3선 BFS 100% 무결점 증명 ===")

for f in formulas:
    moves = f['moves']
    k = f['k']
    fid = f['id']
    name = f['name']
    
    # 1. 역산으로 초기 배치(scramble) 도출
    scramble = 0
    for l_id, op_i in reversed(moves):
        scramble = apply_inv_move(scramble, l_id, op_i)
    
    init_board = [INT_TO_OP[o] for o in decode_board(scramble)]
    
    # 2. BFS 최단 경로 탐색
    path = solve_board_shortest(scramble, max_depth=k + 2)
    path_len = len(path) if path else 0
    assert path_len == k, f"Zero-Shortcut 실패! 기대={k}, 실제={path_len}"
    
    # 3. 단계별 전진 시뮬레이션 및 검증
    curr = scramble
    step_boards = [init_board]
    for idx, (l_id, op_i) in enumerate(moves):
        curr = apply_move(curr, l_id, op_i)
        b = [INT_TO_OP[o] for o in decode_board(curr)]
        step_boards.append(b)
    
    assert curr == 0, f"최종 보드가 ID(0)가 아님: {curr}"
    
    print(f"\n[PASS] [{fid}] {name}")
    print(f"  - 보장 k수: {k}수 (BFS 최단 거리: {path_len}수 - Zero-Shortcut 100%)")
    print(f"  - 초기 배치 (0수): {init_board}")
    for i, (l_id, op_i) in enumerate(moves):
        line_name = LINES[l_id]['nameKo']
        op_name = INT_TO_OP[op_i]
        cleared = [ci for ci, val in enumerate(step_boards[i+1]) if val == 'ID' and step_boards[i][ci] != 'ID']
        print(f"  - {i+1}수: {line_name} {op_name} ➔ 신규 소거 셀: {cleared} ➔ 보드: {step_boards[i+1]}")
    print(f"  - 최종 완성: 100% ID All Clear!")
