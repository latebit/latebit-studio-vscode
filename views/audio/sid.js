//@ts-check

/**
 * @typedef {import('./sid')} Module
 */

const sid = window.Module;
const {
  Player,
  TuneParser,
  Tune,
  Note,
  getTrackSize,
  getNote,
  removeNote,
  setNote,
  createEmptyTune,
  setBeatsCount,
  setTracksCount,
  setBpm,
  setTicksPerBeat,
  MUSIC_PARSER_OPTIONS,
  SOUND_PARSER_OPTIONS
} = sid;

export {
  Player,
  TuneParser,
  Tune,
  Note,
  getTrackSize,
  getNote,
  removeNote,
  setNote,
  createEmptyTune,
  setBeatsCount,
  setTracksCount,
  setBpm,
  setTicksPerBeat,
  MUSIC_PARSER_OPTIONS,
  SOUND_PARSER_OPTIONS,
}