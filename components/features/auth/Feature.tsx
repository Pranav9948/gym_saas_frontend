export function Feature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-3">
      <div className="text-primary">{icon}</div>
      <span className="text-xs sm:text-sm font-medium">{text}</span>
    </div>
  );
}