import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ToolCard } from '@/components/ToolCard';
import { SubscriptionBanner } from '@/components/SubscriptionBanner';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import {
  MessageSquare,
  FileText,
  Image,
  Code,
  Zap,
  Activity,
  Clock,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Access all your AI tools from one place.',
};

const tools = [
  {
    title: 'AI Chat',
    description:
      'Stream-powered conversations with GPT-4o-mini. Ask questions, get explanations, brainstorm ideas.',
    href: '/dashboard/chat',
    icon: MessageSquare,
    gradient: 'from-blue-500 to-cyan-500',
    badge: 'Streaming',
  },
  {
    title: 'Summarise',
    description:
      'Instantly condense long documents, articles, or emails into key points.',
    href: '/dashboard/summarise',
    icon: FileText,
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Image Generation',
    description:
      'Create stunning images from text prompts using Stable Diffusion XL.',
    href: '/dashboard/image',
    icon: Image,
    gradient: 'from-purple-500 to-pink-500',
    isNew: true,
  },
  {
    title: 'Code Explainer',
    description: 'Understand any code in plain English with detailed explanations.',
    href: '/dashboard/chat',
    icon: Code,
    gradient: 'from-orange-500 to-amber-500',
    badge: 'Beta',
  },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const displayName = session.user.name ?? session.user.email ?? 'there';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Welcome header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarImage src={session.user.image ?? ''} alt={displayName} />
            <AvatarFallback className="bg-gradient-brand text-white text-lg font-bold">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              Good{' '}
              {new Date().getHours() < 12
                ? 'morning'
                : new Date().getHours() < 18
                  ? 'afternoon'
                  : 'evening'}
              , {firstName}! 👋
            </h1>
            <p className="text-muted-foreground text-sm">
              What would you like to create today?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-3 py-1.5"
          >
            <Activity className="h-3 w-3 text-emerald-500" />
            Free Plan
          </Badge>
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 px-3 py-1.5"
          >
            <Clock className="h-3 w-3" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* Usage stats (skeleton placeholders for now) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Chat messages', used: 3, limit: 20, icon: MessageSquare, color: 'text-blue-500' },
          { label: 'Summaries', used: 1, limit: 10, icon: FileText, color: 'text-emerald-500' },
          { label: 'Images', used: 0, limit: 3, icon: Image, color: 'text-purple-500' },
          { label: 'API calls today', used: 4, limit: 33, icon: Zap, color: 'text-amber-500' },
        ].map(({ label, used, limit, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="text-2xl font-bold">
              {used}
              <span className="text-sm font-normal text-muted-foreground ml-1">/ {limit}</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-brand transition-all duration-500`}
                style={{ width: `${(used / limit) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tools grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Your AI Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </div>

      {/* Subscription banner */}
      <SubscriptionBanner compact />
    </div>
  );
}
