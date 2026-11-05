/**
 * @file formulaModal.ts
 * @description 갈루아 큐브 공식 비법서(Formula Guidebook) 대화형 뷰어 모달
 * 군론 대칭 공식 및 신의 수 테크닉을 3×3 대화형 미니 보드와 함께 인터랙티브하게 학습하는 모달 컨트롤러
 */

import {
  FORMULAS,
  FormulaCategory,
  FormulaStep,
  getFormulasByCategory,
  getFormulaById
} from '../data/formulas';
import { t, getCurrentLang, onLangChange } from '../i18n/translations';
import { getThemeImages, onThemeChange } from '../theme/characterTheme';
import { renderCharacterTileCanvas } from './tileRenderer';
import { soundEngine } from '../audio/audioEngine';

export class FormulaModalController {
  private overlay: HTMLElement | null = null;
  private currentCategory: FormulaCategory | 'all' = 'all';
  private currentFormulaId: string = 'center-inversion';
  private currentStepIndex: number = 0;
  private isPlaying: boolean = false;
  private playTimerId: number | null = null;
  private langUnsubscribe: (() => void) | null = null;
  private themeUnsubscribe: (() => void) | null = null;
  private keyDownHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor() {
    this.langUnsubscribe = onLangChange(() => {
      if (this.isOpen()) {
        this.render();
      }
    });

    this.themeUnsubscribe = onThemeChange(() => {
      if (this.isOpen()) {
        this.renderMiniBoard();
      }
    });
  }

  public isOpen(): boolean {
    return this.overlay !== null && document.body.contains(this.overlay);
  }

  public open(formulaId?: string): void {
    if (this.isOpen()) {
      if (formulaId && formulaId !== this.currentFormulaId) {
        this.selectFormula(formulaId);
      }
      return;
    }

    if (formulaId && getFormulaById(formulaId)) {
      this.currentFormulaId = formulaId;
    } else if (!getFormulaById(this.currentFormulaId)) {
      this.currentFormulaId = FORMULAS[0]?.id ?? 'center-inversion';
    }

    this.currentStepIndex = 0;
    this.stopAutoPlay();

    soundEngine.playTap();
    this.createDom();
    this.render();
    this.bindGlobalKeys();
  }


  public destroy(): void {
    if (this.langUnsubscribe) {
      this.langUnsubscribe();
      this.langUnsubscribe = null;
    }
    if (this.themeUnsubscribe) {
      this.themeUnsubscribe();
      this.themeUnsubscribe = null;
    }
  }

  public close(): void {
    this.stopAutoPlay();

    if (this.keyDownHandler) {
      window.removeEventListener('keydown', this.keyDownHandler);
      this.keyDownHandler = null;
    }

    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    soundEngine.playTap();
  }

  public selectFormula(formulaId: string): void {
    const formula = getFormulaById(formulaId);
    if (!formula) return;

    this.currentFormulaId = formulaId;
    this.currentStepIndex = 0;
    this.stopAutoPlay();

    soundEngine.playTap();
    this.renderDetail();
    this.updateActiveNavCard();
  }

  public setCategory(cat: FormulaCategory | 'all'): void {
    this.currentCategory = cat;
    soundEngine.playTap();

    const filtered = getFormulasByCategory(this.currentCategory);
    if (filtered.length > 0 && !filtered.some((f) => f.id === this.currentFormulaId)) {
      this.currentFormulaId = filtered[0].id;
      this.currentStepIndex = 0;
      this.stopAutoPlay();
    }

    this.renderTabs();
    this.renderFormulaList();
    this.renderDetail();
  }

  public setStep(stepIdx: number): void {
    const formula = getFormulaById(this.currentFormulaId);
    if (!formula || !formula.steps || formula.steps.length === 0) return;

    const total = formula.steps.length;
    this.currentStepIndex = Math.max(0, Math.min(stepIdx, total - 1));

    soundEngine.playTap();
    this.renderStepInfo();
    this.renderMiniBoard();
  }

  public togglePlay(): void {
    if (this.isPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  public resetStep(): void {
    this.stopAutoPlay();
    this.setStep(0);
  }

  private startAutoPlay(): void {
    const formula = getFormulaById(this.currentFormulaId);
    if (!formula || !formula.steps || formula.steps.length <= 1) return;

    this.isPlaying = true;
    soundEngine.playTap();
    this.updatePlayButton();

    this.playTimerId = window.setInterval(() => {
      const currentFormula = getFormulaById(this.currentFormulaId);
      if (!currentFormula || !currentFormula.steps) {
        this.stopAutoPlay();
        return;
      }
      const nextStep = (this.currentStepIndex + 1) % currentFormula.steps.length;
      this.currentStepIndex = nextStep;
      soundEngine.playTap();
      this.renderStepInfo();
      this.renderMiniBoard();
    }, 1500);
  }

  private stopAutoPlay(): void {
    if (this.playTimerId !== null) {
      clearInterval(this.playTimerId);
      this.playTimerId = null;
    }
    this.isPlaying = false;
    this.updatePlayButton();
  }

  private bindGlobalKeys(): void {
    this.keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowRight') {
        const formula = getFormulaById(this.currentFormulaId);
        if (formula?.steps && this.currentStepIndex < formula.steps.length - 1) {
          this.setStep(this.currentStepIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (this.currentStepIndex > 0) {
          this.setStep(this.currentStepIndex - 1);
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        this.togglePlay();
      }
    };
    window.addEventListener('keydown', this.keyDownHandler);
  }

  private createDom(): void {
    const existing = document.getElementById('formula-modal-overlay');
    if (existing) existing.remove();

    this.overlay = document.createElement('div');
    this.overlay.id = 'formula-modal-overlay';
    this.overlay.className = 'formula-modal-overlay';

    this.overlay.innerHTML = `
      <div class="formula-modal-card" role="dialog" aria-modal="true" aria-labelledby="formula-modal-title">
        <!-- 상단 헤더 -->
        <div class="formula-header">
          <div class="formula-title-area">
            <h2 id="formula-modal-title">📖 ${t('formula.title')}</h2>
            <span class="formula-subtitle">${t('formula.subtitle')}</span>
          </div>
          <button id="btn-formula-close" class="formula-close-btn" aria-label="${t('formula.close')}">✕</button>
        </div>

        <!-- 카테고리 탭 바 -->
        <div class="formula-category-tabs" id="formula-category-tabs"></div>

        <!-- 메인 분할 뷰어 (좌측 목록 + 우측 상세) -->
        <div class="formula-body-layout">
          <!-- 좌측 공식 목록 네비게이션 -->
          <div class="formula-sidebar" id="formula-sidebar">
            <div class="formula-list-nav" id="formula-list-nav"></div>
          </div>

          <!-- 우측 공식 상세 및 3×3 인터랙티브 시뮬레이터 -->
          <div class="formula-detail-panel" id="formula-detail-panel"></div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // 이벤트 리스너 바인딩
    this.overlay.querySelector('#btn-formula-close')?.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
  }

  private render(): void {
    this.renderTabs();
    this.renderFormulaList();
    this.renderDetail();
  }

  private renderTabs(): void {
    const tabsContainer = this.overlay?.querySelector('#formula-category-tabs');
    if (!tabsContainer) return;

    const isKo = getCurrentLang() === 'ko';
    const tabs: Array<{ key: FormulaCategory | 'all'; label: string; icon: string }> = [
      { key: 'all', label: t('formula.tabAll'), icon: '🌟' },
      { key: 'basics', label: t('formula.tabBasic'), icon: '📐' },
      { key: 'rotation', label: isKo ? '회전 공식' : 'Rotation', icon: '🔄' },
      { key: 'reflection', label: isKo ? '반사 공식' : 'Reflection', icon: '🪞' },
      { key: 'godTechnique', label: t('formula.tabGodTechnique'), icon: '⚡' },
      { key: 'god-number', label: t('formula.tabAiMined'), icon: '🤖' }
    ];

    tabsContainer.innerHTML = tabs
      .map(
        (tab) => `
        <button class="formula-tab ${this.currentCategory === tab.key ? 'active' : ''}" data-category="${tab.key}">
          <span class="formula-tab-icon">${tab.icon}</span>
          <span class="formula-tab-text">${tab.label}</span>
        </button>
      `
      )
      .join('');

    tabsContainer.querySelectorAll('.formula-tab').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const cat = (e.currentTarget as HTMLElement).dataset.category as FormulaCategory | 'all';
        if (cat) this.setCategory(cat);
      });
    });
  }

  private renderFormulaList(): void {
    const listNav = this.overlay?.querySelector('#formula-list-nav');
    if (!listNav) return;

    const isKo = getCurrentLang() === 'ko';
    const formulas = getFormulasByCategory(this.currentCategory);

    if (formulas.length === 0) {
      listNav.innerHTML = `<div class="formula-empty-msg">${isKo ? '해당 카테고리의 공식이 없습니다.' : 'No formulas found in this category.'}</div>`;
      return;
    }

    listNav.innerHTML = formulas
      .map((item) => {
        const title = isKo ? item.titleKo : item.titleEn;
        const badge = isKo ? item.badgeKo : item.badgeEn;
        const stars = '★'.repeat(item.difficulty);
        const isActive = item.id === this.currentFormulaId;

        return `
          <div class="formula-nav-card ${isActive ? 'active' : ''}" data-id="${item.id}" id="nav-item-${item.id}">
            <div class="formula-nav-card-top">
              <span class="formula-nav-badge">${badge}</span>
              <span class="formula-nav-difficulty">${stars}</span>
            </div>
            <div class="formula-nav-title">${title}</div>
            <div class="formula-nav-seq">${item.formulaSeq}</div>
          </div>
        `;
      })
      .join('');

    listNav.querySelectorAll('.formula-nav-card').forEach((card) => {
      card.addEventListener('click', () => {
        const id = (card as HTMLElement).dataset.id;
        if (id) this.selectFormula(id);
      });
    });
  }

  private updateActiveNavCard(): void {
    const listNav = this.overlay?.querySelector('#formula-list-nav');
    if (!listNav) return;
    listNav.querySelectorAll('.formula-nav-card').forEach((card) => {
      const isCur = (card as HTMLElement).dataset.id === this.currentFormulaId;
      card.classList.toggle('active', isCur);
    });
  }

  private renderDetail(): void {
    const panel = this.overlay?.querySelector('#formula-detail-panel');
    if (!panel) return;

    const formula = getFormulaById(this.currentFormulaId);
    if (!formula) {
      panel.innerHTML = `<div class="formula-empty-detail">${t('formula.noFormulaSelected')}</div>`;
      return;
    }

    const isKo = getCurrentLang() === 'ko';
    const title = isKo ? formula.titleKo : formula.titleEn;
    const badge = isKo ? formula.badgeKo : formula.badgeEn;
    const summary = isKo ? formula.summaryKo : formula.summaryEn;
    const notes = isKo ? formula.notesKo : formula.notesEn;
    const steps = formula.steps ?? [];
    const hasSteps = steps.length > 0;

    panel.innerHTML = `
      <div class="formula-detail-card">
        <!-- 헤더 섹션 -->
        <div class="formula-detail-header">
          <div class="formula-detail-badge-group">
            <span class="formula-badge-category ${formula.category}">${badge}</span>
            <span class="formula-stars-tag">난이도 ${'★'.repeat(formula.difficulty)}${'☆'.repeat(5 - formula.difficulty)}</span>
            ${formula.isInteractive ? `<span class="formula-interactive-pill">🎮 ${t('formula.badgeInteractive')}</span>` : ''}
          </div>
          <h3 class="formula-detail-title">${title}</h3>
          <div class="formula-notation-box">
            <div class="formula-notation-label">${t('formula.mathNotationLabel')}</div>
            <div class="formula-notation-code">⚡ ${formula.formulaSeq}</div>
            ${formula.latexFormula ? `<div class="formula-latex-code">Formula: ${formula.latexFormula}</div>` : ''}
          </div>
          <p class="formula-detail-summary">${summary}</p>
        </div>

        <!-- 3×3 인터랙티브 시뮬레이터 섹션 -->
        ${
          hasSteps
            ? `
          <div class="formula-demo-section">
            <div class="formula-demo-title">
              <span>🎯 ${t('formula.demoSectionTitle')}</span>
              <span class="formula-step-pill" id="formula-step-counter"></span>
            </div>

            <div class="formula-demo-board-wrapper">
              <!-- 좌측: 3×3 미니 캔버스 보드 -->
              <div class="formula-mini-board-grid" id="formula-mini-board">
                ${Array(9)
                  .fill(0)
                  .map(
                    (_, idx) => `
                  <div class="formula-mini-tile-box" id="formula-tile-${idx}">
                    <canvas class="formula-mini-canvas" width="64" height="64" id="formula-canvas-${idx}"></canvas>
                    <span class="formula-mini-badge" id="formula-badge-${idx}">0</span>
                  </div>
                `
                  )
                  .join('')}
              </div>

              <!-- 우측: 단계 해설 및 컨트롤러 -->
              <div class="formula-step-ctrl-panel">
                <div class="step-explanation-box">
                  <div class="step-action-header" id="step-action-title"></div>
                  <div class="step-action-text" id="step-action-desc"></div>
                  <div class="step-insight-badge" id="step-math-insight"></div>
                </div>

                <!-- 단계 점프 버튼군 -->
                <div class="step-jump-buttons" id="step-jump-buttons"></div>

                <!-- 재생 컨트롤 바 -->
                <div class="step-playback-bar">
                  <button class="formula-ctrl-btn" id="btn-step-prev">◀</button>
                  <button class="formula-ctrl-btn primary" id="btn-step-play">▶ ${t('formula.btnPlay')}</button>
                  <button class="formula-ctrl-btn" id="btn-step-next">▶</button>
                  <button class="formula-ctrl-btn" id="btn-step-reset">↺ ${t('formula.btnReset')}</button>
                </div>
              </div>
            </div>
          </div>
        `
            : ''
        }

        <!-- 하단 실전 꿀팁 / 군론 배경 노트 -->
        ${
          notes && notes.length > 0
            ? `
          <div class="formula-notes-section">
            <div class="formula-notes-label">${t('formula.tipLabel')}</div>
            <ul class="formula-notes-list">
              ${notes.map((n) => `<li>${n}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }
      </div>
    `;

    if (hasSteps) {
      this.bindStepControls(steps);
      this.renderStepInfo();
      this.renderMiniBoard();
    }
  }

  private bindStepControls(steps: FormulaStep[]): void {
    const prevBtn = this.overlay?.querySelector('#btn-step-prev');
    const nextBtn = this.overlay?.querySelector('#btn-step-next');
    const playBtn = this.overlay?.querySelector('#btn-step-play');
    const resetBtn = this.overlay?.querySelector('#btn-step-reset');

    prevBtn?.addEventListener('click', () => {
      this.stopAutoPlay();
      if (this.currentStepIndex > 0) {
        this.setStep(this.currentStepIndex - 1);
      }
    });

    nextBtn?.addEventListener('click', () => {
      this.stopAutoPlay();
      if (this.currentStepIndex < steps.length - 1) {
        this.setStep(this.currentStepIndex + 1);
      }
    });

    playBtn?.addEventListener('click', () => {
      this.togglePlay();
    });

    resetBtn?.addEventListener('click', () => {
      this.resetStep();
    });
  }

  private renderStepInfo(): void {
    const formula = getFormulaById(this.currentFormulaId);
    if (!formula || !formula.steps) return;

    const steps = formula.steps;
    const curIdx = this.currentStepIndex;
    const step = steps[curIdx];
    if (!step) return;

    const isKo = getCurrentLang() === 'ko';

    // 카운터 알약
    const counterEl = this.overlay?.querySelector('#formula-step-counter');
    if (counterEl) {
      counterEl.textContent = t('formula.stepCount', {
        current: curIdx + 1,
        total: steps.length
      });
    }

    // 텍스트 설명
    const titleEl = this.overlay?.querySelector('#step-action-title');
    const descEl = this.overlay?.querySelector('#step-action-desc');
    const insightEl = this.overlay?.querySelector('#step-math-insight');

    if (titleEl) {
      titleEl.textContent = step.formulaBadge ?? (curIdx === 0 ? t('formula.stepInitial') : `${curIdx}수`);
    }

    if (descEl) {
      descEl.textContent = isKo ? step.actionDescKo : step.actionDescEn;
    }

    if (insightEl) {
      const insight = isKo ? step.mathInsightKo : step.mathInsightEn;
      if (insight) {
        insightEl.textContent = `💡 ${insight}`;
        (insightEl as HTMLElement).style.display = 'inline-block';
      } else {
        (insightEl as HTMLElement).style.display = 'none';
      }
    }

    // 단계 점프 버튼 렌더링
    const jumpContainer = this.overlay?.querySelector('#step-jump-buttons');
    if (jumpContainer) {
      jumpContainer.innerHTML = steps
        .map((_, idx) => {
          const label = idx === 0 ? (isKo ? '초기' : 'Init') : `${idx}수`;
          const activeClass = idx === curIdx ? 'active-step' : '';
          return `<button class="step-pill-btn ${activeClass}" data-step="${idx}">${label}</button>`;
        })
        .join('');

      jumpContainer.querySelectorAll('.step-pill-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          this.stopAutoPlay();
          const targetStep = Number((e.currentTarget as HTMLElement).dataset.step);
          if (!isNaN(targetStep)) {
            this.setStep(targetStep);
          }
        });
      });
    }

    this.updatePlayButton();
  }

  private updatePlayButton(): void {
    const playBtn = this.overlay?.querySelector('#btn-step-play');
    if (!playBtn) return;
    playBtn.textContent = this.isPlaying ? `⏸ ${t('formula.btnPause')}` : `▶ ${t('formula.btnPlay')}`;
    playBtn.classList.toggle('playing', this.isPlaying);
  }

  private renderMiniBoard(): void {
    const formula = getFormulaById(this.currentFormulaId);
    if (!formula || !formula.steps) return;

    const step = formula.steps[this.currentStepIndex];
    if (!step) return;

    const { front, back } = getThemeImages();

    for (let idx = 0; idx < 9; idx++) {
      const canvas = this.overlay?.querySelector(`#formula-canvas-${idx}`) as HTMLCanvasElement | null;
      const badge = this.overlay?.querySelector(`#formula-badge-${idx}`);
      const tileBox = this.overlay?.querySelector(`#formula-tile-${idx}`);

      const op = step.boardOps[idx] ?? 'ID';

      if (canvas) {
        renderCharacterTileCanvas(canvas, op, front, back);
      }

      if (badge) {
        badge.textContent = op === 'ID' ? '0' : op;
      }

      if (tileBox) {
        const isHighlight = step.highlightCells?.includes(idx);
        tileBox.classList.toggle('highlighted', Boolean(isHighlight));
      }
    }
  }
}

export const formulaModalController = new FormulaModalController();

export function showFormulaModal(formulaId?: string): void {
  formulaModalController.open(formulaId);
}

export function closeFormulaModal(): void {
  formulaModalController.close();
}
