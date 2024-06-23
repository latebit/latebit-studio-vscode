player
===

This library serves two purposes:

* exposing an SDL powered audio player that can be used by latebit's audio capabilities in the browser
* patch exposed methods so that Emscripten can handle them in the browser

### Building

```sh
# configure
emcmake cmake -B build

# build
emmake cmake --build build
```

It will generate a `player.js` file that can be referenced in a webpage or a web.