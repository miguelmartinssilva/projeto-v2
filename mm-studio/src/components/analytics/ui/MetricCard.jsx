import { motion } from "framer-motion";

export default function MetricCard({ label, value, icon: Icon, color, change, prefix = "", suffix = "", sparkData, delay = 0 }) {
  const isPositive = change !== undefined && change >= 0;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }}
      className="relative overflow-hidden bg-bg-card rounded-xl p-4 border border-border-card group hover:border-border-light transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"
        style={{ background: color }} />
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + "15" }}>
          <Icon size={15} style={{ color }} />
        </div>
        {change !== undefined && (
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
            {isPositive ? "+" : ""}{change}%
          </span>
        )}
      </div>
      <p className="text-lg font-bold text-text leading-none mb-1">{prefix}{value}{suffix}</p>
      <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{label}</p>
      {sparkData && sparkData.length > 0 && (
        <div className="mt-2 flex items-end gap-[2px] h-5">
          {sparkData.slice(-8).map((v, i) => {
            const max = Math.max(...sparkData.slice(-8));
            const h = max ? (v / max) * 20 : 0;
            return <div key={i} className="w-1 rounded-full opacity-40 group-hover:opacity-70 transition-opacity" style={{ height: h, background: color, minHeight: 2 }} />;
          })}
        </div>
      )}
    </motion.div>
  );
}
