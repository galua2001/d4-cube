import re
import json

with open('C:/Users/user/matrix-cube/src/data/minedFormulas.json', 'r', encoding='utf-8') as f:
    mined = json.load(f)

print("mined length:", len(mined))
for item in mined:
    if item.get('category') == 'god-number':
        print("Mined god-number:", item['id'])
    if 'tags' in item and '신의 수' in item['tags']:
        print("Mined has god tag:", item['id'], item.get('category'))
