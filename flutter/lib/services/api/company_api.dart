import '../../models/company.dart';
import '../api_client.dart';

class CompanyApi {
  final ApiClient _client;

  CompanyApi(this._client);

  Future<CompanyResponse> getCompanyData() async {
    final response = await _client.dio.get('/api/company/company-data');
    final data = response.data as Map<String, dynamic>;
    Company? company;
    final companyData = data['companyData'] ?? data['company'];
    if (companyData != null && companyData is Map<String, dynamic>) {
      company = Company.fromJson(companyData);
    }
    return CompanyResponse(
      success: data['success'] as bool? ?? false,
      company: company,
      message: data['message'] as String?,
    );
  }

  Future<bool> update(Map<String, dynamic> payload) async {
    final response = await _client.dio.put('/api/company/edit-company', data: payload);
    return response.data['success'] == true;
  }
}

class CompanyResponse {
  final bool success;
  final Company? company;
  final String? message;

  CompanyResponse({required this.success, this.company, this.message});
}
