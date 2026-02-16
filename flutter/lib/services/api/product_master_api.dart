import '../../models/product_master.dart';
import '../api_client.dart';

class ProductMasterApi {
  final ApiClient _client;

  ProductMasterApi(this._client);

  Future<ProductMasterListResponse> getList({
    int page = 1,
    int limit = 10,
    String? search,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (search != null && search.isNotEmpty) queryParams['search'] = search;

    final response = await _client.dio.get(
      '/api/product-master/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return ProductMasterListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => ProductMaster.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<ProductMaster?> getById(int id) async {
    final response = await _client.dio.get('/api/product-master/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final pm = data['productMaster'] ?? data['data'] ?? data;
    return ProductMaster.fromJson(pm as Map<String, dynamic>);
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/product-master/create', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/product-master/update/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/product-master/delete/$id');
    return response.data['success'] == true;
  }
}

class ProductMasterListResponse {
  final bool success;
  final List<ProductMaster> data;
  final int total;
  final int page;
  final int limit;

  ProductMasterListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
