export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Next.js Starter
        </h1>
        <p className="mb-8 text-lg text-[var(--color-muted-foreground)]">
          TypeScript · Tailwind CSS · Supabase · Dev Containers
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[var(--color-border)] p-4 text-left transition-colors hover:border-[var(--color-foreground)]"
          >
            <h2 className="mb-2 font-semibold">Next.js Docs →</h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Learn about Next.js features and API.
            </p>
          </a>
          <a
            href="https://supabase.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[var(--color-border)] p-4 text-left transition-colors hover:border-[var(--color-foreground)]"
          >
            <h2 className="mb-2 font-semibold">Supabase Docs →</h2>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Connect your Supabase backend.
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}
