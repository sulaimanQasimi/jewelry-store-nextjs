import 'purchase_item.dart';

class Purchase {
  final int id;
  final int supplierId;
  final String supplierName;
  final double? totalAmount;
  final String? date;
  final int bellNumber;
  final String currency;
  final double paidAmount;
  final String? createdAt;
  final String? updatedAt;
  final List<PurchaseItem>? items;

  Purchase({
    required this.id,
    required this.supplierId,
    required this.supplierName,
    this.totalAmount,
    this.date,
    required this.bellNumber,
    required this.currency,
    required this.paidAmount,
    this.createdAt,
    this.updatedAt,
    this.items,
  });

  factory Purchase.fromJson(Map<String, dynamic> json) {
    List<PurchaseItem>? items;
    final itemsList = json['items'] as List<dynamic>?;
    if (itemsList != null && itemsList.isNotEmpty) {
      items = itemsList
          .map((e) => PurchaseItem.fromJson(e as Map<String, dynamic>))
          .toList();
    }
    return Purchase(
      id: (json['id'] as num?)?.toInt() ?? 0,
      supplierId: (json['supplierId'] as num?)?.toInt() ?? 0,
      supplierName: json['supplierName'] as String? ?? '',
      totalAmount: (json['totalAmount'] as num?)?.toDouble(),
      date: json['date']?.toString(),
      bellNumber: (json['bellNumber'] as num?)?.toInt() ?? 0,
      currency: json['currency'] as String? ?? '',
      paidAmount: (json['paidAmount'] as num?)?.toDouble() ?? 0,
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
      items: items,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'supplierId': supplierId,
        'supplierName': supplierName,
        'totalAmount': totalAmount,
        'date': date,
        'bellNumber': bellNumber,
        'currency': currency,
        'paidAmount': paidAmount,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}
