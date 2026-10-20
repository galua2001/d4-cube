import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getColorMode,
  setColorMode,
  toggleColorMode,
  onColorModeChange,
  COLOR_MODE_STORAGE_KEY,
} from './colorTheme';

describe('colorTheme 모듈', () => {
  let storageMap: Record<string, string> = {};
  let domAttrs: Record<string, string> = {};
  let metaAttrs: Record<string, string> = {};

  beforeEach(() => {
    storageMap = {};
    domAttrs = {};
    metaAttrs = {};

    const mockLocalStorage = {
      getItem: (key: string) => storageMap[key] || null,
      setItem: (key: string, value: string) => {
        storageMap[key] = value;
      },
      removeItem: (key: string) => {
        delete storageMap[key];
      },
      clear: () => {
        storageMap = {};
      },
    };
    vi.stubGlobal('localStorage', mockLocalStorage);

    const mockMeta = {
      setAttribute: vi.fn((attr: string, val: string) => {
        metaAttrs[attr] = val;
      }),
    };

    const mockDocument = {
      documentElement: {
        setAttribute: vi.fn((attr: string, val: string) => {
          domAttrs[attr] = val;
        }),
        getAttribute: vi.fn((attr: string) => domAttrs[attr] || null),
      },
      querySelector: vi.fn((selector: string) => {
        if (selector === 'meta[name="theme-color"]') {
          return mockMeta;
        }
        return null;
      }),
    };
    vi.stubGlobal('document', mockDocument);

    // 기본 모드로 초기화
    setColorMode('light');
  });

  it('기본 모드는 light여야 한다', () => {
    expect(getColorMode()).toBe('light');
    expect(domAttrs['data-theme']).toBe('light');
    expect(metaAttrs['content']).toBe('#f8fafc');
  });

  it('setColorMode로 다크 모드로 변경할 수 있어야 한다', () => {
    setColorMode('dark');
    expect(getColorMode()).toBe('dark');
    expect(storageMap[COLOR_MODE_STORAGE_KEY]).toBe('dark');
    expect(domAttrs['data-theme']).toBe('dark');
    expect(metaAttrs['content']).toBe('#0f172a');
  });

  it('toggleColorMode로 light ↔ dark 순환 토글이 가능해야 한다', () => {
    setColorMode('light');
    const mode1 = toggleColorMode();
    expect(mode1).toBe('dark');
    expect(getColorMode()).toBe('dark');
    expect(domAttrs['data-theme']).toBe('dark');

    const mode2 = toggleColorMode();
    expect(mode2).toBe('light');
    expect(getColorMode()).toBe('light');
    expect(domAttrs['data-theme']).toBe('light');
  });

  it('onColorModeChange 콜백이 정상 호출되어야 한다', () => {
    const listener = vi.fn();
    const unsubscribe = onColorModeChange(listener);

    setColorMode('dark');
    expect(listener).toHaveBeenCalledWith('dark');

    setColorMode('light');
    expect(listener).toHaveBeenCalledWith('light');

    unsubscribe();
    setColorMode('dark');
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
