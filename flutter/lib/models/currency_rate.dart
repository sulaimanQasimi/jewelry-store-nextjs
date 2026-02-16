class CurrencyRate {
  final int id;
  final String date;
  final double usdToAfn;
  final String? createdAt;
  final String? updatedAt;

  CurrencyRate({
    required this.id,
    required this.date,
    required this.usdToAfn,
    this.createdAt,
    this.updatedAt,
  });

  factory CurrencyRate.fromJson(Map<String, dynamic> json) {
    return CurrencyRate(
      id: (json['id'] as num?)?.toInt() ?? 0,
      date: json['date'] as String? ?? '',
      usdToAfn: (json['usdToAfn'] as num?)?.toDouble() ?? 0,
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'date': date,
        'usdToAfn': usdToAfn,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}
