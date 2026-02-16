import '../../models/trader.dart';
import '../api_client.dart';

class TraderApi {
  final ApiClient _client;

  TraderApi(this._client);

  Future<TraderListResponse> getList({
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
      '/api/trader/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return TraderListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Trader.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<Trader?> getById(int id) async {
    final response = await _client.dio.get('/api/trader/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final trader = data['trader'] ?? data['data'] ?? data;
    return Trader.fromJson(trader as Map<String, dynamic>);
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/trader/create', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/trader/update/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/trader/delete/$id');
    return response.data['success'] == true;
  }
}

class TraderListResponse {
  final bool success;
  final List<Trader> data;
  final int total;
  final int page;
  final int limit;

  TraderListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
