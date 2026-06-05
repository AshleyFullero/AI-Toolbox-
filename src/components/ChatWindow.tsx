'use client';

import { useRef, useEffect, KeyboardEvent } from 'react';
import { useChatStream } from '@/hooks/useChatStream';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Bot, Send, Trash2, Square, RotateCcw, User } from 'lucide-react';

interface ChatWindowProps {
  className?: string;
}

const SAMPLE_PROMPTS = [
  '✨ Explain how neural networks work',
  '📝 Write me a professional email template',
  '🐍 Explain this Python decorator pattern',
  '🎯 What are the best practices for API design?',
];

export function ChatWindow({ className }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    clearMessages,
  } = useChatStream({
    onError: (err) => console.error('Chat error:', err),
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to send
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const handlePromptClick = (prompt: string) => {
    const syntheticEvent = {
      target: { value: prompt },
    } as React.ChangeEvent<HTMLTextAreaElement>;
    handleInputChange(syntheticEvent);
    textareaRef.current?.focus();
  };

  return (
    <div className={cn('flex flex-col rounded-2xl border border-border bg-card overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold">AI Assistant</p>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">GPT-4o-mini · Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="h-8 text-xs text-muted-foreground hover:text-destructive"
              id="chat-clear"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
          <Badge variant="secondary" className="text-xs">
            {messages.length} messages
          </Badge>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-6 py-12">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-1">How can I help you today?</h3>
              <p className="text-muted-foreground text-sm">
                Ask me anything — I&apos;m powered by GPT-4o-mini.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt.replace(/^.{2} /, ''))}
                  className="text-left text-sm px-4 py-2.5 rounded-xl border border-border hover:bg-accent hover:border-primary/30 transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id ?? index}
            className={cn(
              'flex gap-3 animate-fade-in',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-7 w-7 mt-0.5 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                  <Bot className="h-3.5 w-3.5" />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted rounded-bl-sm'
              )}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>

            {message.role === 'user' && (
              <Avatar className="h-7 w-7 mt-0.5 shrink-0">
                <AvatarFallback className="bg-gradient-brand text-white text-xs">
                  <User className="h-3.5 w-3.5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-fade-in">
            <Avatar className="h-7 w-7 mt-0.5 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xs">
                <Bot className="h-3.5 w-3.5" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-xl">
              <span>Something went wrong.</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-destructive hover:text-destructive"
                id="chat-retry"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border px-4 py-3 bg-muted/20">
        <form onSubmit={handleSubmit} className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything… (Ctrl+Enter to send)"
            className="flex-1 min-h-[44px] max-h-32 resize-none bg-background rounded-xl border-border focus-visible:ring-primary"
            rows={1}
            id="chat-input"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-1">
            {isLoading ? (
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="h-11 w-11 rounded-xl shrink-0"
                onClick={stop}
                id="chat-stop"
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 rounded-xl bg-gradient-brand hover:opacity-90 shrink-0"
                disabled={!input.trim()}
                id="chat-send"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
