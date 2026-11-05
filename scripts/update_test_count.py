path = r'C:\Users\user\matrix-cube\src\data\formulas.test.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# 18번 테스트
text = text.replace("expect(godNumberFormulas.length).toBe(20);", "expect(godNumberFormulas.length).toBe(23);")
text = text.replace("expect(godNumberFormulas.length).toBe(17);", "expect(godNumberFormulas.length).toBe(23);")
text = text.replace("expect(godOnly.length).toBe(20);", "expect(godOnly.length).toBe(23);")
text = text.replace("expect(godOnly.length).toBe(17);", "expect(godOnly.length).toBe(23);")

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated test count expectations to 23!')
