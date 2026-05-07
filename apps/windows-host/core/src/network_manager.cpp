#include "network_manager.h"
#include "host_engine.h"
#include <iostream>

extern void Log(const char* message);
extern void SetStatus(const char* status);

NetworkManager::NetworkManager() : _connected(false) {
    _webSocket.setOnMessageCallback([this](const ix::WebSocketMessagePtr& msg) {
        this->OnMessage(msg);
    });
}

NetworkManager::~NetworkManager() {
    Disconnect();
}

bool NetworkManager::Connect(const std::string& url, const std::string& password, const std::string& machineName) {
    _webSocket.setUrl(url);
    _webSocket.start();
    
    // The actual registration happens in OnMessage when the connection is open
    // We'll store the credentials for the registration step
    _webSocket.setExtraHeaders({{"x-machine-name", machineName}}); // Example header
    
    return true;
}

void NetworkManager::Disconnect() {
    _webSocket.stop();
    _connected = false;
}

bool NetworkManager::IsConnected() const {
    return _connected;
}

void NetworkManager::SendMessage(const terminal::HostMessage& message) {
    if (!_connected) return;

    std::string serialized;
    if (message.SerializeToString(&serialized)) {
        _webSocket.sendBinary(serialized);
    }
}

void NetworkManager::SetPtyInputCallback(std::function<void(const std::string&)> callback) {
    _onPtyInput = callback;
}

void NetworkManager::OnMessage(const ix::WebSocketMessagePtr& msg) {
    if (msg->type == ix::WebSocketMessageType::Message) {
        terminal::ServerMessage serverMsg;
        if (serverMsg.ParseFromString(msg->str)) {
            if (serverMsg.has_pty_input()) {
                if (_onPtyInput) {
                    _onPtyInput(serverMsg.pty_input().data());
                }
            } else if (serverMsg.has_auth_response()) {
                Log(serverMsg.auth_response().success() ? "Authentication Successful" : "Authentication Failed");
            }
        }
    } else if (msg->type == ix::WebSocketMessageType::Open) {
        _connected = true;
        SetStatus("Connected");
        Log("WebSocket Connection Opened");
        // Registration logic will go here
    } else if (msg->type == ix::WebSocketMessageType::Close) {
        _connected = false;
        SetStatus("Disconnected");
        Log("WebSocket Connection Closed");
    } else if (msg->type == ix::WebSocketMessageType::Error) {
        Log(("WebSocket Error: " + msg->errorInfo.reason).c_str());
    }
}
