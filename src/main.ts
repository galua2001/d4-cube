import './styles/main.css';
import { D4Op, D4, SymmetryGroupKey } from './core/group';
import { generateLines, generateLineCells, LineTarget, applyLineMoveGeneric } from './core/board';
import { solveBoard, MoveStep } from './core/solver';
import { getMaxGodNumber, generateExactKScramble } from './game/scrambler';
import { soundEngine } from './audio/audioEngine';
import { campaignManager } from './game/campaign';
import { recordManager, formatTime } from './game/recordManager';
import { renderCharacterTileCanvas } from './ui/tileRenderer';
import { GestureRecognizer } from './ui/gesture';
import { solutionInlinePanel } from './ui/solutionModal';
import { showAboutModal } from './ui/aboutModal';
import { showTutorialModal, isTutorialCompleted } from './ui/tutorialModal';
import { victoryManager } from './ui/victoryEffect';
import { initPWAManager } from './pwaManager';
import { t, getCurrentLang, setLang, onLangChange, Lang } from './i18n/translations';
import {
  getCurrentTheme,
  toggleTheme,
  onThemeChange,
  getThemeImages,
  preloadThemeImages
} from './theme/characterTheme';
import {
  getColorMode,
  toggleColorMode,
  onColorModeChange
} from './theme/colorTheme';

class MatrixCubeApp {
  private boardSize = 3;
  private scrambleMoves = 3; // 기본 3수 섞기
  private isDiagonalEnabled = false; // 기본적으로 대각선 변환 비활성화
  private currentOps: D4Op[] = [];
  private currentGroup: SymmetryGroupKey = 'D4';
  private moveHistory: Array<{ lineId: number; op: D4Op; prevOps: D4Op[] }> = [];
  private movesCount = 0;
  private isAnimating = false;
  private isGameStarted = false;
  private isGuideActive = false; // 조작 가이드 표시 여부

  private boardGrid!: HTMLElement;
  private gestureCanvas!: HTMLCanvasElement;
  private gestureRecognizer!: GestureRecognizer;

  constructor() {
    this.initBoardOps();
    this.initImages();
    this.renderLayout();
    this.bindControls();
    this.updateBoard();
    this.updateBestRecordBadge();
    initPWAManager();

    // 언어 변경 시 UI 자동 갱신
    onLangChange(() => {
      this.renderLayout();
      this.bindControls();
      this.updateBoard();
      this.updateBestRecordBadge();
    });

    // 캐릭터 테마 변경 시 타일 실시간 갱신
    onThemeChange(() => {
      this.updateThemeButton();
      this.updateBoard();
    });

    onColorModeChange(() => {
      this.updateColorModeButton();
    });
  }

  private initBoardOps() {
    this.currentOps = Array(this.boardSize * this.boardSize).fill(D4.ID);
  }

  private initImages() {
    preloadThemeImages(() => this.updateBoard());
  }

  private getGroupName(grp: SymmetryGroupKey): string {
    switch (grp) {
      case 'D4': return t('status.groupD4');
      case 'V4': return t('status.groupV4');
      case 'C2': return t('status.groupC2');
      default: return '';
    }
  }

  private renderLayout() {
    const app = document.getElementById('app')!;
    const curLang = getCurrentLang();
    const curTheme = getCurrentTheme();
    const curColorMode = getColorMode();
    app.innerHTML = `
      <div class="header-bar">
        <div class="header-top-row">
          <div class="header-title">${t('header.title')}</div>
          <div style="display:flex; align-items:center; gap:6px;">
            <button id="btn-toggle-colormode" class="btn-colormode-toggle" title="${t('header.colorToggleTitle')}">
              <span class="color-opt color-opt-light ${curColorMode === 'light' ? 'active-color' : ''}">☀️ ${t('header.colorLight')}</span>
              <span class="color-divider">|</span>
              <span class="color-opt color-opt-dark ${curColorMode === 'dark' ? 'active-color' : ''}">🌙 ${t('header.colorDark')}</span>
            </button>
            <button id="btn-toggle-theme" class="btn-theme-toggle"  title="${t('header.themeToggleTitle')}">
              <span class="theme-opt theme-opt-dog ${curTheme === 'dog' ? 'active-theme' : ''}">🐶 ${t('header.themeDog')}</span>
              <span class="theme-divider">|</span>
              <span class="theme-opt theme-opt-galua ${curTheme === 'galua' ? 'active-theme' : ''}">🧑‍🎓 ${t('header.themeGalua')}</span>
            </button>
            <button id="btn-toggle-lang" class="btn-lang-toggle" title="${t('header.langToggleTitle')}">
              🌐 <span class="${curLang === 'en' ? 'active-lang' : ''}">EN</span> | <span class="${curLang === 'ko' ? 'active-lang' : ''}">KO</span>
            </button>
            <button id="btn-pwa-install" class="btn-icon" style="display:none; background: linear-gradient(135deg, #10b981, #059669); color: white; font-weight: bold; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);" title="${t('header.pwaInstallTitle')}">${t('header.pwaInstall')}</button>
          </div>
        </div>
        <div class="header-actions">
          <button id="btn-header-tutorial" class="btn-icon btn-nav-tutorial" title="${t('header.tutorialTitle')}">${t('header.tutorial')}</button>
          <button id="btn-about" class="btn-icon" title="${t('header.aboutTitle')}">${t('header.about')}</button>
          <button id="btn-toggle-guide" class="btn-icon" title="${t('header.guideTitle')}">${t('header.guide')}</button>
          <button id="btn-toggle-bgm" class="btn-icon">🔇 BGM</button>
          <button id="btn-toggle-sfx" class="btn-icon">🔊 SFX</button>
        </div>
      </div>

      <!-- 단 1행으로 압축된 슬림 설정 패널 -->
      <div class="settings-panel">
        <div class="settings-row">
          <div class="settings-left-group">
            <span class="settings-label">${t('settings.difficulty')}</span>
            <div class="button-group" id="moves-button-group"></div>
          </div>
          <div class="settings-options-group">
            <button id="btn-cycle-size" class="btn-option-pill" title="${t('settings.sizeTitle')}">📐 ${this.boardSize}×${this.boardSize}</button>
            <button id="btn-toggle-diag" class="btn-option-pill ${this.isDiagonalEnabled ? 'active-diag' : ''}" title="${this.isDiagonalEnabled ? t('settings.diagTitleOn') : t('settings.diagTitleOff')}">${this.isDiagonalEnabled ? t('settings.diagOn') : t('settings.diagOff')}</button>
          </div>
        </div>
      </div>

      <div class="status-bar">
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="badge-group" id="badge-group-name">${this.getGroupName(this.currentGroup)}</span>
          <span id="label-stage-info">${t('status.stageInfo', { size: this.boardSize, moves: this.scrambleMoves })}</span>
        </div>
        <div class="timer-container">
          <span class="timer-display" id="label-timer">00:00.0</span>
          <span id="label-moves">${t('status.moves', { moves: this.movesCount })}</span>
          <span class="best-record-badge" id="badge-best-record">${t('status.bestRecordEmpty')}</span>
        </div>
      </div>

      <div class="board-container">
        <div class="board-grid" id="board-grid"></div>
        <canvas id="gesture-canvas"></canvas>
      </div>

      <!-- 보드 아래쪽 실시간 인라인 해설 패널 컨테이너 -->
      <div id="solution-panel-container"></div>

      <div class="controls-panel">
        <button id="btn-undo" class="btn-action">${t('controls.undo')}</button>
        <button id="btn-hint" class="btn-action">${t('controls.hint')}</button>
        <button id="btn-solution" class="btn-action primary">${t('controls.solution')}</button>
      </div>

      <div class="controls-panel" style="margin-top: 4px;">
        <button id="btn-set-c2" class="btn-icon" style="flex:1;">${t('controls.modeC2')}</button>
        <button id="btn-set-v4" class="btn-icon" style="flex:1;">${t('controls.modeV4')}</button>
        <button id="btn-set-d4" class="btn-icon active" style="flex:1;">${t('controls.modeD4')}</button>
      </div>
    `;

    this.boardGrid = document.getElementById('board-grid')!;
    this.gestureCanvas = document.getElementById('gesture-canvas') as HTMLCanvasElement;

    // 제스처 인식기 활성화 (대각선 허용 상태 동기화)
    this.gestureRecognizer = new GestureRecognizer(
      this.boardGrid,
      this.gestureCanvas,
      (target, op) => this.handleLineOperation(target, op),
      this.boardSize
    );
    this.gestureRecognizer.setAllowDiagonal(this.isDiagonalEnabled);

    this.rebuildBoardDOM();
  }

  // 11번 타일 내부 우측 세로 스위치(.tile-switch-11) 모드 클래스 실시간 동기화
  private updateTileSwitch11() {
    const tileSwitch = document.getElementById('tile-switch-11');
    if (!tileSwitch || !this.gestureRecognizer) return;
    const mode = this.gestureRecognizer.getCell11Mode();
    tileSwitch.className = `tile-switch-11 ${mode === 'col' ? 'mode-col' : 'mode-row'}`;
  }

  public renderBoard() {
    this.updateBoard();
  }

  private rebuildBoardDOM() {
    this.boardGrid.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
    this.boardGrid.style.gridTemplateRows = `repeat(${this.boardSize}, 1fr)`;
    this.boardGrid.innerHTML = '';
    this.boardGrid.classList.toggle('show-guide', this.isGuideActive);

    const totalCells = this.boardSize * this.boardSize;
    for (let i = 0; i < totalCells; i++) {
      const box = document.createElement('div');
      box.className = 'cell-box';

      const canvas = document.createElement('canvas');
      canvas.className = 'cell-canvas';
      canvas.width = 300;
      canvas.height = 300;
      box.appendChild(canvas);

      const r = Math.floor(i / this.boardSize);
      const c = i % this.boardSize;

      // 0번 타일(1행 1열, i === 0): 우측 세로 여백에 미려한 컴팩트 알약 스위치(.tile-switch-11) 배치
      if (i === 0) {
        const sw = document.createElement('div');
        const currentMode = this.gestureRecognizer ? this.gestureRecognizer.getCell11Mode() : 'row';
        sw.className = `tile-switch-11 ${currentMode === 'col' ? 'mode-col' : 'mode-row'}`;
        sw.id = 'tile-switch-11';
        sw.title = t('board.switch11Title');
        sw.innerHTML = `
          <span class="tile-switch-opt opt-row">${t('board.optRow')}</span>
          <span class="tile-switch-opt opt-col">${t('board.optCol')}</span>
        `;
        const stopEvent = (e: Event) => e.stopPropagation();
        sw.addEventListener('pointerdown', stopEvent);
        sw.addEventListener('pointerup', stopEvent);
        sw.addEventListener('click', (e) => {
          e.stopPropagation();
          const newMode = this.gestureRecognizer.toggleCell11Mode();
          this.updateTileSwitch11();
          soundEngine.playTap();
          this.highlightActiveLine(newMode);
        });
        box.appendChild(sw);
      } else {
        // 컨트롤러 조작 가이드 안내 태그 배지 (.controller-guide-label) 생성
        let guideText = '';
        let guideClass = '';

        if (c === 0 && r > 0) {
          guideText = t('board.row', { n: r + 1 });
          guideClass = 'guide-row';
        } else if (r === 0 && c > 0) {
          guideText = t('board.col', { n: c + 1 });
          guideClass = 'guide-col';
        } else if (this.isDiagonalEnabled) {
          if (r === this.boardSize - 1 && c === this.boardSize - 1) {
            guideText = t('board.diagMain');
            guideClass = 'guide-diag';
          } else if (r === 1 && c === this.boardSize - 1) {
            guideText = t('board.diagAnti');
            guideClass = 'guide-diag';
          }
        }

        if (guideText) {
          const guideTag = document.createElement('div');
          guideTag.className = `controller-guide-label ${guideClass}`;
          guideTag.innerText = guideText;
          box.appendChild(guideTag);
        }
      }

      // 각 성분 오른쪽 하단 조그마한 상태 뱃지 (0, 1, 2, 3 및 대칭 기호)
      const badge = document.createElement('div');
      badge.className = 'cell-state-badge is-solved';
      badge.innerText = '0';
      box.appendChild(badge);

      this.boardGrid.appendChild(box);
    }

    this.updateTileSwitch11();
  }

  // 11 토글 시 팝업창 없이 해당 라인(1열 또는 1행)을 시각적으로 네온 강조
  private highlightActiveLine(mode: 'col' | 'row') {
    const total = this.boardSize * this.boardSize;
    for (let i = 0; i < total; i++) {
      const b = this.boardGrid.children[i] as HTMLElement;
      if (b) {
        b.classList.remove('highlight-col', 'highlight-row');
      }
    }

    const indices: number[] = [];
    if (mode === 'col') {
      for (let r = 0; r < this.boardSize; r++) {
        indices.push(r * this.boardSize);
      }
    } else {
      for (let c = 0; c < this.boardSize; c++) {
        indices.push(c);
      }
    }

    indices.forEach(idx => {
      const b = this.boardGrid.children[idx] as HTMLElement;
      if (b) {
        b.classList.add(mode === 'col' ? 'highlight-col' : 'highlight-row');
      }
    });

    // 1.2초 후 자연스럽게 강조 제거
    setTimeout(() => {
      indices.forEach(idx => {
        const b = this.boardGrid.children[idx] as HTMLElement;
        if (b) {
          b.classList.remove('highlight-col', 'highlight-row');
        }
      });
    }, 1200);
  }

  private updateColorModeButton() {
    const btnColor = document.getElementById('btn-toggle-colormode');
    if (!btnColor) return;
    const curColor = getColorMode();
    const lightOpt = btnColor.querySelector('.color-opt-light');
    const darkOpt = btnColor.querySelector('.color-opt-dark');
    if (lightOpt) lightOpt.classList.toggle('active-color', curColor === 'light');
    if (darkOpt) darkOpt.classList.toggle('active-color', curColor === 'dark');
  }

  private updateThemeButton() {
    const btnTheme = document.getElementById('btn-toggle-theme');
    if (!btnTheme) return;
    const curTheme = getCurrentTheme();
    const dogOpt = btnTheme.querySelector('.theme-opt-dog');
    const galuaOpt = btnTheme.querySelector('.theme-opt-galua');
    if (dogOpt) dogOpt.classList.toggle('active-theme', curTheme === 'dog');
    if (galuaOpt) galuaOpt.classList.toggle('active-theme', curTheme === 'galua');
  }

  private bindControls() {
    // 라이트 / 다크 테마 전환 버튼 (☀️ Light ↔ 🌙 Dark)
    document.getElementById('btn-toggle-colormode')?.addEventListener('click', () => {
      soundEngine.playTap();
      toggleColorMode();
    });

    // 캐릭터 테마 전환 버튼 (강아지 <-> 갈루아 소년)
    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
      soundEngine.playTap();
      toggleTheme();
    });

    // 언어 전환 버튼 (EN <-> KO)
    document.getElementById('btn-toggle-lang')?.addEventListener('click', () => {
      soundEngine.playTap();
      const nextLang: Lang = getCurrentLang() === 'en' ? 'ko' : 'en';
      setLang(nextLang);
    });

    // 30초 인터랙티브 튜토리얼 모달 버튼
    const btnTut = document.getElementById('btn-header-tutorial');
    if (!isTutorialCompleted() && btnTut) {
      btnTut.classList.add('pulse-active');
    }
    btnTut?.addEventListener('click', () => {
      soundEngine.playTap();
      btnTut.classList.remove('pulse-active');
      showTutorialModal();
    });

    // 공모전 소개 모달 버튼
    document.getElementById('btn-about')?.addEventListener('click', () => {
      soundEngine.playTap();
      showAboutModal();
    });

    // 조작 가이드 인디케이터 토글 버튼
    const btnGuide = document.getElementById('btn-toggle-guide');
    if (btnGuide) {
      btnGuide.classList.toggle('active', this.isGuideActive);
      btnGuide.addEventListener('click', () => {
        this.isGuideActive = !this.isGuideActive;
        btnGuide.classList.toggle('active', this.isGuideActive);
        this.boardGrid.classList.toggle('show-guide', this.isGuideActive);
        soundEngine.playTap();
      });
    }

    document.getElementById('btn-toggle-bgm')?.addEventListener('click', (e) => {
      const on = soundEngine.toggleBgm();
      (e.target as HTMLElement).innerText = on ? '🎵 BGM' : '🔇 BGM';
    });

    document.getElementById('btn-toggle-sfx')?.addEventListener('click', (e) => {
      const on = soundEngine.toggleSfx();
      (e.target as HTMLElement).innerText = on ? '🔊 SFX' : '🔈 SFX';
    });

    // 보드 크기 순환 버튼 이벤트 (3×3 ➔ 4×4 ➔ 5×5)
    document.getElementById('btn-cycle-size')?.addEventListener('click', () => {
      this.cycleBoardSize();
    });

    // 대각선 변환 모드 토글 버튼 이벤트
    document.getElementById('btn-toggle-diag')?.addEventListener('click', () => {
      this.toggleDiagonal();
    });

    // 난이도(N수) 버튼 목록 초기 렌더링
    this.updateDifficultyButtons();

    document.getElementById('btn-undo')?.addEventListener('click', () => {
      this.undoMove();
    });

    document.getElementById('btn-hint')?.addEventListener('click', () => {
      this.giveHint();
    });

    document.getElementById('btn-solution')?.addEventListener('click', () => {
      this.openSolution();
    });

    document.getElementById('btn-set-c2')?.addEventListener('click', () => this.switchGroup('C2'));
    document.getElementById('btn-set-v4')?.addEventListener('click', () => this.switchGroup('V4'));
    document.getElementById('btn-set-d4')?.addEventListener('click', () => this.switchGroup('D4'));
  }

  // 보드 크기 순환 전환 (3x3 ➔ 4x4 ➔ 5x5 ➔ 3x3)
  private cycleBoardSize() {
    let nextSize = 3;
    if (this.boardSize === 3) nextSize = 4;
    else if (this.boardSize === 4) nextSize = 5;
    else nextSize = 3;

    this.setBoardSize(nextSize);
  }

  // 대각선 변환 모드 켜기/끄기 토글
  private toggleDiagonal() {
    this.isDiagonalEnabled = !this.isDiagonalEnabled;
    this.gestureRecognizer.setAllowDiagonal(this.isDiagonalEnabled);

    const btnDiag = document.getElementById('btn-toggle-diag');
    if (btnDiag) {
      btnDiag.innerText = this.isDiagonalEnabled ? t('settings.diagOn') : t('settings.diagOff');
      btnDiag.classList.toggle('active-diag', this.isDiagonalEnabled);
      btnDiag.title = this.isDiagonalEnabled ? t('settings.diagTitleOn') : t('settings.diagTitleOff');
    }

    this.updateDifficultyButtons();
    soundEngine.playTap();
    this.rebuildBoardDOM();
    this.updateBoard();
    this.scrambleBoard();
  }

  private updateBestRecordBadge() {
    const badge = document.getElementById('badge-best-record');
    if (!badge) return;
    const rec = recordManager.getRecord(this.boardSize, this.scrambleMoves);
    if (rec && (rec.bestTimeMs !== null || rec.bestMoves !== null)) {
      const timeStr = rec.bestTimeMs !== null ? formatTime(rec.bestTimeMs) : '-';
      const moveStr = rec.bestMoves !== null ? t('status.moves', { moves: rec.bestMoves }) : '-';
      badge.innerText = `🏆 ${timeStr} / ${moveStr}`;
      badge.title = t('status.bestRecordTitle', { time: timeStr, moves: moveStr });
    } else {
      badge.innerText = t('status.bestRecordEmpty');
      badge.title = t('status.bestRecordEmptyTitle');
    }
  }

  private setBoardSize(newSize: number) {
    this.boardSize = newSize;
    this.initBoardOps();
    this.rebuildBoardDOM();
    this.gestureRecognizer.setBoardSize(newSize);

    const btnSize = document.getElementById('btn-cycle-size');
    if (btnSize) {
      btnSize.innerText = `📐 ${newSize}×${newSize}`;
    }

    this.isGameStarted = false;
    recordManager.resetTimer();
    const timerEl = document.getElementById('label-timer');
    if (timerEl) timerEl.innerText = '00:00.0';

    this.moveHistory = [];
    this.movesCount = 0;
    this.updateMovesLabel();
    this.updateStatusInfo();
    this.updateBestRecordBadge();

    soundEngine.playTap();
    this.scrambleBoard();
  }

  private updateStatusInfo() {
    const lbl = document.getElementById('label-stage-info');
    if (lbl) {
      lbl.innerText = t('status.stageInfo', { size: this.boardSize, moves: this.scrambleMoves });
    }
  }

    /**
   * 대칭군 모드 및 대각선 활성화에 따라 난이도(N수) 버튼 목록을 동적으로 구성
   * maxMoves = getMaxGodNumber(this.currentGroup, this.isDiagonalEnabled, this.boardSize)
   * moves > maxMoves인 버튼은 style.display = 'none'으로 깔끔하게 비노출.
   * 현재 this.scrambleMoves > maxMoves라면 자동으로 maxMoves로 클램프하고 활성 버튼 갱신.
   */
  private updateDifficultyButtons() {
    const groupEl = document.getElementById('moves-button-group');
    if (!groupEl) return;

    const maxMoves = getMaxGodNumber(this.currentGroup, this.isDiagonalEnabled, this.boardSize);

    let movesList: number[] = [3, 4, 5, 6, 7, 8];
    if (this.currentGroup === 'V4') {
      movesList = [2, 3, 4, 5, 6];
    } else if (this.currentGroup === 'C2') {
      movesList = [2, 3, 4, 5];
    }

    if (this.scrambleMoves > maxMoves) {
      this.scrambleMoves = maxMoves;
    }
    const validMoves = movesList.filter(m => m <= maxMoves);
    if (!validMoves.includes(this.scrambleMoves)) {
      this.scrambleMoves = validMoves[0] || 3;
    }

    groupEl.innerHTML = '';
    movesList.forEach(m => {
      const btn = document.createElement('button');
      btn.className = `btn-pill ${m === this.scrambleMoves ? 'active' : ''}`;
      btn.dataset.moves = String(m);
      btn.innerText = `${m}${t('settings.movesSuffix')}`;

      if (m > maxMoves) {
        btn.style.display = 'none';
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => {
          this.scrambleMoves = m;
          groupEl.querySelectorAll('.btn-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.updateStatusInfo();
          this.updateBestRecordBadge();
          this.scrambleBoard();
        });
      }
      groupEl.appendChild(btn);
    });

    this.updateStatusInfo();
    this.updateBestRecordBadge();
  }

  private switchGroup(grp: SymmetryGroupKey) {
    this.currentGroup = grp;
    const badge = document.getElementById('badge-group-name');
    if (badge) badge.innerText = this.getGroupName(grp);

    ['btn-set-c2', 'btn-set-v4', 'btn-set-d4'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.toggle('active', id.endsWith(grp.toLowerCase()));
      }
    });

    // 대칭군 변경 시 해당 군에 맞는 난이도 버튼 목록 즉시 갱신 (V4: 2~4수)
    this.updateDifficultyButtons();
    this.scrambleBoard();
  }

  private handleLineOperation(target: LineTarget, rawOp: D4Op) {
    if (this.isAnimating) return;

    // 대칭군 제약에 맞게 유효 변환으로 클램핑
    let validOp: D4Op = rawOp;
    if (this.currentGroup === 'C2') {
      validOp = D4.R180;
    } else if (this.currentGroup === 'V4') {
      if (rawOp === D4.R90 || rawOp === D4.R270) validOp = D4.R180;
      else if (rawOp === D4.MD) validOp = D4.MY;
      else if (rawOp === D4.MAD) validOp = D4.MX;
    }

    const lines = generateLines(this.boardSize);
    const lineId = lines.findIndex(l => l.type === target.type && l.idx === target.idx);
    if (lineId === -1) return;

    this.applyMove(lineId, validOp);
  }

  private applyMove(lineId: number, op: D4Op, recordHistory = true) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.gestureRecognizer.setLocked(true);

    soundEngine.playFlip();

    const lineCellsList = generateLineCells(this.boardSize);
    const lineCells = lineCellsList[lineId] || [];

    const isFlip = op === 'MX' || op === 'MY' || op === 'MD' || op === 'MAD';
    const isRot = op === 'R90' || op === 'R180' || op === 'R270';

    const prevOps = [...this.currentOps];
    const nextOps = applyLineMoveGeneric(this.currentOps, lineCells, op);

    const FLIP_FOLD_MS = 200;
    const FLIP_UNFOLD_MS = 220;
    const ROT_ANIM_MS = 360;

    const easeFold = 'cubic-bezier(0.3, 0, 0.8, 0.15)';
    const easeUnfold = 'cubic-bezier(0.15, 0.85, 0.35, 1.2)';
    const neonShadow = '0 16px 32px rgba(0, 0, 0, 0.6), 0 0 16px rgba(56, 189, 248, 0.4)';
    const sheenFilter = 'brightness(1.15)';

    if (isFlip) {
      let foldTransform = '';
      let unfoldStart = '';
      let unfoldEnd = '';

      if (op === 'MY') {
        foldTransform = 'perspective(1000px) translateZ(35px) scale(1.04) rotateY(90deg)';
        unfoldStart = 'perspective(1000px) translateZ(35px) scale(1.04) rotateY(-90deg)';
        unfoldEnd = 'perspective(1000px) translateZ(0px) scale(1) rotateY(0deg)';
      } else if (op === 'MX') {
        foldTransform = 'perspective(1000px) translateZ(35px) scale(1.04) rotateX(90deg)';
        unfoldStart = 'perspective(1000px) translateZ(35px) scale(1.04) rotateX(-90deg)';
        unfoldEnd = 'perspective(1000px) translateZ(0px) scale(1) rotateX(0deg)';
      } else if (op === 'MD') {
        foldTransform = 'perspective(1000px) translateZ(35px) scale(1.04) rotate3d(1, 1, 0, 90deg)';
        unfoldStart = 'perspective(1000px) translateZ(35px) scale(1.04) rotate3d(1, 1, 0, -90deg)';
        unfoldEnd = 'perspective(1000px) translateZ(0px) scale(1) rotate3d(1, 1, 0, 0deg)';
      } else if (op === 'MAD') {
        foldTransform = 'perspective(1000px) translateZ(35px) scale(1.04) rotate3d(-1, 1, 0, 90deg)';
        unfoldStart = 'perspective(1000px) translateZ(35px) scale(1.04) rotate3d(-1, 1, 0, -90deg)';
        unfoldEnd = 'perspective(1000px) translateZ(0px) scale(1) rotate3d(-1, 1, 0, 0deg)';
      }

      // 1단계: 0도 -> 90도 (공중으로 솟구치며 수직으로 젖혀짐 + 입체 그림자 및 광택)
      lineCells.forEach(cellIdx => {
        const box = this.boardGrid.children[cellIdx] as HTMLElement;
        if (box) {
          box.style.zIndex = '30';
          box.style.transition = `transform ${FLIP_FOLD_MS}ms ${easeFold}, box-shadow ${FLIP_FOLD_MS}ms ${easeFold}, filter ${FLIP_FOLD_MS}ms ${easeFold}`;
          box.style.transform = foldTransform;
          box.style.boxShadow = neonShadow;
          box.style.filter = sheenFilter;
        }
      });

      // 200ms 지점: 두께 0 타이밍에 상태 변경 및 보드 갱신
      setTimeout(() => {
        this.currentOps = nextOps;
        this.updateBoard();

        // 반대편 -90도로 즉시 스냅 (transition: none으로 공중 및 그림자 상태 유지)
        lineCells.forEach(cellIdx => {
          const box = this.boardGrid.children[cellIdx] as HTMLElement;
          if (box) {
            box.style.zIndex = '30';
            box.style.transition = 'none';
            box.style.transform = unfoldStart;
            box.style.boxShadow = neonShadow;
            box.style.filter = sheenFilter;
          }
        });

        // 2단계: -90도 -> 0도 (오버슈트 스프링 바운스로 부드럽게 지면에 착지)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            lineCells.forEach(cellIdx => {
              const box = this.boardGrid.children[cellIdx] as HTMLElement;
              if (box) {
                box.style.transition = `transform ${FLIP_UNFOLD_MS}ms ${easeUnfold}, box-shadow ${FLIP_UNFOLD_MS}ms ${easeUnfold}, filter ${FLIP_UNFOLD_MS}ms ${easeUnfold}`;
                box.style.transform = unfoldEnd;
                box.style.boxShadow = '';
                box.style.filter = 'brightness(1)';
              }
            });

            setTimeout(() => {
              lineCells.forEach(cellIdx => {
                const box = this.boardGrid.children[cellIdx] as HTMLElement;
                if (box) {
                  box.style.transition = '';
                  box.style.transform = '';
                  box.style.boxShadow = '';
                  box.style.filter = '';
                  box.style.zIndex = '';
                }
              });

              this.finalizeMove(lineId, op, prevOps, recordHistory);
            }, FLIP_UNFOLD_MS);
          });
        });
      }, FLIP_FOLD_MS);

    } else if (isRot) {
      let animClass = '';
      if (op === 'R90') animClass = 'tile-anim-r90';
      else if (op === 'R180') animClass = 'tile-anim-r180';
      else if (op === 'R270') animClass = 'tile-anim-r270';

      lineCells.forEach(cellIdx => {
        const box = this.boardGrid.children[cellIdx] as HTMLElement;
        if (box) {
          box.classList.remove('tile-anim-r90', 'tile-anim-r180', 'tile-anim-r270');
          void box.offsetWidth;
          box.classList.add(animClass);
        }
      });

      setTimeout(() => {
        this.currentOps = nextOps;
        this.updateBoard();

        lineCells.forEach(cellIdx => {
          const box = this.boardGrid.children[cellIdx] as HTMLElement;
          if (box) {
            box.classList.remove('tile-anim-r90', 'tile-anim-r180', 'tile-anim-r270');
            box.style.animation = '';
            box.style.transform = '';
            box.style.boxShadow = '';
            box.style.filter = '';
            box.style.zIndex = '';
          }
        });

        this.finalizeMove(lineId, op, prevOps, recordHistory);
      }, ROT_ANIM_MS);

    } else {
      this.currentOps = nextOps;
      this.updateBoard();
      this.finalizeMove(lineId, op, prevOps, recordHistory);
    }
  }

  private finalizeMove(lineId: number, op: D4Op, prevOps: D4Op[], recordHistory: boolean) {
    try {
      if (recordHistory) {
        if (!this.isGameStarted) {
          this.isGameStarted = true;
          recordManager.startTimer((formatted) => {
            const timerEl = document.getElementById('label-timer');
            if (timerEl) timerEl.innerText = formatted;
          });
        }

        this.moveHistory.push({ lineId, op, prevOps });
        this.movesCount++;
        this.updateMovesLabel();
      }

      this.checkWinCondition();
    } finally {
      this.isAnimating = false;
      this.gestureRecognizer.setLocked(false);
    }
  }

  private undoMove() {
    if (this.moveHistory.length === 0 || this.isAnimating) return;
    const last = this.moveHistory.pop()!;
    this.currentOps = last.prevOps;
    this.movesCount = Math.max(0, this.movesCount - 1);
    this.updateMovesLabel();
    soundEngine.playTap();
    this.updateBoard();
  }

  private scrambleBoard() {
    solutionInlinePanel.close();
    this.isGameStarted = false;
    recordManager.resetTimer();
    const timerEl = document.getElementById('label-timer');
    if (timerEl) timerEl.innerText = '00:00.0';

    const ops = generateExactKScramble(
      this.scrambleMoves,
      this.currentGroup,
      this.isDiagonalEnabled,
      this.boardSize
    );

    this.currentOps = ops;
    this.moveHistory = [];
    this.movesCount = 0;
    this.updateMovesLabel();
    this.updateStatusInfo();
    this.updateBestRecordBadge();
    soundEngine.playTap();
    this.updateBoard();
  }

  private giveHint() {
    if (this.currentOps.every(o => o === D4.ID)) {
      soundEngine.playWin();
      return;
    }

    const steps = solveBoard(this.currentOps, this.boardSize, this.currentGroup, this.isDiagonalEnabled);
    if (steps.length === 0) return;

    const first = steps[0];
    soundEngine.playTap();

    // 기존 하이라이트 초기화
    const total = this.boardSize * this.boardSize;
    for (let i = 0; i < total; i++) {
      const b = this.boardGrid.children[i] as HTMLElement;
      if (b) {
        b.classList.remove('highlight-hint', 'highlight-col', 'highlight-row');
      }
    }

    // 힌트 대상 행/열/대각선의 셀들 강조
    const lineCellsList = generateLineCells(this.boardSize);
    const targetCells = lineCellsList[first.lineId] || [];

    targetCells.forEach(cellIdx => {
      const b = this.boardGrid.children[cellIdx] as HTMLElement;
      if (b) {
        b.classList.add('highlight-hint');
      }
    });

    // 2.5초 후 자연스럽게 힌트 강조 해제
    setTimeout(() => {
      targetCells.forEach(cellIdx => {
        const b = this.boardGrid.children[cellIdx] as HTMLElement;
        if (b) {
          b.classList.remove('highlight-hint');
        }
      });
    }, 2500);
  }

  private openSolution() {
    const container = document.getElementById('solution-panel-container');
    if (!container) return;

    const originalOps = [...this.currentOps];
    const steps = solveBoard(this.currentOps, this.boardSize, this.currentGroup, this.isDiagonalEnabled);

    solutionInlinePanel.render(
      container,
      this.currentOps,
      this.boardSize,
      steps,
      {
        onPreviewState: (previewOps, lineId) => {
          this.currentOps = [...previewOps];
          this.updateBoard();

          // 모든 이전 하이라이트 제거
          const total = this.boardSize * this.boardSize;
          for (let i = 0; i < total; i++) {
            const b = this.boardGrid.children[i] as HTMLElement;
            if (b) b.classList.remove('highlight-hint');
          }

          // 해당 라인 하이라이트
          if (lineId !== null) {
            const lineCellsList = generateLineCells(this.boardSize);
            const cells = lineCellsList[lineId] || [];
            cells.forEach(idx => {
              const b = this.boardGrid.children[idx] as HTMLElement;
              if (b) b.classList.add('highlight-hint');
            });
          }
        },
        onAutoSolve: () => {
          this.currentOps = [...originalOps];
          this.updateBoard();
          this.runAutoSolve(steps);
        },
        onClose: () => {
          const total = this.boardSize * this.boardSize;
          for (let i = 0; i < total; i++) {
            const b = this.boardGrid.children[i] as HTMLElement;
            if (b) b.classList.remove('highlight-hint');
          }
          this.updateBoard();
        }
      }
    );
  }

  private async runAutoSolve(steps: MoveStep[]) {
    for (const step of steps) {
      if (this.currentOps.every(o => o === D4.ID)) break;
      await new Promise<void>(res => {
        this.applyMove(step.lineId, step.op, true);
        setTimeout(res, 520);
      });
    }
  }

  private checkWinCondition() {
    const isWin = this.currentOps.every(op => op === D4.ID);
    if (isWin) {
      // 1. 타이머 정지 및 기록 저장 & 최고 기록 갱신 여부 판정
      this.isGameStarted = false;
      const elapsedMs = recordManager.stopTimer();
      const timeFormatted = recordManager.getFormattedTime();
      const saveResult = recordManager.saveRecord(this.boardSize, this.scrambleMoves, elapsedMs, this.movesCount);
      this.updateBestRecordBadge();

      // 2. 신나는 다성부 승리 팡파르 + 마법 차임벨 사운드
      soundEngine.playWin();

      const stars = campaignManager.completeStage(1, this.movesCount);

      // 3. 보드의 모든 타일들이 순차적으로 파도타듯 춤추는 축하 댄스 애니메이션
      const total = this.boardSize * this.boardSize;
      for (let i = 0; i < total; i++) {
        const box = this.boardGrid.children[i] as HTMLElement;
        if (box) {
          setTimeout(() => {
            box.classList.add('celebrate-tile');
          }, i * 40);
        }
      }

      // 4. 화려한 전면 컨페티 폭죽 파티클 및 NEW BEST 뱃지가 연동된 세련된 승리 축하 배너
      victoryManager.launchVictory(
        this.movesCount,
        stars,
        {
          timeFormatted,
          isNewBestTime: saveResult.isNewBestTime,
          isNewBestMoves: saveResult.isNewBestMoves,
          bestTimeFormatted: formatTime(saveResult.bestTimeMs),
          bestMoves: saveResult.bestMoves
        },
        () => {
          this.scrambleBoard();
        }
      );

      // 4초 후 타일 축하 댄스 클래스 정리
      setTimeout(() => {
        for (let i = 0; i < total; i++) {
          const box = this.boardGrid.children[i] as HTMLElement;
          if (box) box.classList.remove('celebrate-tile');
        }
      }, 4200);
    }
  }

  private updateMovesLabel() {
    const lbl = document.getElementById('label-moves');
    if (lbl) lbl.innerText = t('status.moves', { moves: this.movesCount });
  }

  // 각 성분의 상태 뱃지 텍스트 반환 (0, 1, 2, 3 및 대칭 기호)
  private getBadgeInfo(op: D4Op): { text: string; isSolved: boolean; isSymmetry: boolean } {
    switch (op) {
      case 'ID': return { text: '0', isSolved: true, isSymmetry: false };
      case 'R90': return { text: '1', isSolved: false, isSymmetry: false };
      case 'R180': return { text: '2', isSolved: false, isSymmetry: false };
      case 'R270': return { text: '3', isSolved: false, isSymmetry: false };
      case 'MX': return { text: '―', isSolved: false, isSymmetry: true }; // 상하 반전 (진한 가로선)
      case 'MY': return { text: '│', isSolved: false, isSymmetry: true }; // 좌우 반전 (진한 세로선)
      case 'MD': return { text: '╲', isSolved: false, isSymmetry: true }; // 주대각선 대칭
      case 'MAD': return { text: '╱', isSolved: false, isSymmetry: true }; // 부대각선 대칭
      default: return { text: '0', isSolved: true, isSymmetry: false };
    }
  }

  private updateBoard() {
    const { front, back } = getThemeImages();
    const total = this.boardSize * this.boardSize;
    for (let i = 0; i < total; i++) {
      const box = this.boardGrid.children[i];
      if (!box) continue;
      const canvas = box.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) continue;

      const op = this.currentOps[i];
      renderCharacterTileCanvas(canvas, op, front, back);

      // 오른쪽 하단 뱃지 텍스트 갱신
      const badge = box.querySelector('.cell-state-badge') as HTMLElement;
      if (badge) {
        const info = this.getBadgeInfo(op);
        badge.innerText = info.text;
        badge.classList.toggle('is-solved', info.isSolved);
        badge.classList.toggle('is-symmetry', info.isSymmetry);
      }
    }
  }
}

// 앱 실행
window.addEventListener('DOMContentLoaded', () => {
  new MatrixCubeApp();
});
