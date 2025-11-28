import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';
import 'crypto_screen.dart';
import 'wallet_screen.dart';
import 'profile_screen.dart'; // <--- IMPORTANTE: Adicione este import

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  final AuthService _authService = AuthService();

  // Lista das telas que vamos exibir
  late final List<Widget> _screens = [
    CryptoScreen(), // Index 0: Mercado
    WalletScreen(), // Index 1: Carteira
    ProfileScreen(), // Index 2: Perfil (Agora usamos a tela real)
  ];

  void _logout() {
    _authService.logout();
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (context) => LoginScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      body: _screens[_currentIndex], 
      
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.black,
        selectedItemColor: Colors.yellow[700],
        unselectedItemColor: Colors.grey,
        currentIndex: _currentIndex,
        onTap: (index) {
          if (index == 3) {
            _logout();
          } else {
            setState(() {
              _currentIndex = index;
            });
          }
        },
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.bar_chart), label: "Mercado"),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet), label: "Carteira"),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: "Perfil"),
          BottomNavigationBarItem(icon: Icon(Icons.exit_to_app), label: "Sair"),
        ],
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}