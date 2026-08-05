// Web Audio API ambient wedding processional synthesizer
// Pure in-browser synthesized piano tones using mathematical harmonics and natural ADSR envelopes.

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private musicTimer: ReturnType<typeof setTimeout> | null = null;
  private volumeNode: GainNode | null = null;
  private isMuted = false;

  private NOTE = {
    B1: 61.74,
    G1: 49.00,
    D2: 73.42,
    E2: 82.41,
    FS2: 92.50,
    G2: 98.00,
    A2: 110.00,
    B2: 123.47,
    D3: 146.83,
    E3: 164.81,
    FS3: 184.99,
    G3: 196.00,
    A3: 220.00,
    CS4: 277.18,
    D4: 293.66,
    E4: 329.63,
    FS4: 369.99,
    G4: 392.00,
    A4: 440.00,
    B4: 493.88,
    CS5: 554.37,
    D5: 587.33,
    E5: 659.25,
    FS5: 739.99,
  };

  private walkingBass = [
    73.42,  // D2
    110.00, // A2
    61.74,  // B1
    92.50,  // FS2
    49.00,  // G1
    73.42,  // D2
    49.00,  // G1
    110.00, // A2
  ];

  private chords = [
    [146.83, 184.99, 220.00], // D3, FS3, A3
    [110.00, 277.18, 164.81], // A2, CS4, E3
    [123.47, 293.66, 184.99], // B2, D4, FS3
    [184.99, 220.00, 277.18], // FS3, A3, CS4
    [98.00, 123.47, 293.66],  // G2, B2, D4
    [146.83, 184.99, 220.00], // D3, FS3, A3
    [98.00, 123.47, 293.66],  // G2, B2, D4
    [110.00, 277.18, 164.81], // A2, CS4, E3
  ];

  private melody = [
    369.99, 440.00, null, 392.00,
    329.63, 554.37, null, 587.33,
    554.37, 493.88, null, 440.00,
    392.00, 369.99, null, 329.63,
    293.66, 369.99, null, 440.00,
    369.99, 293.66, null, null,
    293.66, 369.99, null, 392.00,
    440.00, 392.00, null, null
  ];

  private getCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.value = this.isMuted ? 0 : 0.85;
      this.volumeNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private pluckNote(ctx: AudioContext, freq: number, startTime: number, duration: number, volume: number) {
    if (!this.volumeNode) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.value = freq * 2;

    const attack = 0.03;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    gain2.gain.setValueAtTime(0, startTime);
    gain2.gain.linearRampToValueAtTime(volume * 0.15, startTime + attack);
    gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.55);

    osc.connect(gain);
    gain.connect(this.volumeNode);

    osc2.connect(gain2);
    gain2.connect(this.volumeNode);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.15);

    osc2.start(startTime);
    osc2.stop(startTime + duration + 0.15);
  }

  private bassNote(ctx: AudioContext, freq: number, startTime: number, duration: number, volume: number) {
    if (!this.volumeNode) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.volumeNode);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.15);
  }

  public playChime() {
    try {
      const ctx = this.getCtx();
      const now = ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        this.pluckNote(ctx, freq, now + idx * 0.08, 1.5, 0.08);
      });
    } catch {
      // Audio context might fail without user interaction
    }
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    try {
      const ctx = this.getCtx();
      this.scheduleLoop();
    } catch {
      this.isPlaying = false;
    }
  }

  private scheduleLoop = () => {
    if (!this.isPlaying) return;
    const ctx = this.getCtx();
    const noteGap = 0.5;
    const barDuration = noteGap * 4;
    const startAt = ctx.currentTime + 0.1;

    // Bass line
    this.walkingBass.forEach((freq, barIndex) => {
      const t = startAt + barIndex * barDuration;
      this.bassNote(ctx, freq, t, barDuration * 1.05, 0.05);
    });

    // Arpeggiated chords
    this.chords.forEach((chord, barIndex) => {
      const barStart = startAt + barIndex * barDuration;
      chord.forEach((freq, i) => {
        this.pluckNote(ctx, freq, barStart + i * 0.06, barDuration * 0.9, 0.035);
      });
    });

    // Melody
    this.melody.forEach((freq, i) => {
      if (freq === null) return;
      const t = startAt + i * noteGap;
      this.pluckNote(ctx, freq, t, noteGap * 1.7, 0.06);
    });

    const totalDuration = barDuration * this.chords.length;
    this.musicTimer = setTimeout(() => {
      if (this.isPlaying) {
        this.scheduleLoop();
      }
    }, totalDuration * 1000);
  };

  public stop() {
    this.isPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.volumeNode && this.ctx) {
      this.volumeNode.gain.setValueAtTime(muted ? 0 : 0.85, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const audioSynth = new AudioSynthesizer();
