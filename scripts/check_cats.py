import json

with open(r'c:\Users\user\matrix-cube\src\data\minedFormulas.json', 'r', encoding='utf-8') as f:
    mined = json.load(f)

print("mined length:", len(mined))
for item in mined:
    print(item.get('id'), item.get('category'))
