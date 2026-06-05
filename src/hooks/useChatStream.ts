'use client';

import { useChat } from 'ai/react';
import { useCallback } from 'react';

export interface UseChatStreamOptions {
  onFinish?: (message: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for streaming AI chat responses.
 * Wraps Vercel AI SDK's useChat with additional functionality.
 */
export function useChatStream(options: UseChatStreamOptions = {}) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    reload,
    setMessages,
    setInput,
    append,
  } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      options.onFinish?.(message.content);
    },
    onError: (error) => {
      options.onError?.(error);
      console.error('Chat stream error:', error);
    },
  });

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const sendMessage = useCallback(
    (content: string) => {
      append({ role: 'user', content });
    },
    [append]
  );

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    stop,
    reload,
    clearMessages,
    sendMessage,
    setInput,
  };
}
