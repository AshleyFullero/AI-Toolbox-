/**
 * Summarise API Route Tests (skeleton)
 *
 * Tests the /api/summarise endpoint covering:
 * - Authentication check (401 for unauthenticated)
 * - Validation (400 for invalid input)
 * - Successful summarisation (200)
 * - OpenAI error handling (500)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Session } from 'next-auth';

// --- Mock declarations (must come before imports) ---

const mockAuth = vi.fn<() => Promise<Session | null>>();

vi.mock('@/lib/auth', () => ({
  auth: () => mockAuth(),
}));

const mockCreate = vi.fn();

vi.mock('@/lib/openai', () => ({
  openai: {
    chat: {
      completions: {
        create: () => mockCreate(),
      },
    },
  },
  SUMMARISE_SYSTEM_PROMPT: 'You are an expert summariser.',
}));

// Helper to create a mock Request
function createRequest(body: unknown): Request {
  return new Request('http://localhost:3000/api/summarise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function makeSession(userId = 'user-1'): Session {
  return {
    user: { id: userId, email: 'test@test.com', name: 'Test User', image: null },
    expires: new Date(Date.now() + 86400000).toISOString(),
  };
}

describe('POST /api/summarise', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when not authenticated', async () => {
    mockAuth.mockResolvedValue(null);

    const { POST } = await import('@/app/api/summarise/route');
    const req = createRequest({ text: 'Some text to summarise', style: 'bullet' });
    const response = await POST(req);

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 400 for invalid input (text too short)', async () => {
    mockAuth.mockResolvedValue(makeSession());

    const { POST } = await import('@/app/api/summarise/route');
    const req = createRequest({ text: 'Hi', style: 'bullet' });
    const response = await POST(req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Validation failed');
  });

  it('returns 400 for invalid style', async () => {
    mockAuth.mockResolvedValue(makeSession());

    const { POST } = await import('@/app/api/summarise/route');
    const req = createRequest({
      text: 'A valid text that is long enough to pass validation.',
      style: 'invalid-style',
    });
    const response = await POST(req);

    expect(response.status).toBe(400);
  });

  it('returns 200 with summary on valid request', async () => {
    mockAuth.mockResolvedValue(makeSession());
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: '• Key point one\n• Key point two\n• Key point three',
            role: 'assistant',
          },
          finish_reason: 'stop',
          index: 0,
          logprobs: null,
        },
      ],
      id: 'test-completion',
      model: 'gpt-4o-mini',
      object: 'chat.completion',
      created: Date.now(),
      usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
    });

    const { POST } = await import('@/app/api/summarise/route');
    const req = createRequest({
      text: 'This is a long text that needs to be summarised. It contains multiple sentences and key points that should be extracted by the AI model.',
      style: 'bullet',
    });
    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.summary).toContain('Key point one');
  });

  it('returns 500 when OpenAI call fails', async () => {
    mockAuth.mockResolvedValue(makeSession());
    mockCreate.mockRejectedValue(new Error('OpenAI API error: Rate limit exceeded'));

    const { POST } = await import('@/app/api/summarise/route');
    const req = createRequest({
      text: 'This is a long enough text to pass validation for the summarise route test.',
      style: 'bullet',
    });
    const response = await POST(req);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  it('handles tldr style correctly', async () => {
    mockAuth.mockResolvedValue(makeSession());
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: { content: 'TL;DR: This is a very short summary.', role: 'assistant' },
          finish_reason: 'stop',
          index: 0,
          logprobs: null,
        },
      ],
      id: 'test',
      model: 'gpt-4o-mini',
      object: 'chat.completion',
      created: Date.now(),
      usage: { prompt_tokens: 50, completion_tokens: 20, total_tokens: 70 },
    });

    const { POST } = await import('@/app/api/summarise/route');
    const req = createRequest({
      text: 'This is a moderately long text that should be summarized in TL;DR format quickly.',
      style: 'tldr',
    });
    const response = await POST(req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.summary).toContain('TL;DR');
  });
});
