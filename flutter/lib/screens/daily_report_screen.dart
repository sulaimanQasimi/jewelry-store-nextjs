import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/app_provider.dart';
import '../models/daily_transaction.dart';

class DailyReportScreen extends StatefulWidget {
  const DailyReportScreen({super.key});

  @override
  State<DailyReportScreen> createState() => _DailyReportScreenState();
}

class _DailyReportScreenState extends State<DailyReportScreen> {
  List<DailyTransaction> _transactions = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final auth = context.read<AuthProvider>();
      final res = await AppProvider.transactionApi(auth).getDailyReport();
      if (res.success) {
        setState(() {
          _transactions = res.daily;
          _loading = false;
        });
      } else {
        setState(() {
          _error = res.message ?? 'خطا در بارگذاری';
          _loading = false;
        });
      }
    } catch (_) {
      setState(() {
        _error = 'خطا در اتصال به سرور';
        _loading = false;
      });
    }
  }

  String _fmt(num n) => n.toString().replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
        (m) => '${m[1]},',
      );

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('گزارش روزانه'),
          backgroundColor: Colors.amber.shade700,
          foregroundColor: Colors.white,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: _loading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(child: Text(_error!))
                : RefreshIndicator(
                    onRefresh: _load,
                    child: _transactions.isEmpty
                        ? const Center(child: Text('تراکنشی امروز ثبت نشده'))
                        : ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: _transactions.length,
                            itemBuilder: (context, i) {
                              final t = _transactions[i];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                child: ExpansionTile(
                                  title: Text(t.customerName ?? 'مشتری'),
                                  subtitle: Text(
                                    'مبلغ کل: ${_fmt(t.totalAmount)} | پرداخت: ${_fmt(t.paidAmount)} | باقی: ${_fmt(t.remainingAmount)}',
                                  ),
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          if (t.customerPhone != null)
                                            Text('تلفن: ${t.customerPhone}'),
                                          if (t.bellNumber != null)
                                            Text('شماره بل: ${t.bellNumber}'),
                                          const SizedBox(height: 8),
                                          ...t.products.map((p) => Padding(
                                                padding: const EdgeInsets.only(bottom: 4),
                                                child: Text(
                                                  '${p.name ?? "-"} | ${p.gram ?? 0} گرم | ${p.karat ?? 0} عیار',
                                                ),
                                              )),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),
      ),
    );
  }
}
