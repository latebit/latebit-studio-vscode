import { MUSIC_PARSER_OPTIONS, SOUND_PARSER_OPTIONS } from "./sid.js"

export const ViewType = {
  Music: 'latebit-studio.music',
  Sound: 'latebit-studio.sound',
}

export const ParserOptions = {
  [ViewType.Music]: MUSIC_PARSER_OPTIONS,
  [ViewType.Sound]: SOUND_PARSER_OPTIONS,
} 