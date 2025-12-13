export interface Coordinate {
  x: number;
  y: number;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface Track {
  id: number;
  title: string;
  artist: string;
  bpm: number;
  waveType: OscillatorType;
  baseFreq: number;
}

export interface AudioState {
  isPlaying: boolean;
  currentTrackIndex: number;
  volume: number;
  currentTime: number; // in seconds
  duration: number; // in seconds (mocked)
}
