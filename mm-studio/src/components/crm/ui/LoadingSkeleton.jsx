export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="flex gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-bg-elevated rounded-xl flex-1" />
        ))}
      </div>
      <div className="h-10 bg-bg-elevated rounded-xl w-full" />
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-14 bg-bg-elevated rounded-lg w-full" />
      ))}
    </div>
  );
}
