import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { useState } from "react";
import useAgendaStore, { PRIORIDADES, CATEGORIAS_EVENTO, RESPONSAVEIS, STATUS_EVENTO } from "../../../store/agendaStore";

export default function FiltersDropdown() {
  const { tipoFilter, prioridadeFilter, responsavelFilter, statusFilter, setTipoFilter, setPrioridadeFilter, setResponsavelFilter, setStatusFilter } = useAgendaStore();
  const [open, setOpen] = useState(false);
  const hasFilters = tipoFilter !== "todos" || prioridadeFilter !== "todos" || responsavelFilter !== "todos" || statusFilter !== "todos";

  const clear = () => { setTipoFilter("todos"); setPrioridadeFilter("todos"); setResponsavelFilter("todos"); setStatusFilter("todos"); };

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
              className="absolute right-0 top-full mt-2 left-0 w-full sm:w-72 max-w-[calc(100vw-2rem)] bg-bg-card rounded-xl border border-border-card shadow-2xl z-40 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text">Filtros</span>
                {hasFilters && <button onClick={clear} className="text-[10px] text-danger hover:underline">Limpar</button>}
              </div>
              <div className="space-y-4">
                <div>
                  <span className="field-label">Tipo Evento</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setTipoFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${tipoFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todos</button>
                    {CATEGORIAS_EVENTO.map(c => (
                      <button key={c.key} onClick={() => setTipoFilter(c.key)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${tipoFilter === c.key ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={tipoFilter === c.key ? { background: c.bg, color: c.color } : {}}>{c.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Prioridade</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setPrioridadeFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${prioridadeFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todas</button>
                    {PRIORIDADES.map(p => (
                      <button key={p.key} onClick={() => setPrioridadeFilter(p.key)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${prioridadeFilter === p.key ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={prioridadeFilter === p.key ? { background: p.bg, color: p.color } : {}}>{p.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Responsavel</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setResponsavelFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${responsavelFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todos</button>
                    {RESPONSAVEIS.map(r => (
                      <button key={r.id} onClick={() => setResponsavelFilter(r.id)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${responsavelFilter === r.id ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={responsavelFilter === r.id ? { background: r.cor + "18", color: r.cor } : {}}>{r.nome.split(" ")[0]}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Status</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setStatusFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${statusFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todos</button>
                    {STATUS_EVENTO.map(s => (
                      <button key={s.key} onClick={() => setStatusFilter(s.key)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${statusFilter === s.key ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={statusFilter === s.key ? { background: s.bg, color: s.color } : {}}>{s.label}</button>
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
