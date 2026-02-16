import 'package:dio/dio.dart';
import '../config/api_config.dart';
import 'auth_service.dart';

/// Dio HTTP client with auth interceptor.
/// Injects Bearer token and handles 401 responses.
class ApiClient {
  late final Dio _dio;
  final AuthService _authService;

  ApiClient(this._authService) {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: ApiConfig.connectTimeout,
      receiveTimeout: ApiConfig.receiveTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _authService.getToken();
        if (token != null && token.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          await _authService.logout();
          _authService.notifyUnauthorized();
        }
        return handler.next(error);
      },
    ));
  }

  Dio get dio => _dio;
}
