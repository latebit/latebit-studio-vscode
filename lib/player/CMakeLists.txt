cmake_minimum_required(VERSION 3.28.1)
project(player)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_C_EXTENSIONS OFF)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include(../../cmake/FetchEngine.cmake)
fetch_latebit("v0.6.0")

file(GLOB SRC_FILES "${CMAKE_SOURCE_DIR}/main.cpp" "${CMAKE_SOURCE_DIR}/src/*.cpp")
file(GLOB HDR_FILES "${CMAKE_SOURCE_DIR}/src/*.h")

add_executable(${PROJECT_NAME} ${SRC_FILES} ${HDR_FILES})
target_link_libraries(${PROJECT_NAME} PRIVATE SDL2 sid embind)
set_target_properties(${PROJECT_NAME} PROPERTIES LINK_FLAGS "-O3 --emit-tsd ${PROJECT_NAME}.d.ts -sUSE_SDL=2")