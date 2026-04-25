package com.terminaltool.app

import android.os.Bundle
import android.graphics.BitmapFactory
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.*
import okio.ByteString
import okio.ByteString.Companion.toByteString
import java.util.*
import java.util.concurrent.TimeUnit

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TerminalToolTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFF06131D)
                ) {
                    MainScreen()
                }
            }
        }
    }
}

@Composable
fun TerminalToolTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = Color(0xFF00FFCC),
            background = Color(0xFF000000),
            surface = Color(0xFF06131D)
        ),
        content = content
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen() {
    var serverUrl by remember { mutableStateOf("https://terminal-tool.onrender.com") }
    var hostId by remember { mutableStateOf("") }
    var token by remember { mutableStateOf("") }
    var isConnected by remember { mutableStateOf(false) }
    
    val terminalLines = remember { mutableStateListOf<String>() }
    var commandInput by remember { mutableStateOf("") }
    var screenBitmap by remember { mutableStateOf<android.graphics.Bitmap?>(null) }
    var isAdminActive by remember { mutableStateOf(false) }
    var isScreenActive by remember { mutableStateOf(false) }

    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()
    val webSocketRef = remember { mutableStateOf<WebSocket?>(null) }

    fun connect() {
        val client = OkHttpClient.Builder()
            .readTimeout(0, TimeUnit.MILLISECONDS)
            .build()

        val wsUrl = serverUrl.replace("http", "ws") + "/ws/client"
        val request = Request.Builder().url(wsUrl).build()

        val listener = object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                webSocketRef.value = webSocket
                // In a real app we'd use Protobuf here
                // Simulating AuthRequest for this prototype
                terminalLines.add("[system] Connected. Authenticating...")
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                terminalLines.add(text)
                scope.launch { listState.animateScrollToItem(terminalLines.size) }
            }

            override fun onMessage(webSocket: WebSocket, bytes: ByteString) {
                // Here we would decode Protobuf ServerMessage
                // For now, let's assume if we get bytes, it might be a screen frame or PTY data
                Log.d("TerminalTool", "Received binary message of size ${bytes.size}")
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                terminalLines.add("[error] Connection failed: ${t.message}")
                isConnected = false
            }

            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                terminalLines.add("[system] Connection closing...")
                isConnected = false
            }
        }

        client.newWebSocket(request, listener)
    }

    if (!isConnected) {
        Column(
            modifier = Modifier.fillMaxSize().padding(24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                "TERMINAL TOOL",
                style = TextStyle(
                    color = Color(0xFF00FFCC),
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 4.sp
                )
            )
            Spacer(Modifier.height(48.dp))
            
            OutlinedTextField(
                value = serverUrl,
                onValueChange = { serverUrl = it },
                label = { Text("Relay Server") },
                modifier = Modifier.fillMaxWidth(),
                textStyle = TextStyle(color = Color.White)
            )
            Spacer(Modifier.height(16.dp))
            
            OutlinedTextField(
                value = hostId,
                onValueChange = { hostId = it },
                label = { Text("Host ID") },
                modifier = Modifier.fillMaxWidth(),
                textStyle = TextStyle(color = Color.White)
            )
            Spacer(Modifier.height(16.dp))

            OutlinedTextField(
                value = token,
                onValueChange = { token = it },
                label = { Text("Machine Token") },
                modifier = Modifier.fillMaxWidth(),
                textStyle = TextStyle(color = Color.White),
                visualTransformation = PasswordVisualTransformation()
            )
            Spacer(Modifier.height(32.dp))

            Button(
                onClick = { 
                    isConnected = true 
                    terminalLines.clear()
                    connect()
                },
                modifier = Modifier.fillMaxWidth().height(56.dp),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text("ESTABLISH UPLINK", fontWeight = FontWeight.Bold)
            }
        }
    } else {
        Column(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier.fillMaxWidth().background(Color(0xFF111111)).padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(hostId.ifEmpty { "Remote Host" }, color = Color(0xFF00FFCC), fontWeight = FontWeight.Bold)
                    Text("SECURE SESSION", color = Color.Gray, fontSize = 10.sp)
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (isAdminActive) {
                        Surface(color = Color.Red, shape = RoundedCornerShape(4.dp)) {
                            Text("ADMIN", color = Color.White, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 4.dp))
                        }
                        Spacer(Modifier.width(8.dp))
                    }
                    if (isScreenActive) {
                        Surface(color = Color(0xFF00FFCC), shape = RoundedCornerShape(4.dp)) {
                            Text("LIVE", color = Color.Black, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 4.dp))
                        }
                    }
                }
                IconButton(onClick = { 
                    webSocketRef.value?.close(1000, "User disconnect")
                    isConnected = false 
                }) {
                    Text("X", color = Color.Red, fontWeight = FontWeight.Bold)
                }
            }

            if (isScreenActive && screenBitmap != null) {
                Box(modifier = Modifier.fillMaxWidth().height(200.dp).background(Color.Black)) {
                    Image(
                        bitmap = screenBitmap!!.asImageBitmap(),
                        contentDescription = "PC Screen",
                        modifier = Modifier.fillMaxSize()
                    )
                }
            }

            Box(modifier = Modifier.weight(1f).fillMaxWidth().padding(8.dp)) {
                LazyColumn(state = listState, modifier = Modifier.fillMaxSize()) {
                    items(terminalLines) { line ->
                        Text(
                            line,
                            color = if (line.startsWith(">")) Color(0xFF00FFCC) else Color.White,
                            fontFamily = FontFamily.Monospace,
                            fontSize = 13.sp
                        )
                    }
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth().background(Color(0xFF0A0A0A)).padding(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("$ ", color = Color(0xFF00FFCC), fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                BasicTextField(
                    value = commandInput,
                    onValueChange = { commandInput = it },
                    modifier = Modifier.weight(1f).padding(horizontal = 8.dp),
                    textStyle = TextStyle(color = Color.White, fontFamily = FontFamily.Monospace, fontSize = 16.sp),
                    cursorBrush = androidx.compose.ui.graphics.SolidColor(Color(0xFF00FFCC)),
                    keyboardOptions = KeyboardOptions(autoCorrect = false, imeAction = ImeAction.Send),
                    keyboardActions = KeyboardActions(onSend = {
                        if (commandInput.isNotBlank()) {
                            terminalLines.add("> $commandInput")
                            webSocketRef.value?.send(commandInput)
                            commandInput = ""
                            scope.launch { listState.animateScrollToItem(terminalLines.size) }
                        }
                    })
                )
                Button(
                    onClick = {
                        if (commandInput.isNotBlank()) {
                            terminalLines.add("> $commandInput")
                            webSocketRef.value?.send(commandInput)
                            commandInput = ""
                            scope.launch { listState.animateScrollToItem(terminalLines.size) }
                        }
                    },
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Text("SEND", fontSize = 12.sp)
                }
            }
        }
    }
}
