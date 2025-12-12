# BrokerAPI

Gerencia ordens, livro de ofertas (order book) e execução de trades.

1. Identificação
- Nome: BrokerAPI
- Responsabilidade: Receber ordens (market/limit), casar ordens, emitir trades e atualizar saldos via eventos.

2. Stack e dependências
- Linguagem: C# (.NET 8)
- Armazenamento: SQLite / in-memory (dev)
- Mensageria: RabbitMQ (ordens, trades, reservas)
- Autenticação: JWT (via Gateway)

3. Instruções de execução local
- Restaurar e executar:
  dotnet restore
  dotnet run
- Via Docker:
  docker build -t brokerapi .
  docker run -p 8082:8082 brokerapi

4. Endpoints principais
- POST /orders — Criar nova ordem (market/limit)
- GET /orders/{id} — Detalhe de ordem
- GET /orderbook/{pair} — Livro de ofertas para par (ex: BTC-BRL)
- POST /orders/{id}/cancel — Cancelar ordem

5. Exemplos de Requisição/Resposta

POST /orders
{
  "userId": 1,
  "pair": "BTC-BRL",
  "type": "limit",
  "side": "buy",
  "price": 150000.00,
  "amount": 0.001
}

Response:
{
  "orderId": 123,
  "status": "open"
}

6. Integrações com outros serviços
- Consulta price/market data na CurrencyAPI.
- Solicita reserva de fundos via WalletAPI (por eventos) antes de aceitar ordens de compra.
- Publica trade.executed no RabbitMQ para atualização de carteira e histórico.

7. Observações / Known Issues
- Matching engine é simples (para ambiente de demonstração). Não otimizado para alta carga.
- Garantir consistência entre reservas em WalletAPI e execução de ordens (possível necessidade de saga).