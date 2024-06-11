#include <cstdio>
#include <emscripten.h>
#include <emscripten/bind.h>

#include <latebit/core/GameManager.h>

using namespace lb;
using namespace emscripten;

int main() {
  GM.startUp();

  GM.run();

  return 0;
}

// EMSCRIPTEN_BINDINGS(renderer) {
  
// }