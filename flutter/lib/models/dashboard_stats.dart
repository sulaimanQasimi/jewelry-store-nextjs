class DashboardStats {
  final int productsTotal;
  final int productsSold;
  final int productsAvailable;
  final int customersCount;
  final int suppliersCount;
  final int transactionsCount;
  final int purchasesCount;
  final double expensesTotal;
  final int loanReportsCount;
  final double loanReportsTotal;
  final int todaySales;
  final int todayPaid;
  final int todayRemaining;
  final int todayTransactions;

  DashboardStats({
    required this.productsTotal,
    required this.productsSold,
    required this.productsAvailable,
    required this.customersCount,
    required this.suppliersCount,
    required this.transactionsCount,
    required this.purchasesCount,
    required this.expensesTotal,
    required this.loanReportsCount,
    required this.loanReportsTotal,
    required this.todaySales,
    required this.todayPaid,
    required this.todayRemaining,
    required this.todayTransactions,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      productsTotal: (json['productsTotal'] as num?)?.toInt() ?? 0,
      productsSold: (json['productsSold'] as num?)?.toInt() ?? 0,
      productsAvailable: (json['productsAvailable'] as num?)?.toInt() ?? 0,
      customersCount: (json['customersCount'] as num?)?.toInt() ?? 0,
      suppliersCount: (json['suppliersCount'] as num?)?.toInt() ?? 0,
      transactionsCount: (json['transactionsCount'] as num?)?.toInt() ?? 0,
      purchasesCount: (json['purchasesCount'] as num?)?.toInt() ?? 0,
      expensesTotal: (json['expensesTotal'] as num?)?.toDouble() ?? 0,
      loanReportsCount: (json['loanReportsCount'] as num?)?.toInt() ?? 0,
      loanReportsTotal: (json['loanReportsTotal'] as num?)?.toDouble() ?? 0,
      todaySales: (json['todaySales'] as num?)?.toInt() ?? 0,
      todayPaid: (json['todayPaid'] as num?)?.toInt() ?? 0,
      todayRemaining: (json['todayRemaining'] as num?)?.toInt() ?? 0,
      todayTransactions: (json['todayTransactions'] as num?)?.toInt() ?? 0,
    );
  }
}

class DayData {
  final String date;
  final int total;
  final int count;

  DayData({required this.date, required this.total, required this.count});

  factory DayData.fromJson(Map<String, dynamic> json) {
    return DayData(
      date: json['date'] as String? ?? '',
      total: (json['total'] as num?)?.toInt() ?? 0,
      count: (json['count'] as num?)?.toInt() ?? 0,
    );
  }
}

class SalesByType {
  final String label;
  final int value;

  SalesByType({required this.label, required this.value});

  factory SalesByType.fromJson(Map<String, dynamic> json) {
    return SalesByType(
      label: json['label'] as String? ?? '',
      value: (json['value'] as num?)?.toInt() ?? 0,
    );
  }
}
