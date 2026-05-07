#include "screen_capture.h"
#include <iostream>
#include <wrl/client.h>

using Microsoft::WRL::ComPtr;

ScreenCapture::ScreenCapture() : 
    _device(nullptr), 
    _context(nullptr), 
    _deskDupl(nullptr), 
    _isRunning(false) 
{}

ScreenCapture::~ScreenCapture() {
    Stop();
}

bool ScreenCapture::Start(std::function<void(const std::vector<uint8_t>&)> onFrame) {
    if (_isRunning) return false;
    _onFrame = onFrame;

    if (!InitDXGI()) return false;

    _isRunning = true;
    _captureThread = std::thread(&ScreenCapture::CaptureLoop, this);
    return true;
}

void ScreenCapture::Stop() {
    _isRunning = false;
    if (_captureThread.joinable()) {
        _captureThread.join();
    }
    CleanupDXGI();
}

bool ScreenCapture::InitDXGI() {
    D3D_FEATURE_LEVEL featureLevel;
    HRESULT hr = D3D11CreateDevice(nullptr, D3D_DRIVER_TYPE_HARDWARE, nullptr, 0, nullptr, 0, D3D11_SDK_VERSION, &_device, &featureLevel, &_context);
    if (FAILED(hr)) return false;

    ComPtr<IDXGIDevice> dxgiDevice;
    hr = _device->QueryInterface(IID_PPV_ARGS(&dxgiDevice));
    if (FAILED(hr)) return false;

    ComPtr<IDXGIAdapter> dxgiAdapter;
    hr = dxgiDevice->GetParent(IID_PPV_ARGS(&dxgiAdapter));
    if (FAILED(hr)) return false;

    ComPtr<IDXGIOutput> dxgiOutput;
    hr = dxgiAdapter->EnumOutputs(0, &dxgiOutput);
    if (FAILED(hr)) return false;

    ComPtr<IDXGIOutput1> dxgiOutput1;
    hr = dxgiOutput->QueryInterface(IID_PPV_ARGS(&dxgiOutput1));
    if (FAILED(hr)) return false;

    hr = dxgiOutput1->DuplicateOutput(_device, &_deskDupl);
    if (FAILED(hr)) return false;

    return true;
}

void ScreenCapture::CleanupDXGI() {
    if (_deskDupl) { _deskDupl->Release(); _deskDupl = nullptr; }
    if (_context) { _context->Release(); _context = nullptr; }
    if (_device) { _device->Release(); _device = nullptr; }
}

void ScreenCapture::CaptureLoop() {
    while (_isRunning) {
        IDXGIResource* desktopResource = nullptr;
        DXGI_OUTDUPL_FRAME_INFO frameInfo;
        
        HRESULT hr = _deskDupl->AcquireNextFrame(100, &frameInfo, &desktopResource);
        if (hr == DXGI_ERROR_WAIT_TIMEOUT) continue;
        if (FAILED(hr)) break;

        // [WIP] Here we would:
        // 1. Map the texture
        // 2. Encode to JPEG using Windows Imaging Component (WIC) or TurboJPEG
        // 3. Call _onFrame(jpegData)
        
        _deskDupl->ReleaseFrame();
        if (desktopResource) desktopResource->Release();
        
        // Limit to ~30 FPS
        std::this_thread::sleep_for(std::chrono::milliseconds(33));
    }
}
