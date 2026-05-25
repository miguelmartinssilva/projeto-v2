import { motion } from "framer-motion";

export default function LoadingSkeleton() {
  return (
    <div className="flex-1 min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2"><div className="h-6 w-48 rounded bg-bg-elevated animate-pulse" /><div className="h-3 w-32 rounded bg-bg-elevated animate-pulse" /></div>
          <div className="h-10 w-40 rounded-xl bg-bg-elevated animate-pulse" />
        </div>
        <div className="grid grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-bg-elevated animate-pulse" />)}</div>
        <div className="h-96 rounded-2xl bg-bg-elevated animate-pulse" />
      </div>
    </div>
  );
}
