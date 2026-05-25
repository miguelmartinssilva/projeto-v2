import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { useState } from "react";
import useFinanceiroStore, { CATEGORIAS, CONTAS, STATUS_CONFIG } from "../../../store/financeiroStore";

export default function FiltersDropdown() {
  const { tipoFilter, statusFilter, categoriaFilter, contaFilter, setTipoFilter, setStatusFilter, setCategoriaFilter, setContaFilter } = useFinanceiroStore();
  const [open, setOpen] = useState(false);
  const hasFilters = tipoFilter !== "todos" || statusFilter !== "todos" || categoriaFilter !== "todos" || contaFilter !== "todos";

  const clear = () => { setTipoFilter("todos"); setStatusFilter("todos"); setCategoriaFilter("todos"); setContaFilter("todos"); };

  const allCats = [...CATEGORIAS.entrada, ...CATEGORIAS.saida];

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
                  <span className="field-label">Tipo</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setTipoFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${tipoFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todos</button>
                    <button onClick={() => setTipoFilter("entrada")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${tipoFilter === "entrada" ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                      style={tipoFilter === "entrada" ? { background: "#22c55e18", color: "#22c55e" } : {}}>Entrada</button>
                    <button onClick={() => setTipoFilter("saida")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${tipoFilter === "saida" ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                      style={tipoFilter === "saida" ? { background: "#ff4d6d18", color: "#ff4d6d" } : {}}>Saida</button>
                  </div>
                </div>
                <div>
                  <span className="field-label">Status</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setStatusFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${statusFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todos</button>
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                      <button key={key} onClick={() => setStatusFilter(key)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${statusFilter === key ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={statusFilter === key ? { background: cfg.bg, color: cfg.color } : {}}>{cfg.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Categoria</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setCategoriaFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${categoriaFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todas</button>
                    {allCats.map(c => (
                      <button key={c.key} onClick={() => setCategoriaFilter(c.key)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${categoriaFilter === c.key ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={categoriaFilter === c.key ? { background: c.color + "18", color: c.color } : {}}>{c.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Conta</span>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <button onClick={() => setContaFilter("todos")} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${contaFilter === "todos" ? "bg-primary/15 text-primary" : "bg-white/5 text-text-muted hover:text-text"}`}>Todas</button>
                    {CONTAS.map(c => (
                      <button key={c.key} onClick={() => setContaFilter(c.key)} className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${contaFilter === c.key ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                        style={contaFilter === c.key ? { background: c.color + "18", color: c.color } : {}}>{c.label}</button>
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
