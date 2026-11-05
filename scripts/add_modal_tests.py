# -*- coding: utf-8 -*-
from pathlib import Path

target = Path(r"C:\Users\user\matrix-cube\src\ui\formulaModal.test.ts")
content = target.read_text(encoding="utf-8")

new_tests = '''  it('20. [Round 5 신규 마스터 공식 3선 모달 인터랙티브 제어] d4-corner-ring-blitz-4, d4-cross-inversion-3, d4-diagonal-windmill-4 선택 및 스텝 시뮬레이션', () => {
    controller.open('d4-corner-ring-blitz-4');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(3);
    controller.setStep(4);

    controller.selectFormula('d4-cross-inversion-3');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(3);

    controller.selectFormula('d4-diagonal-windmill-4');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(3);
    controller.setStep(4);

    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

  it('21. [Round 5 비법서 실시간 검색 필터링] 검색어 입력, 목록 필터링 및 지우기 버튼 연동 검증', () => {
    controller.open();
    expect(controller.isOpen()).toBe(true);

    // 1. 검색어 설정
    controller.setSearchQuery('풍차');
    expect(controller.getSearchQuery()).toBe('풍차');

    // 2. 검색창 input 이벤트 트리거 검증
    const searchInput = elements['formula-search-input'];
    expect(searchInput).toBeDefined();

    searchInput.value = '코너 링';
    searchInput.triggerEvent('input', { target: searchInput });
    expect(controller.getSearchQuery()).toBe('코너 링');

    // 3. 지우기 버튼 클릭 시 검색어 초기화 검증
    const clearBtn = elements['btn-formula-search-clear'];
    expect(clearBtn).toBeDefined();

    clearBtn.triggerEvent('click');
    expect(controller.getSearchQuery()).toBe('');

    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

  it('22. [Round 5 다차원 태그 칩 필터링] 태그 칩 선택 및 카테고리와의 AND 조합 필터링 검증', () => {
    controller.open();
    expect(controller.isOpen()).toBe(true);

    // 태그 칩 선택
    controller.setSelectedTag('4수');
    expect(controller.getSelectedTag()).toBe('4수');

    // 카테고리와 AND 조합
    controller.setCategory('god-number');
    expect(controller.isOpen()).toBe(true);

    // 태그 칩 전체 복귀
    controller.setSelectedTag('all');
    expect(controller.getSelectedTag()).toBe('all');

    controller.close();
    expect(controller.isOpen()).toBe(false);
  });
'''

idx = content.rfind("});")
if idx != -1:
    content = content[:idx] + new_tests + "\n});\n"
    target.write_text(content, encoding="utf-8")
    print("Updated formulaModal.test.ts successfully!")
else:
    print("Failed to find closing bracket")
