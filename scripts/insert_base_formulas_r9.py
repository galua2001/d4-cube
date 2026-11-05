with open('src/data/formulas.ts', 'r', encoding='utf-8') as f:
    text = f.read()

target = "id: 'd4-checker-superposition-4'"
idx = text.find(target)
if idx == -1:
    raise RuntimeError('d4-checker-superposition-4 not found')

idx_close = text.find('  },', idx)
if idx_close == -1:
    raise RuntimeError('closing   }, not found')

insert_pos = idx_close + len('  },')

item_code = """
  {
    id: 'd4-spiral-core-vortex-4',
    titleKo: '나선형 코어 볼텍스 4수 소거 공식',
    titleEn: 'Spiral Core Vortex 4-Move Purge Formula',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 4수',
    badgeEn: '🏁 D4 Master 4M',
    difficulty: 4,
    formulaSeq: 'Row 1 R90 ➔ Col 3 R90 ➔ Row 3 R90 ➔ Col 1 R90 = 전 타일 올클리어',
    summaryKo: '외곽 8개 타일이 중심을 축으로 회전하는 나선형 와류(Vortex) 배치를 1행·3열·3행·1열의 시계방향 나선 4단 90° 회전으로 완벽 소거합니다.',
    summaryEn: 'Eliminates a perimeter spiral vortex pattern (8 outer tiles rotating around the core) via a 4-move clockwise perimeter sweep (Row 1 ➔ Col 3 ➔ Row 3 ➔ Col 1) using 90° rotations.',
    diagramType: 'interactive',
    steps: d4SpiralCoreVortexSteps,
    latexFormula: '\\\\mathcal{F}_{\\\\text{vortex}} = \\\\text{Col}_1(R_{90}) \\\\circ \\\\text{Row}_3(R_{90}) \\\\circ \\\\text{Col}_3(R_{90}) \\\\circ \\\\text{Row}_1(R_{90})',
    notesKo: [
      'BFS 전수 탐색(754,922개 상태)으로 증명된 지름길 없는(Zero-Shortcut) 엄격한 4수 마스터 공식입니다.',
      '중심(4번)은 항등원(ID)인 태풍의 눈 상태를 유지하며, 외곽 둘레를 1행(Row 1) ➔ 3열(Col 3) ➔ 3행(Row 3) ➔ 1열(Col 1) 순으로 감아 돌며 위상을 차례로 중화합니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 4-move sequence (Zero-Shortcut) verified across 754,922 states.',
      'The center core (cell 4) stays in ID as the calm eye of the hurricane, while the outer ring is sequentially neutralized via a clockwise perimeter cascade.'
    ],
    tags: ['4수', '나선형', '회오리', 'Vortex', 'D4 마스터', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-diamond-core-smash-3',
    titleKo: '마름모꼴 다이아몬드 코어 3수 스매시 공식',
    titleEn: 'Diamond Core Smash 3-Move Finish Formula',
    category: 'god-number',
    badgeKo: '⚡ D4 스피드 3수',
    badgeEn: '⚡ D4 Speed 3M',
    difficulty: 3,
    formulaSeq: 'Row 2 R90 ➔ Col 2 MX ➔ Row 2 MD = 전 타일 올클리어',
    summaryKo: '중심 코어(4번)와 십자 변(1, 3, 5, 7번)으로 이루어진 순수 마름모꼴 위상을 Row 2와 Col 2의 십자 교차 스트라이크로 단 3수만에 격파합니다.',
    summaryEn: 'Crushes a pure diamond cross phase (center 4 + cross edges 1, 3, 5, 7) in exactly 3 moves via orthogonal Row 2 and Col 2 cross-strikes.',
    diagramType: 'interactive',
    steps: d4DiamondCoreSmashSteps,
    latexFormula: '\\\\mathcal{F}_{\\\\text{diamond}} = \\\\text{Row}_2(M_D) \\\\circ \\\\text{Col}_2(M_x) \\\\circ \\\\text{Row}_2(R_{90})',
    notesKo: [
      'BFS 전수 탐색으로 입증된 3수 극단 최단 거리(Zero-Shortcut k=3) 공식입니다.',
      '외곽 4개 코너(0, 2, 6, 8)가 완전히 깨끗한 ID 상태를 유지하며 오직 다이아몬드 코어 5개 타일만 선별 타격합니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 3-move sequence (Zero-Shortcut) with no 1- or 2-move shortcuts.',
      'All 4 corners (0, 2, 6, 8) remain pristine ID, surgically smashing only the 5 diamond core tiles.'
    ],
    tags: ['3수', '다이아몬드', '마름모꼴', 'Diamond Core', 'D4 마스터', '신의 수 테크닉'],
    isInteractive: true
  },
  {
    id: 'd4-anti-checker-parity-4',
    titleKo: '안티 체커 패리티 & 대각 반사 4수 올킬 공식',
    titleEn: 'Anti-Checker Parity & Diagonal 4-Move All-Kill Formula',
    category: 'god-number',
    badgeKo: '🏁 D4 마스터 4수',
    badgeEn: '🏁 D4 Master 4M',
    difficulty: 4,
    formulaSeq: 'Main Diag (↖) MD ➔ Row 2 R180 ➔ Anti Diag (↗) MD ➔ Col 2 R180 = 전 타일 올클리어',
    summaryKo: '체커보드 흑/백 타일이 대각 반사(MD)와 점대칭(R180)으로 엇갈린 안티 패리티 위상을 양대각선과 십자축의 교차 핑퐁 연산으로 4수만에 완전 소거합니다.',
    summaryEn: 'Eliminates an anti-checker parity state (corners carrying MD diagonal reflection vs edges carrying R180 point reflection) via alternating diagonal and orthogonal cross-sweeps.',
    diagramType: 'interactive',
    steps: d4AntiCheckerParitySteps,
    latexFormula: '\\\\mathcal{F}_{\\\\text{checker}} = \\\\text{Col}_2(R_{180}) \\\\circ \\\\Delta_2(M_D) \\\\circ \\\\text{Row}_2(R_{180}) \\\\circ \\\\Delta_1(M_D)',
    notesKo: [
      'BFS 전수 탐색(754,922개 상태)으로 증명된 지름길 없는(Zero-Shortcut) 엄격한 4수 마스터 공식입니다.',
      '주대각선(↖)과 부대각선(↗)의 대각 반사(MD) 연산과 중앙 Row 2, Col 2의 점대칭(R180) 회전이 완벽한 지그재그 쌍대성을 이룹니다.'
    ],
    notesEn: [
      'Mathematically proven minimal 4-move sequence (Zero-Shortcut) verified across 754,922 states.',
      'Main/Anti diagonals (MD) and orthogonal Row 2/Col 2 (R180) form an alternating zigzag duality.'
    ],
    tags: ['4수', '체커보드', '대각 반사', 'Anti-Checker', 'D4 마스터', '신의 수 테크닉'],
    isInteractive: true
  },"""

text = text[:insert_pos] + item_code + text[insert_pos:]

with open('src/data/formulas.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Inserted 3 formulas into BASE_FORMULAS successfully!')
