class Product {
  final int id;
  final String? productName;
  final String? type;
  final String? barcode;
  final double? gram;
  final double? karat;
  final double? purchasePriceToAfn;
  final int? bellNumber;
  final int? isSold;
  final String? image;
  final double? wage;
  final double? auns;
  final bool isFragment;
  final String? createdAt;
  final String? updatedAt;

  Product({
    required this.id,
    this.productName,
    this.type,
    this.barcode,
    this.gram,
    this.karat,
    this.purchasePriceToAfn,
    this.bellNumber,
    this.isSold,
    this.image,
    this.wage,
    this.auns,
    this.isFragment = false,
    this.createdAt,
    this.updatedAt,
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
      bellNumber: (json['bellNumber'] as num?)?.toInt(),
      isSold: (json['isSold'] as num?)?.toInt(),
      image: json['image'] as String?,
      wage: (json['wage'] as num?)?.toDouble(),
      auns: (json['auns'] as num?)?.toDouble(),
      isFragment: json['isFragment'] == true || json['isFragment'] == 1,
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'productName': productName,
        'type': type,
        'barcode': barcode,
        'gram': gram,
        'karat': karat,
        'purchasePriceToAfn': purchasePriceToAfn,
        'bellNumber': bellNumber,
        'isSold': isSold,
        'image': image,
        'wage': wage,
        'auns': auns,
        'isFragment': isFragment,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}
