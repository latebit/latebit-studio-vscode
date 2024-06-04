declare global {
  interface Window {
    Module: typeof Module;
  }
}

declare namespace Module {
  class ParserOptions {
    maxTracksCount: number;
    maxBeatsCount: number;
    maxTicksPerBeat: number;
  }

  class Tune {
    getBpm(): number;
    getTicksPerBeat(): number;
    getBeatsCount(): number;
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
    static fromString(s: string, options: ParserOptions): Tune;
    static toString(t: Tune): string;
  }

  function getNote(tune: Tune, trackIndex: number, noteIndex: number): Note;
  function getTrackSize(tune: Tune, trackIndex: number): number;
  function setNote(tune: Tune, trackIndex: number, noteIndex: number, note: Note): readonly Tune;
  function removeNote(tune: Tune, trackIndex: number, noteIndex: number): readonly Tune;
  function setBpm(tune: Tune, bpm: number): readonly Tune;
  function setTicksPerBeat(tune: Tune, ticks: number): readonly Tune;
  function setBeatsCount(tune: Tune, beats: number): readonly Tune;
  function createEmptyTune(bpm: number, ticksPerBeat: number, beatsCount: number): readonly Tune;

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

  type Track = Note[];
}

export = Module;
export as namespace sid;