/// Aggregated loan summary per customer from loan-list API.
class LoanSummary {
  final int customerId;
  final int transactionId;
  final String customerName;
  final String customerPhone;
  final double totalAmount;
  final double totalLoan;
  final double totalPaid;
  final double totalDiscount;
  final int transactionsCount;

  LoanSummary({
    required this.customerId,
    required this.transactionId,
    required this.customerName,
    required this.customerPhone,
    required this.totalAmount,
    required this.totalLoan,
    required this.totalPaid,
    required this.totalDiscount,
    required this.transactionsCount,
  });

  factory LoanSummary.fromJson(Map<String, dynamic> json) {
    return LoanSummary(
      customerId: (json['customerId'] as num?)?.toInt() ?? 0,
      transactionId: (json['transactionId'] as num?)?.toInt() ?? 0,
      customerName: json['customerName'] as String? ?? '',
      customerPhone: json['customerPhone'] as String? ?? '',
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0,
      totalLoan: (json['totalLoan'] as num?)?.toDouble() ?? 0,
      totalPaid: (json['totalPaid'] as num?)?.toDouble() ?? 0,
      totalDiscount: (json['totalDiscount'] as num?)?.toDouble() ?? 0,
      transactionsCount: (json['transactionsCount'] as num?)?.toInt() ?? 0,
    );
  }
}
