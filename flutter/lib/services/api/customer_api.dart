import '../../models/customer.dart';
import '../api_client.dart';

class CustomerApi {
  final ApiClient _client;

  CustomerApi(this._client);

  Future<CustomerListResponse> getList({
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
      '/api/customer/registered-customers',
      queryParameters: queryParams,
    );

    final data = response.data as Map<String, dynamic>;
    final list = (data['data'] as List<dynamic>?) ?? (data['customers'] as List<dynamic>?) ?? [];
    return CustomerListResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Customer.fromJson(e as Map<String, dynamic>)).toList(),
      total: (data['total'] as num?)?.toInt() ?? 0,
      page: (data['page'] as num?)?.toInt() ?? 1,
      limit: (data['limit'] as num?)?.toInt() ?? 10,
    );
  }

  Future<Customer?> getById(int customerId) async {
    final response = await _client.dio.get('/api/customer/$customerId');
    final data = response.data as Map<String, dynamic>;
    if (data['success'] != true) return null;
    final customer = data['customer'] ?? data;
    return Customer.fromJson(customer as Map<String, dynamic>);
  }

  Future<CustomerSearchResponse> search(String query) async {
    final response = await _client.dio.get(
      '/api/customer/search-customer',
      queryParameters: {'search': query},
    );
    final data = response.data as Map<String, dynamic>;
    final list = (data['customers'] as List<dynamic>?) ?? (data['data'] as List<dynamic>?) ?? [];
    return CustomerSearchResponse(
      success: data['success'] as bool? ?? false,
      data: list.map((e) => Customer.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  Future<CustomerCreateResponse> create(Map<String, dynamic> payload) async {
    final response = await _client.dio.post('/api/customer/new-customer', data: payload);
    return CustomerCreateResponse.fromJson(response.data as Map<String, dynamic>);
  }

  Future<bool> update(int customerId, Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/customer/update-customer/$customerId', data: payload);
    return response.data['success'] == true;
  }

  Future<bool> delete(int customerId) async {
    final response = await _client.dio.delete('/api/customer/delete-customer/$customerId');
    return response.data['success'] == true;
  }
}

class CustomerListResponse {
  final bool success;
  final List<Customer> data;
  final int total;
  final int page;
  final int limit;

  CustomerListResponse({
    required this.success,
    required this.data,
    required this.total,
    required this.page,
    required this.limit,
  });
}

class CustomerSearchResponse {
  final bool success;
  final List<Customer> data;

  CustomerSearchResponse({required this.success, required this.data});
}

class CustomerCreateResponse {
  final bool success;
  final Customer? customer;
  final String? message;

  CustomerCreateResponse({required this.success, this.customer, this.message});

  factory CustomerCreateResponse.fromJson(Map<String, dynamic> json) {
    Customer? customer;
    final c = json['customer'] ?? json['data'];
    if (c != null && c is Map<String, dynamic>) {
      customer = Customer.fromJson(c);
    }
    return CustomerCreateResponse(
      success: json['success'] as bool? ?? false,
      customer: customer,
      message: json['message'] as String?,
    );
  }
}
