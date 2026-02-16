import 'package:dio/dio.dart';

import '../../models/auth_response.dart';
import '../api_client.dart';

class AuthApi {
  final ApiClient _client;

  AuthApi(this._client);

  /// Login with email/username and password.
  /// Uses /api/auth/token - no Bearer token required.
  Future<AuthResponse> login(String emailOrUsername, String password) async {
    final dio = Dio(BaseOptions(
      baseUrl: _client.dio.options.baseUrl,
      connectTimeout: _client.dio.options.connectTimeout,
      receiveTimeout: _client.dio.options.receiveTimeout,
    ));

    final response = await dio.post(
      '/api/auth/token',
      data: {
        'email': emailOrUsername.trim(),
        'password': password,
      },
    );

    return AuthResponse.fromJson(response.data as Map<String, dynamic>);
  }
}
