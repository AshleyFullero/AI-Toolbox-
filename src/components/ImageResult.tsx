'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/useToast';
import { Download, Copy, Check, Clock, ZoomIn } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ImageResultProps {
  imageUrl: string;
  prompt: string;
  generatedAt?: Date;
}

export function ImageResult({ imageUrl, prompt, generatedAt }: ImageResultProps) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
    toast({ title: 'Prompt copied!' });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-toolbox-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Image downloaded!' });
    } catch {
      toast({ title: 'Download failed', description: 'Please right-click the image to save it.', variant: 'destructive' });
    }
  };

  return (
    <>
      <Card className="overflow-hidden border-purple-200 dark:border-purple-800 animate-fade-in">
        <CardContent className="p-0">
          <div
            className="relative aspect-square cursor-zoom-in group"
            onClick={() => setIsZoomed(true)}
          >
            <Image
              src={imageUrl}
              alt={prompt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-4">
          <div className="w-full">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Prompt used</p>
            <p className="text-sm line-clamp-2 leading-relaxed">{prompt}</p>
          </div>

          {generatedAt && (
            <Badge variant="secondary" className="self-start flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              Generated {formatDate(generatedAt)}
            </Badge>
          )}

          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleCopyPrompt}
              id="image-copy-prompt"
            >
              {copiedPrompt ? (
                <><Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> Copied!</>
              ) : (
                <><Copy className="h-3.5 w-3.5 mr-1.5" /> Copy prompt</>
              )}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-gradient-brand text-white hover:opacity-90"
              onClick={handleDownload}
              id="image-download"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Zoom modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full w-full h-full">
            <Image
              src={imageUrl}
              alt={prompt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
