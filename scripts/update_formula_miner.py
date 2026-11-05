# -*- coding: utf-8 -*-
import sys
from pathlib import Path

target_file = Path(r"C:\Users\user\matrix-cube\scripts\formula_miner.py")
content = target_file.read_text(encoding="utf-8")

target_marker = "            'tags': ['D4 마스터', '양대각선', '대칭 교차', '4수 동시 폭파', '최단 공식']\n        }\n    ]"

new_items = """            'tags': ['D4 마스터', '양대각선', '대칭 교차', '4수 동시 폭파', '최단 공식']
        },
        {
            'id': 'd4-checkerboard-super-4',
            'titleKo': '체커보드(X자/십자) 위상차 4수 슈퍼 소거',
            'titleEn': 'Checkerboard Phase-Shift 4-Move Super Purge',
            'badgeKo': '🏁 D4 마스터 4수',
            'badgeEn': '🏁 D4 Master 4M',
            'difficulty': 4,
            'summaryKo': 'X자 타일(0,2,4,6,8) 5개는 180도 반전(R180), 십자 타일(1,3,5,7) 4개는 270도 역회전(R270)인 완벽한 체커보드 패턴을 양대각선과 2행·2열로 4수만에 슈퍼 소거합니다.',
            'summaryEn': 'A grand master formula eliminating a perfect checkerboard pattern (X-tiles R180, cross-tiles R270) in exactly 4 moves via dual diagonals and middle cross axes.',
            'moves': [
                (6, OP_TO_INT['R180']), # 주대각선 R180
                (7, OP_TO_INT['R180']), # 부대각선 R180
                (1, OP_TO_INT['R90']),  # 2행 R90
                (4, OP_TO_INT['R90']),  # 2열 R90
            ],
            'insightsKo': [
                '보드 전체가 X자(0,2,4,6,8번 R180)와 십자(1,3,5,7번 R270)의 순수 회전 체커보드 대칭으로 맞물린 최고난도 기하학적 병목입니다.',
                '1수: 주대각선(↖)에 R180을 적용하여 0번, 8번 코너 타일을 즉시 소거하고 중심 4번을 ID로 전환합니다.',
                '2수: 부대각선(↗)에 R180을 적용하여 2번, 6번 코너 타일을 더블 킬(Double Cancel)! 이제 4개 코너가 100% ID로 정복됩니다.',
                '3수: 2행에 R90을 적용하여 3번, 5번 변 타일을 R270 ∘ R90 = ID로 더블 킬! 남은 비틀림이 2열 단일 축으로 완벽 집결됩니다.',
                '4수: 2열에 R90을 가하여 1번, 4번, 7번 3개 타일이 일제히 R270 ∘ R90 = ID로 트리플 킬(Triple Cancel)! 전 타일 올 클리어 완성!'
            ],
            'insightsEn': [
                'A master-level geometric bottleneck where X-tiles carry R180 and cross-tiles carry R270 in a pure checkerboard symmetry.',
                'Move 1: Main diagonal (MD) R180 eliminates corners 0 and 8 while clearing center tile to ID.',
                'Move 2: Anti-diagonal (MAD) R180 delivers a Double-Cancel on corners 2 and 6, leaving all four corners in pure ID.',
                'Move 3: Row 2 R90 scores another Double-Cancel on edges 3 and 5, funneling all residual twists exclusively into Column 2.',
                'Move 4: Col 2 R90 unleashes the final Triple-Kill on cells 1, 4, 7, completing 100% board restoration!'
            ],
            'tags': ['D4 마스터', '체커보드', '4수 슈퍼 소거', '양대각선', '최단 공식']
        },
        {
            'id': 'd4-t-spine-flush-3',
            'titleKo': 'T자형(1행+2열) 척추 정렬 3수 폭파',
            'titleEn': 'T-Spine Alignment 3-Move Flush',
            'badgeKo': '⚡ D4 마스터 3수',
            'badgeEn': '⚡ D4 Master 3M',
            'difficulty': 3,
            'summaryKo': '1행(0,1,2번)과 2열(4,7번)의 T자형 척추만 국소적으로 비틀린 전형적 병목을 1행 R90과 2열 MX의 대칭 치환으로 단 3수만에 완벽 폭파합니다.',
            'summaryEn': 'Flushes an isolated T-shaped spinal bottleneck across Row 1 (0,1,2) and Col 2 (4,7) in exactly 3 moves via Row 1 R90 and Col 2 MX.',
            'moves': [
                (0, OP_TO_INT['R90']),  # 1행 R90
                (4, OP_TO_INT['MX']),   # 2열 MX
                (0, OP_TO_INT['R90']),  # 1행 R90
            ],
            'insightsKo': [
                '1행(0, 1, 2)과 2열 척추(4, 7) 타일들만 뒤틀려 있고 나머지 외곽 타일들은 완전히 맞춰진 T자형 고립 난제입니다.',
                '1수: 1행에 90° 시계 회전(R90)을 가하여 상단 타일들의 위상을 치환하고 2열 척추와의 결합 대칭을 형성합니다.',
                '2수: 2열에 상하 반사(MX)를 가하여 4번, 7번 척추 타일을 더블 킬(Double Cancel) 소거하고 1번 타일의 위상을 0, 2번과 동기화합니다.',
                '3수: 1행 전체에 다시 90° 시계 회전(R90)을 적용하면 0, 1, 2번 3개 타일이 일제히 R270 ∘ R90 = ID로 트리플 킬(Triple Cancel)! 3수 만에 완전 폭파!'
            ],
            'insightsEn': [
                'An isolated T-shaped bottleneck where only Row 1 (0,1,2) and Col 2 spine (4,7) are twisted while others remain solved.',
                'Move 1: Row 1 R90 shifts top tile phases to couple with the central vertical spine.',
                'Move 2: Col 2 MX executes a Double-Cancel on spinal tiles 4 and 7 while synchronizing cell 1 phase with cells 0 and 2.',
                'Move 3: Row 1 R90 triggers the final Triple-Kill on cells 0, 1, 2, flushing the entire T-spine in exactly 3 moves!'
            ],
            'tags': ['D4 마스터', 'T자형', '척추 정렬', '3수 폭파', '최단 공식']
        },
        {
            'id': 'd4-chiral-pinwheel-4',
            'titleKo': '4방향 바람개비형 회전-반사 복합체 4수 올킬',
            'titleEn': '4-Way Chiral Pinwheel 4-Move All-Clear',
            'badgeKo': '🌀 D4 마스터 4수',
            'badgeEn': '🌀 D4 Master 4M',
            'difficulty': 4,
            'summaryKo': '중심(4)은 불변인 채 4변(상하 R270, 좌우 MX)과 4코너(MAD, MD)가 직교 교차하는 카이랄 바람개비 병목을 외곽 둘레길 4수로 올킬합니다.',
            'summaryEn': 'All-clears a mesmerizing 4-way chiral pinwheel (edges alternating R270 & MX, corners mirrored) via outer perimeter loop in 4 swift moves.',
            'moves': [
                (0, OP_TO_INT['R90']),  # 1행 R90
                (5, OP_TO_INT['MX']),   # 3열 MX
                (2, OP_TO_INT['R90']),  # 3행 R90
                (3, OP_TO_INT['MX']),   # 1열 MX
            ],
            'insightsKo': [
                '중심 4번은 ID를 유지하며 상하 변은 R270 회전, 좌우 변은 MX 반사, 4개 코너는 대각선 거울이 걸린 고유 4방향 바람개비 위상차입니다.',
                '1수: 1행에 R90을 적용하여 상단 1번 변 타일을 R270 ∘ R90 = ID로 원샷 소거하고 상단 코너들을 반사 위상으로 전환합니다.',
                '2수: 3열에 MX를 적용하여 2번 코너와 5번 변 타일을 더블 킬(Double Cancel) 소거!',
                '3수: 3행에 R90을 적용하여 7번 변과 8번 코너 타일을 더블 킬 소거! 이제 1열의 3개 타일(0, 3, 6)만 단일 반사 위상으로 집약됩니다.',
                '4수: 1열에 MX를 가하여 0번, 3번, 6번 3개 타일이 일제히 트리플 킬(Triple Cancel)! 바람개비 전체가 100% 항등원으로 올 클리어!'
            ],
            'insightsEn': [
                'A chiral pinwheel bottleneck where edges alternate between R270 rotation and MX reflection around an identity center.',
                'Move 1: Row 1 R90 cancels top edge (1) and transitions top corners into synchronized reflection phases.',
                'Move 2: Col 3 MX scores a Double-Cancel on corner 2 and edge 5.',
                'Move 3: Row 3 R90 delivers another Double-Cancel on edge 7 and corner 8, isolating Column 1 in pure reflection phase.',
                'Move 4: Col 1 MX triggers an explosive Triple-Kill on Column 1 (cells 0, 3, 6), achieving 100% ID all-clear!'
            ],
            'tags': ['D4 마스터', '바람개비', '카이랄 복합체', '4수 올킬', '최단 공식']
        }
    ]"""

norm_content = content.replace("\r\n", "\n")
norm_target = target_marker.replace("\r\n", "\n")

if norm_target in norm_content:
    updated = norm_content.replace(norm_target, new_items)
    target_file.write_text(updated, encoding="utf-8")
    print("SUCCESS: formula_miner.py updated successfully!")
else:
    print("ERROR: Target marker not found in formula_miner.py")
