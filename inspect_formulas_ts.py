with open('src/data/formulas.ts', 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r"id:\s*'([^']+)'[^\n]*\n[^\n]*\n[^\n]*category:\s*'([^']+)'", text)
print("BASE_FORMULAS count:", len(matches))
for id_, cat in matches:
    if 'corner-kite' in id_ or 'god-number' in cat or 'round' in id_ or 'd4-' in id_:
        print(f"formulas.ts item: id={id_}, category={cat}")
