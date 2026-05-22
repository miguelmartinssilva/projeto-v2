import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, Edit3, Trash2, Phone, Mail, MessageCircle, Users } from "lucide-react";
import { getClientes, saveClientes, getHistorico } from "../utils/storage";

const statusColors = { ativo: "bg-success", pendente: "bg-pending", inativo: "bg-text-muted" };
const statusLabels = { ativo: "Ativo", pendente: "Pendente", inativo: "Inativo" };
const tipoLabels = { avulso: "Avulso", mensal: "Mensal", pacote: "Pacote", projeto: "Projeto", retainer: "Retainer" };
const tipoColors = { avulso: "bg-text-muted/15 text-text-muted", mensal: "bg-primary/15 text-primary", pacote: "bg-purple-500/15 text-purple-400", projeto: "bg-blue-500/15 text-blue-400", retainer: "bg-amber/15 text-amber" };
function emptyForm() { return { nome: "", empresa: "", telefone: "", email: "", instagram: "", status: "pendente", tipo: "avulso" }; }

export default function Crm() {
  const [raw, setRaw] = useState(() => getClientes());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [dialog, setDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const refresh = () => setRaw(getClientes());

  const clients = useMemo(() => {
    const hist = getHistorico();
    let list = raw.map(c => {
      const props = hist.filter(h => h.cliente && c.nome && h.cliente.toLowerCase().includes(c.nome.toLowerCase()));
      return { ...c, totalProps: props.length, totalValue: props.reduce((s, h) => s + (h.total || 0), 0), lastProp: props[0]?.data || "—" };
    });
    if (filter !== "todos") list = list.filter(c => c.status === filter);
    if (tipoFilter !== "todos") list = list.filter(c => c.tipo === tipoFilter);
    if (search) { const s = search.toLowerCase(); list = list.filter(c => c.nome?.toLowerCase().includes(s) || c.empresa?.toLowerCase().includes(s)); }
    return list;
  }, [raw, filter, tipoFilter, search]);

  const stats = useMemo(() => ({
    total: raw.length,
    ativos: raw.filter(c => c.status === "ativo").length,
    pendentes: raw.filter(c => c.status === "pendente").length,
  }), [raw]);

  const save = () => {
    if (!form.nome.trim()) return;
    const lista = getClientes();
    if (editId) {
      const idx = lista.findIndex(c => String(c.id) === String(editId));
      if (idx >= 0) lista[idx] = { ...form, id: editId };
    } else {
      lista.push({ ...form, id: Date.now() });
    }
    saveClientes(lista);
    refresh();
    setDialog(false);
    setForm(emptyForm());
    setEditId(null);
  };

  const openEdit = (c) => { setForm({ ...emptyForm, nome: c.nome || "", empresa: c.empresa || "", telefone: c.telefone || "", email: c.email || "", instagram: c.instagram || "", status: c.status || "pendente", tipo: c.tipo || "avulso" }); setEditId(c.id); setDialog(true); };

  const del = (id) => {
    try {
      const lista = getClientes().filter(c => String(c.id) !== String(id));
      saveClientes(lista);
      refresh();
    } catch { /* ignore */ }
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">Visao geral <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">CRM</span></p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">CRM</h1>
            <p className="text-xs text-text-muted mt-1">Gerencie seus clientes e relacionamentos</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setForm(emptyForm()); setEditId(null); setDialog(true); }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
            <Plus size={16} /> Novo Cliente
          </motion.button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Clientes", value: stats.total, color: "#7c3aed", icon: Users },
            { label: "Ativos", value: stats.ativos, color: "#22c55e", icon: Users },
            { label: "Pendentes", value: stats.pendentes, color: "#facc15", icon: Users },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-bg-card rounded-xl p-4 border border-border-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}><s.icon size={13} style={{ color: s.color }} /></div>
                <span className="text-[10px] text-text-muted font-semibold uppercase tracking-[0.1em]">{s.label}</span>
              </div>
              <p className="font-display text-lg font-bold text-text">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-bg-card rounded-2xl border border-border-card overflow-hidden">
          <div className="p-4 border-b border-border-card flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="text" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-bg-input border border-border-card rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-primary transition-colors" />
            </div>
          <div className="flex gap-1">
            {["todos", "ativo", "pendente", "inativo"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-[0.08em] transition-all ${filter === f ? "btn-primary" : "text-text-muted hover:text-text bg-white/[0.04]"}`}>
                {f === "todos" ? "Todos" : f}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {["todos", "avulso", "mensal", "pacote", "projeto", "retainer"].map(t => (
              <button key={t} onClick={() => setTipoFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-[0.08em] transition-all ${tipoFilter === t ? "btn-primary" : "text-text-muted hover:text-text bg-white/[0.04]"}`}>
                {t === "todos" ? "Todos tipos" : tipoLabels[t] || t}
              </button>
            ))}
          </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-[10px] uppercase tracking-[0.12em] border-b border-border-card">
                  <th className="text-left pb-3 px-4 pt-2 font-semibold">Cliente</th>
                  <th className="text-left pb-3 px-4 pt-2 font-semibold">Contato</th>
                  <th className="text-left pb-3 px-4 pt-2 font-semibold">Tipo</th>
<th className="text-left pb-3 px-4 pt-2 font-semibold">Status</th>
                  <th className="text-right pb-3 px-4 pt-2 font-semibold">Orcamentos</th>
                  <th className="text-right pb-3 px-4 pt-2 font-semibold">Total</th>
                  <th className="text-right pb-3 px-4 pt-2 font-semibold">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-card/40">
                {clients.map(c => (
                  <motion.tr key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                          {c.nome?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "??"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text">{c.nome}</p>
                          {c.empresa && <p className="text-[10px] text-text-muted">{c.empresa}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {c.telefone && <p className="text-xs text-text-muted flex items-center gap-1"><Phone size={10} />{c.telefone}</p>}
                        {c.email && <p className="text-xs text-text-muted flex items-center gap-1"><Mail size={10} />{c.email}</p>}
</div>
</td>
<td className="py-3 px-4">
<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${tipoColors[c.tipo] || tipoColors.avulso}`}>{tipoLabels[c.tipo] || "Avulso"}</span>
</td>
<td className="py-3 px-4">
<span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${c.status === "ativo" ? "bg-success/15 text-success" : c.status === "pendente" ? "bg-pending/15 text-pending" : "bg-text-muted/15 text-text-muted"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusColors[c.status] || "bg-text-muted"}`} />
                        {statusLabels[c.status] || "Inativo"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-text text-sm font-semibold">{c.totalProps || 0}</td>
                    <td className="py-3 px-4 text-right text-primary text-sm font-semibold">R$ {(c.totalValue || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><Edit3 size={12} /></button>
                        <button onClick={() => del(c.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {clients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Users size={40} className="text-text-muted opacity-20" />
              <p className="text-sm text-text-muted">Nenhum cliente encontrado</p>
            </div>
          )}
          <div className="p-4 border-t border-border-card text-[10px] text-text-muted">
            {clients.length} cliente{clients.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {dialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDialog(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text">{editId ? "Editar Cliente" : "Novo Cliente"}</h2>
                <button onClick={() => setDialog(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div className="floating-label"><input type="text" placeholder=" " value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /><label>Nome</label></div>
                <div className="floating-label"><input type="text" placeholder=" " value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} /><label>Empresa</label></div>
                <div className="floating-label"><input type="text" placeholder=" " value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} className="has-icon" /><Phone size={14} className="input-icon" /><label>Telefone</label></div>
                <div className="floating-label"><input type="email" placeholder=" " value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="has-icon" /><Mail size={14} className="input-icon" /><label>Email</label></div>
                <div className="floating-label"><input type="text" placeholder=" " value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} className="has-icon" /><MessageCircle size={14} className="input-icon" /><label>Instagram</label></div>
        <div><span className="field-label">Tipo de cliente</span><select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
          <option value="avulso">Avulso</option>
          <option value="mensal">Mensal</option>
          <option value="pacote">Pacote</option>
          <option value="projeto">Projeto</option>
          <option value="retainer">Retainer</option>
        </select></div>
        <div><span className="field-label">Status</span><select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
          <option value="ativo">Ativo</option>
          <option value="pendente">Pendente</option>
          <option value="inativo">Inativo</option>
        </select></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setDialog(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted hover:text-text hover:bg-white/10 transition-colors">Cancelar</button>
                <button onClick={save} className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}