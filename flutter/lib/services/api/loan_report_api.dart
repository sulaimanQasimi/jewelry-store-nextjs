import '../../models/loan_report.dart';
import '../api_client.dart';

class LoanReportApi {
  final ApiClient _client;

  LoanReportApi(this._client);

  Future<LoanReportListResponse> getList({
    int page = 1,
    int limit = 10,
    int? customerId,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (customerId != null) queryParams['customerId'] = customerId;

    final response = await _client.dio.get(
      '/api/loan-report/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return LoanReportListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => LoanReport.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<LoanReport?> getById(int id) async {
    final response = await _client.dio.get('/api/loan-report/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final lr = data['loanReport'] ?? data['data'] ?? data;
    return LoanReport.fromJson(lr as Map<String, dynamic>);
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/loan-report/create', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/loan-report/update/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/loan-report/delete/$id');
    return response.data['success'] == true;
  }
}

class LoanReportListResponse {
  final bool success;
  final List<LoanReport> data;
  final int total;
  final int page;
  final int limit;

  LoanReportListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
