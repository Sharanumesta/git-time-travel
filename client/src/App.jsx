import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [repo, setRepo] = useState("");
  const [commits, setCommits] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [loadingHash, setLoadingHash] = useState(null);
  const [error, setError] = useState("");

  const [selectedHash, setSelectedHash] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);

  const fetchCommits = async () => {
    setError("");
    setCommits([]);
    setExplanation("");
    try {
      const res = await axios.get("http://localhost:4000/commits", {
        params: { repo },
      });
      setCommits(res.data);
    } catch (err) {
      setError(
        "❌ Failed to fetch commits. Make sure the path is a valid Git repo."
      );
    }
  };

  // const handleExplain = async (hash) => {
  //   setExplanation("");
  //   setError("");
  //   setLoadingHash(hash);
  //   try {
  //     const res = await axios.post("http://localhost:4000/explain", {
  //       hash,
  //       repo,
  //     });
  //     setExplanation(res.data.explanation);
  //   } catch (err) {
  //     setError("❌ Failed to fetch explanation.");
  //   } finally {
  //     setLoadingHash(null);
  //   }
  // };

  const handleAsk = async () => {
    if (!selectedHash || !question) return;
    setAnswer("");
    setQuestionLoading(true);

    try {
      // console.log(question)
      const res = await axios.post("http://localhost:4000/ask", {
        hash: selectedHash,
        repo,
        question,
      });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error("❌ Ask error:", err);
      setAnswer("Failed to get answer.");
    } finally {
      setQuestionLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: 32,
        fontFamily: "sans-serif",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <h1>Codebase Time Travel</h1>

      <h2>Select Repo</h2>
      <input
        type="text"
        placeholder="Enter full local repo path (e.g., /Users/you/project)"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        style={{ marginBottom: "0.5rem", width: "100%" }}
      />
      <button onClick={fetchCommits} style={{ marginBottom: "1.5rem" }}>
        Load Commits
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* <h2>🔍 Recent Commits</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {commits.map((c) => (
          <li key={c.hash} style={{ marginBottom: 10 }}>
            <button
              onClick={() => handleExplain(c.hash)}
              style={{
                padding: "8px 12px",
                fontSize: "1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
              disabled={loadingHash === c.hash}
            >
              {loadingHash === c.hash ? "Explaining..." : c.message} (
              {c.hash.slice(0, 7)})
            </button>
          </li>
        ))}
      </ul> */}

      <hr />

      <h2>📖 Explanation</h2>
      {loadingHash && !explanation && (
        <p>
          Generating explanation for commit{" "}
          <code>{loadingHash.slice(0, 7)}</code>...
        </p>
      )}
      {explanation && (
        <pre
          style={{
            backgroundColor: "#f5f5f5",
            padding: 16,
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            lineHeight: 1.5,
          }}
        >
          {explanation}
        </pre>
      )}

      <hr />

      <h2>💬 Ask About a Commit</h2>
      <select
        value={selectedHash}
        onChange={(e) => setSelectedHash(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      >
        <option value="">Select a commit...</option>
        {commits.map((c) => (
          <option key={c.hash} value={c.hash}>
            {c.message} ({c.hash.slice(0, 7)})
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Ask a question about the selected commit..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <button onClick={handleAsk} disabled={!selectedHash || !question}>
        Ask
      </button>

      {questionLoading && <p>Answering...</p>}
      {answer && (
        <pre
          style={{
            backgroundColor: "#eef0f2",
            padding: 16,
            borderRadius: 8,
            marginTop: 12,
            whiteSpace: "pre-wrap",
          }}
        >
          <ReactMarkdown>
            {typeof answer === "string" ? answer : JSON.stringify(answer)}
          </ReactMarkdown>
        </pre>
      )}
    </div>
  );
}

export default App;
