import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit3, Trash2, Package, DollarSign, Tag } from "lucide-react";
import { getServicos, saveServicos, getPacotes, savePacotes } from "../utils/storage";

const emptyServico = { nome: "", unidade: "por arte", preco: "" };
const emptyPacote = { nome: "", servico: "", qtd: 1, precoTotal: "", descricao: "" };

export default function Catalogo() {
  const [tab, setTab] = useState("servicos");
  const [servicos, setServicos] = useState(() => getServicos());
  const [pacotes, setPacotes] = useState(() => getPacotes());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(tab === "servicos" ? emptyServico : emptyPacote);
  const [editingId, setEditingId] = useState(null);
  const refresh = () => { setServicos(getServicos()); setPacotes(getPacotes()); };

  const switchTab = (t) => {
    setTab(t);
    setForm(t === "servicos" ? { ...emptyServico } : { ...emptyPacote });
    setEditingId(null);
    setShowModal(false);
  };

  const save = () => {
    if (tab === "servicos") {
      if (!form.nome.trim()) return;
      const lista = getServicos();
      if (editingId) { const idx = lista.findIndex(s => s.id === editingId); if (idx >= 0) lista[idx] = { ...form, preco: parseFloat(form.preco) || 0, id: editingId }; }
      else lista.push({ ...form, preco: parseFloat(form.preco) || 0, id: Date.now() });
      saveServicos(lista);
    } else {
      if (!form.nome.trim() || !form.servico) return;
      const lista = getPacotes();
      if (editingId) { const idx = lista.findIndex(p => p.id === editingId); if (idx >= 0) lista[idx] = { ...form, precoTotal: parseFloat(form.precoTotal) || 0, id: editingId }; }
      else lista.push({ ...form, precoTotal: parseFloat(form.precoTotal) || 0, id: Date.now() });
      savePacotes(lista);
    }
    refresh();
    setShowModal(false);
    setForm(tab === "servicos" ? { ...emptyServico } : { ...emptyPacote });
    setEditingId(null);
  };

  const openEdit = (item) => {
    if (tab === "servicos") { setForm({ ...emptyServico, nome: item.nome, unidade: item.unidade, preco: String(item.preco) }); }
    else { setForm({ ...emptyPacote, nome: item.nome, servico: item.servico, qtd: item.qtd, precoTotal: String(item.precoTotal), descricao: item.descricao || "" }); }
    setEditingId(item.id);
    setShowModal(true);
  };

  const del = (id) => {
    if (tab === "servicos") { saveServicos(getServicos().filter(s => s.id !== id)); }
    else { savePacotes(getPacotes().filter(p => p.id !== id)); }
    refresh();
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">
              MM Studio <span className="mx-1.5 text-border-light">/</span>
              <span className="text-text-secondary font-medium">Catalogo</span>
            </p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Catalogo</h1>
            <p className="text-xs text-text-muted mt-1">Servicos e pacotes oferecidos</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setForm(tab === "servicos" ? { ...emptyServico } : { ...emptyPacote }); setEditingId(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
          >
            <Plus size={16} /> Adicionar
          </motion.button>
        </div>

        <div className="flex gap-2 mb-6">
          {["servicos", "pacotes"].map(t => (
            <button key={t} onClick={() => switchTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t ? "btn-primary" : "bg-white/[0.04] text-text-muted hover:text-text hover:bg-white/[0.08]"}`}>
              {t === "servicos" ? "Servicos" : "Pacotes"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {(tab === "servicos" ? servicos : pacotes).map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-bg-card rounded-2xl p-5 border border-border-card relative overflow-hidden group">
                <span className="absolute top-0 left-0 right-0 h-[2px] bg-primary/50 rounded-t-2xl" />
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package size={18} className="text-primary" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><Edit3 size={12} /></button>
                    <button onClick={() => del(item.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={12} /></button>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-text mb-1 truncate">{item.nome}</h3>
                {tab === "servicos" ? (
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><Tag size={11} />{item.unidade}</span>
                    <span className="flex items-center gap-1 font-bold text-primary"><DollarSign size={11} />{parseFloat(item.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                ) : (
                  <div className="space-y-1 text-xs text-text-muted">
                    <p className="flex items-center gap-1"><Tag size={11} />{item.servico} x{item.qtd}</p>
                    <p className="font-bold text-primary">R$ {parseFloat(item.precoTotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    {item.descricao && <p className="text-text-muted/70 truncate">{item.descricao}</p>}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {(tab === "servicos" ? servicos : pacotes).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Package size={40} className="text-text-muted opacity-20" />
            <p className="text-sm text-text-muted">Nenhum {tab === "servicos" ? "servico" : "pacote"} cadastrado</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text">{editingId ? "Editar" : "Adicionar"} {tab === "servicos" ? "Servico" : "Pacote"}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
                  <label>Nome</label>
                </div>
                {tab === "servicos" ? (
                  <>
                    <div className="floating-label">
                      <select value={form.unidade} onChange={e => setForm(f => ({ ...f, unidade: e.target.value }))}>
                        <option value="por arte">por arte</option>
                        <option value="por hora">por hora</option>
                        <option value="por video">por video</option>
                        <option value="por pacote">por pacote</option>
                        <option value="por projeto">por projeto</option>
                      </select>
                      <label>Unidade</label>
                    </div>
                    <div className="floating-label">
                      <input type="number" placeholder=" " value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} className="has-icon" />
                      <DollarSign size={14} className="input-icon" />
                      <label>Preco</label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="floating-label">
                      <select value={form.servico} onChange={e => setForm(f => ({ ...f, servico: e.target.value }))}>
                        <option value="">Selecione</option>
                        {servicos.map(s => <option key={s.id} value={s.nome}>{s.nome}</option>)}
                      </select>
                      <label>Servico base</label>
                    </div>
                    <div className="floating-label">
                      <input type="number" placeholder=" " value={form.qtd} onChange={e => setForm(f => ({ ...f, qtd: parseInt(e.target.value) || 1 }))} />
                      <label>Quantidade</label>
                    </div>
                    <div className="floating-label">
                      <input type="number" placeholder=" " value={form.precoTotal} onChange={e => setForm(f => ({ ...f, precoTotal: e.target.value }))} className="has-icon" />
                      <DollarSign size={14} className="input-icon" />
                      <label>Preco total</label>
                    </div>
                    <div className="floating-label">
                      <textarea rows={2} placeholder=" " value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
                      <label>Descricao</label>
                    </div>
                  </>
                )}
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