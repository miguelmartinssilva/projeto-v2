import { useState, useMemo } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, MessageCircle, Camera, Trash2, Edit3, X, Star } from "lucide-react";
import { getClientes, saveClientes, getHistorico, getFixos } from "../utils/storage";
import FixedClients from "./FixedClients";

const statusColors = { ativo: "bg-success", pendente: "bg-pending", inativo: "bg-text-muted" };
const statusLabels = { ativo: "Ativo", pendente: "Pendente", inativo: "Inativo" };

const emptyForm = { nome: "", empresa: "", telefone: "", instagram: "", status: "pendente" };

export default function Clients() {
  const [tab, setTab] = useState("clientes");
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { clients, totalClients, ativos, pendentes, fixosCount } = useMemo(() => {
    const raw = getClientes();
    const hist = getHistorico();
    const fixos = getFixos().filter(c => c.ativo !== false).length;
    const enriched = raw.map(c => {
      const props = hist.filter(h => h.cliente && c.nome && h.cliente.toLowerCase().split(/\s+/).some(w => w === c.nome.toLowerCase()));
      return {
        id: c.id, name: c.nome || "Sem nome", company: c.empresa || "", phone: c.telefone || "",
        instagram: c.instagram || "", status: c.status || "pendente",
        totalSpent: props.reduce((s, h) => s + (h.total || 0), 0),
        proposals: props.length, lastActivity: c.data || "",
      };
    });
    return {
      clients: enriched,
      totalClients: enriched.length,
      ativos: enriched.filter(c => c.status === "ativo").length,
      pendentes: enriched.filter(c => c.status === "pendente").length,
      fixosCount: fixos,
    };
  }, []);

  const filtered = clients.filter(c => {
    if (filter !== "todos" && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.company.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });



  const openNew = () => { setEditId(null); setForm(emptyForm); setDialog(true); };
  const openEdit = (c) => { setEditId(c.id); setForm({ nome: c.name, empresa: c.company, telefone: c.phone, instagram: c.instagram, status: c.status }); setDialog(true); };
  const save = () => {
    if (!form.nome.trim()) return;
    const lista = getClientes();
    const obj = { id: editId || Date.now(), nome: form.nome.trim(), empresa: form.empresa.trim(), telefone: form.telefone.trim(), instagram: form.instagram.trim(), status: form.status, data: new Date().toISOString().slice(0, 10) };
    if (editId) { const idx = lista.findIndex(c => c.id === editId); if (idx >= 0) lista[idx] = obj; }
    else lista.unshift(obj);
    saveClientes(lista);
    setDialog(false);
  };
  const remove = (id) => {
    if (!confirm("Excluir cliente?")) return;
    saveClientes(getClientes().filter(c => c.id !== id));
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span> <span className="text-text-secondary font-medium">Clientes</span></p>
            <h1 className="text-xl font-display font-bold text-text">Clientes</h1>
          </div>
          <motion.button onClick={openNew} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
            <Plus size={18} /> Novo Cliente
          </motion.button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total", value: totalClients, color: "#00e676" },
            { label: "Ativos", value: ativos, color: "#448aff" },
            { label: "Pendentes", value: pendentes, color: "#ffb800" },
            { label: "Fixos", value: fixosCount, color: "#ffb800", icon: Star },
          ].map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              className="bg-bg-card rounded-xl p-5 border-top-green glow-primary">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-medium">{c.label}</span>
                {c.icon && <c.icon size={16} style={{ color: c.color }} />}
              </div>
              <p className="font-display text-2xl font-bold text-text">{String(c.value)}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <button onClick={() => setTab("clientes")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all ${tab === "clientes" ? "bg-primary text-black font-bold" : "bg-bg-card border border-border-card text-text-muted hover:text-text"}`}>
            Clientes <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === "clientes" ? "bg-black/20 text-black/70" : "bg-bg-elevated text-text-muted"}`}>{totalClients}</span>
          </button>
          <button onClick={() => setTab("fixos")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all ${tab === "fixos" ? "bg-amber text-black font-bold" : "bg-bg-card border border-border-card text-text-muted hover:text-text"}`}>
            <Star size={13} /> Fixos <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === "fixos" ? "bg-black/20 text-black/70" : "bg-bg-elevated text-text-muted"}`}>{fixosCount}</span>
          </button>
          {tab === "clientes" && (
            <>
              {[{ key: "todos", label: "Todos" }, { key: "ativo", label: "Ativos" }, { key: "pendente", label: "Pendentes" }].map(({ key, label }) => (
                <button key={key} onClick={() => setFilter(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all ${filter === key ? "bg-primary text-black font-bold" : "bg-bg-card border border-border-card text-text-muted hover:text-text"}`}>
                  {label}
                </button>
              ))}
              <div className="relative ml-auto">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="search" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="bg-bg-card border border-border-card rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors w-48 sm:w-56" />
              </div>
            </>
          )}
        </div>

        {tab === "fixos" ? <FixedClients /> : (
          <div className="bg-bg-card rounded-xl card-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-muted text-[11px] uppercase tracking-[0.1em] border-b border-border-card">
                    <th className="text-left pb-3 pl-4 pt-4 font-medium">Nome</th>
                    <th className="text-left pb-3 pt-4 font-medium">Contato</th>
                    <th className="text-left pb-3 pt-4 font-medium">Status</th>
                    <th className="text-right pb-3 pt-4 font-medium">Total Gasto</th>
                    <th className="text-right pb-3 pr-4 pt-4 font-medium">Orcamentos</th>
                    <th className="text-center pb-3 pr-4 pt-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-text-muted text-sm">Nenhum cliente encontrado</td></tr>
                  )}
                  {filtered.map(c => (
                    <tr key={c.id} className="border-b border-border-card/30 transition-colors hover:bg-white/[0.02] group">
                      <td className="py-3 pl-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            {c.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text">{c.name}</p>
                            {c.company && <p className="text-xs text-text-muted">{c.company}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {c.phone && <a href={`https://wa.me/55${c.phone.replace(/\D/g, "")}`} target="_blank"
                            className="text-text-muted hover:text-primary transition-colors" title="WhatsApp"><MessageCircle size={14} /></a>}
                          {c.instagram && <a href={`https://instagram.com/${c.instagram.replace("@", "")}`} target="_blank"
                            className="text-text-muted hover:text-info transition-colors" title="Instagram"><Camera size={14} /></a>}
                          {!c.phone && !c.instagram && <span className="text-text-muted text-xs">—</span>}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${statusColors[c.status] || "bg-text-muted"}`} />
                          <span className="text-xs text-text-secondary">{statusLabels[c.status]}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-display font-semibold text-text text-sm">
                        R$ {c.totalSpent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right text-sm text-text-muted">{c.proposals}</td>
                      <td className="py-3 pr-4 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors"><Edit3 size={13} /></button>
                          <button onClick={() => remove(c.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-danger transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {dialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setDialog(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-bg-card rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display font-bold text-text">{editId ? "Editar Cliente" : "Novo Cliente"}</h2>
                <button onClick={() => setDialog(false)} className="text-text-muted hover:text-text p-1"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Nome</label>
                  <input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome do cliente"
                    className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Empresa</label>
                  <input type="text" value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} placeholder="Opcional"
                    className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">WhatsApp</label>
                    <input type="text" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} placeholder="11999999999"
                      className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Instagram</label>
                    <input type="text" value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@usuario"
                      className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Status</label>
                  <div className="flex gap-2">
                    {["pendente", "ativo", "inativo"].map(s => (
                      <button key={s} onClick={() => setForm({ ...form, status: s })}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all ${form.status === s ? "bg-primary text-black" : "bg-bg-elevated border border-border-card text-text-muted hover:text-text"}`}>
                        {statusLabels[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-5">
                <button onClick={() => setDialog(false)} className="flex-1 py-2.5 rounded-lg border border-border-card text-text-secondary hover:text-text transition-colors text-sm">Cancelar</button>
                <button onClick={save} className="flex-1 py-2.5 rounded-lg bg-primary text-black hover:bg-primary/80 transition-colors text-sm font-semibold">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
