import '../../models/person.dart';
import '../api_client.dart';

class PersonApi {
  final ApiClient _client;

  PersonApi(this._client);

  Future<PersonListResponse> getList({
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
      '/api/person/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return PersonListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Person.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<Person?> getById(int id) async {
    final response = await _client.dio.get('/api/person/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final person = data['person'] ?? data['data'] ?? data;
    return Person.fromJson(person as Map<String, dynamic>);
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/person/create', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/person/update/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/person/delete/$id');
    return response.data['success'] == true;
  }
}

class PersonListResponse {
  final bool success;
  final List<Person> data;
  final int total;
  final int page;
  final int limit;

  PersonListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
