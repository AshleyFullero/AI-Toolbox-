import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ImageGeneratorClient } from '@/components/ImageGeneratorClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Generation',
  description: 'Create stunning images from text prompts using Stable Diffusion XL.',
};

export default async function ImagePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Image Generation</h1>
        <p className="text-muted-foreground text-sm">
          Describe what you want to see, and Stable Diffusion XL will create it for you.
        </p>
      </div>
      <ImageGeneratorClient />
    </div>
  );
}
