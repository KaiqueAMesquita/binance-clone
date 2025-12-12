import 'package:flutter/material.dart';
import '../models/crypto_model.dart';
import 'trade_screen.dart';

class CurrencyDetailScreen extends StatelessWidget {
  final CryptoModel crypto;

  const CurrencyDetailScreen({Key? key, required this.crypto}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    bool isPositive = crypto.change24h >= 0;

    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        title: Text(crypto.name, style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.black,
        iconTheme: IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            icon: Icon(Icons.star_border),
            onPressed: () {},
          )
        ],
      ),
      body: Column(
        children: [
          // 1. Cabeçalho de Preço
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: Colors.yellow[700],
                  child: Text(crypto.symbol[0], style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.black)),
                ),
                SizedBox(height: 16),
                Text(
                  "R\$ ${crypto.price.toStringAsFixed(2)}",
                  style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 8),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isPositive ? Colors.green.withOpacity(0.2) : Colors.red.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    "${isPositive ? '+' : ''}${crypto.change24h.toStringAsFixed(2)}%",
                    style: TextStyle(
                      color: isPositive ? Colors.greenAccent : Colors.redAccent,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // 2. Gráfico Simulado (Visual apenas)
          Expanded(
            child: Container(
              width: double.infinity,
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: CustomPaint(
                painter: ChartPainter(isPositive: isPositive),
              ),
            ),
          ),

          // 3. Informações Extras
          Container(
            padding: EdgeInsets.all(20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStat("Máxima 24h", "R\$ ${(crypto.price * 1.05).toStringAsFixed(2)}"),
                _buildStat("Mínima 24h", "R\$ ${(crypto.price * 0.95).toStringAsFixed(2)}"),
                _buildStat("Vol (24h)", "1.2B"),
              ],
            ),
          ),

          // 4. Botões de Ação
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _goToTrade(context, "Vender"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.redAccent,
                      padding: EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: Text("Vender", style: TextStyle(color: Colors.white, fontSize: 18)),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _goToTrade(context, "Comprar"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      padding: EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: Text("Comprar", style: TextStyle(color: Colors.white, fontSize: 18)),
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(label, style: TextStyle(color: Colors.grey, fontSize: 12)),
        SizedBox(height: 4),
        Text(value, style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ],
    );
  }

  void _goToTrade(BuildContext context, String operation) {
    // Passamos a operação para a tela de Trade (futuramente podemos passar o objeto crypto também)
    Navigator.push(context, MaterialPageRoute(builder: (context) => TradeScreen()));
  }
}

// Pintor simples para desenhar uma linha de gráfico mockada
class ChartPainter extends CustomPainter {
  final bool isPositive;
  ChartPainter({required this.isPositive});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = isPositive ? Colors.greenAccent : Colors.redAccent
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final path = Path();
    // Desenha uma onda aleatória simulando preço
    path.moveTo(0, size.height * 0.8);
    path.quadraticBezierTo(size.width * 0.25, size.height * 0.9, size.width * 0.5, size.height * 0.5);
    path.quadraticBezierTo(size.width * 0.75, size.height * 0.1, size.width, size.height * 0.2);

    canvas.drawPath(path, paint);
    
    // Adiciona um gradiente abaixo da linha
    final fillPath = Path.from(path);
    fillPath.lineTo(size.width, size.height);
    fillPath.lineTo(0, size.height);
    fillPath.close();

    final gradientPaint = Paint()
      ..shader = LinearGradient(
        colors: [
          (isPositive ? Colors.greenAccent : Colors.redAccent).withOpacity(0.3),
          Colors.transparent
        ],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..style = PaintingStyle.fill;

    canvas.drawPath(fillPath, gradientPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}