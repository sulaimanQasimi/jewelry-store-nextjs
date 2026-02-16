class Product {
  final int id;
  final String? productName;
  final String? type;
  final String? barcode;
  final double? gram;
  final double? karat;
  final double? purchasePriceToAfn;
  final int? isSold;
  final String? createdAt;

  Product({
    required this.id,
    this.productName,
    this.type,
    this.barcode,
    this.gram,
    this.karat,
    this.purchasePriceToAfn,
    this.isSold,
    this.createdAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: (json['id'] as num?)?.toInt() ?? 0,
      productName: json['productName'] as String?,
      type: json['type'] as String?,
      barcode: json['barcode'] as String?,
      gram: (json['gram'] as num?)?.toDouble(),
      karat: (json['karat'] as num?)?.toDouble(),
      purchasePriceToAfn: (json['purchasePriceToAfn'] as num?)?.toDouble(),
      isSold: (json['isSold'] as num?)?.toInt(),
      createdAt: json['createdAt'] as String?,
    );
  }
}
