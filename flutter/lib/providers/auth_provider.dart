import 'package:flutter/material.dart';

import '../services/auth_service.dart';
import '../services/api/auth_api.dart';
import '../services/api_client.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  ApiClient? _apiClient;
  AuthApi? _authApi;

  ApiClient get apiClient {
    _apiClient ??= ApiClient(_authService);
    return _apiClient!;
  }

  AuthApi get authApi {
    _authApi ??= AuthApi(apiClient);
    return _authApi!;
  }

  bool _isLoading = false;
  String? _error;

  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<bool> isLoggedIn() async {
    final token = await _authService.getToken();
    return token != null && token.isNotEmpty;
  }

  Future<bool> login(String emailOrUsername, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await authApi.login(emailOrUsername, password);
      if (response.success && response.token != null) {
        final user = response.user;
        await _authService.saveToken(
          response.token!,
          userId: user?['id']?.toString(),
          name: user?['name']?.toString(),
          role: user?['role']?.toString(),
        );
        _isLoading = false;
        _error = null;
        notifyListeners();
        return true;
      } else {
        _error = response.message ?? 'اطلاعات ورود نادرست است';
        _isLoading = false;
        notifyListeners();
        return false;
      }
    } catch (e) {
      _error = 'خطا در اتصال به سرور';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _apiClient = null;
    _authApi = null;
    notifyListeners();
  }

  void setUnauthorizedCallback(VoidCallback callback) {
    _authService.onUnauthorized = callback;
  }
}
