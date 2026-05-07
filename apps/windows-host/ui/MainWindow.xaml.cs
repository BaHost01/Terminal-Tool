using System;
using System.Runtime.InteropServices;
using System.Windows;
using System.Diagnostics;
using System.Security.Principal;

namespace TerminalToolHost
{
    public partial class MainWindow : Window
    {
        // P/Invoke
        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void StatusCallback(string status);

        [UnmanagedFunctionPointer(CallingConvention.Cdecl)]
        public delegate void LogCallback(string message);

        [DllImport("HostEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern bool StartHost(string relayUrl, string adminPassword, string machineName, bool enableScreenSharing, bool isAdminShell);

        [DllImport("HostEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void StopHost();

        [DllImport("HostEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void RegisterStatusCallback(StatusCallback callback);

        [DllImport("HostEngine.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void RegisterLogCallback(LogCallback callback);

        private StatusCallback _statusCallback;
        private LogCallback _logCallback;

        public MainWindow()
        {
            InitializeComponent();
            CheckElevation();

            _statusCallback = OnStatusUpdate;
            _logCallback = OnLogUpdate;

            // Note: In a real app, you'd need to ensure HostEngine.dll is in the search path
            try {
                RegisterStatusCallback(_statusCallback);
                RegisterLogCallback(_logCallback);
            } catch (DllNotFoundException) {
                AppendLog("Error: HostEngine.dll not found. Please ensure the C++ core is built.");
            }
        }

        private void CheckElevation()
        {
            using (WindowsIdentity identity = WindowsIdentity.GetCurrent())
            {
                WindowsPrincipal principal = new WindowsPrincipal(identity);
                bool isAdmin = principal.IsInRole(WindowsBuiltInRole.Administrator);
                AdminShellCheck.IsChecked = isAdmin;
                if (isAdmin) {
                    AppendLog("Running with Administrator privileges.");
                }
            }
        }

        private void OnStatusUpdate(string status)
        {
            Dispatcher.Invoke(() => {
                StatusLabel.Text = status;
                if (status == "Connected")
                {
                    StatusLabel.Foreground = System.Windows.Media.Brushes.Green;
                    StatusIcon.Source = new System.Windows.Media.Imaging.BitmapImage(new Uri("pack://application:,,,/Resources/Icons/circle-check.svg"));
                }
                else if (status.Contains("Error") || status == "Disconnected")
                {
                    StatusLabel.Foreground = System.Windows.Media.Brushes.Red;
                    StatusIcon.Source = new System.Windows.Media.Imaging.BitmapImage(new Uri("pack://application:,,,/Resources/Icons/circle-alert.svg"));
                }
                else
                {
                    StatusLabel.Foreground = System.Windows.Media.Brushes.Gray;
                    StatusIcon.Source = new System.Windows.Media.Imaging.BitmapImage(new Uri("pack://application:,,,/Resources/Icons/circle-alert.svg"));
                }
            });
        }

        private void OnLogUpdate(string message)
        {
            Dispatcher.Invoke(() => AppendLog(message));
        }

        private void AppendLog(string message)
        {
            LogBox.AppendText($"[{DateTime.Now:HH:mm:ss}] {message}\n");
            LogBox.ScrollToEnd();
        }

        private void StartBtn_Click(object sender, RoutedEventArgs e)
        {
            string url = RelayUrlBox.Text;
            string pwd = AdminPasswordBox.Password;
            string name = MachineNameBox.Text;
            bool screen = ScreenSharingCheck.IsChecked ?? false;
            bool admin = AdminShellCheck.IsChecked ?? false;

            if (StartHost(url, pwd, name, screen, admin))
            {
                StartBtn.IsEnabled = false;
                StopBtn.IsEnabled = true;
                AppendLog("Host started.");
            }
            else
            {
                AppendLog("Failed to start host.");
            }
        }

        private void StopBtn_Click(object sender, RoutedEventArgs e)
        {
            StopHost();
            StartBtn.IsEnabled = true;
            StopBtn.IsEnabled = false;
            OnStatusUpdate("Stopped");
            AppendLog("Host stopped.");
        }

        private void AdminShellCheck_Click(object sender, RoutedEventArgs e)
        {
            var result = MessageBox.Show("Changing Admin Shell access requires a restart with elevated privileges. Restart now?", "Restart Required", MessageBoxButton.YesNo);
            if (result == MessageBoxResult.Yes)
            {
                RestartAsAdmin();
            }
            else
            {
                // Revert check
                AdminShellCheck.IsChecked = !AdminShellCheck.IsChecked;
            }
        }

        private void RestartAsAdmin()
        {
            var processInfo = new ProcessStartInfo
            {
                FileName = Process.GetCurrentProcess().MainModule.FileName,
                UseShellExecute = true,
                Verb = "runas" // Triggers UAC
            };

            try
            {
                Process.Start(processInfo);
                Application.Current.Shutdown();
            }
            catch (Exception ex)
            {
                AppendLog($"Failed to restart: {ex.Message}");
            }
        }
    }
}
