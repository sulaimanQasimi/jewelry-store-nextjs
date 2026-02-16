class Supplier {
  final int id;
  final String name;
  final String phone;
  final String? address;
  final bool isActive;

  Supplier({
    required this.id,
    required this.name,
    required this.phone,
    this.address,
    this.isActive = true,
  });

  factory Supplier.fromJson(Map<String, dynamic> json) {
    return Supplier(
      id: (json['id'] as num?)?.toInt() ?? 0,
      name: json['name'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      address: json['address'] as String?,
      isActive: json['isActive'] == true || json['isactive'] == true,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone': phone,
        'address': address,
        'isActive': isActive,
      };
}
