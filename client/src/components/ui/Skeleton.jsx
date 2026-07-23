export const Skeleton = ({ className = "" }) => (
  <div className={`skeleton rounded-lg ${className}`} />
);

export const CardSkeleton = () => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-9 w-full mt-2" />
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
    <Skeleton className="h-9 w-9 rounded-xl" />
    <Skeleton className="h-7 w-16" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export default Skeleton;
