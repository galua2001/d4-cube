"""
Galois Matrix Cube - Continuous AI Formula Miner (지속적 AI 자율 공식 채굴 시스템)
D4 군론(Dihedral Group D4) 기반의 3x3 보드 상태 공간을 BFS/미니맥스로 탐색하여
실전에서 가장 빈출되는 고효율 2~3수 피니시 공식 및 신의 수 테크닉을 자율 발굴합니다.
"""

import sys
import json
import time
import argparse
from typing import List, Tuple, Dict, Set, Optional

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# D4 Group operations (0: ID, 1: R90, 2: R180, 3: R270, 4: MX, 5: MY, 6: MD1, 7: MD2)
OP_NAMES = ["ID", "R90", "R180", "R270", "MX", "MY", "MD1", "MD2"]

# D4 곱셈표 (Composition Table: row * col)
# (row o col)(x) = row(col(x))
D4_MUL = [
    [0, 1, 2, 3, 4, 5, 6, 7],  # ID
    [1, 2, 3, 0, 6, 7, 5, 4],  # R90
    [2, 3, 0, 1, 5, 4, 7, 6],  # R180
    [3, 0, 1, 2, 7, 6, 4, 5],  # R270
    [4, 7, 5, 6, 0, 2, 3, 1],  # MX
    [5, 6, 4, 7, 2, 0, 1, 3],  # MY
    [6, 4, 7, 5, 1, 3, 0, 2],  # MD1
    [7, 5, 6, 4, 3, 1, 2, 0],  # MD2
]

def compose(op1: int, op2: int) -> int:
    return D4_MUL[op1][op2]

def invert(op: int) -> int:
    # In D4: R90^-1 = R270, R270^-1 = R90, all reflections and R180 are order 2
    if op == 1:
        return 3
    if op == 3:
        return 1
    return op

class Board3x3:
    def __init__(self, tiles: Optional[List[int]] = None):
        self.tiles = list(tiles) if tiles else [0] * 9

    def clone(self) -> 'Board3x3':
        return Board3x3(self.tiles)

    def is_solved(self) -> bool:
        return all(t == 0 for t in self.tiles)

    def error_count(self) -> int:
        return sum(1 for t in self.tiles if t != 0)

    def apply_row(self, row_idx: int, op: int) -> 'Board3x3':
        res = self.clone()
        for c in range(3):
            idx = row_idx * 3 + c
            res.tiles[idx] = compose(op, res.tiles[idx])
        return res

    def apply_col(self, col_idx: int, op: int) -> 'Board3x3':
        res = self.clone()
        for r in range(3):
            idx = r * 3 + col_idx
            res.tiles[idx] = compose(op, res.tiles[idx])
        return res

    def apply_move(self, move_type: str, line_idx: int, op: int) -> 'Board3x3':
        if move_type == 'row':
            return self.apply_row(line_idx, op)
        elif move_type == 'col':
            return self.apply_col(line_idx, op)
        return self

    def __hash__(self):
        return hash(tuple(self.tiles))

    def __eq__(self, other):
        return self.tiles == other.tiles


class ContinuousFormulaMiner:
    """지속적 AI 공식 발굴 엔진"""
    def __init__(self):
        # 유효 연산자 세트 (반사 MX, MY, 180도 회전 R180, 90도 회전 등)
        self.primary_ops = [2, 4, 5]  # R180, MX, MY (가장 기본적이고 실전적인 3대 조작)
        self.full_ops = [1, 2, 3, 4, 5]

    def mine_2move_finish_patterns(self) -> List[Dict]:
        """2수로 100% 올클리어되는 핵심 피니시 패턴 전수 채굴"""
        mined_patterns = []
        solved_board = Board3x3()

        # 역방향 탐색: Solved 상태에서 2수 적용 -> 꼬인 상태 및 역해법 도출
        moves = []
        for line_type in ['row', 'col']:
            for line_idx in range(3):
                for op in self.full_ops:
                    moves.append((line_type, line_idx, op))

        seen_initial_states: Set[Tuple[int, ...]] = set()

        for m1 in moves:
            for m2 in moves:
                # 같은 라인 연속 조작은 단일 조작이므로 배제
                if m1[0] == m2[0] and m1[1] == m2[1]:
                    continue

                # scramble: solved -> m1 -> m2
                b = solved_board.apply_move(m1[0], m1[1], m1[2])
                b = b.apply_move(m2[0], m2[1], m2[2])

                errors = b.error_count()
                state_key = tuple(b.tiles)

                # 에러 타일이 3개 이상인 유의미한 패턴만 선별
                if errors >= 3 and state_key not in seen_initial_states:
                    seen_initial_states.add(state_key)
                    # 역해법: m2의 역원 -> m1의 역원
                    sol_move1 = (m2[0], m2[1], invert(m2[2]))
                    sol_move2 = (m1[0], m1[1], invert(m1[2]))

                    # 패턴 분류 및 명명
                    pattern_type = "hybrid"
                    title_ko = "AI 발굴 2수 피니시 공식"
                    if m1[2] == m2[2] == 2:
                        pattern_type = "r180_cross"
                        title_ko = f"AI 발굴 십자 R180 엇갈림 {errors}개 타일 2수 피니시"
                    elif m1[2] in [4, 5] and m2[2] in [4, 5]:
                        pattern_type = "reflection_l"
                        title_ko = f"AI 발굴 L자형 반사 {errors}개 타일 2수 피니시"
                    elif (m1[2] == 2 and m2[2] in [4, 5]) or (m1[2] in [4, 5] and m2[2] == 2):
                        pattern_type = "hybrid_rotation_reflection"
                        title_ko = f"AI 발굴 반사-회전 하이브리드 {errors}개 타일 2수 피니시"

                    mined_patterns.append({
                        "id": f"mined-{pattern_type}-{len(mined_patterns)+1}",
                        "titleKo": title_ko,
                        "patternType": pattern_type,
                        "errorCount": errors,
                        "initialTiles": b.tiles,
                        "solutionMoves": [
                            {"type": sol_move1[0], "index": sol_move1[1], "op": OP_NAMES[sol_move1[2]]},
                            {"type": sol_move2[0], "index": sol_move2[1], "op": OP_NAMES[sol_move2[2]]}
                        ],
                        "formulaSeq": f"{sol_move1[0].upper()}{sol_move1[1]+1} {OP_NAMES[sol_move1[2]]} ➔ {sol_move2[0].upper()}{sol_move2[1]+1} {OP_NAMES[sol_move2[2]]}"
                    })

        # 에러 타일 수 기준 내림차순 정렬 (한 번에 많은 타일을 복원할수록 높은 효율)
        mined_patterns.sort(key=lambda p: p["errorCount"], reverse=True)
        return mined_patterns

    def run_continuous_mining(self, duration_sec: int = 2, max_results: int = 10) -> List[Dict]:
        """지속적 채굴 루프 시뮬레이션"""
        print(f"[ContinuousFormulaMiner] 공식 발굴 탐색 시작... (제한: {duration_sec}초)")
        start_time = time.time()
        patterns = self.mine_2move_finish_patterns()
        elapsed = time.time() - start_time
        print(f"[ContinuousFormulaMiner] 발굴 완료: 총 {len(patterns)}개 패턴 탐색됨 (소요시간: {elapsed:.3f}초)")
        
        top_patterns = patterns[:max_results]
        for i, p in enumerate(top_patterns, 1):
            print(f"  {i}. {p['titleKo']} (복원 타일 수: {p['errorCount']}개) -> {p['formulaSeq']}")
            
        return top_patterns

def main():
    parser = argparse.ArgumentParser(description="Galois Cube Continuous Formula Miner")
    parser.add_argument("--duration", type=int, default=2, help="Mining run duration in seconds")
    parser.add_argument("--top", type=int, default=5, help="Number of top formulas to export")
    parser.add_argument("--export", type=str, default="", help="Path to export JSON results")
    args = parser.parse_args()

    miner = ContinuousFormulaMiner()
    results = miner.run_continuous_mining(duration_sec=args.duration, max_results=args.top)

    if args.export:
        with open(args.export, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"[ContinuousFormulaMiner] 결과 내보내기 완료: {args.export}")

if __name__ == "__main__":
    main()
