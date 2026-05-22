import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, X, Edit3, Trash2, Mail, Phone, ToggleLeft, ToggleRight } from "lucide-react";
import { getEquipe, saveEquipe } from "../utils/storage";

const CORES = ["#00e676", "#7c3aed", "#448aff", "#facc15", "#ff4d6d", "#ff6b35", "#a78bfa", "#22c55e"];
const emptyForm = { nome: "", cargo: "", email: "", telefone: "", ativo: true };

export default function Equipe() {
  const [membros, setMembros] = useState(() => getEquipe());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const refresh = () => setMembros(getEquipe());

  const save = () => {
    if (!form.nome.trim()) return;
    const lista = getEquipe();
    const item = { ...form, id: editingId || Date.now(), avatar: form.nome.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase(), cor: CORES[Math.floor(Math.random() * CORES.length)] };
    if (editingId) { const idx = lista.findIndex(m => m.id === editingId); if (idx >= 0) { item.avatar = lista[idx].avatar; item.cor = lista[idx].cor; lista[idx] = item; } }
    else lista.push(item);
    saveEquipe(lista);
    refresh();
    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const openEdit = (m) => {
    setForm({ nome: m.nome, cargo: m.cargo || "", email: m.email || "", telefone: m.telefone || "", ativo: m.ativo });
    setEditingId(m.id);
    setShowModal(true);
  };

  const toggle = (id) => {
    const lista = getEquipe();
    const m = lista.find(x => x.id === id);
    if (m) { m.ativo = !m.ativo; saveEquipe(lista); refresh(); }
  };

  const del = (id) => {
    saveEquipe(getEquipe().filter(m => m.id !== id));
    refresh();
  };

  const ativos = membros.filter(m => m.ativo);
  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">Equipe</span></p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Equipe</h1>
            <p className="text-xs text-text-muted mt-1">{membros.length} membro{membros.length !== 1 ? "s" : ""} · {ativos.length} ativo{ativos.length !== 1 ? "s" : ""}</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
            <Plus size={16} /> Novo Membro
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {membros.map((m) => (
              <motion.div key={m.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-bg-card rounded-2xl p-5 border relative overflow-hidden group ${m.ativo ? "border-border-card" : "border-border-card/40 opacity-60"}`}>
                <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: m.cor }} />
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold text-black" style={{ background: m.cor }}>
                      {m.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text">{m.nome}</h3>
                      <p className="text-[11px] text-text-muted">{m.cargo || "—"}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <button onClick={() => toggle(m.id)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text">{m.ativo ? <ToggleRight size={14} className="text-primary" /> : <ToggleLeft size={14} />}</button>
                    <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><Edit3 size={12} /></button>
                    <button onClick={() => del(m.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={12} /></button>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  {m.email && <p className="flex items-center gap-1.5 text-text-muted"><Mail size={11} />{m.email}</p>}
                  {m.telefone && <p className="flex items-center gap-1.5 text-text-muted"><Phone size={11} />{m.telefone}</p>}
                </div>
                <div className="mt-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${m.ativo ? "bg-success/15 text-success" : "bg-text-muted/15 text-text-muted"}`}>
                    {m.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {membros.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users size={40} className="text-text-muted opacity-20" />
            <p className="text-sm text-text-muted">Nenhum membro na equipe</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text">{editingId ? "Editar Membro" : "Novo Membro"}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
                  <label>Nome</label>
                </div>
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))} />
                  <label>Cargo</label>
                </div>
                <div className="floating-label">
                  <input type="email" placeholder=" " value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="has-icon" />
                  <Mail size={14} className="input-icon" />
                  <label>Email</label>
                </div>
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} className="has-icon" />
                  <Phone size={14} className="input-icon" />
                  <label>Telefone</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted">Cancelar</button>
                <button onClick={save} className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}