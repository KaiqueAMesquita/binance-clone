from core.models import nlp, sentiment_pipeline, tfidf_vectorizer
import random

# Intent dataset adapted for Binance
INTENTS = {
    "intencoes": [
        {
            "tag": "saudacao",
            "padroes": ["olá", "oi", "e aí", "bom dia", "boa tarde"],
            "respostas": [
                "Olá! Bem-vindo à Binance. Como posso ajudar hoje?",
                "Oi — eu sou o assistente da Binance. Em que posso ajudar?",
                "Olá! Posso ajudar com seu saldo, depósitos ou transações na Binance."
            ]
        },
        {
            "tag": "despedida",
            "padroes": ["tchau", "até mais", "nos vemos", "falou", "adeus"],
            "respostas": [
                "Até mais! Volte sempre à Binance.",
                "Tchau — se precisar, eu estou por aqui na Binance.",
                "Nos vemos em breve! Boa sorte nos trades."
            ]
        },
        {
            "tag": "solicitar_info",
            "padroes": ["conselhos financeiros", "aprender sobre finanças", "ajuda financeira"],
            "respostas": [
                "Posso explicar conceitos de cripto e investimentos na Binance. O que você quer aprender primeiro?",
                "Claro — quer começar por segurança, taxas ou como comprar sua primeira cripto?"
            ]
        },
        {
            "tag": "positivo",
            "padroes": ["obrigado", "muito obrigado", "ajudou muito", "valeu"],
            "respostas": [
                "Fico feliz em ajudar — conte comigo para dúvidas sobre a Binance.",
                "Que bom que ajudou! Se quiser, posso detalhar mais passos.",
                "Obrigado pelo feedback — estou à disposição." 
            ]
        },
        {
            "tag": "negativo",
            "padroes": ["não ajudou", "não foi útil", "confuso", "não era isso"],
            "respostas": [
                "Sinto muito. Pode me dizer o que faltou para eu melhorar a resposta sobre a Binance?",
                "Entendo. Quer que eu tente explicar de outra forma ou trazer links de ajuda da Binance?"
            ]
        },
        {
            "tag": "neutro",
            "padroes": ["ok", "entendi", "interessante", "vou avaliar"],
            "respostas": [
                "Entendi. Posso detalhar mais sobre o assunto na Binance se quiser.",
                "Certo — quando quiser, pergunte algo mais específico sobre sua conta ou transações."
            ]
        },
        {
            "tag": "simulacoes_credito",
            "padroes": ["simular empréstimo", "simulação de crédito", "valor das parcelas"],
            "respostas": [
                "A Binance não oferece empréstimos diretamente via este assistente, mas posso indicar como verificar produtos de crédito na plataforma.",
                "Quer que eu explique onde encontrar ferramentas de crédito na Binance?"
            ]
        },
        {
            "tag": "renegociacao_dividas",
            "padroes": ["renegociar dívida", "renegociar débito", "ajuda com dívida"],
            "respostas": [
                "Para renegociação você deve contatar o suporte da Binance — quer que eu abra a página de suporte?",
                "Posso fornecer o link para suporte e instruções sobre documentos que costumam ser solicitados."
            ]
        },
        {
            "tag": "suporte_transacoes",
            "padroes": ["transferência não concluída", "problema na transação", "pagamento não caiu"],
            "respostas": [
                "Verifique o histórico de transações na sua carteira Binance — quer que eu explique o passo a passo?",
                "Pode ser um atraso na blockchain ou na rede; deseja que eu mostre como checar o status?"
            ]
        }
    ]
}

def analyze_text(text: str):
    doc = nlp(text)

    tokens = [token.text for token in doc]
    lemmas = [token.lemma_ for token in doc]
    pos_tags = [(token.text, token.pos_) for token in doc]
    dependencies = [(token.text, token.dep_, token.head.text) for token in doc]

    entities = [(ent.text, ent.label_) for ent in doc.ents]
    noun_chunks = [chunk.text for chunk in doc.noun_chunks]

    tfidf_vectorizer.fit([text])
    tfidf_features = tfidf_vectorizer.transform([text]).toarray().tolist()

    sentiment = sentiment_pipeline(text)[0]

    # simple rule-based reply generation (fallback when no conversational model is used)
    def _gen_reply(text, sentiment, entities, noun_chunks):
        t = text.lower()
        if 'saldo' in t or 'balance' in t:
            return "Não tenho acesso à sua conta aqui. Para ver seu saldo, abra a página Wallet no app. Deseja que eu explique como fazer um depósito?"
        if 'transa' in t or 'transação' in t or 'transacao' in t or 'transaction' in t:
            return "Posso listar suas transações se você estiver logado. Quer ver as transações recentes ou filtrar por data?"
        if 'deposit' in t or 'depósito' in t or 'deposito' in t:
            return "Para depositar, use a página de depósito e envie o comprovante. Posso orientar passo a passo se quiser."
        # fallback: if a question, summarise sentiment and entities
        if '?' in text:
            s_label = sentiment.get('label') if isinstance(sentiment, dict) else str(sentiment)
            ents = ', '.join([e[0] for e in entities]) if entities else ''
            return f"Parece uma pergunta. Sentimento: {s_label}. Entidades identificadas: {ents}"
        # generic acknowledgement
        return "Entendi. Posso ajudar com seu saldo, transações ou depósitos — pergunte algo específico."

    reply = _gen_reply(text, sentiment, entities, noun_chunks)
    # simple intent matcher: check patterns in INTENTS
    def _match_intent(text_lower: str):
        for intent in INTENTS.get('intencoes', []):
            for p in intent.get('padroes', []):
                if p.lower() in text_lower:
                    return intent
        return None

    matched = _match_intent(text.lower())
    if matched:
        resp = random.choice(matched.get('respostas', []))
        # ensure we adapt small placeholders if needed
        reply = resp

    return {
        "tokens": tokens,
        "lemmas": lemmas,
        "pos_tags": pos_tags,
        "dependencies": dependencies,
        "tfidf_features": tfidf_features,
        "sentiment": sentiment,
        "syntax_analysis": {
            "entities": entities,
            "noun_chunks": noun_chunks
        },
        "knowledge_discovery": {
            "named_entities": entities,
            "noun_chunks": noun_chunks
        },
        "reply": reply
    }
    