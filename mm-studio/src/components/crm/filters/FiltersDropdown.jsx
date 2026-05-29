import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import useCrmStore, { STATUS_ORDER } from "../../../store/crmStore";
import { statusConfig } from "../ui/StatusBadge";

const tipoLabels = { avulso: "Avulso", mensal: "Mensal", pacote: "Pacote", projeto: "Projeto", retainer: "Retainer" };

export default function FiltersDropdown() {
  const { statusFilter, tipoFilter, setStatusFilter, setTipoFilter } = useCrmStore();
  const [open, setOpen] = useState(false);
  const hasFilters = statusFilter !== "todos" || tipoFilter !== "todos";

  const clearFilters = () => { setStatusFilter("todos"); setTipoFilter("todos"); };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${hasFilters ? "bg-primary/10 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>
        <Filter size={13} /> Filtros {hasFilters && <span className="w-4 h-4 rounded-full bg-primary text-bg text-[9px] font-bold flex items-center justify-center">!</span>}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 left-0 w-full sm:w-64 max-w-[calc(100vw-2rem)] bg-bg-card rounded-xl border border-border-card shadow-2xl z-40 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text">Filtros</span>
                {hasFilters && <button onClick={clearFilters} className="text-[10px] text-danger hover:underline">Limpar</button>}
              </div>
              <div className="space-y-3">
                <div>
                  <span className="field-label">Status</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setStatusFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${statusFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todos</button>
                    {STATUS_ORDER.map(s => {
                      const sc = statusConfig[s];
                      return <button key={s} onClick={() => setStatusFilter(s)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${statusFilter === s ? `${sc.bg} ${sc.text}` : "bg-white/5 text-text-muted hover:text-text"}`}>{sc.label}</button>;
                    })}
                  </div>
                </div>
                <div>
                  <span className="field-label">Tipo de cliente</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setTipoFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${tipoFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todos</button>
                    {Object.entries(tipoLabels).map(([k, v]) => (
                      <button key={k} onClick={() => setTipoFilter(k)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${tipoFilter === k ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
