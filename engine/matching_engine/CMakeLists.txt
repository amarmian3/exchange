# CMakeList.txt : CMake project for matching_engine, include source and define
# project specific logic here.
#
cmake_minimum_required (VERSION 3.8)

# Enable Hot Reload for MSVC compilers if supported.
if (POLICY CMP0141)
  cmake_policy(SET CMP0141 NEW)
  set(CMAKE_MSVC_DEBUG_INFORMATION_FORMAT "$<IF:$<AND:$<C_COMPILER_ID:MSVC>,$<CXX_COMPILER_ID:MSVC>>,$<$<CONFIG:Debug,RelWithDebInfo>:EditAndContinue>,$<$<CONFIG:Debug,RelWithDebInfo>:ProgramDatabase>>")
endif()

project ("matching_engine")

# Add source to this project's executable.
add_library(matching_engine SHARED
  src/engine.cpp
  src/book.cpp
  src/order.cpp
  src/c_api.cpp
)
target_include_directories(matching_engine PUBLIC
  ${CMAKE_CURRENT_SOURCE_DIR}/include
)

# ---- Output locations (consistent across platforms) ----
# Multi-config (Visual Studio, Xcode, Ninja Multi-Config): build/<Config>/
# Single-config (Ninja, Unix Makefiles): the build directory itself (e.g. build/Release)

if (CMAKE_CONFIGURATION_TYPES)
  set(_out_dir "${CMAKE_BINARY_DIR}/$<CONFIG>")
else()
  set(_out_dir "${CMAKE_BINARY_DIR}")
endif()

set_target_properties(matching_engine PROPERTIES
  OUTPUT_NAME "matching_engine"
  RUNTIME_OUTPUT_DIRECTORY "${_out_dir}"
  LIBRARY_OUTPUT_DIRECTORY "${_out_dir}"
  ARCHIVE_OUTPUT_DIRECTORY "${_out_dir}"
)

target_compile_definitions(matching_engine PRIVATE ME_BUILD_DLL)

set_property(TARGET matching_engine PROPERTY CXX_STANDARD 20)
set_property(TARGET matching_engine PROPERTY CXX_STANDARD_REQUIRED ON)
set_property(TARGET matching_engine PROPERTY CXX_EXTENSIONS OFF)