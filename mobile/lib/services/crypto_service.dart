import 'dart:convert'; // Importante para jsonEncode no print
import '../config/api_config.dart';
import '../models/crypto_model.dart';
import 'api_client.dart';

class CryptoService {
  final ApiClient _client = ApiClient();

  Future<List<CryptoModel>> getAllCryptos() async {
    try {
      print("Chamando API: ${ApiConfig.currencies}"); // Debug URL

      final response = await _client.get(ApiConfig.currencies);

      print("Resposta Bruta da API: $response"); // Debug Resposta

      if (response == null) {
        print("API retornou nulo.");
        return [];
      }

      if (response is List) {
        if (response.isEmpty) {
          print("A lista da API veio vazia []");
        }
        return response.map((item) => CryptoModel.fromJson(item)).toList();
      } else {
        print("Formato inesperado: Não é uma lista.");
        return [];
      }
    } catch (e) {
      print("ERRO no CryptoService: $e");
      // Fallback para teste se der erro de conexão
      return [
        CryptoModel(id: 99, name: "Erro de Conexão", symbol: "ERR", price: 0, change24h: 0)
      ];
    }
  }
}