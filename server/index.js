const express = require('express');
const cors = require('cors');
const gitParser = require('./gitParser');
const llmService = require('./llmService');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/commits', async (req, res) => {
  const commits = await gitParser.getRecentCommits();
  res.json(commits);
});

app.post('/explain', async (req, res) => {
  const { hash } = req.body;
  const diff = await gitParser.getDiff(hash);
  const explanation = await llmService.explainDiff(diff);
  res.json({ explanation });
});

app.listen(4000, () => {
  console.log('Server listening on http://localhost:4000');
});
