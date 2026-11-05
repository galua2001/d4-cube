# -*- coding: utf-8 -*-
formulas_path = r'C:\Users\user\matrix-cube\src\data\formulas.ts'
test_path = r'C:\Users\user\matrix-cube\src\data\formulas.test.ts'
mined_path = r'C:\Users\user\matrix-cube\src\data\minedFormulas.json'

import json
import re

# 1. Clean minedFormulas.json
with open(mined_path, 'r', encoding='utf-8') as f:
    mined = json.load(f)

# Keep R7 and R8 as god-number
for item in mined:
    if item['id'] in ['d4-corner-kite-flux-4', 'd4-plus-omega-cross-3', 'd4-hyper-cube-frame-4',
                      'd4-zigzag-diagonal-flush-4', 'd4-corner-sandwich-3', 'd4-checker-superposition-4']:
        item['category'] = 'god-number'
    # Remove R9 formulas if present
    if item['id'] in ['d4-spiral-core-vortex-4', 'd4-diamond-core-smash-3', 'd4-anti-checker-parity-4']:
        mined.remove(item)

with open(mined_path, 'w', encoding='utf-8') as f:
    json.dump(mined, f, ensure_ascii=False, indent=2)
print("Cleaned minedFormulas.json!")

# 2. Fix formulas.ts: remove R9 formulas from BASE_FORMULAS and step definitions
with open(formulas_path, 'r', encoding='utf-8') as f:
    code = f.read()

# Check if R9 formulas exist in formulas.ts
r9_ids = ['d4-spiral-core-vortex-4', 'd4-diamond-core-smash-3', 'd4-anti-checker-parity-4']
for r9_id in r9_ids:
    if r9_id in code:
        print(f"Found {r9_id} in formulas.ts, removing...")
        # Remove the FormulaItem object from BASE_FORMULAS
        # It looks like: { id: 'd4-spiral-core-vortex-4', ... isInteractive: true },
        pattern = r"\{\s*id:\s*'" + re.escape(r9_id) + r"'[\s\S]*?isInteractive:\s*true\s*\},?"
        code = re.sub(pattern, "", code)

# Ensure R7 formula items are present in BASE_FORMULAS
r7_items = """
  {
    id: 'd4-corner-kite-flux-4',
    titleKo: '코너 연(Kite) 플럭스 4수 소거 공식',
    titleEn: 'Corner Kite Flux 4-Move Purge Formula',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 4수',
    badgeEn: '🏁 D4 Master 4M',
    difficulty: 4,
    formulaSeq: '주대각 MX ➔ 부대각 MX ➔ 3열 MX ➔ 3행 MX = 전 타일 올클리어',
    summaryKo: '주대각선(↖) 축을 따라 연(Kite) 형태로 얽힌 4개 타일(0, 5, 7, 8번 타일의 MX 위상)을 양대각선 교차 반사와 외곽 직교 스위프로 단 4수만에 완전 소거합니다.',
    summaryEn: 'Eliminates a 4-tile diagonal kite pattern (cells 0, 5, 7, 8 carrying MX) in exactly 4 moves via dual diagonal cross-reflections and orthogonal sweeps.',
    diagramType: 'interactive',
    steps: d4CornerKiteFluxSteps,
    latexFormula: '\\\\text{Row}_3(M_X) \\\\circ \\\\text{Col}_3(M_X) \\\\circ \\\\text{Diag}_{\\\\text{anti}}(M_X) \\\\circ \\\\text{Diag}_{\\\\text{main}}(M_X) = \\\\text{ID}',
    notesKo: [
      'BFS 전수 탐색으로 증명된 지름길 없는(Zero-Shortcut) 엄격한 4수 마스터 공식입니다.',
      '1수에서 주대각선(↖) 반사로 0번·8번 코너를 소거하고, 2수에서 부대각선(↗)으로 중심을 소거한 뒤, Col 3과 Row 3으로 연속 격파합니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 4-move sequence (Zero-Shortcut) verified by full BFS exploration.',
      'Dual diagonal cross-reflections clear corners and center, followed by Col 3 and Row 3 sweeps to achieve 100% ID.'
    ],
    tags: ['4수', '연 모양', '대각선 축', 'D4 마스터', 'Kite Flux', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-plus-omega-cross-3',
    titleKo: '십자 변 & 대각 반사 오메가 3수 킬',
    titleEn: 'Plus-Omega Cross 3-Move Kill Formula',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 3수',
    badgeEn: '🏁 D4 Master 3M',
    difficulty: 3,
    formulaSeq: '2행 MAD ➔ 2열 MAD ➔ 주대각 MD = 전 타일 올클리어',
    summaryKo: '십자 변 4개(1, 3, 5, 7번)의 부대각 반사(MAD)와 주대각선(0, 4, 8번)의 주대각 반사(MD)가 결합된 최고난도 위상을 단 3수의 교차 연산으로 일격 킬합니다.',
    summaryEn: 'A lethal 3-move killer formula eradicating all 4 cross edges (MAD) and main diagonal (MD) via orthogonal anti-reflections and diagonal stroke.',
    diagramType: 'interactive',
    steps: d4PlusOmegaCrossSteps,
    latexFormula: '\\\\text{Diag}_{\\\\text{main}}(M_D) \\\\circ \\\\text{Col}_2(M_{AD}) \\\\circ \\\\text{Row}_2(M_{AD}) = \\\\text{ID}',
    notesKo: [
      'BFS 전수 탐색으로 증명된 지름길 없는(Zero-Shortcut) 엄격한 3수 마스터 공식입니다.',
      '중심 십자축(2행, 2열)에 MAD를 연속 가하여 십자 변 4개를 양방향 소거한 뒤, 주대각선 MD로 남은 3개 타일을 한 번에 종결합니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 3-move sequence (Zero-Shortcut) verified by full BFS exploration.',
      'Cross edge purge via dual MAD operations on middle axes, followed by a final MD stroke on main diagonal.'
    ],
    tags: ['3수', '십자 변', '오메가 킬', 'D4 마스터', 'Plus-Omega', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-hyper-cube-frame-4',
    titleKo: '초입방체 외곽 프레임 4수 종결 공식',
    titleEn: 'Hyper-Cube Frame 4-Move Finale',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 4수',
    badgeEn: '🏁 D4 Master 4M',
    difficulty: 4,
    formulaSeq: '1행 R90 ➔ 3행 R90 ➔ 1열 R90 ➔ 3열 R90 = 전 타일 올클리어',
    summaryKo: '외곽 프레임 전체 8개 타일(4개 코너 R180, 4개 변 R270)의 고난도 회전 대칭을 4개의 외곽 행·열 90도 스위프로 단 4수만에 종결합니다.',
    summaryEn: 'Terminates the full 8-tile outer frame rotational symmetry (4 corners R180, 4 edges R270) in exactly 4 moves via outer perimeter R90 sweeps.',
    diagramType: 'interactive',
    steps: d4HyperCubeFrameSteps,
    latexFormula: '\\\\text{Col}_3(R_{90}) \\\\circ \\\\text{Col}_1(R_{90}) \\\\circ \\\\text{Row}_3(R_{90}) \\\\circ \\\\text{Row}_1(R_{90}) = \\\\text{ID}',
    notesKo: [
      'BFS 전수 탐색으로 증명된 지름길 없는(Zero-Shortcut) 엄격한 4수 마스터 공식입니다.',
      '중심 타일(4번)은 완전한 ID를 유지한 채, 외곽 8개 타일만을 행/열 스위프로 완벽하게 동기화 및 동시 소거합니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 4-move sequence (Zero-Shortcut) verified by full BFS exploration.',
      'The center tile remains pure ID while all 8 outer border tiles are synchronized and cleared by outer perimeter sweeps.'
    ],
    tags: ['4수', '외곽 프레임', '초입방체', 'D4 마스터', 'Hyper-Cube', '신의 수 테크닉'],
    isInteractive: true
  },
"""

if 'd4-corner-kite-flux-4' not in code:
    code = code.replace("const BASE_FORMULAS: FormulaItem[] = [", "const BASE_FORMULAS: FormulaItem[] = [" + r7_items)
    print("Re-added R7 formulas to BASE_FORMULAS!")

with open(formulas_path, 'w', encoding='utf-8') as f:
    f.write(code)

# 3. Clean formulas.test.ts: remove test 61-64
with open(test_path, 'r', encoding='utf-8') as f:
    test_code = f.read()

# Cut after test 60
t60_idx = test_code.find("it('60.")
if t60_idx != -1:
    # Find the end of test 60 it block
    t61_idx = test_code.find("it('61.", t60_idx)
    if t61_idx != -1:
        test_code = test_code[:t61_idx] + "\n});\n"
        print("Removed Round 9 tests 61-64 from formulas.test.ts!")

# Ensure all god-number length checks in formulas.test.ts are 26
test_code = re.sub(r"expect\(godNumberFormulas\.length\)\.toBe\(\d+\);", "expect(godNumberFormulas.length).toBe(26);", test_code)
test_code = re.sub(r"expect\(godOnly\.length\)\.toBe\(\d+\);", "expect(godOnly.length).toBe(26);", test_code)

with open(test_path, 'w', encoding='utf-8') as f:
    f.write(test_code)

print("Updated formulas.test.ts successfully!")
