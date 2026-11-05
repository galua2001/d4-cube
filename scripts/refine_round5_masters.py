# -*- coding: utf-8 -*-
import sys
from pathlib import Path
sys.path.append(r'C:\Users\user\matrix-cube\scripts')
from formula_miner import *
from itertools import product

print("=== Round 5 최적 마스터 공식 3선 정밀 선별 ===")

def test_combination(moves, expected_k):
    scramble = 0
    for l_id, op_i in reversed(moves):
        scramble = apply_inv_move(scramble, l_id, op_i)
    
    init_board = [INT_TO_OP[o] for o in decode_board(scramble)]
    shortest = solve_board_shortest(scramble, max_depth=expected_k + 1)
    if shortest is None or len(shortest) != expected_k:
        return None
    
    curr = scramble
    boards = [init_board]
    cleared_per_step = []
    for l_id, op_i in moves:
        prev_b = [INT_TO_OP[o] for o in decode_board(curr)]
        curr = apply_move(curr, l_id, op_i)
        next_b = [INT_TO_OP[o] for o in decode_board(curr)]
        boards.append(next_b)
        cleared = [ci for ci in range(9) if prev_b[ci] != 'ID' and next_b[ci] == 'ID']
        cleared_per_step.append(cleared)
        
    assert curr == 0
    return {
        'moves': moves,
        'k': expected_k,
        'init_board': init_board,
        'error_cnt': sum(1 for o in init_board if o != 'ID'),
        'boards': boards,
        'cleared_per_step': cleared_per_step
    }

# -------------------------------------------------------------------------
# 1. d4-corner-ring-blitz-4 선별
# 조건: 외곽 링(Row 0, Col 2, Row 2, Col 0)을 돌면서 4개 코너(0, 2, 6, 8) 및 외곽 타일 올킬
# -------------------------------------------------------------------------
ring_lines = [0, 5, 2, 3] # R0 -> C2 -> R2 -> C0 (외곽 둘레)
blitz_candidates = []

# 대칭적이고 우아한 연산자 조합 우선 탐색 (예: R90, R180, 반사 등)
for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY']], repeat=4):
    moves = list(zip(ring_lines, ops))
    res = test_combination(moves, 4)
    if res:
        b = res['init_board']
        # 4개 코너(0, 2, 6, 8)가 모두 ID가 아니어야 함
        if b[0] != 'ID' and b[2] != 'ID' and b[6] != 'ID' and b[8] != 'ID':
            # 외곽 8개 타일 중 에러가 많을수록 (8개 외곽 타일 중 최소 6개 이상)
            outer_errors = sum(1 for idx in [0,1,2,5,8,7,6,3] if b[idx] != 'ID')
            center_is_id = (b[4] == 'ID')
            blitz_candidates.append((res, outer_errors, center_is_id))

# 중심은 보존(ID)되거나 특정 상태이고, 외곽 타일 8개가 전원 에러인 것이 가장 '코너 링 블리츠'에 부합
blitz_candidates.sort(key=lambda x: (x[2], x[1]), reverse=True)
print(f"\n[1] d4-corner-ring-blitz-4 최적 후보 상위 5선:")
for i, (res, out_err, c_id) in enumerate(blitz_candidates[:5]):
    m_str = " -> ".join([f"{LINES[m[0]]['nameKo']} {INT_TO_OP[m[1]]}" for m in res['moves']])
    print(f"후보 {i+1}: 외곽에러={out_err}, 중심ID={c_id}, 초기={res['init_board']}")
    print(f"   수순: {m_str}")
    for st, cl in enumerate(res['cleared_per_step']):
        print(f"   {st+1}수 소거 타일: {cl}")

# -------------------------------------------------------------------------
# 2. d4-cross-inversion-3 선별
# 조건: 십자 변(1, 3, 5, 7) 및 중심(4)의 3수 완전 소거
# -------------------------------------------------------------------------
cross_candidates = []
for lines in [[1, 4, 1], [4, 1, 4], [1, 4, 6], [1, 4, 7]]:
    for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY']], repeat=3):
        moves = list(zip(lines, ops))
        res = test_combination(moves, 3)
        if res:
            b = res['init_board']
            cross_errors = sum(1 for idx in [1, 3, 4, 5, 7] if b[idx] != 'ID')
            corner_errors = sum(1 for idx in [0, 2, 6, 8] if b[idx] != 'ID')
            # 코너는 0개 에러 (순수 십자)
            if corner_errors == 0 and cross_errors >= 4:
                cross_candidates.append((res, cross_errors, corner_errors))

cross_candidates.sort(key=lambda x: x[1], reverse=True)
print(f"\n[2] d4-cross-inversion-3 순수 십자 최적 후보 상위 5선:")
for i, (res, cr_err, co_err) in enumerate(cross_candidates[:5]):
    m_str = " -> ".join([f"{LINES[m[0]]['nameKo']} {INT_TO_OP[m[1]]}" for m in res['moves']])
    print(f"후보 {i+1}: 십자에러={cr_err}/5, 코너에러={co_err}, 초기={res['init_board']}")
    print(f"   수순: {m_str}")
    for st, cl in enumerate(res['cleared_per_step']):
        print(f"   {st+1}수 소거 타일: {cl}")

# -------------------------------------------------------------------------
# 3. d4-diagonal-windmill-4 선별
# 조건: 대각선 및 직교 반사가 결합된 풍차형 위상차 4수 올킬
# 라인: [6, 1, 7, 4] 또는 [6, 0, 7, 2] 또는 [0, 6, 2, 7] 등
# -------------------------------------------------------------------------
windmill_candidates = []
wm_lines_combos = [
    [6, 4, 7, 1], # 주대각선, 2열, 부대각선, 2행 (십자+대각 풍차)
    [6, 1, 7, 4], # 주대각선, 2행, 부대각선, 2열
    [6, 0, 7, 2], # 주대각선, 1행, 부대각선, 3행
    [6, 5, 7, 3], # 주대각선, 3열, 부대각선, 1열
    [0, 6, 2, 7], # 1행, 주대각선, 3행, 부대각선
]

for lines in wm_lines_combos:
    # 대각선과 직교 반사(MX, MY) 및 회전이 결합된 풍차 패턴
    for ops in product([OP_TO_INT['R90'], OP_TO_INT['R180'], OP_TO_INT['R270'], OP_TO_INT['MX'], OP_TO_INT['MY']], repeat=4):
        moves = list(zip(lines, ops))
        res = test_combination(moves, 4)
        if res:
            b = res['init_board']
            # 에러 타일이 많고 (최소 6개 이상), 각 단계별로 점진적으로 타일이 소거되는 패턴
            total_err = res['error_cnt']
            if total_err >= 6:
                # 4단계 모두에서 새로운 타일 소거가 발생하거나 드라마틱한 전환
                cleared_lens = [len(c) for c in res['cleared_per_step']]
                windmill_candidates.append((res, total_err, cleared_lens))

# 4단계 모두에서 타일이 소거되는 균형 잡힌 풍차 수순 우선
windmill_candidates.sort(key=lambda x: (sum(1 for l in x[2] if l > 0), x[1]), reverse=True)
print(f"\n[3] d4-diagonal-windmill-4 최적 후보 상위 5선:")
for i, (res, tot_err, cl_lens) in enumerate(windmill_candidates[:5]):
    m_str = " -> ".join([f"{LINES[m[0]]['nameKo']} {INT_TO_OP[m[1]]}" for m in res['moves']])
    print(f"후보 {i+1}: 전체에러={tot_err}, 소거단계={cl_lens}, 초기={res['init_board']}")
    print(f"   수순: {m_str}")
    for st, cl in enumerate(res['cleared_per_step']):
        print(f"   {st+1}수 소거 타일: {cl}")
