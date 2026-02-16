class Trader {
  final int id;
  final String name;
  final String phone;
  final String? address;
  final String? createdAt;
  final String? updatedAt;

  Trader({
    required this.id,
    required this.name,
    required this.phone,
    this.address,
    this.createdAt,
    this.updatedAt,
  });

  factory Trader.fromJson(Map<String, dynamic> json) {
    return Trader(
      id: (json['id'] as num?)?.toInt() ?? 0,
      name: json['name'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      address: json['address'] as String?,
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone': phone,
        'address': address,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}
