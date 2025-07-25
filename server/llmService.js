const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: 'YOUR_API_KEY_HERE' });

exports.explainDiff = async (diff) => {
  const prompt = `Explain the following git diff:

${diff}`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return chat.choices[0].message.content;
};