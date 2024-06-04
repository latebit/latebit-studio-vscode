//@ts-check

/**
 * @typedef {import('./sid')} Module
 */

const sid = window.Module;
const { Player, TuneParser, Tune, Note, setNote, getTrackSize, getNote, removeNote, createEmptyTune, setBeatsCount, setBpm, setTicksPerBeat, ParserOptions } = sid;

export { Player, TuneParser, Tune, Note, getTrackSize, getNote, removeNote, setNote, createEmptyTune, setBeatsCount, setBpm, setTicksPerBeat, ParserOptions }