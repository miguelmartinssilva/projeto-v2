import { motion } from "framer-motion";
import { PRIORIDADES, CATEGORIAS_EVENTO, CATEGORIAS_TAREFA, STATUS_TAREFA, STATUS_EVENTO } from "../../../store/agendaStore";

export function PriorityBadge({ prioridade }) {
  const cfg = PRIORIDADES.find(p => p.key === prioridade) || PRIORIDADES[2];
  return (
    <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }}
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </motion.span>
  );
}

export function EventCategoryBadge({ categoria }) {
  const cfg = CATEGORIAS_EVENTO.find(c => c.key === categoria) || CATEGORIAS_EVENTO[9];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

export function TaskCategoryBadge({ categoria }) {
  const cfg = CATEGORIAS_TAREFA.find(c => c.key === categoria) || CATEGORIAS_TAREFA[6];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold"
      style={{ background: cfg.color + "18", color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

export function TaskStatusBadge({ status }) {
  const cfg = STATUS_TAREFA.find(s => s.key === status) || STATUS_TAREFA[0];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md font-semibold px-2 py-0.5 text-[10px]"
      style={{ background: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

export function EventStatusBadge({ status }) {
  const cfg = STATUS_EVENTO.find(s => s.key === status) || STATUS_EVENTO[0];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md font-semibold px-2 py-0.5 text-[10px]"
      style={{ background: cfg.bg, color: cfg.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}
