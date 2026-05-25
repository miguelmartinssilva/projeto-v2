import { motion } from "framer-motion";

const statusConfig = {
  lead: { label: "Lead", bg: "bg-slate-500/15", text: "text-slate-300", dot: "bg-slate-400", glow: "shadow-slate-500/20" },
  contato: { label: "Contato", bg: "bg-blue-500/15", text: "text-blue-400", dot: "bg-blue-400", glow: "shadow-blue-500/20" },
  proposta: { label: "Proposta", bg: "bg-purple-500/15", text: "text-purple-400", dot: "bg-purple-400", glow: "shadow-purple-500/20" },
  negociacao: { label: "Negociacao", bg: "bg-amber-500/15", text: "text-amber-400", dot: "bg-amber-400", glow: "shadow-amber-500/20" },
  fechado: { label: "Fechado", bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400", glow: "shadow-emerald-500/20" },
  perdido: { label: "Perdido", bg: "bg-red-500/15", text: "text-red-400", dot: "bg-red-400", glow: "shadow-red-500/20" },
};

export default function StatusBadge({ status, size = "sm" }) {
  const cfg = statusConfig[status] || statusConfig.lead;
  return (
    <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`inline-flex items-center gap-1.5 rounded-md font-semibold shadow-sm ${cfg.bg} ${cfg.text} ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </motion.span>
  );
}

export { statusConfig };
