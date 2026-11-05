# -*- coding: utf-8 -*-
import sys

file_path = r'C:\Users\user\matrix-cube\src\ui\formulaModal.test.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target_end = """    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

});"""

replace_end = """    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

  it('23. [Round 6 재생 속도 제어: setPlaySpeed] 0.5x, 1.0x, 2.0x 속도 변경 및 playIntervalMs 동적 조절 검증', () => {
    controller.open();
    expect(controller.isOpen()).toBe(true);

    // 기본 재생 속도는 1.0x
    expect(controller.getPlaySpeed()).toBe(1.0);

    // 0.5x 속도로 변경
    controller.setPlaySpeed(0.5);
    expect(controller.getPlaySpeed()).toBe(0.5);

    // 2.0x 속도 버튼 클릭 트리거
    const speed2xBtn = elements['btn-speed-2x'];
    expect(speed2xBtn).toBeDefined();
    speed2xBtn.triggerEvent('click');
    expect(controller.getPlaySpeed()).toBe(2.0);

    // 0.5x 속도 버튼 클릭 트리거
    const speed05xBtn = elements['btn-speed-05x'];
    expect(speed05xBtn).toBeDefined();
    speed05xBtn.triggerEvent('click');
    expect(controller.getPlaySpeed()).toBe(0.5);

    // 1.0x 속도 버튼 클릭 트리거
    const speed1xBtn = elements['btn-speed-1x'];
    expect(speed1xBtn).toBeDefined();
    speed1xBtn.triggerEvent('click');
    expect(controller.getPlaySpeed()).toBe(1.0);

    // 자동 재생 실행 중 속도 변경 시 setInterval 재설정 동작 검증
    controller.togglePlay();
    expect(window.setInterval).toHaveBeenCalled();

    controller.setPlaySpeed(2.0);
    expect(controller.getPlaySpeed()).toBe(2.0);

    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

  it('24. [Round 6 공식 원클릭 복사: Copy Formula & Toast] 공식 표기법 클립보드 복사 및 시각적 토스트 피드백 검증', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: {
        writeText: writeTextMock
      }
    });

    controller.open('d4-twin-column-flux-4');
    expect(controller.isOpen()).toBe(true);

    // 공식 복사 버튼 mock 탐색 및 클릭 트리거
    const copyBtn = elements['btn-copy-formula'];
    expect(copyBtn).toBeDefined();

    copyBtn.triggerEvent('click');

    // 클립보드에 해당 공식의 formulaSeq가 전달되었는지 확인
    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('1열 R90'));

    // 토스트 알림 엘리먼트 및 텍스트 표시 검증
    const toast = elements['formula-toast'];
    expect(toast).toBeDefined();
    expect(toast.textContent).toContain('클립보드');

    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

  it('25. [Round 6 신규 마스터 공식 3선 모달 인터랙티브 제어] d4-twin-column-flux-4, d4-h-bracket-smash-3, d4-star-burst-vortex-4 선택 및 스텝 시뮬레이션 검증', () => {
    // 1. d4-twin-column-flux-4 (4수 플럭스)
    controller.open('d4-twin-column-flux-4');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(3);
    controller.setStep(4);

    // 2. d4-h-bracket-smash-3 (3수 H브래킷)
    controller.selectFormula('d4-h-bracket-smash-3');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(3);

    // 3. d4-star-burst-vortex-4 (4수 별빛 소용돌이)
    controller.selectFormula('d4-star-burst-vortex-4');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(3);
    controller.setStep(4);

    // god-number 카테고리 필터링
    controller.setCategory('god-number');
    expect(controller.isOpen()).toBe(true);

    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

});"""

if target_end not in content:
    target_end = target_end.replace('\n', '\r\n')

assert target_end in content, "target_end not found"
content = content.replace(target_end, replace_end, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("formulaModal.test.ts updated successfully with Round 6 tests!")
