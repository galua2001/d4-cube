/**
 * @file translations.ts
 * @description 다국어(i18n) 번역 딕셔너리 및 언어 관리 모듈 (기본 언어: English 'en')
 */

export type Lang = 'en' | 'ko';

export const LANG_STORAGE_KEY = 'matrix_cube_lang';

// 기본 언어는 English ('en')
let currentLang: Lang = 'en';

try {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Lang;
    if (saved === 'en' || saved === 'ko') {
      currentLang = saved;
    }
  }
} catch {
  // localStorage 접근 불가 환경 대비
}

const listeners: Array<(lang: Lang) => void> = [];

export function getCurrentLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang): void {
  if (currentLang !== lang) {
    currentLang = lang;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
      }
    } catch {}
    listeners.forEach((cb) => {
      try {
        cb(lang);
      } catch {}
    });
  }
}

export function onLangChange(cb: (lang: Lang) => void): () => void {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

export const translations: Record<Lang, Record<string, any>> = {
  en: {
    // Header & Navigation
    'title': 'Galois Cube',
    'header.title': 'Galois Cube',
    'header.pwaInstall': '📱 Install App',
    'header.pwaInstallTitle': 'Install as App on Mobile',
    'header.tutorial': '🎓 Tutorial',
    'header.tutorialTitle': '30s Interactive Group Theory Tutorial',
    'header.about': 'ℹ️ About',
    'header.aboutTitle': 'Project Overview & Mathematics',
    'header.guide': '🧭 Guide',
    'header.guideTitle': 'Controller Tile Guide',
    'header.bgm': 'BGM',
    'header.sfx': 'SFX',
    'header.langToggle': '🌐 EN | KO',
    'header.langToggleTitle': 'Switch Language (EN / KO)',
    'header.themeToggleTitle': 'Switch Character Theme (Corgi / Galois)',
    'header.themeDog': 'Corgi',
    'header.themeGalua': 'Galois',
    'header.colorLight': 'Light',
    'header.colorDark': 'Dark',
    'header.colorToggleTitle': 'Toggle Light/Dark Theme',

    // Settings
    'settings.difficulty': '🎯 Difficulty',
    'settings.movesSuffix': 'M',
    'settings.sizeTitle': 'Cycle Board Size (3×3 ➔ 4×4 ➔ 5×5)',
    'settings.diagOn': '⚡ Diag ON',
    'settings.diagOff': '⚡ Diag OFF',
    'settings.diagTitleOn': 'Diagonal Mode ON (Tap to turn OFF)',
    'settings.diagTitleOff': 'Diagonal Mode OFF (Tap to turn ON)',

    // Status bar
    'status.groupD4': 'D₄ (Dihedral)',
    'status.groupV4': 'V₄ (Klein 4)',
    'status.groupC2': 'C₂ (Cyclic)',
    'status.stageInfo': '{size}×{size} (Min {moves} Moves Guaranteed)',
    'status.moves': '{moves} Moves',
    'status.bestRecordEmpty': '🏆 BEST: -',
    'status.bestRecordEmptyTitle': 'No clear records yet',
    'status.bestRecordTitle': 'Best Record: {time} ({moves})',

    // Controller tile labels
    'board.row': 'R{n}',
    'board.col': 'C{n}',
    'board.diagMain': '↖Diag',
    'board.diagAnti': '↗Diag',
    'board.switch11Title': 'Tap to toggle Row 1 / Col 1 mode',
    'board.optRow': 'Row 1',
    'board.optCol': 'Col 1',

    // Bottom controls
    'controls.undo': '↩ Undo',
    'controls.hint': '💡 Hint',
    'controls.solution': '📖 Solution',
    'controls.modeC2': 'C₂ Mode',
    'controls.modeV4': 'V₄ Mode',
    'controls.modeD4': 'D₄ Mode',

    // Tutorial Navigation & Actions
    'tutorial.headerTitle': 'Dihedral Group D₄ Tutorial',
    'tutorial.headerBadge': 'Group Theory Tutorial',
    'tutorial.close': 'Close',
    'tutorial.prev': '◀ Prev',
    'tutorial.next1': 'Next (1/3) ➔',
    'tutorial.next2': 'Next (2/3) ➔',
    'tutorial.startPuzzle': '🎮 Start Puzzle',
    'tutorial.autoplayWatch': '▶ Step by Step',
    'tutorial.autoplayPause': '⏸ Pause',

    // Tutorial Step 1
    'tutorial.step1Name': 'STEP 1. Puzzle Goal & Matrix Transformations',
    'tutorial.step1Main': 'The goal is to restore all scrambled puppies back to the upright origin (0) using only row & column transformations!',
    'tutorial.step1Sub': '① 11 Horizontal Swipe (Row 1 MX) ➔ ② 12 Vertical Swipe (180° R180) ➔ ③ 31 Click 3x (Row 3 R270) ➔ ④ 21 Diagonal Swipe (Row 2 Diag)',
    'tutorial.step1TTS': 'This puzzle restores scattered puppies back to their original faces. Let us watch the demonstration to see how they move!',

    'tutorial.step1Sub0Label': '① 11 Horizontal Swipe',
    'tutorial.step1Sub0Badge': '💡 [11] Row 1 First Element',
    'tutorial.step1Sub0Text': 'Swipe 11 horizontally ➔ Row 1 Horizontal Reflection (MX)',
    'tutorial.step1Sub0Desc': 'Swiping the first element 11 horizontally flips all of Row 1 to the back (X badge)!',
    'tutorial.step1Sub0Bubble': '11 Swipe Horizontally (↔)',

    'tutorial.step1Sub1Label': '② 12 Vertical Swipe',
    'tutorial.step1Sub1Badge': '✨ [12] Col 2 First Element (MX ∘ MY = R180)',
    'tutorial.step1Sub1Text': 'Swipe 12 vertically ➔ 12 tile rotates 180°!',
    'tutorial.step1Sub1Desc': 'When Col 2 is swiped vertically (MY) while Row 1 is reflected (MX), horizontal and vertical compose into 180° rotation (R180)!',
    'tutorial.step1Sub1Bubble': '12 Swipe Vertically (↕)',

    'tutorial.step1Sub2Label': '③ 31 Click 3x (Row 3)',
    'tutorial.step1Sub2Badge': '↻ [31] Row 3 First Element',
    'tutorial.step1Sub2Text': 'Click 31 three times ➔ Row 3 rotates 90° three times!',
    'tutorial.step1Sub2Desc': 'Clicking the first element 31 of Row 3 rotates the whole row sequentially: 90° ➔ 180° ➔ 270°!',
    'tutorial.step1Sub2Bubble': '31 Click 3 times (Row 3)',
    'tutorial.step1Sub2Bubble1': 'Click 1 ➔ Row 3 90° Rotation',
    'tutorial.step1Sub2Bubble2': 'Click 2 ➔ Row 3 180° Inversion',
    'tutorial.step1Sub2Bubble3': 'Click 3 ➔ Row 3 270° Completed!',

    'tutorial.step1Sub3Label': '④ 21 Diagonal Swipe (Row 2)',
    'tutorial.step1Sub3Badge': '⚡ [21] Row 2 Diagonal Transform',
    'tutorial.step1Sub3Text': 'Swipe 21 diagonally ➔ Main Diag (MD) + Anti-Diag (MAD) = 180° (R180)!',
    'tutorial.step1Sub3Desc': 'Swiping ↖➔↘ on 21 applies main diagonal (MD), and ↗➔↙ composes both into 180° rotation (R180)!',
    'tutorial.step1Sub3Bubble': '21 Diagonal Swipe (Row 2)',
    'tutorial.step1Sub3Bubble1': '1) ↖➔↘ Main Diag (Row 2 MD)',
    'tutorial.step1Sub3Bubble2': '2) ↗➔↙ Anti-Diag ➔ 180° Rotation!',

    // Tutorial Step 2
    'tutorial.step2Name': 'STEP 2. [V4 Practice] V4 Klein Four-Group 4-Move Optimal Solution',
    'tutorial.step2Main': 'V4 mode uses only 4 symmetry operations: {0°, 180°, Horizontal (X), Vertical (Y)}!',
    'tutorial.step2Sub': '👆 Press [Move 1], [Move 2]... buttons or [▶ Step by Step] to see the 4-move solution in real time!',
    'tutorial.step2TTS': 'V4 mode uses rotation and horizontal vertical symmetry. Press the buttons to see the solution in just four moves!',

    'tutorial.v4Step0Label': 'Initial',
    'tutorial.v4Step0Badge': '🧩 Intro to V4 Mode',
    'tutorial.v4Step0Text': 'V4 elements: 0°, 180°, Horizontal (X), Vertical (Y)',
    'tutorial.v4Step0Desc': 'No diagonals or 90° rotations in V4 mode. Solve it in 4 moves by cancelling out transformations!',
    'tutorial.v4Step0Bubble': '👆 Click [▶ Step by Step]!',

    'tutorial.v4Step1Label': 'Move 1',
    'tutorial.v4Step1Badge': '⚡ Move 1: Row 3 180° Rotation (R180)',
    'tutorial.v4Step1Text': 'Double-tap Row 3 Col 1 (31) 👆👆 (R180)',
    'tutorial.v4Step1Desc': 'Applying 180° rotation to Row 3 cancels the two R180 tiles back to 0!',
    'tutorial.v4Step1Bubble': '31 Double Click (90°+90°=180°)',

    'tutorial.v4Step2Label': 'Move 2',
    'tutorial.v4Step2Badge': '⚡ Move 2: Col 3 Vertical Reflection (MY)',
    'tutorial.v4Step2Text': 'Swipe down on Row 1 Col 3 (13) ↕ (MY)',
    'tutorial.v4Step2Desc': 'When horizontal reflection (MX) meets vertical reflection (MY), they compose into 180° (MX ∘ MY = R180)!',
    'tutorial.v4Step2Bubble': '13 Swipe Vertically for Col 3 (↕)',

    'tutorial.v4Step3Label': 'Move 3',
    'tutorial.v4Step3Badge': '⚡ Move 3: Row 2 Vertical Reflection (MY)',
    'tutorial.v4Step3Text': 'Swipe down on Row 2 Col 1 (21) ↕ (MY)',
    'tutorial.v4Step3Desc': 'Applying vertical reflection to Row 2 self-cancels the MY tiles (MY² = 0) back to 0!',
    'tutorial.v4Step3Bubble': '21 Swipe Vertically for Row 2 (↕)',

    'tutorial.v4Step4Label': 'Move 4 (Solved)',
    'tutorial.v4Step4Badge': '🎉 Move 4: Row 1 180° Rotation (R180) - Solved!',
    'tutorial.v4Step4Text': 'Double-tap Row 1 Col 1 (11) 👆👆 (R180)',
    'tutorial.v4Step4Desc': 'Row 1 R180 tiles self-cancel (180² = 0), completing all puppies back to 0!',
    'tutorial.v4Step4Bubble': '11 Double Click (90°+90°=180°)',

    // Tutorial Step 3
    'tutorial.step3Name': 'STEP 3. [D4 Practice] Dihedral Group D4 5-Move Master Solution',
    'tutorial.step3Main': 'D4 mode uses 8 transformations: 4 rotations (0°, 90°, 180°, 270°) and 4 reflections (Horizontal, Vertical, Main Diag, Anti-Diag)!',
    'tutorial.step3Sub': '👆 Press [Move 1] ~ [Move 5] buttons or [▶ Step by Step] to see the 5-move brilliant solution in real time!',
    'tutorial.step3TTS': 'D4 mode uses rotations and diagonal symmetries. Enjoy this fascinating five-move solution!',

    'tutorial.d4Step0Label': 'Initial',
    'tutorial.d4Step0Badge': '🧩 D4 Master Puzzle',
    'tutorial.d4Step0Text': 'D4 Complex Scramble (Initial)',
    'tutorial.d4Step0Desc': '5-move optimal solution using rotations and diagonal symmetries!',
    'tutorial.d4Step0Bubble': '👆 Click [▶ Step by Step]!',

    'tutorial.d4Step1Label': 'Move 1',
    'tutorial.d4Step1Badge': '⚡ Move 1: Row 1 90° Rotation',
    'tutorial.d4Step1Text': 'Tap Row 1 Col 1 (11) once 👆 (R90)',
    'tutorial.d4Step1Desc': 'Row 1 rotates 90° clockwise, solving the first tile to 0!',
    'tutorial.d4Step1Bubble': '11 Tap Once (Row 1 90° Rotation)',

    'tutorial.d4Step2Label': 'Move 2',
    'tutorial.d4Step2Badge': '⚡ Move 2: Row 3 180° Rotation',
    'tutorial.d4Step2Text': 'Double-tap Row 3 Col 1 (31) 👆👆 (R180)',
    'tutorial.d4Step2Desc': 'Applying 180° to Row 3 cancels the first tile of Row 3 back to 0!',
    'tutorial.d4Step2Bubble': '31 Double Click (Row 3 180° Rotation)',

    'tutorial.d4Step3Label': 'Move 3',
    'tutorial.d4Step3Badge': '⚡ Move 3: Col 3 Vertical Reflection',
    'tutorial.d4Step3Text': 'Swipe down on Row 1 Col 3 (13) ↕ (MY)',
    'tutorial.d4Step3Desc': 'Vertical reflection on Col 3 solves both end tiles (Row 1 & 3) to 0!',
    'tutorial.d4Step3Bubble': '13 Swipe Vertically (Col 3 Reflection ↕)',

    'tutorial.d4Step4Label': 'Move 4',
    'tutorial.d4Step4Badge': '⚡ Move 4: Row 2 Main Diag Reflection',
    'tutorial.d4Step4Text': 'Swipe ↖➔↘ on Row 2 Col 1 (21) (MD)',
    'tutorial.d4Step4Desc': 'Swiping diagonally on 21 applies main diagonal reflection (MD) to Row 2, cancelling end tiles to 0!',
    'tutorial.d4Step4Bubble': '21 Swipe Diagonally (Row 2 Main Diag)',

    'tutorial.d4Step5Label': 'Move 5 (Solved)',
    'tutorial.d4Step5Badge': '🎉 Move 5: Col 2 Horizontal Reflection - Solved!',
    'tutorial.d4Step5Text': 'Swipe horizontally on Row 1 Col 2 (12) ↔ (MX)',
    'tutorial.d4Step5Desc': 'Swiping horizontally on 12 cancels all MX tiles in Col 2, completing all tiles to 0 in 5 moves!',
    'tutorial.d4Step5Bubble': '👉 Swipe Horizontally (Col 2 Reflection ↔)',

    // About Modal
    'about.title': '🏆 Project Overview & Mathematics',
    'about.tabIntro': '💡 Concept',
    'about.tabMath': '📐 D₄ Symmetry',
    'about.tabGod8': "⚡ God's Number 8",
    'about.tabEdu': '🎓 Education',
    'about.confirm': 'Start Playing 🎮',
    'about.closeAria': 'Close',

    'about.introCard1Badge': '🧩 Concept Reimagined',
    'about.introCard1Title': '3D Rubiks Cube Reinterpreted into 2D Matrix Symmetry Group',
    'about.introCard1Desc': 'Traditional 3D Rubiks cubes present spatial complexity and awkward touch controls on mobile. Galois Cube innovatively reinterprets rotations as symmetry transformations of an N × N planar matrix, playable via intuitive tap and swipe gestures.',

    'about.introCard2Badge': '🐕 Visual Appeal',
    'about.introCard2Title': 'Intuitive Perception with Cute Corgi Dogs',
    'about.introCard2Desc': 'Instead of dry numbers, adorable dogs with front/back faces and wagging tail animations make tile rotations (0°, 90°, 180°, 270°) and reflections intuitively recognizable at a single glance.',

    'about.introCard3Badge': '📱 Seamless PWA',
    'about.introCard3Title': 'Zero Installation & Flawless Offline Play',
    'about.introCard3Desc': 'Equipped with Progressive Web App (PWA) technology, Galois Cube installs directly to your home screen without app stores and runs completely offline with 100% smooth performance.',

    'about.mathCard1Badge': 'Abstract Algebra (Group Theory)',
    'about.mathCard1Title': 'Dihedral Group D₄ of the Square',
    'about.mathCard1Desc': 'All 8 symmetry transformations of the square are modeled with a rigorous algebraic Cayley table:',
    'about.mathListId': 'Identity (ID, 0): Initial orientation (0° rotation)',
    'about.mathListRot': 'Rotations (R90, R180, R270): Clockwise 90°, 180°, 270° (C₄ cyclic subgroup)',
    'about.mathListRef': 'Axis Reflections (MX, MY): Horizontal X-axis and Vertical Y-axis reflections',
    'about.mathListDiag': 'Diagonal Reflections (MD, MAD): Main (↖-↘) and anti-diagonal (↗-↙) reflections',

    'about.mathCard2Badge': 'Non-commutative Operations',
    'about.mathCard2Title': 'Operation Order Matters: Deep Strategic Complexity',
    'about.mathCard2Desc': 'Dihedral group operations are non-commutative (A ∘ B ≠ B ∘ A). For example, horizontal reflection followed by 90° rotation produces a completely different result than 90° rotation followed by horizontal reflection. This algebraic property creates profound depth in puzzle solving.',

    'about.mathCard3Badge': 'Progressive Subgroups',
    'about.mathCard3Title': 'Adaptive Learning Curve: C₂ ➔ V₄ ➔ D₄',
    'about.mathCard3Desc': '- C₂ Mode: Cyclic group using only 180° rotations (Beginner entry)\n- V₄ Mode: Klein four-group (Horizontal/Vertical reflections & 180° rotation, Abelian)\n- D₄ Mode: Full 8-element dihedral group (Ultimate master challenge)',

    'about.god8Card1Badge': '⚡ Theorem & Mathematical Proof',
    'about.god8Card1Title': "Galois Cube's God's Number is Exactly 8",
    'about.god8Card1Desc': "Just as the 3D Rubik's cube was proven to have God's Number 20, any state in the 3×3 Galois Cube is mathematically guaranteed to be solvable within at most 8 moves. This was comprehensively proven and verified using Bidirectional BFS.",

    'about.god8Card2Badge': 'Ultra-Fast Optimal Solver',
    'about.god8Card2Title': 'Bitmask Bidirectional BFS Engine',
    'about.god8Card2Desc': '- 8 tile states packed into 3 bits each, encoding the entire board in a single 64-bit integer.\n- Simultaneous breadth-first search from initial and goal states slashes search space from O(bᵈ) to O(bᵈᐟ²).\n- Computes the provably shortest solution and real-time hints within 0.05s on mobile browsers.',

    'about.eduCard1Badge': 'STEM & Math Education',
    'about.eduCard1Title': 'College-Level Group Theory Made Playful for All Ages',
    'about.eduCard1Desc': 'Abstract symmetry concepts typically taught in university algebra are internalized effortlessly through tactile touch feedback and visual rotations, helping learners intuitively grasp identity, inverses, and composition.',

    'about.eduCard2Badge': 'Interactive Experience',
    'about.eduCard2Title': 'Ascending Pitch Combo Synthesizer & Haptic Touch',
    'about.eduCard2Desc': 'Continuous manipulations trigger ascending Web Audio synthesizer tones (Do-Re-Mi-Fa-Sol-La-Do), paired with celebratory confetti fireworks and tactile haptics for maximum satisfaction.',

    'about.eduCard3Badge': 'Algorithmic Thinking',
    'about.eduCard3Title': 'Step-by-Step Mathematical Explanation (Why)',
    'about.eduCard3Desc': 'Rather than merely giving answers, each move provides algebraic explanations of which components cancel out toward the identity element, cultivating logical problem-solving skills.'
  },

  ko: {
    // Header & Navigation
    'title': '갈루아 큐브',
    'header.title': '갈루아 큐브',
    'header.pwaInstall': '📱 앱설치',
    'header.pwaInstallTitle': '스마트폰에 앱으로 설치',
    'header.tutorial': '🎓 튜토리얼',
    'header.tutorialTitle': '30초 인터랙티브 D4 연산 튜토리얼',
    'header.about': 'ℹ️ 소개',
    'header.aboutTitle': '작품 소개 및 수학적 배경',
    'header.guide': '🧭 가이드',
    'header.guideTitle': '컨트롤러 타일 가이드',
    'header.bgm': 'BGM',
    'header.sfx': 'SFX',
    'header.langToggle': '🌐 EN | KO',
    'header.langToggleTitle': '언어 변경 (EN / KO)',
    'header.themeToggleTitle': '캐릭터 테마 변경 (강아지 / 갈루아 소년)',
    'header.themeDog': '강아지',
    'header.themeGalua': '갈루아',
    'header.colorLight': '밝게',
    'header.colorDark': '어둡게',
    'header.colorToggleTitle': '밝은 화면 / 어두운 화면 전환',

    // Settings
    'settings.difficulty': '🎯 난이도',
    'settings.movesSuffix': '수',
    'settings.sizeTitle': '보드 크기 순환 (3×3 ➔ 4×4 ➔ 5×5)',
    'settings.diagOn': '⚡ 대각선 ON',
    'settings.diagOff': '⚡ 대각선 OFF',
    'settings.diagTitleOn': '대각선 변환 모드 켜짐 (탭하여 끄기)',
    'settings.diagTitleOff': '대각선 변환 모드 꺼짐 (탭하여 켜기)',

    // Status bar
    'status.groupD4': 'D₄ (정사면군)',
    'status.groupV4': 'V₄ (클라인 4원군)',
    'status.groupC2': 'C₂ (순환군)',
    'status.stageInfo': '{size}×{size} (최소 {moves}수 보장 퍼즐)',
    'status.moves': '{moves} 회',
    'status.bestRecordEmpty': '🏆 BEST: -',
    'status.bestRecordEmptyTitle': '아직 클리어 기록이 없습니다',
    'status.bestRecordTitle': '최고 기록: {time} ({moves})',

    // Controller tile labels
    'board.row': '{n}행',
    'board.col': '{n}열',
    'board.diagMain': '↖대각',
    'board.diagAnti': '↗대각',
    'board.switch11Title': '탭하여 1행 / 1열 변환 모드 전환',
    'board.optRow': '1행',
    'board.optCol': '1열',

    // Bottom controls
    'controls.undo': '↩ 되돌리기',
    'controls.hint': '💡 힌트보기',
    'controls.solution': '📖 해설보기',
    'controls.modeC2': 'C₂ 모드',
    'controls.modeV4': 'V₄ 모드',
    'controls.modeD4': 'D₄ 모드',

    // Tutorial Navigation & Actions
    'tutorial.headerTitle': '🎓 행렬 대칭 변환 가이드',
    'tutorial.headerBadge': '군론 튜토리얼',
    'tutorial.close': '닫기',
    'tutorial.prev': '◀ 이전',
    'tutorial.next1': '다음 (1/3) ➔',
    'tutorial.next2': '다음 (2/3) ➔',
    'tutorial.startPuzzle': '🎮 실전 퍼즐 시작하기',
    'tutorial.autoplayWatch': '▶ 한 수씩 보기',
    'tutorial.autoplayPause': '⏸ 일시정지',

    // Tutorial Step 1
    'tutorial.step1Name': 'STEP 1. 퍼즐 목표 & 행렬 변환 실전 시연',
    'tutorial.step1Main': '난이도와 모드에 따라 행과 열의 회전과 반사로 뒤섞인 모든 강아지들을, 행과 열 변환만으로 모두 처음의 강아지로 만드는 것이 목적이에요',
    'tutorial.step1Sub': '① 11 가로 쓱(1행 반사 MX) ➔ ② 12 세로 쓱(180° 회전 R180) ➔ ③ 31 3회 클릭(3행 회전 R270) ➔ ④ 21 대각선 긋기(2행 대각 변환)',
    'tutorial.step1TTS': '흩어진 강아지들을 제자리로 돌려놓는 퍼즐이에요. 아래 시연을 보며 어떻게 움직이는지 살펴볼까요?',

    'tutorial.step1Sub0Label': '① 11 가로 밀기',
    'tutorial.step1Sub0Badge': '💡 [11] 1행 첫 성분',
    'tutorial.step1Sub0Text': '11 가로 쓱 밀기 ➔ 1행 전체 가로 반사(MX)',
    'tutorial.step1Sub0Desc': '1행의 첫 성분 11을 가로로 쓱 밀면 1행 전체가 일제히 뒤태(X 뱃지)로 뒤집혀요!',
    'tutorial.step1Sub0Bubble': '11 가로 쓱 밀기 (↔)',

    'tutorial.step1Sub1Label': '② 12 세로 밀기',
    'tutorial.step1Sub1Badge': '✨ [12] 2열 첫 성분 (MX ∘ MY = R180)',
    'tutorial.step1Sub1Text': '12 세로 쓱 밀기 ➔ 12 타일 180° 회전!',
    'tutorial.step1Sub1Desc': '1행이 가로 반사(MX)된 상태에서 12를 세로로 밀면(MY), 가로와 세로가 만나 180° 회전(R180)이 돼요!',
    'tutorial.step1Sub1Bubble': '12 세로 쓱 밀기 (↕)',

    'tutorial.step1Sub2Label': '③ 31 3회 클릭 (3행)',
    'tutorial.step1Sub2Badge': '↻ [31] 3행 첫 성분 (3행 전체 변환)',
    'tutorial.step1Sub2Text': '31 3회 클릭 ➔ 3행 전체 90°씩 3회 순차 회전!',
    'tutorial.step1Sub2Desc': '3행의 첫 성분 31을 누르면 클릭할 때마다 3행 전체가 90° ➔ 180° ➔ 270°로 3번 회전해요!',
    'tutorial.step1Sub2Bubble': '31 가운데 3회 클릭 (3행)',
    'tutorial.step1Sub2Bubble1': '1회 클릭 ➔ 3행 90° 회전',
    'tutorial.step1Sub2Bubble2': '2회 클릭 ➔ 3행 180° 반전',
    'tutorial.step1Sub2Bubble3': '3회 클릭 ➔ 3행 270° 회전 완성!',

    'tutorial.step1Sub3Label': '④ 21 대각선 긋기 (2행)',
    'tutorial.step1Sub3Badge': '⚡ [21] 2행 첫 성분 대각선 변환',
    'tutorial.step1Sub3Text': '21 대각선 긋기 ➔ 주대각선(MD) + 대각선(MAD) = 180° 회전(R180)!',
    'tutorial.step1Sub3Desc': '손가락이 21 성분에서 ↖➔↘로 쓱 그으면 2행이 주대각선 대칭(MD), ↗➔↙로 대각선을 그으면 두 반사가 교차되어 180° 회전(R180)이 돼요!',
    'tutorial.step1Sub3Bubble': '21 대각선 긋기 (2행)',
    'tutorial.step1Sub3Bubble1': '1) ↖➔↘ 주대각 긋기 (2행 MD)',
    'tutorial.step1Sub3Bubble2': '2) ↗➔↙ 대각선 긋기 ➔ 180° 회전!',

    // Tutorial Step 2
    'tutorial.step2Name': 'STEP 2. [V4 실전] V4 4수 최단 풀이',
    'tutorial.step2Main': 'V4 모드는 {0, 180, X축(가로), Y축(세로)} 4가지 대칭 변환만 사용해요!',
    'tutorial.step2Sub': '👆 위의 [1수], [2수]... 버튼을 차례로 누르거나 [▶ 한 수씩 보기]를 누르면 손동작과 함께 4수 풀이가 실시간으로 펼쳐져요!',
    'tutorial.step2TTS': '브이포 모드는 회전과 가로 세로 대칭을 써요. 위의 수 버튼을 누르면 네 수 만에 풀리는 멋진 과정을 볼 수 있어요!',

    'tutorial.v4Step0Label': '초기',
    'tutorial.v4Step0Badge': '🧩 V4 모드 소개',
    'tutorial.v4Step0Text': 'V4 원소: 0°, 180°, X축(가로), Y축(세로)',
    'tutorial.v4Step0Desc': 'V4 모드에서는 대각선과 90° 회전이 없습니다. 4가지 변환 상쇄로 4수 만에 풀어보세요!',
    'tutorial.v4Step0Bubble': '👆 [▶ 한 수씩 보기] 클릭!',

    'tutorial.v4Step1Label': '1수',
    'tutorial.v4Step1Badge': '⚡ 1수: 3행 180° 회전 (R180)',
    'tutorial.v4Step1Text': '3행 1열(31) 더블 탭 👆👆 (R180)',
    'tutorial.v4Step1Desc': '3행에 180° 회전을 적용하면, 3행의 R180 타일 2개가 0번으로 깔끔하게 상쇄돼요!',
    'tutorial.v4Step1Bubble': '31 두 번 클릭 (90°+90°=180°)',

    'tutorial.v4Step2Label': '2수',
    'tutorial.v4Step2Badge': '⚡ 2수: 3열 세로 반사 (MY)',
    'tutorial.v4Step2Text': '1행 3열(13) 세로 밀기 ↕ (MY)',
    'tutorial.v4Step2Desc': '가로 반사(MX) 타일에 세로 반사(MY)가 만나면 180° 회전(MX ∘ MY = R180)으로 합성돼요!',
    'tutorial.v4Step2Bubble': '13 세로 쓱 그어 3열 변환 (↕)',

    'tutorial.v4Step3Label': '3수',
    'tutorial.v4Step3Badge': '⚡ 3수: 2행 세로 반사 (MY)',
    'tutorial.v4Step3Text': '2행 1열(21) 세로 밀기 ↕ (MY)',
    'tutorial.v4Step3Desc': '2행에 세로 반사를 적용하면, MY 타일들이 자기상쇄(MY² = 0)되어 정위치 0번이 돼요!',
    'tutorial.v4Step3Bubble': '21 세로 쓱 그어 2행 변환 (↕)',

    'tutorial.v4Step4Label': '4수 (완성)',
    'tutorial.v4Step4Badge': '🎉 4수: 1행 180° 회전 (R180) - 완성!',
    'tutorial.v4Step4Text': '1행 1열(11) 더블 탭 👆👆 (R180)',
    'tutorial.v4Step4Desc': '1행의 R180 타일들이 자기상쇄(180² = 0)되어 모든 강아지가 0번으로 일제히 완성!',
    'tutorial.v4Step4Bubble': '11 두 번 클릭 (90°+90°=180°)',

    // Tutorial Step 3
    'tutorial.step3Name': 'STEP 3. [D4 실전] 8차 정이면체군 D4 5수 묘수 풀이',
    'tutorial.step3Main': 'D4 모드는 회전 4종(0°, 90°, 180°, 270°)과 반사 4종(가로, 세로, 주대각, 부대각) 총 8가지 변환을 사용해요!',
    'tutorial.step3Sub': '👆 위의 [1수] ~ [5수] 버튼이나 [▶ 한 수씩 보기]를 누르면 대각선과 회전이 어우러진 5수 묘수 풀이가 실시간으로 펼쳐져요!',
    'tutorial.step3TTS': '디포 모드는 회전과 대각선 대칭까지 모두 사용해요. 다섯 수 만에 완성되는 신기한 해법을 함께 즐겨보세요!',

    'tutorial.d4Step0Label': '초기',
    'tutorial.d4Step0Badge': '🧩 D4 묘수 문제',
    'tutorial.d4Step0Text': 'D4 복합 스크램블 (초기)',
    'tutorial.d4Step0Desc': '90° 회전과 대각선 대칭이 포함된 기본 행·열 5수 최단 해법!',
    'tutorial.d4Step0Bubble': '👆 [▶ 한 수씩 보기] 클릭!',

    'tutorial.d4Step1Label': '1수',
    'tutorial.d4Step1Badge': '⚡ 1수: 1행 90° 회전',
    'tutorial.d4Step1Text': '1행 1열(11) 1회 탭 👆 (R90)',
    'tutorial.d4Step1Desc': '1행이 시계 방향 90° 회전되어 첫 번째 타일(1행 1열)이 0번 정위치 완성!',
    'tutorial.d4Step1Bubble': '11 1회 탭 (1행 90° 회전)',

    'tutorial.d4Step2Label': '2수',
    'tutorial.d4Step2Badge': '⚡ 2수: 3행 180° 회전',
    'tutorial.d4Step2Text': '3행 1열(31) 더블 탭 👆👆 (R180)',
    'tutorial.d4Step2Desc': '3행에 180° 회전을 적용하여 3행 첫 번째 타일(3행 1열)이 0번으로 상쇄!',
    'tutorial.d4Step2Bubble': '31 두 번 클릭 (3행 180° 회전)',

    'tutorial.d4Step3Label': '3수',
    'tutorial.d4Step3Badge': '⚡ 3수: 3열 세로 반사',
    'tutorial.d4Step3Text': '1행 3열(13) 세로 밀기 ↕ (MY)',
    'tutorial.d4Step3Desc': '3열에 세로 반사를 적용하여 3열의 양 끝 타일(1행·3행)이 일제히 0번 완성!',
    'tutorial.d4Step3Bubble': '13 천천히 세로 쓱 (3열 세로 반사 ↕)',

    'tutorial.d4Step4Label': '4수',
    'tutorial.d4Step4Badge': '⚡ 4수: 2행 주대각 대칭',
    'tutorial.d4Step4Text': '2행 1열(21) ↖➔↘ 대각선 긋기 (MD)',
    'tutorial.d4Step4Desc': '21 성분에서 대각선으로 쓱 그으면 2행 전체가 주대각 대칭(MD)되어 양 끝 타일이 0번 상쇄!',
    'tutorial.d4Step4Bubble': '21 천천히 대각선 쓱 (2행 주대각 대칭)',

    'tutorial.d4Step5Label': '5수 (완성)',
    'tutorial.d4Step5Badge': '🎉 5수: 2열 가로 반사 - 완성!',
    'tutorial.d4Step5Text': '1행 2열(12) 가로 밀기 ↔ (MX)',
    'tutorial.d4Step5Desc': '12 성분에서 가로로 쓱 밀면 2열의 모든 MX 타일이 상쇄되어 5수 만에 전체 0번 완성!',
    'tutorial.d4Step5Bubble': '👉 가로로 쓱 긋기 (2열 가로 대칭 ↔)',

    // About Modal
    'about.title': '🏆 작품 소개 & 수학적 배경',
    'about.tabIntro': '💡 기획 의도',
    'about.tabMath': '📐 D₄ 대칭군',
    'about.tabGod8': '⚡ 신의 숫자 8',
    'about.tabEdu': '🎓 교육적 효과',
    'about.confirm': '확인 및 플레이 시작',
    'about.closeAria': '닫기',

    'about.introCard1Badge': '🧩 개념의 재해석',
    'about.introCard1Title': '루빅스 큐브의 3차원 회전을 2차원 행렬 대칭군으로',
    'about.introCard1Desc': '기존의 3차원 루빅스 큐브는 공간 조작이 복잡하고 모바일 터치 제어가 어렵다는 한계가 있었습니다. 갈루아 큐브(Galois Cube)는 이를 N × N 평면 행렬의 대칭 변환으로 혁신적으로 재해석하여, 모바일 화면에서 직관적인 탭·스와이프 제스처만으로 즐길 수 있는 신개념 수학 퍼즐입니다.',

    'about.introCard2Badge': '🐕 감성적 비주얼',
    'about.introCard2Title': '귀여운 웰시코기 강아지와 함께하는 직관적 인지',
    'about.introCard2Desc': '딱딱한 숫자나 기호 대신 귀여운 강아지의 정면·뒤통수 및 꼬리 흔들기 애니메이션을 통해 타일의 회전(0°, 90°, 180°, 270°)과 대칭(앞뒤 반전) 상태를 한눈에 직관적으로 파악할 수 있도록 설계했습니다.',

    'about.introCard3Badge': '📱 완벽한 PWA 지원',
    'about.introCard3Title': '설치 없는 즉시 실행 & 오프라인 완벽 구동',
    'about.introCard3Desc': 'Progressive Web App(PWA) 기술을 탑재하여 앱스토어 설치 없이 홈 화면에 추가할 수 있으며, 오프라인 환경에서도 100% 동일한 부드러운 플레이가 가능합니다.',

    'about.mathCard1Badge': '대수학 군론 (Group Theory)',
    'about.mathCard1Title': '정사각 2차원 대칭군 D₄ (Dihedral Group)',
    'about.mathCard1Desc': '정사각형이 갖는 모든 8개의 대칭 변환을 엄밀한 수학적 군 연산 테이블(Cayley Table)로 모델링했습니다:',
    'about.mathListId': '항등원 (ID, 0): 원래 상태 (0° 회전)',
    'about.mathListRot': '회전원 (R90, R180, R270): 시계 방향 90°, 180°, 270° 회전 (C₄ 부분군)',
    'about.mathListRef': '축 대칭원 (MX, MY): 가로 X축 상하 반전, 세로 Y축 좌우 반전',
    'about.mathListDiag': '대각 대칭원 (MD, MAD): 주대각선(↖-↘) 및 부대각선(↗-↙) 대칭',

    'about.mathCard2Badge': '비가환 연산 (Non-commutative)',
    'about.mathCard2Title': '연산 순서가 결과를 바꾸는 깊이 있는 퍼즐성',
    'about.mathCard2Desc': '대칭군 연산은 교환법칙이 성립하지 않습니다 (A ∘ B ≠ B ∘ A). 예를 들어 가로 대칭 후 90도 회전한 결과는 90도 회전 후 가로 대칭한 결과와 완전히 다릅니다. 이러한 비가환 대수학적 특성이 깊이 있는 수읽기와 전략적 퍼즐 풀이의 묘미를 선사합니다.',

    'about.mathCard3Badge': '단계별 부분군 모드',
    'about.mathCard3Title': '수학적 수준에 맞춘 C₂ ➔ V₄ ➔ D₄ 학습 곡선',
    'about.mathCard3Desc': '- C₂ 모드: 180도 회전만 사용하는 순환군 (가장 쉬운 입문)\n- V₄ 모드: 클라인 4원군 (가로·세로 반전 및 180도 회전, 가환군)\n- D₄ 모드: 완전한 8개 원소 정사면군 (본격적인 최상위 도전)',

    'about.god8Card1Badge': '⚡ 수학적 정리 & 증명',
    'about.god8Card1Title': "갈루아 큐브의 '신의 숫자'는 단 8수 (God's Number 8)",
    'about.god8Card1Desc': "루빅스 큐브의 모든 배치가 최대 20수 이내에 풀린다는 사실이 '신의 숫자 20'으로 증명되었듯, 3×3 갈루아 큐브는 어떠한 상태에서 시작하더라도 최단 8수 이내에 100% 원상 복원이 가능함을 양방향 BFS 알고리즘을 통해 수학적으로 규명 및 전수 검증했습니다.",

    'about.god8Card2Badge': '초고속 최단수 솔버',
    'about.god8Card2Title': '비트마스크 양방향 BFS 엔진',
    'about.god8Card2Desc': '- 각 타일의 8가지 상태를 3비트로 압축하여 64비트 정수 하나로 전체 보드를 표현.\n- 시작 상태와 목표 상태 양방향에서 동시에 너비 우선 탐색을 수행하여 탐색 공간을 O(bᵈ)에서 O(bᵈᐟ²)로 기하급수적 단축.\n- 모바일 브라우저 환경에서도 0.05초 이내에 완벽한 최단수 해법 및 실시간 힌트를 산출합니다.',

    'about.eduCard1Badge': 'STEM / 수학교육',
    'about.eduCard1Title': '대학 수학(군론)을 초·중·고등학생도 즐기는 에듀테인먼트',
    'about.eduCard1Desc': "일반적으로 대학 수학과에서 다루는 추상대수학의 '대칭군(Dihedral Group)' 개념을 공식 암기가 아닌 손가락 터치와 시각적 회전 피드백을 통해 자연스럽게 '연산', '항등원', '역원', '합성'의 원리를 체득할 수 있습니다.",

    'about.eduCard2Badge': '인터랙티브 경험',
    'about.eduCard2Title': '피치 상승 콤보 사운드 & 햅틱 촉각 피드백',
    'about.eduCard2Desc': '연속 조작 시 음악적 음계(도-레-미-파-솔-라-도)로 상승하는 Web Audio API 신디사이저 사운드와, 성공 시 터지는 화려한 컨페티 폭죽 및 햅틱 진동으로 퍼즐 풀이의 쾌감을 극대화했습니다.',

    'about.eduCard3Badge': '알고리즘적 사고력 증진',
    'about.eduCard3Title': '수학적 이유(Why)가 적힌 단계별 해설서 제공',
    'about.eduCard3Desc': "단순히 답만 알려주는 것이 아니라, 각 조작 단계마다 '어떤 성분이 어떻게 상쇄되어 항등원으로 수렴하는지' 수학적 해설을 제공하여 논리적 문제 해결 능력을 신장시킵니다."
  }
};

/**
 * 다국어 번역 함수
 * @param key 번역 키
 * @param params 동적 대체 변수 (e.g. { size: 3, moves: 4 })
 */
export function t(key: string, params?: Record<string, string | number> | any): string {
  const lang = currentLang;
  let text = translations[lang]?.[key] ?? translations['en']?.[key] ?? key;
  if (typeof text === 'function') {
    return text(params);
  }
  if (typeof text === 'string' && params && typeof params === 'object') {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return text;
}
