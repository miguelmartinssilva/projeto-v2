import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, GripVertical } from "lucide-react";
import useCrmStore, { STATUS_ORDER } from "../../../store/crmStore";
import { statusConfig } from "../ui/StatusBadge";
const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function KanbanBoard() {
  const { getKanbanColumns, openDrawer, moveClientStatus } = useCrmStore();
  const columns = getKanbanColumns();
  const [dragId, setDragId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const onDragStart = (e, clientId) => {
    setDragId(clientId);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, col) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(col);
  };

  const onDrop = (e, col) => {
    e.preventDefault();
    if (dragId) moveClientStatus(dragId, col);
    setDragId(null);
    setDragOverCol(null);
  };

  const onDragEnd = () => {
    setDragId(null);
    setDragOverCol(null);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 min-h-[500px]">
      {STATUS_ORDER.map(col => {
        const cfg = statusConfig[col];
        const items = columns[col] || [];
        return (
          <div key={col} className={`flex-shrink-0 w-[260px] rounded-xl transition-all duration-200 ${dragOverCol === col ? "bg-bg-elevated/80 ring-1 ring-primary/30" : "bg-bg-card/50"}`}
            onDragOver={e => onDragOver(e, col)} onDrop={e => onDrop(e, col)} onDragLeave={() => setDragOverCol(null)}>
            <div className="flex items-center justify-between px-3 py-3 border-b border-border-card/40">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className="text-xs font-semibold text-text">{cfg.label}</span>
                <span className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded-md">{items.length}</span>
              </div>
            </div>
            <div className="p-2 space-y-2 min-h-[200px]">
              <AnimatePresence>
                {items.map(client => (
                  <motion.div key={client.id} layout draggable onDragStart={e => onDragStart(e, client.id)} onDragEnd={onDragEnd}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => openDrawer(client)}
                    className={`bg-bg-card rounded-xl p-3 border border-border-card cursor-grab active:cursor-grabbing hover:border-border-light transition-all duration-200 group ${dragId === client.id ? "opacity-40" : ""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <GripVertical size={12} className="text-text-muted opacity-0 group-hover:opacity-50 flex-shrink-0" />
                        <div className="w-6 h-6 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-[8px] font-bold text-primary flex-shrink-0">
                          {client.nome?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-text truncate">{client.nome}</p>
                          {client.empresa && <p className="text-[10px] text-text-muted truncate">{client.empresa}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {(client.tags || []).slice(0, 2).map(t => (
                          <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted">{t}</span>
                        ))}
                      </div>
                      {client.receita > 0 && <span className="text-[10px] font-semibold text-primary">{fmt(client.receita)}</span>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
