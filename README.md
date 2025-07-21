# 📄 PDF Q&A Chat Application

A full-stack application that allows users to upload a PDF file and ask questions about its contents through a chat interface.

- ✨ **Text Extraction:** Extracts text content from uploaded PDFs.
- 🧠 **Intelligent Q&A:** Uses Google's Gemini API for embeddings and answer generation.
- 💬 **Conversational Memory:** Maintains context for follow-up questions.
- 🎨 **Interactive UI:** Built with React and Tailwind CSS.

---

## 🚀 Features

- 📁 **PDF Upload** — Upload and parse PDF files.
- 📄 **Text Extraction** — Uses `pdf-parse` to extract content.
- 🧠 **Gemini Integration** — Embeddings via `embedding-001`, generation via `gemini-2.0-flash`.
- 💬 **Contextual Chat** — Maintains conversation history in memory.
- 🎨 **Responsive UI** — Clean React + Tailwind design.

---

## 📦 Prerequisites

Ensure you have the following installed:

- **Node.js** (v18+)
- **npm**
- **Git**
- **Google Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app)

---

## 🛠 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sajjapushyanth/pdfUpload-BE.git
cd pdfUpload-BE
```

---

### 2. Backend Setup

```bash
cd pdfUpload-BE
npm install
```

#### 🔐 Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

Start the server:

```bash
node index.js
```

Server will run at: `http://localhost:5000`

---

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd ../frontend  # adjust if frontend is in a different location
npm install
npm run dev
```

Frontend will open at: `http://localhost:3000`

---

## 💡 Usage

1. **Upload PDF:** Select a file using the upload input.
2. **Ask Question:** Type your first question in the initial input field.
3. **Get Answer:** Click "Upload PDF & Ask" to see the answer.
4. **Continue Chatting:** Use the chat box to ask follow-up questions.

---

## 🧰 Troubleshooting

| Issue | Fix |
|-------|-----|
| ❌ 403 from Gemini | Ensure `GEMINI_API_KEY` is valid and active |
| ❌ Backend not reachable | Check if `http://localhost:5000` is running |
| ❌ API response format error | Check backend `axios.post` payload formatting |
| ❌ PDF parsing failure | Try a simpler PDF (image-based PDFs may not parse well) |

---

## 🧪 Future Enhancements (Optional)

- 💾 Persistent conversation history (e.g., MongoDB, PostgreSQL)
- 👥 Multi-user context handling
- 🔎 Advanced RAG with vector databases (e.g., Pinecone, Weaviate)
- 📡 Streaming AI responses
- 🧯 Granular error handling and cleaner UX
- 🧹 Auto-delete uploaded files after session ends

---


> Built with ❤️ using Node.js, React, Tailwind CSS, and Google's Gemini API.
