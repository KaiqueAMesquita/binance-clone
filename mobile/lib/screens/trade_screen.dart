import 'package:flutter/material.dart';

class TradeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      appBar: AppBar(
        title: Text("Converter", style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.black,
        iconTheme: IconThemeData(color: Colors.white),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildCurrencyInput("De", "BTC", "0.5"),
            SizedBox(height: 20),
            Icon(Icons.arrow_downward, color: Colors.yellow[700], size: 30),
            SizedBox(height: 20),
            _buildCurrencyInput("Para", "USDT", "18,450.00"),
            SizedBox(height: 40),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(backgroundColor: Colors.yellow[700]),
                child: Text("Confirmar Conversão", style: TextStyle(color: Colors.black, fontSize: 18)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrencyInput(String label, String asset, String value) {
    return Container(
      padding: EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.grey[850],
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: TextStyle(color: Colors.grey)),
          SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(value, style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(color: Colors.black, borderRadius: BorderRadius.circular(20)),
                child: Row(
                  children: [
                    Text(asset, style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    Icon(Icons.keyboard_arrow_down, color: Colors.white, size: 16)
                  ],
                ),
              )
            ],
          )
        ],
      ),
    );
  }
}
