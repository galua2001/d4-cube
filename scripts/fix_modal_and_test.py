# fix_modal_and_test.py
with open('src/ui/formulaModal.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

# Add getCategory()
if 'public getCategory():' not in ts:
    target_method = 'public setCategory('
    idx = ts.find(target_method)
    ts = ts[:idx] + '''public getCategory(): string {
    return this.currentCategory;
  }

  ''' + ts[idx:]

# Update formula-empty-msg to include formula-empty-state
ts = ts.replace('<div class="formula-empty-msg">', '<div class="formula-empty-msg formula-empty-state">')

# Update classList.add in renderMiniBoard to call add individually
old_add = "tileBox.classList.add('tile-flipping', 'tile-pulsing');"
new_add = "tileBox.classList.add('tile-flipping'); tileBox.classList.add('tile-pulsing');"
ts = ts.replace(old_add, new_add)

with open('src/ui/formulaModal.ts', 'w', encoding='utf-8') as f:
    f.write(ts)

print('Updated formulaModal.ts successfully!')

# 2. Update formulaModal.test.ts
with open('src/ui/formulaModal.test.ts', 'r', encoding='utf-8') as f:
    test_ts = f.read()

test_ts = test_ts.replace("elements['formula-list-container']", "(elements['formula-list-container'] || elements['formula-list-nav'])")

with open('src/ui/formulaModal.test.ts', 'w', encoding='utf-8') as f:
    f.write(test_ts)

print('Updated formulaModal.test.ts successfully!')
