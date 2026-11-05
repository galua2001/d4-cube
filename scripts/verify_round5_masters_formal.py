# -*- coding: utf-8 -*-
"""
verify_round5_masters_formal.py
Round 5 신규 D4 마스터 공식 3선 BFS 완전 증명 스크립트
1. d4-corner-ring-blitz-4
2. d4-cross-inversion-3
3. d4-diagonal-windmill-4
"""

import sys
from pathlib import Path
sys.path.append(r'C:\Users\user\matrix-cube\scripts')
from formula_miner import *

FORMULAS = [
    {
        'id': 'd4-corner-ring-blitz-4',
        'titleKo': '4대 코너 링 블리츠 (0·2·6·8 외곽 순환 4수 소거)',
        'titleEn': 'Corner Ring Blitz (4-Corner Outer Perimeter 4-Move Wipeout)',
        'k': 4,
        'moves': [
            (0, OP_TO_INT['R90']), # 1행 R90
            (5, OP_TO_INT['R90']), # 3열 R90
            (2, OP_TO_INT['R90']), # 3행 R90
            (3, OP_TO_INT['R90']), # 1열 R90
        ],
        'tags': ['4수', '회전', '코너', '마스터', 'D4'],
        'insights': [
            '중앙 타일(4)은 완벽한 ID 상태를 유지하고, 외곽 8개 타일이 90°/180° 위상차로 갇혀 있는 고유 병목 패턴입니다.',
            '1행을 90° 회전하여 상단 1번 변 타일을 선제 정렬하고 우측 코너와 변의 연결 위상을 정돈합니다.',
            '3열을 90° 회전하여 우상단(2) 코너 및 우측 변(5) 2개 타일을 동시 더블 킬합니다!',
            '3행을 90° 회전하여 하단 변(7) 및 우하단(8) 코너를 연속 제압하며 외곽 포위망을 좁힙니다.',
            '1열 90° 회전으로 좌상단(0), 좌측(3), 좌하단(6) 3개 타일을 일제 트리플 킬하며 100% ID 완전 복원!'
        ]
    },
    {
        'id': 'd4-cross-inversion-3',
        'titleKo': '십자 변·중심 위상 도치 3수 킬 (Cross Inversion)',
        'titleEn': 'Cross Inversion (3-Move Center-Cross Phase Annihilation)',
        'k': 3,
        'moves': [
            (1, OP_TO_INT['R90']), # 2행 R90
            (4, OP_TO_INT['MX']),  # 2열 MX
            (1, OP_TO_INT['R90']), # 2행 R90
        ],
        'tags': ['3수', '십자', '반사', '회전', '마스터', 'D4'],
        'insights': [
            '4개 코너(0, 2, 6, 8)는 완벽한 ID를 유지한 채, 십자 5개 타일(1, 3, 4, 5, 7)만 반사·회전 위상으로 도치된 순수 십자 패턴입니다.',
            '중심 2행을 90° 회전시켜 수평 위상차를 수직 축으로 비틀어 반사 상쇄 레버리지를 만듭니다.',
            '중심 2열을 상하 반사(MX)하여 상단(1) 및 하단(7) 십자 타일을 동시 소거(더블 킬)합니다!',
            '2행을 90° 추가 회전하여 중심(4)과 좌우(3, 5) 3개 타일을 일제히 상쇄(트리플 킬)하며 올클리어!'
        ]
    },
    {
        'id': 'd4-diagonal-windmill-4',
        'titleKo': '대각선·직교 풍차형 위상차 4수 올킬 (Diagonal Windmill)',
        'titleEn': 'Diagonal Windmill (4-Move Diagonal-Orthogonal Phase Blitz)',
        'k': 4,
        'moves': [
            (6, OP_TO_INT['R90']), # 주대각선 R90
            (4, OP_TO_INT['R90']), # 2열 R90
            (7, OP_TO_INT['R90']), # 부대각선 R90
            (1, OP_TO_INT['MX']),  # 2행 MX
        ],
        'tags': ['4수', '대각선', '풍차', '반사', '마스터', 'D4'],
        'insights': [
            '주대각선 반사(MD)와 직교 반사(MX), 회전 위상이 9개 전 타일에 바람개비형으로 얽힌 고난도 위상차 패턴입니다.',
            '주대각선(↖)을 90° 회전하여 대각 양 끝점인 0번과 8번 코너 타일을 즉시 소거합니다.',
            '중심 2열을 90° 회전하여 수직 십자 변인 1번과 7번 타일을 더블 킬 소거합니다.',
            '부대각선(↗)을 90° 회전하여 반대편 2번과 6번 코너 타일을 더블 킬 소거합니다.',
            '중심 2행을 가로 반사(MX)하여 남은 중심행 타일(3, 4, 5)을 일제히 제압하며 100% ID All Clear!'
        ]
    }
]

def run_formal_verification():
    print("======================================================================")
    print("  Galois Cube D4 Master Formulas Round 5 - Formal BFS Verification")
    print("======================================================================")

    for item in FORMULAS:
        fid = item['id']
        title = item['titleKo']
        k = item['k']
        moves = item['moves']

        # 1. 역조작을 통한 초기 보드 생성
        scramble = 0
        for l_id, op_i in reversed(moves):
            scramble = apply_inv_move(scramble, l_id, op_i)
        
        init_board = [INT_TO_OP[o] for o in decode_board(scramble)]
        
        # 2. 양방향 BFS를 통한 최단 거리 증명
        shortest_path = solve_board_shortest(scramble, max_depth=k + 2)
        assert shortest_path is not None, f"[{fid}] BFS 해결 불가!"
        shortest_len = len(shortest_path)
        assert shortest_len == k, f"[{fid}] Zero-Shortcut 실패: 기대 {k}수, 실제 {shortest_len}수"
        
        # 3. 단계별 타일 소거 상태 추적
        curr = scramble
        step_details = []
        for step_idx, (l_id, op_i) in enumerate(moves):
            prev_b = [INT_TO_OP[o] for o in decode_board(curr)]
            curr = apply_move(curr, l_id, op_i)
            next_b = [INT_TO_OP[o] for o in decode_board(curr)]
            cleared = [ci for ci in range(9) if prev_b[ci] != 'ID' and next_b[ci] == 'ID']
            step_details.append({
                'step': step_idx + 1,
                'lineNameKo': LINES[l_id]['nameKo'],
                'opName': INT_TO_OP[op_i],
                'cleared': cleared,
                'board': next_b
            })
        
        assert curr == 0, f"[{fid}] 최종 보드가 0(All ID)가 아님: {curr}"

        print(f"\n[VERIFIED PASS] ID: {fid}")
        print(f"  - 공식명: {title}")
        print(f"  - 수학적 보장 수 (k): {k}수")
        print(f"  - 양방향 BFS 최단 거리: {shortest_len}수 (Zero-Shortcut 100% 무결)")
        print(f"  - 초기 보드 (0수): {init_board}")
        for s in step_details:
            print(f"    * {s['step']}수: {s['lineNameKo']} {s['opName']} ➔ 소거 타일 인덱스: {s['cleared']} ➔ 남은 에러: {sum(1 for t in s['board'] if t != 'ID')}개")
        print(f"  - 최종 상태: All 9 Tiles ID Restored (100% 완료)")

    print("\n======================================================================")
    print("  Round 5 D4 공식 3선 BFS 증명 100% 통과 완료! 모든 지름길 부재 확인.")
    print("======================================================================")

if __name__ == '__main__':
    run_formal_verification()
