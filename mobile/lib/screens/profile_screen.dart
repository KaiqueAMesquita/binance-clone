import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';

class ProfileScreen extends StatelessWidget {
  final AuthService _authService = AuthService();

  void _logout(BuildContext context) {
    _authService.logout();
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
      body: SafeArea(
        child: Column(
          children: [
            SizedBox(height: 30),
            CircleAvatar(
              radius: 50,
              backgroundColor: Colors.yellow[700],
              child: Icon(Icons.person, size: 50, color: Colors.black),
            ),
            SizedBox(height: 15),
            Text("Usuário Teste", style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
            Text("usuario@email.com", style: TextStyle(color: Colors.grey)),
            SizedBox(height: 30),
            Divider(color: Colors.grey[800]),
            _buildMenuItem(Icons.edit, "Editar Perfil", () {}),
            _buildMenuItem(Icons.settings, "Configurações", () {}),
            _buildMenuItem(Icons.security, "Segurança", () {}),
            _buildMenuItem(Icons.help, "Ajuda e Suporte", () {}),
            Divider(color: Colors.grey[800]),
            _buildMenuItem(Icons.exit_to_app, "Sair", () => _logout(context), isDestructive: true),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuItem(IconData icon, String text, VoidCallback onTap, {bool isDestructive = false}) {
    return ListTile(
      leading: Icon(icon, color: isDestructive ? Colors.redAccent : Colors.white),
      title: Text(text, style: TextStyle(color: isDestructive ? Colors.redAccent : Colors.white)),
      trailing: Icon(Icons.chevron_right, color: Colors.grey),
      onTap: onTap,
    );
  }
}