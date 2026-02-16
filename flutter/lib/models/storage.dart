class Storage {
  final int id;
  final String date;
  final double usd;
  final double afn;
  final String? createdAt;
  final String? updatedAt;

  Storage({
    required this.id,
    required this.date,
    required this.usd,
    required this.afn,
    this.createdAt,
    this.updatedAt,
  });

  factory Storage.fromJson(Map<String, dynamic> json) {
    return Storage(
      id: (json['id'] as num?)?.toInt() ?? 0,
      date: json['date'] as String? ?? '',
      usd: (json['usd'] as num?)?.toDouble() ?? 0,
      afn: (json['afn'] as num?)?.toDouble() ?? 0,
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'date': date,
        'usd': usd,
        'afn': afn,
        'createdAt': createdAt,
        'updatedAt': updatedAt,
      };
}
