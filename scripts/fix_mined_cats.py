# -*- coding: utf-8 -*-
import json

mined_path = r'C:\Users\user\matrix-cube\src\data\minedFormulas.json'
with open(mined_path, 'r', encoding='utf-8') as f:
    mined = json.load(f)

# If d4-corner-kite-flux-4, d4-plus-omega-cross-3, d4-hyper-cube-frame-4 are present, ensure category is 'ai-mined'
for item in mined:
    if item['id'] in ['d4-corner-kite-flux-4', 'd4-plus-omega-cross-3', 'd4-hyper-cube-frame-4']:
        item['category'] = 'ai-mined'

with open(mined_path, 'w', encoding='utf-8') as f:
    json.dump(mined, f, ensure_ascii=False, indent=2)

print("Updated minedFormulas.json categories!")
