/**
 * @file colorTheme.ts
 * @description 라이트/다크 컬러 테마 (☀️ 라이트 모드 ↔ 🌙 다크 모드) 관리 모듈
 */

export type ColorMode = 'light' | 'dark';

export const COLOR_MODE_STORAGE_KEY = 'galois_cube_color_mode';

// 기본값: 'light' (화사하고 밝은 화면)
let currentColorMode: ColorMode = 'light';

// 브라우저 로컬 스토리지에서 저장된 테마 로드
try {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(COLOR_MODE_STORAGE_KEY) as ColorMode;
    if (saved === 'light' || saved === 'dark') {
      currentColorMode = saved;
    }
  }
} catch {
  // localStorage 접근 불가 환경 대비
}

type ColorModeChangeListener = (mode: ColorMode) => void;
const listeners: ColorModeChangeListener[] = [];

/**
 * DOM 및 메타 태그에 현재 컬러 테마를 반영합니다.
 */
function applyColorModeToDom(mode: ColorMode): void {
  if (typeof document === 'undefined') return;

  try {
    document.documentElement.setAttribute('data-theme', mode);

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', mode === 'light' ? '#f8fafc' : '#0f172a');
    }
  } catch (err) {
    console.warn('DOM 컬러 테마 적용 실패:', err);
  }
}

// 초기화 시 DOM에 즉시 반영
if (typeof document !== 'undefined') {
  applyColorModeToDom(currentColorMode);
}

/**
 * 현재 컬러 모드를 반환합니다.
 */
export function getColorMode(): ColorMode {
  return currentColorMode;
}

/**
 * 컬러 모드를 설정하고 DOM 반영 및 리스너에게 통지합니다.
 */
export function setColorMode(mode: ColorMode): void {
  currentColorMode = mode;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, mode);
    }
  } catch {
    // ignore
  }

  applyColorModeToDom(mode);

  listeners.forEach((cb) => {
    try {
      cb(mode);
    } catch (err) {
      console.error('컬러 테마 변경 리스너 에러:', err);
    }
  });
}

/**
 * 컬러 모드를 토글(light ↔ dark)하고 변경된 모드를 반환합니다.
 */
export function toggleColorMode(): ColorMode {
  const nextMode: ColorMode = currentColorMode === 'light' ? 'dark' : 'light';
  setColorMode(nextMode);
  return nextMode;
}

/**
 * 컬러 테마 변경 이벤트를 구독합니다.
 * @returns 구독 해제 함수
 */
export function onColorModeChange(cb: ColorModeChangeListener): () => void {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx !== -1) {
      listeners.splice(idx, 1);
    }
  };
}
