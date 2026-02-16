import 'package:flutter/material.dart';

import 'auth_provider.dart';
import '../services/api/company_api.dart';
import '../services/api/currency_rate_api.dart';
import '../services/api/customer_api.dart';
import '../services/api/dashboard_api.dart';
import '../services/api/expense_api.dart';
import '../services/api/fragment_api.dart';
import '../services/api/loan_report_api.dart';
import '../services/api/personal_expense_api.dart';
import '../services/api/person_api.dart';
import '../services/api/product_api.dart';
import '../services/api/product_master_api.dart';
import '../services/api/purchase_api.dart';
import '../services/api/storage_api.dart';
import '../services/api/supplier_api.dart';
import '../services/api/supplier_product_api.dart';
import '../services/api/trade_api.dart';
import '../services/api/trader_api.dart';
import '../services/api/transaction_api.dart';

/// Provides API instances that depend on AuthProvider's apiClient.
class AppProvider {
  static CompanyApi companyApi(AuthProvider auth) => CompanyApi(auth.apiClient);
  static CurrencyRateApi currencyRateApi(AuthProvider auth) =>
      CurrencyRateApi(auth.apiClient);
  static CustomerApi customerApi(AuthProvider auth) => CustomerApi(auth.apiClient);
  static DashboardApi dashboardApi(AuthProvider auth) =>
      DashboardApi(auth.apiClient);
  static ExpenseApi expenseApi(AuthProvider auth) => ExpenseApi(auth.apiClient);
  static FragmentApi fragmentApi(AuthProvider auth) =>
      FragmentApi(auth.apiClient);
  static LoanReportApi loanReportApi(AuthProvider auth) =>
      LoanReportApi(auth.apiClient);
  static PersonalExpenseApi personalExpenseApi(AuthProvider auth) =>
      PersonalExpenseApi(auth.apiClient);
  static PersonApi personApi(AuthProvider auth) => PersonApi(auth.apiClient);
  static ProductApi productApi(AuthProvider auth) => ProductApi(auth.apiClient);
  static ProductMasterApi productMasterApi(AuthProvider auth) =>
      ProductMasterApi(auth.apiClient);
  static PurchaseApi purchaseApi(AuthProvider auth) =>
      PurchaseApi(auth.apiClient);
  static StorageApi storageApi(AuthProvider auth) => StorageApi(auth.apiClient);
  static SupplierApi supplierApi(AuthProvider auth) =>
      SupplierApi(auth.apiClient);
  static SupplierProductApi supplierProductApi(AuthProvider auth) =>
      SupplierProductApi(auth.apiClient);
  static TradeApi tradeApi(AuthProvider auth) => TradeApi(auth.apiClient);
  static TraderApi traderApi(AuthProvider auth) => TraderApi(auth.apiClient);
  static TransactionApi transactionApi(AuthProvider auth) =>
      TransactionApi(auth.apiClient);
}
