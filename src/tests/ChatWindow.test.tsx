/**
 * ChatWindow Component Tests
 *
 * These are skeleton tests demonstrating the testing approach.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next-auth to avoid provider errors in tests
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: {
      user: { id: 'test-user-id', name: 'Test User', email: 'test@example.com' },
    },
    status: 'authenticated',
  })),
}));

// Mock the Vercel AI SDK useChat hook
const mockUseChat = vi.fn(() => ({
  messages: [],
  input: '',
  handleInputChange: vi.fn(),
  handleSubmit: vi.fn(),
  isLoading: false,
  error: null,
  stop: vi.fn(),
  reload: vi.fn(),
  setMessages: vi.fn(),
  setInput: vi.fn(),
  append: vi.fn(),
}));

vi.mock('ai/react', () => ({
  useChat: () => mockUseChat(),
}));

// Mock useToast
vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ toasts: [], toast: vi.fn(), dismiss: vi.fn() }),
  toast: vi.fn(),
}));

// Mock react-markdown
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <span>{children}</span>,
}));

import { ChatWindow } from '@/components/ChatWindow';

describe('ChatWindow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the welcome state when there are no messages', () => {
    render(<ChatWindow />);
    expect(screen.getByText(/How can I help you today/i)).toBeInTheDocument();
  });

  it('renders the chat input field', () => {
    render(<ChatWindow />);
    const input = screen.getByPlaceholderText(/Ask me anything/i);
    expect(input).toBeInTheDocument();
  });

  it('shows the GPT-4o-mini status indicator', () => {
    render(<ChatWindow />);
    expect(screen.getByText(/GPT-4o-mini/i)).toBeInTheDocument();
  });

  it('renders with messages when provided', () => {
    mockUseChat.mockReturnValueOnce({
      messages: [
        { id: '1', role: 'user' as const, content: 'Hello!', createdAt: new Date() },
        { id: '2', role: 'assistant' as const, content: 'Hi there! How can I help?', createdAt: new Date() },
      ],
      input: '',
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: false,
      error: null,
      stop: vi.fn(),
      reload: vi.fn(),
      setMessages: vi.fn(),
      setInput: vi.fn(),
      append: vi.fn(),
    });

    render(<ChatWindow />);

    expect(screen.getByText('Hello!')).toBeInTheDocument();
    expect(screen.getByText('Hi there! How can I help?')).toBeInTheDocument();
  });

  it('shows stop button when isLoading is true', () => {
    mockUseChat.mockReturnValueOnce({
      messages: [{ id: '1', role: 'user' as const, content: 'Test', createdAt: new Date() }],
      input: '',
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: true,
      error: null,
      stop: vi.fn(),
      reload: vi.fn(),
      setMessages: vi.fn(),
      setInput: vi.fn(),
      append: vi.fn(),
    });

    render(<ChatWindow />);
    expect(document.getElementById('chat-stop')).toBeInTheDocument();
  });

  it('shows message count badge', () => {
    render(<ChatWindow />);
    expect(screen.getByText(/0 messages/i)).toBeInTheDocument();
  });
});
