class Person {
  final int id;
  final String name;
  final String phone;

  Person({
    required this.id,
    required this.name,
    required this.phone,
  });

  factory Person.fromJson(Map<String, dynamic> json) {
    return Person(
      id: (json['id'] as num?)?.toInt() ?? 0,
      name: json['name'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'phone': phone,
      };
}
