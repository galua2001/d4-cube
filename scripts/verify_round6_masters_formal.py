# -*- coding: utf-8 -*-
import sys
sys.path.append(r'C:\Users\user\matrix-cube\scripts')
from formula_miner import (
    LINES, VALID_MOVES, INT_TO_OP, OP_TO_INT,
    encode_board, decode_board, apply_move, apply_inv_move,
    solve_board_shortest
)

print("=== Round 6 D4 마스터 공식 3선 정밀 수학적 검증 스크립트 ===")

# D0-D3 세트 계산
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

def verify_formula(name, init_board_ops, moves):
    print(f"\n[{name}] 검증 시작:")
    init_code = encode_board([OP_TO_INT[op] for op in init_board_ops])
    
    # 1. 지름길 검증 (Zero-Shortcut Proof)
    k = len(moves)
    in_d0 = init_code in d0
    in_d1 = init_code in d1
    in_d2 = init_code in d2
    in_d3 = init_code in d3
    print(f"  - 초기 상태: {init_board_ops}")
    print(f"  - 에러 타일 수: {sum(1 for op in init_board_ops if op != 'ID')}")
    print(f"  - 거리 집합 멤버십: D0={in_d0}, D1={in_d1}, D2={in_d2}, D3={in_d3}")
    
    if k == 3:
        assert not in_d0 and not in_d1 and not in_d2, "FAIL: 1수 또는 2수 지름길이 존재함!"
        assert in_d3, "FAIL: 3수 상태가 아님!"
        print("  -> [성공] 최단 거리 k=3 (Zero-Shortcut 3수) 완벽 증명!")
    elif k == 4:
        assert not in_d0 and not in_d1 and not in_d2 and not in_d3, "FAIL: 1, 2, 3수 지름길이 존재함!"
        print("  -> [성공] 최단 거리 k=4 (Zero-Shortcut 4수) 완벽 증명!")
    
    # 2. 단계별 시뮬레이션
    curr = init_code
    print("  - 단계별 상태 추적:")
    for step_idx, (l_id, op_str) in enumerate(moves, 1):
        op_int = OP_TO_INT[op_str]
        curr = apply_move(curr, l_id, op_int)
        b_ops = [INT_TO_OP[x] for x in decode_board(curr)]
        rem_err = sum(1 for op in b_ops if op != 'ID')
        print(f"    Step {step_idx}: [{LINES[l_id]['nameKo']} {op_str}] 적용 -> 남은 에러: {rem_err}개")
        print(f"            보드: {b_ops}")
    
    assert curr == 0, f"FAIL: 최종 상태가 올클리어(0)가 아님! (code={curr})"
    print("  -> [성공] 전 타일 100% ID 올클리어 확인!")

# -----------------------------------------------------------------------------
# 1. d4-twin-column-flux-4
# 1열 [R270, R270, R270], 2열 [ID, ID, ID], 3열 [MX, MY, MX]
# moves: Col 1 R90 -> Row 2 R90 -> Col 3 MX -> Row 2 R270
# -----------------------------------------------------------------------------
twin_init = [
    'R270', 'ID', 'MX',
    'R270', 'ID', 'MY',
    'R270', 'ID', 'MX'
]
twin_moves = [
    (3, 'R90'),  # 1열 R90
    (1, 'R90'),  # 2행 R90
    (5, 'MX'),   # 3열 MX
    (1, 'R270')  # 2행 R270
]
verify_formula("1. d4-twin-column-flux-4", twin_init, twin_moves)

# -----------------------------------------------------------------------------
# 2. d4-h-bracket-smash-3
# 1열 [R270, R180, R270], 2열 [ID, R270, ID], 3열 [R270, R180, R270]
# moves: Col 1 R90 -> Row 2 R90 -> Col 3 R90
# -----------------------------------------------------------------------------
h_init = [
    'R270', 'ID',   'R270',
    'R180', 'R270', 'R180',
    'R270', 'ID',   'R270'
]
h_moves = [
    (3, 'R90'), # 1열 R90
    (1, 'R90'), # 2행 R90
    (5, 'R90')  # 3열 R90
]
verify_formula("2. d4-h-bracket-smash-3", h_init, h_moves)

# -----------------------------------------------------------------------------
# 3. d4-star-burst-vortex-4
# 모서리 [R270, R270, R270, R270], 변 [R90, R90, R90, R90], 중심 ID
# moves: Diag main R90 -> Diag anti R90 -> Row 2 R270 -> Col 2 R270
# -----------------------------------------------------------------------------
star_init = [
    'R270', 'R90', 'R270',
    'R90',  'ID',  'R90',
    'R270', 'R90', 'R270'
]
star_moves = [
    (6, 'R90'),  # 주대각선 (↖) R90
    (7, 'R90'),  # 부대각선 (↗) R90
    (1, 'R270'), # 2행 R270
    (4, 'R270')  # 2열 R270
]
verify_formula("3. d4-star-burst-vortex-4", star_init, star_moves)
