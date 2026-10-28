import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { GestureRecognizer } from './gesture';

describe('GestureRecognizer - allowDiagonal 및 컨트롤러 성분 매핑 검증', () => {
  let mockBoard: any;
  let mockCanvas: any;
  let callback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      getComputedStyle: vi.fn(() => ({ position: 'relative' })),
    });

    mockBoard = {
      addEventListener: vi.fn(),
      appendChild: vi.fn(),
      getBoundingClientRect: vi.fn(() => ({ width: 300, height: 300, left: 0, top: 0 })),
      setPointerCapture: vi.fn(),
    };

    mockCanvas = {
      getContext: vi.fn(() => ({
        clearRect: vi.fn(),
      })),
      width: 0,
      height: 0,
    };

    callback = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

describe('GestureRecognizer - D4 하이브리드 회전 조작 시스템 및 제스처 안전성 검증', () => {
  let mockBoard: any;
  let mockCanvas: any;
  let callback: ReturnType<typeof vi.fn>;
  let listeners: Record<string, Function> = {};

  beforeEach(() => {
    vi.useFakeTimers();
    listeners = {};

    vi.stubGlobal('window', {
      addEventListener: vi.fn((event: string, handler: Function) => {
        listeners[`window_${event}`] = handler;
      }),
      removeEventListener: vi.fn(),
      getComputedStyle: vi.fn(() => ({ position: 'relative' })),
      requestAnimationFrame: vi.fn((fn: Function) => setTimeout(fn, 16)),
      cancelAnimationFrame: vi.fn((id: any) => clearTimeout(id)),
    });

    vi.stubGlobal('document', {
      createElement: vi.fn(() => ({
        className: '',
        id: '',
        innerHTML: '',
        style: {} as any,
        querySelector: vi.fn(() => ({ style: {} })),
        classList: {
          contains: vi.fn(),
          add: vi.fn(),
          remove: vi.fn(),
        },
        appendChild: vi.fn(),
      })),
    });

    mockBoard = {
      addEventListener: vi.fn((event: string, handler: Function) => {
        listeners[`board_${event}`] = handler;
      }),
      appendChild: vi.fn(),
      getBoundingClientRect: vi.fn(() => ({ width: 300, height: 300, left: 0, top: 0 })),
      setPointerCapture: vi.fn(),
      children: [],
    };

    mockCanvas = {
      getContext: vi.fn(() => ({
        clearRect: vi.fn(),
      })),
      width: 300,
      height: 300,
    };

    callback = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('단일 탭(Single Tap): 손을 뗀 후 240ms 동안 추가 탭이 없으면 90도 회전(R90)이 단 1수로 발동해야 함', () => {
    new GestureRecognizer(mockBoard, mockCanvas, callback, 3);

    // 0,0 셀 (1행) 누름 시작 (x=50, y=50)
    listeners['board_pointerdown']({
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      target: { closest: () => null, classList: { contains: () => false } },
    });

    // 50ms 후 손 뗌 (pointerup)
    vi.advanceTimersByTime(50);
    listeners['board_pointerup']({
      clientX: 50,
      clientY: 50,
    });

    // 더블탭 인식 대기 중이므로 아직 발동되지 않아야 함
    expect(callback).not.toHaveBeenCalled();

    // 240ms 경과 (더블탭 대기 시간 만료)
    vi.advanceTimersByTime(240);

    // R90 발동 확인
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'row', idx: 0 }),
      'R90',
    );
  });

  it('톡톡 더블 탭(Double Tap): 240ms 이내에 동일한 타일(r, c)을 다시 탭하면 즉시 180도 회전(R180)이 단 1수로 발동해야 함', () => {
    new GestureRecognizer(mockBoard, mockCanvas, callback, 3);

    // 첫 번째 탭 (누름 40ms -> 뗌)
    listeners['board_pointerdown']({
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      target: { closest: () => null, classList: { contains: () => false } },
    });
    vi.advanceTimersByTime(40);
    listeners['board_pointerup']({
      clientX: 50,
      clientY: 50,
    });

    expect(callback).not.toHaveBeenCalled();

    // 100ms 후 두 번째 탭 (240ms 윈도우 이내, 누름 40ms -> 뗌)
    vi.advanceTimersByTime(100);
    listeners['board_pointerdown']({
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      target: { closest: () => null, classList: { contains: () => false } },
    });
    vi.advanceTimersByTime(40);
    listeners['board_pointerup']({
      clientX: 50,
      clientY: 50,
    });

    // 즉시 R180이 단 1회 발동해야 함
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'row', idx: 0 }),
      'R180',
    );

    // 이후 시간이 지나도 R90이 추가 호출되지 않아야 함
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('180도 시간 판정 제거 및 더블탭 전용 한정: 250ms~540ms 동안 누르고 떼더라도 180도가 발동하지 않고 단일 탭(240ms 후 R90)으로 처리되어야 함', () => {
    new GestureRecognizer(mockBoard, mockCanvas, callback, 3);

    listeners['board_pointerdown']({
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      target: { closest: () => null, classList: { contains: () => false } },
    });

    // 280ms 누른 후 손 뗌 (과거 180도 시간 판정 기준이었으나 지금은 제거됨)
    vi.advanceTimersByTime(280);
    listeners['board_pointerup']({
      clientX: 50,
      clientY: 50,
    });

    // 손 뗀 직후(이전 탭 없음) 180도(R180)가 즉시 발동하지 않아야 함
    expect(callback).not.toHaveBeenCalled();

    // 단일 탭 윈도우(240ms) 경과 후 R90으로 정상 발동 확인
    vi.advanceTimersByTime(240);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'row', idx: 0 }),
      'R90',
    );
  });

  it('인디케이터 표시 220ms 지연 검증: pointerdown 후 220ms 미만에서는 인디케이터가 표시되지 않고, 220ms 도달 시 표시되어야 함', () => {
    const gesture = new GestureRecognizer(mockBoard, mockCanvas, callback, 3);

    listeners['board_pointerdown']({
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      target: { closest: () => null, classList: { contains: () => false } },
    });

    // 100ms 경과: 220ms 미만이므로 인디케이터 엘리먼트가 아직 DOM에 붙지 않음
    vi.advanceTimersByTime(100);
    const indicatorElBefore = (gesture as any).indicatorEl;
    expect(indicatorElBefore).toBeNull();

    // 220ms 경과 시점에 인디케이터가 비로소 생성 및 표시(active)되어야 함
    vi.advanceTimersByTime(120);
    const indicatorElAfter = (gesture as any).indicatorEl;
    expect(indicatorElAfter).not.toBeNull();
    expect(indicatorElAfter.className).toContain('active');
    expect(indicatorElAfter.className).toContain('stage-270');
  });

  it('스와이프 시 인디케이터 미표시 검증: 터치 후 220ms 이내에 35px 이상 스와이프하면 인디케이터 예약이 취소되어 인디케이터가 뜨지 않아야 함', () => {
    const gesture = new GestureRecognizer(mockBoard, mockCanvas, callback, 3);

    listeners['board_pointerdown']({
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      target: { closest: () => null, classList: { contains: () => false } },
    });

    // 50ms 후 35px 이상 가로 이동 (스와이프)
    vi.advanceTimersByTime(50);
    listeners['board_pointermove']({
      clientX: 90,
      clientY: 50,
    });

    // 220ms가 훨씬 지난 후(총 300ms)에도 인디케이터가 생성되거나 활성화되지 않아야 함
    vi.advanceTimersByTime(250);
    const indicatorEl = (gesture as any).indicatorEl;
    expect(indicatorEl).toBeNull();
  });

  it('550ms 롱 프레스(Long Press): 550ms 도달 즉시 270도 회전(R270)이 자동 발동하고 손 뗄 때 중복 발동하지 않아야 함', () => {
    new GestureRecognizer(mockBoard, mockCanvas, callback, 3);

    listeners['board_pointerdown']({
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      target: { closest: () => null, classList: { contains: () => false } },
    });

    // 550ms 경과 시 즉시 자동 발동!
    vi.advanceTimersByTime(550);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'row', idx: 0 }),
      'R270',
    );

    // 사용자가 손가락을 뗄 때 (pointerup) 추가 호출이 없어야 함
    listeners['board_pointerup']({
      clientX: 50,
      clientY: 50,
    });

    expect(callback).toHaveBeenCalledTimes(1); // 여전히 1회 유지
  });

  it('35px 이상 이동 시 롱프레스 및 탭 예약이 취소되고 스와이프 반사(MX)가 발동해야 함', () => {
    new GestureRecognizer(mockBoard, mockCanvas, callback, 3);

    listeners['board_pointerdown']({
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      target: { closest: () => null, classList: { contains: () => false } },
    });

    // 가로로 50px 이동 (35px 초과)
    listeners['board_pointermove']({
      clientX: 100,
      clientY: 50,
    });

    // 600ms가 지나도 롱프레스(R270)나 탭(R90)이 발동하지 않아야 함
    vi.advanceTimersByTime(600);
    expect(callback).not.toHaveBeenCalled();

    // 손 떼는 순간 가로 스와이프 (MX) 발동
    listeners['board_pointerup']({
      clientX: 100,
      clientY: 50,
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'row', idx: 0 }),
      'MX',
    );
  });

  it('모바일 롱프레스 컨텍스트 메뉴 방지: contextmenu 이벤트 발생 시 preventDefault가 호출되어야 함', () => {
    new GestureRecognizer(mockBoard, mockCanvas, callback, 3);

    expect(listeners['board_contextmenu']).toBeDefined();
    const mockEvent = {
      preventDefault: vi.fn(),
    };
    listeners['board_contextmenu'](mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('모바일 제스처 취소 방지: pointercancel 발생 시 상태가 안전하게 초기화되고 아무 액션도 발동하지 않아야 함', () => {
    new GestureRecognizer(mockBoard, mockCanvas, callback, 3);

    listeners['board_pointerdown']({
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      target: { closest: () => null, classList: { contains: () => false } },
    });

    // 도중에 브라우저 시스템 제스처 등으로 취소 발생
    vi.advanceTimersByTime(200);
    expect(listeners['board_pointercancel']).toBeDefined();
    listeners['board_pointercancel']();

    // 1초 이상 시간이 지나도 어떤 액션도 발동하지 않아야 함
    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('1행1열 스위치(.tile-switch-11) 조작 시 제스처가 무시되어야 함', () => {
    new GestureRecognizer(mockBoard, mockCanvas, callback, 3);

    const switchElem = {
      closest: (selector: string) => (selector === '.tile-switch-11' ? {} : null),
      classList: { contains: (cls: string) => cls === 'tile-switch-11' },
    };

    listeners['board_pointerdown']({
      clientX: 50,
      clientY: 50,
      pointerId: 1,
      target: switchElem,
    });

    vi.advanceTimersByTime(600);
    listeners['board_pointerup']({
      clientX: 50,
      clientY: 50,
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
