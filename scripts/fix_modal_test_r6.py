# -*- coding: utf-8 -*-
import sys

file_path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.test.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. innerHTML setter 개선
target_innerhtml = """      set innerHTML(html: string) {
        rawInnerHTML = html;
        const matches = html.matchAll(/id=["']([^"']+)["']/g);
        for (const m of matches) {
          const matchId = m[1];
          if (!elements[matchId]) {
            createMockElement(matchId);
          }
        }
      },"""

replace_innerhtml = """      set innerHTML(html: string) {
        rawInnerHTML = html;
        const matches = html.matchAll(/id=["']([^"']+)["']/g);
        for (const m of matches) {
          const matchId = m[1];
          if (!elements[matchId]) {
            createMockElement(matchId);
          }
        }
        const speedMatches1 = html.matchAll(/id=["']([^"']+)["'][^>]*data-speed=["']([^"']+)["']/g);
        for (const m of speedMatches1) {
          if (elements[m[1]]) elements[m[1]].dataset.speed = m[2];
        }
        const speedMatches2 = html.matchAll(/data-speed=["']([^"']+)["'][^>]*id=["']([^"']+)["']/g);
        for (const m of speedMatches2) {
          if (elements[m[2]]) elements[m[2]].dataset.speed = m[1];
        }
      },"""

if target_innerhtml not in content:
    target_innerhtml = target_innerhtml.replace('\n', '\r\n')

assert target_innerhtml in content, "target_innerhtml not found"
content = content.replace(target_innerhtml, replace_innerhtml, 1)

# 2. window stub 에 setTimeout, clearTimeout 추가
target_stub = """    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      setInterval: vi.fn((_cb, _ms) => 123),
      clearInterval: vi.fn()
    });"""

replace_stub = """    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      setInterval: vi.fn((_cb, _ms) => 123),
      clearInterval: vi.fn(),
      setTimeout: vi.fn((cb: Function, _ms?: number) => {
        cb();
        return 456;
      }),
      clearTimeout: vi.fn()
    });"""

if target_stub not in content:
    target_stub = target_stub.replace('\n', '\r\n')

assert target_stub in content, "target_stub not found"
content = content.replace(target_stub, replace_stub, 1)

# 3. it 24에서 await 추가
target_it24 = """    copyBtn.triggerEvent('click');

    // 클립보드에 해당 공식의 formulaSeq가 전달되었는지 확인
    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('1열 R90'));

    // 토스트 알림 엘리먼트 및 텍스트 표시 검증
    const toast = elements['formula-toast'];
    expect(toast).toBeDefined();
    expect(toast.textContent).toContain('클립보드');"""

replace_it24 = """    await copyBtn.triggerEvent('click');
    await Promise.resolve();

    // 클립보드에 해당 공식의 formulaSeq가 전달되었는지 확인
    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('1열 R90'));

    // 토스트 알림 엘리먼트 및 텍스트 표시 검증
    const toast = elements['formula-toast'];
    expect(toast).toBeDefined();
    expect(toast.textContent).toContain('클립보드');"""

if target_it24 not in content:
    target_it24 = target_it24.replace('\n', '\r\n')

assert target_it24 in content, "target_it24 not found"
content = content.replace(target_it24, replace_it24, 1)

# it 24의 it 콜백을 async 로 변경
content = content.replace("it('24. [Round 6 공식 원클릭 복사: Copy Formula & Toast] 공식 표기법 클립보드 복사 및 시각적 토스트 피드백 검증', () => {",
                          "it('24. [Round 6 공식 원클릭 복사: Copy Formula & Toast] 공식 표기법 클립보드 복사 및 시각적 토스트 피드백 검증', async () => {")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("formulaModal.test.ts successfully fixed!")
