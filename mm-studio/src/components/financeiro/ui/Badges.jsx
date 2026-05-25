import { motion } from "framer-motion";
import { TIPO_CONFIG, STATUS_CONFIG, CATEGORIAS } from "../../../store/financeiroStore";

export function TipoBadge({ tipo, size = "sm" }) {
  const cfg = TIPO_CONFIG[tipo] || TIPO_CONFIG.entrada;
  return (
    <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1 rounded-md font-semibold ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`}
      style={{ background: cfg.bg, color: cfg.color }}>
      <span className="text-[8px]">{cfg.icon}</span>
      {cfg.label}
    </motion.span>
  );
}

export function StatusBadge({ status, size = "sm" }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pendente;
  return (
    <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-md font-semibold ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`}
      style={{ background: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </motion.span>
  );
}

export function CategoryBadge({ categoria, tipo = "saida" }) {
  const allCats = [...CATEGORIAS.entrada, ...CATEGORIAS.saida];
  const cfg = allCats.find(c => c.key === categoria) || { label: categoria, color: "#94a3b8" };
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold"
      style={{ background: cfg.color + "18", color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

export { TIPO_CONFIG, STATUS_CONFIG };
