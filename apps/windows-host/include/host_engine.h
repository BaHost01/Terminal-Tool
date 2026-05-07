#pragma once

#ifdef HOSTENGINE_EXPORTS
#define HOSTENGINE_API __declspec(dllexport)
#else
#define HOSTENGINE_API __declspec(dllimport)
#endif

#include <cstdint>

extern "C" {
    // Callback types
    typedef void (*StatusCallback)(const char* status);
    typedef void (*LogCallback)(const char* message);
    typedef void (*ClientCountCallback)(int32_t count);

    // Core Engine Control
    HOSTENGINE_API bool StartHost(
        const char* relayUrl,
        const char* adminPassword,
        const char* machineName,
        bool enableScreenSharing,
        bool isAdminShell
    );

    HOSTENGINE_API void StopHost();

    // Configuration
    HOSTENGINE_API void UpdateSettings(
        const char* relayUrl,
        const char* adminPassword,
        const char* machineName,
        bool enableScreenSharing
    );

    // Callbacks Registration
    HOSTENGINE_API void RegisterStatusCallback(StatusCallback callback);
    HOSTENGINE_API void RegisterLogCallback(LogCallback callback);
    HOSTENGINE_API void RegisterClientCountCallback(ClientCountCallback callback);

    // Health
    HOSTENGINE_API bool IsRunning();
}
