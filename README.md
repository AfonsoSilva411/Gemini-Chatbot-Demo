# Gemini Nutrition Chatbot

An AI-powered nutrition chatbot built with **Google Gemini**, **Node.js**, and **Express**. It answers general questions about nutrition, balanced eating, fitness-related dietary topics, and healthy habits through a simple web interface.

This project demonstrates how to integrate a large language model (LLM) into a web application while keeping API credentials on the server.

## Features

- **AI-generated responses:** uses the Gemini 2.5 Flash model through Google's Generative AI SDK.
- **Nutrition-focused conversations:** provides general information about food, nutrition, and fitness-related topics.
- **Custom system instructions:** guides response style and keeps the assistant focused on its intended subject.
- **Basic input validation and topic filtering:** checks messages before making API requests.
- **Simple chat interface:** responsive frontend built with HTML, CSS, and vanilla JavaScript.
- **Server-side API integration:** the Gemini API key is never sent to the browser.
- **Basic API protections:** CORS, Helmet, and request rate limiting.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| AI model | Google Gemini 2.5 Flash (`@google/genai`) |
| API protection | Helmet, CORS, express-rate-limit |

## Project Structure

```text
backend/
  server.js
  package.json
  .env.example
frontend/
  index.html
  style.css
  chat.js
.gitignore
README.md
```

## Getting Started

**Requirements:** Node.js 20+, Python (to serve the frontend), and a Gemini API key.

1. Clone the repository:

   ```bash
   git clone https://github.com/AfonsoSilva411/Gemini-Chatbot-Demo.git
   cd Gemini-Chatbot-Demo
   ```

2. Install the backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Copy `.env.example` to a new file named `.env` and set your Gemini API key:

   ```env
   GEMINI_API_KEY=your_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
   PORT=3000
   ```

4. Start the backend:

   ```bash
   npm run dev
   ```

5. In a second terminal, from the repository root, start the frontend:

   ```bash
   cd frontend
   python -m http.server 5500
   ```

6. Open **http://localhost:5500** in your browser.

## How It Works

1. A user submits a question through the chat interface.
2. The frontend sends the message to `POST /chat` on the Express backend.
3. The backend validates the message and checks whether it matches the supported topics.
4. For supported topics, the backend calls Gemini using predefined system instructions.
5. The generated response is returned to the browser and displayed in the chat.

The frontend stores recent displayed messages in the browser's local storage. This history is **not** sent to Gemini as conversation context.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Check whether the backend is running |
| `POST` | `/chat` | Send a message and receive a chatbot response |

Example request:

```json
{
  "message": "Quantas calorias tem uma banana?"
}
```

The chatbot is configured to respond in European Portuguese.

## Security and Limitations

- Keep your Gemini API key in `backend/.env`, which is excluded from Git by `.gitignore`.
- Topic filtering is a basic application feature, not a complete guardrail against off-topic responses.
- The chatbot provides general educational information, **not medical diagnoses or personalized dietary prescriptions**.
- Running the app with your own API key may consume your Gemini API quota.

## Project Focus

**LLM integration · REST API development · Prompt engineering · Web development**
