import '../models/asset_model.dart';

class WalletService {
  Future<double> getBalance() async {
    await Future.delayed(Duration(milliseconds: 500));
    return 12450.00;
  }

  Future<List<AssetModel>> getAssets() async {
    await Future.delayed(Duration(milliseconds: 1000));
    return [
      AssetModel(name: "Bitcoin", symbol: "BTC", amount: 0.045, valueBrl: 10000.00),
      AssetModel(name: "Tether", symbol: "USDT", amount: 450.00, valueBrl: 2450.00),
    ];
  }
}