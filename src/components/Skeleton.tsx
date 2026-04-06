export function PromptCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-100" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-100 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 w-12 bg-slate-100 rounded" />
          <div className="h-5 w-12 bg-slate-100 rounded" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-slate-50 mt-4">
          <div className="h-6 w-24 bg-slate-100 rounded" />
          <div className="h-9 w-20 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function PromptGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PromptCardSkeleton key={i} />
      ))}
    </div>
  );
}
export function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-slate-100 rounded-2xl" />
      <div className="space-y-3">
        <div className="h-6 bg-slate-100 rounded w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-3/4" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          <div className="h-4 bg-slate-100 rounded flex-1" />
          <div className="h-4 bg-slate-100 rounded w-20" />
          <div className="h-4 bg-slate-100 rounded w-16" />
          <div className="h-4 bg-slate-100 rounded w-24" />
        </div>
      ))}
    </div>
  );
}