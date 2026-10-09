import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GestureRecognizer } from './gesture';

describe('GestureRecognizer - allowDiagonal 및 컨트롤러 성분 매핑 검증', () => {
  let mockBoard: any;
  let mockCanvas: any;
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    mockBoard = {
      addEventListener: vi.fn(),
      getBoundingClientRect: vi.fn(() => ({ width: 300, height: 300, left: 0, top: 0 })),
    };

    mockCanvas = {
      getContext: vi.fn(() => ({})),
      width: 0,
      height: 0,
    };

    callback = vi.fn();
  });

  it('기본 모드(allowDiagonal: false)에서는 오직 외곽 5곳만 컨트롤러로 인식해야 함', () => {
    const gesture = new GestureRecognizer(mockBoard, mockCanvas, callback, 3);
    expect(gesture.isDiagonalAllowed()).toBe(false);

    // 1-1 성분 (0, 0) -> 기본 1행, 토글 시 1열
    const target00 = gesture.getLineForCell(0, 0);
    expect(target00).toEqual({ type: 'row', idx: 0, label: '1행' });

    gesture.toggleCell11Mode();
    const target00Col = gesture.getLineForCell(0, 0);
    expect(target00Col).toEqual({ type: 'col', idx: 0, label: '1열' });

    // 1행 성분들 (0, 1), (0, 2) -> 2열, 3열
    expect(gesture.getLineForCell(0, 1)).toEqual({ type: 'col', idx: 1, label: '2열' });
    expect(gesture.getLineForCell(0, 2)).toEqual({ type: 'col', idx: 2, label: '3열' });

    // 1열 성분들 (1, 0), (2, 0) -> 2행, 3행
    expect(gesture.getLineForCell(1, 0)).toEqual({ type: 'row', idx: 1, label: '2행' });
    expect(gesture.getLineForCell(2, 0)).toEqual({ type: 'row', idx: 2, label: '3행' });

    // 🚫 기본 모드에서는 대각선 및 내부 성분이 모두 null이어야 함
    expect(gesture.getLineForCell(2, 2)).toBeNull(); // 주대각선 위치 (33)
    expect(gesture.getLineForCell(1, 2)).toBeNull(); // 부대각선 위치 (23)
    expect(gesture.getLineForCell(1, 1)).toBeNull(); // 중앙 성분 (22)
    expect(gesture.getLineForCell(2, 1)).toBeNull(); // 32
  });

  it('대각선 변환 모드 활성화(allowDiagonal: true) 시 주대각선, 부대각선, 중앙성분이 정상 매핑되어야 함', () => {
    const gesture = new GestureRecognizer(mockBoard, mockCanvas, callback, 3);
    gesture.setAllowDiagonal(true);
    expect(gesture.isDiagonalAllowed()).toBe(true);

    // 주대각선 (2, 2)
    const targetMain = gesture.getLineForCell(2, 2);
    expect(targetMain).toEqual({ type: 'diag', idx: 'main', label: '↖ 주대각선' });

    // 부대각선 (1, 2)
    const targetAnti = gesture.getLineForCell(1, 2);
    expect(targetAnti).toEqual({ type: 'diag', idx: 'anti', label: '↗ 부대각선' });

    // 중앙 성분 (1, 1) -> 2행
    const targetCenter = gesture.getLineForCell(1, 1);
    expect(targetCenter).toEqual({ type: 'row', idx: 1, label: '2행' });
  });

  it('4x4 보드에서도 allowDiagonal 플래그에 따라 올바르게 동작해야 함', () => {
    const gesture = new GestureRecognizer(mockBoard, mockCanvas, callback, 4);
    expect(gesture.getLineForCell(3, 3)).toBeNull();

    gesture.setAllowDiagonal(true);
    expect(gesture.getLineForCell(3, 3)).toEqual({ type: 'diag', idx: 'main', label: '↖ 주대각선' });
    expect(gesture.getLineForCell(1, 3)).toEqual({ type: 'diag', idx: 'anti', label: '↗ 부대각선' });
  });
});
