# Binance-Clone — Visão Geral do Sistema

Resumo
------
Este repositório contém uma aplicação de demonstração inspirada em uma exchange (tipo "Binance") dividida em microserviços .NET. O objetivo é demonstrar conceitos de arquitetura distribuída, autenticação com JWT, gestão de usuários e carteiras, book de ordens simples e uma interface de chatbot para interação do usuário.

Arquitetura
----------
- Microserviços (cada serviço em pasta própria dentro de /backend):
  - userApi — gerenciamento de usuários e autenticação (JWT).
  - walletApi — carteiras, saldos e transações do usuário.
  - brokerApi — ordens, order book e execução simplificada de trades.
  - currencyApi — dados de preço / ticker (simulado em dev).
  - gatewayApi — gateway/proxy que unifica rotas e valida tokens.
  - Chatbot_Web-main — interface / serviço de chatbot.
- Comunicação HTTP entre serviços via gateway (sem mensageria nesta versão).
- Banco local/dev: SQLite (cada serviço usa arquivo de banco local para desenvolvimento).

Serviços e responsabilidades
----------------------------
- userApi
  - CRUD de usuários
  - Autenticação e emissão de JWT
- walletApi
  - Criação de carteiras por usuário
  - Depósitos/retiradas e histórico simples
- brokerApi
  - Recebe ordens (market/limit), mantém um order book simplificado e executa trades
- currencyApi
  - Fornece preço/ticker por par (pode ser simulado)
- gatewayApi
  - Roteamento das requisições para os serviços internos e validação de JWT
- Chatbot Web
  - Ponto de interação do usuário (UI/API) para consultas simples (ex.: saldo, histórico)

Pré-requisitos (local)
----------------------
- .NET SDK 8 (dotnet 8.x)
- (Opcional, caso use a interface web) Node.js 18+ e npm/yarn
- SQLite (opcional: o .NET pode criar o arquivo automaticamente)
- Ferramenta HTTP para testes: curl, httpie ou Postman

Versões de tecnologias (recomendadas)
------------------------------------
- dotnet SDK: 8.x
- C# language level: 11 (compatível com .NET 8)
- Node.js (Chatbot web, se aplicável): 18+
- Banco: SQLite (versão de desenvolvimento embutida)
Obs.: Ajuste as versões conforme o ambiente do avaliador.

Como executar o projeto completo (local)
----------------------------------------
1. Abra um terminal para cada serviço (ou use tmux / múltiplos terminais).
2. No diretório de cada serviço execute:
   - dotnet restore
   - dotnet run
3. Ordem sugerida de inicialização:
   1. userApi       (porta sugerida: 8080)
   2. walletApi     (porta sugerida: 8081)
   3. currencyApi   (porta sugerida: 8083)
   4. brokerApi     (porta sugerida: 8082)
   5. gatewayApi    (porta sugerida: 8084)
   6. Chatbot Web   (se for Node/.NET, seguir instruções na pasta Chatbot_Web-main)
4. Observação sobre portas
   - As portas acima são sugestões; verifique as configurações de cada projeto (appsettings / launchSettings) antes de executar.
5. Variáveis de ambiente importantes (exemplos)
   - JWT_SECRET (segredo para assinatura de tokens)
   - ConnectionStrings: caminhos para os arquivos SQLite (ex.: Data Source=./user.db)
   - Ajuste conforme appsettings.{Environment}.json de cada projeto.

Fluxos principais de uso (exemplos)
----------------------------------
Abaixo há uma sequência simplificada de chamadas HTTP para testar um fluxo típico: Login → Depósito → Trade → Chatbot.

1) Registrar usuário
- Endpoint (userApi):
  POST http://localhost:8080/user/register
  Payload:
  {
    "name": "Avaliador",
    "email": "avaliador@example.com",
    "password": "Senha123!",
    "phone": "",
    "address": ""
  }
- Response: objeto de usuário (sem token)

2) Login (obter JWT)
- Endpoint (userApi):
  POST http://localhost:8080/user/login
  Payload:
  {
    "email": "avaliador@example.com",
    "password": "Senha123!"
  }
- Response exemplo:
  {
    "token": "<JWT_TOKEN>",
    "expiresIn": 3600
  }

Guarde <JWT_TOKEN> para chamadas autenticadas.

3) Criar carteira / depositar saldo (walletApi)
- Endpoint (walletApi):
  POST http://localhost:8081/wallet/create
  Header: Authorization: Bearer <JWT_TOKEN>
  Payload (exemplo):
  {
    "userId": 1,
    "currency": "BRL"
  }
- Depositar:
  POST http://localhost:8081/wallet/{walletId}/deposit
  Header: Authorization: Bearer <JWT_TOKEN>
  Payload:
  {
    "amount": 1000.00,
    "currency": "BRL",
    "reference": "deposit-001"
  }

Verifique saldo:
  GET http://localhost:8081/wallet/{userId}
  Header: Authorization: Bearer <JWT_TOKEN>

4) Criar ordem de compra (brokerApi)
- Exemplo: comprar BTC por BRL
  POST http://localhost:8082/orders
  Header: Authorization: Bearer <JWT_TOKEN>
  Payload:
  {
    "userId": 1,
    "pair": "BTC-BRL",
    "type": "limit",
    "side": "buy",
    "price": 150000.00,
    "amount": 0.001
  }
- Response: orderId e status (ex.: open/executed)

5) Verificar execução e atualizações de saldo
- Consultar ordens:
  GET http://localhost:8082/orders/{orderId}
- Consultar wallet para ver saldo atualizado:
  GET http://localhost:8081/wallet/{userId}

6) Chatbot (consulta via Gateway ou diretamente)
- Exemplo via Gateway:
  POST http://localhost:8084/api/chat/message
  Header: Authorization: Bearer <JWT_TOKEN>
  Payload:
  {
    "userId": 1,
    "message": "Qual meu saldo?"
  }
- Response: texto de resposta do bot (p.ex.: resumo de saldo)

Instruções para o avaliador
---------------------------
1. Pré-configuração
   - Instalar .NET 8 SDK.
   - (Opcional) Instalar Node.js se quiser iniciar a interface do chatbot.
2. Iniciar serviços
   - Abrir terminais separados e executar os dotnet run de cada serviço conforme a ordem sugerida.
3. Testes básicos
   - Registrar usuário, efetuar login, criar carteira, depositar, criar ordem e consultar resultados.
   - Use o Gateway (se ativo) para validar roteamento e autenticação aplicada.
4. O que avaliar
   - Autenticação JWT funcionando (token retornado e válido nas rotas protegidas).
   - Persistência local (arquivos SQLite são atualizados).
   - Fluxo end-to-end: depósito reduz o saldo disponível apropriadamente quando ordens são executadas.
   - Chatbot responde conforme eventos/consultas (dependendo da implementação).
5. Logs e troubleshooting
   - Verificar logs no terminal de cada serviço.
   - Verificar appsettings.json / variáveis de ambiente para configurar JWT_SECRET e paths do DB.

Integrantes do grupo e responsabilidades
---------------------------------------
- Davi Ryan Konuma Lima — Frontend
- Lucas Feitosa Almeida Rocha — Backend
- Matheus Henrique Schopp Peixoto — Mobile
- Luiz Filipe de Camargo — Documentação
- Kaique Alves Mesquita — Frontend / Backend


Ambiente de testes e notas finais
---------------------------------
- Os serviços foram projetados para rodar localmente sem dependências externas (mensageria/queue). Cada serviço utiliza SQLite para persistência leve.
- Esta versão é uma prova de conceito — o motor de matching e a garantia transacional são simplificados e não indicados para produção.
- Recomendação para o avaliador: testar os fluxos na sequência indicada e inspecionar os bancos SQLite gerados para validar persistência.

Arquivo de referência
--------------------
Estrutura principal do diretório /backend:
- backend/
  - userApi/
  - walletApi/
  - brokerApi/
  - currencyApi/
  - gatewayApi/
  - Chatbot_Web-main/

Contato / Atualizações
---------------------
- Para correções ou adições na documentação, abra uma issue no repositório descrevendo o ponto a ser melhorado.
- Atualize versões e variáveis sensíveis (ex.: chaves JWT) antes de publicar em ambientes compartilhados.
