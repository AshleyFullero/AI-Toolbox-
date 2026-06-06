import OpenAI from 'openai';

/**
 * Get the OpenAI client lazily — only creates when needed, not at module load.
 * This prevents build-time failures when OPENAI_API_KEY is not set.
 */
let _openai: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        'OPENAI_API_KEY environment variable is not set. Add it to your .env file.'
      );
    }
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

/**
 * Convenience export — use getOpenAI() in route handlers and server actions.
 * Do NOT call this at module level — it will throw if the key is missing.
 */
export const openai = {
  get chat() {
    return getOpenAI().chat;
  },
};

/**
 * Default model to use for chat and summarisation.
 */
export const CHAT_MODEL = 'gpt-4o-mini';

/**
 * System prompt for the AI chat assistant.
 */
export const CHAT_SYSTEM_PROMPT = `You are a helpful, knowledgeable, and friendly AI assistant called "AI Toolbox Assistant". 
You provide clear, accurate, and concise responses. 
You format your responses using Markdown when appropriate (e.g., code blocks, lists, headings).
You are honest about your limitations and uncertainties.`;

/**
 * System prompt for the summarisation tool.
 */
export const SUMMARISE_SYSTEM_PROMPT = `You are an expert at summarising text. 
Given a piece of text, produce a clear, accurate, and concise summary.
Focus on the key points and main ideas.
Preserve important details while eliminating redundancy.`;
