import json
with open('src/data/minedFormulas.json', 'r', encoding='utf-8') as f:
    mined = json.load(f)

print(f"Total in minedFormulas.json: {len(mined)}")
for idx, item in enumerate(mined):
    print(f"{idx}: id={item['id']}, cat={item.get('category')}")
