# -*- coding: utf-8 -*-
css_fav = """
/* Round 7: 즐겨찾기(Favorites) 별표 북마크 UI 스타일 */
.formula-card-top-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.formula-card-fav-btn {
  background: transparent;
  border: none;
  font-size: 1.05rem;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: transform 0.15s ease, color 0.15s ease, text-shadow 0.15s ease;
  user-select: none;
}

.formula-card-fav-btn:hover {
  transform: scale(1.25);
  color: #fbbf24;
}

.formula-card-fav-btn.favorited {
  color: #f59e0b;
  text-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
}

.formula-detail-fav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #cbd5e1;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.formula-detail-fav-btn:hover {
  background: rgba(245, 158, 11, 0.15);
  border-color: #f59e0b;
  color: #fbbf24;
  transform: translateY(-1px);
}

.formula-detail-fav-btn.favorited {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.2));
  border-color: #f59e0b;
  color: #fbbf24;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
}

.formula-detail-fav-btn .fav-icon {
  font-size: 0.95rem;
  line-height: 1;
}

/* Light Theme Overrides */
[data-theme='light'] .formula-card-fav-btn {
  color: #64748b;
}

[data-theme='light'] .formula-card-fav-btn:hover,
[data-theme='light'] .formula-card-fav-btn.favorited {
  color: #d97706;
}

[data-theme='light'] .formula-detail-fav-btn {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.12);
  color: #475569;
}

[data-theme='light'] .formula-detail-fav-btn:hover {
  background: rgba(245, 158, 11, 0.1);
  border-color: #d97706;
  color: #b45309;
}

[data-theme='light'] .formula-detail-fav-btn.favorited {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #b45309;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.25);
}
"""

filepath = 'C:/Users/user/matrix-cube/src/styles/formulaModal.css'
with open(filepath, 'r', encoding='utf-8') as f:
    css = f.read()

if '.formula-card-fav-btn' not in css:
    css += '\n' + css_fav
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(css)
    print('formulaModal.css updated successfully!')
else:
    print('formulaModal.css already has favorite styles!')
