# 🏦 Projeto Corretora de Criptomoedas (Binance Clone)

Projeto Interdisciplinar desenvolvido para o curso de Análise e Desenvolvimento de Sistemas (Fatec Sorocaba / AMS).
O sistema simula uma exchange de criptomoedas com arquitetura de microserviços, permitindo cadastro, trading e interação via Chatbot.

## 👥 Integrantes
* *Davi Ryan Konuma Lima*
* *Kaique Alves Mesquita*
* *Lucas Feitosa Almeida Rocha*
* *Luiz Filipe de Camargo*
* *Matheus Henrique Schopp Peixoto*

---

## 🏗️ Arquitetura e Tecnologias

O sistema opera sobre uma arquitetura de *Microserviços* com banco de dados descentralizado (Database per Service).

* [cite_start]*Frontend:* Next.js + Tailwind CSS.
* [cite_start]*Mobile:* React Native + Expo.
* [cite_start]*Gateway:* .NET 8 (YARP/Ocelot).
* [cite_start]*Backend APIs:* .NET 8 (User, Wallet, Currency).
* [cite_start]*Chatbot:* Python + Flask.
* [cite_start]*Banco de Dados:* SQLite.

### ⚠️ Nota de Mitigação de Riscos (Ausência de RabbitMQ)
Conforme previsto na seção de *Riscos Conhecidos e Mitigação* do documento de requisitos, a implementação de mensageria assíncrona (RabbitMQ) foi substituída neste MVP para priorizar a entrega funcional dentro do prazo.

*Estratégia Adotada:*
1.  *Simulação de Eventos:* Os eventos que seriam publicados na fila (ex: wallet.trade.success) são gerados e registrados via *Logs Estruturados* no console, permitindo a auditoria do fluxo.
2.  *Comunicação Síncrona:* A integração entre Chatbot e Wallet opera via chamadas HTTP diretas para garantir a atualização imediata do saldo durante a demonstração.

---

### Pré-requisitos
* *.NET SDK 8.0* instalado.
* *Node.js (LTS)* instalado.
* *Python 3.9+* instalado.

## ✅ Checklist do MVP

Status de entrega das funcionalidades obrigatórias:

* [ ] *Auth:* Login e Registro com JWT.
* [ ] *Wallet:* Consulta de Saldo.
* [ ] *Wallet:* Depósito Simulado.
* [ ] *Trade:* Compra e Venda de Cripto.
* [ ] *Chatbot:* Comandos de saldo e depósito via texto.
* [ ] *Logs:* Eventos de negócio registrados no console.

---

## 📚 Documentação Técnica
Para diagramas UML, DER e detalhes de implementação, consulte o arquivo PDF na raiz deste repositório:
Documentacao_Tecnica_Projeto_Binance_Clone.pdf
