import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { useState } from "react";
import useComercialStore, { PIPELINE_STAGES, PRIORITIES, VENDEDORES } from "../../../store/comercialStore";

export default function FiltersDropdown() {
  const { stageFilter, prioridadeFilter, responsavelFilter, setStageFilter, setPrioridadeFilter, setResponsavelFilter } = useComercialStore();
  const [open, setOpen] = useState(false);
  const hasFilters = stageFilter !== "todos" || prioridadeFilter !== "todos" || responsavelFilter !== "todos";

  const clear = () => { setStageFilter("todos"); setPrioridadeFilter("todos"); setResponsavelFilter("todos"); };

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
              className="absolute right-0 top-full mt-2 w-72 bg-bg-card rounded-xl border border-border-card shadow-2xl z-40 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text">Filtros</span>
                {hasFilters && <button onClick={clear} className="text-[10px] text-danger hover:underline">Limpar</button>}
              </div>
              <div className="space-y-4">
                <div>
                  <span className="field-label">Etapa Pipeline</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setStageFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${stageFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todos</button>
                    {PIPELINE_STAGES.map(s => (
                      <button key={s.key} onClick={() => setStageFilter(s.key)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${stageFilter === s.key ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={stageFilter === s.key ? { background: s.color + "18", color: s.color } : {}}>{s.label.split(" ").pop()}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Prioridade</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setPrioridadeFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${prioridadeFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todas</button>
                    {PRIORITIES.map(p => (
                      <button key={p.key} onClick={() => setPrioridadeFilter(p.key)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${prioridadeFilter === p.key ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={prioridadeFilter === p.key ? { background: p.color + "18", color: p.color } : {}}>{p.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Responsavel</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setResponsavelFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${responsavelFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todos</button>
                    {VENDEDORES.map(v => (
                      <button key={v.id} onClick={() => setResponsavelFilter(v.id)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${responsavelFilter === v.id ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={responsavelFilter === v.id ? { background: v.cor + "18", color: v.cor } : {}}>{v.nome.split(" ")[0]}</button>
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
