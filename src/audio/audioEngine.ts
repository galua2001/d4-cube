// Web Audio API를 활용한 무지연 사운드 및 BGM 제어

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxEnabled = true;
  private bgmEnabled = false;

  constructor() {
    // 배경음악 객체 초기화 (브라우저 환경 지원)
    if (typeof Audio !== 'undefined') {
      this.bgmAudio = new Audio('/assets/bgm.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.35;
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = (typeof window !== 'undefined' ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) : (globalThis as unknown as { AudioContext: typeof AudioContext }).AudioContext);
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTap() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // 콤보 피치 음계: 도(C4) - 레(D4) - 미(E4) - 파(F4) - 솔(G4) - 라(A4) - 도(C5)
  private readonly comboScale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25];
  private lastFlipTime = 0;
  private comboIndex = 0;

  /**
   * 현재 콤보 단계 반환 (0 ~ 6)
   */
  public getComboIndex(): number {
    return this.comboIndex;
  }

  /**
   * 콤보 단계 리셋
   */
  public resetCombo() {
    this.comboIndex = 0;
    this.lastFlipTime = 0;
  }

  public playFlip() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = Date.now();
    // 1.2초(1200ms) 이내 연속 조작 시 피치 단계 상승
    if (this.lastFlipTime > 0 && now - this.lastFlipTime <= 1200) {
      this.comboIndex = Math.min(this.comboIndex + 1, this.comboScale.length - 1);
    } else {
      this.comboIndex = 0;
    }
    this.lastFlipTime = now;

    const baseFreq = this.comboScale[this.comboIndex];
    const endFreq = baseFreq * 0.58; // 기분 좋은 플립 타격감과 여운

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(50, endFreq), this.ctx.currentTime + 0.13);

    // 콤보가 높을수록 살짝 더 경쾌하게 볼륨 조절
    const baseGain = 0.28 + this.comboIndex * 0.02;
    gain.gain.setValueAtTime(baseGain, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.13);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);
  }

  public playWin() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // 웅장하고 신나는 승리 팡파르 멜로디 (도-미-솔-도-솔-높은도)
    const melody = [
      { freq: 523.25, time: 0.00, dur: 0.12 }, // C5
      { freq: 659.25, time: 0.10, dur: 0.12 }, // E5
      { freq: 783.99, time: 0.20, dur: 0.12 }, // G5
      { freq: 1046.50, time: 0.30, dur: 0.16 }, // C6
      { freq: 783.99, time: 0.44, dur: 0.12 }, // G5
      { freq: 1046.50, time: 0.54, dur: 0.45 }, // C6 (길게)
      { freq: 1318.51, time: 0.54, dur: 0.45 }  // E6 화음
    ];

    melody.forEach(note => {
      const startTime = this.ctx!.currentTime + note.time;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, startTime);

      gain.gain.setValueAtTime(0.28, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + note.dur);
    });

    // 반짝이는 마법 차임벨 효과음
    const chimes = [1567.98, 1760.00, 2093.00, 2637.02];
    chimes.forEach((f, i) => {
      const startTime = this.ctx!.currentTime + 0.6 + i * 0.07;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startTime);
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  public playCombo() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // 대칭 합성 성공 시 상쾌하고 밝은 상승 아르페지오 화음
    const notes = [440.00, 554.37, 659.25, 880.00]; // A4 - C#5 - E5 - A5
    notes.forEach((freq, idx) => {
      const startTime = this.ctx!.currentTime + idx * 0.05;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  }

  public playClear() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // 단계 완료 및 원상 복구 시 챠링~ 차임벨 화음
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 - E5 - G5 - C6
    notes.forEach((freq, idx) => {
      const startTime = this.ctx!.currentTime + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.22);
    });
  }

  public toggleBgm(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmAudio) {
      if (this.bgmEnabled) {
        this.bgmAudio.play().catch(() => {
          // 브라우저 정책으로 자동 재생 차단 시 처리
          this.bgmEnabled = false;
        });
      } else {
        this.bgmAudio.pause();
      }
    }
    return this.bgmEnabled;
  }

  public toggleSfx(): boolean {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  public isBgmOn(): boolean {
    return this.bgmEnabled;
  }

  public isSfxOn(): boolean {
    return this.sfxEnabled;
  }
}

export const soundEngine = new SoundEngine();
