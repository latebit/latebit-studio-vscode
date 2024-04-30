//@ts-check

/**
 * @typedef {import('./sid')} Module
 */

const sid = window.Module;

/** @type {sid.Player} */
const Player = window.Module.Player;

/** @type {sid.TuneParser} */
const TuneParser = window.Module.TuneParser;

/** @type {sid.Tune} */
class Tune extends window.Module.Tune { };

/** @type {sid.Note} */
class Note extends window.Module.Note { };

const { getNote, setNote, getTrackSize, removeNote } = sid;

export { Player, TuneParser, Tune, Note, getNote, getTrackSize, removeNote, setNote }