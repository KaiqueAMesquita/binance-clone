import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';
import 'crypto_screen.dart';
import 'wallet_screen.dart';
import 'profile_screen.dart'; 

class HomeScreen extends StatefulWidget {
  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  final AuthService _authService = AuthService();

  // Lista das telas que vamos exibir (Mercado, Carteira, Perfil)
  // O "Sair" não precisa de tela aqui, pois é uma ação.
  late final List<Widget> _screens = [
    CryptoScreen(),  // Index 0
    WalletScreen(),  // Index 1
    ProfileScreen(), // Index 2
  ];

  void _logout() {
    _authService.logout();
    // Remove todo o histórico de navegação e volta para o Login
    Navigator.pushAndRemoveUntil(
      context, 
      MaterialPageRoute(builder: (context) => LoginScreen()), 
      (route) => false
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[900],
      
      // Exibe a tela correspondente ao índice atual
      // Se o índice for 3 (Sair), mantemos a tela anterior visualmente até o logout acontecer
      body: _screens[_currentIndex < _screens.length ? _currentIndex : 0], 
      
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.black,
        selectedItemColor: Colors.yellow[700],
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed, // Necessário para mais de 3 itens não ficarem brancos
        currentIndex: _currentIndex,
        onTap: (index) {
          if (index == 3) {
            // Se clicou em "Sair"
            _logout();
          } else {
            // Se clicou em uma das telas
            setState(() {
              _currentIndex = index;
            });
          }
        },
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart), 
            label: "Mercado"
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet), 
            label: "Carteira"
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person), 
            label: "Perfil"
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.exit_to_app, color: Colors.redAccent), 
            label: "Sair"
          ),
        ],
      ),
    );
  }
}