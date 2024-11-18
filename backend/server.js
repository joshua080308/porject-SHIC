const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

// OpenAI API 설정
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

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
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
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

    const analysis = response.data.choices[0].message.content;
    res.send({ analysis });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).send({ error: 'Failed to analyze sentence' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:3000`));
