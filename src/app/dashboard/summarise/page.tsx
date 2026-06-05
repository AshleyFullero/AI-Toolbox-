import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SummariseForm } from '@/components/SummariseForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Summarise',
  description: 'Instantly condense any text into key insights.',
};

export default async function SummarisePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Summariser</h1>
        <p className="text-muted-foreground text-sm">
          Paste any text and get a crisp summary in seconds. Supports articles, emails, reports, and more.
        </p>
      </div>
      <SummariseForm />
    </div>
  );
}
