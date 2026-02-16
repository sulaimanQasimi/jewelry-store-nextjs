import '../../models/currency_rate.dart';
import '../api_client.dart';

class CurrencyRateApi {
  final ApiClient _client;

  CurrencyRateApi(this._client);

  Future<CurrencyRateListResponse> getList({
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
      '/api/currency-rate/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return CurrencyRateListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => CurrencyRate.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<CurrencyRate?> getById(int id) async {
    final response = await _client.dio.get('/api/currency-rate/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final cr = data['currencyRate'] ?? data['data'] ?? data;
    return CurrencyRate.fromJson(cr as Map<String, dynamic>);
  }

  Future<double> getTodayRate() async {
    final response = await _client.dio.get('/api/currency/today');
    final data = response.data as Map<String, dynamic>;
    final rate = data['rate'] as Map<String, dynamic>?;
    return (rate?['usdToAfn'] as num?)?.toDouble() ?? 1.0;
  }

  Future<bool> setTodayRate(double usdToAfn) async {
    final response = await _client.dio.post(
      '/api/currency/today',
      data: {'usdToAfn': usdToAfn},
    );
    return response.data['success'] == true;
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/currency-rate/create', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> update(int id, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/currency-rate/update/$id', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int id) async {
    final response = await _client.dio.delete('/api/currency-rate/delete/$id');
    return response.data['success'] == true;
  }
}

class CurrencyRateListResponse {
  final bool success;
  final List<CurrencyRate> data;
  final int total;
  final int page;
  final int limit;

  CurrencyRateListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
