import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Zap } from "lucide-react";

const cards = [
  { icon: DollarSign, label: "Receita Mensal", value: "R$ 12.400", change: "+24%", color: "#22c55e", delay: 0 },
  { icon: Users, label: "Clientes Ativos", value: "8", change: "+42%", color: "#ffb800", delay: 0.15 },
  { icon: TrendingUp, label: "Conversao", value: "67%", change: "+8%", color: "#8b5cf6", delay: 0.3 },
  { icon: Zap, label: "Automacoes", value: "7", change: "+5", color: "#ec4899", delay: 0.45 },
];

export default function FloatingCards() {
  return (
    <div className="relative w-full max-w-sm mx-auto space-y-3">
      {cards.map((c, i) => (
        <motion.div key={c.label}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + c.delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          whileHover={{ scale: 1.02, x: 4 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm shadow-lg">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: c.color + "15" }}>
            <c.icon size={16} style={{ color: c.color }} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-text-muted uppercase tracking-wider">{c.label}</p>
            <p className="text-sm font-bold text-text">{c.value}</p>
          </div>
          <span className="text-[10px] font-semibold text-emerald-400">{c.change}</span>
        </motion.div>
      ))}
    </div>
  );
}
