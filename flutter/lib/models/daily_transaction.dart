class DailyTransaction {
  final String id;
  final String? customerName;
  final String? customerPhone;
  final double discount;
  final double totalAmount;
  final double paidAmount;
  final double remainingAmount;
  final String? bellNumber;
  final String? date;
  final List<DailyProduct> products;

  DailyTransaction({
    required this.id,
    this.customerName,
    this.customerPhone,
    required this.discount,
    required this.totalAmount,
    required this.paidAmount,
    required this.remainingAmount,
    this.bellNumber,
    this.date,
    required this.products,
  });

  factory DailyTransaction.fromJson(Map<String, dynamic> json) {
    final productList = json['product'] as List<dynamic>? ?? [];
    return DailyTransaction(
      id: json['_id']?.toString() ?? '',
      customerName: json['customerName'] as String?,
      customerPhone: json['customerPhone'] as String?,
      discount: (json['discount'] as num?)?.toDouble() ?? 0,
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? 0,
      paidAmount: (json['paidAmount'] as num?)?.toDouble() ?? 0,
      remainingAmount: (json['remainingAmount'] as num?)?.toDouble() ?? 0,
      bellNumber: json['bellNumber'] as String?,
      date: json['date'] as String?,
      products: productList
          .map((e) => DailyProduct.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class DailyProduct {
  final String? productId;
  final String? name;
  final double? purchase;
  final dynamic sold;
  final String? barcode;
  final double? gram;
  final double? karat;

  DailyProduct({
    this.productId,
    this.name,
    this.purchase,
    this.sold,
    this.barcode,
    this.gram,
    this.karat,
  });

  factory DailyProduct.fromJson(Map<String, dynamic> json) {
    return DailyProduct(
      productId: json['productId']?.toString(),
      name: json['name'] as String?,
      purchase: (json['purchase'] as num?)?.toDouble(),
      sold: json['sold'],
      barcode: json['barcode'] as String?,
      gram: (json['gram'] as num?)?.toDouble(),
      karat: (json['karat'] as num?)?.toDouble(),
    );
  }
}
