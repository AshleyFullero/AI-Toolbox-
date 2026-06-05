'use server';

import { signIn, signOut } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Server action: Register a new user with email/password.
 */
export async function registerAction(formData: {
  name: string;
  email: string;
  password: string;
}): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, password } = parsed.data;

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: 'Something went wrong. Please try again.' };
  }
}

/**
 * Server action: Sign in with email/password credentials.
 */
export async function loginAction(formData: {
  email: string;
  password: string;
}): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/dashboard',
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Invalid email or password.' };
        default:
          return { success: false, error: 'Authentication failed. Please try again.' };
      }
    }
    // If it's a redirect, re-throw it so Next.js can handle it
    throw error;
  }
}

/**
 * Server action: Sign in with OAuth provider.
 */
export async function oauthSignInAction(provider: 'google' | 'github') {
  await signIn(provider, { redirectTo: '/dashboard' });
}

/**
 * Server action: Sign out the current user.
 */
export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
