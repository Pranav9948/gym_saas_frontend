import React from 'react';

interface GlobalErrorUIProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function GlobalErrorUI({
  title,
  description,
  actions,
}: GlobalErrorUIProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description ? (
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  );
}
