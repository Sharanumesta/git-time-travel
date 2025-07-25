import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [commits, setCommits] = useState([]);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/commits')
      .then(res => setCommits(res.data));
  }, []);

  const handleExplain = async (hash) => {
    setExplanation('Loading...');
    const res = await axios.post('http://localhost:4000/explain', { hash });
    setExplanation(res.data.explanation);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Codebase Time Travel</h1>
      <ul>
        {commits.map(c => (
          <li key={c.hash}>
            <button onClick={() => handleExplain(c.hash)}>
              {c.message} ({c.hash.slice(0, 7)})
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <pre>{explanation}</pre>
    </div>
  );
}

export default App;