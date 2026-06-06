import { auth } from '@/lib/auth';
import { openai, SUMMARISE_SYSTEM_PROMPT } from '@/lib/openai';
import { z } from 'zod';

// Force Node.js runtime — auth uses bcryptjs (Node-only)
export const runtime = 'nodejs';

const requestSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters').max(10000, 'Text must be under 10,000 characters'),
  style: z.enum(['bullet', 'paragraph', 'tldr']).default('bullet'),
});

const STYLE_INSTRUCTIONS: Record<string, string> = {
  bullet: 'Provide the summary as a concise bulleted list of key points using markdown (• or -). Aim for 3-7 bullets.',
  paragraph: 'Provide the summary as 2-3 clear, concise paragraphs in prose form.',
  tldr: 'Provide an ultra-concise TL;DR summary in 1-2 sentences only.',
};

export async function POST(req: Request) {
  // Auth check
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse and validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { text, style } = parsed.data;

  const userPrompt = `${STYLE_INSTRUCTIONS[style]}\n\nText to summarise:\n\n${text}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SUMMARISE_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1024,
      temperature: 0.5,
    });

    const summary = completion.choices[0]?.message?.content ?? 'Unable to generate summary.';

    return Response.json({ summary });
  } catch (error) {
    console.error('Summarise API error:', error);
    return Response.json({ error: 'Failed to generate summary. Please try again.' }, { status: 500 });
  }
}
