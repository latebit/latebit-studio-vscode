function(fetch_latebit version)
  message(STATUS "Fetching latebit ${version}")
  include(FetchContent)
  FetchContent_Declare(
    latebit
    URL https://github.com/latebit/latebit-engine/releases/download/${version}/latebit-${version}-wasm.tar.gz
  )
  FetchContent_GetProperties(latebit)

  if(NOT latebit_POPULATED)
    FetchContent_Populate(latebit)
    add_library(latebit UNKNOWN IMPORTED)
    set_target_properties(latebit PROPERTIES
      IMPORTED_LOCATION "${latebit_SOURCE_DIR}/lib/liblatebit.a"
      INTERFACE_INCLUDE_DIRECTORIES ${latebit_SOURCE_DIR}/include
    )
  endif()

  if(NOT sid_POPULATED)
    add_library(sid UNKNOWN IMPORTED)
    set_target_properties(sid PROPERTIES
      IMPORTED_LOCATION "${latebit_SOURCE_DIR}/lib/libsid.a"
      INTERFACE_INCLUDE_DIRECTORIES ${latebit_SOURCE_DIR}/include
    )
  endif()
  
  message(STATUS "Fetching latebit ${version} - done")
endfunction()