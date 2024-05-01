//@ts-check

/**
 * @typedef {import('./sid')} Module
 */

const sid = window.Module;
const { Player, TuneParser, Tune, Note, getNote, setNote, getTrackSize, removeNote } = sid;

export { Player, TuneParser, Tune, Note, getNote, getTrackSize, removeNote, setNote }