class Company {
  final int id;
  final String companyName;
  final String? slogan;
  final String phone;
  final String? email;
  final String address;
  final String? date;
  final String? image;

  Company({
    required this.id,
    required this.companyName,
    this.slogan,
    required this.phone,
    this.email,
    required this.address,
    this.date,
    this.image,
  });

  factory Company.fromJson(Map<String, dynamic> json) {
    return Company(
      id: (json['id'] as num?)?.toInt() ?? 0,
      companyName: json['companyName'] as String? ?? json['companyname'] as String? ?? '',
      slogan: json['slogan'] as String?,
      phone: json['phone'] as String? ?? '',
      email: json['email'] as String?,
      address: json['address'] as String? ?? '',
      date: json['date']?.toString(),
      image: json['image'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'companyName': companyName,
        'slogan': slogan,
        'phone': phone,
        'email': email,
        'address': address,
        'date': date,
        'image': image,
      };
}
