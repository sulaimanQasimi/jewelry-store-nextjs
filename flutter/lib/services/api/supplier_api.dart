import '../../models/supplier.dart';
import '../api_client.dart';

class SupplierApi {
  final ApiClient _client;

  SupplierApi(this._client);

  Future<SupplierListResponse> getList({
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
      '/api/supplier/get-all',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return SupplierListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Supplier.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<Supplier?> getById(int id) async {
    final response = await _client.dio.get('/api/supplier/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final supplier = data['supplier'] ?? data['data'] ?? data;
    return Supplier.fromJson(supplier as Map<String, dynamic>);
  }

  Future<List<Supplier>> search(String? search) async {
    final queryParams = search != null && search.isNotEmpty ? {'search': search} : null;
    final response = await _client.dio.get(
      '/api/supplier/get',
      queryParameters: queryParams,
    );
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return [];
    final list = (data['supplier'] as List<dynamic>?) ?? [];
    return list.map((e) => Supplier.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/supplier/create', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/supplier/update/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/supplier/delete/$id');
    return response.data['success'] == true;
  }
}

class SupplierListResponse {
  final bool success;
  final List<Supplier> data;
  final int total;
  final int page;
  final int limit;

  SupplierListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
