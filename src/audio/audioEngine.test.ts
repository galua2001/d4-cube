import { describe, it, expect, beforeEach, vi } from 'vitest';
import { soundEngine } from './audioEngine';

describe('SoundEngine 콤보 피치 시스템 테스트', () => {
  beforeEach(() => {
    soundEngine.resetCombo();
    vi.useFakeTimers();
  });

  it('초기 콤보 인덱스는 0이어야 함', () => {
    expect(soundEngine.getComboIndex()).toBe(0);
  });

  it('1.2초(1200ms) 이내에 연속 호출 시 콤보 단계가 증가해야 함 (최대 6)', () => {
    // Web Audio Mocking
    const mockCtx = {
      state: 'running',
      currentTime: 0,
      resume: vi.fn(),
      createOscillator: vi.fn().mockReturnValue({
        type: 'triangle',
        frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn()
      }),
      createGain: vi.fn().mockReturnValue({
        gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
        connect: vi.fn()
      }),
      destination: {}
    };

    Object.defineProperty(globalThis, 'AudioContext', {
      value: vi.fn().mockReturnValue(mockCtx),
      writable: true,
      configurable: true
    });

    // 1회 호출
    soundEngine.playFlip();
    expect(soundEngine.getComboIndex()).toBe(0);

    // 300ms 후 호출 -> 콤보 1
    vi.advanceTimersByTime(300);
    soundEngine.playFlip();
    expect(soundEngine.getComboIndex()).toBe(1);

    // 400ms 후 호출 -> 콤보 2
    vi.advanceTimersByTime(400);
    soundEngine.playFlip();
    expect(soundEngine.getComboIndex()).toBe(2);

    // 계속 호출하여 최대 6단계(도-레-미-파-솔-라-도)까지 상승
    for (let i = 0; i < 5; i++) {
      vi.advanceTimersByTime(200);
      soundEngine.playFlip();
    }
    expect(soundEngine.getComboIndex()).toBe(6); // 7번째 음 (인덱스 6)

    // 최대 단계 도달 후에도 초과되지 않고 6 유지
    vi.advanceTimersByTime(200);
    soundEngine.playFlip();
    expect(soundEngine.getComboIndex()).toBe(6);
  });

  it('1.2초(1200ms)를 초과하여 조작하면 콤보가 0으로 초기화되어야 함', () => {
    soundEngine.playFlip();
    vi.advanceTimersByTime(300);
    soundEngine.playFlip();
    expect(soundEngine.getComboIndex()).toBe(1);

    // 1300ms 경과 (1.2초 초과)
    vi.advanceTimersByTime(1300);
    soundEngine.playFlip();
    expect(soundEngine.getComboIndex()).toBe(0);
  });
});
