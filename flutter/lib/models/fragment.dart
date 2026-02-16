class Fragment {
  final int id;
  final double gram;
  final double wareHouse;
  final double changedToPasa;
  final double? remain;
  final double amount;
  final String? detail;
  final String? date;
  final bool isCompleted;
  final String? createdAt;
  final String? updatedAt;

  Fragment({
    required this.id,
    required this.gram,
    this.wareHouse = 0,
    this.changedToPasa = 0,
    this.remain,
    required this.amount,
    this.detail,
    this.date,
    this.isCompleted = false,
    this.createdAt,
    this.updatedAt,
  });

  factory Fragment.fromJson(Map<String, dynamic> json) {
    return Fragment(
      id: (json['id'] as num?)?.toInt() ?? 0,
      gram: (json['gram'] as num?)?.toDouble() ?? 0,
      wareHouse: (json['wareHouse'] as num?)?.toDouble() ?? 0,
      changedToPasa: (json['changedToPasa'] as num?)?.toDouble() ?? 0,
      remain: (json['remain'] as num?)?.toDouble(),
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
      detail: json['detail'] as String?,
      date: json['date']?.toString(),
      isCompleted: json['isCompleted'] == true || json['iscompleted'] == true,
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'gram': gram,
        'wareHouse': wareHouse,
        'changedToPasa': changedToPasa,
        'remain': remain,
        'amount': amount,
        'detail': detail,
        'date': date,
        'isCompleted': isCompleted,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}
