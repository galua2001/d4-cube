// 크기 및 난이도별 최고 기록(Best Time, Best Moves) 및 초시계 관리자

export interface BestRecord {
  bestTimeMs: number | null; // 최고 시간 (밀리초)
  bestMoves: number | null;  // 최소 조작 횟수
  updatedAt?: number;        // 기록 갱신 일시
}

export interface SaveResult {
  isNewBestTime: boolean;
  isNewBestMoves: boolean;
  bestTimeMs: number;
  bestMoves: number;
}

const STORAGE_PREFIX = 'matrix_cube_best_record_v1';

/**
 * 밀리초를 '00:00.0' (분:초.밀리초) 형식으로 포맷팅
 * @param ms 밀리초 단위 시간
 */
export function formatTime(ms: number): string {
  if (ms < 0 || isNaN(ms)) return '00:00.0';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);

  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');
  return `${mStr}:${sStr}.${tenths}`;
}

export class RecordManager {
  private startTime: number | null = null;
  private accumulatedMs = 0;
  private timerIntervalId: ReturnType<typeof setInterval> | null = null;
  private tickCallback: ((formatted: string, ms: number) => void) | null = null;

  /**
   * 로컬스토리지 키 생성
   */
  public getRecordKey(size: number, moves: number): string {
    return `${STORAGE_PREFIX}_${size}x${size}_${moves}moves`;
  }

  private getStorage(): Storage | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
    return null;
  }

  /**
   * 특정 크기 및 난이도의 최고 기록 조회
   */
  public getRecord(size: number, moves: number): BestRecord | null {
    try {
      const storage = this.getStorage();
      if (!storage) return null;
      const key = this.getRecordKey(size, moves);
      const raw = storage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as BestRecord;
      return {
        bestTimeMs: typeof parsed.bestTimeMs === 'number' ? parsed.bestTimeMs : null,
        bestMoves: typeof parsed.bestMoves === 'number' ? parsed.bestMoves : null,
        updatedAt: parsed.updatedAt
      };
    } catch {
      return null;
    }
  }

  /**
   * 기록 저장 및 신기록 여부 판정
   */
  public saveRecord(size: number, movesDiff: number, timeMs: number, movesCount: number): SaveResult {
    const existing = this.getRecord(size, movesDiff);
    let isNewBestTime = false;
    let isNewBestMoves = false;

    let bestTime = existing?.bestTimeMs ?? null;
    let bestMoves = existing?.bestMoves ?? null;

    if (bestTime === null || timeMs < bestTime) {
      bestTime = timeMs;
      isNewBestTime = true;
    }

    if (bestMoves === null || movesCount < bestMoves) {
      bestMoves = movesCount;
      isNewBestMoves = true;
    }

    const updatedRecord: BestRecord = {
      bestTimeMs: bestTime,
      bestMoves: bestMoves,
      updatedAt: Date.now()
    };

    try {
      const storage = this.getStorage();
      if (storage) {
        const key = this.getRecordKey(size, movesDiff);
        storage.setItem(key, JSON.stringify(updatedRecord));
      }
    } catch {
      // 로컬스토리지 오류 무시 (시크릿 모드 용량 초과 등)
    }

    return {
      isNewBestTime,
      isNewBestMoves,
      bestTimeMs: bestTime,
      bestMoves: bestMoves
    };
  }

  // ==========================================
  // 초시계 (타이머) 관리
  // ==========================================

  /**
   * 타이머 시작
   */
  public startTimer(onTick?: (formatted: string, ms: number) => void) {
    if (onTick) {
      this.tickCallback = onTick;
    }
    if (this.timerIntervalId !== null) return; // 이미 실행 중

    this.startTime = performance.now();

    this.timerIntervalId = setInterval(() => {
      const currentElapsed = this.getElapsedMs();
      if (this.tickCallback) {
        this.tickCallback(formatTime(currentElapsed), currentElapsed);
      }
    }, 100);
  }

  /**
   * 타이머 일시 정지 및 경과 시간 반환
   */
  public stopTimer(): number {
    if (this.startTime !== null) {
      this.accumulatedMs += performance.now() - this.startTime;
      this.startTime = null;
    }
    if (this.timerIntervalId !== null) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
    return this.accumulatedMs;
  }

  /**
   * 타이머 초기화
   */
  public resetTimer() {
    this.stopTimer();
    this.accumulatedMs = 0;
    this.startTime = null;
    if (this.tickCallback) {
      this.tickCallback(formatTime(0), 0);
    }
  }

  /**
   * 현재까지의 총 경과 시간(밀리초) 반환
   */
  public getElapsedMs(): number {
    let current = this.accumulatedMs;
    if (this.startTime !== null) {
      current += performance.now() - this.startTime;
    }
    return Math.floor(current);
  }

  /**
   * 현재 경과 시간 포맷 반환
   */
  public getFormattedTime(): string {
    return formatTime(this.getElapsedMs());
  }

  /**
   * 타이머가 현재 실행 중인지 여부
   */
  public isTimerRunning(): boolean {
    return this.timerIntervalId !== null;
  }
}

export const recordManager = new RecordManager();
