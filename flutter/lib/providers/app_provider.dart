import 'package:flutter/material.dart';

import 'auth_provider.dart';
import '../services/api/dashboard_api.dart';
import '../services/api/product_api.dart';
import '../services/api/transaction_api.dart';

/// Provides API instances that depend on AuthProvider's apiClient.
class AppProvider {
  static DashboardApi dashboardApi(AuthProvider auth) =>
      DashboardApi(auth.apiClient);

  static ProductApi productApi(AuthProvider auth) =>
      ProductApi(auth.apiClient);

  static TransactionApi transactionApi(AuthProvider auth) =>
      TransactionApi(auth.apiClient);
}
