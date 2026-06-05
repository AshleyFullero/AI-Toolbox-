'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getInitials } from '@/lib/utils';
import {
  Bot,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-background/0'
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:block">AI Toolbox</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/chat"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Chat
              </Link>
              <Link
                href="/dashboard/image"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Images
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 rounded-full"
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                  id="user-menu-trigger"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={session.user?.image ?? ''}
                      alt={session.user?.name ?? 'User'}
                    />
                    <AvatarFallback className="bg-gradient-brand text-white text-sm font-semibold">
                      {getInitials(session.user?.name ?? session.user?.email ?? 'U')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer" id="nav-dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="cursor-pointer" id="nav-profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer" id="nav-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/#pricing" className="cursor-pointer" id="nav-upgrade">
                    <Zap className="mr-2 h-4 w-4 text-brand-500" />
                    <span className="text-brand-500 font-medium">Upgrade to Pro</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      New
                    </Badge>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  id="nav-signout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login" id="nav-login">Sign in</Link>
              </Button>
              <Button
                size="sm"
                className="bg-gradient-brand hover:opacity-90 transition-opacity text-white"
                asChild
              >
                <Link href="/register" id="nav-register">Get started</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="container py-4 flex flex-col gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/chat"
                  className="text-sm font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Chat
                </Link>
                <Link
                  href="/dashboard/image"
                  className="text-sm font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Images
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-gradient-brand text-white hover:opacity-90"
                  asChild
                >
                  <Link href="/register">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
