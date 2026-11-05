# -*- coding: utf-8 -*-
with open('C:/Users/user/matrix-cube/src/ui/formulaModal.ts', 'r', encoding='utf-8') as f:
    text = f.read()

fav_line = "export const FAVORITES_STORAGE_KEY = 'galois_cube_favorite_formulas';"
text = text.replace(fav_line + '\n\n', '').replace(fav_line + '\r\n\r\n', '')

# Insert after soundEngine import
target = "import { soundEngine } from '../audio/audioEngine';"
replacement = target + "\n\n" + fav_line

if target in text:
    text = text.replace(target, replacement, 1)

with open('C:/Users/user/matrix-cube/src/ui/formulaModal.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Moved FAVORITES_STORAGE_KEY after imports!')
