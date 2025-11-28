import 'package:flutter/material.dart';
import '../models/crypto_model.dart'; // Import Model
import '../services/crypto_service.dart'; // Import Service
import 'currency_detail_screen.dart';

class CryptoScreen extends StatefulWidget {
  @override
  _CryptoScreenState createState() => _CryptoScreenState();
}

class _CryptoScreenState extends State<CryptoScreen> {
  final CryptoService _cryptoService = CryptoService();
  late Future<List<CryptoModel>> _cryptoFuture;

  @override
  void initState() {
    super.initState();
    _cryptoFuture = _cryptoService.getCryptos(); // Inicia o carregamento
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        title: Text("Mercado", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.black,
        automaticallyImplyLeading: false,
      ),
      body: FutureBuilder<List<CryptoModel>>(
        future: _cryptoFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator(color: Colors.yellow));
          } else if (snapshot.hasError) {
            return Center(child: Text("Erro ao carregar dados", style: TextStyle(color: Colors.white)));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text("Nenhuma moeda encontrada", style: TextStyle(color: Colors.white)));
          }

          final cryptos = snapshot.data!;

          return ListView.builder(
            itemCount: cryptos.length,
            itemBuilder: (context, index) {
              final crypto = cryptos[index];
              
              return Card(
                color: Colors.grey[850],
                margin: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                child: ListTile(
                  onTap: () {
                    // Passamos o objeto CryptoModel completo agora
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CurrencyDetailScreen(coin: crypto),
                      ),
                    );
                  },
                  leading: CircleAvatar(
                    backgroundColor: Colors.yellow[700],
                    child: Text(crypto.symbol[0], style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                  ),
                  title: Text(crypto.name, style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  subtitle: Text(crypto.symbol, style: TextStyle(color: Colors.grey)),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(crypto.price, style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      Text(
                        crypto.change,
                        style: TextStyle(
                          color: crypto.isPositive ? Colors.greenAccent : Colors.redAccent,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}