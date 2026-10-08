import './styles/main.css';
import { D4Op, D4, SymmetryGroupKey, SYMMETRY_GROUPS, OP_TO_INT, COMPOSE_TABLE, INT_TO_OP } from './core/group';
import { LINES_3X3, LINE_CELLS_3X3, LineTarget, decodeBoardOps, encodeBoardOps } from './core/board';
import { solveBoard, MoveStep } from './core/solver';
import { soundEngine } from './audio/audioEngine';
import { campaignManager, STAGES } from './game/campaign';
import { renderDogTileCanvas } from './ui/tileRenderer';
import { GestureRecognizer } from './ui/gesture';
import { showSolutionModal } from './ui/solutionModal';

class MatrixCubeApp {
  private currentOps: D4Op[] = Array(9).fill(D4.ID);
  private currentGroup: SymmetryGroupKey = 'D4';
  private moveHistory: Array<{ lineId: number; op: D4Op; prevOps: D4Op[] }> = [];
  private movesCount = 0;
  private currentStageId = 1;
  private isAnimating = false;

  private imgDogFront = new Image();
  private imgDogBack = new Image();

  private boardGrid!: HTMLElement;
  private gestureCanvas!: HTMLCanvasElement;
  private gestureRecognizer!: GestureRecognizer;

  constructor() {
    this.initImages();
    this.renderLayout();
    this.bindControls();
    this.updateBoard();
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
        <div class="header-title">🧩 행렬 큐브 (Matrix Cube)</div>
        <div class="header-actions">
          <button id="btn-toggle-bgm" class="btn-icon">🔇 BGM</button>
          <button id="btn-toggle-sfx" class="btn-icon">🔊 SFX</button>
        </div>
      </div>

      <div class="status-bar">
        <span class="badge-group" id="badge-group-name">D₄ (정사면군)</span>
        <span id="label-stage-info">스테이지 1</span>
        <span id="label-moves">0 회 조작</span>
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
        <button id="btn-set-d4" class="btn-icon" style="flex:1; background:#0284c7;">D₄ 모드</button>
      </div>
    `;

    this.boardGrid = document.getElementById('board-grid')!;
    this.gestureCanvas = document.getElementById('gesture-canvas') as HTMLCanvasElement;

    // 타일 그리드 엘리먼트 9개 생성
    this.boardGrid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const box = document.createElement('div');
      box.className = 'cell-box';
      const canvas = document.createElement('canvas');
      canvas.className = 'cell-canvas';
      canvas.width = 100;
      canvas.height = 100;
      box.appendChild(canvas);
      this.boardGrid.appendChild(box);
    }

    // 제스처 인식기 활성화
    this.gestureRecognizer = new GestureRecognizer(
      this.boardGrid,
      this.gestureCanvas,
      (target, op) => this.handleLineOperation(target, op)
    );
  }

  private bindControls() {
    document.getElementById('btn-toggle-bgm')?.addEventListener('click', (e) => {
      const on = soundEngine.toggleBgm();
      (e.target as HTMLElement).innerText = on ? '🎵 BGM' : '🔇 BGM';
    });

    document.getElementById('btn-toggle-sfx')?.addEventListener('click', (e) => {
      const on = soundEngine.toggleSfx();
      (e.target as HTMLElement).innerText = on ? '🔊 SFX' : '🔈 SFX';
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

  private switchGroup(grp: SymmetryGroupKey) {
    this.currentGroup = grp;
    const badge = document.getElementById('badge-group-name');
    if (badge) badge.innerText = SYMMETRY_GROUPS[grp].name;

    ['btn-set-c2', 'btn-set-v4', 'btn-set-d4'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.style.background = id.endsWith(grp.toLowerCase()) ? '#0284c7' : '#334155';
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

    // 타겟 라인 ID 찾기
    const lineId = LINES_3X3.findIndex(l => l.type === target.type && l.idx === target.idx);
    if (lineId === -1) return;

    this.applyMove(lineId, validOp);
  }

  private applyMove(lineId: number, op: D4Op, recordHistory = true) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.gestureRecognizer.setLocked(true);

    soundEngine.playFlip();

    const lineCells = LINE_CELLS_3X3[lineId];

    // 3D 스냅 애니메이션 적용
    lineCells.forEach(cellIdx => {
      const box = this.boardGrid.children[cellIdx] as HTMLElement;
      box.style.transform = 'scale(0.92) rotateY(180deg)';
    });

    setTimeout(() => {
      const prevOps = [...this.currentOps];

      // 대수적 라인 연산 적용
      for (const c of lineCells) {
        const curInt = OP_TO_INT[this.currentOps[c]];
        const opInt = OP_TO_INT[op];
        const nextInt = COMPOSE_TABLE[curInt * 8 + opInt];
        this.currentOps[c] = INT_TO_OP[nextInt];
      }

      if (recordHistory) {
        this.moveHistory.push({ lineId, op, prevOps });
        this.movesCount++;
        this.updateMovesLabel();
      }

      lineCells.forEach(cellIdx => {
        const box = this.boardGrid.children[cellIdx] as HTMLElement;
        box.style.transform = '';
      });

      this.updateBoard();
      this.isAnimating = false;
      this.gestureRecognizer.setLocked(false);

      this.checkWinCondition();
    }, 280);
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
    const stage = STAGES.find(s => s.id === this.currentStageId) || STAGES[0];
    const moves = stage.scrambleMoves || 3;

    let code = 0;
    const groupDef = SYMMETRY_GROUPS[this.currentGroup];
    const validOps = groupDef.ops.filter(o => o !== D4.ID);

    for (let i = 0; i < moves; i++) {
      const lineId = Math.floor(Math.random() * 8);
      const randOp = validOps[Math.floor(Math.random() * validOps.length)];
      const cells = LINE_CELLS_3X3[lineId];
      const curOps = decodeBoardOps(code);
      for (const c of cells) {
        const next = COMPOSE_TABLE[OP_TO_INT[curOps[c]] * 8 + OP_TO_INT[randOp]];
        curOps[c] = INT_TO_OP[next];
      }
      code = encodeBoardOps(curOps);
    }

    this.currentOps = decodeBoardOps(code);
    this.moveHistory = [];
    this.movesCount = 0;
    this.updateMovesLabel();
    soundEngine.playTap();
    this.updateBoard();
  }

  private giveHint() {
    const steps = solveBoard(this.currentOps, this.currentGroup, true);
    if (steps.length === 0) {
      alert('이미 완성된 상태입니다!');
      return;
    }
    const first = steps[0];
    alert(`💡 힌트: ${first.line.label}을 ${first.op} 방향으로 회전/반전해보세요! (남은 최소 수: ${steps.length}수)`);
  }

  private openSolution() {
    const steps = solveBoard(this.currentOps, this.currentGroup, true);
    showSolutionModal(
      steps,
      () => this.runAutoSolve(steps),
      () => {}
    );
  }

  private async runAutoSolve(steps: MoveStep[]) {
    for (const step of steps) {
      if (encodeBoardOps(this.currentOps) === 0) break;
      await new Promise<void>(res => {
        this.applyMove(step.lineId, step.op, true);
        setTimeout(res, 520);
      });
    }
  }

  private checkWinCondition() {
    const isWin = this.currentOps.every(op => op === D4.ID);
    if (isWin) {
      soundEngine.playWin();
      const stars = campaignManager.completeStage(this.currentStageId, this.movesCount);
      setTimeout(() => {
        alert(`🎉 축하합니다! 퍼즐을 완벽하게 맞추셨습니다!\n별점: ${'⭐'.repeat(stars)}`);
      }, 350);
    }
  }

  private updateMovesLabel() {
    const lbl = document.getElementById('label-moves');
    if (lbl) lbl.innerText = `${this.movesCount} 회 조작`;
  }

  private updateBoard() {
    for (let i = 0; i < 9; i++) {
      const box = this.boardGrid.children[i];
      if (!box) continue;
      const canvas = box.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) continue;

      renderDogTileCanvas(canvas, this.currentOps[i], this.imgDogFront, this.imgDogBack);
    }
  }
}

// 앱 실행
window.addEventListener('DOMContentLoaded', () => {
  new MatrixCubeApp();
});
