class Expense {
  final int id;
  final String type;
  final String detail;
  final double price;
  final String currency;
  final String date;

  Expense({
    required this.id,
    required this.type,
    required this.detail,
    required this.price,
    required this.currency,
    required this.date,
  });

  factory Expense.fromJson(Map<String, dynamic> json) {
    return Expense(
      id: (json['id'] as num?)?.toInt() ?? 0,
      type: json['type'] as String? ?? '',
      detail: json['detail'] as String? ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0,
      currency: json['currency'] as String? ?? '',
      date: json['date']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'detail': detail,
        'price': price,
        'currency': currency,
        'date': date,
      };
}
