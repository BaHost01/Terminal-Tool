#pragma once

#include <windows.h>
#include <d3d11.h>
#include <dxgi1_2.h>
#include <vector>
#include <functional>
#include <thread>
#include <atomic>

class ScreenCapture {
public:
    ScreenCapture();
    ~ScreenCapture();

    bool Start(std::function<void(const std::vector<uint8_t>&)> onFrame);
    void Stop();

private:
    void CaptureLoop();
    bool InitDXGI();
    void CleanupDXGI();

    ID3D11Device* _device;
    ID3D11DeviceContext* _context;
    IDXGIOutputDuplication* _deskDupl;
    
    std::function<void(const std::vector<uint8_t>&)> _onFrame;
    std::thread _captureThread;
    std::atomic<bool> _isRunning;
};
