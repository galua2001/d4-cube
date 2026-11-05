# -*- coding: utf-8 -*-
modal_path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.ts'

with open(modal_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. FormulaSortOption, sortFormulas import
old_import = """import {
  FORMULAS,
  FormulaCategory,
  FormulaItem,
  getFormulaById,
  filterFormulas
} from '../data/formulas';"""

new_import = """import {
  FORMULAS,
  FormulaCategory,
  FormulaItem,
  FormulaSortOption,
  sortFormulas,
  getFormulaById,
  filterFormulas
} from '../data/formulas';"""

if old_import in code:
    code = code.replace(old_import, new_import, 1)
    print("Updated formulas import!")
else:
    print("Could not find exact import block, checking regex...")

# 2. currentSortOption 프로퍼티 추가
old_prop = "  private selectedTag: string | 'all' = 'all';"
new_prop = """  private selectedTag: string | 'all' = 'all';
  private currentSortOption: FormulaSortOption = 'default';"""

if old_prop in code:
    code = code.replace(old_prop, new_prop, 1)
    print("Added currentSortOption property!")

# 3. setSortOption, getSortOption 메서드 추가
# setSelectedTag 아래에 추가
old_tag_methods = """  public getSelectedTag(): string | 'all' {
    return this.selectedTag;
  }"""

new_sort_methods = """  public getSelectedTag(): string | 'all' {
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
  }"""

if old_tag_methods in code:
    code = code.replace(old_tag_methods, new_sort_methods, 1)
    print("Added setSortOption and getSortOption methods!")

# 4. createDom() 내부 사이드바 헤더 및 정렬 셀렉트 박스 렌더링
old_sidebar_dom = """          <!-- 좌측 공식 목록 네비게이션 -->
          <div class="formula-sidebar" id="formula-sidebar">
            <div class="formula-list-nav" id="formula-list-nav"></div>
          </div>"""

new_sidebar_dom = """          <!-- 좌측 공식 목록 네비게이션 -->
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
          </div>"""

if old_sidebar_dom in code:
    code = code.replace(old_sidebar_dom, new_sidebar_dom, 1)
    print("Updated sidebar HTML with sort select and count badge!")

# 5. createDom() 정렬 이벤트 리스너 바인딩
old_clear_bind = """      this.setSearchQuery('');
      if (typeof searchInput?.focus === "function") { searchInput.focus(); }
    });"""

new_sort_bind = """      this.setSearchQuery('');
      if (typeof searchInput?.focus === "function") { searchInput.focus(); }
    });

    // 공식 정렬 셀렉트 이벤트 (Round 8)
    const sortSelect = this.overlay.querySelector('#formula-sort-select') as HTMLSelectElement | null;
    sortSelect?.addEventListener('change', (e) => {
      const val = (e.target as HTMLSelectElement).value as FormulaSortOption;
      if (val) this.setSortOption(val);
    });"""

if old_clear_bind in code:
    code = code.replace(old_clear_bind, new_sort_bind, 1)
    print("Bound change listener to #formula-sort-select!")

# 6. applyFilterAndRender 업데이트
old_filter_method = """  private applyFilterAndRender(): void {
    const filtered = filterFormulas(FORMULAS, this.searchQuery, this.currentCategory, this.selectedTag);
    if (filtered.length > 0 && !filtered.some((f) => f.id === this.currentFormulaId)) {
      this.currentFormulaId = filtered[0].id;
      this.currentStepIndex = 0;
      this.stopAutoPlay();
      this.renderDetail();
    }
    this.renderFormulaList();
  }"""

new_filter_method = """  private applyFilterAndRender(): void {
    const isKo = getCurrentLang() === 'ko';
    const filtered = filterFormulas(FORMULAS, this.searchQuery, this.currentCategory, this.selectedTag);
    const sorted = sortFormulas(filtered, this.currentSortOption, isKo ? 'ko' : 'en');
    if (sorted.length > 0 && !sorted.some((f) => f.id === this.currentFormulaId)) {
      this.currentFormulaId = sorted[0].id;
      this.currentStepIndex = 0;
      this.stopAutoPlay();
      this.renderDetail();
    }
    this.renderFormulaList();
  }"""

if old_filter_method in code:
    code = code.replace(old_filter_method, new_filter_method, 1)
    print("Updated applyFilterAndRender with sortFormulas!")

# 7. renderFormulaList 업데이트 (sortFormulas 적용 및 count badge 갱신)
old_render_list = """  private renderFormulaList(): void {
    const listNav = this.overlay?.querySelector('#formula-list-nav');
    if (!listNav) return;

    const isKo = getCurrentLang() === 'ko';
    const formulas = filterFormulas(FORMULAS, this.searchQuery, this.currentCategory, this.selectedTag);

    if (formulas.length === 0) {
      const msg = this.searchQuery.trim()
        ? t('formula.searchEmptyMsg')
        : (isKo ? '해당 카테고리의 공식이 없습니다.' : 'No formulas found in this category.');
      listNav.innerHTML = `<div class="formula-empty-msg">${msg}</div>`;
      return;
    }"""

new_render_list = """  private renderFormulaList(): void {
    const listNav = this.overlay?.querySelector('#formula-list-nav');
    if (!listNav) return;

    const isKo = getCurrentLang() === 'ko';
    const filtered = filterFormulas(FORMULAS, this.searchQuery, this.currentCategory, this.selectedTag);
    const formulas = sortFormulas(filtered, this.currentSortOption, isKo ? 'ko' : 'en');

    // 공식 개수 배지 및 셀렉트 박스 갱신 (Round 8)
    const countBadge = this.overlay?.querySelector('#formula-count-badge');
    if (countBadge) {
      countBadge.textContent = isKo ? `공식 (${formulas.length}개)` : `Formulas (${formulas.length})`;
    }
    const sortSelect = this.overlay?.querySelector('#formula-sort-select') as HTMLSelectElement | null;
    if (sortSelect && sortSelect.value !== this.currentSortOption) {
      sortSelect.value = this.currentSortOption;
    }

    if (formulas.length === 0) {
      const msg = this.searchQuery.trim()
        ? t('formula.searchEmptyMsg')
        : (isKo ? '해당 카테고리의 공식이 없습니다.' : 'No formulas found in this category.');
      listNav.innerHTML = `<div class="formula-empty-msg">${msg}</div>`;
      return;
    }"""

if old_render_list in code:
    code = code.replace(old_render_list, new_render_list, 1)
    print("Updated renderFormulaList with sort and count badge updates!")

with open(modal_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("formulaModal.ts successfully updated!")
