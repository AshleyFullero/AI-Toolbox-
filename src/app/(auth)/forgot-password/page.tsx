'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

// Note: Metadata must be exported from a separate file or server component;
// using this pattern since forgot-password is typically a client page.

const forgotSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = async (data: ForgotForm) => {
    // In production, this would call a server action to send the reset email.
    // For now, we simulate a short delay and show the success state.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmittedEmail(data.email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-brand-500/15 via-purple-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">AI Toolbox</span>
          </Link>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
            <CardDescription>
              {submitted
                ? 'Check your email for a reset link.'
                : "Enter your email and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium mb-1">Email sent!</p>
                  <p className="text-sm text-muted-foreground">
                    If an account exists for{' '}
                    <span className="font-medium text-foreground">{submittedEmail}</span>, you
                    will receive a password reset link shortly.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="forgot-password-form">
                <div className="space-y-1.5">
                  <Label htmlFor="forgot-email">Email address</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    {...register('email')}
                    className={cn(errors.email && 'border-destructive')}
                    autoComplete="email"
                    autoFocus
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity"
                  disabled={isSubmitting}
                  id="forgot-submit"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Send reset link
                    </span>
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="justify-center pb-6">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              id="forgot-back-to-login"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
