import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/app_provider.dart';
import '../models/product.dart';

class ProductsScreen extends StatefulWidget {
  const ProductsScreen({super.key});

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  List<Product> _products = [];
  int _total = 0;
  int _page = 1;
  final int _limit = 10;
  bool _loading = true;
  String? _error;
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _load({bool reset = false}) async {
    if (reset) _page = 1;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final auth = context.read<AuthProvider>();
      final res = await AppProvider.productApi(auth).getList(
        page: _page,
        limit: _limit,
        search: _searchController.text.trim().isEmpty ? null : _searchController.text.trim(),
      );
      if (res.success) {
        setState(() {
          _products = reset ? res.data : [..._products, ...res.data];
          _total = res.total;
          _loading = false;
        });
      } else {
        setState(() {
          _error = 'خطا در بارگذاری';
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

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('محصولات'),
          backgroundColor: Colors.amber.shade700,
          foregroundColor: Colors.white,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  labelText: 'جستجو',
                  border: const OutlineInputBorder(),
                  suffixIcon: IconButton(
                    icon: const Icon(Icons.search),
                    onPressed: () => _load(reset: true),
                  ),
                ),
                onSubmitted: (_) => _load(reset: true),
              ),
            ),
            Expanded(
              child: _loading && _products.isEmpty
                  ? const Center(child: CircularProgressIndicator())
                  : _error != null && _products.isEmpty
                      ? Center(child: Text(_error!))
                      : RefreshIndicator(
                          onRefresh: () => _load(reset: true),
                          child: ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: _products.length + (_hasMore ? 1 : 0),
                            itemBuilder: (context, i) {
                              if (i == _products.length) {
                                _load();
                                return const Padding(
                                  padding: EdgeInsets.all(16),
                                  child: Center(child: CircularProgressIndicator()),
                                );
                              }
                              final p = _products[i];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 8),
                                child: ListTile(
                                  title: Text(p.productName ?? '-'),
                                  subtitle: Text(
                                    '${p.gram ?? 0} گرم | ${p.karat ?? 0} عیار | ${p.purchasePriceToAfn ?? 0} افغانی',
                                  ),
                                  trailing: p.isSold == 1
                                      ? const Chip(label: Text('فروخته شده'), backgroundColor: Colors.green)
                                      : const Chip(label: Text('موجود'), backgroundColor: Colors.blue),
                                ),
                              );
                            },
                          ),
                        ),
            ),
          ],
        ),
      ),
    );
  }

  bool get _hasMore => _products.length < _total;
}
