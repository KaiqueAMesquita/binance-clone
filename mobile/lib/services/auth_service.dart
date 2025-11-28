import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  // Login Fake: Aceita qualquer email/senha e deixa entrar
  Future<bool> login(String email, String password) async {
    print("Tentando login (MOCK)...");
    
    // Simula demora da internet (1 segundo)
    await Future.delayed(Duration(seconds: 1));

    if (email.isNotEmpty && password.isNotEmpty) {
      // Salva um token falso para o app lembrar que você está logado
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('jwt_token', 'TOKEN_FALSO_123456');
      return true; // Sucesso!
    }
    
    return false; // Falha se estiver vazio
  }

  // Logout: Apaga o token para sair do app
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
  }

  // Verifica se já está logado ao abrir o app
  Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey('jwt_token');
  }
}