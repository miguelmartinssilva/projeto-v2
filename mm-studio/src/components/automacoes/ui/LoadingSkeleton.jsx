import { motion } from "framer-motion";

export default function LoadingSkeleton() {
  return (
    <div className="flex-1 min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between"><div className="space-y-2"><div className="h-3 w-32 bg-white/5 rounded" /><div className="h-6 w-48 bg-white/5 rounded" /></div><div className="h-10 w-32 bg-white/5 rounded-xl" /></div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">{Array(6).fill(0).map((_, i) => <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }} className="h-24 bg-white/[0.03] rounded-xl" />)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{Array(3).fill(0).map((_, i) => <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }} className="h-64 bg-white/[0.03] rounded-2xl" />)}</div>
      </div>
    </div>
  );
}
