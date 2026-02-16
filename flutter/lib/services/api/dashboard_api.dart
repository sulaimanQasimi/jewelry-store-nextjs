import '../../models/dashboard_stats.dart';
import '../api_client.dart';

class DashboardApi {
  final ApiClient _client;

  DashboardApi(this._client);

  Future<DashboardResponse> getStats() async {
    final response = await _client.dio.get('/api/dashboard/stats');
    final data = response.data as Map<String, dynamic>;
    return DashboardResponse.fromJson(data);
  }
}

class DashboardResponse {
  final bool success;
  final DashboardStats? stats;
  final List<DayData> last7Days;
  final List<SalesByType> salesByType;
  final String? message;

  DashboardResponse({
    required this.success,
    this.stats,
    this.last7Days = const [],
    this.salesByType = const [],
    this.message,
  });

  factory DashboardResponse.fromJson(Map<String, dynamic> json) {
    final statsJson = json['stats'] as Map<String, dynamic>?;
    final last7 = json['last7Days'] as List<dynamic>? ?? [];
    final sales = json['salesByType'] as List<dynamic>? ?? [];
    return DashboardResponse(
      success: json['success'] as bool? ?? false,
      stats: statsJson != null ? DashboardStats.fromJson(statsJson) : null,
      last7Days: last7.map((e) => DayData.fromJson(e as Map<String, dynamic>)).toList(),
      salesByType: sales.map((e) => SalesByType.fromJson(e as Map<String, dynamic>)).toList(),
      message: json['message'] as String?,
    );
  }
}
