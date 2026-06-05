'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { registerAction } from '@/lib/actions/auth';
import { toast } from '@/hooks/useToast';
import { Bot, Github, Loader2, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const result = await registerAction({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (!result.success) {
        toast({
          title: 'Registration failed',
          description: result.error ?? 'Please check your details and try again.',
          variant: 'destructive',
        });
        return;
      }

      // Auto sign-in after registration
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast({
          title: 'Account created!',
          description: 'Please sign in with your new credentials.',
        });
        router.push('/login');
      } else {
        toast({
          title: '🎉 Welcome to AI Toolbox!',
          description: 'Your account has been created.',
        });
        router.push('/dashboard');
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: string) => {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-1/3 top-1/4 w-[500px] h-[400px] bg-gradient-to-bl from-purple-500/15 via-brand-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md space-y-6">
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
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription>Free forever — no credit card required</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleOAuth('google')}
                disabled={!!oauthLoading}
                className="w-full"
                id="register-google"
              >
                {oauthLoading === 'google' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleOAuth('github')}
                disabled={!!oauthLoading}
                className="w-full"
                id="register-github"
              >
                {oauthLoading === 'github' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Github className="h-4 w-4 mr-2" />
                )}
                GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or register with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="register-form">
              <div className="space-y-1.5">
                <Label htmlFor="register-name">Full name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Jane Doe"
                  {...register('name')}
                  className={cn(errors.name && 'border-destructive')}
                  autoComplete="name"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={cn(errors.email && 'border-destructive')}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="At least 8 characters"
                  {...register('password')}
                  className={cn(errors.password && 'border-destructive')}
                  autoComplete="new-password"
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="register-confirm">Confirm password</Label>
                <Input
                  id="register-confirm"
                  type="password"
                  placeholder="Repeat your password"
                  {...register('confirmPassword')}
                  className={cn(errors.confirmPassword && 'border-destructive')}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-brand text-white hover:opacity-90 transition-opacity"
                disabled={isLoading}
                id="register-submit"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account…</>
                ) : (
                  <><UserPlus className="h-4 w-4 mr-2" /> Create account</>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-6">
            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline" id="register-login-link">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
