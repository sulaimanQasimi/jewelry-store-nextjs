class Customer {
  final int id;
  final String customerName;
  final String phone;
  final String? email;
  final String? address;
  final String? date;
  final String? image;
  final String? secondaryPhone;
  final String? companyName;
  final String? notes;
  final String? birthDate;
  final String? nationalId;
  final String? facebookUrl;
  final String? instagramUrl;
  final String? whatsappUrl;
  final String? telegramUrl;

  Customer({
    required this.id,
    required this.customerName,
    required this.phone,
    this.email,
    this.address,
    this.date,
    this.image,
    this.secondaryPhone,
    this.companyName,
    this.notes,
    this.birthDate,
    this.nationalId,
    this.facebookUrl,
    this.instagramUrl,
    this.whatsappUrl,
    this.telegramUrl,
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: (json['id'] as num?)?.toInt() ?? 0,
      customerName: json['customerName'] as String? ?? json['customername'] as String? ?? '',
      phone: json['phone'] as String? ?? '',
      email: json['email'] as String?,
      address: json['address'] as String?,
      date: json['date']?.toString(),
      image: json['image'] as String?,
      secondaryPhone: json['secondaryPhone'] as String? ?? json['secondaryphone'] as String?,
      companyName: json['companyName'] as String? ?? json['companyname'] as String?,
      notes: json['notes'] as String?,
      birthDate: json['birthDate']?.toString() ?? json['birthdate']?.toString(),
      nationalId: json['nationalId'] as String? ?? json['nationalid'] as String?,
      facebookUrl: json['facebookUrl'] as String? ?? json['facebookurl'] as String?,
      instagramUrl: json['instagramUrl'] as String? ?? json['instagramurl'] as String?,
      whatsappUrl: json['whatsappUrl'] as String? ?? json['whatsappurl'] as String?,
      telegramUrl: json['telegramUrl'] as String? ?? json['telegramurl'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'customerName': customerName,
        'phone': phone,
        'email': email,
        'address': address,
        'date': date,
        'image': image,
        'secondaryPhone': secondaryPhone,
        'companyName': companyName,
        'notes': notes,
        'birthDate': birthDate,
        'nationalId': nationalId,
        'facebookUrl': facebookUrl,
        'instagramUrl': instagramUrl,
        'whatsappUrl': whatsappUrl,
        'telegramUrl': telegramUrl,
      };
}
