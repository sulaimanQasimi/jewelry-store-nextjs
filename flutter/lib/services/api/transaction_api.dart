import '../../models/daily_transaction.dart';
import '../../models/loan_summary.dart';
import '../api_client.dart';

class TransactionApi {
  final ApiClient _client;

  TransactionApi(this._client);

  Future<TransactionCreateResponse> createTransaction(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/transaction/create-transaction', data: payload);
    return TransactionCreateResponse.fromJson(response.data as Map<String, dynamic>);
  }

  Future<bool> returnProduct(int transactionId, int productId) async {
    final response = await _client.dio.post('/api/transaction/return', data: {
      'transactionId': transactionId,
      'productId': productId,
    });
    return response.data['success'] == true;
  }

  Future<bool> payLoan(int transactionId, double amount, String currency, double usdRate) async {
    final response = await _client.dio.post('/api/transaction/pay-loan', data: {
      'transactionId': transactionId,
      'amount': amount,
      'currency': currency,
      'usdRate': usdRate,
    });
    return response.data['success'] == true;
  }

  Future<LoanListResponse> getLoanList({int page = 1, int limit = 10, String? search}) async {
    final queryParams = <String, dynamic>{'page': page, 'limit': limit};
    if (search != null && search.isNotEmpty) queryParams['search'] = search;
    final response = await _client.dio.get(
      '/api/transaction/loan-list',
      queryParameters: queryParams,
    );
    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? (data['loans'] as List<dynamic>?) ?? [];
    return LoanListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => LoanSummary.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<DailyReportResponse> getDailyReport({String? date}) async {
    final queryParams = date != null ? {'date': date} : null;
    final response = await _client.dio.get(
      '/api/transaction/daily-report',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final daily = (data['daily'] as List<dynamic>?) ?? [];
    return DailyReportResponse(
      success: data['success'] as bool? ?? false,
      daily: daily.map((e) => DailyTransaction.fromJson(e as Map<String, dynamic>)).toList(),
      message: data['message'] as String?,
    );
  }

  Future<SaleReportResponse> getSaleReport({
    String? dateFrom,
    String? dateTo,
  }) async {
    final queryParams = <String, dynamic>{};
    if (dateFrom != null && dateFrom.isNotEmpty) queryParams['dateFrom'] = dateFrom;
    if (dateTo != null && dateTo.isNotEmpty) queryParams['dateTo'] = dateTo;
    final response = await _client.dio.get(
      '/api/transaction/sale-report',
      queryParameters: queryParams.isNotEmpty ? queryParams : null,
    );
    return SaleReportResponse.fromJson(response.data as Map<String, dynamic>);
  }

  Future<SoldProductResponse> getSold() async {
    final response = await _client.dio.get('/api/transaction/sold');
    final data = response.data as Map<String, dynamic>;
    final list = (data['soldProduct'] as List<dynamic>?) ?? [];
    return SoldProductResponse(
      success: data['success'] as bool? ?? false,
      soldProduct: list.map((e) => SoldProduct.fromJson(e as Map<String, dynamic>)).toList(),
      message: data['message'] as String?,
    );
  }

  Future<CustomerLoanResponse> getToPay(int customerId) async {
    final response = await _client.dio.get(
      '/api/transaction/to-pay',
      queryParameters: {'customerId': customerId},
    );
    final data = response.data as Map<String, dynamic>;
    final list = (data['loan'] as List<dynamic>?) ?? [];
    return CustomerLoanResponse(
      success: data['success'] as bool? ?? false,
      loan: list.map((e) => DailyTransaction.fromJson(e as Map<String, dynamic>)).toList(),
      message: data['message'] as String?,
    );
  }

  Future<DailySumResponse> getDailySum() async {
    final response = await _client.dio.get('/api/transaction/daily-sum');
    return DailySumResponse.fromJson(response.data as Map<String, dynamic>);
  }
}

class DailyReportResponse {
  final bool success;
  final List<DailyTransaction> daily;
  final String? message;

  DailyReportResponse({
    required this.success,
    required this.daily,
    this.message,
  });
}

class TransactionCreateResponse {
  final bool success;
  final Map<String, dynamic>? transaction;
  final String? message;

  TransactionCreateResponse({required this.success, this.transaction, this.message});

  factory TransactionCreateResponse.fromJson(Map<String, dynamic> json) {
    return TransactionCreateResponse(
      success: json['success'] as bool? ?? false,
      transaction: json['transaction'] as Map<String, dynamic>?,
      message: json['message'] as String?,
    );
  }
}

class LoanListResponse {
  final bool success;
  final List<LoanSummary> data;
  final int total;
  final int page;
  final int limit;

  LoanListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}

class SaleReportResponse {
  final bool success;
  final int totalProducts;
  final double totalGram;
  final double totalAmount;
  final double remainAmount;
  final double totalDiscount;
  final List<SaleReportProduct> products;
  final String? message;

  SaleReportResponse({
    required this.success,
    required this.totalProducts,
    required this.totalGram,
    required this.totalAmount,
    required this.remainAmount,
    required this.totalDiscount,
    required this.products,
    this.message,
  });

  factory SaleReportResponse.fromJson(Map<String, dynamic> json) {
    final list = (json['products'] as List<dynamic>?) ?? [];
    return SaleReportResponse(
      success: json['success'] as bool? ?? false,
      totalProducts: (json['totalProducts'] as num?)?.toInt() ?? 0,
      totalGram: (json['totalGram'] as num?)?.toDouble() ?? 0,
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0,
      remainAmount: (json['remainAmount'] as num?)?.toDouble() ?? 0,
      totalDiscount: (json['totalDiscount'] as num?)?.toDouble() ?? 0,
      products: list.map((e) => SaleReportProduct.fromJson(e as Map<String, dynamic>)).toList(),
      message: json['message'] as String?,
    );
  }
}

class SaleReportProduct {
  final String? name;
  final String? barcode;
  final double? gram;
  final dynamic price;

  SaleReportProduct({this.name, this.barcode, this.gram, this.price});

  factory SaleReportProduct.fromJson(Map<String, dynamic> json) {
    return SaleReportProduct(
      name: json['name'] as String?,
      barcode: json['barcode'] as String?,
      gram: (json['gram'] as num?)?.toDouble(),
      price: json['price'],
    );
  }
}

class SoldProduct {
  final int transactionId;
  final String? customerName;
  final String? customerPhone;
  final String? productName;
  final int? productId;
  final dynamic salePrice;
  final double? gram;
  final double? karat;
  final String? barcode;
  final String? image;
  final String? createdAt;

  SoldProduct({
    required this.transactionId,
    this.customerName,
    this.customerPhone,
    this.productName,
    this.productId,
    this.salePrice,
    this.gram,
    this.karat,
    this.barcode,
    this.image,
    this.createdAt,
  });

  factory SoldProduct.fromJson(Map<String, dynamic> json) {
    return SoldProduct(
      transactionId: (json['transactionId'] as num?)?.toInt() ?? 0,
      customerName: json['customerName'] as String?,
      customerPhone: json['customerPhone'] as String?,
      productName: json['productName'] as String?,
      productId: (json['productId'] as num?)?.toInt(),
      salePrice: json['salePrice'],
      gram: (json['gram'] as num?)?.toDouble(),
      karat: (json['karat'] as num?)?.toDouble(),
      barcode: json['barcode'] as String?,
      image: json['image'] as String?,
      createdAt: json['createdAt']?.toString(),
    );
  }
}

class SoldProductResponse {
  final bool success;
  final List<SoldProduct> soldProduct;
  final String? message;

  SoldProductResponse({
    required this.success,
    required this.soldProduct,
    this.message,
  });
}

class CustomerLoanResponse {
  final bool success;
  final List<DailyTransaction> loan;
  final String? message;

  CustomerLoanResponse({
    required this.success,
    required this.loan,
    this.message,
  });
}

class DailySumResponse {
  final bool success;
  final int totalProducts;
  final double totalGram;
  final double totalPurchase;
  final double totalAmount;
  final double remainAmount;
  final double totalDiscount;
  final List<SaleReportProduct> products;
  final String? message;

  DailySumResponse({
    required this.success,
    required this.totalProducts,
    required this.totalGram,
    required this.totalPurchase,
    required this.totalAmount,
    required this.remainAmount,
    required this.totalDiscount,
    required this.products,
    this.message,
  });

  factory DailySumResponse.fromJson(Map<String, dynamic> json) {
    final list = (json['products'] as List<dynamic>?) ?? [];
    return DailySumResponse(
      success: json['success'] as bool? ?? false,
      totalProducts: (json['totalProducts'] as num?)?.toInt() ?? 0,
      totalGram: (json['totalGram'] as num?)?.toDouble() ?? 0,
      totalPurchase: (json['totalPurchase'] as num?)?.toDouble() ?? 0,
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0,
      remainAmount: (json['remainAmount'] as num?)?.toDouble() ?? 0,
      totalDiscount: (json['totalDiscount'] as num?)?.toDouble() ?? 0,
      products: list.map((e) => SaleReportProduct.fromJson(e as Map<String, dynamic>)).toList(),
      message: json['message'] as String?,
    );
  }
}
