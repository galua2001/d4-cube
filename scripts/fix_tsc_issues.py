# -*- coding: utf-8 -*-
import sys

# 1. victoryEffect.ts 에 export const victoryManager = new VictoryEffectManager(); 복구
victory_path = r'C:\Users\user\matrix-cube\src\ui\victoryEffect.ts'
with open(victory_path, 'r', encoding='utf-8') as f:
    v_content = f.read()

if 'export const victoryManager' not in v_content:
    v_content = v_content.rstrip() + '\n\nexport const victoryManager = new VictoryEffectManager();\n'
    with open(victory_path, 'w', encoding='utf-8') as f:
        f.write(v_content)
    print("Fixed victoryEffect.ts export!")

# 2. main.ts 에서 formula.steps optional chaining 적용
main_path = r'C:\Users\user\matrix-cube\src\main.ts'
with open(main_path, 'r', encoding='utf-8') as f:
    m_content = f.read()

m_target = "const hasDiagonal = formula.steps.some(s => s.highlightLine?.type === 'diag') ||"
m_replacement = "const hasDiagonal = (formula.steps?.some(s => s.highlightLine?.type === 'diag') ?? false) ||"

if m_target in m_content:
    m_content = m_content.replace(m_target, m_replacement, 1)
    with open(main_path, 'w', encoding='utf-8') as f:
        f.write(m_content)
    print("Fixed main.ts formula.steps optional chaining!")
else:
    print("Warning: m_target not found!")
