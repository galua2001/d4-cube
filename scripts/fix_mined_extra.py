# -*- coding: utf-8 -*-
import json

mined_path = r'C:\Users\user\matrix-cube\src\data\minedFormulas.json'
with open(mined_path, 'r', encoding='utf-8') as f:
    mined = json.load(f)

extra_ids = {
    'd4-diamond-core-smash-3',
    'd4-hyper-cross-vortex-4',
    'd4-dual-wing-flip-3',
    'd4-concentric-ring-blitz-4',
    'd4-chiral-propeller-4',
    'd4-tri-axis-inversion-3',
    'd4-quad-corner-mirror-4'
}

for item in mined:
    if item['id'] in extra_ids:
        item['category'] = 'ai-mined'
        print(f"Changed {item['id']} category to ai-mined")

with open(mined_path, 'w', encoding='utf-8') as f:
    json.dump(mined, f, ensure_ascii=False, indent=2)

print("minedFormulas.json updated successfully!")
