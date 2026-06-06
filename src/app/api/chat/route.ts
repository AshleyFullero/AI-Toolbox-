import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { auth } from '@/lib/auth';
import { CHAT_SYSTEM_PROMPT } from '@/lib/openai';
import { z } from 'zod';

// Force Node.js runtime — auth + OpenAI use Node-only APIs
export const runtime = 'nodejs';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1),
});

export async function POST(req: Request) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Parse and validate request
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'Invalid request format', details: parsed.error.flatten() }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages } = parsed.data;

  // Stream the response
  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: CHAT_SYSTEM_PROMPT,
    messages,
    maxTokens: 2048,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
