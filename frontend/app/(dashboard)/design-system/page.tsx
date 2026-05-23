'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTheme } from '@/components/theme/ThemeProvider';

export default function DesignSystemPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-[var(--af-text-primary)]">Design System</h1>
        <p className="text-sm text-[var(--af-text-muted)] mt-1">
          Phase 1 tokens & components — theme: {theme}
        </p>
        <div className="flex gap-2 mt-4">
          {(['dark', 'light', 'amoled'] as const).map((t) => (
            <Button
              key={t}
              variant={theme === t ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTheme(t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <Card glow>
        <CardHeader>
          <h2 className="text-sm font-semibold">Buttons</h2>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ai" aiProcessing>
            AI Processing
          </Button>
          <Button loading>Loading</Button>
          <Button variant="danger">Danger</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold">Inputs & badges</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Search..." />
          <div className="flex gap-2 flex-wrap">
            <Badge>Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="ai">AI</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </CardContent>
      </Card>

      <p className="text-xs text-[var(--af-text-muted)]">
        Press ⌘K anywhere in the dashboard for the command palette.
      </p>
    </div>
  );
}
