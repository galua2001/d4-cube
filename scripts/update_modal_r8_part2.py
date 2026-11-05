# -*- coding: utf-8 -*-
modal_path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.ts'

with open(modal_path, 'r', encoding='utf-8') as f:
    code = f.read()

target_section = """  private getFilteredFormulas(): FormulaItem[] {
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

replacement_section = """  private getFilteredFormulas(): FormulaItem[] {
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
  }"""

if target_section in code:
    code = code.replace(target_section, replacement_section, 1)
    print("Replaced getFilteredFormulas & applyFilterAndRender!")
else:
    print("Target section not matched exactly, checking...")

# Now update renderFormulaList to use getFilteredAndSortedFormulas and update count badge & sort select
target_render = """  private renderFormulaList(): void {
    const listNav = this.overlay?.querySelector('#formula-list-nav');
    if (!listNav) return;

    const isKo = getCurrentLang() === 'ko';
    const formulas = this.getFilteredFormulas();"""

replacement_render = """  private renderFormulaList(): void {
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
    }"""

if target_render in code:
    code = code.replace(target_render, replacement_render, 1)
    print("Replaced renderFormulaList with sorted formulas and badge update!")
else:
    print("Target render not matched exactly, checking...")

with open(modal_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated formulaModal.ts!")
