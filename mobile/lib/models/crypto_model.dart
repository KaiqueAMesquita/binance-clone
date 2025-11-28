class CryptoModel {
  final String name;
  final String symbol;
  final String price;
  final String change;

  CryptoModel({
    required this.name,
    required this.symbol,
    required this.price,
    required this.change,
  });

  // Ajuda a verificar se a variação é positiva ou negativa
  bool get isPositive => change.contains('+');
}