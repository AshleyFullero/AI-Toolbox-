import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ChatWindow } from '@/components/ChatWindow';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Chat',
  description: 'Stream-powered conversations with GPT-4o-mini.',
};

export default async function ChatPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl h-[calc(100vh-5rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <p className="text-muted-foreground text-sm">
          Powered by GPT-4o-mini with real-time streaming
        </p>
      </div>
      <ChatWindow className="flex-1 min-h-0" />
    </div>
  );
}
