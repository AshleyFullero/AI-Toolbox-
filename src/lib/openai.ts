import OpenAI from 'openai';

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

/**
 * OpenAI client singleton.
 * Reuses the same instance across hot-reloads in development.
 */
export const openai =
  globalForOpenAI.openai ??
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForOpenAI.openai = openai;
}

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
