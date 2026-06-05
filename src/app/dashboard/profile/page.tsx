import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getInitials, formatDate } from '@/lib/utils';
import { Calendar, Mail, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your profile and account settings.',
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
      _count: {
        select: {
          chatHistories: true,
          imageGenerations: true,
        },
      },
    },
  });

  if (!user) redirect('/login');

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="space-y-6">
        {/* Profile card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                <AvatarImage src={user.image ?? ''} alt={user.name ?? 'User'} />
                <AvatarFallback className="bg-gradient-brand text-white text-xl font-bold">
                  {getInitials(user.name ?? user.email ?? 'U')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{user.name ?? 'Anonymous'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge variant="secondary" className="mt-1">
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Member since {formatDate(user.createdAt)}
            </div>
          </CardContent>
        </Card>

        {/* Usage stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Usage Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <div className="text-2xl font-bold">{user._count.chatHistories}</div>
                <div className="text-sm text-muted-foreground">Chat sessions</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <div className="text-2xl font-bold">{user._count.imageGenerations}</div>
                <div className="text-sm text-muted-foreground">Images generated</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{user.subscription?.plan ?? 'FREE'} Plan</p>
                <p className="text-sm text-muted-foreground">
                  Status: {user.subscription?.status ?? 'ACTIVE'}
                </p>
              </div>
              <Badge
                variant={user.subscription?.plan === 'FREE' ? 'secondary' : 'default'}
                className={
                  user.subscription?.plan !== 'FREE'
                    ? 'bg-gradient-brand text-white border-0'
                    : ''
                }
              >
                {user.subscription?.plan ?? 'FREE'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
