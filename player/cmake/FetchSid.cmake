function(fetch_sid version)
  message(STATUS "Fetching latebit/sid@${version}")
  include(FetchContent)
  FetchContent_Declare(
    sid
    URL https://github.com/latebit/latebit-engine/releases/download/${version}/latebit-${version}-wasm.tar.gz
  )
  FetchContent_GetProperties(sid)

  if(NOT sid_POPULATED)
    FetchContent_Populate(sid)
    add_library(sid UNKNOWN IMPORTED)
    file(GLOB LIB_FILES "${sid_SOURCE_DIR}/lib/libsid.a")
    set_target_properties(sid PROPERTIES
      IMPORTED_LOCATION ${LIB_FILES}
      INTERFACE_INCLUDE_DIRECTORIES ${sid_SOURCE_DIR}/include
    )
  endif()
  message(STATUS "Fetching latebit/sid@${version} - done")
endfunction()