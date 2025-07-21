import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("question", question);

    const res = await axios.post("http://localhost:5000/ask", formData);
    setAnswer(res.data.answer);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>PDF Q&A App</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />
      <br />
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question from PDF"
        style={{ width: "300px" }}
      />
      <br />
      <br />
      <button onClick={handleUpload}>Ask</button>
      <br />
      <br />
      {answer && (
        <div>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
