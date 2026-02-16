import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';

import '../providers/auth_provider.dart';
import '../providers/app_provider.dart';
import '../models/dashboard_stats.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  DashboardStats? _stats;
  List<DayData> _last7Days = [];
  List<SalesByType> _salesByType = [];
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
      final res = await AppProvider.dashboardApi(auth).getStats();
      if (res.success && res.stats != null) {
        setState(() {
          _stats = res.stats;
          _last7Days = res.last7Days;
          _salesByType = res.salesByType;
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

  String _fmt(int n) => n.toString().replaceAllMapped(
        RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
        (m) => '${m[1]},',
      );

  @override
  Widget build(BuildContext context) {
    return Directionality(
      textDirection: TextDirection.rtl,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('داشبورد'),
          backgroundColor: Colors.amber.shade700,
          foregroundColor: Colors.white,
          actions: [
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: () async {
                await context.read<AuthProvider>().logout();
                if (mounted) {
                  Navigator.of(context).pushReplacementNamed('/login');
                }
              },
            ),
          ],
        ),
        body: _loading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(child: Text(_error!))
                : RefreshIndicator(
                    onRefresh: _load,
                    child: ListView(
                      padding: const EdgeInsets.all(16),
                      children: [
                        _buildStatCards(),
                        const SizedBox(height: 24),
                        if (_last7Days.isNotEmpty) _buildChart(),
                        const SizedBox(height: 24),
                        if (_salesByType.isNotEmpty) _buildPieChart(),
                        const SizedBox(height: 24),
                        _buildNavLinks(),
                      ],
                    ),
                  ),
      ),
    );
  }

  Widget _buildStatCards() {
    if (_stats == null) return const SizedBox.shrink();
    final s = _stats!;
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 1.4,
      children: [
        _statCard('فروش امروز', _fmt(s.todaySales), Icons.trending_up, Colors.green),
        _statCard('باقی‌مانده امروز', _fmt(s.todayRemaining), Icons.account_balance_wallet, Colors.orange),
        _statCard('محصولات موجود', _fmt(s.productsAvailable), Icons.inventory_2, Colors.blue),
        _statCard('محصولات فروخته شده', _fmt(s.productsSold), Icons.sell, Colors.purple),
      ],
    );
  }

  Widget _statCard(String label, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            Text(label, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
          ],
        ),
      ),
    );
  }

  Widget _buildChart() {
    final spots = _last7Days.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value.total.toDouble())).toList();
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('فروش ۷ روز گذشته', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: const FlGridData(show: true),
                  titlesData: FlTitlesData(
                    leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 32)),
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (v, meta) {
                          final i = v.toInt();
                          if (i < 0 || i >= _last7Days.length) return const SizedBox.shrink();
                          return Text(
                            _last7Days[i].date.length >= 5 ? _last7Days[i].date.substring(5) : _last7Days[i].date,
                            style: const TextStyle(fontSize: 10),
                          );
                        },
                      ),
                    ),
                    topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  ),
                  borderData: FlBorderData(show: true),
                  lineBarsData: [
                    LineChartBarData(
                      spots: spots,
                      isCurved: true,
                      color: Colors.amber.shade700,
                      barWidth: 2,
                      dotData: const FlDotData(show: true),
                      belowBarData: BarAreaData(show: true, color: Colors.amber.withOpacity(0.2)),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPieChart() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('فروش بر اساس نوع', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 16),
            SizedBox(
              height: 200,
              child: PieChart(
                PieChartData(
                  sections: _salesByType.asMap().entries.map((e) {
                    final colors = [
                      Colors.amber,
                      Colors.blue,
                      Colors.green,
                      Colors.purple,
                      Colors.orange,
                      Colors.pink,
                    ];
                    return PieChartSectionData(
                      value: e.value.value.toDouble(),
                      title: e.value.label,
                      color: colors[e.key % colors.length],
                      radius: 60,
                    );
                  }).toList(),
                  sectionsSpace: 2,
                  centerSpaceRadius: 0,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavLinks() {
    return Column(
      children: [
        ListTile(
          leading: const Icon(Icons.inventory),
          title: const Text('محصولات'),
          onTap: () => Navigator.pushNamed(context, '/products'),
        ),
        ListTile(
          leading: const Icon(Icons.receipt_long),
          title: const Text('گزارش روزانه'),
          onTap: () => Navigator.pushNamed(context, '/daily-report'),
        ),
      ],
    );
  }
}
