import '../../models/daily_transaction.dart';
import '../api_client.dart';

class TransactionApi {
  final ApiClient _client;

  TransactionApi(this._client);

  Future<DailyReportResponse> getDailyReport({String? date}) async {
    final queryParams = date != null ? {'date': date} : null;
    final response = await _client.dio.get(
      '/api/transaction/daily-report',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final daily = (data['daily'] as List<dynamic>?) ?? [];
    return DailyReportResponse(
      success: data['success'] as bool? ?? false,
      daily: daily.map((e) => DailyTransaction.fromJson(e as Map<String, dynamic>)).toList(),
      message: data['message'] as String?,
    );
  }
}

class DailyReportResponse {
  final bool success;
  final List<DailyTransaction> daily;
  final String? message;

  DailyReportResponse({
    required this.success,
    required this.daily,
    this.message,
  });
}
