import { describe, it, expect, beforeEach } from 'vitest';
import { formatTime, RecordManager } from './recordManager';

class LocalStorageMock implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
}

describe('RecordManager 단위 테스트', () => {
  let recordManager: RecordManager;
  let mockStorage: LocalStorageMock;

  beforeEach(() => {
    mockStorage = new LocalStorageMock();
    // globalThis.localStorage 모킹
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true
    });
    recordManager = new RecordManager();
  });

  describe('formatTime 포맷팅', () => {
    it('0 밀리초는 00:00.0 형식이어야 함', () => {
      expect(formatTime(0)).toBe('00:00.0');
    });

    it('500 밀리초는 00:00.5 형식이어야 함', () => {
      expect(formatTime(500)).toBe('00:00.5');
    });

    it('12.34초(12340ms)는 00:12.3 형식이어야 함', () => {
      expect(formatTime(12340)).toBe('00:12.3');
    });

    it('1분 23.45초(83450ms)는 01:23.4 형식이어야 함', () => {
      expect(formatTime(83450)).toBe('01:23.4');
    });

    it('음수나 비정상 입력은 00:00.0 반환', () => {
      expect(formatTime(-100)).toBe('00:00.0');
      expect(formatTime(NaN)).toBe('00:00.0');
    });
  });

  describe('기록 저장 및 조회 (saveRecord & getRecord)', () => {
    it('초기에는 저장된 기록이 없어야 함', () => {
      const rec = recordManager.getRecord(3, 3);
      expect(rec).toBeNull();
    });

    it('첫 기록 저장 시 신기록으로 판정되어야 함', () => {
      const result = recordManager.saveRecord(3, 3, 15200, 5);
      expect(result.isNewBestTime).toBe(true);
      expect(result.isNewBestMoves).toBe(true);
      expect(result.bestTimeMs).toBe(15200);
      expect(result.bestMoves).toBe(5);

      const saved = recordManager.getRecord(3, 3);
      expect(saved).not.toBeNull();
      expect(saved?.bestTimeMs).toBe(15200);
      expect(saved?.bestMoves).toBe(5);
    });

    it('시간만 더 빠를 경우 isNewBestTime만 true여야 함', () => {
      recordManager.saveRecord(3, 3, 15000, 4);

      const result = recordManager.saveRecord(3, 3, 12000, 6);
      expect(result.isNewBestTime).toBe(true);
      expect(result.isNewBestMoves).toBe(false);
      expect(result.bestTimeMs).toBe(12000);
      expect(result.bestMoves).toBe(4);
    });

    it('조작 수만 더 적을 경우 isNewBestMoves만 true여야 함', () => {
      recordManager.saveRecord(3, 3, 12000, 5);

      const result = recordManager.saveRecord(3, 3, 18000, 3);
      expect(result.isNewBestTime).toBe(false);
      expect(result.isNewBestMoves).toBe(true);
      expect(result.bestTimeMs).toBe(12000);
      expect(result.bestMoves).toBe(3);
    });

    it('보드 크기와 난이도별로 분리 저장되어야 함', () => {
      recordManager.saveRecord(3, 3, 10000, 3);
      recordManager.saveRecord(4, 5, 25000, 7);

      const rec3 = recordManager.getRecord(3, 3);
      const rec4 = recordManager.getRecord(4, 5);

      expect(rec3?.bestTimeMs).toBe(10000);
      expect(rec3?.bestMoves).toBe(3);
      expect(rec4?.bestTimeMs).toBe(25000);
      expect(rec4?.bestMoves).toBe(7);
    });
  });

  describe('타이머 상태 관리', () => {
    it('타이머 시작, 정지, 리셋이 정상 작동해야 함', () => {
      expect(recordManager.isTimerRunning()).toBe(false);
      recordManager.startTimer();
      expect(recordManager.isTimerRunning()).toBe(true);

      const elapsed = recordManager.stopTimer();
      expect(recordManager.isTimerRunning()).toBe(false);
      expect(elapsed).toBeGreaterThanOrEqual(0);

      recordManager.resetTimer();
      expect(recordManager.getElapsedMs()).toBe(0);
      expect(recordManager.getFormattedTime()).toBe('00:00.0');
    });
  });
});
