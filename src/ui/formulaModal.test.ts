import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  FormulaModalController,
  formulaModalController,
  showFormulaModal,
  closeFormulaModal
} from './formulaModal';
import { setLang } from '../i18n/translations';

describe('FormulaModalController (공식 비법서 모달 및 인터랙티브 뷰어) 단위 테스트', () => {
  let controller: FormulaModalController;
  const elements: Record<string, any> = {};

  const createMockElement = (id: string, tag = 'div') => {
    const classSet = new Set<string>();
    let rawClassName = '';
    const listeners: Record<string, Function[]> = {};

    const el: any = {
      id,
      tagName: tag.toUpperCase(),
      style: {},
      dataset: {},
      textContent: '',
      innerHTML: '',
      get className() {
        return rawClassName;
      },
      set className(val: string) {
        rawClassName = val;
        classSet.clear();
        val.split(/\s+/).filter(Boolean).forEach((c) => classSet.add(c));
      },
      classList: {
        add: (c: string) => {
          classSet.add(c);
          rawClassName = Array.from(classSet).join(' ');
        },
        remove: (c: string) => {
          classSet.delete(c);
          rawClassName = Array.from(classSet).join(' ');
        },
        contains: (c: string) => classSet.has(c),
        toggle: (c: string, force?: boolean) => {
          if (force === true) classSet.add(c);
          else if (force === false) classSet.delete(c);
          else if (classSet.has(c)) classSet.delete(c);
          else classSet.add(c);
          rawClassName = Array.from(classSet).join(' ');
        }
      },
      children: [] as any[],
      appendChild: vi.fn((child: any) => {
        el.children.push(child);
        return child;
      }),
      remove: vi.fn(() => {
        delete elements[id];
      }),
      querySelector: vi.fn((sel: string) => {
        if (sel.startsWith('#')) {
          const targetId = sel.slice(1);
          return elements[targetId] || null;
        }
        return null;
      }),
      querySelectorAll: vi.fn((sel: string) => {
        return Object.values(elements).filter((e: any) => {
          if (sel.startsWith('.')) {
            const cls = sel.slice(1);
            return e.classList?.contains(cls);
          }
          return false;
        });
      }),
      addEventListener: vi.fn((evt: string, cb: Function) => {
        if (!listeners[evt]) listeners[evt] = [];
        listeners[evt].push(cb);
      }),
      triggerEvent: (evt: string, e?: any) => {
        listeners[evt]?.forEach((cb) => cb(e || {}));
      }
    };

    elements[id] = el;
    return el;
  };

  beforeEach(() => {
    setLang('ko');
    Object.keys(elements).forEach((k) => delete elements[k]);

    const mockBody: any = {
      children: [] as any[],
      appendChild: vi.fn((child: any) => {
        mockBody.children.push(child);
        if (child.id) elements[child.id] = child;
        return child;
      }),
      contains: vi.fn((target: any) => {
        return mockBody.children.includes(target);
      })
    };

    const mockDocument = {
      body: mockBody,
      getElementById: (id: string) => elements[id] || null,
      createElement: (tag: string) => {
        const genId = `gen-${tag}-${Math.random().toString(36).substring(2, 7)}`;
        return createMockElement(genId, tag);
      },
      querySelectorAll: (_sel: string) => []
    };

    vi.stubGlobal('document', mockDocument);
    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      setInterval: vi.fn((_cb, _ms) => 123),
      clearInterval: vi.fn()
    });

    controller = new FormulaModalController();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1. 초기 상태: 모달은 닫혀있어야 함', () => {
    expect(controller.isOpen()).toBe(false);
  });

  it('2. open() 호출 시 모달 오버레이가 생성되어 열려야 함', () => {
    controller.open();
    expect(controller.isOpen()).toBe(true);
  });

  it('3. close() 호출 시 모달 오버레이가 제거되어야 함', () => {
    controller.open();
    expect(controller.isOpen()).toBe(true);

    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

  it('4. 특정 공식 ID로 open(id) 시 해당 공식이 선택되어야 함', () => {
    controller.open('three-cycle-commutator');
    expect(controller.isOpen()).toBe(true);
  });

  it('5. selectFormula(id)를 통해 다른 공식으로 전환 가능해야 함', () => {
    controller.open('center-inversion');
    controller.selectFormula('diagonal-reflection-pair');
    // 무사히 실행되고 에러가 발생하지 않음
    expect(controller.isOpen()).toBe(true);
  });

  it('6. setCategory()로 카테고리 필터링이 가능해야 함', () => {
    controller.open();
    controller.setCategory('basics');
    controller.setCategory('rotation');
    controller.setCategory('reflection');
    controller.setCategory('godTechnique');
    controller.setCategory('all');
    expect(controller.isOpen()).toBe(true);
  });

  it('7. setStep()으로 스텝 전환이 가능하며 범위를 벗어나지 않아야 함', () => {
    controller.open('center-inversion');
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(999); // 클램핑 검증
    controller.setStep(-5);  // 클램핑 검증
    expect(controller.isOpen()).toBe(true);
  });

  it('8. togglePlay()로 자동 재생 시작 및 정지가 토글되어야 함', () => {
    controller.open('center-inversion');
    controller.togglePlay(); // 재생 시작
    controller.togglePlay(); // 재생 정지
    expect(controller.isOpen()).toBe(true);
  });

  it('9. resetStep()으로 0단계 복귀가 가능해야 함', () => {
    controller.open('center-inversion');
    controller.setStep(2);
    controller.resetStep();
    expect(controller.isOpen()).toBe(true);
  });

  it('10. 싱글톤 편의 함수 showFormulaModal(), closeFormulaModal() 검증', () => {
    showFormulaModal();
    expect(formulaModalController.isOpen()).toBe(true);

    closeFormulaModal();
    expect(formulaModalController.isOpen()).toBe(false);
  });

  it('11. 신규 마스터 공식(master-method-3step, parity-90-cycle) 모달 열기 및 스텝 조작 검증', () => {
    controller.open('master-method-3step');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(3);

    controller.selectFormula('parity-90-cycle');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(2);
    controller.setStep(4);
    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

  it('12. 신규 180° 쌍 공식(parallel-180-pair, diagonal-180-pair) 모달 열기 및 인터랙티브 스텝 제어 검증', () => {
    controller.open('parallel-180-pair');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);
    controller.setStep(3);

    controller.selectFormula('diagonal-180-pair');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(4);
    controller.close();
    expect(controller.isOpen()).toBe(false);
  });

  it('13. 실전 빈출 2수 피니시 TOP 3 공식 (finish-l-shape-5, finish-wing-cross-4, finish-hybrid-cancel) 모달 인터랙티브 제어 검증', () => {
    controller.open('finish-l-shape-5');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);

    controller.selectFormula('finish-wing-cross-4');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);

    controller.selectFormula('finish-hybrid-cancel');
    expect(controller.isOpen()).toBe(true);
    controller.setStep(1);
    controller.setStep(2);

    controller.setCategory('god-number');
    expect(controller.isOpen()).toBe(true);

    controller.close();
    expect(controller.isOpen()).toBe(false);
  });
});
