import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { useState } from "react";
import useDashboardStore, { PERIODOS, RESPONSAVEIS } from "../../../store/dashboardStore";

export default function FiltersDropdown() {
  const { periodo, responsavelFilter, setPeriodo, setResponsavelFilter } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const hasFilters = responsavelFilter !== "todos";

  const clear = () => { setResponsavelFilter("todos"); };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${hasFilters ? "bg-primary/10 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>
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
                {hasFilters && <button onClick={clear} className="text-[10px] text-danger hover:underline">Limpar</button>}
              </div>
              <div className="space-y-4">
                <div>
                  <span className="field-label">Periodo</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {PERIODOS.map(p => (
                      <button key={p.key} onClick={() => setPeriodo(p.key)}
                        className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${periodo === p.key ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Equipe</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setResponsavelFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${responsavelFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todos</button>
                    {RESPONSAVEIS.map(r => (
                      <button key={r.id} onClick={() => setResponsavelFilter(r.id)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${responsavelFilter === r.id ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={responsavelFilter === r.id ? { background: r.cor + "18", color: r.cor } : {}}>{r.nome.split(" ")[0]}</button>
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
