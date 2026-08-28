// Romantic Ambient Music Generator using Web Audio API
// Synthesizes a soft, emotional piano/Rhodes chord progression in C Major / A Minor
// (Cmaj9 -> Am9 -> Fmaj7 -> Gsus4/Gadd9) with warm reverb and gentle chimes.

class RomanticMusicPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private timer: NodeJS.Timeout | null = null;
  private currentChordIndex: number = 0;
  private onPlayStateChange?: (playing: boolean) => void;

  // Chord frequencies (Hz) for romantic, emotive resonance
  private chords = [
    // Cmaj9: C3, G3, B3, D4, E4
    [130.81, 196.00, 246.94, 293.66, 329.63],
    // Am9: A2, E3, G3, C4, B4
    [110.00, 164.81, 196.00, 261.63, 493.88],
    // Fmaj7: F2, C3, E3, A3, C4
    [87.31, 130.81, 164.81, 220.00, 261.63],
    // Gsus4 / G6: G2, D3, G3, C4, E4
    [98.00, 146.83, 196.00, 261.63, 329.63],
    // Em7: E2, B2, E3, G3, D4
    [82.41, 123.47, 164.81, 196.00, 293.66],
    // Dm9: D2, A2, F3, C4, E4
    [73.42, 110.00, 174.61, 261.63, 329.63],
  ];

  public setListener(cb: (playing: boolean) => void) {
    this.onPlayStateChange = cb;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  private playTone(freq: number, startTime: number, duration: number, velocity: number = 0.5) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Soft warm Rhodes-like tone
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 1.002, startTime); // Subtle detune for shimmer

    // Lowpass filter for dreamy intimacy
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, startTime);
    filter.frequency.exponentialRampToValueAtTime(350, startTime + duration);

    // Natural piano-like acoustic envelope: quick attack, warm sustain, long gentle release
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(velocity * 0.25, startTime + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  private playArpeggioChord(chord: number[]) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const chordDuration = 4.2;

    // Play base chord slightly arpeggiated for emotional tenderness
    chord.forEach((freq, i) => {
      const delay = i * 0.12;
      this.playTone(freq, now + delay, chordDuration - delay, 0.45 - (i * 0.03));
    });

    // Add high subtle shimmer bell tone
    const shimmerFreq = chord[chord.length - 1] * 2;
    this.playTone(shimmerFreq, now + 0.8, 2.5, 0.15);
  }

  private scheduleNext() {
    if (!this.isPlaying) return;
    const chord = this.chords[this.currentChordIndex];
    this.playArpeggioChord(chord);
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;

    this.timer = setTimeout(() => {
      this.scheduleNext();
    }, 4000);
  }

  public async start() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn('AudioContext resume was prevented:', e);
        return;
      }
    }

    if (this.isPlaying) return;
    this.isPlaying = true;
    this.onPlayStateChange?.(true);
    this.scheduleNext();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.onPlayStateChange?.(false);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.1);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const romanticAudio = typeof window !== 'undefined' ? new RomanticMusicPlayer() : null;
