import '../../models/supplier_product.dart';
import '../api_client.dart';

class SupplierProductApi {
  final ApiClient _client;

  SupplierProductApi(this._client);

  Future<SupplierProductListResponse> getList({
    int page = 1,
    int limit = 10,
    String? search,
    int? supplierId,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (search != null && search.isNotEmpty) queryParams['search'] = search;
    if (supplierId != null) queryParams['supplierId'] = supplierId;

    final response = await _client.dio.get(
      '/api/supplier-product/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return SupplierProductListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => SupplierProduct.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<SupplierProduct?> getById(int id) async {
    final response = await _client.dio.get('/api/supplier-product/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final sp = data['supplierProduct'] ?? data['data'] ?? data;
    return SupplierProduct.fromJson(sp as Map<String, dynamic>);
  }

  Future<bool> add(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/supplier-product/add', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/supplier-product/update/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/supplier-product/delete/$id');
    return response.data['success'] == true;
  }
}

class SupplierProductListResponse {
  final bool success;
  final List<SupplierProduct> data;
  final int total;
  final int page;
  final int limit;

  SupplierProductListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
