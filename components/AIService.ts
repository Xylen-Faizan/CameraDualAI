interface AIResponse {
  answer: string;
  confidence: number;
}

class AIService {
  private static instance: AIService;
  private apiKey: string = '';
  private provider: 'openai' | 'gemini' = 'openai';

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setConfig(apiKey: string, provider: 'openai' | 'gemini') {
    this.apiKey = apiKey;
    this.provider = provider;
  }

  async processQuestion(question: string): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    try {
      if (this.provider === 'openai') {
        return await this.callOpenAI(question);
      } else {
        return await this.callGemini(question);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  private async callOpenAI(question: string): Promise<AIResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides clear, concise answers to questions. Keep responses under 200 words when possible.',
          },
          {
            role: 'user',
            content: question,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || 'No answer available';

    return {
      answer: answer.trim(),
      confidence: 0.85,
    };
  }

  private async callGemini(question: string): Promise<AIResponse> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Please provide a clear, concise answer to this question (under 200 words when possible): ${question}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.candidates[0]?.content?.parts[0]?.text || 'No answer available';

    return {
      answer: answer.trim(),
      confidence: 0.85,
    };
  }
}

export default AIService;