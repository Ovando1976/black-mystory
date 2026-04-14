require('dotenv').config();
const path = require('path');
const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = Number(process.env.PORT || 8080);

app.use(express.json());

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const fallbackReply = (message) =>
  `I received: "${message}". Configure OPENAI_API_KEY on the server to enable live AI responses.`;

app.post('/api/chat/completions', async (req, res) => {
  const message = (req.body?.message || '').toString().trim();

  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  if (!openai) {
    return res.json({ message: fallbackReply(message) });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
      max_tokens: 120,
    });

    return res.json({
      message: completion.choices?.[0]?.message?.content || 'No response generated.',
    });
  } catch (error) {
    console.error('Chat completion error:', error.message);
    return res.status(502).json({ error: 'Unable to generate response right now.' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
