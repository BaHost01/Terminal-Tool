#include "pty_manager.h"
#include <iostream>
#include <vector>

PtyManager::PtyManager() : 
    _hPC(INVALID_HANDLE_VALUE), 
    _hProcess(INVALID_HANDLE_VALUE), 
    _hThread(INVALID_HANDLE_VALUE),
    _inPipeWrite(INVALID_HANDLE_VALUE), 
    _outPipeRead(INVALID_HANDLE_VALUE),
    _isRunning(false) 
{}

PtyManager::~PtyManager() {
    Stop();
}

bool PtyManager::Start(const std::string& commandLine, int cols, int rows, std::function<void(const char*, size_t)> onOutput) {
    if (_isRunning) return false;

    _onOutput = onOutput;
    if (!CreatePseudoConsoleAndProcess(commandLine, cols, rows)) {
        return false;
    }

    _isRunning = true;
    _readThread = std::thread(&PtyManager::ReadLoop, this);
    return true;
}

void PtyManager::Stop() {
    _isRunning = false;
    
    if (_hProcess != INVALID_HANDLE_VALUE) {
        TerminateProcess(_hProcess, 0);
        CloseHandle(_hProcess);
        _hProcess = INVALID_HANDLE_VALUE;
    }

    if (_hThread != INVALID_HANDLE_VALUE) {
        CloseHandle(_hThread);
        _hThread = INVALID_HANDLE_VALUE;
    }

    if (_hPC != INVALID_HANDLE_VALUE) {
        ClosePseudoConsole(_hPC);
        _hPC = INVALID_HANDLE_VALUE;
    }

    if (_inPipeWrite != INVALID_HANDLE_VALUE) {
        CloseHandle(_inPipeWrite);
        _inPipeWrite = INVALID_HANDLE_VALUE;
    }

    if (_outPipeRead != INVALID_HANDLE_VALUE) {
        CloseHandle(_outPipeRead);
        _outPipeRead = INVALID_HANDLE_VALUE;
    }

    if (_readThread.joinable()) {
        _readThread.join();
    }
}

void PtyManager::Write(const std::string& data) {
    if (_inPipeWrite == INVALID_HANDLE_VALUE) return;
    DWORD written;
    WriteFile(_inPipeWrite, data.c_str(), (DWORD)data.length(), &written, NULL);
}

void PtyManager::Resize(int cols, int rows) {
    if (_hPC != INVALID_HANDLE_VALUE) {
        COORD size = { (SHORT)cols, (SHORT)rows };
        ResizePseudoConsole(_hPC, size);
    }
}

bool PtyManager::CreatePtyPipes(PHANDLE outPipeRead, PHANDLE outPipeWrite, PHANDLE inPipeRead, PHANDLE inPipeWrite) {
    if (!CreatePipe(inPipeRead, inPipeWrite, NULL, 0)) return false;
    if (!CreatePipe(outPipeRead, outPipeWrite, NULL, 0)) {
        CloseHandle(*inPipeRead);
        CloseHandle(*inPipeWrite);
        return false;
    }
    return true;
}

bool PtyManager::CreatePseudoConsoleAndProcess(const std::string& commandLine, int cols, int rows) {
    HANDLE inPipeRead, outPipeWrite;
    if (!CreatePtyPipes(&_outPipeRead, &outPipeWrite, &inPipeRead, &_inPipeWrite)) return false;

    COORD size = { (SHORT)cols, (SHORT)rows };
    HRESULT hr = CreatePseudoConsole(size, inPipeRead, outPipeWrite, 0, &_hPC);
    
    // We can close these now as the PseudoConsole has its own copies
    CloseHandle(inPipeRead);
    CloseHandle(outPipeWrite);

    if (FAILED(hr)) return false;

    // Prepare startup info for the process
    STARTUPINFOEXA siEx = { 0 };
    siEx.StartupInfo.cb = sizeof(STARTUPINFOEXA);

    SIZE_T attrListSize = 0;
    InitializeProcThreadAttributeList(NULL, 1, 0, &attrListSize);
    siEx.lpAttributeList = (LPPROC_THREAD_ATTRIBUTE_LIST)HeapAlloc(GetProcessHeap(), 0, attrListSize);
    
    if (!InitializeProcThreadAttributeList(siEx.lpAttributeList, 1, 0, &attrListSize)) return false;
    if (!UpdateProcThreadAttribute(siEx.lpAttributeList, 0, PROC_THREAD_ATTRIBUTE_PSEUDOCONSOLE, _hPC, sizeof(HPCON), NULL, NULL)) return false;

    PROCESS_INFORMATION pi = { 0 };
    std::vector<char> cmd(commandLine.begin(), commandLine.end());
    cmd.push_back('\0');

    if (!CreateProcessA(NULL, cmd.data(), NULL, NULL, FALSE, EXTENDED_STARTUPINFO_PRESENT, NULL, NULL, &siEx.StartupInfo, &pi)) {
        return false;
    }

    _hProcess = pi.hProcess;
    _hThread = pi.hThread;

    return true;
}

void PtyManager::ReadLoop() {
    char buffer[4096];
    DWORD bytesRead;

    while (_isRunning) {
        if (ReadFile(_outPipeRead, buffer, sizeof(buffer), &bytesRead, NULL) && bytesRead > 0) {
            if (_onOutput) {
                _onOutput(buffer, bytesRead);
            }
        } else {
            break;
        }
    }
}
