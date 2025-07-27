require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const gitParser = require('./gitParser');
const llmService = require('./llmService');


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/commits', async (req, res) => {
  const repoPath = req.query.repo || '.';
  const since = req.query.since || '3 months ago';
  const commits = await gitParser.getRecentCommits(repoPath, since);
  res.json(commits);
});

app.post('/ask', async (req, res) => {
  const { hash, repo, question } = req.body;
  if (!hash || !repo || !question) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const diff = await gitParser.getDiff(repo, hash);
    const prompt = `Here is a git diff:\n\n${diff}\n\nUser question: ${question}`;
    const answer = await llmService.handleCustomQuestion(prompt);
    res.json({ answer });
  } catch (err) {
    console.error('LLM Ask Error:', err);
    res.status(500).json({ error: 'Failed to process question.' });
  }
});



// app.post('/explain', async (req, res) => {
//     const { hash, repo } = req.body;
//   const diff = await gitParser.getDiff(repo || '.', hash);
//   const explanation = await llmService.explainDiff(diff);
//   res.json({ explanation });
// });


app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
