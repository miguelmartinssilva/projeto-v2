import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MessageCircle, Camera, X, FileText, Star } from "lucide-react";
import { getClientes, getHistorico, getFixos } from "../utils/storage";
import FixedClients from "./FixedClients";

const statusColors = { ativo: "bg-success", pendente: "bg-pending", inativo: "bg-text-muted" };
const statusLabels = { ativo: "Ativo", pendente: "Pendente", inativo: "Inativo" };

export default function Clients() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("todos");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("clientes");

  const [fixosCount] = useState(() => getFixos().filter(c => c.ativo !== false).length);

  const { clients, statusCounts, clientHistory } = useMemo(() => {
    const raw = getClientes();
    const hist = getHistorico();

    const enriched = raw.map(c => {
      const props = hist.filter(h => h.cliente && h.cliente.toLowerCase().includes((c.nome || "").toLowerCase()));
      const total = props.reduce((s, h) => s + (h.total || 0), 0);
      return {
        id: c.id,
        name: c.nome || "Sem nome",
        company: c.empresa || "",
        phone: c.telefone || "",
        instagram: c.instagram || "",
        status: c.status || "pendente",
        totalSpent: `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        proposals: props.length,
        lastActivity: c.data || "",
      };
    });

    const counts = {
      todos: enriched.length,
      ativo: enriched.filter(c => c.status === "ativo").length,
      pendente: enriched.filter(c => c.status === "pendente").length,
    };

    return { clients: enriched, statusCounts: counts, clientHistory: hist };
  }, []);

  const filtered = clients.filter(c => {
    if (filter !== "todos" && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span> <span className="text-text-secondary font-medium">Clientes</span></p>
            <h1 className="text-xl font-display font-bold text-text">Clientes</h1>
          </div>
          <motion.button onClick={() => navigate("/orcamento")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
            <Plus size={18} /> Novo Orcamento
          </motion.button>
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button onClick={() => setTab("clientes")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all ${tab === "clientes" ? "bg-primary text-black font-bold" : "bg-bg-card border border-border-card text-text-muted hover:text-text"}`}>
            Clientes <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === "clientes" ? "bg-black/20 text-black/70" : "bg-bg-elevated text-text-muted"}`}>{clients.length}</span>
          </button>
          <button onClick={() => setTab("fixos")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all ${tab === "fixos" ? "bg-amber text-black font-bold" : "bg-bg-card border border-border-card text-text-muted hover:text-text"}`}>
            <Star size={13} /> Fixos <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === "fixos" ? "bg-black/20 text-black/70" : "bg-bg-elevated text-text-muted"}`}>{fixosCount}</span>
          </button>
          {tab === "clientes" && Object.entries(statusCounts).map(([key, count]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all ${filter === key ? "bg-primary text-black font-bold" : "bg-bg-card border border-border-card text-text-muted hover:text-text"}`}
            >
              {key === "todos" ? "Todos" : key === "ativo" ? "Ativos" : "Pendentes"}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === key ? "bg-black/20 text-black/70" : "bg-bg-elevated text-text-muted"}`}>{count}</span>
            </button>
          ))}
          {tab === "clientes" && <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-bg-card border border-border-card rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors w-56"
            />
          </div>}
        </div>

        {tab === "fixos" ? <FixedClients /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 * i }}
                  onClick={() => setSelected(selected?.id === c.id ? null : c)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${selected?.id === c.id ? "bg-primary/10 border-primary/40" : "bg-bg-card border-border-card hover:border-border-light"}`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-sm font-bold text-primary">
                      {c.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-card ${statusColors[c.status] || "bg-text-muted"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{c.name}</p>
                    <p className="text-xs text-text-muted truncate">{c.company}</p>
                    <p className="text-[11px] text-text-muted mt-0.5">{c.lastActivity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-display font-bold text-text">{c.totalSpent}</p>
                    <p className="text-[11px] text-text-muted">{c.proposals} orcamento{(c.proposals > 1 ? "s" : "")}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-text-muted">
                <Search size={32} className="mb-3 opacity-30" />
                <p className="text-sm">Nenhum cliente encontrado</p>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-bg-card rounded-xl p-6 card-border glow-primary h-fit lg:sticky lg:top-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-bg-elevated border-2 border-border-card flex items-center justify-center text-xl font-bold text-primary">
                      {selected.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <h2 className="text-lg font-display font-bold text-text">{selected.name}</h2>
                      <p className="text-sm text-text-muted">{selected.company}</p>
                      <span className={`inline-flex items-center gap-1 mt-1 text-xs ${selected.status === "ativo" ? "text-success" : selected.status === "pendente" ? "text-pending" : "text-text-muted"}`}>
                        <span className={`w-2 h-2 rounded-full ${statusColors[selected.status] || "bg-text-muted"}`} />
                        {statusLabels[selected.status]}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-text-muted hover:text-text p-1 rounded hover:bg-white/5"><X size={16} /></button>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                  {selected.phone && (
                    <a href={`https://wa.me/55${selected.phone.replace(/\D/g, "")}`} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors"><MessageCircle size={13} /> WhatsApp</a>
                  )}
                  {selected.instagram && (
                    <a href={`https://instagram.com/${selected.instagram.replace("@", "")}`} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-info/15 text-info hover:bg-info/25 transition-colors"><Camera size={13} /> Instagram</a>
                  )}
                  <button onClick={() => navigate("/orcamento")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-elevated border border-border-card text-text-secondary hover:text-text transition-colors"><FileText size={13} /> Novo Orcamento</button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-bg-elevated rounded-lg p-3 border border-border-card">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted mb-1">Total Gasto</p>
                    <p className="text-lg font-display font-bold text-primary">{selected.totalSpent}</p>
                  </div>
                  <div className="bg-bg-elevated rounded-lg p-3 border border-border-card">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted mb-1">Orcamentos</p>
                    <p className="text-lg font-display font-bold text-text">{selected.proposals}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-text mb-3">Historico de Orcamentos</h3>
                  {selected && (() => {
                    const props = clientHistory.filter(h => h.cliente && h.cliente.toLowerCase().includes((selected.name || "").toLowerCase()));
                    return props.length > 0 ? props.slice(0, 5).map((h, i) => (
                      <div key={i} className="flex items-center justify-between py-2.5 border-b border-border-card/30 last:border-0">
                        <div>
                          <p className="text-sm text-text font-medium">{h.itens?.[0]?.desc || h.numero || "Orcamento"}</p>
                          <p className="text-xs text-text-muted">{h.data}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-display font-bold text-text">R$ {(h.total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                          <span className={`text-[10px] font-semibold ${h.status === "aprovada" || h.status === "aprovado" || h.status === "pago" ? "text-success" : h.status === "pendente" ? "text-pending" : "text-text-muted"}`}>
                            {h.status === "aprovada" || h.status === "aprovado" ? "Aprovado" : h.status === "pago" ? "Pago" : h.status === "pendente" ? "Pendente" : h.status === "recusada" || h.status === "perdida" ? "Cancelado" : "Rascunho"}
                          </span>
                        </div>
                      </div>
                    )) : <p className="text-sm text-text-muted text-center py-4">Nenhum orcamento encontrado</p>;
                  })()}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 bg-bg-card rounded-xl card-border"
              >
                <UsersIcon className="mb-4 opacity-20" size={48} />
                <p className="text-sm text-text-muted">Selecione um cliente para ver os detalhes</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>)}
      </div>
    </div>
  );
}
function UsersIcon({ size, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
