import '../models/crypto_model.dart';

class CryptoService {
  // Simula uma busca na API
  Future<List<CryptoModel>> getCryptos() async {
    // Simulando delay da internet
    await Future.delayed(Duration(milliseconds: 800));

    return [
      CryptoModel(name: "Bitcoin", symbol: "BTC", price: "R\$ 350.000,00", change: "+2.5%"),
      CryptoModel(name: "Ethereum", symbol: "ETH", price: "R\$ 18.000,00", change: "-1.2%"),
      CryptoModel(name: "Solana", symbol: "SOL", price: "R\$ 500,00", change: "+5.8%"),
      CryptoModel(name: "Cardano", symbol: "ADA", price: "R\$ 2,50", change: "+0.5%"),
      CryptoModel(name: "XRP", symbol: "XRP", price: "R\$ 3,20", change: "-0.8%"),
    ];
  }
}