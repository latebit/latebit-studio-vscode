#pragma once

#include "latebit/sid/synth/tune.h"

using namespace sid;

namespace player {
// Emscripten does not directly support binding std::shared_ptr<std::vector<T>>
// Se we are wrapping all the related methods in the Tune class
auto getNote(const Tune &tune, int trackIndex, int noteIndex) -> Note;
auto setNote(Tune &tune, int trackIndex, int noteIndex,
             const Note &note) -> void;
auto removeNote(Tune &tune, int trackIndex, int noteIndex) -> void;
auto getTrackSize(const Tune &tune, int trackIndex) -> int;

} // namespace player