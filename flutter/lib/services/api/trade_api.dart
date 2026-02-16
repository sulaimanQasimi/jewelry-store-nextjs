import '../../models/trade.dart';
import '../api_client.dart';

class TradeApi {
  final ApiClient _client;

  TradeApi(this._client);

  Future<TradeListResponse> getList({
    int page = 1,
    int limit = 10,
    int? traderId,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (traderId != null) queryParams['traderId'] = traderId;

    final response = await _client.dio.get(
      '/api/trade/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return TradeListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Trade.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }
}

class TradeListResponse {
  final bool success;
  final List<Trade> data;
  final int total;
  final int page;
  final int limit;

  TradeListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
