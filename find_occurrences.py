import sys
text = open('src/data/formulas.ts', encoding='utf-8').read()

import re
# Find all occurrences of d4-corner-kite-flux-4
for m in re.finditer(r'd4-corner-kite-flux-4', text):
    start = max(0, m.start() - 100)
    end = min(len(text), m.end() + 200)
    sys.stdout.buffer.write(b"--- OCCURRENCE ---\n")
    sys.stdout.buffer.write(text[start:end].encode('utf-8'))
    sys.stdout.buffer.write(b"\n")
