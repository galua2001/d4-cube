# -*- coding: utf-8 -*-
import sys

filepath = 'C:/Users/user/matrix-cube/src/i18n/translations.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. English tab favorites
en_tabs_target = "    'formula.tabAiMined': 'AI Mined',"
en_tabs_replacement = """    'formula.tabAiMined': 'AI Mined',
    'formula.tabFavorites': 'Favorites',
    'formula.favoriteEmptyMsg': 'No favorite formulas saved yet. Tap the star icon (☆) on any formula to bookmark it here!',
    'formula.btnAddToFavorites': 'Add to Favorites',
    'formula.btnRemoveFromFavorites': 'Remove from Favorites',"""

if en_tabs_target in content:
    content = content.replace(en_tabs_target, en_tabs_replacement, 1)

# 2. Korean tab favorites
ko_tabs_target = "    'formula.tabAiMined': 'AI 발굴 공식',"
ko_tabs_replacement = """    'formula.tabAiMined': 'AI 발굴 공식',
    'formula.tabFavorites': '⭐ 즐겨찾기',
    'formula.favoriteEmptyMsg': '즐겨찾기한 공식이 없습니다. 공식 목록이나 상세 화면에서 별표(☆)를 눌러 보관해 보세요!',
    'formula.btnAddToFavorites': '즐겨찾기에 추가',
    'formula.btnRemoveFromFavorites': '즐겨찾기에서 제거',"""

assert ko_tabs_target in content, 'ko_tabs_target not found'
content = content.replace(ko_tabs_target, ko_tabs_replacement, 1)

# 3. English formula item translations
en_items_target = "    'formula.item.d4StarBurstVortex4.step4': 'Move 4: Col 2 R270 ➔ Col 2 tiles (1, 4, 7) wiped simultaneously (Triple-Kill Finish), 100% All Clear!',"
en_items_replacement = """    'formula.item.d4StarBurstVortex4.step4': 'Move 4: Col 2 R270 ➔ Col 2 tiles (1, 4, 7) wiped simultaneously (Triple-Kill Finish), 100% All Clear!',

    // Round 7 D4 Master Formulas 3-Pack (EN)
    'formula.item.d4CornerKiteFlux4.title': 'Corner Kite Flux 4-Move Super Cancellation',
    'formula.item.d4CornerKiteFlux4.subtitle': 'Eliminates a 4-tile diagonal kite pattern along the main diagonal via dual diagonal cross-reflections',
    'formula.item.d4CornerKiteFlux4.desc': 'Clears a 4-tile kite configuration carrying MX phase along the main diagonal using dual diagonal cross-reflections and orthogonal sweeps.',
    'formula.item.d4CornerKiteFlux4.tip': 'Mathematically proven minimal 4-move sequence (Zero-Shortcut). Clear corners with main diagonal, align center via anti-diagonal, then sweep Col 3 and Row 3.',
    'formula.item.d4CornerKiteFlux4.step0': 'Initial State: 4-tile kite pattern (cells 0, 5, 7, 8) entangled in MX phase along main diagonal',
    'formula.item.d4CornerKiteFlux4.step1': 'Move 1: Main Diag (↖) MX ➔ Double-cancels corners 0 and 8',
    'formula.item.d4CornerKiteFlux4.step2': 'Move 2: Anti Diag (↗) MX ➔ Clears center tile 4 and aligns Col 3 & Row 3',
    'formula.item.d4CornerKiteFlux4.step3': 'Move 3: Col 3 MX ➔ Clears tiles 2 and 5, aligning Row 3 to pure MX',
    'formula.item.d4CornerKiteFlux4.step4': 'Move 4: Row 3 MX ➔ Triple-cancels Row 3 tiles (6, 7, 8) for 100% All Clear',

    'formula.item.d4PlusOmegaCross3.title': 'Plus-Omega Cross 3-Move Compound Kill',
    'formula.item.d4PlusOmegaCross3.subtitle': 'A lethal 3-move killer eradicating 4 cross edges (MAD) and main diagonal (MD) via orthogonal anti-reflections and diagonal stroke',
    'formula.item.d4PlusOmegaCross3.desc': 'Combines cross edge anti-diagonal reflections (MAD) with main diagonal reflections (MD), neutralized in exactly 3 moves.',
    'formula.item.d4PlusOmegaCross3.tip': 'Proven minimal 3-move sequence (Zero-Shortcut). Middle axis MAD operations purge edges and synchronize center to MD for a final diagonal strike.',
    'formula.item.d4PlusOmegaCross3.step0': 'Initial State: 4 cross edges in MAD phase, main diagonal in MD phase',
    'formula.item.d4PlusOmegaCross3.step1': 'Move 1: Row 2 MAD ➔ Double-cancels horizontal cross edges 3 and 5',
    'formula.item.d4PlusOmegaCross3.step2': 'Move 2: Col 2 MAD ➔ Clears vertical edges 1 and 7, synchronizing main diagonal to MD',
    'formula.item.d4PlusOmegaCross3.step3': 'Move 3: Main Diag (↖) MD ➔ Triple-cancels main diagonal tiles 0, 4, 8 for 100% All Clear',

    'formula.item.d4HyperCubeFrame4.title': 'Hyper-Cube Frame 4-Move Finale',
    'formula.item.d4HyperCubeFrame4.subtitle': 'Terminates full 8-tile outer frame rotational symmetry in exactly 4 moves via outer perimeter R90 sweeps',
    'formula.item.d4HyperCubeFrame4.desc': 'A pure outer frame challenge with center ID, 4 corners R180, and 4 edges R270 solved in 4 perimeter R90 moves.',
    'formula.item.d4HyperCubeFrame4.tip': 'Proven minimal 4-move sequence (Zero-Shortcut). Row sweeps clear edges and synchronize corners to R270, then column sweeps execute double triple-kills.',
    'formula.item.d4HyperCubeFrame4.step0': 'Initial State: Center tile pure ID, 4 corners in R180, 4 edges in R270',
    'formula.item.d4HyperCubeFrame4.step1': 'Move 1: Row 1 R90 ➔ Clears top edge 1 and aligns corners 0 and 2 to R270',
    'formula.item.d4HyperCubeFrame4.step2': 'Move 2: Row 3 R90 ➔ Clears bottom edge 7 and synchronizes Col 1 & Col 3 to R270',
    'formula.item.d4HyperCubeFrame4.step3': 'Move 3: Col 1 R90 ➔ Triple-cancels Col 1 tiles 0, 3, 6 simultaneously',
    'formula.item.d4HyperCubeFrame4.step4': 'Move 4: Col 3 R90 ➔ Triple-cancels Col 3 tiles 2, 5, 8 for 100% All Clear',"""

if en_items_target in content:
    content = content.replace(en_items_target, en_items_replacement, 1)

# 4. Korean formula item translations
ko_items_target = "    'formula.item.d4StarBurstVortex4.step4': '4수: 2열 R270 ➔ 2열 3개 타일(1, 4, 7) 일제 소거 (트리플 킬 피니시), 100% 올클리어!',"
ko_items_replacement = """    'formula.item.d4StarBurstVortex4.step4': '4수: 2열 R270 ➔ 2열 3개 타일(1, 4, 7) 일제 소거 (트리플 킬 피니시), 100% 올클리어!',

    // Round 7 D4 신규 마스터 공식 3선 (KO)
    'formula.item.d4CornerKiteFlux4.title': '코너 카이트 플럭스 4수 슈퍼 소거',
    'formula.item.d4CornerKiteFlux4.subtitle': '주대각선 축 연(Kite) 형태 4타일 에러를 양대각선 교차 반사와 외곽 스위프로 소거하는 4수 공식',
    'formula.item.d4CornerKiteFlux4.desc': '주대각선 축을 따라 0번 꼭짓점, 5번·7번 날개, 8번 꼬리로 구성된 연(Kite) 형태 4개 타일의 MX 위상을 주대각선·부대각선 교차 반사와 3열, 3행 스위프로 단 4수만에 완전 소거합니다.',
    'formula.item.d4CornerKiteFlux4.tip': 'BFS 전수 탐색(754,922개 상태)으로 증명된 지름길 없는 4수 마스터 공식입니다. 1수 주대각선으로 0, 8번 코너를 동시 소거하고 2수 부대각선으로 중심을 정리한 뒤 3열과 3행으로 종결합니다.',
    'formula.item.d4CornerKiteFlux4.step0': '초기 상태: 주대각선 축 연(Kite) 형태 4개 타일(0, 5, 7, 8번)이 MX 위상으로 얽힌 배치',
    'formula.item.d4CornerKiteFlux4.step1': '1수: 주대각선(↖) MX ➔ 0번과 8번 코너 타일 동시 소거 (더블 킬)',
    'formula.item.d4CornerKiteFlux4.step2': '2수: 부대각선(↗) MX ➔ 중심 4번 타일 소거 및 3열·3행 동기화',
    'formula.item.d4CornerKiteFlux4.step3': '3수: 3열 MX ➔ 2번과 5번 타일 소거 및 3행 단일 위상 정렬',
    'formula.item.d4CornerKiteFlux4.step4': '4수: 3행 MX ➔ 3행 6, 7, 8번 타일 일제 소거 (트리플 킬 피니시), 100% 올클리어',

    'formula.item.d4PlusOmegaCross3.title': '오메가 십자 대각 복합 3수 킬',
    'formula.item.d4PlusOmegaCross3.subtitle': '십자 변 4개의 부대각 반사(MAD)와 주대각선 3개의 주대각 반사(MD)를 직교·대각 결합 3수로 일격 킬',
    'formula.item.d4PlusOmegaCross3.desc': '십자 변 4개(1, 3, 5, 7번)의 MAD 위상과 주대각선(0, 4, 8번)의 MD 위상이 상호 직교 결합된 최고난도 패턴을 2행 MAD, 2열 MAD, 주대각선 MD로 3수만에 종결합니다.',
    'formula.item.d4PlusOmegaCross3.tip': 'BFS 48,743개 상태 전수 탐색으로 증명된 지름길 없는 3수 공식입니다. 중심 십자축에 MAD를 연속 적용하여 엣지를 소거하고 중심을 MD로 동기화한 뒤 주대각선 MD로 올클리어합니다.',
    'formula.item.d4PlusOmegaCross3.step0': '초기 상태: 십자 변 4개는 MAD, 주대각선 3개는 MD 위상을 보유한 복합 대칭 배치',
    'formula.item.d4PlusOmegaCross3.step1': '1수: 2행 MAD ➔ 3번과 5번 좌우 십자 변 즉시 동시 소거 (더블 킬)',
    'formula.item.d4PlusOmegaCross3.step2': '2수: 2열 MAD ➔ 1번과 7번 상하 십자 변 소거 및 주대각선 전체 MD 동기화',
    'formula.item.d4PlusOmegaCross3.step3': '3수: 주대각선(↖) MD ➔ 주대각선 0, 4, 8번 타일 일제 소거 (트리플 킬 피니시), 100% 올클리어',

    'formula.item.d4HyperCubeFrame4.title': '하이퍼 프레임 4수 피니시',
    'formula.item.d4HyperCubeFrame4.subtitle': '외곽 프레임 전체 8개 타일의 회전 대칭을 외곽 4개 행·열의 90° 스위프로 단 4수만에 종결',
    'formula.item.d4HyperCubeFrame4.desc': '중심(4번)은 완전한 ID이고 외곽 4개 코너는 R180, 4개 변은 R270으로 정렬된 완전 프레임 대칭을 외곽 4개 행/열에 R90을 연속 가하여 4수만에 완벽 클리어합니다.',
    'formula.item.d4HyperCubeFrame4.tip': 'BFS 754,922개 상태 전수 탐색으로 증명된 지름길 없는 4수 마스터 공식입니다. 상하행 R90으로 엣지를 소거하고 코너를 R270으로 동기화한 뒤 좌우열 R90으로 트리플 킬 피니시합니다.',
    'formula.item.d4HyperCubeFrame4.step0': '초기 상태: 중심 4번은 ID, 외곽 코너 4개 R180, 외곽 변 4개 R270인 프레임 대칭 배치',
    'formula.item.d4HyperCubeFrame4.step1': '1수: 1행 R90 ➔ 1번 상단 엣지 소거 및 0, 2번 코너 R270 정렬',
    'formula.item.d4HyperCubeFrame4.step2': '2수: 3행 R90 ➔ 7번 하단 엣지 소거 및 1열·3열 전체 R270 완벽 동기화',
    'formula.item.d4HyperCubeFrame4.step3': '3수: 1열 R90 ➔ 1열 0, 3, 6번 타일 일제 소거 (트리플 킬)',
    'formula.item.d4HyperCubeFrame4.step4': '4수: 3열 R90 ➔ 3열 2, 5, 8번 타일 일제 소거 (트리플 킬 피니시), 100% 올클리어',"""

assert ko_items_target in content, 'ko_items_target not found'
content = content.replace(ko_items_target, ko_items_replacement, 1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print('translations.ts successfully updated!')
