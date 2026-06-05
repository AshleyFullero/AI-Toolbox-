'use client';

import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from '@/hooks/useToast';

export interface ImageGenerationParams {
  prompt: string;
  width?: number;
  height?: number;
  num_inference_steps?: number;
}

export interface GeneratedImage {
  imageUrl: string;
  prompt: string;
  generatedAt: Date;
}

/**
 * Custom hook for generating images via the Replicate API.
 */
export function useImageGeneration() {
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  const mutation = useMutation({
    mutationFn: async (params: ImageGenerationParams): Promise<GeneratedImage> => {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        imageUrl: data.imageUrl,
        prompt: params.prompt,
        generatedAt: new Date(),
      };
    },
    onSuccess: (data) => {
      setHistory((prev) => [data, ...prev]);
      toast({
        title: '✨ Image generated!',
        description: 'Your image has been created successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Generation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    generate: mutation.mutate,
    generateAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    currentImage: mutation.data ?? null,
    history,
    clearHistory: () => setHistory([]),
  };
}
