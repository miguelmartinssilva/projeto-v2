import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Plus, X, Edit3, Trash2, ToggleLeft, ToggleRight, Clock } from "lucide-react";
import { getAutomacoes, saveAutomacoes } from "../utils/storage";

const TIPOS_AUTO = [
  { key: "lembrete",   label: "Lembrete",   desc: "Envia lembrete automatico" },
  { key: "cobranca",   label: "Cobranca",   desc: "Dispara cobranca para cliente" },
  { key: "followup",   label: "Follow-up",  desc: "Apos X dias sem resposta" },
  { key: "relatorio",  label: "Relatorio",  desc: "Gera relatorio periodico" },
];

function emptyForm() { return { nome: "", tipo: "lembrete", disparo: "semanal", dias: 1, ativo: true, descricao: "" }; }

export default function Automacoes() {
  const [autos, setAutos] = useState(() => getAutomacoes());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const refresh = () => setAutos(getAutomacoes());

  const save = () => {
    if (!form.nome.trim()) return;
    const lista = getAutomacoes();
    const item = { ...form, id: editingId || Date.now() };
    if (editingId) { const idx = lista.findIndex(a => a.id === editingId); if (idx >= 0) lista[idx] = item; }
    else lista.push(item);
    saveAutomacoes(lista);
    refresh();
    setShowModal(false);
    setForm(emptyForm());
    setEditingId(null);
  };

  const openEdit = (a) => {
    setForm({ nome: a.nome, tipo: a.tipo, disparo: a.disparo, dias: a.dias, ativo: a.ativo, descricao: a.descricao || "" });
    setEditingId(a.id);
    setShowModal(true);
  };

  const toggle = (id) => {
    const lista = getAutomacoes();
    const item = lista.find(a => a.id === id);
    if (item) { item.ativo = !item.ativo; saveAutomacoes(lista); refresh(); }
  };

  const del = (id) => {
    saveAutomacoes(getAutomacoes().filter(a => a.id !== id));
    refresh();
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">Automacoes</span></p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Automacoes</h1>
            <p className="text-xs text-text-muted mt-1">Automatize tarefas repetitivas do seu estúdio</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setForm(emptyForm()); setEditingId(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
            <Plus size={16} /> Nova Automacao
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {TIPOS_AUTO.map(t => (
            <div key={t.key} className="bg-bg-card rounded-xl p-4 border border-border-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center"><Zap size={15} className="text-warning" /></div>
                <span className="text-sm font-bold text-text">{t.label}</span>
              </div>
              <p className="text-xs text-text-muted">{t.desc}</p>
              <p className="text-[10px] text-primary mt-2">{autos.filter(a => a.tipo === t.key).length} ativa{autos.filter(a => a.tipo === t.key).length !== 1 ? "s" : ""}</p>
            </div>
          ))}
        </div>

        <div className="bg-bg-card rounded-2xl p-6 border border-border-card">
          <h2 className="text-sm font-bold text-text mb-4">Automacoes Ativas</h2>
          {autos.length > 0 ? (
            <div className="space-y-2">
              <AnimatePresence>
                {autos.map(a => (
                  <motion.div key={a.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.ativo ? "bg-warning/10" : "bg-white/[0.04]"}`}>
                      <Zap size={16} className={a.ativo ? "text-warning" : "text-text-muted"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text truncate">{a.nome}</p>
                      <div className="flex items-center gap-2 text-[10px] text-text-muted">
                        <span>{TIPOS_AUTO.find(t => t.key === a.tipo)?.label || a.tipo}</span>
                        <span>·</span>
                        <Clock size={10} className="inline" />
                        <span>A cada {a.disparo === "diario" ? "dia" : a.disparo === "semanal" ? "semana" : `${a.dias} dias`}</span>
                      </div>
                    </div>
                    <button onClick={() => toggle(a.id)} className="text-text-muted hover:text-text transition-colors">
                      {a.ativo ? <ToggleRight size={20} className="text-primary" /> : <ToggleLeft size={20} />}
                    </button>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><Edit3 size={12} /></button>
                      <button onClick={() => del(a.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={12} /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Zap size={40} className="text-text-muted opacity-20" />
              <p className="text-sm text-text-muted">Nenhuma automacao configurada</p>
              <button onClick={() => { setForm(emptyForm()); setEditingId(null); setShowModal(true); }} className="text-xs text-primary hover:underline">Criar primeira automacao</button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text">{editingId ? "Editar" : "Nova"} Automacao</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
                  <label>Nome da automacao</label>
                </div>
        <div><span className="field-label">Tipo</span><select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
          {TIPOS_AUTO.map(t => <option key={t.key} value={t.key}>{t.label} — {t.desc}</option>)}
        </select></div>
        <div><span className="field-label">Frequencia</span><select value={form.disparo} onChange={e => setForm(f => ({ ...f, disparo: e.target.value }))} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
          <option value="diario">Diario</option>
          <option value="semanal">Semanal</option>
          <option value="personalizado">Personalizado</option>
        </select></div>
                {form.disparo === "personalizado" && (
                  <div className="floating-label">
                    <input type="number" min={1} placeholder=" " value={form.dias} onChange={e => setForm(f => ({ ...f, dias: parseInt(e.target.value) || 1 }))} />
                    <label>Dias entre execucoes</label>
                  </div>
                )}
                <div className="floating-label">
                  <textarea rows={2} placeholder=" " value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
                  <label>Descricao (opcional)</label>
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