import { MoveStep } from '../core/solver';
import { D4Op } from '../core/group';
import { generateLineCells, applyLineMoveGeneric } from '../core/board';
import { soundEngine } from '../audio/audioEngine';

/**
 * 군론 작용 수학적 원리 간결 요약
 */
export function getMathExplanation(lineLabel: string, op: D4Op): string {
  switch (op) {
    case 'MX':
      return `<b>↕ 가로 반사 (MX)</b>: ${lineLabel} 상하 뒤집기. 두 번 적용 시 항등원 복원 (<i>MX² = ID</i>)`;
    case 'MY':
      return `<b>↔ 세로 반사 (MY)</b>: ${lineLabel} 좌우 뒤집기. 두 번 적용 시 항등원 복원 (<i>MY² = ID</i>)`;
    case 'MD':
      return `<b>⤢ 주대각 반사 (MD)</b>: ${lineLabel} 전치. 두 반사의 합성으로 회전 분해 (<i>MD ∘ MX = R90</i>)`;
    case 'MAD':
      return `<b>⤡ 부대각 반사 (MAD)</b>: ${lineLabel} 역대각 전치. <i>MAD ∘ MX = R270</i>`;
    case 'R90':
      return `<b>↻ 90° 회전 (R90)</b>: 시계방향 회전. 4회 회전 시 원상 복구 (<i>R90⁴ = ID</i>)`;
    case 'R180':
      return `<b>🔄 180° 회전 (R180)</b>: 점대칭 반전. 가로와 세로 반사의 합성 (<i>MX ∘ MY = R180</i>)`;
    case 'R270':
      return `<b>↺ 270° 회전 (R270)</b>: 반시계방향 90° 회전 (<i>R90의 역원</i>)`;
    default:
      return `<b>✨ 항등원</b>: ${lineLabel} 정위치 복원`;
  }
}

export interface SolutionInlineCallbacks {
  onPreviewState: (ops: D4Op[], lineId: number | null) => void;
  onAutoSolve: () => void;
  onClose: () => void;
}

/**
 * 보드 아래쪽에 배치되는 인터랙티브 실시간 해설 패널
 */
export class SolutionInlinePanel {
  private containerEl: HTMLElement | null = null;
  private currentStepIdx = 0;
  private stateHistory: D4Op[][] = [];
  private steps: MoveStep[] = [];
  private callbacks: SolutionInlineCallbacks | null = null;

  public render(
    container: HTMLElement,
    initialOps: D4Op[],
    boardSize: number,
    steps: MoveStep[],
    callbacks: SolutionInlineCallbacks
  ): void {
    this.containerEl = container;
    this.steps = steps;
    this.callbacks = callbacks;
    this.currentStepIdx = 0;

    // 단계별 보드 상태 시뮬레이션 히스토리 계산
    const lineCellsList = generateLineCells(boardSize);
    this.stateHistory = [[...initialOps]];
    let cur = [...initialOps];

    for (const step of steps) {
      const cells = lineCellsList[step.lineId] || [];
      cur = applyLineMoveGeneric(cur, cells, step.op);
      this.stateHistory.push([...cur]);
    }

    this.buildHTML();
    this.bindEvents();
    soundEngine.playTap();
  }

  private buildHTML(): void {
    if (!this.containerEl) return;

    if (this.steps.length === 0) {
      this.containerEl.innerHTML = `
        <div class="inline-solution-panel">
          <div class="inline-solution-header">
            <span class="inline-solution-title">🎉 이미 완성된 상태입니다!</span>
            <button class="btn-solution-close" id="btn-sol-close">✕ 닫기</button>
          </div>
        </div>
      `;
      this.containerEl.querySelector('#btn-sol-close')?.addEventListener('click', () => {
        this.close();
      });
      return;
    }

    // 수별 알약 버튼 바 생성
    let pillsHtml = `
      <button class="sol-step-pill active" data-step="0">초기</button>
    `;
    this.steps.forEach((step, idx) => {
      pillsHtml += `
        <button class="sol-step-pill" data-step="${idx + 1}">
          ${idx + 1}수: ${step.line.label} ${step.op}
        </button>
      `;
    });

    const firstStep = this.steps[0];
    const initialExpl = firstStep
      ? getMathExplanation(firstStep.line.label, firstStep.op)
      : '초기 섞인 상태입니다. 각 수를 눌러보세요.';

    this.containerEl.innerHTML = `
      <div class="inline-solution-panel">
        <!-- 해설 패널 상단 바 -->
        <div class="inline-solution-header">
          <div class="inline-solution-title-wrap">
            <span class="inline-solution-badge">📖 최단 해법</span>
            <span class="inline-solution-title">총 ${this.steps.length}수 풀이 과정</span>
          </div>
          <div class="inline-solution-actions">
            <button class="btn-sol-action primary" id="btn-sol-autosolve">▶ 자동 풀기</button>
            <button class="btn-sol-action" id="btn-sol-close">✕ 닫기</button>
          </div>
        </div>

        <!-- 수별 알약 네비게이션 버튼 바 -->
        <div class="sol-step-pills-bar" id="sol-pills-bar">
          ${pillsHtml}
        </div>

        <!-- 실시간 수학적 원리 해설 카드 -->
        <div class="sol-math-card" id="sol-math-card">
          <div class="sol-math-step-name" id="sol-math-step-name">현재: 초기 상태</div>
          <div class="sol-math-content" id="sol-math-content">
            ${initialExpl}
          </div>
        </div>
      </div>
    `;
  }

  private bindEvents(): void {
    if (!this.containerEl) return;

    // 수별 버튼 클릭 이벤트
    const pills = this.containerEl.querySelectorAll('.sol-step-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const stepNum = parseInt((e.currentTarget as HTMLElement).dataset.step || '0', 10);
        this.selectStep(stepNum);
      });
    });

    // 자동 풀기 버튼
    this.containerEl.querySelector('#btn-sol-autosolve')?.addEventListener('click', () => {
      if (this.callbacks) {
        this.close();
        this.callbacks.onAutoSolve();
      }
    });

    // 닫기 버튼
    this.containerEl.querySelector('#btn-sol-close')?.addEventListener('click', () => {
      this.close();
    });
  }

  public selectStep(stepIdx: number): void {
    if (!this.containerEl) return;
    this.currentStepIdx = Math.max(0, Math.min(this.stateHistory.length - 1, stepIdx));

    // 버튼 활성화 갱신
    const pills = this.containerEl.querySelectorAll('.sol-step-pill');
    pills.forEach((p, idx) => {
      p.classList.toggle('active', idx === this.currentStepIdx);
    });

    // 해설 내용 갱신
    const nameEl = this.containerEl.querySelector('#sol-math-step-name');
    const contentEl = this.containerEl.querySelector('#sol-math-content');

    let lineId: number | null = null;
    if (this.currentStepIdx === 0) {
      if (nameEl) nameEl.textContent = '현재: 초기 섞인 상태';
      if (contentEl) contentEl.innerHTML = '1수부터 클릭하여 보드의 단계별 변화와 수학적 원리를 확인하세요.';
    } else {
      const step = this.steps[this.currentStepIdx - 1];
      lineId = step.lineId;
      if (nameEl) nameEl.textContent = `[${this.currentStepIdx}수] ${step.line.label} ➔ ${step.op} 변환`;
      if (contentEl) contentEl.innerHTML = getMathExplanation(step.line.label, step.op);
    }

    // 메인 보드에 해당 단계의 타일 상태 및 라인 하이라이트 반영
    if (this.callbacks) {
      this.callbacks.onPreviewState(this.stateHistory[this.currentStepIdx], lineId);
    }
    soundEngine.playTap();
  }

  public close(): void {
    if (this.containerEl) {
      this.containerEl.innerHTML = '';
    }
    if (this.callbacks) {
      this.callbacks.onClose();
    }
    soundEngine.playTap();
  }
}

export const solutionInlinePanel = new SolutionInlinePanel();
