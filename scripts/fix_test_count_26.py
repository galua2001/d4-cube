# -*- coding: utf-8 -*-
import sys

file_path = r'C:\Users\user\matrix-cube\src\data\formulas.test.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 18번: expect(godNumberFormulas.length).toBe(23); -> toBe(26);
content = content.replace("expect(godNumberFormulas.length).toBe(23);", "expect(godNumberFormulas.length).toBe(26);")

# 51번: expect(godNumberFormulas.length).toBe(23); -> toBe(26);
# 51번 및 기타 위치에서도 toBe(23)이나 toBe(20)이 있으면 toBe(26)으로 변경
content = content.replace("expect(godNumberFormulas.length).toBe(20);", "expect(godNumberFormulas.length).toBe(26);")
content = content.replace("expect(godOnly.length).toBe(20);", "expect(godOnly.length).toBe(26);")
content = content.replace("expect(godOnly.length).toBe(23);", "expect(godOnly.length).toBe(26);")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("formulas.test.ts updated with expected count 26!")
