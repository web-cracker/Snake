import { Track } from '../types';

/**
 * A simple procedural music generator using Web Audio API.
 * simulating "AI Generated" music by sequencing simple oscillators.
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTrack: Track | null = null;
  private nextNoteTime: number = 0;
  private noteIndex: number = 0;
  private schedulerTimer: number | null = null;
  private gainNode: GainNode | null = null;

  // Pentatonic scales for "AI" generation feel
  private scales = [
    [0, 2, 4, 7, 9], // Major Pentatonic
    [0, 3, 5, 7, 10], // Minor Pentatonic
    [0, 4, 5, 7, 11], // Lydian dominant-ish
  ];

  public initialize() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.ctx.createGain();
      this.gainNode.connect(this.ctx.destination);
      this.gainNode.gain.value = 0.3; // Master volume
    }
  }

  public setVolume(val: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = val;
    }
  }

  public playTrack(track: Track) {
    this.initialize();
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.currentTrack = track;
    this.isPlaying = true;
    this.noteIndex = 0;
    this.nextNoteTime = this.ctx!.currentTime;
    
    this.scheduleLoop();
  }

  public stop() {
    this.isPlaying = false;
    if (this.schedulerTimer) {
      window.clearTimeout(this.schedulerTimer);
      this.schedulerTimer = null;
    }
  }

  private scheduleLoop = () => {
    if (!this.isPlaying || !this.ctx || !this.currentTrack) return;

    // Lookahead: schedule notes for the next 0.1s
    while (this.nextNoteTime < this.ctx.currentTime + 0.1) {
      this.playNote(this.nextNoteTime);
      const secondsPerBeat = 60.0 / this.currentTrack.bpm;
      // Sixteenth notes
      this.nextNoteTime += 0.25 * secondsPerBeat;
      this.noteIndex++;
    }

    this.schedulerTimer = window.setTimeout(this.scheduleLoop, 25);
  };

  private playNote(time: number) {
    if (!this.ctx || !this.gainNode || !this.currentTrack) return;

    // Create Oscillators
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();

    osc.type = this.currentTrack.waveType;
    
    // Procedural Melody Logic
    // Pick a note from a scale based on simple math to feel "generated" but consistent
    const scaleIndex = this.currentTrack.id % this.scales.length;
    const scale = this.scales[scaleIndex];
    
    // Pseudo-random but deterministic pattern based on index
    const noteOffset = scale[(this.noteIndex * 7 + this.currentTrack.id) % scale.length];
    const octave = Math.floor((this.noteIndex % 16) / 8) + 1; // Change octave every 8 notes
    
    // Calculate frequency
    // f = base * 2^(n/12)
    const freq = this.currentTrack.baseFreq * Math.pow(2, (noteOffset + (octave * 12)) / 12);
    
    osc.frequency.value = freq;

    // Envelope
    env.gain.setValueAtTime(0, time);
    env.gain.linearRampToValueAtTime(0.1, time + 0.05); // Attack
    env.gain.exponentialRampToValueAtTime(0.001, time + 0.5); // Decay

    osc.connect(env);
    env.connect(this.gainNode);

    osc.start(time);
    osc.stop(time + 0.5);
    
    // Add a simple bass note every 4 beats
    if (this.noteIndex % 16 === 0) {
        this.playBass(time);
    }
  }
  
  private playBass(time: number) {
      if (!this.ctx || !this.gainNode || !this.currentTrack) return;
      const bassOsc = this.ctx.createOscillator();
      const bassEnv = this.ctx.createGain();
      
      bassOsc.type = 'square';
      bassOsc.frequency.value = this.currentTrack.baseFreq / 2;
      
      bassEnv.gain.setValueAtTime(0.2, time);
      bassEnv.gain.exponentialRampToValueAtTime(0.001, time + 1);
      
      bassOsc.connect(bassEnv);
      bassEnv.connect(this.gainNode);
      bassOsc.start(time);
      bassOsc.stop(time + 1);
  }
}

export const audioEngine = new AudioEngine();

export const TRACK_LIST: Track[] = [
  { id: 0, title: "SYS_CORE_01", artist: "UNKNOWN_SOURCE", bpm: 110, waveType: 'square', baseFreq: 220 },
  { id: 1, title: "DATA_ROT", artist: "NULL_PTR", bpm: 140, waveType: 'sawtooth', baseFreq: 110 },
  { id: 2, title: "VOID_SIGNAL", artist: "DAEMON", bpm: 95, waveType: 'triangle', baseFreq: 146.83 },
];
