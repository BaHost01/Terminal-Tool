package com.terminaltool.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TerminalToolTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
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
        colorScheme = darkColorScheme(),
        content = content
    )
}

@Composable
fun MainScreen() {
    var serverUrl by remember { mutableStateOf("https://terminal-tool.onrender.com") }
    var hostId by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isConnected by remember { mutableStateOf(false) }

    Column(modifier = Modifier.padding(16.dp)) {
        if (!isConnected) {
            Text(text = "Connect to Host", style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = serverUrl,
                onValueChange = { serverUrl = it },
                label = { Text("Relay Server URL") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = hostId,
                onValueChange = { hostId = it },
                label = { Text("Host ID") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(8.dp))
            OutlinedTextField(
                value = password,
                onValueChange = { password = it },
                label = { Text("Password") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(16.dp))
            Button(
                onClick = { isConnected = true },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Connect")
            }
        } else {
            Text(text = "Connected to $hostId", style = MaterialTheme.typography.headlineMedium)
            Spacer(modifier = Modifier.height(16.dp))
            // Terminal View Placeholder
            Surface(
                color = MaterialTheme.colorScheme.surfaceVariant,
                modifier = Modifier.weight(1f).fillMaxWidth()
            ) {
                Text("Terminal Output...", modifier = Modifier.padding(8.dp))
            }
            Spacer(modifier = Modifier.height(16.dp))
            OutlinedTextField(
                value = "",
                onValueChange = {},
                label = { Text("Enter command") },
                modifier = Modifier.fillMaxWidth()
            )
            Spacer(modifier = Modifier.height(16.dp))
            Row(horizontalArrangement = Arrangement.SpaceEvenly, modifier = Modifier.fillMaxWidth()) {
                Button(onClick = { /* Toggle Admin */ }) {
                    Text("Toggle Admin")
                }
                Button(onClick = { /* Toggle Screen */ }) {
                    Text("Screen Share")
                }
                Button(onClick = { isConnected = false }) {
                    Text("Disconnect")
                }
            }
        }
    }
}
