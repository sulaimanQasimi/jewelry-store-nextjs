import '../../models/purchase.dart';
import '../api_client.dart';

class PurchaseApi {
  final ApiClient _client;

  PurchaseApi(this._client);

  Future<PurchaseListResponse> getList({
    int page = 1,
    int limit = 10,
    int? supplierId,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (supplierId != null) queryParams['supplierId'] = supplierId;

    final response = await _client.dio.get(
      '/api/purchase/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return PurchaseListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Purchase.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<Purchase?> getById(int id) async {
    final response = await _client.dio.get('/api/purchase/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final purchase = data['purchase'] ?? data['data'] ?? data;
    return Purchase.fromJson(purchase as Map<String, dynamic>);
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/purchase/create', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/purchase/update/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/purchase/delete/$id');
    return response.data['success'] == true;
  }
}

class PurchaseListResponse {
  final bool success;
  final List<Purchase> data;
  final int total;
  final int page;
  final int limit;

  PurchaseListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
