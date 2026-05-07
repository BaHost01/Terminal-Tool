#pragma once

#include <string>
#include <ixwebsocket/IXWebSocket.h>
#include "terminal.pb.h"

class NetworkManager {
public:
    NetworkManager();
    ~NetworkManager();

    bool Connect(const std::string& url, const std::string& password, const std::string& machineName);
    void Disconnect();
    bool IsConnected() const;

    void SendMessage(const terminal::HostMessage& message);
    void SetPtyInputCallback(std::function<void(const std::string&)> callback);

private:
    void OnMessage(const ix::WebSocketMessagePtr& msg);
    void RegisterHost(const std::string& password, const std::string& machineName);

    ix::WebSocket _webSocket;
    bool _connected;
    std::function<void(const std::string&)> _onPtyInput;
};
