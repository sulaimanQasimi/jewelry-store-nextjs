class SupplierProduct {
  final int id;
  final int supplierId;
  final String supplierName;
  final String name;
  final String? type;
  final double? karat;
  final double weight;
  final double? registeredWeight;
  final double? remainWeight;
  final double pasa;
  final double pasaReceipt;
  final double pasaRemaining;
  final double? wagePerGram;
  final double totalWage;
  final double wageReceipt;
  final double wageRemaining;
  final int? bellNumber;
  final String? detail;
  final String createdAt;
  final String updatedAt;

  SupplierProduct({
    required this.id,
    required this.supplierId,
    required this.supplierName,
    required this.name,
    this.type,
    this.karat,
    required this.weight,
    this.registeredWeight,
    this.remainWeight,
    required this.pasa,
    required this.pasaReceipt,
    required this.pasaRemaining,
    this.wagePerGram,
    required this.totalWage,
    required this.wageReceipt,
    required this.wageRemaining,
    this.bellNumber,
    this.detail,
    required this.createdAt,
    required this.updatedAt,
  });

  factory SupplierProduct.fromJson(Map<String, dynamic> json) {
    return SupplierProduct(
      id: (json['id'] as num?)?.toInt() ?? 0,
      supplierId: (json['supplierId'] as num?)?.toInt() ?? 0,
      supplierName: json['supplierName'] as String? ?? '',
      name: json['name'] as String? ?? '',
      type: json['type'] as String?,
      karat: (json['karat'] as num?)?.toDouble(),
      weight: (json['weight'] as num?)?.toDouble() ?? 0,
      registeredWeight: (json['registeredWeight'] as num?)?.toDouble(),
      remainWeight: (json['remainWeight'] as num?)?.toDouble(),
      pasa: (json['pasa'] as num?)?.toDouble() ?? 0,
      pasaReceipt: (json['pasaReceipt'] as num?)?.toDouble() ?? 0,
      pasaRemaining: (json['pasaRemaining'] as num?)?.toDouble() ?? 0,
      wagePerGram: (json['wagePerGram'] as num?)?.toDouble(),
      totalWage: (json['totalWage'] as num?)?.toDouble() ?? 0,
      wageReceipt: (json['wageReceipt'] as num?)?.toDouble() ?? 0,
      wageRemaining: (json['wageRemaining'] as num?)?.toDouble() ?? 0,
      bellNumber: (json['bellNumber'] as num?)?.toInt(),
      detail: json['detail'] as String?,
      createdAt: json['createdAt']?.toString() ?? '',
      updatedAt: json['updatedAt']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'supplierId': supplierId,
        'supplierName': supplierName,
        'name': name,
        'type': type,
        'karat': karat,
        'weight': weight,
        'registeredWeight': registeredWeight,
        'remainWeight': remainWeight,
        'pasa': pasa,
        'pasaReceipt': pasaReceipt,
        'pasaRemaining': pasaRemaining,
        'wagePerGram': wagePerGram,
        'totalWage': totalWage,
        'wageReceipt': wageReceipt,
        'wageRemaining': wageRemaining,
        'bellNumber': bellNumber,
        'detail': detail,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}
