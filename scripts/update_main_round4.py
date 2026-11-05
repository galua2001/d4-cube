# -*- coding: utf-8 -*-
"""
main.ts 에 실전 보드 연습 모드(Practice Mode) 아키텍처 및 victoryManager 연동 탑재
"""
import sys

target_path = r'C:\Users\user\matrix-cube\src\main.ts'

with open(target_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. FormulaItem, getFormulaById, formulaModalController 임포트 확인 및 추가
import_formula_target = "import { showFormulaModal } from './ui/formulaModal';"
import_formula_replacement = "import { showFormulaModal, formulaModalController } from './ui/formulaModal';\nimport { FormulaItem, getFormulaById } from './data/formulas';"

if import_formula_target in content:
    content = content.replace(import_formula_target, import_formula_replacement, 1)

# 2. PracticeSession 인터페이스 및 currentPractice 속성 추가
practice_session_code = '''
export interface PracticeSession {
  formulaId: string;
  title: string;
  targetMoves: number;
  initialOps: D4Op[];
}
'''

if 'export interface PracticeSession' not in content:
    content = content.replace('class MatrixCubeApp {', practice_session_code + '\nclass MatrixCubeApp {\n  private currentPractice: PracticeSession | null = null;', 1)

# 3. 레이아웃에 practice-mode-banner-container 추가
status_bar_end = '      </div>\n\n      <div class="board-container">'
status_bar_with_practice = '      </div>\n\n      <!-- 실전 연습 모드 상단 배너 컨테이너 -->\n      <div id="practice-mode-banner-container"></div>\n\n      <div class="board-container">'

if status_bar_end in content:
    content = content.replace(status_bar_end, status_bar_with_practice, 1)

# 4. renderLayout 끝부분이나 bindControls에 formulaModalController 콜백 바인딩
bind_modal_target = "document.getElementById('btn-header-formula')?.addEventListener('click', () => {\n      soundEngine.playTap();\n      showFormulaModal();\n    });"
bind_modal_replacement = """// 공식 비법서 모달 버튼 및 실전 연습 콜백 연동
    formulaModalController.setPracticeCallback((formula) => {
      this.startPracticeMode(formula);
    });

    document.getElementById('btn-header-formula')?.addEventListener('click', () => {
      soundEngine.playTap();
      showFormulaModal();
    });"""

if bind_modal_target in content:
    content = content.replace(bind_modal_target, bind_modal_replacement, 1)

# 5. renderLayout 내에서 renderPracticeBadge 호출 추가
render_layout_end = "this.rebuildBoardDOM();\n  }"
render_layout_end_replacement = "this.rebuildBoardDOM();\n    this.renderPracticeBadge();\n  }"

if render_layout_end in content:
    content = content.replace(render_layout_end, render_layout_end_replacement, 1)

# 6. checkWinCondition 에 currentPractice 분기 로직 탑재
win_condition_marker = "    const isWin = this.currentOps.every(op => op === D4.ID);\n    if (isWin) {"
win_condition_replacement = """    const isWin = this.currentOps.every(op => op === D4.ID);
    if (isWin) {
      if (this.currentPractice) {
        // 1. 연습 모드 승리 처리
        this.isGameStarted = false;
        recordManager.stopTimer();
        this.updateTimerDisplay();
        soundEngine.playWin();

        const total = this.boardSize * this.boardSize;
        for (let i = 0; i < total; i++) {
          const box = this.boardGrid.children[i] as HTMLElement;
          if (box) {
            setTimeout(() => {
              box.classList.add('celebrate-tile');
            }, i * 40);
          }
        }

        const { title, targetMoves, formulaId } = this.currentPractice;
        const moves = this.movesCount;
        const curFormula = getFormulaById(formulaId);

        if (moves === targetMoves) {
          victoryManager.showSpecialPracticeVictory({
            title: t('practice.perfectTitle'),
            subtitle: t('practice.perfectDesc', { title, moves }),
            isPerfect: true,
            onRetry: () => curFormula && this.startPracticeMode(curFormula),
            onExit: () => this.endPracticeMode()
          });
        } else if (moves < targetMoves) {
          victoryManager.showSpecialPracticeVictory({
            title: t('practice.shortcutTitle'),
            subtitle: t('practice.shortcutDesc', { target: targetMoves, moves }),
            isPerfect: true,
            onRetry: () => curFormula && this.startPracticeMode(curFormula),
            onExit: () => this.endPracticeMode()
          });
        } else {
          victoryManager.showSpecialPracticeVictory({
            title: t('practice.clearedTitle'),
            subtitle: t('practice.clearedDesc', { target: targetMoves, moves }),
            isPerfect: false,
            onRetry: () => curFormula && this.startPracticeMode(curFormula),
            onExit: () => this.endPracticeMode()
          });
        }

        setTimeout(() => {
          for (let i = 0; i < total; i++) {
            const box = this.boardGrid.children[i] as HTMLElement;
            if (box) box.classList.remove('celebrate-tile');
          }
        }, 4200);

        return;
      }"""

if win_condition_marker in content:
    content = content.replace(win_condition_marker, win_condition_replacement, 1)

# 7. startPracticeMode, renderPracticeBadge, endPracticeMode 메서드 추가
practice_methods = '''
  /**
   * 공식 비법서 '실전 보드 연습' 모드 시작 (Board Hydration)
   */
  public startPracticeMode(formula: FormulaItem): void {
    const initStep = formula.steps?.[0];
    if (!initStep || !initStep.boardOps) return;

    // 1. 공식에 필요한 대각선 축 포함 여부 검사
    const hasDiagonal = formula.steps.some(s => s.highlightLine?.type === 'diag') ||
                        formula.id.includes('diagonal') ||
                        formula.id.includes('diag') ||
                        ['MD', 'MAD'].includes(formula.id);

    // 2. 보드 크기 3x3 강제 및 D4 군 모드 자동 세팅
    if (this.boardSize !== 3) {
      this.setBoardSize(3);
    }
    if (this.currentGroup !== 'D4') {
      this.switchGroup('D4');
    }
    if (hasDiagonal && !this.isDiagonalEnabled) {
      this.toggleDiagonal();
    }

    // 3. 보드 상태 즉시 이식 (Board Hydration)
    const ops = initStep.boardOps as D4Op[];
    this.currentOps = [...ops];
    this.moveHistory = [];
    this.movesCount = 0;
    this.isGameStarted = false;
    recordManager.resetTimer();
    this.updateTimerDisplay();

    // 4. 연습 세션 메타데이터 등록
    const isKo = getCurrentLang() === 'ko';
    this.currentPractice = {
      formulaId: formula.id,
      title: isKo ? formula.titleKo : formula.titleEn,
      targetMoves: formula.difficulty,
      initialOps: [...ops]
    };

    // 5. UI 배지 렌더링 & 사운드
    soundEngine.playTap();
    this.renderPracticeBadge();
    this.updateBoard();
    this.updateMovesLabel();
    this.updateStatusInfo();
  }

  private renderPracticeBadge(): void {
    const container = document.getElementById('practice-mode-banner-container');
    if (!container) return;

    if (!this.currentPractice) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="practice-mode-banner">
        <div class="practice-active-badge">
          <span class="practice-icon">🎯</span>
          <span class="practice-title">${t('practice.badgeTitle', { title: this.currentPractice.title })}</span>
          <span class="practice-target">${t('practice.targetMoves', { moves: this.currentPractice.targetMoves })}</span>
          <button class="btn-exit-practice" id="btn-exit-practice" title="${t('practice.exitBtnTitle')}">✕</button>
        </div>
      </div>
    `;

    container.querySelector('#btn-exit-practice')?.addEventListener('click', () => {
      soundEngine.playTap();
      this.endPracticeMode();
    });
  }

  public endPracticeMode(): void {
    this.currentPractice = null;
    this.renderPracticeBadge();
    this.scrambleBoard();
  }
}
'''

# 마지막 닫는 중괄호 바로 앞
last_brace_idx = content.rfind('}')
content = content[:last_brace_idx] + practice_methods

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated main.ts with Practice Mode!")
