class AuthResponse {
  final bool success;
  final String? token;
  final Map<String, dynamic>? user;
  final String? message;

  AuthResponse({
    required this.success,
    this.token,
    this.user,
    this.message,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      success: json['success'] as bool? ?? false,
      token: json['token'] as String?,
      user: json['user'] as Map<String, dynamic>?,
      message: json['message'] as String?,
    );
  }
}
