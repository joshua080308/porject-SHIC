const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { OpenAI } = require('openai');

// OpenAI API 설정
const openai = new OpenAI({
  apiKey: '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',
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 분석 요청 엔드포인트
app.post('/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).send({ error: 'Text is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4', // GPT-4 모델을 사용
      messages: [
        {
          role: 'system',
          content: 'You are a linguistic expert who analyzes English sentences in detail.',
        },
        {
          role: 'user',
          content: `Analyze the following sentence in detail. Return the analysis in JSON format with the following keys:
          - "subject": The subject of the sentence.
          - "verb": The main verb of the sentence.
          - "object": The object of the sentence (if applicable).
          - "clauses": List of any clauses in the sentence.
          - "phrases": Breakdown of noun phrases, verb phrases, and adjective phrases.
          - "sentence_type": The type of the sentence (e.g., declarative, interrogative, imperative, exclamatory).
          - "notes": Additional notes on grammar or structure.

          Sentence: "${text}"`,
        },
      ],
    });

    const analysis = response.choices[0].message.content;
    res.send({ analysis });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send({ error: 'Failed to analyze sentence' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
