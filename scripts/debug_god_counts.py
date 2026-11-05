# -*- coding: utf-8 -*-
import json
import re

with open('C:/Users/user/matrix-cube/src/data/formulas.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's find all god-number occurrences in formulas.ts
lines = text.split('\n')
for i, l in enumerate(lines):
    if "category: 'god-number'" in l or 'category: "god-number"' in l:
        # find id around here
        context = '\n'.join(lines[max(0, i-5):min(len(lines), i+5)])
        id_m = re.search(r"id:\s*['\"]([^'\"]+)['\"]", context)
        print(f"Line {i}: id = {id_m.group(1) if id_m else 'unknown'}")

mined = json.load(open('C:/Users/user/matrix-cube/src/data/minedFormulas.json', encoding='utf-8'))
print("\nMinedFormulas god-number:")
for x in mined:
    if x.get('category') == 'god-number':
        print(f"  {x['id']}")
