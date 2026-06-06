import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

// Ensure all layout-wrapped pages are dynamically rendered
// (required because Providers includes session/theme context)
export const dynamic = 'force-dynamic';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AI Toolbox – Your All-in-One AI Platform',
    template: '%s | AI Toolbox',
  },
  description:
    'Access powerful AI tools — chat, summarise, generate images, and explain code — all in one clean, responsive dashboard.',
  keywords: ['AI', 'artificial intelligence', 'chatbot', 'image generation', 'summarisation', 'code explanation'],
  authors: [{ name: 'AI Toolbox Team' }],
  creator: 'AI Toolbox',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'AI Toolbox – Your All-in-One AI Platform',
    description: 'Access powerful AI tools in one clean dashboard.',
    siteName: 'AI Toolbox',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Toolbox',
    description: 'Access powerful AI tools in one clean dashboard.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
