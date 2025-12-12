import 'package:flutter/material.dart';
import '../models/crypto_model.dart';
import '../services/crypto_service.dart';
import 'currency_detail_screen.dart'; // <--- 1. IMPORTANTE: Adicione este import

class CryptoScreen extends StatefulWidget {
  @override
  _CryptoScreenState createState() => _CryptoScreenState();
}

class _CryptoScreenState extends State<CryptoScreen> {
  final CryptoService _cryptoService = CryptoService();
  List<CryptoModel> _cryptos = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCryptos();
  }

  Future<void> _loadCryptos() async {
    final cryptos = await _cryptoService.getAllCryptos();
    if (mounted) {
      setState(() {
        _cryptos = cryptos;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        title: Text("Mercado Cripto", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.black,
        automaticallyImplyLeading: false, 
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: Colors.yellow))
          : RefreshIndicator(
              onRefresh: _loadCryptos,
              color: Colors.yellow,
              child: _cryptos.isEmpty
                  ? _buildEmptyState()
                  : ListView.builder(
                      itemCount: _cryptos.length,
                      itemBuilder: (context, index) {
                        final crypto = _cryptos[index];
                        return _buildCryptoItem(crypto);
                      },
                    ),
            ),
    );
  }

  Widget _buildEmptyState() {
    return ListView(
      children: [
        SizedBox(height: 100),
        Center(
          child: Column(
            children: [
              Icon(Icons.cloud_off, size: 60, color: Colors.grey),
              SizedBox(height: 20),
              Text(
                "Nenhuma moeda encontrada.\nVerifique se a CurrencyApi está rodando.",
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCryptoItem(CryptoModel crypto) {
    // 2. Envolvemos o Container em um GestureDetector para detectar o clique
    return GestureDetector(
      onTap: () {
        // Navega para a tela de detalhes enviando a moeda clicada
        Navigator.push(
          context, 
          MaterialPageRoute(
            builder: (context) => CurrencyDetailScreen(crypto: crypto)
          )
        );
      },
      child: Container(
        margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.grey[850],
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.yellow[700],
                  child: Text(
                    crypto.symbol.isNotEmpty ? crypto.symbol[0] : '?',
                    style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
                  ),
                ),
                SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(crypto.name, style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                    Text(crypto.symbol, style: TextStyle(color: Colors.grey, fontSize: 12)),
                  ],
                ),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  "R\$ ${crypto.price.toStringAsFixed(2)}",
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  "${crypto.change24h >= 0 ? '+' : ''}${crypto.change24h.toStringAsFixed(2)}%", 
                  style: TextStyle(
                    color: crypto.change24h >= 0 ? Colors.greenAccent : Colors.redAccent, 
                    fontSize: 12
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}