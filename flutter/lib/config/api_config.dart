/// API configuration for the jewelry store app.
/// Base URL can be overridden via --dart-define=BASE_URL=...
/// - Android emulator: http://10.0.2.2:3000
/// - iOS simulator: http://localhost:3000
/// - Physical device: http://<your-machine-ip>:3000
class ApiConfig {
  static const String _defaultBaseUrl = 'http://localhost:3000';

  static String get baseUrl {
    const url = String.fromEnvironment(
      'BASE_URL',
      defaultValue: _defaultBaseUrl,
    );
    return url.endsWith('/') ? url.substring(0, url.length - 1) : url;
  }

  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 30);
}
