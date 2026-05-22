import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, X, Edit3, Trash2, Download, File, FileSpreadsheet } from "lucide-react";
import { getDocumentos, saveDocumentos } from "../utils/storage";

const CATS = ["Contrato", "Proposta", "Relatorio", "Nota Fiscal", "Outro"];

function icone(cat) {
  if (cat === "Contrato" || cat === "Proposta") return FileText;
  if (cat === "Relatorio") return FileSpreadsheet;
  return File;
}

const emptyForm = { nome: "", categoria: "Outro", descricao: "", conteudo: "" };

export default function Documentos() {
  const [docs, setDocs] = useState(() => getDocumentos());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("todos");

  const refresh = () => setDocs(getDocumentos());

  const filtered = filter === "todos" ? docs : docs.filter(d => d.categoria === filter);

  const save = () => {
    if (!form.nome.trim()) return;
    const lista = getDocumentos();
    const item = { ...form, id: editingId || Date.now(), criadoEm: new Date().toLocaleDateString("pt-BR") };
    if (editingId) { const idx = lista.findIndex(d => d.id === editingId); if (idx >= 0) lista[idx] = item; }
    else lista.push(item);
    saveDocumentos(lista);
    refresh();
    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const openEdit = (d) => {
    setForm({ nome: d.nome, categoria: d.categoria, descricao: d.descricao || "", conteudo: d.conteudo || "" });
    setEditingId(d.id);
    setShowModal(true);
  };

  const download = (d) => {
    const blob = new Blob([d.conteudo || d.nome], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${d.nome}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const del = (id) => {
    saveDocumentos(getDocumentos().filter(d => d.id !== id));
    refresh();
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">Documentos</span></p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Documentos</h1>
            <p className="text-xs text-text-muted mt-1">Armazene e gerencie seus documentos</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
            <Plus size={16} /> Novo Documento
          </motion.button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["todos", ...CATS].map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${filter === c ? "btn-primary" : "bg-white/[0.04] text-text-muted hover:text-text hover:bg-white/[0.08]"}`}>
              {c === "todos" ? "Todos" : c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map(d => {
              const Icon = icone(d.categoria);
              return (
                <motion.div key={d.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-bg-card rounded-2xl p-5 border border-border-card relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-info/50 rounded-t-2xl" />
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                      <Icon size={18} className="text-info" />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                      <button onClick={() => download(d)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><Download size={12} /></button>
                      <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><Edit3 size={12} /></button>
                      <button onClick={() => del(d.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-text mb-1 truncate">{d.nome}</h3>
                  <p className="text-[10px] text-text-muted mb-2 line-clamp-2">{d.descricao || "Sem descricao"}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-white/[0.04] text-text-muted px-2 py-0.5 rounded-full">{d.categoria}</span>
                    <span className="text-[9px] text-text-muted">{d.criadoEm || ""}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <FileText size={40} className="text-text-muted opacity-20" />
            <p className="text-sm text-text-muted">Nenhum documento encontrado</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text">{editingId ? "Editar" : "Novo"} Documento</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} />
                  <label>Nome do documento</label>
                </div>
                <div className="floating-label">
                  <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <label>Categoria</label>
                </div>
                <div className="floating-label">
                  <textarea rows={2} placeholder=" " value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
                  <label>Descricao</label>
                </div>
                <div className="floating-label">
                  <textarea rows={4} placeholder=" " value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} />
                  <label>Conteudo (opcional)</label>
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