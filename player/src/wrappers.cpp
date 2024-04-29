#include "wrappers.h"

#include "latebit/sid/synth/tune.h"

using namespace sid;

namespace player {
// Emscripten does not directly support binding std::shared_ptr<std::vector<T>>
// Se we are wrapping all the related methods in the Tune class
auto getNote(const Tune &tune, int trackIndex, int noteIndex) -> Note {
  return tune.getTrack(trackIndex)->at(noteIndex);
}

auto setNote(Tune &tune, int trackIndex, int noteIndex,
             const Note &note) -> void {
  if (noteIndex >= tune.getBeatsCount() * tune.getTicksPerBeat())
    return;

  if (tune.getTrack(trackIndex)->size() <= noteIndex) {
    tune.getTrack(trackIndex)->reserve(noteIndex + 1);
  }

  for (int i = tune.getTrack(trackIndex)->size(); i <= noteIndex; i++) {
    tune.getTrack(trackIndex)->push_back(Note::makeRest());
  }

  tune.getTrack(trackIndex)->at(noteIndex) = note;
}

auto removeNote(Tune &tune, int trackIndex, int noteIndex) -> void {
  tune.getTrack(trackIndex)
      ->erase(tune.getTrack(trackIndex)->begin() + noteIndex);
}

auto getTrackSize(const Tune &tune, int trackIndex) -> int {
  return tune.getTrack(trackIndex)->size();
}
} // namespace player