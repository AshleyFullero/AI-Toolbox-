import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolCard } from '@/components/ToolCard';
import {
  MessageSquare,
  FileText,
  Image,
  Code,
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Star,
  Users,
  Cpu,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Toolbox – Your All-in-One AI Platform',
  description:
    'Access chat, summarisation, image generation, and code explanation powered by GPT-4o-mini and Stable Diffusion. Free to start.',
};

const tools = [
  {
    title: 'AI Chat',
    description:
      'Have natural conversations with our AI assistant powered by GPT-4o-mini. Ask anything, get smart answers — instantly.',
    href: '/dashboard/chat',
    icon: MessageSquare,
    gradient: 'from-blue-500 to-cyan-500',
    isNew: false,
    badge: 'Streaming',
  },
  {
    title: 'Summarise',
    description:
      'Paste any text — articles, reports, emails — and get a crisp, accurate summary in seconds. Choose bullet points, paragraphs, or TL;DR.',
    href: '/dashboard/summarise',
    icon: FileText,
    gradient: 'from-emerald-500 to-teal-500',
    badge: 'GPT-4o-mini',
  },
  {
    title: 'Image Generation',
    description:
      'Turn your words into stunning images using Stable Diffusion XL. From photorealistic to artistic, the only limit is your imagination.',
    href: '/dashboard/image',
    icon: Image,
    gradient: 'from-purple-500 to-pink-500',
    isNew: true,
    isPro: false,
  },
  {
    title: 'Code Explainer',
    description:
      'Paste any code snippet and get a plain-English explanation with best practice suggestions. Supports 30+ languages.',
    href: '/dashboard/chat',
    icon: Code,
    gradient: 'from-orange-500 to-amber-500',
    badge: 'Beta',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Streaming responses so you see results in real-time, never wait for the full output.',
  },
  {
    icon: Shield,
    title: 'Secure by Default',
    description: 'All requests are authenticated. Your data stays private and is never used for training.',
  },
  {
    icon: Sparkles,
    title: 'State-of-the-Art Models',
    description: 'Powered by GPT-4o-mini and Stable Diffusion XL — the best models for each task.',
  },
  {
    icon: Cpu,
    title: 'Built for Scale',
    description: 'Next.js App Router, edge-ready APIs, and Prisma ORM for reliable, fast performance.',
  },
];

const stats = [
  { value: '4 Tools', label: 'AI-powered utilities' },
  { value: 'GPT-4o', label: 'mini for text tasks' },
  { value: 'SDXL', label: 'for image generation' },
  { value: 'Free', label: 'to get started' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-32 lg:py-40">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-brand-500/20 via-purple-500/15 to-pink-500/10 blur-3xl rounded-full" />
          <div className="absolute left-1/4 bottom-0 w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full" />
          <div className="absolute right-1/4 top-1/2 w-[300px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full" />
        </div>

        <div className="container mx-auto text-center">
          <Badge
            variant="outline"
            className="mb-6 border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 px-4 py-1.5"
          >
            <Star className="mr-1.5 h-3 w-3 fill-current" />
            All your AI tools in one place
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in">
            Your AI{' '}
            <span className="gradient-text">Superpower</span>
            <br />
            Starts Here
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Chat, summarise documents, generate images, and explain code — all in one
            beautifully designed dashboard. Powered by GPT-4o-mini and Stable Diffusion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="xl"
              className="bg-gradient-brand text-white hover:opacity-90 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
              asChild
            >
              <Link href="/register" id="hero-cta-primary">
                <Sparkles className="mr-2 h-5 w-5" />
                Get started for free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="w-full sm:w-auto border-border/60 hover:bg-accent"
              asChild
            >
              <Link href="/login" id="hero-cta-secondary">
                Sign in to dashboard
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="features" className="px-4 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Cpu className="mr-1.5 h-3 w-3" />
              AI Tools
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need,{' '}
              <span className="gradient-text">nothing you don&apos;t</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Each tool is purpose-built and optimised. No bloat, no complicated setup.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for{' '}
              <span className="gradient-text">performance & privacy</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="px-4 py-20">
        <div className="container mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center text-white shadow-2xl">
            {/* Decoration */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white blur-3xl" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm mb-6">
                <Users className="h-4 w-4" />
                Free forever, upgrade when you need
              </div>
              <h2 className="text-4xl font-extrabold mb-4">Ready to supercharge your workflow?</h2>
              <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                Join thousands of users who use AI Toolbox every day. Free plan includes 20 chat
                messages, 10 summaries, and 3 image generations per day.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="xl"
                  className="bg-white text-brand-700 hover:bg-white/90 shadow-xl font-bold w-full sm:w-auto"
                  asChild
                >
                  <Link href="/register" id="cta-register">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Start for free — no card needed
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Toolbox. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="https://github.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
