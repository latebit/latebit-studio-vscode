cmake_minimum_required(VERSION 3.28.1)
project(player)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_C_EXTENSIONS OFF)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include_directories(${CMAKE_SOURCE_DIR}/include)
link_directories(${CMAKE_SOURCE_DIR}/lib)

file(GLOB SRC_FILES "${CMAKE_SOURCE_DIR}/main.cpp" "${CMAKE_SOURCE_DIR}/src/*.cpp")

add_executable(${PROJECT_NAME} ${SRC_FILES})
target_link_libraries(${PROJECT_NAME} SDL2 sid embind)
set_target_properties(${PROJECT_NAME} PROPERTIES COMPILE_FLAGS "-O3 -sUSE_SDL=2")