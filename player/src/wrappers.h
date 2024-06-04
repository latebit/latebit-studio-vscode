#pragma once

#include "latebit/sid/synth/Tune.h"

using namespace sid;

namespace player {
// Emscripten does not support manipulating vectors
// All the following methods are wrappers around the Tune class
// to allow working with tracks, i.e. vector of Notes
auto getNote(Tune &tune, int trackIndex, int noteIndex) -> Note;
auto setNote(Tune &tune, int trackIndex, int noteIndex,
             const Note &note) -> unique_ptr<Tune>;
auto removeNote(Tune &tune, int trackIndex, int noteIndex) -> unique_ptr<Tune>;

auto setBpm(Tune &tune, int bpm) -> unique_ptr<Tune>;
auto setTicksPerBeat(Tune &tune, int ticksPerBeat) -> unique_ptr<Tune>;
auto setBeatsCount(Tune &tune, int beatsCount) -> unique_ptr<Tune>;
auto getTrackSize(Tune &tune, int trackIndex) -> int;

Tune* createEmptyTune(int bpm, int ticksPerBeat, int beatsCount);
} // namespace player