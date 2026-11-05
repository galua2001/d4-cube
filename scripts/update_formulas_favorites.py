# -*- coding: utf-8 -*-
with open('C:/Users/user/matrix-cube/src/data/formulas.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "| 'all'\n  | 'basics'",
    "| 'all'\n  | 'favorites'\n  | 'basics'"
).replace(
    "| 'all'\r\n  | 'basics'",
    "| 'all'\r\n  | 'favorites'\r\n  | 'basics'"
)

# Also check getFormulasByCategory and filterFormulas for 'favorites'
# If someone calls getFormulasByCategory('favorites')
if "if (category === 'favorites')" not in text:
    target = "  if (category === 'all') {\n    return FORMULAS;\n  }"
    replacement = "  if (category === 'all') {\n    return FORMULAS;\n  }\n  if (category === 'favorites') {\n    return FORMULAS;\n  }"
    if target in text:
        text = text.replace(target, replacement, 1)
    else:
        target_crlf = "  if (category === 'all') {\r\n    return FORMULAS;\r\n  }"
        replacement_crlf = "  if (category === 'all') {\r\n    return FORMULAS;\r\n  }\r\n  if (category === 'favorites') {\r\n    return FORMULAS;\r\n  }"
        text = text.replace(target_crlf, replacement_crlf, 1)

with open('C:/Users/user/matrix-cube/src/data/formulas.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated formulas.ts successfully!')
