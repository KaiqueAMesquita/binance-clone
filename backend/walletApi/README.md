# WalletAPI

Gerencia carteiras, saldos e transações de usuários.

1. Identificação
- Nome: WalletAPI
- Responsabilidade: Criação de carteiras, depósitos/retiradas, consulta de saldo e histórico de transações.

2. Stack e dependências
- Linguagem: C# (.NET 8)
- Banco: SQLite (local / dev)
- Mensageria: RabbitMQ (eventos de transação)
- Autenticação: JWT (validação via Gateway/UserAPI)

3. Instruções de execução local
- Restaurar e executar:
  dotnet restore
  dotnet run
- Via Docker:
  docker build -t walletapi .
  docker run -p 8081:8081 walletapi

4. Endpoints principais
- POST /wallet/create — Criar carteira para usuário
- GET /wallet/{userId} — Obter carteiras/saldos do usuário
- POST /wallet/{id}/deposit — Registrar depósito
- POST /wallet/{id}/withdraw — Registrar retirada
- GET /wallet/{id}/transactions — Histórico de transações

5. Exemplos de Requisição/Resposta

POST /wallet/{id}/deposit
{
  "amount": 100.00,
  "currency": "BRL",
  "reference": "dep-2025-0001"
}

Response:
{
  "walletId": 1,
  "balance": 1100.00
}

6. Integrações com outros serviços
- Inscreve-se em user.auth.success para criar carteira padrão na primeira autenticação.
- Publica wallet.transaction.created no RabbitMQ para que BrokerAPI / Gateway processem reservas e notificações.

7. Observações / Known Issues
- Reserva de fundos e garantia de atomicidade com BrokerAPI precisa de coordenação (sagas/transactions).
- Uso de SQLite é para desenvolvimento; planejar migração em produção.