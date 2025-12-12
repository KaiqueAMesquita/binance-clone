import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  // --- MOCK LOGIN (Falso) ---
  // Aceita qualquer email e senha, sem chamar o Backend
  Future<bool> login(String email, String password) async {
    print("MOCK LOGIN: Tentando entrar com $email...");
    
    // Simula uma pequena demora de rede
    await Future.delayed(Duration(seconds: 1));

    if (email.isNotEmpty && password.isNotEmpty) {
      final prefs = await SharedPreferences.getInstance();
      // Salva um token falso apenas para o app saber que está "logado"
      await prefs.setString('jwt_token', 'TOKEN_FALSO_DE_TESTE_123');
      
      // Salva um ID de usuário falso (importante para a Wallet funcionar depois)
      // Vamos fingir que é o usuário de ID 1
      await prefs.setString('user_data', '{"id": 1, "name": "Usuario Teste", "email": "$email"}');
      
      print("MOCK LOGIN: Sucesso!");
      return true; 
    }
    
    return false;
  }

  // Logout
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    await prefs.remove('user_data');
  }

  // Verifica se está logado
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey('jwt_token');
  }

  // Pega o ID do usuário (Simulado)
  Future<int?> getCurrentUserId() async {
    // Retorna sempre 1 para testes, ou busca do shared prefs se preferir
    return 1; 
  }
}