import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href={ROUTES.HOME}>Go home</Link>
        </Button>
        <Button asChild>
          <Link href={ROUTES.LOGIN}>Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
