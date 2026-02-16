import '../../models/product.dart';
import '../api_client.dart';

class ProductApi {
  final ApiClient _client;

  ProductApi(this._client);

  Future<ProductListResponse> getList({
    int page = 1,
    int limit = 10,
    String? search,
    bool? isSold,
    String? type,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (search != null && search.isNotEmpty) queryParams['search'] = search;
    if (isSold != null) queryParams['isSold'] = isSold;
    if (type != null && type.isNotEmpty) queryParams['type'] = type;

    final response = await _client.dio.get(
      '/api/product/list',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? [];
    return ProductListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Product.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }
}

class ProductListResponse {
  final bool success;
  final List<Product> data;
  final int total;
  final int page;
  final int limit;

  ProductListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}
