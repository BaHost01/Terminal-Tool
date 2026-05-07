cmake_minimum_required(VERSION 3.15)
project(HostEngine LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# DLL definition
add_definitions(-DHOSTENGINE_EXPORTS)

# Include directories
include_directories(${PROJECT_SOURCE_DIR}/../include)
include_directories(${PROJECT_SOURCE_DIR}/src)
include_directories(${PROJECT_SOURCE_DIR}/proto)

# Find Protobuf
find_package(Protobuf REQUIRED)
include_directories(${Protobuf_INCLUDE_DIRS})

# Find IXWebSocket
find_package(ixwebsocket CONFIG REQUIRED)

# Source files
set(SOURCE_FILES
    src/host_engine.cpp
    src/pty_manager.cpp
    src/screen_capture.cpp
    src/network_manager.cpp
)

# Protobuf generated files (automatically generated during build)
file(GLOB PROTO_SRCS "${CMAKE_CURRENT_BINARY_DIR}/proto/*.pb.cc")
file(GLOB PROTO_HDRS "${CMAKE_CURRENT_BINARY_DIR}/proto/*.pb.h")

# Generate Protobuf code
set(PROTO_SCHEMA "../../packages/protocol/schemas/terminal.proto")
execute_process(
    COMMAND protoc --proto_path=../../packages/protocol/schemas --cpp_out=${CMAKE_CURRENT_BINARY_DIR}/proto ${PROTO_SCHEMA}
)
include_directories(${CMAKE_CURRENT_BINARY_DIR}/proto)

add_library(HostEngine SHARED ${SOURCE_FILES} ${PROTO_SRCS})
target_link_libraries(HostEngine PRIVATE ${Protobuf_LIBRARIES} ixwebsocket::ixwebsocket)

# Installation
install(TARGETS HostEngine DESTINATION bin)
