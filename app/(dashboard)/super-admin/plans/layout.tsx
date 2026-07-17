export default function PlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl  flex items-center justify-center">
          <div className="rounded-xl bg-background p-4 shadow-lg sm:p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}