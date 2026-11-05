# -*- coding: utf-8 -*-
import sys

file_path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.test.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """      set innerHTML(html: string) {
        rawInnerHTML = html;
        const matches = html.matchAll(/id=["']([^"']+)["']/g);
        for (const m of matches) {
          const matchId = m[1];
          if (!elements[matchId]) {
            createMockElement(matchId);
          }
        }
        const speedMatches1 = html.matchAll(/id=["']([^"']+)["'][^>]*data-speed=["']([^"']+)["']/g);
        for (const m of speedMatches1) {
          if (elements[m[1]]) elements[m[1]].dataset.speed = m[2];
        }
        const speedMatches2 = html.matchAll(/data-speed=["']([^"']+)["'][^>]*id=["']([^"']+)["']/g);
        for (const m of speedMatches2) {
          if (elements[m[2]]) elements[m[2]].dataset.speed = m[1];
        }
      },"""

replacement = """      set innerHTML(html: string) {
        rawInnerHTML = html;
        const tagMatches = html.matchAll(/<([a-zA-Z0-9-]+)([^>]*)>/g);
        for (const tm of tagMatches) {
          const attrs = tm[2];
          const idMatch = attrs.match(/id=["']([^"']+)["']/);
          if (idMatch) {
            const idVal = idMatch[1];
            const targetEl = elements[idVal] || createMockElement(idVal, tm[1]);
            const speedMatch = attrs.match(/data-speed=["']([^"']+)["']/);
            if (speedMatch) targetEl.dataset.speed = speedMatch[1];
            const idDataMatch = attrs.match(/data-id=["']([^"']+)["']/);
            if (idDataMatch) targetEl.dataset.id = idDataMatch[1];
          }
        }
      },"""

assert target in content, "target not found"
content = content.replace(target, replacement, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("innerHTML tag parser updated successfully!")
