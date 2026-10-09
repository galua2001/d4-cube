import './styles/main.css';
import { D4Op, D4, SymmetryGroupKey, SYMMETRY_GROUPS } from './core/group';
import { generateLines, generateLineCells, LineTarget, applyLineMoveGeneric } from './core/board';
import { solveBoard, MoveStep } from './core/solver';
import { soundEngine } from './audio/audioEngine';
import { campaignManager } from './game/campaign';
import { recordManager, formatTime } from './game/recordManager';
import { renderDogTileCanvas } from './ui/tileRenderer';
import { GestureRecognizer } from './ui/gesture';
import { showSolutionModal } from './ui/solutionModal';
import { showAboutModal } from './ui/aboutModal';
import { showTutorialModal, isTutorialCompleted } from './ui/tutorialModal';
import { victoryManager } from './ui/victoryEffect';
import { initPWAManager } from './pwaManager';

class MatrixCubeApp {
  private boardSize = 3;
  private scrambleMoves = 3; // 기본 3수 섞기
  private currentOps: D4Op[] = [];
  private currentGroup: SymmetryGroupKey = 'D4';
  private moveHistory: Array<{ lineId: number; op: D4Op; prevOps: D4Op[] }> = [];
  private movesCount = 0;
  private isAnimating = false;
  private isGameStarted = false;
  private isGuideActive = false; // 조작 가이드 표시 여부

  private imgDogFront = new Image();
  private imgDogBack = new Image();

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
  }

  private initBoardOps() {
    this.currentOps = Array(this.boardSize * this.boardSize).fill(D4.ID);
  }

  private initImages() {
    this.imgDogFront.src = '/assets/dog_front.png';
    this.imgDogBack.src = '/assets/dog_back.png';

    const onImgLoad = () => this.updateBoard();
    this.imgDogFront.onload = onImgLoad;
    this.imgDogBack.onload = onImgLoad;
  }

  private renderLayout() {
    const app = document.getElementById('app')!;
    app.innerHTML = `
      <div class="header-bar">
        <div class="header-title">🧩 행렬 큐브</div>
        <div class="header-actions">
          <button id="btn-pwa-install" class="btn-icon" style="display:none; background: linear-gradient(135deg, #10b981, #059669); color: white; font-weight: bold; box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);" title="스마트폰에 앱으로 설치">📱 앱설치</button>
          <button id="btn-header-tutorial" class="btn-icon btn-nav-tutorial" title="30초 인터랙티브 D4 연산 튜토리얼">🎓 튜토리얼</button>
          <button id="btn-about" class="btn-icon" title="작품 소개 및 수학적 배경">ℹ️ 소개</button>
          <button id="btn-toggle-guide" class="btn-icon" title="컨트롤러 타일 가이드">🧭 가이드</button>
          <button id="btn-toggle-bgm" class="btn-icon">🔇 BGM</button>
          <button id="btn-toggle-sfx" class="btn-icon">🔊 SFX</button>
        </div>
      </div>

      <!-- 보드 크기 & 난이도 설정 패널 -->
      <div class="settings-panel">
        <div class="settings-row">
          <span class="settings-label">📐 크기</span>
          <div class="button-group" id="size-button-group">
            <button class="btn-pill active" data-size="3">3×3</button>
            <button class="btn-pill" data-size="4">4×4</button>
            <button class="btn-pill" data-size="5">5×5</button>
          </div>
        </div>
        <div class="settings-row">
          <span class="settings-label">🎲 난이도</span>
          <div class="button-group" id="moves-button-group">
            <button class="btn-pill active" data-moves="3">3수</button>
            <button class="btn-pill" data-moves="4">4수</button>
            <button class="btn-pill" data-moves="5">5수</button>
            <button class="btn-pill" data-moves="6">6수</button>
            <button class="btn-pill" data-moves="7">7수</button>
            <button class="btn-pill" data-moves="8">8수</button>
          </div>
        </div>
      </div>

      <div class="status-bar">
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="badge-group" id="badge-group-name">D₄ (정사면군)</span>
          <span id="label-stage-info">${this.boardSize}×${this.boardSize} (${this.scrambleMoves}수)</span>
        </div>
        <div class="timer-container">
          <span class="timer-display" id="label-timer">00:00.0</span>
          <span id="label-moves">0 회</span>
          <span class="best-record-badge" id="badge-best-record">🏆 BEST: -</span>
        </div>
      </div>

      <div class="board-container">
        <div class="board-grid" id="board-grid"></div>
        <canvas id="gesture-canvas"></canvas>
      </div>

      <div class="controls-panel">
        <button id="btn-scramble" class="btn-action">🎲 섞기</button>
        <button id="btn-undo" class="btn-action">↩ 되돌리기</button>
        <button id="btn-hint" class="btn-action">💡 힌트</button>
        <button id="btn-solution" class="btn-action primary">📖 해설</button>
      </div>

      <div class="controls-panel" style="margin-top: 4px;">
        <button id="btn-set-c2" class="btn-icon" style="flex:1;">C₂ 모드</button>
        <button id="btn-set-v4" class="btn-icon" style="flex:1;">V₄ 모드</button>
        <button id="btn-set-d4" class="btn-icon active" style="flex:1;">D₄ 모드</button>
      </div>
    `;

    this.boardGrid = document.getElementById('board-grid')!;
    this.gestureCanvas = document.getElementById('gesture-canvas') as HTMLCanvasElement;

    // 제스처 인식기 활성화
    this.gestureRecognizer = new GestureRecognizer(
      this.boardGrid,
      this.gestureCanvas,
      (target, op) => this.handleLineOperation(target, op),
      this.boardSize
    );

    this.rebuildBoardDOM();
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
      canvas.width = 100;
      canvas.height = 100;
      box.appendChild(canvas);

      const r = Math.floor(i / this.boardSize);
      const c = i % this.boardSize;

      // 컨트롤러 조작 가이드 안내 태그 배지 (.controller-guide-label) 생성
      let guideText = '';
      let guideClass = '';

      if (r === 0 && c === 0) {
        const mode = this.gestureRecognizer ? this.gestureRecognizer.getCell11Mode() : 'row';
        guideText = mode === 'col' ? '1열' : '1행';
        guideClass = mode === 'col' ? 'guide-col' : 'guide-row';
      } else if (c === 0 && r > 0) {
        guideText = `${r + 1}행`;
        guideClass = 'guide-row';
      } else if (r === 0 && c > 0) {
        guideText = `${c + 1}열`;
        guideClass = 'guide-col';
      } else if (r === this.boardSize - 1 && c === this.boardSize - 1) {
        guideText = '↖대각';
        guideClass = 'guide-diag';
      } else if (r === 1 && c === this.boardSize - 1) {
        guideText = '↗대각';
        guideClass = 'guide-diag';
      }

      if (guideText) {
        const guideTag = document.createElement('div');
        guideTag.className = `controller-guide-label ${guideClass}`;
        guideTag.innerText = guideText;
        if (r === 0 && c === 0) {
          guideTag.id = 'guide-label-11';
        }
        box.appendChild(guideTag);
      }

      // 1행 1열 (i === 0)일 때만 오른쪽 중간에 보라색 토글 점 부착
      if (i === 0) {
        const dot = document.createElement('div');
        dot.className = 'dot-toggle-11';
        dot.title = '클릭하여 1행 / 1열 변환 모드 전환';
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          const mode = this.gestureRecognizer.toggleCell11Mode();
          dot.classList.toggle('col-mode', mode === 'col');
          soundEngine.playTap();

          // 가이드 태그 동적 변경 (1행 <-> 1열)
          const tag11 = document.getElementById('guide-label-11');
          if (tag11) {
            tag11.innerText = mode === 'col' ? '1열' : '1행';
            tag11.className = `controller-guide-label ${mode === 'col' ? 'guide-col' : 'guide-row'}`;
          }

          // 팝업창 없이 1열(또는 1행)을 시각적으로 강조
          this.highlightActiveLine(mode);
        });
        box.appendChild(dot);
      }

      // 각 성분 오른쪽 하단 조그마한 상태 뱃지 (0, 1, 2, 3 및 대칭 기호)
      const badge = document.createElement('div');
      badge.className = 'cell-state-badge is-solved';
      badge.innerText = '0';
      box.appendChild(badge);

      this.boardGrid.appendChild(box);
    }
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

  private bindControls() {
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

    // 보드 크기 선택 이벤트
    document.querySelectorAll('#size-button-group .btn-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const newSize = parseInt(target.dataset.size || '3', 10);
        if (newSize === this.boardSize) return;

        document.querySelectorAll('#size-button-group .btn-pill').forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        this.setBoardSize(newSize);
      });
    });

    // 섞기 난이도(N수) 선택 이벤트
    document.querySelectorAll('#moves-button-group .btn-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const moves = parseInt(target.dataset.moves || '3', 10);
        this.scrambleMoves = moves;

        document.querySelectorAll('#moves-button-group .btn-pill').forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        this.updateStatusInfo();
        this.updateBestRecordBadge();
        this.scrambleBoard();
      });
    });

    document.getElementById('btn-scramble')?.addEventListener('click', () => {
      this.scrambleBoard();
    });

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

  private updateBestRecordBadge() {
    const badge = document.getElementById('badge-best-record');
    if (!badge) return;
    const rec = recordManager.getRecord(this.boardSize, this.scrambleMoves);
    if (rec && (rec.bestTimeMs !== null || rec.bestMoves !== null)) {
      const timeStr = rec.bestTimeMs !== null ? formatTime(rec.bestTimeMs) : '-';
      const moveStr = rec.bestMoves !== null ? `${rec.bestMoves}회` : '-';
      badge.innerText = `🏆 ${timeStr} / ${moveStr}`;
      badge.title = `최고 기록: ${timeStr} (${moveStr})`;
    } else {
      badge.innerText = '🏆 BEST: -';
      badge.title = '아직 클리어 기록이 없습니다';
    }
  }

  private setBoardSize(newSize: number) {
    this.boardSize = newSize;
    this.initBoardOps();
    this.rebuildBoardDOM();
    this.gestureRecognizer.setBoardSize(newSize);

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
      lbl.innerText = `${this.boardSize}×${this.boardSize} (${this.scrambleMoves}수 도전)`;
    }
  }

  private switchGroup(grp: SymmetryGroupKey) {
    this.currentGroup = grp;
    const badge = document.getElementById('badge-group-name');
    if (badge) badge.innerText = SYMMETRY_GROUPS[grp].name;

    ['btn-set-c2', 'btn-set-v4', 'btn-set-d4'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.toggle('active', id.endsWith(grp.toLowerCase()));
      }
    });

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

    // 연산 op에 따른 정밀 3D 대칭/회전 애니메이션 매핑
    let snapTransform = 'scale(0.92)';
    if (op === 'MX') {
      snapTransform = 'perspective(900px) scale(0.92) rotateX(180deg)'; // 가로 X축 대칭 (상하 뒤집힘)
    } else if (op === 'MY') {
      snapTransform = 'perspective(900px) scale(0.92) rotateY(180deg)'; // 세로 Y축 대칭 (좌우 뒤집힘)
    } else if (op === 'MD') {
      snapTransform = 'perspective(900px) scale(0.92) rotate3d(1, 1, 0, 180deg)'; // 주대각선 대칭
    } else if (op === 'MAD') {
      snapTransform = 'perspective(900px) scale(0.92) rotate3d(-1, 1, 0, 180deg)'; // 부대각선 대칭
    } else if (op === 'R90') {
      snapTransform = 'perspective(900px) scale(0.92) rotateZ(90deg)'; // 시계방향 90도 회전
    } else if (op === 'R180') {
      snapTransform = 'perspective(900px) scale(0.92) rotateZ(180deg)'; // 180도 회전
    } else if (op === 'R270') {
      snapTransform = 'perspective(900px) scale(0.92) rotateZ(270deg)'; // 시계방향 270도 회전
    }

    const ANIM_MS = 340;

    // 타일들에 회전/대칭 스냅 트랜스폼 애니메이션 적용
    lineCells.forEach(cellIdx => {
      const box = this.boardGrid.children[cellIdx] as HTMLElement;
      if (box) {
        box.style.transition = `transform ${ANIM_MS}ms cubic-bezier(0.2, 0.9, 0.3, 1)`;
        box.style.transform = snapTransform;
      }
    });

    setTimeout(() => {
      try {
        const prevOps = [...this.currentOps];

        // 대수적 라인 연산 적용
        this.currentOps = applyLineMoveGeneric(this.currentOps, lineCells, op);

        if (recordHistory) {
          // 첫 조작 시 초시계 시작
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

        // 보드 Canvas 상태 및 텍스트 갱신
        this.updateBoard();

        // 트랜지션 해제 후 원래 위치로 즉시 스냅 (깜빡임 없음)
        lineCells.forEach(cellIdx => {
          const box = this.boardGrid.children[cellIdx] as HTMLElement;
          if (box) {
            box.style.transition = 'none';
            box.style.transform = '';
          }
        });

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            lineCells.forEach(cellIdx => {
              const box = this.boardGrid.children[cellIdx] as HTMLElement;
              if (box) box.style.transition = '';
            });
          });
        });

        this.checkWinCondition();
      } finally {
        this.isAnimating = false;
        this.gestureRecognizer.setLocked(false);
      }
    }, ANIM_MS);
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
    this.isGameStarted = false;
    recordManager.resetTimer();
    const timerEl = document.getElementById('label-timer');
    if (timerEl) timerEl.innerText = '00:00.0';

    const lines = generateLines(this.boardSize);
    const lineCellsList = generateLineCells(this.boardSize);
    const groupDef = SYMMETRY_GROUPS[this.currentGroup];
    const validOps = groupDef.ops.filter(o => o !== D4.ID);

    let ops = Array(this.boardSize * this.boardSize).fill(D4.ID);

    for (let i = 0; i < this.scrambleMoves; i++) {
      const lineId = Math.floor(Math.random() * lines.length);
      const randOp = validOps[Math.floor(Math.random() * validOps.length)];
      ops = applyLineMoveGeneric(ops, lineCellsList[lineId], randOp);
    }

    this.currentOps = ops;
    this.moveHistory = [];
    this.movesCount = 0;
    this.updateMovesLabel();
    this.updateBestRecordBadge();
    soundEngine.playTap();
    this.updateBoard();
  }

  private giveHint() {
    if (this.currentOps.every(o => o === D4.ID)) {
      soundEngine.playWin();
      return;
    }

    const steps = solveBoard(this.currentOps, this.boardSize, this.currentGroup);
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
    const steps = solveBoard(this.currentOps, this.boardSize, this.currentGroup);
    showSolutionModal(
      steps,
      () => this.runAutoSolve(steps),
      () => {}
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
    if (lbl) lbl.innerText = `${this.movesCount} 회`;
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
    const total = this.boardSize * this.boardSize;
    for (let i = 0; i < total; i++) {
      const box = this.boardGrid.children[i];
      if (!box) continue;
      const canvas = box.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) continue;

      const op = this.currentOps[i];
      renderDogTileCanvas(canvas, op, this.imgDogFront, this.imgDogBack);

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
