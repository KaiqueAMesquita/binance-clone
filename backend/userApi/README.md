# UserAPI

Gerencia usuários, registro e autenticação via JWT.

1. Identificação
- Nome: UserAPI
- Responsabilidade: CRUD de usuários, autenticação (login/logout) e validação de credenciais.

2. Stack e dependências
- Linguagem: C# (.NET 8)
- Banco: SQLite (local / dev)
- Mensageria: RabbitMQ (eventos de autenticação)
- Autenticação: JWT (Microsoft.AspNetCore.Authentication.JwtBearer)
- Hash de senha: BCrypt.Net

3. Instruções de execução local
- Restaurar e executar:
  dotnet restore
  dotnet run
- Via Docker:
  docker build -t userapi .
  docker run -p 8080:8080 userapi

4. Endpoints principais
- POST /user/register — Criação de novo usuário
- POST /user/login — Retorna JWT
- GET /user/profile — Perfil do usuário autenticado
- GET /user/{id} — Recuperar usuário por id
- GET /user — Lista de usuários
- PUT /user/{id} — Atualizar usuário
- DELETE /user/{id} — Remover usuário

5. Exemplos de Requisição/Resposta

POST /user/login
{
  "email": "teste@example.com",
  "password": "123456"
}

Response:
{
  "token": "eyJh...abc",
  "expiresIn": 3600
}

6. Integrações com outros serviços
- Publica evento user.auth.success no RabbitMQ (quando login bem-sucedido).
- Consumido por: WalletAPI (criação/verificação de carteira inicial), Chatbot (conversas/contexto).

7. Observações / Known Issues
- Senhas são armazenadas com BCrypt.
- Atualmente utiliza SQLite para desenvolvimento; trocar para RDBMS em produção.
- Endpoints e payloads podem estar em evolução — documentar mudanças ao expandir.