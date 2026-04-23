import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const openrouter = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

const DEFAULT_PROMPT_SYSTEM = "You are an expert AI blog writer. Output only valid JSON.";

class AIService {
  static async requestWithFallback(payload) {
    try {
      console.log('Attempting OpenAI...');
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        ...payload,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI failed, falling back to OpenRouter:', error.message);
      try {
        const response = await openrouter.chat.completions.create({
          model: 'openai/gpt-4o-mini', // Or any specified model on OpenRouter
          ...payload,
        });
        return response.choices[0].message.content;
      } catch (fallbackError) {
        console.error('OpenRouter also failed:', fallbackError.message);
        throw new Error('Both AI providers failed.');
      }
    }
  }

  static async generateBlogData(prompt) {
    const systemPrompt = `
      Generate a blog post based on the following topic.
      Output MUST be a JSON object with:
      {
        "title": "...",
        "content": "...",
        "summary": "...",
        "tags": ["...", "..."],
        "category": "..."
      }
    `;

    const result = await this.requestWithFallback({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    try {
      // Clean up potential markdown formatting if AI is chatty
      const cleanResult = result.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanResult);
    } catch (e) {
      console.warn('Direct JSON parse failed, trying regex match:', e.message);
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('AI returned malformed or non-JSON content.');
    }
  }
}

export default AIService;
