# -*- coding: utf-8 -*-
"""
update_formula_modal_favorites.py
src/ui/formulaModal.ts에 즐겨찾기(Favorites) UX 및 LocalStorage 로직 추가
"""

import re

filepath = 'C:/Users/user/matrix-cube/src/ui/formulaModal.ts'
with open(filepath, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Export FAVORITES_STORAGE_KEY and imports
if 'export const FAVORITES_STORAGE_KEY' not in code:
    code = code.replace(
        "import {\n  FORMULAS,",
        "export const FAVORITES_STORAGE_KEY = 'galois_cube_favorite_formulas';\n\nimport {\n  FORMULAS,"
    )

# 2. Add favoriteIds and methods in FormulaModalController
fav_props = """  // Round 7: 즐겨찾기(Favorites) 상태 및 영구 보존 Set
  private favoriteIds: Set<string> = new Set();
"""

if 'private favoriteIds:' not in code:
    code = code.replace(
        "  // Round 5: 실시간 검색 및 태그 필터 상태\n  private searchQuery: string = '';",
        fav_props + "\n  // Round 5: 실시간 검색 및 태그 필터 상태\n  private searchQuery: string = '';"
    )

# In constructor, add this.loadFavorites();
if 'this.loadFavorites();' not in code:
    code = code.replace(
        "    this.themeUnsubscribe = onThemeChange(() => {\n      if (this.isOpen()) {\n        this.renderMiniBoard();\n      }\n    });",
        "    this.themeUnsubscribe = onThemeChange(() => {\n      if (this.isOpen()) {\n        this.renderMiniBoard();\n      }\n    });\n\n    this.loadFavorites();"
    )

# Add favorites helper methods after constructor or getters
fav_methods = """
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
"""

if 'public toggleFavorite(' not in code:
    code = code.replace(
        "  public getSelectedTag(): string | 'all' {\n    return this.selectedTag;\n  }",
        "  public getSelectedTag(): string | 'all' {\n    return this.selectedTag;\n  }\n" + fav_methods
    )

# Update applyFilterAndRender to handle 'favorites'
old_apply = """  private applyFilterAndRender(): void {
    const filtered = filterFormulas(FORMULAS, this.searchQuery, this.currentCategory, this.selectedTag);
    if (filtered.length > 0 && !filtered.some((f) => f.id === this.currentFormulaId)) {
      this.currentFormulaId = filtered[0].id;
      this.currentStepIndex = 0;
      this.stopAutoPlay();
      this.renderDetail();
    }
    this.renderFormulaList();
  }"""

new_apply = """  private getFilteredFormulas(): FormulaItem[] {
    let pool = FORMULAS;
    if (this.currentCategory === 'favorites') {
      pool = pool.filter((f) => this.isFavorite(f.id));
      return filterFormulas(pool, this.searchQuery, 'all', this.selectedTag);
    }
    return filterFormulas(pool, this.searchQuery, this.currentCategory, this.selectedTag);
  }

  private applyFilterAndRender(): void {
    const filtered = this.getFilteredFormulas();
    if (filtered.length > 0 && !filtered.some((f) => f.id === this.currentFormulaId)) {
      this.currentFormulaId = filtered[0].id;
      this.currentStepIndex = 0;
      this.stopAutoPlay();
      this.renderDetail();
    }
    this.renderFormulaList();
  }"""

if old_apply in code:
    code = code.replace(old_apply, new_apply, 1)

# Update renderTabs to include 'favorites' tab
old_tabs = """    const tabs: Array<{ key: FormulaCategory | 'all'; label: string; icon: string }> = [
      { key: 'all', label: t('formula.tabAll'), icon: '🌟' },
      { key: 'basics', label: t('formula.tabBasic'), icon: '📐' },
      { key: 'rotation', label: isKo ? '회전 공식' : 'Rotation', icon: '🔄' },
      { key: 'reflection', label: isKo ? '반사 공식' : 'Reflection', icon: '🪞' },
      { key: 'godTechnique', label: t('formula.tabGodTechnique'), icon: '⚡' },
      { key: 'ai-mined', label: isKo ? '🤖 AI 발굴 공식' : '🤖 AI Mined', icon: '🤖' }
    ];"""

new_tabs = """    const tabs: Array<{ key: FormulaCategory | 'all' | 'favorites'; label: string; icon: string }> = [
      { key: 'all', label: t('formula.tabAll'), icon: '🌟' },
      { key: 'favorites', label: t('formula.tabFavorites'), icon: '⭐' },
      { key: 'basics', label: t('formula.tabBasic'), icon: '📐' },
      { key: 'rotation', label: isKo ? '회전 공식' : 'Rotation', icon: '🔄' },
      { key: 'reflection', label: isKo ? '반사 공식' : 'Reflection', icon: '🪞' },
      { key: 'godTechnique', label: t('formula.tabGodTechnique'), icon: '⚡' },
      { key: 'ai-mined', label: isKo ? '🤖 AI 발굴 공식' : '🤖 AI Mined', icon: '🤖' }
    ];"""

if old_tabs in code:
    code = code.replace(old_tabs, new_tabs, 1)

# Update renderFormulaList
old_render_list = """    const formulas = filterFormulas(FORMULAS, this.searchQuery, this.currentCategory, this.selectedTag);

    if (formulas.length === 0) {
      const msg = this.searchQuery.trim()
        ? t('formula.searchEmptyMsg')
        : (isKo ? '해당 카테고리의 공식이 없습니다.' : 'No formulas found in this category.');
      listNav.innerHTML = `<div class="formula-empty-msg">${msg}</div>`;
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
    });"""

new_render_list = """    const formulas = this.getFilteredFormulas();

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
    });"""

if old_render_list in code:
    code = code.replace(old_render_list, new_render_list, 1)

# Update renderDetail to include favorite button in header
old_detail_header = """          <div class="formula-detail-badge-group">
            <span class="formula-badge-category ${formula.category}">${badge}</span>
            <span class="formula-stars-tag">난이도 ${'★'.repeat(formula.difficulty)}${'☆'.repeat(5 - formula.difficulty)}</span>
            ${formula.isInteractive ? `<span class="formula-interactive-pill">🎮 ${t('formula.badgeInteractive')}</span>` : ''}
          </div>"""

new_detail_header = """          <div class="formula-detail-badge-group">
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
          </div>"""

if old_detail_header in code:
    code = code.replace(old_detail_header, new_detail_header, 1)

# In bindDetailEvents or renderDetail, bind btn-detail-favorite event
old_bind = """    // 공식 원클릭 복사 이벤트 (Round 6)
    const copyBtn = panel.querySelector('#btn-copy-formula');"""

new_bind = """    // 상세 뷰 즐겨찾기 토글 이벤트 (Round 7)
    panel.querySelector('#btn-detail-favorite')?.addEventListener('click', () => {
      this.toggleFavorite(formula.id);
    });

    // 공식 원클릭 복사 이벤트 (Round 6)
    const copyBtn = panel.querySelector('#btn-copy-formula');"""

if old_bind in code:
    code = code.replace(old_bind, new_bind, 1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(code)

print('formulaModal.ts successfully updated with Favorites UX!')
