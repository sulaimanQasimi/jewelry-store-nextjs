import '../../models/storage.dart';
import '../api_client.dart';

class StorageApi {
  final ApiClient _client;

  StorageApi(this._client);

  Future<StorageListResponse> getList({
    int page = 1,
    int limit = 10,
    String? dateFrom,
    String? dateTo,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (dateFrom != null && dateFrom.isNotEmpty) queryParams['dateFrom'] = dateFrom;
    if (dateTo != null && dateTo.isNotEmpty) queryParams['dateTo'] = dateTo;

    final response = await _client.dio.get(
      '/api/storage/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return StorageListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Storage.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  /// Gets today's storage (usd, afn). API returns { storage: { usd, afn } }.
  Future<Storage?> getToday() async {
    final response = await _client.dio.get('/api/storage/get');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final s = data['storage'] as Map<String, dynamic>?;
    if (s == null) return null;
    final today = DateTime.now().toIso8601String().split('T')[0];
    return Storage(
      id: 0,
      date: today,
      usd: (s['usd'] as num?)?.toDouble() ?? 0,
      afn: (s['afn'] as num?)?.toDouble() ?? 0,
    );
  }

  Future<bool> set(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/storage/set', data: payload);
    return response.data['success'] == true;
  }
}

class StorageListResponse {
  final bool success;
  final List<Storage> data;
  final int total;
  final int page;
  final int limit;

  StorageListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
