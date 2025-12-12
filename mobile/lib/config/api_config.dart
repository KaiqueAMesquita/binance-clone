class ApiConfig {
  // Endereço base para o emulador Android (10.0.2.2 equivale ao localhost do PC)
  static const String _baseUrl = "http://10.0.2.2";

  // Portas dos Microsserviços (baseado nos arquivos launchSettings.json do backend)
  static const String userApi = "$_baseUrl:5294/api";
  static const String walletApi = "$_baseUrl:5026/api";
  static const String currencyApi = "$_baseUrl:5237/api";

  // Endpoints específicos (espelhando a estrutura do frontend API.ts)
  static const String login = "$userApi/auth/login";
  static const String register = "$userApi/user";
  static const String userProfile = "$userApi/auth/profile"; // Rota protegida de teste
  
  static String walletByUser(int userId) => "$walletApi/wallet/user/$userId";
  static const String currencies = "$currencyApi/currency";
}