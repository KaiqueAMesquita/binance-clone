# CurrencyAPI

Fornece cotações de mercado, pares e dados de ticker.

1. Identificação
- Nome: CurrencyAPI
- Responsabilidade: Expor preços, pares disponíveis e (opcionalmente) livro de ofertas e histórico.

2. Stack e dependências
- Linguagem: C# (.NET 8)
- Armazenamento: SQLite / cache em memória
- Mensageria: RabbitMQ (eventos de atualização de preço)
- Consumo: Pode consumir feeds externos (simulado em dev)

3. Instruções de execução local
- Restaurar e executar:
  dotnet restore
  dotnet run
- Via Docker:
  docker build -t currencyapi .
  docker run -p 8083:8083 currencyapi

4. Endpoints principais
- GET /ticker/{pair} — Retorna último preço, variação e volume
- GET /pairs — Lista de pares suportados
- GET /orderbook/{pair} — Livro de ofertas (profundidade)

5. Exemplos de Requisição/Resposta

GET /ticker/BTC-BRL

Response:
{
  "pair": "BTC-BRL",
  "price": 150000.00,
  "change24h": -2.5,
  "volume24h": 12.34
}

6. Integrações com outros serviços
- Consumido por BrokerAPI e GatewayAPI para exibir preços.
- Publica price.update no RabbitMQ quando feeds externos atualizam os preços.

7. Observações / Known Issues
- Em dev, preços podem ser simulados.
- Para produção, integrar com provedores de mercado e adicionar mecanismos de fallback.