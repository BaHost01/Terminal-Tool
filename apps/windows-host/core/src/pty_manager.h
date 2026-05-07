#pragma once

#include <windows.h>
#include <string>
#include <functional>
#include <thread>
#include <atomic>

class PtyManager {
public:
    PtyManager();
    ~PtyManager();

    bool Start(const std::string& commandLine, int cols, int rows, std::function<void(const char*, size_t)> onOutput);
    void Stop();
    void Write(const std::string& data);
    void Resize(int cols, int rows);

private:
    bool CreatePtyPipes(PHANDLE outPipeRead, PHANDLE outPipeWrite, PHANDLE inPipeRead, PHANDLE inPipeWrite);
    bool CreatePseudoConsoleAndProcess(const std::string& commandLine, int cols, int rows);
    void ReadLoop();

    HPCON _hPC;
    HANDLE _hProcess;
    HANDLE _hThread;
    HANDLE _inPipeWrite;
    HANDLE _outPipeRead;
    
    std::function<void(const char*, size_t)> _onOutput;
    std::thread _readThread;
    std::atomic<bool> _isRunning;
};
