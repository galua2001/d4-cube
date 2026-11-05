/**
 * @file formulaModal.ts
 * @description 갈루아 큐브 공식 비법서(Formula Guidebook) 대화형 뷰어 모달
 * 군론 대칭 공식 및 신의 수 테크닉을 3×3 대화형 미니 보드와 함께 인터랙티브하게 학습하는 모달 컨트롤러
 * Round 5: 실시간 검색(Search Bar) 및 다차원 태그 칩(Tag Chips) 필터링 시스템 탑재
 */

export const FAVORITES_STORAGE_KEY = 'galois_cube_favorite_formulas';

import {
  FORMULAS,
  FormulaCategory,
  FormulaItem,
  FormulaSortOption,
  sortFormulas,
  getFormulaById,
  filterFormulas
} from '../data/formulas';
import { t, getCurrentLang, onLangChange } from '../i18n/translations';
import { getThemeImages, onThemeChange } from '../theme/characterTheme';
import { renderCharacterTileCanvas } from './tileRenderer';
import { soundEngine } from '../audio/audioEngine';

interface TagPreset {
  id: string;
  labelKo: string;
  labelEn: string;
}

const TAG_PRESETS: TagPreset[] = [
  { id: 'all', labelKo: '전체', labelEn: 'All' },
  { id: '2수', labelKo: '2수', labelEn: '2-Move' },
  { id: '3수', labelKo: '3수', labelEn: '3-Move' },
  { id: '4수', labelKo: '4수', labelEn: '4-Move' },
  { id: '코너', labelKo: '코너', labelEn: 'Corner' },
  { id: '십자', labelKo: '십자', labelEn: 'Cross' },
  { id: '회전', labelKo: '회전', labelEn: 'Rotation' },
  { id: '반사', labelKo: '반사', labelEn: 'Reflection' },
  { id: '대각선', labelKo: '대각선', labelEn: 'Diagonal' },
  { id: '마스터', labelKo: '마스터', labelEn: 'Master' }
];

export class FormulaModalController {
  private onPracticeCallback?: (formula: FormulaItem) => void;

  public setPracticeCallback(cb: (formula: FormulaItem) => void): void {
    this.onPracticeCallback = cb;
  }

  private overlay: HTMLElement | null = null;
  private currentCategory: FormulaCategory | 'all' = 'all';
  private currentFormulaId: string = 'center-inversion';
  private currentStepIndex: number = 0;
  private isPlaying: boolean = false;
  private playTimerId: number | null = null;
  private playSpeed: number = 1.0;
  private toastTimerId: number | null = null;
  private langUnsubscribe: (() => void) | null = null;
  private themeUnsubscribe: (() => void) | null = null;
  private keyDownHandler: ((e: KeyboardEvent) => void) | null = null;

  // Round 7: 즐겨찾기(Favorites) 상태 및 영구 보존 Set
  private favoriteIds: Set<string> = new Set();

  // Round 5: 실시간 검색 및 태그 필터 상태
  private searchQuery: string = '';
  private selectedTag: string | 'all' = 'all';
  private currentSortOption: FormulaSortOption = 'default';

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

    this.loadFavorites();
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

    this.renderTabs();
    this.applyFilterAndRender();
  }

  /**
   * 실시간 검색 쿼리 설정 및 목록 필터링
   */
  public setSearchQuery(query: string): void {
    this.searchQuery = query;
    const inputEl = this.overlay?.querySelector('#formula-search-input') as HTMLInputElement | null;
    if (inputEl && inputEl.value !== query) {
      inputEl.value = query;
    }
    this.updateSearchClearButton();
    this.applyFilterAndRender();
  }

  /**
   * 태그 칩 선택 설정 및 목록 필터링
   */
  public setSelectedTag(tag: string | 'all'): void {
    this.selectedTag = tag;
    soundEngine.playTap();
    this.renderTagChips();
    this.applyFilterAndRender();
  }

  public getSearchQuery(): string {
    return this.searchQuery;
  }

  public getSelectedTag(): string | 'all' {
    return this.selectedTag;
  }

  /**
   * 공식 정렬 기준 설정 및 목록 재배치 (Round 8)
   */
  public setSortOption(option: FormulaSortOption): void {
    this.currentSortOption = option;
    const selectEl = this.overlay?.querySelector('#formula-sort-select') as HTMLSelectElement | null;
    if (selectEl && selectEl.value !== option) {
      selectEl.value = option;
    }
    soundEngine.playTap();
    this.applyFilterAndRender();
  }

  public getSortOption(): FormulaSortOption {
    return this.currentSortOption;
  }

  /**
   * LocalStorage에서 즐겨찾기 목록 복원 (Round 7)
   */
  public loadFavorites(): Set<string> {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            this.favoriteIds = new Set(parsed);
            return this.favoriteIds;
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load favorites from localStorage:', err);
    }
    this.favoriteIds = new Set();
    return this.favoriteIds;
  }

  /**
   * LocalStorage에 즐겨찾기 목록 영구 저장 (Round 7)
   */
  public saveFavorites(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(this.favoriteIds)));
      }
    } catch (err) {
      console.warn('Failed to save favorites to localStorage:', err);
    }
  }

  /**
   * 특정 공식의 즐겨찾기 여부 확인
   */
  public isFavorite(id: string): boolean {
    return this.favoriteIds.has(id);
  }

  /**
   * 공식 즐겨찾기 토글 (LocalStorage 동기화 및 UI 갱신)
   */
  public toggleFavorite(id: string): boolean {
    const isNowFav = !this.favoriteIds.has(id);
    if (isNowFav) {
      this.favoriteIds.add(id);
    } else {
      this.favoriteIds.delete(id);
    }
    this.saveFavorites();
    soundEngine.playTap();

    this.updateFavoriteUI(id, isNowFav);

    if (this.currentCategory === 'favorites') {
      this.applyFilterAndRender();
    }
    return isNowFav;
  }

  /**
   * 즐겨찾기 Set 사본 반환
   */
  public getFavorites(): Set<string> {
    return new Set(this.favoriteIds);
  }

  /**
   * 즐겨찾기 상태 변경 시 모달 내 버튼 UI 즉각 동기화
   */
  private updateFavoriteUI(id: string, isFav: boolean): void {
    // 1. 상세 뷰 헤더 별표 버튼 업데이트 (현재 보고 있는 공식일 때)
    if (this.currentFormulaId === id) {
      const detailFavBtn = this.overlay?.querySelector('#btn-detail-favorite');
      if (detailFavBtn) {
        detailFavBtn.classList.toggle('favorited', isFav);
        const iconEl = detailFavBtn.querySelector('.fav-icon');
        const textEl = detailFavBtn.querySelector('.fav-text');
        const newText = isFav ? t('formula.btnRemoveFromFavorites') : t('formula.btnAddToFavorites');
        if (iconEl) iconEl.textContent = isFav ? '⭐' : '☆';
        if (textEl) textEl.textContent = newText;
        detailFavBtn.setAttribute('title', newText);
      }
    }

    // 2. 목록 네비게이션 카드 별표 버튼 업데이트
    const cardFavBtn = this.overlay?.querySelector(`#btn-card-fav-${id}`);
    if (cardFavBtn) {
      cardFavBtn.classList.toggle('favorited', isFav);
      cardFavBtn.textContent = isFav ? '⭐' : '☆';
      const label = isFav ? t('formula.btnRemoveFromFavorites') : t('formula.btnAddToFavorites');
      cardFavBtn.setAttribute('title', label);
      cardFavBtn.setAttribute('aria-label', label);
    }
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

  public getPlaySpeed(): number {
    return this.playSpeed;
  }

  public setPlaySpeed(speed: number): void {
    this.playSpeed = speed;
    const speedBtns = this.overlay?.querySelectorAll('.formula-speed-btn');
    speedBtns?.forEach((b) => {
      const btnSpeed = parseFloat((b as HTMLElement).dataset.speed || '1.0');
      b.classList.toggle('active', btnSpeed === this.playSpeed);
    });

    if (this.isPlaying) {
      this.stopAutoPlay();
      this.startAutoPlay();
    }
  }

  public showToast(message: string): void {
    let toastEl = this.overlay?.querySelector('#formula-toast') as HTMLElement | null;
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'formula-toast';
      toastEl.className = 'formula-toast';
      const card = this.overlay?.querySelector('.formula-modal-card');
      if (card) {
        card.appendChild(toastEl);
      } else {
        this.overlay?.appendChild(toastEl);
      }
    }
    toastEl.textContent = message;
    toastEl.classList.add('show');

    if (this.toastTimerId !== null) {
      window.clearTimeout(this.toastTimerId);
    }
    this.toastTimerId = window.setTimeout(() => {
      toastEl?.classList.remove('show');
      this.toastTimerId = null;
    }, 2000);
  }

  private getFilteredFormulas(): FormulaItem[] {
    let pool = FORMULAS;
    if (this.currentCategory === 'favorites') {
      pool = pool.filter((f) => this.isFavorite(f.id));
      return filterFormulas(pool, this.searchQuery, 'all', this.selectedTag);
    }
    return filterFormulas(pool, this.searchQuery, this.currentCategory, this.selectedTag);
  }

  /**
   * 필터링 및 현재 정렬 옵션이 적용된 공식 목록 반환 (Round 8)
   */
  public getFilteredAndSortedFormulas(): FormulaItem[] {
    const isKo = getCurrentLang() === 'ko';
    const filtered = this.getFilteredFormulas();
    return sortFormulas(filtered, this.currentSortOption, isKo ? 'ko' : 'en');
  }

  private applyFilterAndRender(): void {
    const sorted = this.getFilteredAndSortedFormulas();
    if (sorted.length > 0 && !sorted.some((f) => f.id === this.currentFormulaId)) {
      this.currentFormulaId = sorted[0].id;
      this.currentStepIndex = 0;
      this.stopAutoPlay();
      this.renderDetail();
    }
    this.renderFormulaList();
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
    }, Math.round(1500 / this.playSpeed));
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
        // 검색 인풋창 포커스 중에는 스페이스바 자동재생 토글 제외
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;
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

        <!-- 실시간 검색 바 및 태그 칩 영역 -->
        <div class="formula-search-bar-wrapper">
          <div class="formula-search-box">
            <span class="formula-search-icon">🔍</span>
            <input
              type="text"
              id="formula-search-input"
              class="formula-search-input"
              placeholder="${t('formula.searchPlaceholder')}"
              value="${this.searchQuery}"
              autocomplete="off"
              spellcheck="false"
            />
            <button
              type="button"
              id="btn-formula-search-clear"
              class="formula-search-clear-btn ${this.searchQuery ? 'visible' : ''}"
              aria-label="${t('formula.searchClearBtn')}"
            >✕</button>
          </div>
          <div class="formula-tag-chips" id="formula-tag-chips"></div>
        </div>

        <!-- 카테고리 탭 바 -->
        <div class="formula-category-tabs" id="formula-category-tabs"></div>

        <!-- 메인 분할 뷰어 (좌측 목록 + 우측 상세) -->
        <div class="formula-body-layout">
          <!-- 좌측 공식 목록 네비게이션 -->
          <div class="formula-sidebar" id="formula-sidebar">
            <div class="formula-sidebar-header">
              <span class="formula-count-badge" id="formula-count-badge">공식 (0개)</span>
              <div class="formula-sort-wrapper">
                <label for="formula-sort-select" class="sr-only">${t('formula.sortLabel')}</label>
                <select id="formula-sort-select" class="formula-sort-select" aria-label="${t('formula.sortLabel')}">
                  <option value="default" ${this.currentSortOption === 'default' ? 'selected' : ''}>${t('formula.sortDefault')}</option>
                  <option value="diff-asc" ${this.currentSortOption === 'diff-asc' ? 'selected' : ''}>${t('formula.sortDiffAsc')}</option>
                  <option value="diff-desc" ${this.currentSortOption === 'diff-desc' ? 'selected' : ''}>${t('formula.sortDiffDesc')}</option>
                  <option value="name-asc" ${this.currentSortOption === 'name-asc' ? 'selected' : ''}>${t('formula.sortNameAsc')}</option>
                </select>
              </div>
            </div>
            <div class="formula-list-nav" id="formula-list-nav"></div>
          </div>

          <!-- 우측 공식 상세 및 3×3 인터랙티브 시뮬레이터 -->
          <div class="formula-detail-panel" id="formula-detail-panel"></div>
        </div>

        <!-- 복사 알림 토스트 (Round 6) -->
        <div class="formula-toast" id="formula-toast" role="status" aria-live="polite"></div>
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

    // 실시간 검색 인풋 이벤트
    const searchInput = this.overlay.querySelector('#formula-search-input') as HTMLInputElement | null;
    searchInput?.addEventListener('input', (e) => {
      const val = (e.target as HTMLInputElement).value;
      this.searchQuery = val;
      this.updateSearchClearButton();
      this.applyFilterAndRender();
    });

    // 검색어 지우기 버튼 이벤트
    const clearBtn = this.overlay.querySelector('#btn-formula-search-clear');
    clearBtn?.addEventListener('click', () => {
      this.setSearchQuery('');
      if (typeof searchInput?.focus === "function") { searchInput.focus(); }
    });

    // 공식 정렬 셀렉트 이벤트 (Round 8)
    const sortSelect = this.overlay.querySelector('#formula-sort-select') as HTMLSelectElement | null;
    sortSelect?.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value as FormulaSortOption;
      if (val) this.setSortOption(val);
    });
  }

  private updateSearchClearButton(): void {
    const clearBtn = this.overlay?.querySelector('#btn-formula-search-clear');
    if (!clearBtn) return;
    if (this.searchQuery.trim().length > 0) {
      clearBtn.classList.add('visible');
    } else {
      clearBtn.classList.remove('visible');
    }
  }

  private render(): void {
    this.renderTabs();
    this.renderTagChips();
    this.renderFormulaList();
    this.renderDetail();
  }

  private renderTabs(): void {
    const tabsContainer = this.overlay?.querySelector('#formula-category-tabs');
    if (!tabsContainer) return;

    const isKo = getCurrentLang() === 'ko';
    const tabs: Array<{ key: FormulaCategory | 'all' | 'favorites'; label: string; icon: string }> = [
      { key: 'all', label: t('formula.tabAll'), icon: '🌟' },
      { key: 'favorites', label: t('formula.tabFavorites'), icon: '⭐' },
      { key: 'basics', label: t('formula.tabBasic'), icon: '📐' },
      { key: 'rotation', label: isKo ? '회전 공식' : 'Rotation', icon: '🔄' },
      { key: 'reflection', label: isKo ? '반사 공식' : 'Reflection', icon: '🪞' },
      { key: 'godTechnique', label: t('formula.tabGodTechnique'), icon: '⚡' },
      { key: 'ai-mined', label: isKo ? '🤖 AI 발굴 공식' : '🤖 AI Mined', icon: '🤖' }
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

  private renderTagChips(): void {
    const chipsContainer = this.overlay?.querySelector('#formula-tag-chips');
    if (!chipsContainer) return;

    const isKo = getCurrentLang() === 'ko';
    chipsContainer.innerHTML = TAG_PRESETS.map((p) => {
      const label = isKo ? p.labelKo : p.labelEn;
      const isActive = this.selectedTag === p.id;
      return `
        <button
          type="button"
          class="formula-tag-chip ${isActive ? 'active' : ''}"
          data-tag="${p.id}"
          id="tag-chip-${p.id}"
        >
          ${label}
        </button>
      `;
    }).join('');

    chipsContainer.querySelectorAll('.formula-tag-chip').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tag = (e.currentTarget as HTMLElement).dataset.tag as string;
        if (tag) this.setSelectedTag(tag);
      });
    });
  }

  private renderFormulaList(): void {
    const listNav = this.overlay?.querySelector('#formula-list-nav');
    if (!listNav) return;

    const isKo = getCurrentLang() === 'ko';
    const formulas = this.getFilteredAndSortedFormulas();

    // 카운트 배지 및 정렬 셀렉트 박스 동기화 (Round 8)
    const countBadge = this.overlay?.querySelector('#formula-count-badge');
    if (countBadge) {
      countBadge.textContent = isKo ? `공식 (${formulas.length}개)` : `Formulas (${formulas.length})`;
    }
    const sortSelect = this.overlay?.querySelector('#formula-sort-select') as HTMLSelectElement | null;
    if (sortSelect && sortSelect.value !== this.currentSortOption) {
      sortSelect.value = this.currentSortOption;
    }

    if (formulas.length === 0) {
      let msg = '';
      if (this.currentCategory === 'favorites') {
        msg = t('formula.favoriteEmptyMsg');
      } else if (this.searchQuery.trim()) {
        msg = t('formula.searchEmptyMsg');
      } else {
        msg = isKo ? '해당 카테고리의 공식이 없습니다.' : 'No formulas found in this category.';
      }
      listNav.innerHTML = `<div class="formula-empty-msg">${msg}</div>`;
      return;
    }

    listNav.innerHTML = formulas
      .map((item) => {
        const title = isKo ? item.titleKo : item.titleEn;
        const badge = isKo ? item.badgeKo : item.badgeEn;
        const stars = '★'.repeat(item.difficulty);
        const isActive = item.id === this.currentFormulaId;
        const isFav = this.isFavorite(item.id);
        const favTitle = isFav ? t('formula.btnRemoveFromFavorites') : t('formula.btnAddToFavorites');

        return `
          <div class="formula-nav-card ${isActive ? 'active' : ''}" data-id="${item.id}" id="nav-item-${item.id}">
            <div class="formula-nav-card-top">
              <span class="formula-nav-badge">${badge}</span>
              <div class="formula-card-top-right">
                <span class="formula-nav-difficulty">${stars}</span>
                <button
                  type="button"
                  class="formula-card-fav-btn ${isFav ? 'favorited' : ''}"
                  data-id="${item.id}"
                  id="btn-card-fav-${item.id}"
                  title="${favTitle}"
                  aria-label="${favTitle}"
                >${isFav ? '⭐' : '☆'}</button>
              </div>
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

    listNav.querySelectorAll('.formula-card-fav-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = (btn as HTMLElement).dataset.id;
        if (id) {
          this.toggleFavorite(id);
        }
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
            <button
              type="button"
              class="formula-detail-fav-btn ${this.isFavorite(formula.id) ? 'favorited' : ''}"
              id="btn-detail-favorite"
              data-id="${formula.id}"
              title="${this.isFavorite(formula.id) ? t('formula.btnRemoveFromFavorites') : t('formula.btnAddToFavorites')}"
            >
              <span class="fav-icon">${this.isFavorite(formula.id) ? '⭐' : '☆'}</span>
              <span class="fav-text">${this.isFavorite(formula.id) ? t('formula.btnRemoveFromFavorites') : t('formula.btnAddToFavorites')}</span>
            </button>
          </div>
          <h3 class="formula-detail-title">${title}</h3>
          <div class="formula-notation-box">
            <div class="formula-notation-header">
              <span class="formula-notation-label">${t('formula.mathNotationLabel')}</span>
              <button class="btn-copy-formula" id="btn-copy-formula" type="button" title="${t('formula.btnCopy')}">
                <span class="copy-icon">📋</span>
                <span class="copy-text">${t('formula.btnCopy')}</span>
              </button>
            </div>
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

                <!-- 재생 컨트롤 바 & 속도 제어기 (Round 6) -->
                <div class="step-playback-bar">
                  <div class="step-playback-main-btns">
                    <button class="formula-ctrl-btn" id="btn-step-prev">◀</button>
                    <button class="formula-ctrl-btn primary" id="btn-step-play">▶ ${t('formula.btnPlay')}</button>
                    <button class="formula-ctrl-btn" id="btn-step-next">▶</button>
                    <button class="formula-ctrl-btn" id="btn-step-reset">↺ ${t('formula.btnReset')}</button>
                  </div>
                  <div class="step-speed-selector" id="step-speed-selector">
                    <button class="formula-speed-btn ${this.playSpeed === 0.5 ? 'active' : ''}" data-speed="0.5" id="btn-speed-05x">${t('formula.speed05x')}</button>
                    <button class="formula-speed-btn ${this.playSpeed === 1.0 ? 'active' : ''}" data-speed="1.0" id="btn-speed-1x">${t('formula.speed1x')}</button>
                    <button class="formula-speed-btn ${this.playSpeed === 2.0 ? 'active' : ''}" data-speed="2.0" id="btn-speed-2x">${t('formula.speed2x')}</button>
                  </div>
                </div>

                <!-- 실전 보드 연습 액션 바 -->
                <div class="formula-practice-cta-box">
                  <button class="btn-practice-formula" id="btn-practice-formula" data-formula-id="${formula.id}">
                    <span class="cta-icon">🚀</span>
                    <span class="cta-text">${t('formula.btnPracticeOnBoard')}</span>
                    <span class="cta-badge">${formula.difficulty}${t('settings.movesSuffix')} 도전</span>
                  </button>
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
      this.bindDetailEvents(formula);
      this.renderStepInfo();
      this.renderMiniBoard();
    }
  }

  private bindDetailEvents(formula: FormulaItem): void {
    const panel = this.overlay?.querySelector('#formula-detail-panel');
    if (!panel) return;

    panel.querySelector('#btn-step-prev')?.addEventListener('click', () => {
      this.stopAutoPlay();
      if (this.currentStepIndex > 0) {
        this.setStep(this.currentStepIndex - 1);
      }
    });

    panel.querySelector('#btn-step-next')?.addEventListener('click', () => {
      this.stopAutoPlay();
      const steps = formula.steps ?? [];
      if (this.currentStepIndex < steps.length - 1) {
        this.setStep(this.currentStepIndex + 1);
      }
    });

    panel.querySelector('#btn-step-play')?.addEventListener('click', () => {
      this.togglePlay();
    });

    panel.querySelector('#btn-step-reset')?.addEventListener('click', () => {
      this.resetStep();
    });

    // 상세 뷰 즐겨찾기 토글 이벤트 (Round 7)
    panel.querySelector('#btn-detail-favorite')?.addEventListener('click', () => {
      this.toggleFavorite(formula.id);
    });

    // 공식 원클릭 복사 이벤트 (Round 6)
    const copyBtn = panel.querySelector('#btn-copy-formula');
    copyBtn?.addEventListener('click', async () => {
      soundEngine.playTap();
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(formula.formulaSeq);
        }
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
      this.showToast(t('formula.copiedToast'));
      copyBtn.classList.add('copied');
      window.setTimeout(() => copyBtn.classList.remove('copied'), 1500);
    });

    // 재생 속도 제어 버튼군 이벤트 (Round 6)
    panel.querySelector('#btn-speed-05x')?.addEventListener('click', () => this.setPlaySpeed(0.5));
    panel.querySelector('#btn-speed-1x')?.addEventListener('click', () => this.setPlaySpeed(1.0));
    panel.querySelector('#btn-speed-2x')?.addEventListener('click', () => this.setPlaySpeed(2.0));
    panel.querySelectorAll('.formula-speed-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const speed = parseFloat((btn as HTMLElement).dataset.speed || '1.0');
        soundEngine.playTap();
        this.setPlaySpeed(speed);
      });
    });

    // 실전 보드 연습하기 버튼 이벤트
    panel.querySelector('#btn-practice-formula')?.addEventListener('click', () => {
      soundEngine.playTap();
      if (this.onPracticeCallback) {
        this.onPracticeCallback(formula);
      }
      this.close();
    });
  }

  private renderStepInfo(): void {
    const formula = getFormulaById(this.currentFormulaId);
    if (!formula || !formula.steps || formula.steps.length === 0) return;

    const steps = formula.steps;
    const currentStep = steps[this.currentStepIndex];
    if (!currentStep) return;

    const isKo = getCurrentLang() === 'ko';

    // 카운터 뱃지
    const counterEl = this.overlay?.querySelector('#formula-step-counter');
    if (counterEl) {
      counterEl.textContent = `${this.currentStepIndex} / ${steps.length - 1} ${t('formula.stepMove', { step: '' }).trim()}`;
    }

    // 단계 액션 제목
    const titleEl = this.overlay?.querySelector('#step-action-title');
    if (titleEl) {
      titleEl.textContent = isKo ? currentStep.labelKo : currentStep.labelEn;
    }

    // 설명 텍스트
    const descEl = this.overlay?.querySelector('#step-action-desc');
    if (descEl) {
      descEl.textContent = isKo ? currentStep.actionDescKo : currentStep.actionDescEn;
    }

    // 수학적 통찰
    const insightEl = this.overlay?.querySelector('#step-math-insight');
    if (insightEl) {
      const insight = isKo ? currentStep.mathInsightKo : currentStep.mathInsightEn;
      if (insight) {
        insightEl.textContent = `💡 ${insight}`;
        insightEl.classList.remove('hidden');
      } else {
        insightEl.classList.add('hidden');
      }
    }

    // 점프 버튼 렌더링
    const jumpContainer = this.overlay?.querySelector('#step-jump-buttons');
    if (jumpContainer) {
      jumpContainer.innerHTML = steps
        .map((_, idx) => {
          const isActive = idx === this.currentStepIndex;
          const label = idx === 0 ? t('formula.stepInitial') : `${idx}${isKo ? '수' : 'M'}`;
          return `
            <button class="step-jump-btn ${isActive ? 'active' : ''}" data-step="${idx}">
              ${label}
            </button>
          `;
        })
        .join('');

      jumpContainer.querySelectorAll('.step-jump-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const s = Number((e.currentTarget as HTMLElement).dataset.step);
          if (!isNaN(s)) {
            this.stopAutoPlay();
            this.setStep(s);
          }
        });
      });
    }

    this.updatePlayButton();
  }

  private updatePlayButton(): void {
    const playBtn = this.overlay?.querySelector('#btn-step-play');
    if (!playBtn) return;
    if (this.isPlaying) {
      playBtn.innerHTML = `⏸ ${t('formula.btnPause')}`;
      playBtn.classList.add('playing');
    } else {
      playBtn.innerHTML = `▶ ${t('formula.btnPlay')}`;
      playBtn.classList.remove('playing');
    }
  }

  private renderMiniBoard(): void {
    const formula = getFormulaById(this.currentFormulaId);
    if (!formula || !formula.steps || formula.steps.length === 0) return;

    const currentStep = formula.steps[this.currentStepIndex];
    if (!currentStep) return;

    const boardOps = currentStep.boardOps;
    const highlightCells = new Set(currentStep.highlightCells ?? []);
    const themeImages = getThemeImages();

    for (let i = 0; i < 9; i++) {
      const tileBox = this.overlay?.querySelector(`#formula-tile-${i}`);
      const canvas = this.overlay?.querySelector(`#formula-canvas-${i}`) as HTMLCanvasElement | null;
      const badge = this.overlay?.querySelector(`#formula-badge-${i}`);

      if (tileBox) {
        tileBox.classList.toggle('highlight', highlightCells.has(i));
      }

      const op = boardOps[i];
      if (badge) {
        badge.textContent = op === 'ID' ? 'ID' : String(op);
        badge.className = `formula-mini-badge ${op === 'ID' ? 'identity' : 'active'}`;
      }

      if (canvas) {
        renderCharacterTileCanvas(canvas, op, themeImages.front, themeImages.back);
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
