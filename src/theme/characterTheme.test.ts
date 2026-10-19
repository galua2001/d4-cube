/**
 * @file characterTheme.test.ts
 * @description 캐릭터 테마(강아지 🐶 ↔ 갈루아 소년 🧑‍🎓) 전환 시스템 단위 테스트
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  getCurrentTheme,
  setTheme,
  toggleTheme,
  onThemeChange,
  getThemeImages,
  preloadThemeImages
} from './characterTheme';
import { renderCharacterTileCanvas, renderDogTileCanvas } from '../ui/tileRenderer';
import { D4 } from '../core/group';

describe('Character Theme System (characterTheme.ts & tileRenderer.ts)', () => {
  let storageMap: Record<string, string> = {};

  beforeEach(() => {
    storageMap = {};
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
      }
    };
    vi.stubGlobal('localStorage', mockLocalStorage);

    // 기본 테마인 'dog'로 재설정
    setTheme('dog');
  });

  it('기본 테마는 dog이어야 한다', () => {
    expect(getCurrentTheme()).toBe('dog');
  });

  it('setTheme으로 galua로 테마를 변경할 수 있고 localStorage에 저장된다', () => {
    setTheme('galua');
    expect(getCurrentTheme()).toBe('galua');
    expect(storageMap[THEME_STORAGE_KEY]).toBe('galua');

    setTheme('dog');
    expect(getCurrentTheme()).toBe('dog');
    expect(storageMap[THEME_STORAGE_KEY]).toBe('dog');
  });

  it('toggleTheme 호출 시 dog ↔ galua 상호 전환이 정상 동작한다', () => {
    expect(getCurrentTheme()).toBe('dog');

    const next1 = toggleTheme();
    expect(next1).toBe('galua');
    expect(getCurrentTheme()).toBe('galua');
    expect(storageMap[THEME_STORAGE_KEY]).toBe('galua');

    const next2 = toggleTheme();
    expect(next2).toBe('dog');
    expect(getCurrentTheme()).toBe('dog');
    expect(storageMap[THEME_STORAGE_KEY]).toBe('dog');
  });

  it('onThemeChange 리스너가 테마 변경 시 정상 호출되어야 한다', () => {
    const listener = vi.fn();
    const unsubscribe = onThemeChange(listener);

    setTheme('galua');
    expect(listener).toHaveBeenCalledWith('galua');

    toggleTheme();
    expect(listener).toHaveBeenCalledWith('dog');

    // 구독 해제 테스트
    unsubscribe();
    toggleTheme();
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('동일한 테마로 setTheme 호출 시 중복 이벤트가 발생하지 않는다', () => {
    const listener = vi.fn();
    onThemeChange(listener);

    setTheme('dog'); // 이미 dog인 상태
    expect(listener).not.toHaveBeenCalled();
  });

  it('getThemeImages()는 요청한 테마 또는 현재 테마의 이미지를 반환한다', () => {
    setTheme('dog');
    const imagesDog = getThemeImages();
    expect(imagesDog).toBeDefined();
    expect(imagesDog.front).toBeDefined();
    expect(imagesDog.back).toBeDefined();

    const imagesGalua = getThemeImages('galua');
    expect(imagesGalua).toBeDefined();
    expect(imagesGalua.front).toBeDefined();
    expect(imagesGalua.back).toBeDefined();
  });

  it('preloadThemeImages는 오류 없이 호출되어야 한다', () => {
    expect(() => preloadThemeImages()).not.toThrow();
  });

  it('tileRenderer: renderDogTileCanvas는 renderCharacterTileCanvas와 동일한 함수여야 한다 (하위 호환성)', () => {
    expect(renderDogTileCanvas).toBe(renderCharacterTileCanvas);
  });

  it('renderCharacterTileCanvas는 에러 없이 Canvas에 타일을 렌더링한다', () => {
    const mockContext = {
      clearRect: vi.fn(),
      save: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      drawImage: vi.fn(),
      restore: vi.fn()
    };

    const mockCanvas = {
      getContext: () => mockContext,
      width: 100,
      height: 100
    } as unknown as HTMLCanvasElement;

    const mockFront = {} as HTMLImageElement;
    const mockBack = { complete: true } as HTMLImageElement;

    // ID 연산
    renderCharacterTileCanvas(mockCanvas, D4.ID, mockFront, mockBack);
    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.drawImage).toHaveBeenCalled();

    // R90 회전 연산
    renderCharacterTileCanvas(mockCanvas, D4.R90, mockFront, mockBack);
    expect(mockContext.rotate).toHaveBeenCalled();

    // MX 반전 연산 (대칭: 뒷면 이미지 기준 180도 회전)
    renderCharacterTileCanvas(mockCanvas, D4.MX, mockFront, mockBack);
    expect(mockContext.rotate).toHaveBeenCalledWith(Math.PI);
  });
});
