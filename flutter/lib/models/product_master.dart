class ProductMaster {
  final int id;
  final String name;
  final String type;
  final double gram;
  final double karat;
  final bool isActive;

  ProductMaster({
    required this.id,
    required this.name,
    required this.type,
    required this.gram,
    required this.karat,
    this.isActive = true,
  });

  factory ProductMaster.fromJson(Map<String, dynamic> json) {
    return ProductMaster(
      id: (json['id'] as num?)?.toInt() ?? 0,
      name: json['name'] as String? ?? '',
      type: json['type'] as String? ?? '',
      gram: (json['gram'] as num?)?.toDouble() ?? 0,
      karat: (json['karat'] as num?)?.toDouble() ?? 0,
      isActive: json['isActive'] == true || json['isactive'] == true,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'type': type,
        'gram': gram,
        'karat': karat,
        'isActive': isActive,
      };
}
