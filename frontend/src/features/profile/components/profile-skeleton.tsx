export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-muted" />
            <div className="h-4 w-40 bg-muted rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-9 bg-muted rounded-lg" />
            <div className="h-9 bg-muted rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
