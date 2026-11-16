import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = process.env.PORT || 3000;
const fallbackReply = 'Sou um assistente de demonstração. Só respondo a perguntas gerais sobre nutrição e acompanhamento alimentar.';
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5500,http://127.0.0.1:5500')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const topicPattern = /\b(nutri[cç][aã]o|nutricional|consulta|consultas|plano|planos|alimentar|alimentares|acompanhamento|peso|emagrecimento|emagrecer|massa muscular|muscular|hipertrofia|reeduca[cç][aã]o|desportiva|desporto|calorias|dieta|treino|objetivo|objetivos|servi[cç]os?)\b/i;

const systemInstruction = `
És um assistente virtual de demonstração de um serviço fictício de acompanhamento nutricional.
Responde apenas a questões gerais sobre nutrição, alimentação equilibrada,
consultas, planos alimentares e acompanhamento desportivo.

Se receberes perguntas fora destes temas, responde exatamente:
"${fallbackReply}"

Não inventes preços, credenciais profissionais ou dados pessoais.
Não forneças diagnósticos, prescrições ou planos individualizados.
Para aconselhamento clínico, recomenda a consulta de um profissional qualificado.
Responde sempre em português de Portugal, de forma breve e clara.
`;

if (!process.env.GEMINI_API_KEY) {
  console.warn('Aviso: GEMINI_API_KEY não está definida. O endpoint /chat vai devolver erro até configurares a variável.');
}

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json({ limit: '16kb' }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Origem não autorizada por CORS.'));
  }
}));
app.use(rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false
}));

function isAllowedTopic(message) {
  return topicPattern.test(message);
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim();

    if (!message) {
      res.status(400).json({ reply: 'Escreve uma pergunta para eu conseguir ajudar.' });
      return;
    }

    if (message.length > 500) {
      res.status(400).json({ reply: 'A tua mensagem é demasiado longa. Resume a pergunta, por favor.' });
      return;
    }

    if (!isAllowedTopic(message)) {
      res.json({ reply: fallbackReply });
      return;
    }

    if (!ai) {
      res.status(503).json({ reply: 'O assistente ainda não está configurado. Define a GEMINI_API_KEY no ficheiro .env do backend.' });
      return;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.4,
        maxOutputTokens: 350
      }
    });

    const reply = response.text?.trim() || fallbackReply;
    res.json({ reply });
  } catch (error) {
    console.error('Erro no /chat:', error);
    res.status(500).json({
      reply: 'Não consegui responder neste momento. Tenta novamente dentro de instantes.'
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`Chatbot Gemini de demonstração ativo na porta ${port}`);
});
