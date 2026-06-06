import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Bell, Palette, Shield, Trash2, Download } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your account preferences and settings.',
};

const SETTING_SECTIONS = [
  {
    icon: Palette,
    title: 'Appearance',
    description: 'Customise how AI Toolbox looks and feels.',
    items: [
      { label: 'Theme', value: 'System default', badge: null },
      { label: 'Language', value: 'English (US)', badge: null },
      { label: 'Font size', value: 'Medium', badge: null },
    ],
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Control when and how you receive notifications.',
    items: [
      { label: 'Email digests', value: 'Disabled', badge: null },
      { label: 'Usage alerts', value: 'Enabled', badge: 'default' as const },
      { label: 'Product updates', value: 'Disabled', badge: null },
    ],
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Manage your data and security preferences.',
    items: [
      { label: 'Conversation history', value: 'Saved locally', badge: null },
      { label: 'Usage analytics', value: 'Anonymous only', badge: 'secondary' as const },
      { label: 'Third-party sharing', value: 'Never', badge: null },
    ],
  },
];

const DANGER_ACTIONS = [
  {
    icon: Download,
    label: 'Export my data',
    description: 'Download a copy of all your data including conversations and images.',
    variant: 'outline' as const,
  },
  {
    icon: Trash2,
    label: 'Delete account',
    description: 'Permanently delete your account and all associated data. This cannot be undone.',
    variant: 'destructive' as const,
  },
];

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 shadow">
            <Settings className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your account preferences and privacy settings.
        </p>
      </div>

      <div className="space-y-6">
        {SETTING_SECTIONS.map(({ icon: Icon, title, description, items }) => (
          <Card key={title}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">{title}</CardTitle>
              </div>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {items.map((item, i) => (
                <div key={item.label}>
                  {i > 0 && <Separator className="my-2" />}
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                      {item.badge && (
                        <Badge variant={item.badge} className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            </div>
            <CardDescription>
              Irreversible actions that affect your account permanently.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {DANGER_ACTIONS.map((action, i) => (
              <div key={action.label}>
                {i > 0 && <Separator className="mb-3" />}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <action.icon
                      className={`h-4 w-4 mt-0.5 shrink-0 ${
                        action.variant === 'destructive'
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-4 italic">
              To perform these actions, please contact support at{' '}
              <a
                href="mailto:support@ai-toolbox.example.com"
                className="underline hover:text-foreground transition-colors"
              >
                support@ai-toolbox.example.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
