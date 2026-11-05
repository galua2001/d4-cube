path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('searchInput?.focus();', 'if (typeof searchInput?.focus === "function") { searchInput.focus(); }')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
print('Updated focus call successfully!')
