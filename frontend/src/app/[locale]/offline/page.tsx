"use client";
 
export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center bg-background">
      <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center">
        <span className="text-4xl" role="img" aria-label="Seedling">🌱</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">You are offline</h1>
        <p className="text-muted-foreground max-w-sm">
          No internet connection right now. Your recent data is still available — return online to sync fresh information.
        </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2.5 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        Try Again
      </button>
    </main>
  );
}
 