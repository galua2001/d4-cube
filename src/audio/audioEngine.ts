// Web Audio API를 활용한 무지연 사운드 및 BGM 제어

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxEnabled = true;
  private bgmEnabled = false;

  constructor() {
    // 배경음악 객체 초기화
    this.bgmAudio = new Audio('/assets/bgm.mp3');
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.35;
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
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

  public playFlip() {
    if (!this.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
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
