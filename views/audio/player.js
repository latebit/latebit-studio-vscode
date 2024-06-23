//@ts-check

/**
 * @typedef {import('../../lib/player/build/player').Player} Player
 * @typedef {import('../../lib/player/build/player').TuneParser} TuneParser
 * @typedef {import('../../lib/player/build/player').Tune} Tune
 * @typedef {import('../../lib/player/build/player').Note} Note
 * @typedef {import('../../lib/player/build/player').NoteType} NoteType
 * @typedef {import('../../lib/player/build/player').MainModule} Module
 */

// @ts-expect-error embind does not attach module to window
const player = /** @type {Module} */ (window.Module);

export const Player = /** @type {Player & Module['Player']} */ (player.Player);
export const TuneParser = /** @type {TuneParser & Module['TuneParser']} */ (player.TuneParser);
export const Tune = /** @type {Tune & Module['Tune']} */ (player.Tune);
export const Note = /** @type {Note & Module['Note']} */ (player.Note);
export const NoteType = /** @type {NoteType & Module['NoteType']} */ (player.NoteType);

export const getTrackSize = /** @type {Module['getTrackSize']} */ (player.getTrackSize);
export const getNote = /** @type {Module['getNote']} */ (player.getNote);
export const removeNote = /** @type {Module['removeNote']} */ (player.removeNote);
export const setNote = /** @type {Module['setNote']} */ (player.setNote);
export const createEmptyTune = /** @type {Module['createEmptyTune']} */ (player.createEmptyTune);
export const setBeatsCount = /** @type {Module['setBeatsCount']} */ (player.setBeatsCount);
export const setTracksCount = /** @type {Module['setTracksCount']} */ (player.setTracksCount);
export const setBpm = /** @type {Module['setBpm']} */ (player.setBpm);
export const setTicksPerBeat = /** @type {Module['setTicksPerBeat']} */ (player.setTicksPerBeat);

export const MUSIC_PARSER_OPTIONS = /** @type {Module['MUSIC_PARSER_OPTIONS']} */ player.MUSIC_PARSER_OPTIONS;
export const SOUND_PARSER_OPTIONS = /** @type {Module['SOUND_PARSER_OPTIONS']} */ player.SOUND_PARSER_OPTIONS;