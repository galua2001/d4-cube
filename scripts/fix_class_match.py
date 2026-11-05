# -*- coding: utf-8 -*-
import sys

file_path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.test.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """            const speedMatch = attrs.match(/data-speed=["']([^"']+)["']/);
            if (speedMatch) targetEl.dataset.speed = speedMatch[1];
            const idDataMatch = attrs.match(/data-id=["']([^"']+)["']/);
            if (idDataMatch) targetEl.dataset.id = idDataMatch[1];"""

replacement = """            const classMatch = attrs.match(/class=["']([^"']+)["']/);
            if (classMatch) targetEl.className = classMatch[1];
            const speedMatch = attrs.match(/data-speed=["']([^"']+)["']/);
            if (speedMatch) targetEl.dataset.speed = speedMatch[1];
            const idDataMatch = attrs.match(/data-id=["']([^"']+)["']/);
            if (idDataMatch) targetEl.dataset.id = idDataMatch[1];"""

assert target in content, "target not found"
content = content.replace(target, replacement, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("classMatch added to mock element parser successfully!")
