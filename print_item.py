import sys
text = open('src/data/formulas.ts', encoding='utf-8').read()
idx = text.find('d4-corner-kite-flux-4')
sys.stdout.buffer.write(text[idx-50:idx+400].encode('utf-8'))
