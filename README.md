# Chatbot com Gemini — demonstração técnica

Versão autónoma e **anonimizada do módulo de chatbot** desenvolvido para o projeto AC_Fitness. O objetivo deste repositório é documentar a integração de um **LLM (Google Gemini)** num chatbot web, **sem publicar o restante website** nem dados do negócio.

## O que demonstra

- **Google Gemini API** via SDK `@google/genai`, usando `gemini-2.5-flash` por defeito.
- **Backend Node.js + Express**, com endpoint `POST /chat` e verificação `GET /health`.
- **System instruction / prompt engineering**, limitando temas e formato das respostas.
- **Filtro temático básico** por palavras-chave (não é um mecanismo de segurança robusto).
- **CORS**, **Helmet**, limite de mensagens por minuto, validação básica de input e tratamento de erros.
- **Frontend HTML/CSS/JavaScript** com histórico local e chamadas `fetch` à API.
- **Separação frontend/backend**, sem expor a chave Gemini no browser.

## Estrutura

```text
backend/
  server.js
  package.json
  .env.example
frontend/
  index.html
  chat.js
  style.css
.gitignore
README.md
```

## Executar localmente

Requisitos: Node.js 20+ e uma chave da API Gemini válida.

1. No terminal, entra na pasta `backend` e instala as dependências:
   ```bash
   cd backend
   npm install
   ```
2. Copia `.env.example` para `.env` e substitui `GEMINI_API_KEY` por uma **chave tua nova**. Não publiques o ficheiro `.env`.
3. Inicia o backend:
   ```bash
   npm run dev
   ```
4. Noutro terminal, serve o frontend na porta 5500 a partir da pasta `frontend`:
   ```bash
   cd frontend
   python -m http.server 5500
   ```
5. Abre `http://localhost:5500`.

Teste opcional: `http://localhost:3000/health` deve devolver `{ "status": "ok" }`.

## Exemplo do fluxo

1. O utilizador envia uma pergunta no frontend.
2. O frontend faz `POST /chat` com JSON `{ "message": "..." }`.
3. O backend valida o tamanho e o tema, e invoca o Gemini com uma instrução de sistema.
4. A resposta é devolvida em JSON e apresentada no chatbot.

## Segurança e privacidade

- Nunca submeter `.env`, chaves de API, credenciais ou dados de clientes.
- O histórico do frontend é armazenado no `localStorage` do navegador; não introduzas dados pessoais ou de saúde reais nesta demonstração.
- As mensagens submetidas ao chatbot são processadas pela API Gemini.
- Este chatbot é um **protótipo**, não um serviço médico, e o filtro por expressões regulares é facilmente contornável.
- A chave incluída no arquivo original deve ser **revogada/substituída** antes de qualquer publicação deste repositório.

## Âmbito das competências (candidatura)

Este projeto comprova **integração de um LLM via API**, **prompt engineering** e **desenvolvimento de API REST**. **Não comprova, por si só,** RAG, execução local de LLMs, recomendação com LLMs ou GitHub Actions/CI-CD.

## Origem

Extraído e adaptado do módulo de chatbot de AC_Fitness, preservando o funcionamento técnico essencial e omitindo o restante site, contactos e identidade do negócio.
