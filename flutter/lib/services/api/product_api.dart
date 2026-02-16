import 'package:dio/dio.dart';

import '../../models/product.dart';
import '../api_client.dart';

class ProductApi {
  final ApiClient _client;

  ProductApi(this._client);

  Future<Product?> getById(int id) async {
    final response = await _client.dio.get('/api/product/$id');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final product = data['product'] ?? data['data'] ?? data;
    return Product.fromJson(product as Map<String, dynamic>);
  }

  Future<Product?> searchByBarcode(String code) async {
    final response = await _client.dio.get('/api/product/search-barcode/$code');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true || data['product'] == null) return null;
    return Product.fromJson(data['product'] as Map<String, dynamic>);
  }

  Future<bool> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/product/new-product', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int productId) async {
    final response = await _client.dio.delete('/api/product/delete-product/$productId');
    return response.data['success'] == true;
  }

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

  Future<ProductTodayResponse> getToday() async {
    final response = await _client.dio.get('/api/product/today');
    final data = response.data as Map<String, dynamic>;
    final list = (data['dailyProduct'] as List<dynamic>?) ?? [];
    return ProductTodayResponse(
      success: data['success'] as bool? ?? false,
      count: (data['count'] as num?)?.toInt() ?? 0,
      dailyProduct: list.map((e) => Product.fromJson(e as Map<String, dynamic>)).toList(),
      message: data['message'] as String?,
    );
  }

  Future<ProductTotalResponse> getTotal() async {
    final response = await _client.dio.get('/api/product/total');
    final data = response.data as Map<String, dynamic>;
    final list = (data['totalProduct'] as List<dynamic>?) ?? [];
    return ProductTotalResponse(
      success: data['success'] as bool? ?? false,
      totalProduct: list
          .map((e) => ProductTotalItem.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }

  Future<bool> addFragment({
    required String productName,
    required String type,
    required double gram,
    required double karat,
    required double purchase,
    String? imagePath,
  }) async {
    final formData = FormData.fromMap({
      'productName': productName,
      'type': type,
      'gram': gram.toString(),
      'karat': karat.toString(),
      'purchase': purchase.toString(),
      if (imagePath != null && imagePath.isNotEmpty)
        'image': await MultipartFile.fromFile(imagePath),
    });
    final response =
        await _client.dio.post('/api/product/add-fragment', data: formData);
    return response.data['success'] == true;
  }

  Future<List<Product>> existProduct() async {
    final response = await _client.dio.get('/api/product/exist-product');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return [];
    final list = (data['products'] as List<dynamic>?) ?? [];
    return list.map((e) => Product.fromJson(e as Map<String, dynamic>)).toList();
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

class ProductTodayResponse {
  final bool success;
  final int count;
  final List<Product> dailyProduct;
  final String? message;

  ProductTodayResponse({
    required this.success,
    required this.count,
    required this.dailyProduct,
    this.message,
  });
}

class ProductTotalItem {
  final Map<String, dynamic>? detail;
  final double totalGold;
  final double totalAmountToAfghani;
  final int count;

  ProductTotalItem({
    this.detail,
    required this.totalGold,
    required this.totalAmountToAfghani,
    required this.count,
  });

  factory ProductTotalItem.fromJson(Map<String, dynamic> json) {
    return ProductTotalItem(
      detail: json['detail'] as Map<String, dynamic>?,
      totalGold: (json['totalGold'] as num?)?.toDouble() ?? 0,
      totalAmountToAfghani:
          (json['totalAmountToAfghani'] as num?)?.toDouble() ?? 0,
      count: (json['count'] as num?)?.toInt() ?? 0,
    );
  }
}

class ProductTotalResponse {
  final bool success;
  final List<ProductTotalItem> totalProduct;

  ProductTotalResponse({
    required this.success,
    required this.totalProduct,
  });
}
