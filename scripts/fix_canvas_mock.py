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
      textContent: '',"""

replacement = """    const el: any = {
      id,
      tagName: tag.toUpperCase(),
      style: {},
      dataset: {},
      textContent: '',
      getContext: vi.fn(() => ({
        clearRect: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        drawImage: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn()
      })),"""

if target in content:
    content = content.replace(target, replacement, 1)
    with open(modal_test_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully added getContext mock to createMockElement!")
else:
    print("Error: target not found!")
