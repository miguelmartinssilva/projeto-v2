import { motion } from "framer-motion";
import { PIPELINE_STAGES, PRIORITIES } from "../../../store/comercialStore";

const stageConfig = {};
PIPELINE_STAGES.forEach(s => {
  stageConfig[s.key] = { label: s.label, bg: `${s.color}18`, text: s.color, dot: s.color };
});

const prioridadeConfig = {};
PRIORITIES.forEach(p => {
  prioridadeConfig[p.key] = { label: p.label, bg: `${p.color}18`, text: p.color };
});

export function StageBadge({ stage, size = "sm" }) {
  const cfg = stageConfig[stage] || stageConfig.novo_lead;
  return (
    <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-md font-semibold ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`}
      style={{ background: cfg.bg, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </motion.span>
  );
}

export function PrioridadeBadge({ prioridade }) {
  const cfg = prioridadeConfig[prioridade] || prioridadeConfig.media;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>
  );
}

export { stageConfig, prioridadeConfig };
