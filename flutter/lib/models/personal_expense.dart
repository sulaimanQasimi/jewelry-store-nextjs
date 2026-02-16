class PersonalExpense {
  final int id;
  final String name;
  final int personId;
  final double amount;
  final String currency;
  final String? detail;
  final String? createdAt;
  final String? updatedAt;
  final String? personName;
  final String? personPhone;

  PersonalExpense({
    required this.id,
    required this.name,
    required this.personId,
    required this.amount,
    required this.currency,
    this.detail,
    this.createdAt,
    this.updatedAt,
    this.personName,
    this.personPhone,
  });

  factory PersonalExpense.fromJson(Map<String, dynamic> json) {
    return PersonalExpense(
      id: (json['id'] as num?)?.toInt() ?? 0,
      name: json['name'] as String? ?? '',
      personId: (json['personId'] as num?)?.toInt() ?? 0,
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
      currency: json['currency'] as String? ?? '',
      detail: json['detail'] as String?,
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
      personName: json['personName'] as String? ?? json['personname'] as String?,
      personPhone: json['personPhone'] as String? ?? json['personphone'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'personId': personId,
        'amount': amount,
        'currency': currency,
        'detail': detail,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}
