package com.terminaltool.app

import android.os.Bundle
import android.graphics.BitmapFactory
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch
import okhttp3.*
import okio.ByteString
import java.util.*
import java.util.concurrent.TimeUnit

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TerminalToolTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = Color(0xFF000000)) {
                    MainScreen()
                }
            }
        }
    }
}

@Composable
fun TerminalToolTheme(content: @Composable () -> Unit) {
    val darkColors = darkColorScheme(
        primary = Color(0xFF00FFCC),
        secondary = Color(0xFF00BFA5),
        tertiary = Color(0xFF64FFDA),
        background = Color(0xFF000000),
        surface = Color(0xFF06131D),
        onSurface = Color.White
    )
    MaterialTheme(colorScheme = darkColors, content = content)
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
    var showSettings by remember { mutableStateOf(false) }

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
                terminalLines.add("[system] Uplink established. Authenticating...")
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                terminalLines.add(text)
                scope.launch { listState.animateScrollToItem(terminalLines.size) }
            }

            override fun onMessage(webSocket: WebSocket, bytes: ByteString) {
                // Decode screen frames or binary PTY output
                try {
                    val bitmap = BitmapFactory.decodeByteArray(bytes.toByteArray(), 0, bytes.size)
                    if (bitmap != null) {
                        screenBitmap = bitmap
                        isScreenActive = true
                    }
                } catch (e: Exception) {
                    Log.e("TerminalTool", "Failed to decode binary message", e)
                }
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                terminalLines.add("[error] Link failure: ${t.message}")
                isConnected = false
            }

            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                terminalLines.add("[system] Session closed by peer.")
                isConnected = false
            }
        }
        client.newWebSocket(request, listener)
    }

    if (!isConnected) {
        // --- Revamped Connection Screen ---
        Box(modifier = Modifier.fillMaxSize()) {
            // Background Gradient
            Box(modifier = Modifier.fillMaxSize().background(
                Brush.verticalGradient(listOf(Color(0xFF06131D), Color(0xFF000000)))
            ))
            
            Column(
                modifier = Modifier.fillMaxSize().padding(32.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Icon(
                    imageVector = Icons.Default.Terminal,
                    contentDescription = null,
                    tint = Color(0xFF00FFCC),
                    modifier = Modifier.size(80.dp)
                )
                Spacer(Modifier.height(16.dp))
                Text(
                    "TERMINAL TOOL",
                    style = TextStyle(
                        color = Color(0xFF00FFCC),
                        fontSize = 28.sp,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 6.sp
                    )
                )
                Text("v2.2.0 ENTERPRISE", color = Color.Gray, fontSize = 10.sp, letterSpacing = 2.sp)
                
                Spacer(Modifier.height(48.dp))
                
                LoginInput(value = serverUrl, label = "Relay Server", onValueChange = { serverUrl = it }, icon = Icons.Default.Dns)
                Spacer(Modifier.height(16.dp))
                LoginInput(value = hostId, label = "Host Identity", onValueChange = { hostId = it }, icon = Icons.Default.Computer)
                Spacer(Modifier.height(16.dp))
                LoginInput(value = token, label = "Access Token", onValueChange = { token = it }, icon = Icons.Default.Key, isPassword = true)
                
                Spacer(Modifier.height(40.dp))

                Button(
                    onClick = { 
                        isConnected = true 
                        terminalLines.clear()
                        connect()
                    },
                    modifier = Modifier.fillMaxWidth().height(60.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00FFCC), contentColor = Color.Black),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("ESTABLISH SECURE LINK", fontWeight = FontWeight.Black)
                }
            }
        }
    } else {
        // --- Revamped Terminal UI ---
        Column(modifier = Modifier.fillMaxSize().background(Color.Black)) {
            // Header
            HeaderBar(
                hostId = hostId, 
                isAdmin = isAdminActive, 
                isLive = isScreenActive,
                onDisconnect = {
                    webSocketRef.value?.close(1000, "User quit")
                    isConnected = false
                }
            )

            // Dynamic Screen Preview
            if (isScreenActive && screenBitmap != null) {
                Box(modifier = Modifier
                    .fillMaxWidth()
                    .height(220.dp)
                    .padding(8.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFF050505))
                ) {
                    Image(
                        bitmap = screenBitmap!!.asImageBitmap(),
                        contentDescription = "Remote Desktop",
                        modifier = Modifier.fillMaxSize()
                    )
                    Box(modifier = Modifier.align(Alignment.TopEnd).padding(8.dp).background(Color.Red.copy(alpha = 0.7f), RoundedCornerShape(4.dp)).padding(horizontal = 4.dp)) {
                        Text("REC", color = Color.White, fontSize = 8.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            // Monospace Terminal
            Box(modifier = Modifier.weight(1f).fillMaxWidth().padding(horizontal = 12.dp, vertical = 4.dp)) {
                LazyColumn(state = listState, modifier = Modifier.fillMaxSize()) {
                    items(terminalLines) { line ->
                        TerminalLine(line)
                    }
                }
            }

            // Keyboard Helper Bar (Special Keys)
            SpecialKeysBar { key ->
                if (key == "TAB") webSocketRef.value?.send("\t")
                else if (key == "ESC") webSocketRef.value?.send("\u001b")
                else if (key == "CTRL+C") webSocketRef.value?.send("\u0003")
                else terminalLines.add("[mobile] Special key $key sent")
            }

            // Command Input
            InputBar(
                value = commandInput,
                onValueChange = { commandInput = it },
                onSend = {
                    if (commandInput.isNotBlank()) {
                        terminalLines.add("> $commandInput")
                        webSocketRef.value?.send(commandInput)
                        commandInput = ""
                        scope.launch { listState.animateScrollToItem(terminalLines.size) }
                    }
                }
            )
        }
    }
}

@Composable
fun LoginInput(value: String, label: String, onValueChange: (String) -> Unit, icon: ImageVector, isPassword: Boolean = false) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label, color = Color.Gray) },
        modifier = Modifier.fillMaxWidth(),
        leadingIcon = { Icon(icon, null, tint = Color(0xFF00FFCC)) },
        visualTransformation = if (isPassword) PasswordVisualTransformation() else VisualTransformation.None,
        colors = OutlinedTextFieldDefaults.colors(
            focusedTextColor = Color.White,
            unfocusedTextColor = Color.White,
            focusedBorderColor = Color(0xFF00FFCC),
            unfocusedBorderColor = Color(0xFF333333)
        ),
        shape = RoundedCornerShape(12.dp),
        singleLine = true
    )
}

@Composable
fun HeaderBar(hostId: String, isAdmin: Boolean, isLive: Boolean, onDisconnect: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().background(Color(0xFF121212)).padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(hostId.ifEmpty { "REMOTE_HOST" }.uppercase(), color = Color(0xFF00FFCC), fontWeight = FontWeight.Black, fontSize = 16.sp)
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(6.dp).clip(RoundedCornerShape(3.dp)).background(Color(0xFF00FFCC)))
                Spacer(Modifier.width(6.dp))
                Text("ENCRYPTED TUNNEL", color = Color.Gray, fontSize = 9.sp, fontWeight = FontWeight.Bold)
            }
        }
        
        if (isAdmin) {
            BadgeTag("ADMIN", Color.Red, Color.White)
            Spacer(Modifier.width(8.dp))
        }
        if (isLive) {
            BadgeTag("LIVE", Color(0xFF00FFCC), Color.Black)
            Spacer(Modifier.width(8.dp))
        }
        
        Icon(
            imageVector = Icons.Default.Cancel,
            contentDescription = "Disconnect",
            tint = Color.Red,
            modifier = Modifier.size(24.dp).clickable { onDisconnect() }
        )
    }
}

@Composable
fun BadgeTag(text: String, bg: Color, fg: Color) {
    Box(modifier = Modifier.background(bg, RoundedCornerShape(4.dp)).padding(horizontal = 6.dp, vertical = 2.dp)) {
        Text(text, color = fg, fontSize = 10.sp, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun TerminalLine(text: String) {
    val color = when {
        text.startsWith(">") -> Color(0xFF00FFCC)
        text.startsWith("[error]") -> Color.Red
        text.startsWith("[system]") -> Color(0xFF64FFDA)
        else -> Color.White
    }
    Text(
        text,
        color = color,
        fontFamily = FontFamily.Monospace,
        fontSize = 12.sp,
        modifier = Modifier.padding(vertical = 1.dp)
    )
}

@Composable
fun SpecialKeysBar(onKey: (String) -> Unit) {
    val keys = listOf("ESC", "TAB", "CTRL+C", "ALT", "↑", "↓", "←", "→")
    LazyRow(
        modifier = Modifier.fillMaxWidth().background(Color(0xFF1A1A1A)).padding(4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        items(keys) { key ->
            Surface(
                onClick = { onKey(key) },
                color = Color(0xFF333333),
                shape = RoundedCornerShape(4.dp)
            ) {
                Text(
                    key, 
                    color = Color.White, 
                    fontSize = 12.sp, 
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)
                )
            }
        }
    }
}

@Composable
fun InputBar(value: String, onValueChange: (String) -> Unit, onSend: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().background(Color(0xFF0A0A0A)).padding(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text("$", color = Color(0xFF00FFCC), fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Black, fontSize = 18.sp)
        Spacer(Modifier.width(8.dp))
        BasicTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.weight(1f),
            textStyle = TextStyle(color = Color.White, fontFamily = FontFamily.Monospace, fontSize = 16.sp),
            cursorBrush = Brush.verticalGradient(listOf(Color(0xFF00FFCC), Color(0xFF00FFCC))),
            keyboardOptions = KeyboardOptions(autoCorrect = false, imeAction = ImeAction.Send),
            keyboardActions = KeyboardActions(onSend = { onSend() })
        )
        IconButton(onClick = onSend) {
            Icon(Icons.Default.Send, null, tint = Color(0xFF00FFCC))
        }
    }
}
