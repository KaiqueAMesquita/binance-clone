class CryptoModel {
  final int id;
  final String name;
  final String symbol;
  final double price;
  final double change24h;

  CryptoModel({
    required this.id,
    required this.name,
    required this.symbol,
    required this.price,
    required this.change24h,
  });

  factory CryptoModel.fromJson(Map<String, dynamic> json) {
    // Tenta ler com minúscula (padrão) ou Maiúscula (padrão C# antigo)
    final idVal = json['id'] ?? json['Id'] ?? 0;
    final nameVal = json['name'] ?? json['Name'] ?? 'Unknown';
    final symbolVal = json['symbol'] ?? json['Symbol'] ?? 'UNK';
    
    // Preço: Se não vier da API, geramos um fake baseado no símbolo para não ficar zerado
    double priceVal = 0.0;
    if (json['price'] != null) priceVal = (json['price'] as num).toDouble();
    else if (json['Price'] != null) priceVal = (json['Price'] as num).toDouble();
    else priceVal = _mockPrice(symbolVal);

    // Variação 24h
    double changeVal = 0.0;
    if (json['change24h'] != null) changeVal = (json['change24h'] as num).toDouble();
    else if (json['Change24h'] != null) changeVal = (json['Change24h'] as num).toDouble();

    return CryptoModel(
      id: idVal,
      name: nameVal,
      symbol: symbolVal,
      price: priceVal,
      change24h: changeVal,
    );
  }

  static double _mockPrice(String? symbol) {
    if (symbol == 'BTC') return 350000.00;
    if (symbol == 'ETH') return 18000.00;
    if (symbol == 'SOL') return 450.00;
    if (symbol == 'USDT') return 5.00;
    return 10.0;
  }
}