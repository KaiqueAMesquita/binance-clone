import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  // Singleton para usar a mesma instância em todo o app
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();

  // Método auxiliar para obter os headers com o Token
  Future<Map<String, String>> _getHeaders() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');

    final headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };

    if (token != null) {
      headers["Authorization"] = "Bearer $token";
    }

    return headers;
  }

  // GET genérico
  Future<dynamic> get(String url) async {
    final headers = await _getHeaders();
    try {
      final response = await http.get(Uri.parse(url), headers: headers);
      return _handleResponse(response);
    } catch (e) {
      throw Exception("Erro de conexão: $e");
    }
  }

  // POST genérico
  Future<dynamic> post(String url, Map<String, dynamic> body) async {
    final headers = await _getHeaders();
    try {
      final response = await http.post(
        Uri.parse(url),
        headers: headers,
        body: jsonEncode(body),
      );
      return _handleResponse(response);
    } catch (e) {
      throw Exception("Erro de conexão: $e");
    }
  }

  // Tratamento de resposta padrão
  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      // Se não tiver corpo (ex: 204 No Content), retorna null ou map vazio
      if (response.body.isEmpty) return null;
      return jsonDecode(response.body);
    } else {
      // Lança erro caso o backend retorne 400, 401, 500, etc.
      throw Exception('Erro ${response.statusCode}: ${response.body}');
    }
  }
}