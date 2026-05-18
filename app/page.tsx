import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/config/routes';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Gym Manager</CardTitle>
          <CardDescription>
            Modern gym management platform for fitness centers
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href={ROUTES.LOGIN}>Sign In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={ROUTES.REGISTER}>Create Account</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}