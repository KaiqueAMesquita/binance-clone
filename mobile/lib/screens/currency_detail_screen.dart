import 'package:flutter/material.dart';
import '../models/crypto_model.dart'; // <--- 1. Importamos o modelo aqui

class CurrencyDetailScreen extends StatelessWidget {
  final CryptoModel coin; // <--- 2. Mudamos de Map para CryptoModel

  CurrencyDetailScreen({required this.coin});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        // <--- 3. Agora acessamos com PONTO (.) em vez de colchetes ['']
        title: Text(coin.name, style: TextStyle(color: Colors.white)), 
        backgroundColor: Colors.black,
        iconTheme: IconThemeData(color: Colors.white),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Column(
                children: [
                  CircleAvatar(
                    backgroundColor: Colors.yellow[700],
                    radius: 30,
                    // <--- 4. Ponto aqui também
                    child: Text(coin.symbol[0], style: TextStyle(fontSize: 24, color: Colors.black, fontWeight: FontWeight.bold)),
                  ),
                  SizedBox(height: 10),
                  Text(coin.price, style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
                  Text(coin.change, style: TextStyle(color: Colors.greenAccent, fontSize: 18)),
                ],
              ),
            ),
            SizedBox(height: 30),
            Text("Gráfico de Preço (24h)", style: TextStyle(color: Colors.grey)),
            SizedBox(height: 10),
            // Placeholder do Gráfico
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.black26,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.grey[800]!),
              ),
              child: Center(child: Text("Gráfico aqui", style: TextStyle(color: Colors.grey))),
            ),
            SizedBox(height: 20),
            Text("Estatísticas", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            Divider(color: Colors.grey),
            _buildStatRow("Volume (24h)", "R\$ 1.2 B"),
            _buildStatRow("Máxima (24h)", "R\$ 355.000,00"),
            _buildStatRow("Mínima (24h)", "R\$ 342.000,00"),
            Spacer(),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent, padding: EdgeInsets.symmetric(vertical: 15)),
                    child: Text("Vender", style: TextStyle(color: Colors.white)),
                  ),
                ),
                SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.greenAccent, padding: EdgeInsets.symmetric(vertical: 15)),
                    child: Text("Comprar", style: TextStyle(color: Colors.black)),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey)),
          Text(value, style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}