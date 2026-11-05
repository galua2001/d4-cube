import json
mined = json.load(open('src/data/minedFormulas.json', encoding='utf-8'))
for item in mined:
    if 'corner-kite' in item['id']:
        print("IN MINED:", item['id'], item.get('category'))
