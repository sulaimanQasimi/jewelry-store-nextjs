class PurchaseItem {
  final int id;
  final int purchaseId;
  final int productMasterId;
  final String name;
  final String type;
  final double gram;
  final double karat;
  final int quantity;
  final int registeredQty;
  final int remainingQty;
  final double price;
  final bool isCompleted;

  PurchaseItem({
    required this.id,
    required this.purchaseId,
    required this.productMasterId,
    required this.name,
    required this.type,
    required this.gram,
    required this.karat,
    required this.quantity,
    this.registeredQty = 0,
    required this.remainingQty,
    required this.price,
    this.isCompleted = false,
  });

  factory PurchaseItem.fromJson(Map<String, dynamic> json) {
    return PurchaseItem(
      id: (json['id'] as num?)?.toInt() ?? 0,
      purchaseId: (json['purchaseId'] as num?)?.toInt() ?? 0,
      productMasterId: (json['productMasterId'] as num?)?.toInt() ?? 0,
      name: json['name'] as String? ?? '',
      type: json['type'] as String? ?? '',
      gram: (json['gram'] as num?)?.toDouble() ?? 0,
      karat: (json['karat'] as num?)?.toDouble() ?? 0,
      quantity: (json['quantity'] as num?)?.toInt() ?? 0,
      registeredQty: (json['registeredQty'] as num?)?.toInt() ?? 0,
      remainingQty: (json['remainingQty'] as num?)?.toInt() ?? 0,
      price: (json['price'] as num?)?.toDouble() ?? 0,
      isCompleted: json['isCompleted'] == true || json['isCompleted'] == 1,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'purchaseId': purchaseId,
        'productMasterId': productMasterId,
        'name': name,
        'type': type,
        'gram': gram,
        'karat': karat,
        'quantity': quantity,
        'registeredQty': registeredQty,
        'remainingQty': remainingQty,
        'price': price,
        'isCompleted': isCompleted,
      };
}
