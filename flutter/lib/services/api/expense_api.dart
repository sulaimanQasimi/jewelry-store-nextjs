import '../../models/expense.dart';
import '../api_client.dart';

class ExpenseApi {
  final ApiClient _client;

  ExpenseApi(this._client);

  Future<ExpenseListResponse> getList({
    int page = 1,
    int limit = 10,
    String? type,
    String? dateFrom,
    String? dateTo,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (type != null && type.isNotEmpty) queryParams['type'] = type;
    if (dateFrom != null && dateFrom.isNotEmpty) queryParams['dateFrom'] = dateFrom;
    if (dateTo != null && dateTo.isNotEmpty) queryParams['dateTo'] = dateTo;

    final response = await _client.dio.get(
      '/api/expense/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return ExpenseListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Expense.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<Expense?> getById(int id) async {
    final response = await _client.dio.get('/api/expense/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final expense = data['expense'] ?? data['data'] ?? data;
    return Expense.fromJson(expense as Map<String, dynamic>);
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/expense/add-expense', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/expense/update-spent/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/expense/delete-spent/$id');
    return response.data['success'] == true;
  }

  Future<double> getTotal() async {
    final response = await _client.dio.get('/api/expense/total');
    final data = response.data as Map<String, dynamic>;
    return (data['total'] as num?)?.toDouble() ?? 0;
  }

  Future<List<Expense>> getDaily(String date) async {
    final response = await _client.dio.get(
      '/api/expense/daily',
      queryParameters: {'date': date},
    );
    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return list.map((e) => Expense.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Expense>> search(String? search) async {
    final queryParams = search != null && search.isNotEmpty ? {'search': search} : null;
    final response = await _client.dio.get(
      '/api/expense/search',
      queryParameters: queryParams,
    );
    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return list.map((e) => Expense.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<ExpenseAllResponse> getAll() async {
    final response = await _client.dio.get('/api/expense/all');
    final data = response.data as Map<String, dynamic>;
    final allList = (data['all'] as List<dynamic>?) ?? [];
    final totalList = (data['total'] as List<dynamic>?) ?? [];
    return ExpenseAllResponse(
      success: data['success'] as bool? ?? false,
      all: allList.map((e) => Expense.fromJson(e as Map<String, dynamic>)).toList(),
      total: totalList.map((e) => ExpenseTotalByCurrency.fromJson(e as Map<String, dynamic>)).toList(),
      message: data['message'] as String?,
    );
  }
}

class ExpenseListResponse {
  final bool success;
  final List<Expense> data;
  final int total;
  final int page;
  final int limit;

  ExpenseListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}

class ExpenseTotalByCurrency {
  final String currency;
  final double price;

  ExpenseTotalByCurrency({required this.currency, required this.price});

  factory ExpenseTotalByCurrency.fromJson(Map<String, dynamic> json) {
    return ExpenseTotalByCurrency(
      currency: json['currency'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0,
    );
  }
}

class ExpenseAllResponse {
  final bool success;
  final List<Expense> all;
  final List<ExpenseTotalByCurrency> total;
  final String? message;

  ExpenseAllResponse({
    required this.success,
    required this.all,
    required this.total,
    this.message,
  });
}
