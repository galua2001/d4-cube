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
    'header.formulaBook': '📖 Formulas',
    'header.formulaBookTitle': 'Open Galois Cube Formula Guidebook',
    'header.about': 'ℹ️ About',
    'header.aboutTitle': 'Project Overview & Mathematics',
    'header.guide': '🧭 Guide',
    'header.guideTitle': 'Controller Tile Guide',
    'header.timerModeStopwatch': '⏱️ Timer',
    'header.timerModeFree': '♾️ Free',
    'header.timerModeTitleStopwatch': 'Switch to Free Play Mode (No time pressure)',
    'header.timerModeTitleFree': 'Switch to Stopwatch Mode',
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
    'status.timerOff': '⏱️ OFF',
    'status.timerFree': '⏱️ OFF',
    'status.timerTitleOn': 'Timer ON (Click to turn OFF)',
    'status.timerTitleOff': 'Timer OFF (Click to turn ON)',
    'status.timerTitleToggle': 'Click to toggle Timer (⏱️ 00:00.0 ↔ ⏱️ OFF)',
    'status.timerTooltipOn': 'Timer ON (Click to turn OFF)',
    'status.timerTooltipOff': 'Timer OFF (Click to turn ON)',

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
    'tutorial.step3Sub': '👆 Press [Move 1] ~ [Move 5] buttons or [▶ Step by Step]! 💡 [D4 Dedicated Rotation]: Tap ➔ 90° | Double-tap ➔ 180° (1 Move!) | Long Press ➔ 270° (1 Move!)',
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
    'tutorial.d4Step1Bubble': '11 Short Tap ➔ Row 1 90°',

    'tutorial.d4Step2Label': 'Move 2',
    'tutorial.d4Step2Badge': '⚡ Move 2: Row 3 180° Rotation',
    'tutorial.d4Step2Text': 'Row 3 Col 1 (31) Double-tap 👆👆 ➔ Row 3 180° Rotation (R180)',
    'tutorial.d4Step2Desc': 'Quickly double-tapping 31 rotates all of Row 3 by 180° in just 1 move, cancelling the tile back to 0!',
    'tutorial.d4Step2Bubble': '31 Double-tap 👆👆 (180° in 1 Move!)',

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
    'about.eduCard3Desc': 'Rather than merely giving answers, each move provides algebraic explanations of which components cancel out toward the identity element, cultivating logical problem-solving skills.',

    // Formula Guidebook
    'formula.title': 'Galois Cube Formula Guidebook',
    'formula.subtitle': 'Master Dihedral Group D₄ and Klein 4-Group V₄ with Canonical Formulas & God Moves',
    'formula.close': 'Close',
    'formula.tabAll': 'All',
    'formula.tabBasic': 'Basic Laws',
    'formula.tabRotation': 'Rotation',
    'formula.tabReflection': 'Reflection',
    'formula.tabGodTechnique': 'God Techniques',
    'formula.tabAiMined': 'AI Mined',
    'formula.stepCount': 'Step {current} / {total}',
    'formula.btnPlay': '▶ Step Through',
    'formula.btnPause': '⏸ Pause',
    'formula.btnReset': '↺ Reset',
    'formula.speed05x': '0.5x',
    'formula.speed1x': '1.0x',
    'formula.speed2x': '2.0x',
    'formula.btnCopy': '📋 Copy Formula',
    'formula.copiedToast': 'Formula copied to clipboard!',
    'formula.badgeInteractive': 'Interactive',
    'formula.badgeConcept': 'Concept',
    'formula.noFormulaSelected': 'Select a formula from the list',
    'formula.stepInitial': 'Initial State',
    'formula.stepMove': 'Move {step}',
    'formula.tipLabel': '💡 Pro Tip',
    'formula.mathNotationLabel': 'Mathematical Formula',
    'formula.descriptionLabel': 'Principle & Strategy',
    'formula.demoSectionTitle': '3×3 Interactive Board Demonstration',
    'formula.searchPlaceholder': 'Search formulas by name, ID, moves, or tags...',
    'formula.searchEmptyMsg': 'No matching formulas found. Try a different keyword.',
    'formula.searchClearBtn': 'Clear search',
    'formula.tagAll': 'All',
    'formula.badgeMoveCount': '{count} Moves',

    // Items
    'formula.item.selfInverse.title': 'Law of Involution (Self-Inverse)',
    'formula.item.selfInverse.subtitle': 'Transforms of order 2 that cancel back to identity after 2 moves',
    'formula.item.selfInverse.desc': 'All reflection operations (MX, MY, MD, MAD) and 180° rotation (R180) have an order of 2. Applying the exact same move twice cancels out into the identity element (ID). If you make a mistake, simply repeat that line operation once more to undo it!',
    'formula.item.selfInverse.tip': 'Accidentally swiped Row 1 with MX? No worries! Swipe Row 1 with MX again to perfectly restore the previous state without using the Undo button.',
    'formula.item.selfInverse.step0': 'Initial Board (Solved state)',
    'formula.item.selfInverse.step1': 'Row 1 Horizontal Reflection (MX): Top row flips upside-down',
    'formula.item.selfInverse.step2': 'Row 1 Horizontal Reflection (MX) again: MX ∘ MX = ID restores original state!',

    'formula.item.reflectionComp.title': 'Reflection Composition Law',
    'formula.item.reflectionComp.subtitle': 'Composition of two perpendicular reflections generates 180° rotation',
    'formula.item.reflectionComp.desc': 'The composition of two orthogonal reflections equals a 180° rotation (R180). Applying horizontal reflection (MX) followed by vertical reflection (MY) flips both axes, resulting in a point reflection (half-turn). When two mirror axes form an angle θ, their composition is always a rotation by 2θ.',
    'formula.item.reflectionComp.tip': 'You can generate 180° rotated tiles solely using swipe gestures (reflections) without tapping for rotations.',
    'formula.item.reflectionComp.step0': 'Initial Board (Solved state)',
    'formula.item.reflectionComp.step1': 'Row 2 Horizontal Reflection (MX): Middle row flips horizontally',
    'formula.item.reflectionComp.step2': 'Row 2 Vertical Reflection (MY): Middle row becomes MX ∘ MY = R180!',

    'formula.item.centerInversion.title': 'Center 180° Inversion Technique',
    'formula.item.centerInversion.subtitle': 'Selective half-turn inversion of center tile via intersecting line composition',
    'formula.item.centerInversion.desc': 'In a 3×3 board, the center tile (Row 2, Col 2, cell 4) lies at the intersection of Row 2 and Column 2. By applying MX along Row 2 and MY along Col 2, the center tile receives both transformations (MX ∘ MY = R180) while outer tiles are selectively handled or cancelled.',
    'formula.item.centerInversion.tip': 'When only the center tile is upside down (R180), utilize intersecting Row/Col symmetry to reorient it without disturbing the corners.',
    'formula.item.centerInversion.step0': 'Initial State: Center tile is inverted (R180)',
    'formula.item.centerInversion.step1': 'Move 1: Row 2 MX (Horizontal reflection on middle row)',
    'formula.item.centerInversion.step2': 'Move 2: Col 2 MY (Vertical reflection on middle column) ➔ Center restores to ID!',

    'formula.item.commutator3Cycle.title': '3-Cycle Commutator ([A, B])',
    'formula.item.commutator3Cycle.subtitle': 'Rubik\'s Cube principle: Permutes only 3 target components, preserving the rest',
    'formula.item.commutator3Cycle.desc': 'When two moves A and B do not commute (AB ≠ BA), the commutator [A, B] = A ∘ B ∘ A⁻¹ ∘ B⁻¹ localizes the symmetry change only to elements affected by both operations, leaving all other non-overlapping tiles completely unchanged.',
    'formula.item.commutator3Cycle.tip': 'In late-game solving when only 2 or 3 tiles are misaligned, commutators allow surgical repairs without scrambling already solved regions.',
    'formula.item.commutator3Cycle.step0': 'Initial State: Commutator demo layout',
    'formula.item.commutator3Cycle.step1': 'Move 1: Row 1 R90 (Quarter clockwise turn)',
    'formula.item.commutator3Cycle.step2': 'Move 2: Col 1 MX (Vertical column horizontal mirror)',
    'formula.item.commutator3Cycle.step3': 'Move 3: Row 1 R270 (Inverse of R90)',
    'formula.item.commutator3Cycle.step4': 'Move 4: Col 1 MX (Self-inverse of MX) ➔ Commutator [R90, MX] complete!',

    'formula.item.diagonalCancel.title': 'Diagonal Reflection Cancellation',
    'formula.item.diagonalCancel.subtitle': 'Axis conjugate shortcut utilizing main diagonal reflection (MD)',
    'formula.item.diagonalCancel.desc': 'Main diagonal reflection (MD) swaps row and column coordinates ((i, j) ↔ (j, i)). Conjugating a row operation by diagonal reflection (MD ∘ Row_k ∘ MD) effectively transforms it into a column operation (Col_k). This allows solving diagonal scrambles in a single swift move.',
    'formula.item.diagonalCancel.tip': 'With Diagonal Mode ON, complex 3-move sequences can often be replaced by a single diagonal swipe across the center diagonal.',
    'formula.item.diagonalCancel.step0': 'Initial State: Diagonal elements (0, 4, 8) scrambled with MD',
    'formula.item.diagonalCancel.step1': 'Move 1: Main Diagonal MD swipe (↘) ➔ Entire diagonal restores via MD ∘ MD = ID!',
    'formula.item.diagonalCancel.step2': 'Move 2: Row 2 alignment if needed',

    'formula.item.v4Conquest.title': 'Klein 4-Group 4-Move Conquest',
    'formula.item.v4Conquest.subtitle': 'Guaranteed minimal-move canonical sequence for V₄ puzzle states',
    'formula.item.v4Conquest.desc': 'In Klein 4-Group V₄ = {ID, R180, MX, MY}, all elements commute (Abelian). Because operations are independent, parity-based line operations solve any 3×3 V₄ scramble in 4 moves or fewer.',
    'formula.item.v4Conquest.tip': 'Count the odd/even count of MX, MY, and R180 in each line. Apply each required symmetry once, and all tiles automatically synchronize to ID.',
    'formula.item.v4Conquest.step0': 'Initial State: Complex 4-move V₄ scramble',
    'formula.item.v4Conquest.step1': 'Move 1: Row 3 R180 (Double tap Row 3)',
    'formula.item.v4Conquest.step2': 'Move 2: Col 3 MY (Vertical swipe Col 3)',
    'formula.item.v4Conquest.step3': 'Move 3: Row 2 MY (Horizontal swipe Row 2)',
    'formula.item.v4Conquest.step4': 'Move 4: Row 1 R180 (Double tap Row 1) ➔ Board All-Clear (0 ID)!',

    'formula.item.masterMethod3Step.title': '3-Step Master General Method',
    'formula.item.masterMethod3Step.subtitle': 'Structure-based 3-step master guide without memorizing hundreds of cases',
    'formula.item.masterMethod3Step.desc': 'A canonical master algorithm that solves any scrambled state in 3 structured phases: [Step 1: Outer Reduction] ➔ [Step 2: Reflection Parity Cleanup] ➔ [Step 3: Surgical Finish Formula].',
    'formula.item.masterMethod3Step.tip': 'Align outer rows and columns first without fearing temporary disturbances. Pair perpendicular reflections (MX, MY) to flip mirror tiles into pure rotations, then finish with surgical commutators.',
    'formula.item.masterMethod3Step.step0': 'Initial State: Mixed scramble with outer, reflection, and finish components',
    'formula.item.masterMethod3Step.step1': 'Step 1: Row 1 MX (Outer row reduction) ➔ Clear boundary tiles 0 and 1 to ID',
    'formula.item.masterMethod3Step.step2': 'Step 2: Col 3 MY (Reflection parity cleanup) ➔ Outer tiles resolve, leaving clean finish line',
    'formula.item.masterMethod3Step.step3': 'Step 3: Row 2 R180 (Surgical finish formula) ➔ 100% Full board all-clear!',

    'formula.item.parity90Cycle.title': '90° Rotation Parity Law & 3-Cycle Solution',
    'formula.item.parity90Cycle.subtitle': 'Angular parity invariant and 3-cycle triplet one-shot clearance',
    'formula.item.parity90Cycle.desc': 'Due to dihedral parity laws, 90° rotated tiles can never exist in isolation (1 or 2 tiles are strictly forbidden). 90° rotations always occur as a triplet (3-Cycle) or as a 90° + 270° cancellation pair (summing to 360° ≡ 0°).',
    'formula.item.parity90Cycle.tip': 'If you think only one 90° tile remains, inspect closely: there must be a paired rotation or reflection. Use 3-Cycle or reverse rotation (R270) to clear triplets in one single stroke.',
    'formula.item.parity90Cycle.step0': 'Initial State: Solved board (ID) for parity demonstration',
    'formula.item.parity90Cycle.step1': 'Move 1: Row 1 R90 ➔ Generates 3-cycle triplet on Row 1 (proves 3-tile minimum)',
    'formula.item.parity90Cycle.step2': 'Move 2: Row 3 R270 ➔ 90° + 270° pair forms global angle parity conservation',
    'formula.item.parity90Cycle.step3': 'Move 3: Row 1 R270 ➔ 3-cycle triplet resolved in one shot (R90 ∘ R270 = ID)',
    'formula.item.parity90Cycle.step4': 'Move 4: Row 3 R90 ➔ Cancellation pair companion resolved, 100% board clearance!',

    'formula.item.parallel180Pair.title': 'Parallel 180° Pair Cancellation',
    'formula.item.parallel180Pair.subtitle': 'Orthogonal bridge trick resolving two 180° flips in the same line',
    'formula.item.parallel180Pair.desc': 'When two 180° flipped tiles appear side-by-side in the same row, flipping Column 3 via MX serves as an orthogonal bridge. Applying Row 1 R180 cleanly cancels the 180° pair back to identity without disturbing other tiles.',
    'formula.item.parallel180Pair.tip': 'When only two 180° rotations remain in the same row, utilize Column 3 reflection to safely eliminate the pair in just 3 moves.',
    'formula.item.parallel180Pair.step0': 'Initial State: Two 180° flipped tiles in Row 1 (cells 0 and 1)',
    'formula.item.parallel180Pair.step1': 'Move 1: Col 3 MX (Vertical flip creates orthogonal intersection)',
    'formula.item.parallel180Pair.step2': 'Move 2: Row 1 R180 (Cancels tiles 0 & 1 via R180² = ID)',
    'formula.item.parallel180Pair.step3': 'Move 3: Col 3 MX (Restores Col 3 via MX² = ID, pair eliminated!)',

    'formula.item.diagonal180Pair.title': 'Diagonal Corner 180° Pair Elimination',
    'formula.item.diagonal180Pair.subtitle': 'Diagonal conjugate trick simultaneously eliminating opposite corner 180° flips',
    'formula.item.diagonal180Pair.desc': 'When opposite diagonal corners (cells 0 and 8) are flipped by 180°, applying main diagonal reflection (MD) combined with orthogonal 180° rotations eliminates both corner flips simultaneously in 4 moves.',
    'formula.item.diagonal180Pair.tip': 'With diagonal moves enabled, opposite corner 180° pairs can be solved directly without touching the other 7 tiles.',
    'formula.item.diagonal180Pair.step0': 'Initial State: Opposite diagonal corners (0 and 8) flipped by 180°',
    'formula.item.diagonal180Pair.step1': 'Move 1: Main Diagonal MD (Transitions corners to MAD)',
    'formula.item.diagonal180Pair.step2': 'Move 2: Row 1 R180 (Aligns top-left corner to MD)',
    'formula.item.diagonal180Pair.step3': 'Move 3: Col 3 R180 (Aligns bottom-right corner to MD and restores cell 2)',
    'formula.item.diagonal180Pair.step4': 'Move 4: Main Diagonal MD (Restores via MD² = ID: corners solved!)',

    'formula.item.finishLShape5.title': '[Rank #1] L-Shape 5-Tile Error 2-Move Finish',
    'formula.item.finishLShape5.subtitle': 'Most frequent perpendicular 2-line intersection 5-error all-clear technique',
    'formula.item.finishLShape5.desc': 'A very common match-ending pattern where 5 tiles including the corner are misaligned along intersecting row and column lines. By applying Col 1 MY followed by Row 1 MX, the corner is properly phased and the entire L-shape collapses back to identity.',
    'formula.item.finishLShape5.tip': 'Resolve the column reflection first to align the corner tile phase with the row, then sweep the entire row in a single stroke.',
    'formula.item.finishLShape5.step0': 'Initial State: 5 tiles forming an L-shaped error (cells 0, 1, 2, 3, 6)',
    'formula.item.finishLShape5.step1': 'Move 1: Col 1 MY (Vertical swipe) ➔ Clears tiles 3 & 6, phases corner 0 into MX',
    'formula.item.finishLShape5.step2': 'Move 2: Row 1 MX (Horizontal swipe) ➔ All Row 1 tiles resolve via MX² = ID, 100% all-clear!',

    'formula.item.finishWingCross4.title': '[Rank #2] Wing Cross 4-Tile Misalignment 2-Move Finish',
    'formula.item.finishWingCross4.subtitle': 'Center self-cancellation miracle solving 4 cross edge wings simultaneously',
    'formula.item.finishWingCross4.desc': 'When the center and 4 corners are solved, but the 4 cross wings (cells 1, 3, 5, 7) are flipped by 180°. Order-2 rotations of Row 2 and Col 2 cancel out at the center (R180² = ID) and cleanly eliminate all 4 wings in 2 moves.',
    'formula.item.finishWingCross4.tip': 'Double tap Row 2, then double tap Col 2. The center temporarily inverts and immediately restores, clearing all 4 wings.',
    'formula.item.finishWingCross4.step0': 'Initial State: 4 cross edge wings (cells 1, 3, 5, 7) flipped by 180°',
    'formula.item.finishWingCross4.step1': 'Move 1: Row 2 R180 (Double tap Row 2) ➔ Resolves wings 3 & 5, center temporarily becomes R180',
    'formula.item.finishWingCross4.step2': 'Move 2: Col 2 R180 (Double tap Col 2) ➔ Resolves wings 1 & 7, center cancels via R180² = ID, 100% all-clear!',

    'formula.item.finishHybridCancel.title': '[Rank #3] Hybrid Reflection-Rotation L-Shape 2-Move Finish',
    'formula.item.finishHybridCancel.subtitle': 'Harmonizing mirror reflection and pure rotation into simultaneous 2-move clearance',
    'formula.item.finishHybridCancel.desc': 'A tricky state where one line is mirrored (MX) and the intersecting line is rotated (R180). Applying Col 1 MX cancels the reflection components and converts the corner into pure rotation (MY ∘ MX = R180), enabling Row 1 R180 to finish the board.',
    'formula.item.finishHybridCancel.tip': 'When reflection and rotation coexist, cancel the reflection first to synchronize the intersection into a pure rotation.',
    'formula.item.finishHybridCancel.step0': 'Initial State: Hybrid L-shape with reflection (cells 3, 6) and rotation (cells 1, 2)',
    'formula.item.finishHybridCancel.step1': 'Move 1: Col 1 MX (Horizontal swipe) ➔ Clears reflection tiles 3 & 6, turns corner into R180',
    'formula.item.finishHybridCancel.step2': 'Move 2: Row 1 R180 (Double tap Row 1) ➔ Row 1 resolves via R180² = ID, 100% all-clear!',

    'formula.item.quadCornerFinish.title': 'Quad-Corner Annihilation 3-Move Finish',
    'formula.item.quadCornerFinish.subtitle': 'Simultaneous annihilation of all 4 mirrored corners and center flip via diagonal conjugation',
    'formula.item.quadCornerFinish.desc': 'A formidable endgame dilemma where all 4 corners are mirror-reflected (MX) and the center is flipped by 180°. By applying Main Diagonal MAD followed by Anti-Diagonal MX, anti-diagonal corners cancel out immediately while the main diagonal synchronizes to R270. A final Main Diagonal R90 resolves the entire board in 3 moves.',
    'formula.item.quadCornerFinish.tip': 'When all four corners are reflected, do not handle them individually. Use alternating diagonal swipes to cancel anti-diagonal corners first, then sweep the main diagonal with a quarter turn.',
    'formula.item.quadCornerFinish.step0': 'Initial State: All 4 corners (0, 2, 6, 8) reflected by MX and center (4) flipped by R180',
    'formula.item.quadCornerFinish.step1': 'Move 1: Main Diagonal MAD ➔ Corners 0 & 8 transition to R270, center tile 4 converts to MD',
    'formula.item.quadCornerFinish.step2': 'Move 2: Anti-Diagonal MX ➔ Anti-diagonal corners (2, 6) clear via MX² = ID, main diagonal synchronizes to R270',
    'formula.item.quadCornerFinish.step3': 'Move 3: Main Diagonal R90 ➔ Main diagonal clears via R270 ∘ R90 = ID, 100% full board all-clear!',

    'formula.item.diagonalSpineFlush.title': 'Diagonal Spine-Perimeter Flush 3-Move Formula',
    'formula.item.diagonalSpineFlush.subtitle': 'Flush intersecting diagonal spine reflections and perimeter edges into a single row clear',
    'formula.item.diagonalSpineFlush.desc': 'A high-level geometric scramble intertwining anti-diagonal reflections (MAD) on Row 1 outer edges with diagonal reflections (MD) along the vertical spine (Col 2). [Row 1 MY] converts outer edges into R270, [Col 2 MD] flushes the spine via MD² = ID and elevates intersection tile 1 into R270, and [Row 1 R90] finishes Row 1 in a single stroke.',
    'formula.item.diagonalSpineFlush.tip': 'When diagonal reflections lock the central spine and outer corners, induce symmetric cancellation along the spine (MD² = ID) to collapse the remaining errors into a single row.',
    'formula.item.diagonalSpineFlush.step0': 'Initial State: Row 1 corners (0, 2) in MAD, vertical spine (4, 7) in MD',
    'formula.item.diagonalSpineFlush.step1': 'Move 1: Row 1 MY (Vertical swipe) ➔ Corners (0, 2) transition to R270, center tile 1 becomes MY',
    'formula.item.diagonalSpineFlush.step2': 'Move 2: Col 2 MD ➔ Spine tiles (4, 7) eliminate via MD² = ID, Row 1 synchronizes to R270',
    'formula.item.diagonalSpineFlush.step3': 'Move 3: Row 1 R90 ➔ Row 1 resolves via R270 ∘ R90 = ID, achieving 100% all-clear!',

    'formula.item.d4DiamondCross3.title': 'D4 Diamond Cross 3-Move Finish',
    'formula.item.d4DiamondCross3.subtitle': 'Synchronizing center and cross wings into uniform R270 phase for a clean 3-move wipe',
    'formula.item.d4DiamondCross3.desc': 'A high-tier dilemma where wings and center are twisted in a cross pattern. Solves wings and center phase alignment in just 3 moves: [Row 2 R90] ➔ [Col 2 MX] ➔ [Row 2 R90] to achieve 100% all-clear.',
    'formula.item.d4DiamondCross3.tip': 'Rotating Row 2 by 90° transitions side wings into R270, then Column 2 vertical flip (MX) restores top/bottom wings and synthesizes the center into R270. Row 2 R90 then wipes the line clean in one stroke.',
    'formula.item.d4DiamondCross3.step0': 'Initial State: Cross wings (1, 7: MX; 3, 5: R180) and center (4: MX) form diamond cross pattern',
    'formula.item.d4DiamondCross3.step1': 'Move 1: Row 2 R90 (Clockwise 90°) ➔ Wings 3 & 5 become R270, center tile 4 becomes MD',
    'formula.item.d4DiamondCross3.step2': 'Move 2: Col 2 MX (Vertical flip) ➔ Wings 1 & 7 clear via MX² = ID, center tile 4 becomes R270',
    'formula.item.d4DiamondCross3.step3': 'Move 3: Row 2 R90 (Finish wipe) ➔ All Row 2 tiles clear via R270 ∘ R90 = ID, 100% all-clear!',

    'formula.item.d4LDiagCombo3.title': 'D4 L-Diagonal Combo 3-Move Finish',
    'formula.item.d4LDiagCombo3.subtitle': 'Harmonizing diagonal reflection with orthogonal rotation to all-kill an L-shaped cascade',
    'formula.item.d4LDiagCombo3.desc': 'Resolves a 5-error L-shape intersecting Row 1 and Col 3 in just 3 moves: [Row 1 R90] ➔ [Col 3 MD] ➔ [Row 1 R90], utilizing non-commutativity of diagonal symmetry to sweep the entire line.',
    'formula.item.d4LDiagCombo3.tip': 'Rotate Row 1 first to prepare corner phase, then swipe Column 3 with diagonal reflection (MD) to clear Column 3 and focus all remaining errors into Row 1 for a single finish swipe.',
    'formula.item.d4LDiagCombo3.step0': 'Initial State: L-shape error with Row 1 (cells 0, 1: R180) and Col 3 (cells 2, 5, 8: MD)',
    'formula.item.d4LDiagCombo3.step1': 'Move 1: Row 1 R90 (Clockwise 90°) ➔ Tiles 0 & 1 become R270, corner tile 2 becomes MY',
    'formula.item.d4LDiagCombo3.step2': 'Move 2: Col 3 MD (Diagonal swipe) ➔ Tiles 5 & 8 clear via MD² = ID, corner tile 2 becomes R270',
    'formula.item.d4LDiagCombo3.step3': 'Move 3: Row 1 R90 (Finish wipe) ➔ Entire Row 1 clears via R270 ∘ R90 = ID, 100% all-clear!',

    'formula.item.d4XCross3.title': 'D4 X-Cross Corner 3-Move Finish',
    'formula.item.d4XCross3.subtitle': 'Segregating 4 corner errors into clean horizontal lines to annihilate corners in 3 moves',
    'formula.item.d4XCross3.desc': 'Conquers the X-cross dilemma where 4 corners (0, 2, 6, 8) and center (4) are entangled. [Col 2 R270] restores center and synchronizes top/bottom rows into R270, followed by [Row 3 R90] and [Row 1 R90] for complete clearance.',
    'formula.item.d4XCross3.tip': 'Col 2 R270 cancels out center tile 4 (R90 ∘ R270 = ID) while segregating corners into Row 1 and Row 3. Two R90 swipes then clear each row in turn.',
    'formula.item.d4XCross3.step0': 'Initial State: 4 corners (0, 2, 6, 8: R270) and center (4: R90) form an X-cross pattern',
    'formula.item.d4XCross3.step1': 'Move 1: Col 2 R270 (Counter-clockwise 90°) ➔ Center 4 clears to ID, Rows 1 & 3 become pure R270 lines',
    'formula.item.d4XCross3.step2': 'Move 2: Row 3 R90 (Row 3 wipe) ➔ Row 3 tiles (6, 7, 8) clear via R270 ∘ R90 = ID',
    'formula.item.d4XCross3.step3': 'Move 3: Row 1 R90 (Finish wipe) ➔ Row 1 tiles (0, 1, 2) clear via R270 ∘ R90 = ID, 100% all-clear!',

    'formula.item.d4DoubleCross4.title': 'D4 Double-Cross Twist 4-Move Purge',
    'formula.item.d4DoubleCross4.subtitle': 'Orthogonal reflection composition (MX ∘ MY = R180) and center tile self-cancellation for a 4-move purge',
    'formula.item.d4DoubleCross4.desc': 'A distance 4 bottleneck where the center cross is twisted by orthogonal reflections and corners by R180. Resolves in 4 moves: [Row 2 MX] ➔ [Col 2 MY] ➔ [Row 1 R180] ➔ [Col 1 R180] via center reduction and triple-cancel finish.',
    'formula.item.d4DoubleCross4.tip': 'Applying MX on Row 2 shifts the center to MY, and Col 2 MY restores center to ID while compressing all remaining errors into Column 1 for a 3-tile simultaneous clearance.',
    'formula.item.d4DoubleCross4.step0': 'Initial State: Center cross twisted by orthogonal reflections (1, 7: MY; 3, 5: MX) and corners by R180',
    'formula.item.d4DoubleCross4.step1': 'Move 1: Row 2 MX (Horizontal flip) ➔ Clears tile 5, center becomes MY',
    'formula.item.d4DoubleCross4.step2': 'Move 2: Col 2 MY (Vertical flip) ➔ Clears tile 7, restores center tile 4 to ID',
    'formula.item.d4DoubleCross4.step3': 'Move 3: Row 1 R180 (Double tap) ➔ Clears tiles 1 & 2, concentrates all errors into Col 1',
    'formula.item.d4DoubleCross4.step4': 'Move 4: Col 1 R180 (Triple Cancel Finish) ➔ Resolves tiles 0, 3, 6 simultaneously, 100% all-clear!',

    'formula.item.d4SpiralVortex4.title': 'D4 4-Way Spiral Vortex 4-Move All-Clear',
    'formula.item.d4SpiralVortex4.subtitle': 'Perimeter loop 90° pulses eliminating 2-pass corners and 1-pass edges sequentially',
    'formula.item.d4SpiralVortex4.desc': 'A bottleneck where outer 8 tiles form a spiral of corner R180 and edge R270. Resolves in 4 moves along the perimeter loop: [Row 1 R90] ➔ [Col 3 R90] ➔ [Row 3 R90] ➔ [Col 1 R90] to achieve complete clearance.',
    'formula.item.d4SpiralVortex4.tip': 'Cascading 90° clockwise pulses along the 4 borders execute double-kills in moves 2 & 3, culminating in a dramatic triple-kill in move 4.',
    'formula.item.d4SpiralVortex4.step0': 'Initial State: Outer 8 tiles form a chirality vortex (corners: R180, edges: R270)',
    'formula.item.d4SpiralVortex4.step1': 'Move 1: Row 1 R90 (Clockwise 90°) ➔ Clears edge tile 1, corners enter phase R270',
    'formula.item.d4SpiralVortex4.step2': 'Move 2: Col 3 R90 (Double-Kill) ➔ Clears corner 2 and edge 5 simultaneously',
    'formula.item.d4SpiralVortex4.step3': 'Move 3: Row 3 R90 (Double-Kill) ➔ Clears corner 8 and edge 7, aligns Col 1 to R270',
    'formula.item.d4SpiralVortex4.step4': 'Move 4: Col 1 R90 (Triple-Kill Finish) ➔ Clears Col 1 (0, 3, 6) simultaneously, 100% all-clear!',

    'formula.item.d4DualDiagonalBlitz4.title': 'D4 Dual-Diagonal Symmetry Blitz 4-Move Destruction',
    'formula.item.d4DualDiagonalBlitz4.subtitle': 'Dual diagonal reflections (MD ∘ MAD = R180) partition rows into complementary phase sweeps',
    'formula.item.d4DualDiagonalBlitz4.desc': 'A distance 4 bottleneck with dual diagonal reflections and row-wise phase splits. Solves in 4 moves: [Main Diag MD] ➔ [Anti Diag MAD] ➔ [Row 1 R90] ➔ [Row 3 R270] via center wipeout and dual triple-kills.',
    'formula.item.d4DualDiagonalBlitz4.tip': 'Main diagonal MD transforms diagonal tiles into rotations; Anti-diagonal MAD wipes the center and segregates Row 1 (R270) and Row 3 (R90) for two back-to-back triple-kill sweeps.',
    'formula.item.d4DualDiagonalBlitz4.step0': 'Initial State: Dual diagonal reflections and split phase rotations',
    'formula.item.d4DualDiagonalBlitz4.step1': 'Move 1: Main Diag MD (Diagonal swipe ↖) ➔ Diagonal tiles convert to rotations, center becomes MAD',
    'formula.item.d4DualDiagonalBlitz4.step2': 'Move 2: Anti Diag MAD (Diagonal swipe ↗) ➔ Clears center, splits board into Row 1 (R270) & Row 3 (R90)',
    'formula.item.d4DualDiagonalBlitz4.step3': 'Move 3: Row 1 R90 (Triple-Kill) ➔ Row 1 (0, 1, 2) clears via R270 ∘ R90 = ID',
    'formula.item.d4DualDiagonalBlitz4.step4': 'Move 4: Row 3 R270 (Triple-Kill Finish) ➔ Row 3 (6, 7, 8) clears via R90 ∘ R270 = ID, 100% all-clear!',

    // Practice on Board Mode
    'formula.btnPracticeOnBoard': '🚀 Practice on Board',
    'practice.badgeTitle': '[🎯 Practice: {title}]',
    'practice.targetMoves': 'Target: {moves} moves',
    'practice.perfectTitle': '🏆 Master Formula Perfected!',
    'practice.perfectDesc': '{title} (Completed in {moves} moves!)',
    'practice.shortcutTitle': '⚡ Shortcut Discovered!',
    'practice.shortcutDesc': 'Solved in {moves} moves, faster than target {target}!',
    'practice.clearedTitle': '🎉 Puzzle Solved!',
    'practice.clearedDesc': 'Target was {target} moves, but took {moves} moves.',
    'practice.retry': '↺ Retry Practice',
    'practice.exit': 'Back to Game',
    'practice.exitBtnTitle': 'Exit Practice',

    // New D4 Master Formulas (Round 4)
    'formula.item.d4CheckerboardSuper4.title': 'D4 Checkerboard Phase-Shift 4-Move Super Purge',
    'formula.item.d4CheckerboardSuper4.subtitle': 'Dual diagonal 180° inversions followed by Row 2 and Column 2 sweeps for a full checkerboard purge',
    'formula.item.d4CheckerboardSuper4.desc': 'A checkerboard bottleneck with 5 diagonal tiles (R180) and 4 orthogonal cross tiles (R270). Resolves in 4 moves: [Main Diag R180] ➔ [Anti Diag R180] ➔ [Row 2 R90] ➔ [Col 2 R90] via dual diagonal cancel and a Column 2 triple-kill finish.',
    'formula.item.d4CheckerboardSuper4.tip': 'Dual 180° diagonal inversions clear all 4 corners (0, 2, 6, 8) and the center immediately. Subsequent R90 rotations on Row 2 and Column 2 deliver double-kill and triple-kill clears.',
    'formula.item.d4CheckerboardSuper4.step0': 'Initial State: Checkerboard phase split with 5 diagonal tiles (R180) and 4 cross tiles (R270)',
    'formula.item.d4CheckerboardSuper4.step1': 'Move 1: Main Diag R180 ➔ Cancels tiles 0, 4, 8 simultaneously (Triple-Kill)',
    'formula.item.d4CheckerboardSuper4.step2': 'Move 2: Anti Diag R180 ➔ Cancels corners 2 and 6 (Double-Kill), conquering all 4 corners',
    'formula.item.d4CheckerboardSuper4.step3': 'Move 3: Row 2 R90 ➔ Cancels edge tiles 3 and 5 (Double-Kill), isolates errors into Column 2',
    'formula.item.d4CheckerboardSuper4.step4': 'Move 4: Col 2 R90 ➔ Column 2 tiles (1, 4, 7) wiped simultaneously (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4TSpineFlush3.title': 'D4 T-Spine Alignment 3-Move Flush',
    'formula.item.d4TSpineFlush3.subtitle': 'Row 1 phase coupling followed by Col 2 spine reflection and a final Row 1 triple-kill flush',
    'formula.item.d4TSpineFlush3.desc': 'A localized T-spine bottleneck of Row 1 (0, 1, 2) and Col 2 spine (4, 7). Solves in 3 fast moves: [Row 1 R90] ➔ [Col 2 MX] ➔ [Row 1 R90] via spine cancel and Row 1 triple-kill finish.',
    'formula.item.d4TSpineFlush3.tip': 'Row 1 R90 transforms tile 1 to MD, then Col 2 MX cancels spine tiles (4, 7) while synchronizing Row 1 to R270. The final Row 1 R90 delivers an explosive Triple-Kill.',
    'formula.item.d4TSpineFlush3.step0': 'Initial State: Localized T-spine bottleneck of Row 1 (0, 1, 2) and Col 2 spine (4, 7)',
    'formula.item.d4TSpineFlush3.step1': 'Move 1: Row 1 R90 ➔ Phase coupling (MX ∘ R90 = MD) prepares symmetry with Col 2',
    'formula.item.d4TSpineFlush3.step2': 'Move 2: Col 2 MX ➔ Spine cells 4, 7 cleared (Double-Kill); tile 1 synchronizes to R270',
    'formula.item.d4TSpineFlush3.step3': 'Move 3: Row 1 R90 ➔ Row 1 tiles (0, 1, 2) wipe out via R270 ∘ R90 = ID (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4ChiralPinwheel4.title': 'D4 4-Way Chiral Pinwheel 4-Move All-Clear',
    'formula.item.d4ChiralPinwheel4.subtitle': 'Perimeter loop sequence alternating rotations and reflections to collapse the chiral pinwheel',
    'formula.item.d4ChiralPinwheel4.desc': 'A chiral pinwheel dilemma with orthogonal edges (R270 / MX) and diagonal corners. Cleared in 4 perimeter moves: [Row 1 R90] ➔ [Col 3 MX] ➔ [Row 3 R90] ➔ [Col 1 MX] via perimeter cascade and Col 1 triple-kill.',
    'formula.item.d4ChiralPinwheel4.tip': 'Cycles through perimeter edges and corners in alternating rotation and reflection moves: 1-kill, 2-kill, 2-kill, ending in an explosive triple-kill on Column 1.',
    'formula.item.d4ChiralPinwheel4.step0': 'Initial State: 4-way orthogonal rotation-reflection composite around an identity center',
    'formula.item.d4ChiralPinwheel4.step1': 'Move 1: Row 1 R90 ➔ Top edge tile 1 clears via R270 ∘ R90 = ID (Single-Kill)',
    'formula.item.d4ChiralPinwheel4.step2': 'Move 2: Col 3 MX ➔ Corner 2 and edge 5 cleared simultaneously via MX ∘ MX = ID (Double-Kill)',
    'formula.item.d4ChiralPinwheel4.step3': 'Move 3: Row 3 R90 ➔ Edge 7 and corner 8 cleared (Double-Kill); isolates Column 1 into pure MX phase',
    'formula.item.d4ChiralPinwheel4.step4': 'Move 4: Col 1 MX ➔ Column 1 (0, 3, 6) wiped simultaneously via MX ∘ MX = ID (Triple-Kill Finish), 100% all-clear!',


    // Round 5 Master Formulas 3 (en)
    'formula.item.d4CornerRingBlitz4.title': 'Corner Ring Blitz (4-Corner Outer Perimeter 4-Move Wipeout)',
    'formula.item.d4CornerRingBlitz4.subtitle': 'Clockwise perimeter sequence of 4 R90 rotations wiping out all 8 outer tiles',
    'formula.item.d4CornerRingBlitz4.desc': 'A perimeter ring bottleneck where center tile 4 is solved and 8 outer tiles are trapped in R180/R270 phase splits. Solved in 4 perimeter moves: [Row 1 R90] ➔ [Col 3 R90] ➔ [Row 3 R90] ➔ [Col 1 R90] via sequential double and triple kills.',
    'formula.item.d4CornerRingBlitz4.tip': 'Cycles clockwise along the outer perimeter (Row 1 ➔ Col 3 ➔ Row 3 ➔ Col 1) to execute consecutive double-kills and a triple-kill finish.',
    'formula.item.d4CornerRingBlitz4.step0': 'Initial State: Center tile 4 intact with 8 outer perimeter tiles in R180/R270 phase splits',
    'formula.item.d4CornerRingBlitz4.step1': 'Move 1: Row 1 R90 ➔ Top edge tile 1 clears via R270 ∘ R90 = ID (Single-Kill)',
    'formula.item.d4CornerRingBlitz4.step2': 'Move 2: Col 3 R90 ➔ Corner 2 and edge 5 cleared simultaneously via R270 ∘ R90 = ID (Double-Kill)',
    'formula.item.d4CornerRingBlitz4.step3': 'Move 3: Row 3 R90 ➔ Edge 7 and corner 8 cleared (Double-Kill); isolates Column 1 into R270 phase',
    'formula.item.d4CornerRingBlitz4.step4': 'Move 4: Col 1 R90 ➔ Column 1 (0, 3, 6) wiped simultaneously via R270 ∘ R90 = ID (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4CrossInversion3.title': 'Cross Inversion (3-Move Center-Cross Phase Annihilation)',
    'formula.item.d4CrossInversion3.subtitle': 'Orthogonal sandwich sequence resolving 5 cross tiles while preserving all 4 corners',
    'formula.item.d4CrossInversion3.desc': 'A pure cross pattern where 4 corners are preserved and only 5 cross tiles (1, 3, 4, 5, 7) are inverted by MX and R180. Cleared in 3 swift moves: [Row 2 R90] ➔ [Col 2 MX] ➔ [Row 2 R90] via double-kill and center-row triple-kill.',
    'formula.item.d4CrossInversion3.tip': 'Orthogonal sandwich (Row 2 R90 ➔ Col 2 MX ➔ Row 2 R90) isolates and annihilates all 5 cross tiles in just 3 moves without touching corners.',
    'formula.item.d4CrossInversion3.step0': 'Initial State: 4 corners preserved with 5 cross tiles inverted in MX and R180 phases',
    'formula.item.d4CrossInversion3.step1': 'Move 1: Row 2 R90 ➔ Twists horizontal phases into vertical reflection alignment',
    'formula.item.d4CrossInversion3.step2': 'Move 2: Col 2 MX ➔ Top (1) and bottom (7) cross tiles cleared via MX ∘ MX = ID (Double-Kill)',
    'formula.item.d4CrossInversion3.step3': 'Move 3: Row 2 R90 ➔ Row 2 tiles (3, 4, 5) wiped simultaneously via R270 ∘ R90 = ID (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4DiagonalWindmill4.title': 'Diagonal Windmill (4-Move Diagonal-Orthogonal Phase Blitz)',
    'formula.item.d4DiagonalWindmill4.subtitle': 'Alternating diagonal and orthogonal moves collapsing complex windmill phase splits',
    'formula.item.d4DiagonalWindmill4.desc': 'A complex windmill pattern where diagonal reflection (MD), horizontal reflection (MX), and rotations entangle all 9 tiles. Cleared in 4 moves: [Main Diag R90] ➔ [Col 2 R90] ➔ [Anti Diag R90] ➔ [Row 2 MX] through three consecutive double-kills and a center-row triple-kill finish.',
    'formula.item.d4DiagonalWindmill4.tip': 'Alternating diagonal and orthogonal operations (Main Diag ➔ Col 2 ➔ Anti Diag ➔ Row 2) scores 3 consecutive double-kills followed by a clean Row 2 triple-kill finish.',
    'formula.item.d4DiagonalWindmill4.step0': 'Initial State: All 9 tiles entangled in diagonal-orthogonal windmill phase splits',
    'formula.item.d4DiagonalWindmill4.step1': 'Move 1: Main Diag R90 ➔ Corners 0 and 8 cleared simultaneously via R270 ∘ R90 = ID (Double-Kill)',
    'formula.item.d4DiagonalWindmill4.step2': 'Move 2: Col 2 R90 ➔ Vertical edges 1 and 7 cleared simultaneously via R270 ∘ R90 = ID (Double-Kill)',
    'formula.item.d4DiagonalWindmill4.step3': 'Move 3: Anti Diag R90 ➔ Opposite corners 2 and 6 cleared (Double-Kill); isolates Row 2 into pure MX phase',
    'formula.item.d4DiagonalWindmill4.step4': 'Move 4: Row 2 MX ➔ Row 2 tiles (3, 4, 5) wiped simultaneously via MX ∘ MX = ID (Triple-Kill Finish), 100% all-clear!',

    // Round 6 Master Formulas 3 (en)
    'formula.item.d4TwinColumnFlux4.title': 'Twin Column Flux (4-Move Super Finish)',
    'formula.item.d4TwinColumnFlux4.subtitle': 'Symmetric flux between Col 1 and Col 3 resolved in 4 moves via Row 2 orthogonal alternation',
    'formula.item.d4TwinColumnFlux4.desc': 'A twin-column flux state where Columns 1 and 3 are phase-split while Column 2 is completely intact. Cleared in 4 moves: [Col 1 R90] ➔ [Row 2 R90] ➔ [Col 3 MX] ➔ [Row 2 R270] using Row 2 orthogonal coupling.',
    'formula.item.d4TwinColumnFlux4.tip': 'Col 1 and Col 3 exhibit opposing phase shifts. Using Row 2 as a bridge with alternating rotations and reflections decouples both columns without disturbing Column 2.',
    'formula.item.d4TwinColumnFlux4.step0': 'Initial State: 6-error twin columns (Col 1 & Col 3) with Column 2 completely solved',
    'formula.item.d4TwinColumnFlux4.step1': 'Move 1: Col 1 R90 ➔ Column 1 cleared via R270 ∘ R90 = ID (Triple-Kill)',
    'formula.item.d4TwinColumnFlux4.step2': 'Move 2: Row 2 R90 ➔ Row 2 temporary twist sets up mirror conjugate on tile 5',
    'formula.item.d4TwinColumnFlux4.step3': 'Move 3: Col 3 MX ➔ Column 3 cleared via reflection cancel (Triple-Kill); Row 2 aligned to R90',
    'formula.item.d4TwinColumnFlux4.step4': 'Move 4: Row 2 R270 ➔ Row 2 restored via R90 ∘ R270 = ID (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4HBracketSmash3.title': 'H-Bracket Phase Inversion 3-Move Kill',
    'formula.item.d4HBracketSmash3.subtitle': 'A 7-error H-shaped frame shattered in 3 surgical R90 moves',
    'formula.item.d4HBracketSmash3.desc': 'A dense 7-error H-bracket pattern where only top/bottom center edges (1, 7) are solved. Cleared in just 3 moves: [Col 1 R90] ➔ [Row 2 R90] ➔ [Col 3 R90] through double-kill, center double-kill, and Col 3 triple-kill finish.',
    'formula.item.d4HBracketSmash3.tip': 'Symmetric three-step R90 sweep (Col 1 ➔ Row 2 ➔ Col 3) uses Row 2 to link both outer columns, annihilating the entire H-bracket without touching edges 1 and 7.',
    'formula.item.d4HBracketSmash3.step0': 'Initial State: 7-error H-bracket pattern with edges 1 and 7 intact',
    'formula.item.d4HBracketSmash3.step1': 'Move 1: Col 1 R90 ➔ Corners 0 and 6 cleared via R270 ∘ R90 = ID (Double-Kill)',
    'formula.item.d4HBracketSmash3.step2': 'Move 2: Row 2 R90 ➔ Tiles 3 and 4 cleared (Double-Kill); Column 3 aligned into pure R270 phase',
    'formula.item.d4HBracketSmash3.step3': 'Move 3: Col 3 R90 ➔ Column 3 (2, 5, 8) wiped simultaneously via R270 ∘ R90 = ID (Triple-Kill Finish), 100% all-clear!',

    'formula.item.d4StarBurstVortex4.title': '8-Way Starburst Vortex 4-Move All-Kill',
    'formula.item.d4StarBurstVortex4.subtitle': 'Dual diagonal rotations followed by central cross orthogonal sweeps collapsing all 8 outer tiles',
    'formula.item.d4StarBurstVortex4.desc': 'An 8-way vortex where center tile 4 is solved while all 8 outer tiles are twisted in alternating R270/R90 phases. Cleared in 4 moves: [Main Diag R90] ➔ [Anti Diag R90] ➔ [Row 2 R270] ➔ [Col 2 R270] via diagonal cross collapses and orthogonal double/triple kills.',
    'formula.item.d4StarBurstVortex4.tip': 'Dual diagonal R90 moves neutralize all 4 corners while concentrating residual error into the central cross. Subsequent Row 2 and Col 2 R270 sweeps wipe out the remaining cross effortlessly.',
    'formula.item.d4StarBurstVortex4.step0': 'Initial State: Center tile 4 solved, all 8 outer perimeter and corner tiles trapped in starburst vortex',
    'formula.item.d4StarBurstVortex4.step1': 'Move 1: Main Diag R90 ➔ Corners 0 and 8 cleared via R270 ∘ R90 = ID (Double-Kill)',
    'formula.item.d4StarBurstVortex4.step2': 'Move 2: Anti Diag R90 ➔ Corners 2 and 6 cleared (Double-Kill); center 4 transitions to R180',
    'formula.item.d4StarBurstVortex4.step3': 'Move 3: Row 2 R270 ➔ Center row tiles (3, 5) cleared (Double-Kill); vertical spine aligned to R90',
    'formula.item.d4StarBurstVortex4.step4': 'Move 4: Col 2 R270 ➔ Col 2 tiles (1, 4, 7) wiped simultaneously (Triple-Kill Finish), 100% all-clear!',


  },

  ko: {
    // Header & Navigation
    'title': '갈루아 큐브',
    'header.title': '갈루아 큐브',
    'header.pwaInstall': '📱 앱설치',
    'header.pwaInstallTitle': '스마트폰에 앱으로 설치',
    'header.tutorial': '🎓 튜토리얼',
    'header.tutorialTitle': '30초 인터랙티브 D4 연산 튜토리얼',
    'header.formulaBook': '📖 비법서',
    'header.formulaBookTitle': '갈루아 큐브 핵심 공식 비법서 열기',
    'header.about': 'ℹ️ 소개',
    'header.aboutTitle': '작품 소개 및 수학적 배경',
    'header.guide': '🧭 가이드',
    'header.guideTitle': '컨트롤러 타일 가이드',
    'header.timerModeStopwatch': '⏱️ 초시계',
    'header.timerModeFree': '♾️ 무제한',
    'header.timerModeTitleStopwatch': '시간 무제한(자유 모드)으로 전환하여 시간 압박 없이 즐기기',
    'header.timerModeTitleFree': '초시계 기록 모드로 전환',
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
    'status.timerFree': '⏱️ OFF',
    'status.timerOff': '⏱️ OFF',
    'status.timerTitleToggle': '클릭하여 시계 켜기/끄기 (⏱️ 00:00.0 ↔ ⏱️ OFF)',
    'status.timerTooltipOn': '시계 켜짐 (클릭하면 끄기)',
    'status.timerTooltipOff': '시계 꺼짐 (클릭하면 켜기)',
    'status.timerTitleOn': '시계 켜짐 (클릭하면 끄기)',
    'status.timerTitleOff': '시계 꺼짐 (클릭하면 켜기)',

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
    'tutorial.step3Sub': '👆 [1수] ~ [5수] 버튼이나 [▶ 한 수씩 보기] 클릭! 💡 [D4 전용 회전 조작]: 한 번 톡 ➔ 90° | 짧게 두 번 톡톡 ➔ 180° (단 1수!) | 길게 누름 ➔ 270° (단 1수!)',
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
    'tutorial.d4Step1Bubble': '11 한 번 톡 ➔ 1행 90° 회전',

    'tutorial.d4Step2Label': '2수',
    'tutorial.d4Step2Badge': '⚡ 2수: 3행 180° 회전',
    'tutorial.d4Step2Text': '3행 1열(31) 짧게 두 번 톡톡 👆👆 ➔ 3행 180° 회전 (R180)',
    'tutorial.d4Step2Desc': '3행 1열을 짧게 두 번 톡톡 치면 3행 전체가 180° 즉시 회전하여 단 1수 만에 0번으로 상쇄!',
    'tutorial.d4Step2Bubble': '31 짧게 두 번 톡톡 👆👆 (180° 단 1수!)',

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
    'about.eduCard3Desc': "단순히 답만 알려주는 것이 아니라, 각 조작 단계마다 '어떤 성분이 어떻게 상쇄되어 항등원으로 수렴하는지' 수학적 해설을 제공하여 논리적 문제 해결 능력을 신장시킵니다.",

    // Formula Guidebook
    'formula.title': '갈루아 큐브 공식 비법서',
    'formula.subtitle': '정이면체군 D₄와 클라인 4원군 V₄를 정복하는 핵심 수학 공식 & 실전 테크닉',
    'formula.close': '닫기',
    'formula.tabAll': '전체',
    'formula.tabBasic': '기초 법칙',
    'formula.tabRotation': '회전 공식',
    'formula.tabReflection': '반사 공식',
    'formula.tabGodTechnique': '신의 수 테크닉',
    'formula.tabAiMined': 'AI 발굴 공식',
    'formula.stepCount': '{current} / {total} 단계',
    'formula.btnPlay': '▶ 단계별 보기',
    'formula.btnPause': '⏸ 일시 정지',
    'formula.btnReset': '↺ 초기화',
    'formula.speed05x': '0.5배속',
    'formula.speed1x': '1.0배속',
    'formula.speed2x': '2.0배속',
    'formula.btnCopy': '📋 공식 복사',
    'formula.copiedToast': '공식이 클립보드에 복사되었습니다!',
    'formula.badgeInteractive': '인터랙티브',
    'formula.badgeConcept': '수학 법칙',
    'formula.noFormulaSelected': '목록에서 공식을 선택해주세요',
    'formula.stepInitial': '초기 상태',
    'formula.stepMove': '{step}수',
    'formula.tipLabel': '💡 실전 꿀팁',
    'formula.mathNotationLabel': '수학적 공식 표기',
    'formula.descriptionLabel': '원리 및 전략 해설',
    'formula.demoSectionTitle': '3×3 보드 인터랙티브 시연',
    'formula.searchPlaceholder': '공식 이름, 번호, 태그, 수순 실시간 검색...',
    'formula.searchEmptyMsg': '검색 결과와 일치하는 공식이 없습니다. 다른 키워드를 입력해 보세요.',
    'formula.searchClearBtn': '검색어 지우기',
    'formula.tagAll': '전체',
    'formula.badgeMoveCount': '{count}수 완성',

    // Items
    'formula.item.selfInverse.title': '자기상쇄의 법칙 (Law of Involution)',
    'formula.item.selfInverse.subtitle': '2번 적용하면 제자리로 돌아오는 위수 2의 대칭 변환',
    'formula.item.selfInverse.desc': '모든 반사 변환(MX, MY, MD, MAD)과 180° 회전(R180)은 위수(Order)가 2입니다. 즉, 동일한 조작을 두 번 연속 수행하면 항등원(ID, 0번)으로 상쇄됩니다. 조작 실수를 했을 때 동일한 연산을 다시 수행하면 즉시 원래대로 복구됩니다.',
    'formula.item.selfInverse.tip': '실수로 1행을 가로 밀기(MX)했다면 당황하지 마세요! 1행을 한 번 더 가로 밀기하면 되돌리기(Undo) 버튼 없이도 원래 상태로 완벽히 복원됩니다.',
    'formula.item.selfInverse.step0': '초기 보드 (정위치 0번 상태)',
    'formula.item.selfInverse.step1': '1행 가로 반사 (MX): 1행 3개 타일이 상하 반전됨',
    'formula.item.selfInverse.step2': '1행 가로 반사 (MX) 재적용: MX ∘ MX = ID로 원래 정위치 복귀!',

    'formula.item.reflectionComp.title': '반사 합성의 법칙 (Reflection Composition Law)',
    'formula.item.reflectionComp.subtitle': '두 거울 반사의 합성은 순수 180° 회전을 생성',
    'formula.item.reflectionComp.desc': '서로 직교하는 두 반사 변환의 합성은 정확히 180° 회전(R180)과 같습니다. 가로 반사(MX) 후 세로 반사(MY)를 거치면 상하/좌우가 모두 뒤집혀 중심 대칭인 180° 회전이 됩니다. 두 거울의 사잇각이 θ일 때 반사의 합성은 2θ 회전이 되는 군론의 핵심 정리입니다.',
    'formula.item.reflectionComp.tip': '회전 탭 조작 없이도 반사(밀기) 조작만으로 180° 회전 타일을 자유자재로 만들어낼 수 있습니다.',
    'formula.item.reflectionComp.step0': '초기 보드 (정위치 0번 상태)',
    'formula.item.reflectionComp.step1': '2행 가로 반사 (MX): 가운데 2행 타일들이 상하 반전됨',
    'formula.item.reflectionComp.step2': '2행 세로 반사 (MY): MX ∘ MY = R180으로 180° 회전 합성 완성!',

    'formula.item.centerInversion.title': '중심 180° 반전 공식 (Center Inversion Technique)',
    'formula.item.centerInversion.subtitle': '교차 라인 합성을 통한 중앙 타일(2행 2열)의 선택적 대칭 반전',
    'formula.item.centerInversion.desc': '3×3 보드의 정중앙 타일(2행 2열, 4번 셀)은 2행과 2열의 교차점입니다. 2행에 가로 반사(MX)를 주고 2열에 세로 반사(MY)를 주면, 중심 타일은 두 연산이 모두 작용하여 MX ∘ MY = R180으로 완벽히 반전되며, 주변 타일의 대칭성을 정밀하게 정돈할 수 있습니다.',
    'formula.item.centerInversion.tip': '외곽 타일들을 건드리지 않고 중앙 타일의 각도만 정렬하고 싶을 때 교차선 합성의 성질을 적극 활용하세요.',
    'formula.item.centerInversion.step0': '초기 상태: 중심 타일(4번)이 180° 반전된 상태',
    'formula.item.centerInversion.step1': '1수: 2행 가로 반사 (MX) 적용',
    'formula.item.centerInversion.step2': '2수: 2열 세로 반사 (MY) 적용 ➔ 중심 타일이 R180 ∘ R180 = ID로 정위치 복원!',

    'formula.item.commutator3Cycle.title': '3-Cycle 순환 교환자 ([A, B] Commutator)',
    'formula.item.commutator3Cycle.subtitle': '루빅스 큐브의 교환자 원리: 원하는 3개 타일만 순환 변환',
    'formula.item.commutator3Cycle.desc': '두 조작 A와 B가 가환(Commutative)하지 않을 때, [A, B] = A ∘ B ∘ A⁻¹ ∘ B⁻¹ 연산은 A와 B가 서로 영향을 미치는 교차 영역의 소수 타일들만 정밀하게 치환(3-Cycle)시키고 나머지 영역은 완벽하게 본래 상태를 보존합니다.',
    'formula.item.commutator3Cycle.tip': '퍼즐 종반부에 단 2~3개의 타일만 어긋나 있을 때, 전체를 흐트러뜨리지 않고 완성하는 최상급자 필수 테크닉입니다.',
    'formula.item.commutator3Cycle.step0': '초기 상태: 교환자 시연 보드',
    'formula.item.commutator3Cycle.step1': '1수: 1행 시계방향 90° 회전 (R90)',
    'formula.item.commutator3Cycle.step2': '2수: 1열 가로 반사 (MX)',
    'formula.item.commutator3Cycle.step3': '3수: 1행 반시계 90° 회전 (R270, R90의 역원)',
    'formula.item.commutator3Cycle.step4': '4수: 1열 가로 반사 (MX, 자기역원) ➔ [R90, MX] 교환자 완성!',

    'formula.item.diagonalCancel.title': '대각선 반사 상쇄 공식 (Diagonal Reflection Cancellation)',
    'formula.item.diagonalCancel.subtitle': '주대각선/반대각선 궤적의 직교성을 활용한 고속 동기화',
    'formula.item.diagonalCancel.desc': '주대각선(MD) 변환은 (i, j) 성분을 (j, i)로 전치(Transpose)시키는 역할을 합니다. 따라서 행 조작과 주대각선 조작을 결합하면 대각선 켤레(Conjugate) 효과에 의해 행 조작이 열 조작으로 자연스럽게 변환되며 상쇄됩니다.',
    'formula.item.diagonalCancel.tip': '대각선 모드가 켜져 있을 때, 복잡한 3~4수 행/열 조작을 대각선 변환 1수로 대폭 단축할 수 있습니다.',
    'formula.item.diagonalCancel.step0': '초기 상태: 대각선 방향(0, 4, 8) 타일이 MD로 뒤섞인 상태',
    'formula.item.diagonalCancel.step1': '1수: 주대각선(MD) 대각 밀기(↘) ➔ MD ∘ MD = ID로 대각선 일괄 정렬!',
    'formula.item.diagonalCancel.step2': '2수: 행/열 잔여 오차 정돈 완성',

    'formula.item.v4Conquest.title': 'V4 4수 정복 공식 (Klein 4-Group 4-Move Conquest)',
    'formula.item.v4Conquest.subtitle': '클라인 4원군 모드 최단 경로 보장 정석 해법',
    'formula.item.v4Conquest.desc': '클라인 4원군(V4)은 모든 원소가 교환 가능(Abelian)하므로, 연산의 순서와 관계없이 각 행과 열에 필요한 변환 성분의 홀짝성을 계산하여 단 4수 이내로 무조건 해결할 수 있습니다.',
    'formula.item.v4Conquest.tip': '각 행/열의 반전 성분을 카운트한 뒤 독립적으로 1회씩 적용하면 최단 경로로 퍼즐이 완성됩니다.',
    'formula.item.v4Conquest.step0': '초기 상태: V4 4수 스크램블 배치',
    'formula.item.v4Conquest.step1': '1수: 3행 180° 회전 (R180 더블탭)',
    'formula.item.v4Conquest.step2': '2수: 3열 세로 반사 (MY 세로밀기)',
    'formula.item.v4Conquest.step3': '3수: 2행 세로 반사 (MY 세로밀기)',
    'formula.item.v4Conquest.step4': '4수: 1행 180° 회전 (R180 더블탭) ➔ 전 타일 0번(ID) 올클리어!',

    'formula.item.masterMethod3Step.title': '3단계 마스터 일반 해법',
    'formula.item.masterMethod3Step.subtitle': '수백 개 공식을 외울 필요 없는 구조적 3단계 마스터 가이드',
    'formula.item.masterMethod3Step.desc': '수백 개의 복잡한 케이스를 외울 필요 없이, [1단계: 외곽 소거] ➔ [2단계: 반사 정리] ➔ [3단계: 피니시 공식] 단 3단계 구조화 해법으로 어떤 스크램블이든 100% 풀어내는 갈루아 큐브의 정석 마스터 해법입니다.',
    'formula.item.masterMethod3Step.tip': '외곽 라인을 먼저 맞춰 흩어진 타일을 좁힌 뒤, 직교 반사(MX, MY) 짝맞춤으로 뒷면 타일을 앞면으로 승화시키고, 남은 고립 타일을 피니시 공식으로 깔끔하게 매듭지으세요.',
    'formula.item.masterMethod3Step.step0': '초기 상태: 외곽 소거, 반사 정리, 피니시 대상이 섞여 있는 스크램블',
    'formula.item.masterMethod3Step.step1': '1단계: 1행 상하 반전 (외곽 1행 소거) ➔ 0, 1번 타일 즉시 ID 소거',
    'formula.item.masterMethod3Step.step2': '2단계: 3열 좌우 반전 (반사 성분 짝맞춤 정리) ➔ 외곽 타일 완벽 정렬 및 피니시 라인 형성',
    'formula.item.masterMethod3Step.step3': '3단계: 2행 180° 회전 (피니시 공식 올클리어) ➔ 전 타일 100% ID 완성!',

    'formula.item.parity90Cycle.title': '90° 회전 패리티 법칙 & 3-Cycle 해법',
    'formula.item.parity90Cycle.subtitle': '각도 불변량 패리티 법칙과 90도 3개 원샷 3-Cycle 해법',
    'formula.item.parity90Cycle.desc': '갈루아 큐브에서 90° 회전 타일은 1개나 2개만 단독으로 존재할 수 없으며(패리티 위반), 반드시 [3개 동시 순환(3-Cycle)] 또는 [90° + 270° 상쇄쌍] 형태로만 존재합니다. 3-Cycle 원샷 조작으로 완벽하게 해결할 수 있습니다.',
    'formula.item.parity90Cycle.tip': '90° 타일이 1~2개만 남은 것처럼 보인다면 다른 타일의 회전(270° 등)이나 반사가 숨어 있습니다. 같은 라인의 90° 타일 3개는 역회전(R270) 단 1수로 동시 해결됩니다.',
    'formula.item.parity90Cycle.step0': '초기 상태: 패리티 법칙 시연 보드',
    'formula.item.parity90Cycle.step1': '1수: 1행 90° 시계 회전 ➔ 1행 3개 타일에 90° 발생 (최소 3개 단위 증명)',
    'formula.item.parity90Cycle.step2': '2수: 3행 270° 회전 ➔ 90° + 270° 상쇄쌍 형성 (전체 각도 불변량 보존)',
    'formula.item.parity90Cycle.step3': '3수: 1행 270° 역회전 ➔ 90° 3개 타일 원샷 3-Cycle 해결 (R90 ∘ R270 = ID)',
    'formula.item.parity90Cycle.step4': '4수: 3행 90° 회전 ➔ 상쇄쌍 잔여 타일 올클리어 완성!',

    'formula.item.parallel180Pair.title': '같은 줄 180° 쌍 상쇄 공식 (Parallel 180° Pair)',
    'formula.item.parallel180Pair.subtitle': '직교 열 반사를 가교 삼아 같은 줄 180° 쌍을 단 3수만에 상쇄',
    'formula.item.parallel180Pair.desc': '한 줄에 180° 회전 타일이 2개 나란히 남았을 때, 직교하는 3열의 임시 반사(MX)를 가교 삼아 1행 R180으로 잔여 쌍을 깔끔하게 0번(정위치)으로 상쇄하는 실전 비법입니다.',
    'formula.item.parallel180Pair.tip': '한 줄에 180° 타일이 2개 고립되었을 때 3열 반사를 활용하면 다른 영역 손상 없이 3수만에 완전 해결됩니다.',
    'formula.item.parallel180Pair.step0': '초기 상태: 1행의 0번, 1번 타일만 180° 회전된 상태',
    'formula.item.parallel180Pair.step1': '1수: 3열 상하 반전 (MX 가로밀기로 교차 기점 확보)',
    'formula.item.parallel180Pair.step2': '2수: 1행 180° 회전 (R180 더블탭으로 0, 1번 타일 즉시 ID 상쇄)',
    'formula.item.parallel180Pair.step3': '3수: 3열 상하 반전 복원 (MX² = ID로 3열 원복, 180° 쌍 소거 완성!)',

    'formula.item.diagonal180Pair.title': '대각선 모서리 180° 쌍 소거 공식 (Diagonal 180° Pair)',
    'formula.item.diagonal180Pair.subtitle': '주대각선 사선 반사와 직교 회전을 결합해 양 끝 모서리 180°를 동시 소거',
    'formula.item.diagonal180Pair.desc': '주대각선의 양 끝 모서리(0번, 8번)에 180° 회전이 쌍으로 남았을 때, 주대각선 사선 반사(MD)와 직교 회전들을 결합하여 두 모서리를 깔끔하게 동시 소거하는 고급 공식입니다.',
    'formula.item.diagonal180Pair.tip': '대각선 옵션이 켜져 있을 때 양 끝 모서리의 180° 쌍을 단 4수 만에 완벽 소거할 수 있습니다.',
    'formula.item.diagonal180Pair.step0': '초기 상태: 주대각선 양 끝 코너(0번, 8번)만 180° 회전된 상태',
    'formula.item.diagonal180Pair.step1': '1수: 주대각선 사선 반사 (MD 사선밀기로 대각 축 켤레 변환 준비)',
    'formula.item.diagonal180Pair.step2': '2수: 1행 180° 회전 (1행 1열 코너 타일 위상 정렬)',
    'formula.item.diagonal180Pair.step3': '3수: 3열 180° 회전 (3행 3열 코너 위상 정렬 및 2번 셀 복구)',
    'formula.item.diagonal180Pair.step4': '4수: 주대각선 사선 반사 복원 (MD² = ID로 모서리 180° 쌍 동시 소거 완성!)',

    'formula.item.finishLShape5.title': '[실전 1위] L자형 5개 에러 2수 피니시',
    'formula.item.finishLShape5.subtitle': '실전 최다 빈출! 직교 2선 교차 5개 에러를 단 2수 만에 올클리어하는 핵심 비법',
    'formula.item.finishLShape5.desc': '실전 게임에서 가장 빈번하게 발생하는 직교 2선 교차 패턴! 교차 코너 타일을 포함한 5개 에러를 [1열 세로밀기] ➔ [1행 가로밀기] 단 2수로 완벽하게 0번(정위치)으로 매듭짓는 실전 최다 빈출 피니시 공식입니다.',
    'formula.item.finishLShape5.tip': '1열의 반사를 먼저 풀어 코너 타일의 위상을 1행과 일치시킨 뒤, 1행을 한 방에 쓸어 담는 것이 핵심입니다.',
    'formula.item.finishLShape5.step0': '초기 상태: 5개 타일이 L자형 에러를 형성한 상태 (0, 1, 2, 3, 6번 셀)',
    'formula.item.finishLShape5.step1': '1수: 1열 좌우 반전 (MY 세로밀기) ➔ 3, 6번 소거 및 코너 0번 위상을 1행(MX)과 일치',
    'formula.item.finishLShape5.step2': '2수: 1행 상하 반전 (MX 가로밀기) ➔ 1행 전체가 MX² = ID로 일괄 소거, 100% 올클리어 완성!',

    'formula.item.finishWingCross4.title': '[실전 2위] 십자 날개 엇갈림 4개 에러 2수 피니시',
    'formula.item.finishWingCross4.subtitle': '중심 자기상쇄 기적을 활용해 상하좌우 4개 십자 날개를 단 2수에 동시 소거',
    'formula.item.finishWingCross4.desc': '중심과 모서리는 모두 맞았는데 상하좌우 십자 날개(1, 3, 5, 7번) 4개 타일만 180° 회전된 고난도 대칭 난제! [2행 더블탭] ➔ [2열 더블탭] 2수로 중심 상쇄(R180² = ID)를 유도해 단 2수 만에 4개 날개를 동시 소거합니다.',
    'formula.item.finishWingCross4.tip': '2행 더블탭 후 2열 더블탭을 적용하세요. 중심 타일이 잠시 뒤집혔다가 다시 정위치로 상쇄되며 4개 날개가 깔끔하게 소거됩니다.',
    'formula.item.finishWingCross4.step0': '초기 상태: 상하좌우 십자 날개 4개(1, 3, 5, 7번 타일)만 180° 회전된 상태',
    'formula.item.finishWingCross4.step1': '1수: 2행 180° 회전 (R180 더블탭) ➔ 좌우 날개(3, 5번) 즉시 복원, 중심은 R180 임시 전이',
    'formula.item.finishWingCross4.step2': '2수: 2열 180° 회전 (R180 더블탭) ➔ 상하 날개(1, 7번) 복원 및 중심 자기상쇄(R180² = ID), 100% 올클리어!',

    'formula.item.finishHybridCancel.title': '[실전 3위] 반사-회전 하이브리드 L자 동시소거 2수 피니시',
    'formula.item.finishHybridCancel.subtitle': '거울 반사와 순수 회전이 뒤섞인 L자 에러를 위상 조화로 단 2수에 동시 해결',
    'formula.item.finishHybridCancel.desc': '한쪽 줄은 뒤집힌 거울 반사(MX)이고 다른 쪽 줄은 머리가 돌아간 회전(R180)인 난감한 하이브리드 혼합 에러! [1열 가로밀기] ➔ [1행 더블탭] 2수로 반사 성분을 먼저 소거하며 교차점 위상을 회전으로 동기화시켜 단 2수로 올클리어합니다.',
    'formula.item.finishHybridCancel.tip': '반사 타일과 회전 타일이 섞여 있을 때, 반사를 먼저 조작하여 교차점을 회전 성분으로 승화시키는 것이 하이브리드 해법의 본질입니다.',
    'formula.item.finishHybridCancel.step0': '초기 상태: 반사(3, 6번)와 회전(1, 2번)이 결합된 하이브리드 L자 에러 배치',
    'formula.item.finishHybridCancel.step1': '1수: 1열 상하 반전 (MX 가로밀기) ➔ 반사 성분 소거 및 교차점(0번)을 순수 회전(R180)으로 정렬',
    'formula.item.finishHybridCancel.step2': '2수: 1행 180° 회전 (R180 더블탭) ➔ 1행 전체가 R180² = ID로 상쇄되며 100% 올클리어 완성!',

    'formula.item.quadCornerFinish.title': '4코너 올킬 3수 파괴 공식 (Quad-Corner Annihilation)',
    'formula.item.quadCornerFinish.subtitle': '대각선 켤레 상쇄를 활용해 4개 모서리 반사와 중심 회전을 단 3수에 일괄 소거',
    'formula.item.quadCornerFinish.desc': '모든 코너(4개)가 거울 반사(MX)되고 중심이 180° 회전된 난공불락의 에러 패턴! [주대각 MAD] ➔ [부대각 MX] ➔ [주대각 R90] 단 3수로 부대각선 코너를 즉시 소거하고 남은 주대각선 타일들을 동일 위상(R270)으로 정렬하여 일괄 완성하는 신의 수 파괴 공식입니다.',
    'formula.item.quadCornerFinish.tip': '모든 코너가 반사되어 있을 때 하나씩 풀지 마세요. 주대각선과 부대각선을 번갈아 조작하여 반대각선을 먼저 날린 뒤 주대각선을 한 번의 회전으로 쓸어 담으세요.',
    'formula.item.quadCornerFinish.step0': '초기 상태: 4개 모서리(0, 2, 6, 8번)가 MX 반사, 중심(4번)이 180° 회전된 상태',
    'formula.item.quadCornerFinish.step1': '1수: 주대각선 부대각 반사 (MAD) ➔ 0, 8번 코너 R270 전이, 중심 4번 MD 변환',
    'formula.item.quadCornerFinish.step2': '2수: 부대각선 상하 반전 (MX) ➔ 2, 6번 코너 MX² = ID 즉시 소거, 주대각선 전체(0, 4, 8) R270 완벽 동기화',
    'formula.item.quadCornerFinish.step3': '3수: 주대각선 90° 회전 (R90) ➔ R270 ∘ R90 = ID 일괄 소거, 전 타일 100% 올클리어 완성!',

    'formula.item.diagonalSpineFlush.title': '사선 척추-외곽 상쇄 3수 공식 (Diagonal Spine-Perimeter Flush)',
    'formula.item.diagonalSpineFlush.subtitle': '사선 척추 반사와 1행 외곽 모서리를 3수로 동시 상쇄하여 올클리어',
    'formula.item.diagonalSpineFlush.desc': '1행 양쪽 모서리의 사선 반사(MAD)와 중앙 척추 라인(2열)의 사선 반사(MD)가 교차 결합된 고난도 기하학적 엇갈림! [1행 MY] ➔ [2열 MD] ➔ [1행 R90] 3수로 척추 라인을 자기상쇄(MD² = ID)시키고 교차점을 회전으로 승화시켜 1행을 단 한 방에 클리어합니다.',
    'formula.item.diagonalSpineFlush.tip': '사선 반사와 축 반사가 얽혀 있을 때, 척추 라인의 대칭 상쇄(MD² = ID)를 유도하여 남은 에러를 1행으로 결집시키는 것이 비법의 핵심입니다.',
    'formula.item.diagonalSpineFlush.step0': '초기 상태: 1행 모서리(0, 2번)가 MAD, 척추(4, 7번)가 MD인 사선 교차 상태',
    'formula.item.diagonalSpineFlush.step1': '1수: 1행 좌우 반전 (MY 세로밀기) ➔ 모서리 0, 2번 R270 전이, 교차점 1번 MY 상태',
    'formula.item.diagonalSpineFlush.step2': '2수: 2열 주대각 반사 (MD) ➔ 척추 라인 4, 7번 MD² = ID 즉시 소거, 1행 전체(0, 1, 2) R270 동기화',
    'formula.item.diagonalSpineFlush.step3': '3수: 1행 90° 회전 (R90) ➔ 1행 전체 R270 ∘ R90 = ID 일괄 소거, 100% 올클리어 완성!',

    'formula.item.d4DiamondCross3.title': 'D4 다이아몬드 십자 3수 폭파',
    'formula.item.d4DiamondCross3.subtitle': '중심과 상하좌우 십자 날개의 위상을 단일 R270으로 동기화하여 3수에 일괄 폭파',
    'formula.item.d4DiamondCross3.desc': '상하좌우 날개와 중심이 십자 형태로 뒤틀린 난제를 [2행 R90] ➔ [2열 MX] ➔ [2행 R90] 단 3수로 중심 및 날개 위상을 동기화하여 시원하게 폭파 올클리어하는 D4 핵심 마스터 공식입니다.',
    'formula.item.d4DiamondCross3.tip': '2행 회전으로 좌우 날개를 R270으로 전환한 뒤, 2열 상하 반전(MX)으로 상하 날개를 복구하며 중심을 R270으로 합성시킵니다. 마지막 2행 R90으로 남아있던 2행 전체를 한 방에 폭파합니다.',
    'formula.item.d4DiamondCross3.step0': '초기 상태: 상하 날개(1, 7번: MX), 좌우 날개(3, 5번: R180), 중심(4번: MX)의 다이아몬드 십자 형태',
    'formula.item.d4DiamondCross3.step1': '1수: 2행 90° 시계 회전 (R90) ➔ 좌우 날개(3, 5번) R270 변환, 중심 4번 MD 합성',
    'formula.item.d4DiamondCross3.step2': '2수: 2열 상하 반전 (MX 가로밀기) ➔ 상하 날개(1, 7번) MX² = ID 즉시 복구, 중심 4번 R270 합성 완료',
    'formula.item.d4DiamondCross3.step3': '3수: 2행 90° 시계 회전 (R90 피니시) ➔ 2행 전체 R270 ∘ R90 = ID 일괄 자기상쇄, 100% 올클리어 완성!',

    'formula.item.d4LDiagCombo3.title': 'D4 ㄱ자 사선연계 3수 올킬',
    'formula.item.d4LDiagCombo3.subtitle': '사선 대칭과 직교 회전의 비가환성을 결합해 외곽 ㄱ자 5개 에러를 단 3수에 올킬',
    'formula.item.d4LDiagCombo3.desc': '1행과 3열이 만나는 ㄱ자 형태의 5개 에러를 [1행 R90] ➔ [3열 MD] ➔ [1행 R90] 단 3수로 사선 대칭과 회전의 비가환성을 이용해 1행으로 위상을 집중시켜 한 방에 올킬하는 실전 공식입니다.',
    'formula.item.d4LDiagCombo3.tip': '1행을 먼저 회전시켜 코너 위상을 반사(MY)로 유도한 뒤, 3열 사선 반사(MD)로 3열을 즉시 소거하고 1행 전체를 R270으로 동기화합니다. 마지막 1행 R90으로 한 번에 올킬합니다.',
    'formula.item.d4LDiagCombo3.step0': '초기 상태: 1행(0, 1번: R180)과 3열(2, 5, 8번: MD)이 만나는 ㄱ자형 에러 배치',
    'formula.item.d4LDiagCombo3.step1': '1수: 1행 90° 시계 회전 (R90) ➔ 0, 1번 타일 R270 전이, 코너 2번 타일 MY 변환',
    'formula.item.d4LDiagCombo3.step2': '2수: 3열 사선 반사 (MD 사선밀기) ➔ 5, 8번 타일 MD² = ID 즉시 복구, 코너 2번 타일 R270 합성',
    'formula.item.d4LDiagCombo3.step3': '3수: 1행 90° 시계 회전 (R90 피니시) ➔ 1행 전체 R270 ∘ R90 = ID 일괄 소거, 100% 올클리어 완성!',

    'formula.item.d4XCross3.title': 'D4 X-크로스 모서리동시 3수 폭파',
    'formula.item.d4XCross3.subtitle': '4개 모서리 에러를 상하 라인으로 분리 정렬하여 3수 만에 모서리를 동시 폭파',
    'formula.item.d4XCross3.desc': '4개 모서리(0, 2, 6, 8번)와 중심(4번)이 X자 형태로 얽힌 대칭 난제를 [2열 R270] ➔ [3행 R90] ➔ [1행 R90] 3수로 중심을 먼저 맞추며 상하 라인을 동기화한 뒤 연속 폭파하는 궁극의 모서리 피니시입니다.',
    'formula.item.d4XCross3.tip': '2열 반시계 회전(R270)으로 중심 타일을 자기상쇄(R90 ∘ R270 = ID)시키는 동시에 모서리들을 1행과 3행의 R270 라인으로 정렬합니다. 이후 3행과 1행을 차례로 R90 회전하여 올클리어합니다.',
    'formula.item.d4XCross3.step0': '초기 상태: 4개 모서리(0, 2, 6, 8번: R270)와 중심(4번: R90)이 뒤틀린 X-크로스 패턴',
    'formula.item.d4XCross3.step1': '1수: 2열 90° 반시계 회전 (R270) ➔ 중심 4번 ID 즉시 복구, 1행과 3행이 각각 완전한 R270 라인으로 정렬',
    'formula.item.d4XCross3.step2': '2수: 3행 90° 시계 회전 (R90) ➔ 3행 전체(6, 7, 8번) R270 ∘ R90 = ID 일괄 소거',
    'formula.item.d4XCross3.step3': '3수: 1행 90° 시계 회전 (R90 피니시) ➔ 1행 전체(0, 1, 2번) R270 ∘ R90 = ID 일괄 소거, 100% 올클리어 완성!',

    'formula.item.d4DoubleCross4.title': 'D4 가로/세로 십자 교차 이중 꼬임 4수 폭파',
    'formula.item.d4DoubleCross4.subtitle': '직교 반사 합성(MX ∘ MY = R180)과 중심 자기상쇄로 4수에 외곽 3중 폭파 피니시',
    'formula.item.d4DoubleCross4.desc': '중심 십자축이 직교 반사로 뒤틀리고 코너가 180° 반전된 거리 4 병목을 [2행 MX] ➔ [2열 MY] ➔ [1행 R180] ➔ [1열 R180] 4수로 중심 소거 후 1열 3중 동시 폭파로 완성하는 D4 마스터 공식입니다.',
    'formula.item.d4DoubleCross4.tip': '2행 MX로 중심을 MY로 전환하고, 2열 MY로 중심을 완전 복원한 뒤, 잔여 에러를 1열로 몰아넣어 3개 타일을 한 번에 폭파합니다.',
    'formula.item.d4DoubleCross4.step0': '초기 상태: 중심 십자축(1, 3, 5, 7번)이 직교 반사로 꼬이고 코너가 R180인 거리 4 병목',
    'formula.item.d4DoubleCross4.step1': '1수: 2행 상하 반전 (MX 가로밀기) ➔ 5번 타일 MX² = ID 즉시 소거, 중심 4번 MY 전환',
    'formula.item.d4DoubleCross4.step2': '2수: 2열 좌우 반전 (MY 세로밀기) ➔ 7번 타일 소거, 중심 4번 MY² = ID 완전 복원',
    'formula.item.d4DoubleCross4.step3': '3수: 1행 180° 반전 (R180) ➔ 1, 2번 타일 동시 소거, 잔여 에러 1열로 결집',
    'formula.item.d4DoubleCross4.step4': '4수: 1열 180° 반전 (R180 피니시) ➔ 1열 3개 타일(0, 3, 6번) 3중 동시 폭파, 100% 올클리어 완성!',

    'formula.item.d4SpiralVortex4.title': 'D4 4방향 소용돌이 위상차 4수 올킬',
    'formula.item.d4SpiralVortex4.subtitle': '4변 둘레길 순환 90° 펄스로 2회 경유 코너와 1회 경유 변을 차례로 소거하며 올킬',
    'formula.item.d4SpiralVortex4.desc': '외곽 8개 타일이 모서리 R180, 변 R270으로 소용돌이치는 병목을 [1행 R90] ➔ [3열 R90] ➔ [3행 R90] ➔ [1열 R90] 4변 둘레길 순환 펄스로 2회 경유 코너와 1회 경유 변을 차례로 소거하며 올킬하는 마스터 공식입니다.',
    'formula.item.d4SpiralVortex4.tip': '시계 방향 둘레길을 따라 90° 회전을 연속 적용하면 2수와 3수에서 더블 킬이 터지고, 마지막 4수에서 3개 타일이 일제히 소거됩니다.',
    'formula.item.d4SpiralVortex4.step0': '초기 상태: 외곽 8개 타일이 코너 R180, 변 R270으로 얽힌 소용돌이 병목',
    'formula.item.d4SpiralVortex4.step1': '1수: 1행 90° 시계 회전 (R90) ➔ 1번 변 타일 즉시 소거, 상단 코너 R270 전이',
    'formula.item.d4SpiralVortex4.step2': '2수: 3열 90° 시계 회전 (R90 더블 킬) ➔ 2번 코너와 5번 변 동시 소거',
    'formula.item.d4SpiralVortex4.step3': '3수: 3행 90° 시계 회전 (R90 더블 킬) ➔ 8번 코너와 7번 변 동시 소거, 1열 R270 정렬',
    'formula.item.d4SpiralVortex4.step4': '4수: 1열 90° 시계 회전 (R90 피니시) ➔ 1열 3개 타일(0, 3, 6번) 3중 동시 폭파, 100% 올클리어 완성!',

    'formula.item.d4DualDiagonalBlitz4.title': 'D4 양대각선(↖, ↗) 대칭 교차 4수 동시 폭파',
    'formula.item.d4DualDiagonalBlitz4.subtitle': '양대각선 반사(MD ∘ MAD = R180)로 중심 소거 및 상하 층별 분할 후 2연속 트리플 킬',
    'formula.item.d4DualDiagonalBlitz4.desc': '양대각선 축에 거울 반사가 걸려있고 상하 층별 위상이 어긋난 거리 4 병목을 [주대각 MD] ➔ [부대각 MAD] ➔ [1행 R90] ➔ [3행 R270] 4수로 중심 소거 및 상하 층별 분할 후 2연속 트리플 킬로 산산조각 내는 마스터 공식입니다.',
    'formula.item.d4DualDiagonalBlitz4.tip': '주대각선 MD로 대각선 타일을 회전 좌표계로 바꾸고, 부대각선 MAD로 중심을 맞추며 상단(R270)과 하단(R90)으로 분리한 뒤 각각 90° 역회전으로 폭파합니다.',
    'formula.item.d4DualDiagonalBlitz4.step0': '초기 상태: 양대각선 거울 반사와 상하 회전 위상차가 결합된 거리 4 병목',
    'formula.item.d4DualDiagonalBlitz4.step1': '1수: 주대각선(↖) 사선 반사 (MD) ➔ 대각 타일 회전계 전환, 중심 MAD 유도',
    'formula.item.d4DualDiagonalBlitz4.step2': '2수: 부대각선(↗) 역대각 반사 (MAD) ➔ 중심 MAD² = ID 소거, 상단 R270/하단 R90 분할',
    'formula.item.d4DualDiagonalBlitz4.step3': '3수: 1행 90° 시계 회전 (R90 트리플 킬) ➔ 1행 3개 타일 R270 ∘ R90 = ID 동시 소거',
    'formula.item.d4DualDiagonalBlitz4.step4': '4수: 3행 90° 반시계 회전 (R270 피니시) ➔ 3행 3개 타일 R90 ∘ R270 = ID 동시 소거, 100% 올클리어 완성!',

    // 실전 보드 연습 모드
    'formula.btnPracticeOnBoard': '🚀 이 공식 직접 풀어보기',
    'practice.badgeTitle': '[🎯 연습 모드: {title}]',
    'practice.targetMoves': '목표: {moves}수',
    'practice.perfectTitle': '🏆 마스터 공식 완벽 마스터!',
    'practice.perfectDesc': '{title} ({moves}수 정타 성공!)',
    'practice.shortcutTitle': '⚡ 놀라운 지름길 발견!',
    'practice.shortcutDesc': '목표 {target}수보다 빠른 {moves}수 만에 완성!',
    'practice.clearedTitle': '🎉 클리어 성공!',
    'practice.clearedDesc': '목표는 {target}수였으나 {moves}수가 소요되었습니다.',
    'practice.retry': '↺ 다시 연습하기',
    'practice.exit': '일반 게임으로 복귀',
    'practice.exitBtnTitle': '연습 종료',

    // D4 신규 마스터 공식 (Round 4)
    'formula.item.d4CheckerboardSuper4.title': 'D4 체커보드(X자/십자) 위상차 4수 슈퍼 소거',
    'formula.item.d4CheckerboardSuper4.subtitle': '양대각선 180° 반전으로 모서리를 잡고 2행/2열 연속 회전으로 체커보드 완전 소거',
    'formula.item.d4CheckerboardSuper4.desc': 'X자 타일 5개(R180)와 십자 타일 4개(R270)의 체커보드 위상차를 [주대각선 R180] ➔ [부대각선 R180] ➔ [2행 R90] ➔ [2열 R90] 4수로 양대각 소거 후 2열 트리플 킬로 마무리하는 D4 마스터 공식입니다.',
    'formula.item.d4CheckerboardSuper4.tip': '주대각선과 부대각선의 180° 반전으로 4개 모서리(0, 2, 6, 8)와 중심을 즉시 해결한 뒤, 2행과 2열의 연속 R90 회전으로 십자 타일들을 차례로 더블 킬, 트리플 킬합니다.',
    'formula.item.d4CheckerboardSuper4.step0': '초기 상태: X자 대각 5개 타일(R180)과 십자 4개 타일(R270)의 체커보드 위상차 배치',
    'formula.item.d4CheckerboardSuper4.step1': '1수: 주대각선(↖) 180° 점대칭 반전 (R180) ➔ 0, 4, 8번 타일 동시 소거 (트리플 킬)',
    'formula.item.d4CheckerboardSuper4.step2': '2수: 부대각선(↗) 180° 점대칭 반전 (R180) ➔ 2번, 6번 코너 즉시 소거 (더블 킬), 4개 모서리 정복',
    'formula.item.d4CheckerboardSuper4.step3': '3수: 2행 90° 시계 회전 (R90) ➔ 3번, 5번 변 타일 소거 (더블 킬), 잔여 비틀림 2열 집결',
    'formula.item.d4CheckerboardSuper4.step4': '4수: 2열 90° 시계 회전 (R90 피니시) ➔ 2열 3개 타일(1, 4, 7번) 일제 소거 (트리플 킬 폭파!), 100% 올클리어 완성!',

    'formula.item.d4TSpineFlush3.title': 'D4 T자형(1행+2열) 척추 정렬 3수 폭파',
    'formula.item.d4TSpineFlush3.subtitle': '1행 위상 결합 후 2열 척추 반사와 1행 트리플 킬로 국소 T자형 병목 3수 완파',
    'formula.item.d4TSpineFlush3.desc': '1행(0, 1, 2)과 2열 척추(4, 7)만 뒤틀린 국소 T자형 배치를 [1행 R90] ➔ [2열 MX] ➔ [1행 R90] 단 3수로 척추 소거 및 1행 트리플 킬로 끝내는 D4 고속 마스터 공식입니다.',
    'formula.item.d4TSpineFlush3.tip': '1행 R90 회전으로 1번 타일을 MD로 치환한 뒤, 2열 MX 반사로 척추(4, 7) 소거와 동시에 1행 전체를 R270으로 동기화하여 마지막 1행 R90으로 폭파합니다.',
    'formula.item.d4TSpineFlush3.step0': '초기 상태: 외곽 4타일은 보존되고 1행과 2열 척추만 뒤틀린 T자형 병목 배치',
    'formula.item.d4TSpineFlush3.step1': '1수: 1행 90° 시계 회전 (R90) ➔ 위상 결합 유도 (MX ∘ R90 = MD)',
    'formula.item.d4TSpineFlush3.step2': '2수: 2열 상하 가로 반사 (MX) ➔ 4번, 7번 척추 소거 (더블 킬), 1번 타일 R270 동기화',
    'formula.item.d4TSpineFlush3.step3': '3수: 1행 90° 시계 회전 (R90 피니시) ➔ 1행 전체(0, 1, 2번) R270 ∘ R90 = ID 전멸 (트리플 킬 폭파!), 3수 종결 올클리어!',

    'formula.item.d4ChiralPinwheel4.title': 'D4 4방향 바람개비형 회전-반사 복합체 4수 올킬',
    'formula.item.d4ChiralPinwheel4.subtitle': '회전과 반사가 교차하는 4방향 둘레길 순환으로 카이랄 바람개비 복합체 완전 정복',
    'formula.item.d4ChiralPinwheel4.desc': '상하 변(R270), 좌우 변(MX), 4대각 코너가 카이랄 바람개비 위상으로 얽힌 난제를 [1행 R90] ➔ [3열 MX] ➔ [3행 R90] ➔ [1열 MX] 4변 둘레길 교차 순환으로 올킬하는 D4 궁극 마스터 공식입니다.',
    'formula.item.d4ChiralPinwheel4.tip': '회전과 반사가 교차하는 4방향 둘레길을 순환하며 1수 원샷 소거, 2수 더블 킬, 3수 더블 킬, 4수 1열 트리플 킬로 마무리됩니다.',
    'formula.item.d4ChiralPinwheel4.step0': '초기 상태: 중심(4) ID 고정, 변과 코너가 직교 회전-반사로 교차된 4방향 바람개비',
    'formula.item.d4ChiralPinwheel4.step1': '1수: 1행 90° 시계 회전 (R90) ➔ 1번 변 타일 R270 ∘ R90 = ID 원샷 소거, 코너 MX 치환',
    'formula.item.d4ChiralPinwheel4.step2': '2수: 3열 상하 가로 반사 (MX) ➔ 2번 코너, 5번 변 동시 소거 (더블 킬)',
    'formula.item.d4ChiralPinwheel4.step3': '3수: 3행 90° 시계 회전 (R90) ➔ 7번 변, 8번 코너 동시 소거 (더블 킬), 1열 MX 집결',
    'formula.item.d4ChiralPinwheel4.step4': '4수: 1열 상하 가로 반사 (MX 피니시) ➔ 1열 전체(0, 3, 6번) MX ∘ MX = ID 트리플 킬 폭파!, 100% 올클리어 완성!',


    // Round 5 신규 D4 마스터 공식 3선 (ko)
    'formula.item.d4CornerRingBlitz4.title': '4대 코너 링 블리츠 (0·2·6·8 외곽 순환 4수 소거)',
    'formula.item.d4CornerRingBlitz4.subtitle': '외곽 둘레길 4개 라인의 시계방향 90° 순환 펄스로 외곽 8개 타일 완전 정복',
    'formula.item.d4CornerRingBlitz4.desc': '중앙 타일(4번)은 완전한 ID를 유지하고 외곽 8개 타일이 R180/R270 위상차로 갇힌 외곽 링 병목을 [1행 R90] ➔ [3열 R90] ➔ [3행 R90] ➔ [1열 R90] 4변 둘레길 순환으로 연속 더블 킬 및 트리플 킬로 제압하는 D4 마스터 공식입니다.',
    'formula.item.d4CornerRingBlitz4.tip': '1행 ➔ 3열 ➔ 3행 ➔ 1열의 시계방향 둘레길을 순환하며 더블 킬 2회 및 트리플 킬 1회를 연속 폭파하여 올클리어를 달성합니다.',
    'formula.item.d4CornerRingBlitz4.step0': '초기 상태: 중앙 타일(4) 보존, 외곽 8개 둘레길 타일이 R180/R270 위상차로 포위된 링 병목',
    'formula.item.d4CornerRingBlitz4.step1': '1수: 1행 90° 시계 회전 (R90) ➔ 1번 변 타일 R270 ∘ R90 = ID 원샷 소거, 상단 코너 R270 치환',
    'formula.item.d4CornerRingBlitz4.step2': '2수: 3열 90° 시계 회전 (R90 더블 킬) ➔ 2번 코너, 5번 변 동시 소거 (더블 킬!)',
    'formula.item.d4CornerRingBlitz4.step3': '3수: 3행 90° 시계 회전 (R90 더블 킬) ➔ 7번 변, 8번 코너 동시 소거 (더블 킬!), 1열 R270 집결',
    'formula.item.d4CornerRingBlitz4.step4': '4수: 1열 90° 시계 회전 (R90 트리플 킬 피니시) ➔ 0번, 3번, 6번 3개 타일 일제 소거 (트리플 킬 폭파!), 100% All Clear!',

    'formula.item.d4CrossInversion3.title': '십자 변·중심 위상 도치 3수 킬 (Cross Inversion)',
    'formula.item.d4CrossInversion3.subtitle': '4대 코너를 건드리지 않고 십자 5개 타일만 직교 샌드위치로 3수 번개 소거',
    'formula.item.d4CrossInversion3.desc': '외곽 4대 코너는 완벽한 ID를 유지한 채, 십자 5개 타일(1, 3, 4, 5, 7)만 MX 반사 및 R180 회전으로 도치된 순수 십자 패턴을 [2행 R90] ➔ [2열 MX] ➔ [2행 R90] 단 3수로 더블 킬 및 트리플 킬 종결하는 마스터 공식입니다.',
    'formula.item.d4CrossInversion3.tip': '코너 4개는 보존한 채 2행(R90) ➔ 2열(MX) ➔ 2행(R90)의 직교 샌드위치 구조로 3수 최단 올킬을 달성합니다.',
    'formula.item.d4CrossInversion3.step0': '초기 상태: 외곽 4대 코너 100% 보존, 십자 5개 타일만 MX/R180으로 도치된 순수 십자 병목',
    'formula.item.d4CrossInversion3.step1': '1수: 2행 90° 시계 회전 (R90) ➔ 수평 위상차를 수직 축과의 교차 반사 상쇄 레버리지 상태로 전환',
    'formula.item.d4CrossInversion3.step2': '2수: 2열 상하 가로 반사 (MX 더블 킬) ➔ 상단 1번 및 하단 7번 십자 타일 동시 소거 (더블 킬!)',
    'formula.item.d4CrossInversion3.step3': '3수: 2행 90° 시계 회전 (R90 트리플 킬 피니시) ➔ 3번, 4번, 5번 중심행 타일 일제 소거 (트리플 킬 폭파!), 100% All Clear!',

    'formula.item.d4DiagonalWindmill4.title': '대각선·직교 풍차형 위상차 4수 올킬 (Diagonal Windmill)',
    'formula.item.d4DiagonalWindmill4.subtitle': '대각선과 직교 라인의 교차 순환으로 3연속 더블 킬 및 2행 트리플 킬 4수 제압',
    'formula.item.d4DiagonalWindmill4.desc': '주대각선 반사(MD), 수평 가로 반사(MX), 회전 위상이 9개 타일 전체에 걸쳐 대각-직교 풍차 구조를 형성한 고난도 배치를 [주대각 R90] ➔ [2열 R90] ➔ [부대각 R90] ➔ [2행 MX] 4수로 연속 3회 더블 킬 및 중심행 트리플 킬로 분쇄하는 마스터 공식입니다.',
    'formula.item.d4DiagonalWindmill4.tip': '대각선과 직교 라인을 번갈아 조작(주대각 ➔ 2열 ➔ 부대각 ➔ 2행)하여 3연속 더블 킬 후 2행 트리플 킬로 올킬합니다.',
    'formula.item.d4DiagonalWindmill4.step0': '초기 상태: 전 9개 타일에 걸쳐 주대각선 반사, 수평 반사, 회전 위상이 결합된 풍차형 배치',
    'formula.item.d4DiagonalWindmill4.step1': '1수: 주대각선(↖) 90° 시계 회전 (R90 더블 킬) ➔ 0번 및 8번 대각 코너 타일 동시 소거 (더블 킬!)',
    'formula.item.d4DiagonalWindmill4.step2': '2수: 2열 90° 시계 회전 (R90 더블 킬) ➔ 1번 및 7번 수직 십자 변 타일 동시 소거 (더블 킬!)',
    'formula.item.d4DiagonalWindmill4.step3': '3수: 부대각선(↗) 90° 시계 회전 (R90 더블 킬) ➔ 2번 및 6번 반대편 대각 코너 타일 동시 소거 (더블 킬!), 2행 MX 집결',
    'formula.item.d4DiagonalWindmill4.step4': '4수: 2행 상하 가로 반사 (MX 트리플 킬 피니시) ➔ 3번, 4번, 5번 중심행 타일 일제 소거 (트리플 킬 폭파!), 100% All Clear!',

    // Round 6 신규 D4 마스터 공식 3선 (ko)
    'formula.item.d4TwinColumnFlux4.title': '쌍둥이 열 대칭 플럭스 4수 슈퍼 소거',
    'formula.item.d4TwinColumnFlux4.subtitle': '1열과 3열의 대칭 위상차를 2행 직교 연계로 4수 만에 분쇄하는 플럭스 마스터 공식',
    'formula.item.d4TwinColumnFlux4.desc': '중앙 2열은 완전한 정위치(ID)를 유지한 채, 1열(R270)과 3열(MX/MY)이 쌍둥이로 뒤틀린 6개 에러 패턴을 [1열 R90] ➔ [2행 R90] ➔ [3열 MX] ➔ [2행 R270] 4수로 2행을 매개로 양 열을 분리 정복하는 D4 마스터 공식입니다.',
    'formula.item.d4TwinColumnFlux4.tip': '1열과 3열의 위상차는 2행을 교량으로 삼아 회전-반사 켤레를 적용하면 중앙 2열을 전혀 흩트리지 않고 단 4수 만에 양쪽 열을 모두 소거할 수 있습니다.',
    'formula.item.d4TwinColumnFlux4.step0': '초기 상태: 2열은 전원 ID, 1열(R270)과 3열(MX/MY)이 대칭 뒤틀림 상태인 6개 에러',
    'formula.item.d4TwinColumnFlux4.step1': '1수: 1열 R90 ➔ 1열 3개 타일(0, 3, 6) 일제 소거 (트리플 킬 폭파)',
    'formula.item.d4TwinColumnFlux4.step2': '2수: 2행 R90 ➔ 2행 임시 비틀림으로 3열 5번 셀의 반사 위상 켤레 준비',
    'formula.item.d4TwinColumnFlux4.step3': '3수: 3열 MX ➔ 3열 3개 타일(2, 5, 8) 일제 소거 (트리플 킬 폭파), 2행 순수 R90 동기화',
    'formula.item.d4TwinColumnFlux4.step4': '4수: 2행 R270 ➔ 2행 3개 타일(3, 4, 5) 역회전 상쇄 복원 (트리플 킬 피니시), 100% 올클리어!',

    'formula.item.d4HBracketSmash3.title': 'H-브래킷 위상 도치 3수 킬',
    'formula.item.d4HBracketSmash3.subtitle': '상하 변(1, 7)을 제외한 H자 7개 에러 타일을 단 3수의 R90 연타로 종결하는 마스터 공식',
    'formula.item.d4HBracketSmash3.desc': '1열, 3열, 그리고 중앙 4번 셀이 H자 형태로 뒤틀리고 상하 변(1, 7번)만 ID로 보존된 고밀도 7개 에러 난제를 [1열 R90] ➔ [2행 R90] ➔ [3열 R90] 단 3수 만에 더블 킬 2회 및 3열 트리플 킬로 일격 분쇄하는 D4 마스터 공식입니다.',
    'formula.item.d4HBracketSmash3.tip': '1열 ➔ 2행 ➔ 3열로 이어지는 3연속 R90 회전 스위프는 1, 7번 타일을 전혀 건드리지 않고 H자 전체를 깔끔하게 지워냅니다.',
    'formula.item.d4HBracketSmash3.step0': '초기 상태: 상하 변(1, 7)은 보존되고 1열·3열·중심이 뒤틀린 H자 7개 에러',
    'formula.item.d4HBracketSmash3.step1': '1수: 1열 R90 ➔ 0번과 6번 코너 타일 소거 (더블 킬 폭파)',
    'formula.item.d4HBracketSmash3.step2': '2수: 2행 R90 ➔ 3번과 4번 셀 소거 (더블 킬), 3열 전체가 순수 R270 단일 위상으로 동기화',
    'formula.item.d4HBracketSmash3.step3': '3수: 3열 R90 ➔ 3열 3개 타일(2, 5, 8) 일제 소거 (트리플 킬 피니시), 100% 올클리어!',

    'formula.item.d4StarBurstVortex4.title': '8방향 별빛 소용돌이 4수 올킬',
    'formula.item.d4StarBurstVortex4.subtitle': '양대각선 회전 후 중심 십자 직교 스위프로 외곽 8개 에러를 완전 소멸시키는 4수 올킬',
    'formula.item.d4StarBurstVortex4.desc': '중심(4번)은 정위치이고 외곽 8개 타일(모서리 R270, 변 R90)이 대칭 소용돌이로 얽힌 난제를 [주대각 R90] ➔ [부대각 R90] ➔ [2행 R270] ➔ [2열 R270] 4수로 대각선에서 4개 코너를 먼저 깬 뒤 중심 십자를 쓸어 담는 D4 마스터 공식입니다.',
    'formula.item.d4StarBurstVortex4.tip': '양대각선(주대각/부대각) R90으로 4대 코너(0, 2, 6, 8)를 완전히 소거한 뒤, 남은 중심 십자(1, 3, 4, 5, 7)를 2행과 2열의 연속 R270으로 한 번에 종결합니다.',
    'formula.item.d4StarBurstVortex4.step0': '초기 상태: 중심 4번은 ID, 외곽 8개 타일(모서리 R270, 변 R90)이 소용돌이치는 8개 에러',
    'formula.item.d4StarBurstVortex4.step1': '1수: 주대각선(↖) R90 ➔ 0번과 8번 코너 타일 소거 (더블 킬 폭파)',
    'formula.item.d4StarBurstVortex4.step2': '2수: 부대각선(↗) R90 ➔ 2번과 6번 코너 타일 소거 (더블 킬), 4대 코너 완전 정복',
    'formula.item.d4StarBurstVortex4.step3': '3수: 2행 R270 ➔ 3번과 5번 변 타일 소거 (더블 킬), 2열 척추가 R90 단일 위상으로 정렬',
    'formula.item.d4StarBurstVortex4.step4': '4수: 2열 R270 ➔ 2열 3개 타일(1, 4, 7) 일제 소거 (트리플 킬 피니시), 100% 올클리어!',



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
