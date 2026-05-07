#include "host_engine.h"
#include "network_manager.h"
#include "pty_manager.h"
#include <string>
#include <atomic>
#include <thread>
#include <chrono>
#include <iostream>
#include <windows.h>
#include <winhttp.h>

#pragma comment(lib, "winhttp.lib")

// Global state
std::atomic<bool> g_isRunning{false};
StatusCallback g_statusCallback = nullptr;
LogCallback g_logCallback = nullptr;
ClientCountCallback g_clientCountCallback = nullptr;

std::string g_relayUrl;
std::string g_adminPassword;
std::string g_machineName;
bool g_screenSharingEnabled = false;
bool g_isAdminShell = false;

NetworkManager* g_networkManager = nullptr;
PtyManager* g_ptyManager = nullptr;

// Forward declarations of internal managers
namespace Internal {
    void NetworkThread();
    void HealthCheckThread();
}

void Log(const char* message) {
    if (g_logCallback) {
        g_logCallback(message);
    }
}

void SetStatus(const char* status) {
    if (g_statusCallback) {
        g_statusCallback(status);
    }
}

HOSTENGINE_API bool StartHost(
    const char* relayUrl,
    const char* adminPassword,
    const char* machineName,
    bool enableScreenSharing,
    bool isAdminShell
) {
    if (g_isRunning) return false;

    g_relayUrl = relayUrl;
    g_adminPassword = adminPassword;
    g_machineName = machineName;
    g_screenSharingEnabled = enableScreenSharing;
    g_isAdminShell = isAdminShell;

    g_isRunning = true;
    g_networkManager = new NetworkManager();
    g_ptyManager = new PtyManager();

    // Setup PTY -> Network bridge
    std::string shell = g_isAdminShell ? "powershell.exe" : "cmd.exe";
    g_ptyManager->Start(shell, 80, 24, [](const char* data, size_t len) {
        if (g_networkManager && g_networkManager->IsConnected()) {
            terminal::HostMessage msg;
            msg.mutable_pty_output()->set_data(data, len);
            g_networkManager->SendMessage(msg);
        }
    });

    // Setup Network -> PTY bridge
    g_networkManager->SetPtyInputCallback([](const std::string& input) {
        if (g_ptyManager) {
            g_ptyManager->Write(input);
        }
    });

    // Start background threads
    std::thread(Internal::NetworkThread).detach();
    std::thread(Internal::HealthCheckThread).detach();

    Log("Host Engine Started");
    return true;
}

HOSTENGINE_API void StopHost() {
    g_isRunning = false;
    
    if (g_ptyManager) {
        g_ptyManager->Stop();
        delete g_ptyManager;
        g_ptyManager = nullptr;
    }

    if (g_networkManager) {
        g_networkManager->Disconnect();
        delete g_networkManager;
        g_networkManager = nullptr;
    }
    
    Log("Host Engine Stopped");
}

HOSTENGINE_API void UpdateSettings(
    const char* relayUrl,
    const char* adminPassword,
    const char* machineName,
    bool enableScreenSharing
) {
    g_relayUrl = relayUrl;
    g_adminPassword = adminPassword;
    g_machineName = machineName;
    g_screenSharingEnabled = enableScreenSharing;
    Log("Settings Updated");
}

HOSTENGINE_API void RegisterStatusCallback(StatusCallback callback) {
    g_statusCallback = callback;
}

HOSTENGINE_API void RegisterLogCallback(LogCallback callback) {
    g_logCallback = callback;
}

HOSTENGINE_API void RegisterClientCountCallback(ClientCountCallback callback) {
    g_clientCountCallback = callback;
}

HOSTENGINE_API bool IsRunning() {
    return g_isRunning;
}

namespace Internal {
    void NetworkThread() {
        if (!g_networkManager) return;

        std::string wsUrl = g_relayUrl;
        if (wsUrl.find("http") == 0) {
            wsUrl.replace(0, 4, "ws");
        }
        if (wsUrl.empty() || wsUrl.back() != '/') wsUrl += "/";
        wsUrl += "ws/host";

        Log(("Connecting to Relay: " + wsUrl).c_str());
        g_networkManager->Connect(wsUrl, g_adminPassword, g_machineName);
        
        while (g_isRunning) {
            std::this_thread::sleep_for(std::chrono::seconds(1));
        }
    }

    void HealthCheckThread() {
        while (g_isRunning) {
            HINTERNET hSession = WinHttpOpen(L"TerminalTool/1.0", 
                                          WINHTTP_ACCESS_TYPE_DEFAULT_PROXY, 
                                          WINHTTP_NO_PROXY_NAME, 
                                          WINHTTP_NO_PROXY_BYPASS, 0);
            if (hSession) {
                HINTERNET hConnect = WinHttpConnect(hSession, L"terminal-tool.onrender.com", 
                                                  INTERNET_DEFAULT_HTTPS_PORT, 0);
                if (hConnect) {
                    HINTERNET hRequest = WinHttpOpenRequest(hConnect, L"GET", L"/", 
                                                          NULL, WINHTTP_NO_REFERER, 
                                                          WINHTTP_DEFAULT_ACCEPT_TYPES, 
                                                          WINHTTP_FLAG_SECURE);
                    if (hRequest) {
                        if (WinHttpSendRequest(hRequest, WINHTTP_NO_ADDITIONAL_HEADERS, 0, 
                                             WINHTTP_NO_REQUEST_DATA, 0, 0, 0)) {
                            if (WinHttpReceiveResponse(hRequest, NULL)) {
                                Log("Health Check: Successfully pinged https://terminal-tool.onrender.com/");
                            } else {
                                Log("Health Check Warning: Failed to receive response.");
                            }
                        } else {
                            Log("Health Check Warning: Failed to send request.");
                        }
                        WinHttpCloseHandle(hRequest);
                    }
                    WinHttpCloseHandle(hConnect);
                }
                WinHttpCloseHandle(hSession);
            }

            for (int i = 0; i < 50 && g_isRunning; ++i) {
                std::this_thread::sleep_for(std::chrono::milliseconds(100));
            }
        }
    }
}
