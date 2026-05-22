import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit3, Trash2, DollarSign, User, Phone, ArrowRight } from "lucide-react";
import { getComercial, saveComercial } from "../utils/storage";

const STAGES = [
  { key: "lead",      label: "Lead",       color: "#a0a0a0", bg: "#a0a0a018" },
  { key: "contato",   label: "Contato",    color: "#448aff", bg: "#448aff18" },
  { key: "proposta",  label: "Proposta",   color: "#facc15", bg: "#facc1518" },
  { key: "negociacao",label: "Negociacao", color: "#7c3aed", bg: "#7c3aed18" },
  { key: "fechado",   label: "Fechado",    color: "#22c55e", bg: "#22c55e18" },
];

function emptyForm() { return { nome: "", empresa: "", telefone: "", valor: "", stage: "lead", observacao: "" }; }

export default function Comercial() {
  const [deals, setDeals] = useState(() => getComercial());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const refresh = () => setDeals(getComercial());

  const save = () => {
    if (!form.nome.trim()) return;
    const lista = getComercial();
    const deal = { ...form, valor: parseFloat(form.valor) || 0, id: editingId || Date.now(), criadoEm: new Date().toISOString().slice(0, 10) };
    if (editingId) {
      const idx = lista.findIndex(d => d.id === editingId);
      if (idx >= 0) lista[idx] = deal;
    } else {
      lista.push(deal);
    }
    saveComercial(lista);
    refresh();
    setShowModal(false);
    setForm(emptyForm());
    setEditingId(null);
  };

  const openEdit = (d) => {
    setForm({ nome: d.nome, empresa: d.empresa || "", telefone: d.telefone || "", valor: String(d.valor || ""), stage: d.stage, observacao: d.observacao || "" });
    setEditingId(d.id);
    setShowModal(true);
  };

  const advance = (id) => {
    const lista = getComercial();
    const idx = lista.findIndex(d => d.id === id);
    if (idx < 0) return;
    const cur = STAGES.findIndex(s => s.key === lista[idx].stage);
    if (cur < STAGES.length - 1) {
      lista[idx].stage = STAGES[cur + 1].key;
      saveComercial(lista);
      refresh();
    }
  };

  const del = (id) => {
    saveComercial(getComercial().filter(d => d.id !== id));
    refresh();
  };

  const totalPipeline = deals.reduce((s, d) => s + (d.valor || 0), 0);
  const stageTotals = STAGES.map(s => ({
    ...s,
    deals: deals.filter(d => d.stage === s.key),
    total: deals.filter(d => d.stage === s.key).reduce((sum, d) => sum + (d.valor || 0), 0),
  }));

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">
              MM Studio <span className="mx-1.5 text-border-light">/</span>
              <span className="text-text-secondary font-medium">Comercial</span>
            </p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Pipeline Comercial</h1>
            <p className="text-xs text-text-muted mt-1">Acompanhe suas oportunidades de venda</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setForm(emptyForm()); setEditingId(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
          >
            <Plus size={16} /> Novo Deal
          </motion.button>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-8">
          {stageTotals.map(s => (
            <div key={s.key} className="bg-bg-card rounded-xl p-4 border border-border-card text-center">
              <p className="text-[10px] uppercase tracking-[0.12em] font-semibold" style={{ color: s.color }}>{s.label}</p>
              <p className="text-lg font-bold text-text mt-1">{s.deals.length}</p>
              <p className="text-[10px] text-text-muted">R$ {s.total.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[900px]">
            {stageTotals.map(s => (
              <div key={s.key} className="flex-1">
                <div className="bg-bg-card rounded-2xl p-4 border border-border-card min-h-[400px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                      <span className="text-sm font-bold text-text">{s.label}</span>
                      <span className="text-[10px] bg-white/[0.04] text-text-muted px-1.5 py-0.5 rounded-full">{s.deals.length}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {s.deals.map(d => (
                        <motion.div
                          key={d.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white/[0.03] rounded-xl p-3 border border-border-card hover:bg-white/[0.06] transition-colors group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-semibold text-text truncate flex-1">{d.nome}</p>
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(d)} className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-text"><Edit3 size={11} /></button>
                              <button onClick={() => del(d.id)} className="p-1 rounded hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={11} /></button>
                            </div>
                          </div>
                          {d.empresa && <p className="text-[11px] text-text-muted mb-1">{d.empresa}</p>}
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary">R$ {(d.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>
                            {s.key !== "fechado" && (
                              <button onClick={() => advance(d.id)} className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-primary transition-colors" title="Avancar etapa">
                                <ArrowRight size={12} />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {s.deals.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <p className="text-xs text-text-muted">Nenhum deal</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-card rounded-2xl p-6 border border-border-card">
          <h2 className="text-sm font-bold text-text tracking-tight mb-1">Resumo do Pipeline</h2>
          <p className="text-xs text-text-muted mb-4">Total: <span className="text-primary font-bold">R$ {totalPipeline.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span> em {deals.length} negocio{deals.length !== 1 ? "s" : ""}</p>
          <div className="space-y-2">
            {STAGES.map((s) => {
              const stageSum = deals.filter(d => d.stage === s.key).reduce((sum, d) => sum + (d.valor || 0), 0);
              const pct = totalPipeline > 0 ? Math.round(stageSum / totalPipeline * 100) : 0;
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold w-20 text-right" style={{ color: s.color }}>{s.label}</span>
                  <div className="flex-1 h-3 bg-bg-elevated rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                  <span className="text-[10px] text-text-muted w-20">R$ {stageSum.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text">{editingId ? "Editar Deal" : "Novo Deal"}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="has-icon" />
                  <User size={14} className="input-icon" />
                  <label>Nome do contato</label>
                </div>
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.empresa} onChange={e => setForm(f => ({ ...f, empresa: e.target.value }))} />
                  <label>Empresa</label>
                </div>
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} className="has-icon" />
                  <Phone size={14} className="input-icon" />
                  <label>Telefone</label>
                </div>
                <div className="floating-label">
                  <input type="number" placeholder=" " value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} className="has-icon" />
                  <DollarSign size={14} className="input-icon" />
                  <label>Valor estimado</label>
                </div>
                <div className="floating-label">
                  <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
                    {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                  <label>Estagio</label>
                </div>
                <div className="floating-label">
                  <textarea rows={2} placeholder=" " value={form.observacao} onChange={e => setForm(f => ({ ...f, observacao: e.target.value }))} />
                  <label>Observacao</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted hover:text-text hover:bg-white/10 transition-colors">Cancelar</button>
                <button onClick={save} className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}