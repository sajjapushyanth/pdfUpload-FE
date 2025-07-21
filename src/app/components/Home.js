import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [initialQuestion, setInitialQuestion] = useState(""); // For the first question with PDF
  const [currentMessage, setCurrentMessage] = useState(""); // For subsequent chat messages
  const [messages, setMessages] = useState([]); // Stores chat history: [{ type: 'user' | 'bot', text: '...' }]
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUploaded, setPdfUploaded] = useState(false); // To track if PDF is uploaded

  const messagesEndRef = useRef(null); // Ref for scrolling to the latest message

  // Scroll to the bottom of the chat whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handlePdfUploadAndInitialQuestion = async () => {
    if (!file) {
      setError("Please select a PDF file to upload.");
      return;
    }
    if (!initialQuestion.trim()) {
      setError("Please enter an initial question.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessages([]); // Clear previous messages for a new session

    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", initialQuestion); // Send the initial question

    try {
      setMessages((prev) => [...prev, { type: 'user', text: initialQuestion }]);
      const response = await axios.post("http://localhost:5000/ask", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessages((prev) => [...prev, { type: 'bot', text: response.data.answer }]);
      setPdfUploaded(true); // Mark PDF as uploaded
      setInitialQuestion(""); // Clear initial question input
    } catch (err) {
      console.error("Error during PDF upload or initial question:", err);
      if (err.response) {
        setError(`Server error: ${err.response.data.error || err.response.statusText}`);
      } else if (err.request) {
        setError("Network error: Could not connect to the backend server. Please ensure it's running.");
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) {
      setError("Please enter a message.");
      return;
    }
    if (!pdfUploaded) {
      setError("Please upload a PDF and ask an initial question first.");
      return;
    }

    setLoading(true);
    setError(null);
    const userMessage = currentMessage;
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setCurrentMessage(""); // Clear current message input immediately

    try {
      // Send only the question for subsequent messages.
      // The backend will need to maintain context.
      const response = await axios.post("http://localhost:5000/ask", { question: userMessage });

      setMessages((prev) => [...prev, { type: 'bot', text: response.data.answer }]);
    } catch (err) {
      console.error("Error during chat message:", err);
      if (err.response) {
        setError(`Server error: ${err.response.data.error || err.response.statusText}`);
      } else if (err.request) {
        setError("Network error: Could not connect to the backend server. Please ensure it's running.");
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
      // Re-add user message if there was an error and it wasn't processed
      setMessages((prev) => [...prev.slice(0, -1), { type: 'user', text: userMessage, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg flex flex-col h-[80vh]">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          PDF Q&A Chat
        </h1>

        {!pdfUploaded && (
          <div className="mb-6 border-b pb-4 border-gray-200">
            <label htmlFor="file-upload" className="block text-gray-700 text-sm font-semibold mb-2">
              Upload PDF File:
            </label>
            <input
              id="file-upload"
              type="file"
              className="block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100 cursor-pointer"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="mt-4">
              <label htmlFor="initial-question-input" className="block text-gray-700 text-sm font-semibold mb-2">
                Initial Question about PDF:
              </label>
              <input
                id="initial-question-input"
                type="text"
                value={initialQuestion}
                onChange={(e) => setInitialQuestion(e.target.value)}
                placeholder="e.g., Summarize this document."
                className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
              />
            </div>
            <button
              onClick={handlePdfUploadAndInitialQuestion}
              disabled={loading}
              className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold text-white transition duration-300 ease-in-out
                         ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75'}`}
            >
              {loading ? 'Uploading & Asking...' : 'Upload PDF & Ask'}
            </button>
          </div>
        )}

        {pdfUploaded && (
          <>
            <div className="flex-grow overflow-y-auto p-3 border border-gray-200 rounded-lg mb-4 bg-gray-50">
              {messages.length === 0 && !loading && (
                <p className="text-center text-gray-500 italic">Start chatting after PDF upload!</p>
              )}
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg max-w-[80%] ${
                    msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  } ${msg.error ? 'border border-red-500' : ''}`}>
                    {msg.text}
                  </span>
                  {msg.error && <p className="text-red-500 text-xs mt-1">Error sending message.</p>}
                </div>
              ))}
              {loading && messages.length > 0 && ( // Show loading indicator only after first message
                <div className="text-center text-gray-500 italic">Thinking...</div>
              )}
              <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>

            <div className="flex items-center">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-grow shadow-sm appearance-none border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out mr-2"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading}
                className={`py-2 px-4 rounded-lg font-semibold text-white transition duration-300 ease-in-out
                           ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75'}`}
              >
                Send
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
            <p className="font-bold">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
