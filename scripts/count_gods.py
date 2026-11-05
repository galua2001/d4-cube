from pathlib import Path
import re

text = Path(r"C:\Users\user\matrix-cube\src\data\formulas.ts").read_text(encoding="utf-8")
count = 0
for m in re.finditer(r"id:\s*'([^']+)'[^\}]+category:\s*'([^']+)'", text):
    if m.group(2) == 'god-number':
        count += 1
        print(f"{count}: {m.group(1)}")
print("Total god-number:", count)
