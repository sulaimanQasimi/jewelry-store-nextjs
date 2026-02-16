class LoanReport {
  final int id;
  final String cName;
  final int cId;
  final double amount;
  final String currency;
  final String detail;
  final String? date;
  final String? createdAt;
  final String? updatedAt;

  LoanReport({
    required this.id,
    required this.cName,
    required this.cId,
    required this.amount,
    required this.currency,
    required this.detail,
    this.date,
    this.createdAt,
    this.updatedAt,
  });

  factory LoanReport.fromJson(Map<String, dynamic> json) {
    return LoanReport(
      id: (json['id'] as num?)?.toInt() ?? 0,
      cName: json['cName'] as String? ?? json['cname'] as String? ?? '',
      cId: (json['cId'] as num?)?.toInt() ?? (json['cid'] as num?)?.toInt() ?? 0,
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
      currency: json['currency'] as String? ?? '',
      detail: json['detail'] as String? ?? '',
      date: json['date']?.toString(),
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'cName': cName,
        'cId': cId,
        'amount': amount,
        'currency': currency,
        'detail': detail,
        'date': date,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}
