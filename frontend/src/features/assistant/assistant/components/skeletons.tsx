'use client';

import React from 'react';

export const AssistantSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    {/* Hero skeleton */}
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-zinc-800 rounded w-48" />
          <div className="h-3.5 bg-zinc-800 rounded w-72" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-zinc-800 rounded-full" />
          <div className="h-6 w-20 bg-zinc-800 rounded-full" />
          <div className="h-6 w-20 bg-zinc-800 rounded-full" />
        </div>
      </div>
    </div>

    {/* Workspace skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 h-[500px]">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
        <div className="h-4 bg-zinc-800 rounded w-24" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-zinc-800 rounded w-28" />
            <div className="h-2.5 bg-zinc-800 rounded w-36" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-zinc-800 rounded-lg" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-zinc-800 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900" />
    </div>
  </div>
);

export const MessageSkeleton: React.FC = () => (
  <div className="space-y-4 p-4 animate-pulse">
    {[false, true, false].map((isRight, i) => (
      <div key={i} className={`flex gap-3 ${isRight ? 'flex-row-reverse' : ''}`}>
        <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0" />
        <div className={`space-y-2 max-w-xs ${isRight ? 'items-end' : ''} flex flex-col`}>
          <div
            className={`h-16 rounded-2xl bg-zinc-800 ${isRight ? 'w-48' : 'w-72'}`}
          />
          <div className="h-2 w-12 bg-zinc-800 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export const MemorySkeleton: React.FC = () => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-zinc-800 rounded" />
      <div className="h-4 bg-zinc-800 rounded w-28" />
    </div>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-zinc-800" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-zinc-800 rounded w-32" />
        <div className="h-2.5 bg-zinc-800 rounded w-24" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-2">
      {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-zinc-800 rounded-lg" />)}
    </div>
  </div>
);
