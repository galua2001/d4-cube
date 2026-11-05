# -*- coding: utf-8 -*-
import sys

modal_test_path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.test.ts'
with open(modal_test_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """    const el: any = {
      id,
      tagName: tag.toUpperCase(),
      style: {},
      dataset: {},
      textContent: '',
      innerHTML: '',"""

replacement = """    let rawInnerHTML = '';
    const el: any = {
      id,
      tagName: tag.toUpperCase(),
      style: {},
      dataset: {},
      textContent: '',
      get innerHTML() {
        return rawInnerHTML;
      },
      set innerHTML(html: string) {
        rawInnerHTML = html;
        const matches = html.matchAll(/id=["']([^"']+)["']/g);
        for (const m of matches) {
          const matchId = m[1];
          if (!elements[matchId]) {
            createMockElement(matchId);
          }
        }
      },"""

if target in content:
    content = content.replace(target, replacement, 1)
    with open(modal_test_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated innerHTML setter in formulaModal.test.ts!")
else:
    print("Error: target not found!")
