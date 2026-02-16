import 'dart:ui';

import 'package:shared_preferences/shared_preferences.dart';

const _tokenKey = 'jwt_token';
const _userKey = 'user_data';

/// Handles JWT storage and auth state.
/// Use [notifyUnauthorized] callback to navigate to login on 401.
class AuthService {
  SharedPreferences? _prefs;
  VoidCallback? onUnauthorized;

  Future<void> _ensurePrefs() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  Future<String?> getToken() async {
    await _ensurePrefs();
    return _prefs!.getString(_tokenKey);
  }

  Future<void> saveToken(String token, {String? userId, String? name, String? role}) async {
    await _ensurePrefs();
    await _prefs!.setString(_tokenKey, token);
    if (userId != null || name != null || role != null) {
      await _prefs!.setString(_userKey, '{"id":"$userId","name":"$name","role":"$role"}');
    }
  }

  Future<Map<String, dynamic>?> getUser() async {
    await _ensurePrefs();
    final json = _prefs!.getString(_userKey);
    if (json == null) return null;
    try {
      return {'id': '', 'name': '', 'role': ''}; // Placeholder - parse if needed
    } catch (_) {
      return null;
    }
  }

  Future<void> logout() async {
    await _ensurePrefs();
    await _prefs!.remove(_tokenKey);
    await _prefs!.remove(_userKey);
  }

  void notifyUnauthorized() {
    onUnauthorized?.call();
  }
}
