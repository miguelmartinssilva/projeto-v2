import { motion } from "framer-motion";
import { GripVertical, User, Calendar, TrendingUp } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PrioridadeBadge } from "../ui/Badges";
import { VENDEDORES } from "../../../store/comercialStore";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function DealCard({ deal, onClick, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: deal.id, data: { stage: deal.stage } });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const vendedor = VENDEDORES.find(v => v.id === deal.responsavel) || VENDEDORES[0];

  return (
    <motion.div ref={setNodeRef} style={style} layout
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className={`bg-bg-card rounded-xl p-3 border border-border-card cursor-grab active:cursor-grabbing hover:border-border-light transition-all duration-200 group ${isDragging ? "shadow-xl ring-1 ring-primary/20" : ""}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-white/5 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0">
            <GripVertical size={12} className="text-text-muted" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-text truncate">{deal.cliente}</p>
            {deal.empresa && <p className="text-[10px] text-text-muted truncate">{deal.empresa}</p>}
          </div>
        </div>
        <PrioridadeBadge prioridade={deal.prioridade} />
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-bold text-primary">{fmt(deal.valor)}</span>
        {deal.probabilidade > 0 && deal.probabilidade < 100 && (
          <span className="text-[9px] text-text-muted flex items-center gap-0.5"><TrendingUp size={9} />{deal.probabilidade}%</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
            style={{ background: vendedor.cor + "20", color: vendedor.cor }}>{vendedor.avatar}</div>
          <span className="text-[10px] text-text-muted">{vendedor.nome.split(" ")[0]}</span>
        </div>
        {deal.proximaAcao && (
          <span className="text-[9px] text-text-muted flex items-center gap-0.5 truncate max-w-[100px]"><Calendar size={8} />{deal.proximaAcao}</span>
        )}
      </div>

      {deal.tags && deal.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-2 pt-2 border-t border-border-card/40">
          {deal.tags.slice(0, 3).map(t => <span key={t} className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] text-text-muted">{t}</span>)}
        </div>
      )}
    </motion.div>
  );
}
