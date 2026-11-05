# -*- coding: utf-8 -*-
import json
import re

content = open(r'C:\Users\user\matrix-cube\src\data\formulas.ts', 'r', encoding='utf-8').read()
matches = re.findall(r"id:\s*['\"]([^'\"]+)['\"].*?category:\s*['\"]([^'\"]+)['\"]", content, re.DOTALL)
print('BASE formulas count:', len(matches))
base_god = [id for id, cat in matches if cat == 'god-number']
print('BASE god-number count:', len(base_god))
print('BASE god-number IDs:', base_god)

mined = json.load(open(r'C:\Users\user\matrix-cube\src\data\minedFormulas.json', 'r', encoding='utf-8'))
base_ids = set(id for id, cat in matches)
mined_god = [f['id'] for f in mined if f.get('category') == 'god-number' and f['id'] not in base_ids]
print('MINED god-number not in base:', len(mined_god))
print('MINED god-number IDs:', mined_god)

mined_all_god = [f['id'] for f in mined if f.get('category') == 'god-number']
print('MINED all god-number IDs:', mined_all_god)
