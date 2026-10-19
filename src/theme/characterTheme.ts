/**
 * @file characterTheme.ts
 * @description 캐릭터 테마 (강아지 🐶 ↔ 갈루아 소년 🧑‍🎓) 관리 모듈
 */

export type CharacterTheme = 'dog' | 'galua';

export const THEME_STORAGE_KEY = 'galois_cube_theme';

export interface ThemeImages {
  front: HTMLImageElement;
  back: HTMLImageElement;
}

// 현재 활성 테마 (기본값: 'dog')
let currentTheme: CharacterTheme = 'dog';

try {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as CharacterTheme;
    if (saved === 'dog' || saved === 'galua') {
      currentTheme = saved;
    }
  }
} catch {
  // localStorage 접근 제한 환경 대비
}

type ThemeChangeListener = (theme: CharacterTheme) => void;
const listeners: ThemeChangeListener[] = [];

// 이미지 캐시
const imageCache: Record<CharacterTheme, ThemeImages | null> = {
  dog: null,
  galua: null,
};

/**
 * 특정 테마의 이미지 객체 쌍(앞면, 뒷면)을 생성하거나 캐시에서 반환합니다.
 */
function createOrGetThemeImages(theme: CharacterTheme): ThemeImages {
  if (imageCache[theme]) {
    return imageCache[theme]!;
  }

  if (typeof Image === 'undefined') {
    // Node.js 또는 테스트 환경 Mock
    const mockFront = { src: '', complete: true } as unknown as HTMLImageElement;
    const mockBack = { src: '', complete: true } as unknown as HTMLImageElement;
    return { front: mockFront, back: mockBack };
  }

  const front = new Image();
  const back = new Image();

  if (theme === 'dog') {
    front.src = 'assets/dog_front.png';
    back.src = 'assets/dog_back.png';
  } else {
    front.src = 'assets/galua_front.png';
    back.src = 'assets/galua_back.png';

    // 에러 발생 시 dog 이미지로 자동 fallback
    front.onerror = () => {
      front.src = 'assets/dog_front.png';
    };
    back.onerror = () => {
      back.src = 'assets/dog_back.png';
    };
  }

  const pair: ThemeImages = { front, back };
  imageCache[theme] = pair;
  return pair;
}

/**
 * 모든 테마의 이미지를 사전 로드(프리로드)합니다.
 */
export function preloadThemeImages(onLoadCallback?: () => void): void {
  if (typeof Image === 'undefined') return;

  const dog = createOrGetThemeImages('dog');
  const galua = createOrGetThemeImages('galua');

  if (onLoadCallback) {
    let loadedCount = 0;
    const total = 4;
    const checkAll = () => {
      loadedCount++;
      if (loadedCount >= total) {
        onLoadCallback();
      }
    };

    [dog.front, dog.back, galua.front, galua.back].forEach((img) => {
      if (img.complete) {
        loadedCount++;
      } else {
        img.addEventListener('load', checkAll, { once: true });
        img.addEventListener('error', checkAll, { once: true });
      }
    });

    if (loadedCount >= total) {
      onLoadCallback();
    }
  }
}

/**
 * 현재 테마를 반환합니다.
 */
export function getCurrentTheme(): CharacterTheme {
  return currentTheme;
}

/**
 * 캐릭터 테마를 설정하고 리스너에 통지합니다.
 */
export function setTheme(theme: CharacterTheme): void {
  if (currentTheme !== theme) {
    currentTheme = theme;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch {
      // ignore
    }
    listeners.forEach((cb) => {
      try {
        cb(theme);
      } catch (err) {
        console.error('테마 변경 리스너 에러:', err);
      }
    });
  }
}

/**
 * 현재 테마를 토글(dog ↔ galua)하고 변경된 테마를 반환합니다.
 */
export function toggleTheme(): CharacterTheme {
  const nextTheme: CharacterTheme = currentTheme === 'dog' ? 'galua' : 'dog';
  setTheme(nextTheme);
  return nextTheme;
}

/**
 * 테마 변경 이벤트를 구독합니다.
 * @returns 구독 해제 함수
 */
export function onThemeChange(cb: ThemeChangeListener): () => void {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  };
}

/**
 * 지정된 테마(생략 시 현재 테마)의 앞면/뒷면 이미지를 반환합니다.
 */
export function getThemeImages(theme?: CharacterTheme): ThemeImages {
  const targetTheme = theme || currentTheme;
  return createOrGetThemeImages(targetTheme);
}
