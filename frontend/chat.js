// Frontend isolado do chatbot: a chave da API vive EXCLUSIVAMENTE no backend.
const apiUrl = 'http://localhost:3000/chat';
const historyKey = 'gemini-chatbot-demo-history';
const form = document.querySelector('#chat-form');
const input = document.querySelector('#message');
const messages = document.querySelector('#messages');
const send = document.querySelector('#send');

function addMessage(role, text) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${role}`;
  bubble.textContent = text; // textContent impede a execução de HTML vindo do modelo
  messages.append(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

let history = [];
try { history = JSON.parse(localStorage.getItem(historyKey)) || []; } catch { history = []; }
if (Array.isArray(history)) {
  history.slice(-20).forEach(({ role, text }) => {
    if (['user', 'bot'].includes(role) && typeof text === 'string') addMessage(role, text);
  });
} else { history = []; }

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addMessage('user', text);
  history.push({ role: 'user', text });
  input.value = '';
  input.disabled = send.disabled = true;
  const typing = addMessage('bot', 'A escrever…');
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.reply || 'O servidor devolveu um erro.');
    const reply = data.reply || 'Não consegui gerar uma resposta.';
    typing.textContent = reply;
    history.push({ role: 'bot', text: reply });
  } catch (error) {
    typing.textContent = `Erro: ${error.message}. Confirma se o backend está ativo.`;
  } finally {
    history = history.slice(-20);
    localStorage.setItem(historyKey, JSON.stringify(history));
    input.disabled = send.disabled = false;
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }
});
