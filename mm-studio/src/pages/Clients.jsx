import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MessageCircle, Camera, X, FileText } from "lucide-react";

const clients = [
  { id: 1, name: "Ana Souza", company: "Studio Criativo", phone: "(63) 99999-1111", instagram: "@anacriativa", status: "ativo", totalSpent: "R$ 4.800", proposals: 3, lastActivity: "2 dias atras" },
  { id: 2, name: "Barbearia King", company: "Barbearia King Ltda", phone: "(63) 99999-2222", instagram: "@barbeariaking", status: "ativo", totalSpent: "R$ 2.400", proposals: 2, lastActivity: "5 dias atras" },
  { id: 3, name: "Dra. Patricia", company: "Consultorio Odontologico", phone: "(63) 99999-3333", instagram: "@drapatricia", status: "pendente", totalSpent: "R$ 3.600", proposals: 1, lastActivity: "8 dias atras" },
  { id: 4, name: "Festa Junina", company: "Eventos LTDA", phone: "(63) 99999-4444", instagram: "@festajunina", status: "pendente", totalSpent: "R$ 800", proposals: 1, lastActivity: "12 dias atras" },
  { id: 5, name: "Academia Fit", company: "Academia Fit Plus", phone: "(63) 99999-5555", instagram: "@academiafit", status: "ativo", totalSpent: "R$ 3.000", proposals: 3, lastActivity: "15 dias atras" },
  { id: 6, name: "Restaurante Sabor", company: "Restaurante Sabor & Arte", phone: "(63) 99999-6666", instagram: "@saborarte", status: "inativo", totalSpent: "R$ 4.800", proposals: 2, lastActivity: "30 dias atras" },
];

const statusColors = { ativo: "bg-success", pendente: "bg-pending", inativo: "bg-text-muted" };
const statusLabels = { ativo: "Ativo", pendente: "Pendente", inativo: "Inativo" };
const statusCounts = { todos: clients.length, ativo: clients.filter(c => c.status === "ativo").length, pendente: clients.filter(c => c.status === "pendente").length };

const tabs = [
  { key: "todos", label: "Todos", count: statusCounts.todos },
  { key: "ativo", label: "Ativos", count: statusCounts.ativo },
  { key: "pendente", label: "Pendentes", count: statusCounts.pendente },
];

export default function Clients() {
  const [filter, setFilter] = useState("todos");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

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
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
            <Plus size={18} /> Novo Cliente
          </motion.button>
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all ${filter === t.key ? "bg-primary text-black font-bold" : "bg-bg-card border border-border-card text-text-muted hover:text-text"}`}
            >
              {t.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === t.key ? "bg-black/20 text-black/70" : "bg-bg-elevated text-text-muted"}`}>{t.count}</span>
            </button>
          ))}
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Buscar cliente... (Ctrl+K)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-bg-card border border-border-card rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors w-56"
            />
          </div>
        </div>

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

                <div className="flex gap-2 mb-6">
                  <a href={`https://wa.me/55${selected.phone.replace(/\D/g, "")}`} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors"><MessageCircle size={13} /> WhatsApp</a>
                  <a href={`https://instagram.com/${selected.instagram.replace("@", "")}`} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-info/15 text-info hover:bg-info/25 transition-colors"><Camera size={13} /> Instagram</a>
                  <a href="#" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-elevated border border-border-card text-text-secondary hover:text-text transition-colors"><FileText size={13} /> Novo Orcamento</a>
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
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-border-card/30 last:border-0">
                      <div>
                        <p className="text-sm text-text font-medium">Identidade Visual</p>
                        <p className="text-xs text-text-muted">15/05/2026</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-display font-bold text-text">R$ 2.400</p>
                        <span className="text-[10px] text-success font-semibold">Aprovado</span>
                      </div>
                    </div>
                  ))}
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
        </div>
      </div>
    </div>
  );
}
function UsersIcon({ size, className }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
