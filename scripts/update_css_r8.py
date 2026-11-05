# -*- coding: utf-8 -*-
css_path = r'C:\Users\user\matrix-cube\src\styles\formulaModal.css'

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

sort_styles = """
/* ==========================================================================
   Round 8: 비법서 공식 정렬(Sort UX) 스타일링
   ========================================================================== */
.formula-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-surface-secondary, rgba(0, 0, 0, 0.03));
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.08));
}

.formula-count-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-secondary, #64748b);
  letter-spacing: -0.02em;
}

.formula-sort-wrapper {
  display: flex;
  align-items: center;
}

.formula-sort-select {
  appearance: none;
  background-color: var(--bg-card, #ffffff);
  border: 1px solid var(--border-color, #cbd5e1);
  border-radius: 6px;
  padding: 4px 24px 4px 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: calc(100% - 6px) center;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.formula-sort-select:hover {
  border-color: var(--primary-accent, #3b82f6);
}

.formula-sort-select:focus {
  outline: none;
  border-color: var(--primary-accent, #3b82f6);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

[data-theme='dark'] .formula-sidebar-header {
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

[data-theme='dark'] .formula-count-badge {
  color: #94a3b8;
}

[data-theme='dark'] .formula-sort-select {
  background-color: #1e293b;
  border-color: #334155;
  color: #f1f5f9;
}
"""

if ".formula-sidebar-header" not in css:
    css += "\n" + sort_styles
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css)
    print("Added Round 8 sort styles to formulaModal.css!")
else:
    print("Sort styles already present in formulaModal.css")
