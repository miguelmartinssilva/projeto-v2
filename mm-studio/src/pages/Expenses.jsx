import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingDown, Plus, Edit3, Trash2, X, RefreshCw, ArrowUpDown, DollarSign, BadgePercent } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getDespesas, saveDespesa, deleteDespesa, getTransactions, saveTransactions } from "../utils/storage";

const CATEGORIAS = [
  "Ferramentas", "Software", "Marketing", "Equipamento", "Transporte", "Alimentacao", "Outros"
];

const CATEGORY_COLORS = {
  Ferramentas: "#ff4d6d",
  Software: "#7c3aed",
  Marketing: "#448aff",
  Equipamento: "#ffb800",
  Transporte: "#ff6b35",
  Alimentacao: "#69f0ae",
  Outros: "#888",
};

const CATEGORY_LABELS = {
  Ferramentas: "Ferramentas",
  Software: "Software",
  Marketing: "Marketing",
  Equipamento: "Equipamento",
  Transporte: "Transporte",
  Alimentacao: "Alimentacao",
  Outros: "Outros",
};

const MESES = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export default function Expenses() {
  const now = new Date();
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filterMes, setFilterMes] = useState(now.getMonth());
  const [filterAno, setFilterAno] = useState(now.getFullYear());
  const [filterCat, setFilterCat] = useState("Todas");
  const [sortBy, setSortBy] = useState("data");
  const [sortDir, setSortDir] = useState("desc");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const despesas = useMemo(() => getDespesas(), []);

  const filtered = useMemo(() => {
    let list = [...despesas];
    if (filterMes >= 0) {
      list = list.filter(d => {
        const dt = new Date(d.data + "T12:00:00");
        return dt.getMonth() === filterMes && dt.getFullYear() === filterAno;
      });
    }
    if (filterCat !== "Todas") list = list.filter(d => d.categoria === filterCat);
    list.sort((a, b) => {
      if (sortBy === "data") return sortDir === "asc" ? new Date(a.data) - new Date(b.data) : new Date(b.data) - new Date(a.data);
      const cmp = (a.valor || 0) - (b.valor || 0);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [despesas, filterMes, filterAno, filterCat, sortBy, sortDir]);

  const totalMes = useMemo(() => {
    const d = new Date();
    return despesas
      .filter(dd => {
        const dt = new Date(dd.data + "T12:00:00");
        return dt.getMonth() === d.getMonth() && dt.getFullYear() === d.getFullYear();
      })
      .reduce((s, dd) => s + (dd.valor || 0), 0);
  }, [despesas]);

  const totalAno = useMemo(() => {
    const y = new Date().getFullYear();
    return despesas
      .filter(dd => new Date(dd.data + "T12:00:00").getFullYear() === y)
      .reduce((s, dd) => s + (dd.valor || 0), 0);
  }, [despesas]);

  const maiorValor = useMemo(() => Math.max(...despesas.map(d => d.valor || 0), 0), [despesas]);
  const mediaMensal = useMemo(() => {
    const months = new Set();
    despesas.forEach(d => {
      const dt = new Date(d.data + "T12:00:00");
      months.add(`${dt.getFullYear()}-${dt.getMonth()}`);
    });
    const count = months.size || 1;
    return despesas.reduce((s, d) => s + (d.valor || 0), 0) / count;
  }, [despesas]);

  const pieData = useMemo(() => {
    const map = {};
    despesas.forEach(d => {
      const cat = d.categoria || "Outros";
      map[cat] = (map[cat] || 0) + (d.valor || 0);
    });
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(map).map(([name, value]) => ({
      name: CATEGORY_LABELS[name] || name,
      value: Math.round(value / total * 100),
      color: CATEGORY_COLORS[name] || "#888",
    }));
  }, [despesas]);

  const openNew = () => { setEditItem(null); setShowModal(true); };
  const openEdit = (d) => { setEditItem(d); setShowModal(true); };
  const handleDelete = (d) => setConfirmDelete(d);

  const confirmDel = () => {
    if (confirmDelete) {
      deleteDespesa(confirmDelete.id);
      const txns = getTransactions().filter(t => t.id !== confirmDelete.id);
      saveTransactions(txns);
    }
    setConfirmDelete(null);
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span> <span className="text-text-secondary font-medium">Despesas</span></p>
            <h1 className="text-xl font-display font-bold text-text">Despesas</h1>
          </div>
          <motion.button onClick={openNew} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="bg-danger text-white flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-danger/80 transition-colors">
            <Plus size={18} /> Nova Despesa
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total do Mes", value: totalMes, color: "#ff4d6d", borderClass: "border-top-red", icon: DollarSign },
            { label: "Total do Ano", value: totalAno, color: "#ff6b35", borderClass: "border-top-orange", icon: TrendingDown },
            { label: "Maior Despesa", value: maiorValor, color: "#7c3aed", borderClass: "border-top-purple", icon: BadgePercent },
            { label: "Media Mensal", value: mediaMensal, color: "#448aff", borderClass: "border-top-blue", icon: RefreshCw },
          ].map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              className={`bg-bg-card rounded-xl p-5 ${c.borderClass} glow-primary`}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-medium">{c.label}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${c.color}18` }}>
                  <c.icon size={18} style={{ color: c.color }} />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-text mb-1">
                R$ {c.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-bg-card rounded-xl p-6 card-border glow-primary">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text">Despesas</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <select value={filterMes} onChange={(e) => setFilterMes(+e.target.value)}
                  className="bg-bg-elevated border border-border-card rounded-lg px-2.5 py-1.5 text-xs text-text outline-none">
                  {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <select value={filterAno} onChange={(e) => setFilterAno(+e.target.value)}
                  className="bg-bg-elevated border border-border-card rounded-lg px-2.5 py-1.5 text-xs text-text outline-none">
                  {[now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2].map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
                  className="bg-bg-elevated border border-border-card rounded-lg px-2.5 py-1.5 text-xs text-text outline-none">
                  <option value="Todas">Todas Categorias</option>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                </select>
                <button onClick={() => { setSortDir(sortDir === "asc" ? "desc" : "asc"); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border-card bg-bg-elevated text-xs text-text-muted hover:text-text transition-colors">
                  <ArrowUpDown size={12} /> {sortDir === "asc" ? "Crescente" : "Decrescente"}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-text-muted text-[11px] uppercase tracking-[0.1em] border-b border-border-card">
                    <th className="text-left pb-3 pl-1 font-medium cursor-pointer hover:text-text" onClick={() => { setSortBy("data"); }}>Data</th>
                    <th className="text-left pb-3 font-medium">Descricao</th>
                    <th className="text-left pb-3 font-medium">Categoria</th>
                    <th className="text-right pb-3 font-medium cursor-pointer hover:text-text" onClick={() => { setSortBy("valor"); }}>Valor</th>
                    <th className="text-center pb-3 font-medium">Recorrente</th>
                    <th className="text-center pb-3 pr-1 font-medium">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d) => (
                    <tr key={d.id} className="border-b border-border-card/40 transition-colors hover:bg-white/[0.02] group">
                      <td className="py-3 pl-1 text-text-muted text-xs">{d.data}</td>
                      <td className="py-3 text-text font-medium">{d.descricao}</td>
                      <td className="py-3">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: `${CATEGORY_COLORS[d.categoria] || "#888"}20`, color: CATEGORY_COLORS[d.categoria] || "#888" }}>
                          {CATEGORY_LABELS[d.categoria] || d.categoria}
                        </span>
                      </td>
                      <td className="py-3 text-right text-danger font-semibold font-display">
                        -R$ {(d.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-center">
                        {d.recorrente ? <RefreshCw size={14} className="text-primary mx-auto" /> : <span className="text-text-muted">—</span>}
                      </td>
                      <td className="py-3 text-center pr-1">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors"><Edit3 size={13} /></button>
                          <button onClick={() => handleDelete(d)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-danger transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                <TrendingDown size={32} className="mb-2 opacity-30" />
                <p className="text-sm">Nenhuma despesa encontrada</p>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-border-card/30 text-xs text-text-muted">
              <span>{filtered.length} despesa{filtered.length !== 1 ? "s" : ""}</span>
              <span className="font-semibold text-danger">
                Total: -R$ {filtered.reduce((s, d) => s + (d.valor || 0), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-bg-card rounded-xl p-6 card-border glow-primary">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Por Categoria</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {pieData.map(e => (
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: e.color }} /><span className="text-text-muted">{e.name}</span></div>
                  <span className="text-text font-medium">{e.value}%</span>
                </div>
              ))}
              {pieData.length === 0 && <p className="text-xs text-text-muted text-center py-4">Nenhuma despesa</p>}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <ExpenseModal item={editItem} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-bg-card rounded-2xl max-w-sm w-full p-6 text-center">
              <Trash2 size={36} className="text-danger mx-auto mb-3" />
              <h2 className="text-lg font-display font-bold text-text mb-2">Excluir Despesa?</h2>
              <p className="text-sm text-text-muted mb-5">Esta acao nao pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-lg border border-border-card text-text-secondary hover:text-text transition-colors text-sm">Cancelar</button>
                <button onClick={confirmDel} className="flex-1 py-2.5 rounded-lg bg-danger text-white hover:bg-danger/80 transition-colors text-sm font-semibold">Excluir</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExpenseModal({ item, onClose }) {
  const [descricao, setDescricao] = useState(item?.descricao || "");
  const [valor, setValor] = useState(item?.valor || "");
  const [categoria, setCategoria] = useState(item?.categoria || "Ferramentas");
  const [data, setData] = useState(item?.data || new Date().toISOString().slice(0, 10));
  const [recorrente, setRecorrente] = useState(item?.recorrente || false);

  const handleSave = () => {
    if (!descricao.trim() || !valor) return;
    const numVal = parseFloat(valor);
    if (isNaN(numVal) || numVal <= 0) return;
    const obj = {
      id: item?.id || Date.now(),
      descricao: descricao.trim(),
      valor: numVal,
      categoria,
      data,
      recorrente,
    };
    saveDespesa(obj);
    const txns = getTransactions();
    const tIdx = txns.findIndex(t => t.id === obj.id);
    const trans = {
      id: obj.id,
      tipo: "saida",
      cliente: obj.descricao,
      categoria: obj.categoria,
      valor: obj.valor,
      data: obj.data,
      status: "pago",
    };
    if (tIdx >= 0) { txns[tIdx] = trans; saveTransactions(txns); }
    else { saveTransactions([trans, ...txns]); }
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-bg-card rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold text-text">{item ? "Editar Despesa" : "Nova Despesa"}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text p-1"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Descricao</label>
            <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Assinatura Adobe"
              className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-danger/50 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Valor (R$)</label>
            <input type="number" step="0.01" min="0" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00"
              className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-danger/50 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Categoria</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}
              className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text outline-none focus:border-danger/50 transition-colors">
              {CATEGORIAS.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Data</label>
            <input type="date" value={data} onChange={(e) => setData(e.target.value)}
              className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text outline-none focus:border-danger/50 transition-colors" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-text font-medium">Despesa Recorrente</p>
              <p className="text-xs text-text-muted">Repete mensalmente</p>
            </div>
            <button onClick={() => setRecorrente(!recorrente)}
              className="relative flex-shrink-0 transition-colors rounded-full"
              style={{ height: "22px", width: "40px", background: recorrente ? "#ff4d6d" : "#2a2a2a" }}>
              <div className="absolute top-0.5 w-[18px] h-[18px] rounded-full bg-black transition-all" style={{ left: recorrente ? "20px" : "2px" }} />
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border-card text-text-secondary hover:text-text transition-colors text-sm">Cancelar</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-danger text-white hover:bg-danger/80 transition-colors text-sm font-semibold">Salvar Despesa</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
