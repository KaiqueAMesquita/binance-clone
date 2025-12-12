# GatewayAPI

API Gateway / Proxy que unifica rotas e faz autenticação/autorização.

1. Identificação
- Nome: GatewayAPI
- Responsabilidade: Roteamento de requisições para serviços internos, validação de JWT, CORS, rate limiting básico.

2. Stack e dependências
- Linguagem: C# (.NET 8)
- Autenticação: JWT (integra com UserAPI para validação/refresh)
- Mensageria: RabbitMQ (para roteamento de eventos, opcional)

3. Instruções de execução local
- Restaurar e executar:
  dotnet restore
  dotnet run
- Via Docker:
  docker build -t gatewayapi .
  docker run -p 8084:8084 gatewayapi

4. Endpoints principais
- Proxy padrão: /api/{service}/... (repassa para os serviços internos)
- /health — Health check do gateway
- /metrics — (opcional) métricas básicas

5. Exemplos de Requisição/Resposta
GET /api/user/profile
(Forward para UserAPI com header Authorization: Bearer ...)

6. Integrações com outros serviços
- Roteia chamadas para UserAPI, WalletAPI, BrokerAPI, CurrencyAPI.
- Valida e renova tokens com UserAPI quando necessário.

7. Observações / Known Issues
- Não armazena estado de sessão.
- Em produção, considerar uso de um gateway dedicado (NGINX/Traefik/Kong) com TLS e políticas avançadas.