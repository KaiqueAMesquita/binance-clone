import 'package:flutter/material.dart';
import '../models/asset_model.dart'; // Importar Model
import '../services/wallet_service.dart'; // Importar Service
import 'trade_screen.dart';

class WalletScreen extends StatefulWidget {
  @override
  _WalletScreenState createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  final WalletService _walletService = WalletService();
  
  // Variáveis para armazenar os dados que virão do serviço
  double _balance = 0.0;
  List<AssetModel> _assets = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  // Função que carrega os dados
  Future<void> _loadData() async {
    final balance = await _walletService.getBalance();
    final assets = await _walletService.getAssets();

    if (mounted) {
      setState(() {
        _balance = balance;
        _assets = assets;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        title: Text("Minha Carteira", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.black,
        automaticallyImplyLeading: false,
      ),
      body: _isLoading 
        ? Center(child: CircularProgressIndicator(color: Colors.yellow))
        : Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Card de Saldo
                Container(
                  width: double.infinity,
                  padding: EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.yellow[800]!, Colors.yellow[600]!],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(15),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Saldo Total Estimado", style: TextStyle(color: Colors.black87, fontSize: 14)),
                      SizedBox(height: 8),
                      Text(
                        "R\$ ${_balance.toStringAsFixed(2)}", 
                        style: TextStyle(color: Colors.black, fontSize: 28, fontWeight: FontWeight.bold)
                      ),
                      SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildActionButton(context, Icons.arrow_downward, "Depositar", null),
                          _buildActionButton(context, Icons.arrow_upward, "Sacar", null),
                          _buildActionButton(context, Icons.swap_horiz, "Converter", () {
                            Navigator.push(context, MaterialPageRoute(builder: (context) => TradeScreen()));
                          }),
                        ],
                      )
                    ],
                  ),
                ),
                SizedBox(height: 30),
                Text("Meus Ativos", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                SizedBox(height: 10),
                
                // Lista de Ativos vinda do Service
                Expanded(
                  child: ListView.builder(
                    itemCount: _assets.length,
                    itemBuilder: (context, index) {
                      final asset = _assets[index];
                      return _buildAssetItem(asset);
                    },
                  ),
                )
              ],
            ),
          ),
    );
  }

  Widget _buildActionButton(BuildContext context, IconData icon, String label, VoidCallback? onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(10),
            decoration: BoxDecoration(color: Colors.black26, borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: Colors.black),
          ),
          SizedBox(height: 5),
          Text(label, style: TextStyle(color: Colors.black, fontSize: 12, fontWeight: FontWeight.bold))
        ],
      ),
    );
  }

  Widget _buildAssetItem(AssetModel asset) {
    return Container(
      margin: EdgeInsets.only(bottom: 10),
      padding: EdgeInsets.all(15),
      decoration: BoxDecoration(color: Colors.grey[850], borderRadius: BorderRadius.circular(10)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(asset.name, style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text("R\$ ${asset.valueBrl.toStringAsFixed(2)}", style: TextStyle(color: Colors.white)),
              Text("${asset.amount} ${asset.symbol}", style: TextStyle(color: Colors.grey, fontSize: 12)),
            ],
          )
        ],
      ),
    );
  }
}