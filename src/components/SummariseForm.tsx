'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/useToast';
import ReactMarkdown from 'react-markdown';
import { FileText, Sparkles, Copy, Check, AlignLeft, List, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const summariseSchema = z.object({
  text: z
    .string()
    .min(10, 'Please enter at least 10 characters.')
    .max(10000, 'Text must be under 10,000 characters.'),
  style: z.enum(['bullet', 'paragraph', 'tldr']),
});

type SummariseForm = z.infer<typeof summariseSchema>;

const STYLES = [
  { value: 'bullet' as const, label: 'Bullet Points', icon: List, description: '3–7 key takeaways' },
  { value: 'paragraph' as const, label: 'Paragraphs', icon: AlignLeft, description: '2–3 prose paragraphs' },
  { value: 'tldr' as const, label: 'TL;DR', icon: Zap, description: '1–2 sentences max' },
];

export function SummariseForm() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SummariseForm>({
    resolver: zodResolver(summariseSchema),
    defaultValues: { style: 'bullet' },
  });

  const watchedStyle = watch('style');
  const watchedText = watch('text');
  const charCount = watchedText?.length ?? 0;

  const onSubmit = async (data: SummariseForm) => {
    setIsLoading(true);
    setSummary(null);

    try {
      const response = await fetch('/api/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Something went wrong');
      }

      setSummary(result.summary);
    } catch (error) {
      toast({
        title: 'Summarisation failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (summary) {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Style selector */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Summary style</Label>
          <div className="grid grid-cols-3 gap-3">
            {STYLES.map(({ value, label, icon: Icon, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue('style', value)}
                className={cn(
                  'flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition-all duration-200',
                  watchedStyle === value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-primary/30 hover:bg-accent'
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-4 w-4', watchedStyle === value ? 'text-primary' : 'text-muted-foreground')} />
                  <span className={cn('text-sm font-medium', watchedStyle === value ? 'text-primary' : '')}>{label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="summarise-text">Text to summarise</Label>
            <span className={cn('text-xs', charCount > 9000 ? 'text-destructive' : 'text-muted-foreground')}>
              {charCount.toLocaleString()} / 10,000
            </span>
          </div>
          <Textarea
            id="summarise-text"
            {...register('text')}
            placeholder="Paste any text here — articles, emails, reports, notes…"
            className="min-h-[200px] text-sm"
          />
          {errors.text && (
            <p className="text-xs text-destructive mt-1">{errors.text.message}</p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity"
          disabled={isLoading}
          id="summarise-submit"
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Summarising…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Summarise
            </>
          )}
        </Button>
      </form>

      {/* Result */}
      {isLoading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {summary && !isLoading && (
        <Card className="animate-fade-in border-emerald-200 dark:border-emerald-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <FileText className="h-3.5 w-3.5 text-white" />
                </div>
                <CardTitle className="text-base">Summary</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {STYLES.find((s) => s.value === watchedStyle)?.label}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={handleCopy}
                id="summarise-copy"
              >
                {copied ? (
                  <><Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> Copied!</>
                ) : (
                  <><Copy className="h-3.5 w-3.5 mr-1.5" /> Copy</>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
