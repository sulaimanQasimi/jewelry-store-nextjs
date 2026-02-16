import '../../models/personal_expense.dart';
import '../api_client.dart';

class PersonalExpenseApi {
  final ApiClient _client;

  PersonalExpenseApi(this._client);

  Future<PersonalExpenseListResponse> getList({
    int page = 1,
    int limit = 10,
    int? personId,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (personId != null) queryParams['personId'] = personId;

    final response = await _client.dio.get(
      '/api/personal-expense/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return PersonalExpenseListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => PersonalExpense.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<PersonalExpense?> getById(int id) async {
    final response = await _client.dio.get('/api/personal-expense/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final pe = data['personalExpense'] ?? data['data'] ?? data;
    return PersonalExpense.fromJson(pe as Map<String, dynamic>);
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/personal-expense/create', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/personal-expense/update/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/personal-expense/delete/$id');
    return response.data['success'] == true;
  }
}

class PersonalExpenseListResponse {
  final bool success;
  final List<PersonalExpense> data;
  final int total;
  final int page;
  final int limit;

  PersonalExpenseListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
