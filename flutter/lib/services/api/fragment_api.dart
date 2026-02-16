import '../../models/fragment.dart';
import '../api_client.dart';

class FragmentApi {
  final ApiClient _client;

  FragmentApi(this._client);

  Future<FragmentListResponse> getList({
    int page = 1,
    int limit = 10,
  }) async {
    final response = await _client.dio.get(
      '/api/fragment/list',
      queryParameters: {'page': page, 'limit': limit},
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return FragmentListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Fragment.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<Fragment?> getById(int id) async {
    final response = await _client.dio.get('/api/fragment/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final fragment = data['fragment'] ?? data['data'] ?? data;
    return Fragment.fromJson(fragment as Map<String, dynamic>);
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/fragment/create', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/fragment/update/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/fragment/delete/$id');
    return response.data['success'] == true;
  }
}

class FragmentListResponse {
  final bool success;
  final List<Fragment> data;
  final int total;
  final int page;
  final int limit;

  FragmentListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
