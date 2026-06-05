'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { ImageResult } from '@/components/ImageResult';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const imageSchema = z.object({
  prompt: z
    .string()
    .min(3, 'Please enter at least 3 characters')
    .max(500, 'Prompt must be under 500 characters'),
  width: z.number().default(1024),
  height: z.number().default(1024),
  num_inference_steps: z.number().default(30),
});

type ImageForm = z.infer<typeof imageSchema>;

const DIMENSIONS = [
  { label: 'Square (1024×1024)', width: 1024, height: 1024 },
  { label: 'Portrait (768×1024)', width: 768, height: 1024 },
  { label: 'Landscape (1024×768)', width: 1024, height: 768 },
];

const EXAMPLE_PROMPTS = [
  'A majestic dragon soaring above snow-capped mountains at sunset, fantasy art, highly detailed',
  'Cozy coffee shop in the rain, warm lighting, photorealistic, bokeh',
  'Futuristic Tokyo street at night, neon signs, cyberpunk, cinematic',
  'Watercolor painting of a serene Japanese garden with cherry blossoms',
];

export function ImageGeneratorClient() {
  const [selectedDimension, setSelectedDimension] = useState(0);
  const { generate, isLoading, currentImage, history } = useImageGeneration();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ImageForm>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      prompt: '',
      width: 1024,
      height: 1024,
      num_inference_steps: 30,
    },
  });

  const watchedPrompt = watch('prompt');

  const onSubmit = (data: ImageForm) => {
    generate(data);
  };

  const handleDimensionChange = (index: number) => {
    setSelectedDimension(index);
    const dim = DIMENSIONS[index];
    setValue('width', dim.width);
    setValue('height', dim.height);
  };

  const handleExamplePrompt = (prompt: string) => {
    setValue('prompt', prompt);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
      {/* Controls */}
      <div className="space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Prompt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="image-prompt">Prompt</Label>
              <span className="text-xs text-muted-foreground">
                {watchedPrompt?.length ?? 0} / 500
              </span>
            </div>
            <Textarea
              id="image-prompt"
              {...register('prompt')}
              placeholder="A serene mountain lake at dawn, golden hour, photorealistic…"
              className="min-h-[120px] text-sm"
            />
            {errors.prompt && (
              <p className="text-xs text-destructive mt-1">{errors.prompt.message}</p>
            )}
          </div>

          {/* Example prompts */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Example prompts</p>
            <div className="space-y-1.5">
              {EXAMPLE_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleExamplePrompt(prompt)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border hover:bg-accent hover:border-primary/30 transition-all duration-200 line-clamp-1"
                >
                  ✨ {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Image size</Label>
            <div className="grid grid-cols-1 gap-2">
              {DIMENSIONS.map((dim, index) => (
                <button
                  key={dim.label}
                  type="button"
                  onClick={() => handleDimensionChange(index)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all duration-200',
                    selectedDimension === index
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/30 hover:bg-accent'
                  )}
                >
                  <div
                    className={cn(
                      'rounded border-2 shrink-0',
                      selectedDimension === index ? 'border-primary' : 'border-muted-foreground/40',
                      dim.width > dim.height
                        ? 'w-6 h-4'
                        : dim.height > dim.width
                          ? 'w-4 h-6'
                          : 'w-5 h-5'
                    )}
                  />
                  <span className={selectedDimension === index ? 'text-primary font-medium' : ''}>
                    {dim.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity"
            disabled={isLoading}
            id="image-generate"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2 text-lg">◌</span>
                Generating…
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Result */}
      <div className="space-y-4">
        {isLoading && (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-muted flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-xl animate-pulse-glow">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">Creating your image…</p>
                  <p className="text-xs text-muted-foreground mt-1">This may take 20–30 seconds</p>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full bg-brand-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentImage && !isLoading && (
          <ImageResult
            imageUrl={currentImage.imageUrl}
            prompt={currentImage.prompt}
            generatedAt={currentImage.generatedAt}
          />
        )}

        {!currentImage && !isLoading && (
          <div className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-center p-8">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
              <Wand2 className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your image will appear here</p>
              <p className="text-sm text-muted-foreground mt-1">
                Write a prompt and click Generate
              </p>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div>
            <p className="text-sm font-medium mb-2">Recent generations</p>
            <div className="grid grid-cols-3 gap-2">
              {history.slice(1, 7).map((img, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageUrl}
                    alt={img.prompt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
