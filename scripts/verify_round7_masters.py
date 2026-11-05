# -*- coding: utf-8 -*-
"""
verify_round7_masters.py
Round 7 신규 D4 마스터 공식 3선 정밀 수학적 검증 스크립트:
1. d4-corner-kite-flux-4 (4수)
2. d4-plus-omega-cross-3 (3수)
3. d4-hyper-cube-frame-4 (4수)
"""

import sys
sys.path.append(r'C:\Users\user\matrix-cube\scripts')
from formula_miner import (
    LINES, VALID_MOVES, INT_TO_OP, OP_TO_INT,
    encode_board, decode_board, apply_move, apply_inv_move
)

print("=== Round 7 D4 마스터 공식 3선 정밀 수학적 검증 스크립트 ===")

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

print(f"BFS 탐색 공간 크기: D0={len(d0)}, D1={len(d1)}, D2={len(d2)}, D3={len(d3)}")

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
        active = sum(1 for op in b_ops if op != 'ID')
        print(f"    Step {step_idx}: Line {l_id} + {op_str} -> 남은 비항등원: {active}개, 보드: {b_ops}")
    
    assert curr == 0, f"FAIL: 최종 보드가 0(SOLVED)이 아닙니다! 남은 상태: {[INT_TO_OP[x] for x in decode_board(curr)]}"
    print(f"  -> [성공] 최종 상태 All 'ID' 100% 완전 클리어 확인!")
    return True

# 1. d4-corner-kite-flux-4 (4수)
# Line 6: Main Diag (↖)
# Line 7: Anti Diag (↗)
# Line 5: Col 3
# Line 2: Row 3
kite_init = ['MX', 'ID', 'ID', 'ID', 'ID', 'MX', 'ID', 'MX', 'MX']
kite_moves = [
    (6, 'MX'), # Main Diag (↖) MX
    (7, 'MX'), # Anti Diag (↗) MX
    (5, 'MX'), # Col 3 MX
    (2, 'MX')  # Row 3 MX
]
verify_formula("d4-corner-kite-flux-4", kite_init, kite_moves)

# 2. d4-plus-omega-cross-3 (3수)
# Line 1: Row 2
# Line 4: Col 2
# Line 6: Main Diag (↖)
cross_init = ['MD', 'MAD', 'ID', 'MAD', 'MD', 'MAD', 'ID', 'MAD', 'MD']
cross_moves = [
    (1, 'MAD'), # Row 2 MAD
    (4, 'MAD'), # Col 2 MAD
    (6, 'MD')   # Main Diag (↖) MD
]
verify_formula("d4-plus-omega-cross-3", cross_init, cross_moves)

# 3. d4-hyper-cube-frame-4 (4수)
# Line 0: Row 1
# Line 2: Row 3
# Line 3: Col 1
# Line 5: Col 3
frame_init = ['R180', 'R270', 'R180', 'R270', 'ID', 'R270', 'R180', 'R270', 'R180']
frame_moves = [
    (0, 'R90'), # Row 1 R90
    (2, 'R90'), # Row 3 R90
    (3, 'R90'), # Col 1 R90
    (5, 'R90')  # Col 3 R90
]
verify_formula("d4-hyper-cube-frame-4", frame_init, frame_moves)

print("\n=======================================================")
print("🎉 Round 7 신규 D4 마스터 공식 3선 수학적 검증 100% 무결점 통과!")
print("=======================================================")
