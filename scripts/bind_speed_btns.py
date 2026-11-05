path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.ts'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = "panel.querySelectorAll('.formula-speed-btn').forEach((btn) => {"
replacement = """panel.querySelector('#btn-speed-05x')?.addEventListener('click', () => this.setPlaySpeed(0.5));
    panel.querySelector('#btn-speed-1x')?.addEventListener('click', () => this.setPlaySpeed(1.0));
    panel.querySelector('#btn-speed-2x')?.addEventListener('click', () => this.setPlaySpeed(2.0));
    panel.querySelectorAll('.formula-speed-btn').forEach((btn) => {"""

if "btn-speed-05x" not in text:
    print("btn-speed-05x not found, check!")
elif target in text:
    text = text.replace(target, replacement)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Speed buttons bound by ID successfully!")
