class Trade {
  final int id;
  final int traderId;
  final String traderName;
  final double amount;
  final String type;
  final String? detail;
  final String currency;
  final String? createdAt;
  final String? updatedAt;

  Trade({
    required this.id,
    required this.traderId,
    required this.traderName,
    required this.amount,
    required this.type,
    this.detail,
    required this.currency,
    this.createdAt,
    this.updatedAt,
  });

  factory Trade.fromJson(Map<String, dynamic> json) {
    return Trade(
      id: (json['id'] as num?)?.toInt() ?? 0,
      traderId: (json['traderId'] as num?)?.toInt() ?? 0,
      traderName: json['traderName'] as String? ?? json['tradername'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
      type: json['type'] as String? ?? '',
      detail: json['detail'] as String?,
      currency: json['currency'] as String? ?? '',
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'traderId': traderId,
        'traderName': traderName,
        'amount': amount,
        'type': type,
        'detail': detail,
        'currency': currency,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}
