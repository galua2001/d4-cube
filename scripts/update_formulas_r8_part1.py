# -*- coding: utf-8 -*-
import json
import re

formulas_path = r'C:\Users\user\matrix-cube\src\data\formulas.ts'

with open(formulas_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. sortFormulas 및 FormulaSortOption 추가
sort_code = """
export type FormulaSortOption = 'default' | 'diff-asc' | 'diff-desc' | 'name-asc';

/**
 * 비법서 공식 목록 정렬 함수 (명세서 4.4 준수)
 */
export function sortFormulas(
  items: FormulaItem[],
  sortOption: FormulaSortOption,
  lang: 'ko' | 'en' = 'ko'
): FormulaItem[] {
  const cloned = [...items];
  switch (sortOption) {
    case 'diff-asc':
      return cloned.sort((a, b) => a.difficulty - b.difficulty);
    case 'diff-desc':
      return cloned.sort((a, b) => b.difficulty - a.difficulty);
    case 'name-asc':
      return cloned.sort((a, b) => {
        const titleA = lang === 'ko' ? (a.titleKo || a.title || '') : (a.titleEn || a.title || '');
        const titleB = lang === 'ko' ? (b.titleKo || b.title || '') : (b.titleEn || b.title || '');
        return titleA.localeCompare(titleB, lang === 'ko' ? 'ko' : 'en');
      });
    case 'default':
    default:
      return cloned;
  }
}
"""

# Check if sortFormulas already exists
if "export function sortFormulas" not in content:
    content += "\n" + sort_code
    print("Added sortFormulas and FormulaSortOption!")

with open(formulas_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated formulas.ts with sortFormulas")
