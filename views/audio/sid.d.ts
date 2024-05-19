declare global {
  interface Window {
    Module: typeof Module;
  }
}

declare namespace Module {
  class Tune {
    constructor(numberOfTracks: number);
    getBpm(): number;
    setBpm(bpm: number): void;
    getTicksPerBeat(): number;
    setTicksPerBeat(ticksPerBeat: number): void;
    getBeatsCount(): number;
    setBeatsCount(beats: number): void;
    getTracksCount(): number;
  }

  class Player {
    static parse(symbol: string): Note;
    static isPlaying(): boolean;
    static isLooping(): boolean;
    static setLoop(value: boolean): void;
    static pause(): void;
    static stop(): void;
    static play(tune: Tune): void;
    static playNote(note: Note): void;
  }

  class TuneParser {
    static fromString(s: string): Tune;
    static toString(t: Tune): string;
  }

  function getNote(tune: Tune, trackIndex: number, noteIndex: number): Note;
  function setNote(tune: Tune, trackIndex: number, noteIndex: number, note: Note): void;
  function removeNote(tune: Tune, trackIndex: number, noteIndex: number): void;
  function getTrackSize(tune: Tune, trackIndex: number): number;

  class Note {
    static makeRest(): Note;
    static fromSymbol(symbol: string): Note;
    isRest(): boolean;
    isEqual(): boolean;
    isInvalid(): boolean;
    isContinue(): boolean;
    getPitch(): number;
    getVolume(): number;
    getWave(): WaveType;
    getEffect(): EffectType;
    getId(): number;
    getSymbol(): string;
  }

  enum WaveType {
    TRIANGLE,
    SQUARE,
    SAWTOOTH,
    NOISE
  }

  enum EffectType {
    NONE,
    SLIDE,
    DROP,
    FADEIN,
    FADEOUT
  }
}

export = Module;
export as namespace sid;