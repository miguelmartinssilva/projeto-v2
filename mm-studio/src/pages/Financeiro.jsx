import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, TrendingUp, PiggyBank, Plus, X, Trash2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getTransactions, saveTransactions, getDespesas, saveDespesa, deleteDespesa, getFixos } from "../utils/storage";

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const CAT_DESPESA = ["Aluguel","Internet","Software","Equipamento","Freela","Marketing","Transporte","Escritorio","Outros"];

function parseDateBR(str) {
  if (!str) return null;
  const p = str.split("/"); if (p.length === 3) return new Date(+p[2], +p[1] - 1, +p[0]);
  return new Date(str + "T12:00:00");
}
function fmt(v) { return (v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 }); }

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function incomeFormInit() { return { cliente: "", valor: "", categoria: "Design", data: new Date().toISOString().slice(0, 10) }; }
function expenseFormInit() { return { descricao: "", valor: "", categoria: "Outros", data: new Date().toISOString().slice(0, 10) }; }

export default function Financeiro() {
  const [txns, setTxns] = useState(() => getTransactions());
  const [despesas, setDespesas] = useState(() => getDespesas());
  const [showIncome, setShowIncome] = useState(false);
  const [showExpense, setShowExpense] = useState(false);
  const [incomeForm, setIncomeForm] = useState(incomeFormInit());
  const [expenseForm, setExpenseForm] = useState(expenseFormInit());
  const [editExpense, setEditExpense] = useState(null);

  const refresh = () => { setTxns(getTransactions()); setDespesas(getDespesas()); };

  const { receitaTotal, despesaTotal, lucro, chartData, pieDespesas, expensesList } = useMemo(() => {
    const now = new Date();
    const cm = now.getMonth(), cy = now.getFullYear();
    const isCM = (d) => d && d.getMonth() === cm && d.getFullYear() === cy;

    const entradas = txns.filter(t => t.tipo === "entrada" && isCM(parseDateBR(t.data))).reduce((s, t) => s + (t.valor || 0), 0);
    const fixosRev = getFixos().filter(f => f.ativo !== false).reduce((s, f) => {
      const p = f.historicoFinanceiro?.findLast(h => h.mes === `${cy}-${String(cm + 1).padStart(2, "0")}`);
      return s + (p?.status === "pago" ? (p.valor || 0) : 0);
    }, 0);
    const receita = entradas + fixosRev;

    const despesaMap = {};
    const despesasAll = despesas.filter(d => isCM(parseDateBR(d.data)));
    despesasAll.forEach(d => {
      const cat = d.categoria || "Outros";
      despesaMap[cat] = (despesaMap[cat] || 0) + (d.valor || 0);
    });
    const saidas = txns.filter(t => t.tipo === "saida" && isCM(parseDateBR(t.data))).reduce((s, t) => s + (t.valor || 0), 0);
    const totalDesp = despesasAll.reduce((s, d) => s + (d.valor || 0), 0) + saidas;

    const chart = [];
    for (let i = 6; i >= 0; i--) {
      const m = (cm - i + 12) % 12, y = cm - i < 0 ? cy - 1 : cy;
      const r = txns.filter(t => { const d = parseDateBR(t.data); return d && d.getMonth() === m && d.getFullYear() === y && t.tipo === "entrada"; }).reduce((s, t) => s + (t.valor || 0), 0);
      const d = despesas.filter(x => { const dd = parseDateBR(x.data); return dd && dd.getMonth() === m && dd.getFullYear() === y; }).reduce((s, x) => s + (x.valor || 0), 0) +
        txns.filter(t => { const dd = parseDateBR(t.data); return dd && dd.getMonth() === m && dd.getFullYear() === y && t.tipo === "saida"; }).reduce((s, t) => s + (t.valor || 0), 0);
      chart.push({ mes: MESES[m], receita: r, despesa: d });
    }

    const pie = Object.entries(despesaMap).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({
      name: k, value: Math.round(v / (totalDesp || 1) * 100),
      color: ["#ff4d6d","#facc15","#7c3aed","#448aff","#ff6b35","#a78bfa","#22c55e","#a0a0a0","#e4405f"][Object.keys(despesaMap).indexOf(k) % 9],
    }));

    const allExpenses = [
      ...despesasAll.map(d => ({ ...d, tipo: "despesa" })),
      ...txns.filter(t => t.tipo === "saida" && isCM(parseDateBR(t.data))).map(t => ({ ...t, tipo: "transacao" })),
    ].sort((a, b) => new Date(b.data) - new Date(a.data));

    return { receitaTotal: receita, despesaTotal: totalDesp, lucro: receita - totalDesp, chartData: chart, pieDespesas: pie, expensesList: allExpenses };
  }, [txns, despesas]);

  const saveIncome = () => {
    if (!incomeForm.cliente.trim() || !incomeForm.valor) return;
    const lista = getTransactions();
    lista.push({ ...incomeForm, valor: parseFloat(incomeForm.valor) || 0, tipo: "entrada", id: uid(), status: "pago" });
    saveTransactions(lista);
    refresh();
    setShowIncome(false);
    setIncomeForm(incomeFormInit());
  };

  const saveExpense = () => {
    if (!expenseForm.descricao.trim() || !expenseForm.valor) return;
    const item = { ...expenseForm, valor: parseFloat(expenseForm.valor) || 0, id: editExpense?.id || uid() };
    saveDespesa(item);
    const txnsList = getTransactions();
    txnsList.push({ cliente: expenseForm.descricao, valor: parseFloat(expenseForm.valor) || 0, categoria: expenseForm.categoria, data: expenseForm.data, tipo: "saida", id: uid() });
    saveTransactions(txnsList);
    refresh();
    setShowExpense(false);
    setExpenseForm(expenseFormInit());
    setEditExpense(null);
  };

  const delExpense = (id) => {
    deleteDespesa(id);
    refresh();
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">Visao geral <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">Financeiro</span></p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Financeiro</h1>
            <p className="text-xs text-text-muted mt-1">Controle financeiro do seu negocio</p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setIncomeForm(incomeFormInit()); setShowIncome(true); }}
              className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
              <Plus size={15} /> Entrada
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setExpenseForm(expenseFormInit()); setEditExpense(null); setShowExpense(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg bg-danger/15 text-danger hover:bg-danger/25 transition-colors">
              <Plus size={15} /> Despesa
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Receita Total", value: `R$ ${fmt(receitaTotal)}`, icon: DollarSign, accent: "#22c55e", bg: "#22c55e18" },
            { label: "Despesas",  value: `R$ ${fmt(despesaTotal)}`, icon: TrendingUp, accent: "#ff4d6d", bg: "#ff4d6d18" },
            { label: "Lucro Líquido", value: `R$ ${fmt(lucro)}`, icon: PiggyBank, accent: lucro >= 0 ? "#a78bfa" : "#ff4d6d", bg: lucro >= 0 ? "#a78bfa18" : "#ff4d6d18" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-bg-card rounded-2xl p-5 border border-border-card relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: s.accent }} />
              <div className="flex items-start justify-between mb-3">
                <span className="text-[10px] uppercase tracking-[0.14em] text-text-muted font-semibold">{s.label}</span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: s.bg }}><s.icon size={15} style={{ color: s.accent }} /></div>
              </div>
              <p className="font-display text-xl font-bold text-text">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="lg:col-span-2 bg-bg-card rounded-2xl p-6 border border-border-card">
            <h2 className="text-sm font-bold text-text tracking-tight mb-4">Receita vs Despesas</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff4d6d" stopOpacity={0.2} /><stop offset="100%" stopColor="#ff4d6d" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="receita" name="Receita" stroke="#22c55e" strokeWidth={2.5} fill="url(#gR)" dot={false} />
                  <Area type="monotone" dataKey="despesa" name="Despesa" stroke="#ff4d6d" strokeWidth={2.5} fill="url(#gD)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card">
            <h2 className="text-sm font-bold text-text tracking-tight mb-4">Despesas por Categoria</h2>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieDespesas} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieDespesas.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 mt-3">
              {pieDespesas.map(e => (
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: e.color }} /><span className="text-text-muted">{e.name}</span></div>
                  <span className="text-text font-medium">{e.value}%</span>
                </div>
              ))}
              {pieDespesas.length === 0 && <p className="text-xs text-text-muted text-center py-4">Nenhuma despesa</p>}
            </div>
          </motion.div>
        </div>

        <div className="bg-bg-card rounded-2xl border border-border-card overflow-hidden">
          <div className="p-4 border-b border-border-card flex items-center justify-between">
            <h2 className="text-sm font-bold text-text">Despesas do Mes</h2>
            <span className="text-xs text-text-muted">{expensesList.length} registro{expensesList.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-[10px] uppercase tracking-[0.12em] border-b border-border-card">
                  <th className="text-left pb-3 px-4 pt-2 font-semibold">Descricao</th>
                  <th className="text-left pb-3 px-4 pt-2 font-semibold">Categoria</th>
                  <th className="text-left pb-3 px-4 pt-2 font-semibold">Data</th>
                  <th className="text-right pb-3 px-4 pt-2 font-semibold">Valor</th>
                  <th className="text-right pb-3 px-4 pt-2 font-semibold">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-card/40">
                {expensesList.map(d => (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-text font-medium text-sm">{d.descricao || d.cliente || "—"}</td>
                    <td className="py-3 px-4 text-text-muted text-xs">{d.categoria || "—"}</td>
                    <td className="py-3 px-4 text-text-muted text-xs">{d.data || "—"}</td>
                    <td className="py-3 px-4 text-right text-danger font-semibold text-sm">-R$ {fmt(d.valor)}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => delExpense(d.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={12} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {expensesList.length === 0 && <div className="py-12 text-center text-sm text-text-muted">Nenhuma despesa este mes</div>}
        </div>
      </div>

      <AnimatePresence>
        {showIncome && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowIncome(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5"><h2 className="text-base font-bold text-text">Nova Entrada</h2><button onClick={() => setShowIncome(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button></div>
              <div className="space-y-4">
                <div className="floating-label"><input type="text" placeholder=" " value={incomeForm.cliente} onChange={e => setIncomeForm(f => ({ ...f, cliente: e.target.value }))} /><label>Cliente</label></div>
                <div className="floating-label"><input type="number" placeholder=" " value={incomeForm.valor} onChange={e => setIncomeForm(f => ({ ...f, valor: e.target.value }))} className="has-icon" /><DollarSign size={14} className="input-icon" /><label>Valor</label></div>
                <div className="floating-label">
                  <select value={incomeForm.categoria} onChange={e => setIncomeForm(f => ({ ...f, categoria: e.target.value }))}>
                    <option value="Design">Design</option><option value="Social Media">Social Media</option><option value="Video">Video</option><option value="Evento">Evento</option><option value="Site">Site</option><option value="Consultoria">Consultoria</option><option value="Outros">Outros</option>
                  </select>
                  <label>Categoria</label>
                </div>
                <div className="floating-label"><input type="date" value={incomeForm.data} onChange={e => setIncomeForm(f => ({ ...f, data: e.target.value }))} /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowIncome(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted">Cancelar</button>
                <button onClick={saveIncome} className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showExpense && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowExpense(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5"><h2 className="text-base font-bold text-text">{editExpense ? "Editar" : "Nova"} Despesa</h2><button onClick={() => setShowExpense(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button></div>
              <div className="space-y-4">
                <div className="floating-label"><input type="text" placeholder=" " value={expenseForm.descricao} onChange={e => setExpenseForm(f => ({ ...f, descricao: e.target.value }))} /><label>Descricao</label></div>
                <div className="floating-label"><input type="number" placeholder=" " value={expenseForm.valor} onChange={e => setExpenseForm(f => ({ ...f, valor: e.target.value }))} className="has-icon" /><DollarSign size={14} className="input-icon" /><label>Valor</label></div>
                <div className="floating-label">
                  <select value={expenseForm.categoria} onChange={e => setExpenseForm(f => ({ ...f, categoria: e.target.value }))}>
                    {CAT_DESPESA.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <label>Categoria</label>
                </div>
                <div className="floating-label"><input type="date" value={expenseForm.data} onChange={e => setExpenseForm(f => ({ ...f, data: e.target.value }))} /></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowExpense(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted">Cancelar</button>
                <button onClick={saveExpense} className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}