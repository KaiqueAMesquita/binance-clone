import 'dart:convert';
import '../config/api_config.dart';
import '../models/asset_model.dart'; // Certifique-se de que este import existe
import 'api_client.dart';
import 'auth_service.dart';

class WalletService {
  final ApiClient _client = ApiClient();
  final AuthService _authService = AuthService();

  // Busca todas as carteiras do usuário e converte para Ativos
  Future<List<AssetModel>> getPortfolio() async {
    try {
      // 1. Pega o ID do usuário (Mock ou Real)
      final userId = await _authService.getCurrentUserId() ?? 1;
      
      print("Buscando portfólio para User ID: $userId");

      // 2. Chama a API: GET /api/wallet/user/{id}
      // O Backend retorna uma lista: [{ "currency": "BTC", "balance": 0.5, ... }, ...]
      final response = await _client.get(ApiConfig.walletByUser(userId));
      
      if (response is List) {
        return response.map<AssetModel>((item) {
          final currency = item['currency'] ?? 'UNK';
          final balance = (item['balance'] as num).toDouble();
          
          // --- PREÇOS FIXOS PARA TESTE (SIMPLES) ---
          // Futuramente isso virá da CurrencyApi
          double price = 1.0; 
          String name = currency;

          if (currency == 'BTC') { price = 550000.0; name = "Bitcoin"; }
          else if (currency == 'ETH') { price = 18000.0; name = "Ethereum"; }
          else if (currency == 'USDT') { price = 5.0; name = "Tether"; }
          else if (currency == 'BRL') { price = 1.0; name = "Real Brasileiro"; }

          return AssetModel(
            name: name,
            symbol: currency,
            amount: balance,
            valueBrl: balance * price, // Valor total em Reais
          );
        }).toList();
      }
      
      return [];
    } catch (e) {
      print("Erro ao buscar portfólio: $e");
      return [];
    }
  }
}