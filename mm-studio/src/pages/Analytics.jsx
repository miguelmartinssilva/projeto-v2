import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, DollarSign, Users, FileText, Target } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { getHistorico, getTransactions, getClientes, getFixos } from "../utils/storage";

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function parseDateBR(str) {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length === 3) return new Date(+parts[2], +parts[1] - 1, +parts[0]);
  return new Date(str + "T12:00:00");
}
function fmtBRL(v) { return (v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 }); }

export default function Analytics() {
  const [periodo, setPeriodo] = useState(12);
  const [chartType, setChartType] = useState("receita");

  const data = useMemo(() => {
    const txns = getTransactions();
    const hist = getHistorico();
    const clts = getClientes();
    const fixos = getFixos();
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    const months = [];
    for (let i = periodo - 1; i >= 0; i--) {
      const m = (curMonth - i + 12) % 12;
      const y = curMonth - i < 0 ? curYear - 1 : curYear;
      const receita = txns.filter(t => { const d = parseDateBR(t.data); return d && d.getMonth() === m && d.getFullYear() === y && t.tipo === "entrada"; }).reduce((s, t) => s + (t.valor || 0), 0);
      const despesa = txns.filter(t => { const d = parseDateBR(t.data); return d && d.getMonth() === m && d.getFullYear() === y && t.tipo === "saida"; }).reduce((s, t) => s + (t.valor || 0), 0);
      const fixosVal = fixos.filter(f => f.ativo !== false).reduce((s, f) => {
        const p = f.historicoFinanceiro?.findLast(h => h.mes === `${y}-${String(m + 1).padStart(2, "0")}`);
        return s + (p?.status === "pago" ? (p.valor || 0) : 0);
      }, 0);
      months.push({ mes: MESES[m], receita: receita + fixosVal, despesa, lucro: receita + fixosVal - despesa, ano: y });
    }

    const totalTxns = txns.length;
    const entradas = txns.filter(t => t.tipo === "entrada").length;
    const saidas = txns.filter(t => t.tipo === "saida").length;
    const approved = hist.filter(h => ["aprovada","aprovado","pago"].includes(h.status));
    const convRate = hist.length ? Math.round(approved.length / hist.length * 100) : 0;

    const catMap = {};
    txns.filter(t => t.tipo === "entrada").forEach(t => {
      const cat = t.categoria || "Outros";
      catMap[cat] = (catMap[cat] || 0) + (t.valor || 0);
    });
    const PIE_COLORS = ["#22c55e","#7c3aed","#448aff","#facc15","#ff6b35","#a0a0a0"];
    const receitaPie = Object.entries(catMap).sort((a, b) => b[1] - a[1]).map(([k, v], i) => ({ name: k, value: Math.round(v / Object.values(catMap).reduce((s, x) => s + x, 0) * 100), color: PIE_COLORS[i % PIE_COLORS.length] }));

    const totalRevenue = txns.filter(t => t.tipo === "entrada").reduce((s, t) => s + (t.valor || 0), 0) + fixos.filter(f => f.ativo !== false).reduce((s, f) => {
      const p = f.historicoFinanceiro?.findLast(h => h.status === "pago");
      return s + (p?.valor || 0);
    }, 0);
    const totalExpenses = txns.filter(t => t.tipo === "saida").reduce((s, t) => s + (t.valor || 0), 0);

    return { months, stats: { entradas, saidas, totalTxns, convRate, totalRevenue, totalExpenses, netProfit: totalRevenue - totalExpenses, activeClients: clts.filter(c => c.status === "ativo").length + fixos.filter(f => f.ativo !== false).length }, receitaPie };
  }, [periodo]);

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">Analytics</span></p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Analytics</h1>
            <p className="text-xs text-text-muted mt-1">Metricas e insights detalhados do negocio</p>
          </div>
          <div className="flex gap-1 bg-white/[0.04] rounded-xl p-1">
            {[6, 12, 24].map(p => (
              <button key={p} onClick={() => setPeriodo(p)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${periodo === p ? "bg-primary text-black" : "text-text-muted hover:text-text"}`}>{p}m</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Receita Total", value: `R$ ${fmtBRL(data.stats.totalRevenue)}`, icon: DollarSign, color: "#22c55e" },
            { label: "Despesas", value: `R$ ${fmtBRL(data.stats.totalExpenses)}`, icon: TrendingUp, color: "#ff4d6d" },
            { label: "Lucro Liq.", value: `R$ ${fmtBRL(data.stats.netProfit)}`, icon: Target, color: "#a78bfa" },
            { label: "Clientes", value: String(data.stats.activeClients), icon: Users, color: "#facc15" },
            { label: "Conver.", value: `${data.stats.convRate}%`, icon: BarChart3, color: "#448aff" },
            { label: "Transac.", value: String(data.stats.totalTxns), icon: FileText, color: "#ff6b35" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-bg-card rounded-xl p-4 border border-border-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18` }}><s.icon size={13} style={{ color: s.color }} /></div>
                <span className="text-[10px] text-text-muted font-semibold uppercase tracking-[0.1em]">{s.label}</span>
              </div>
              <p className="font-display text-lg font-bold text-text">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text">Evolucao Financeira</h2>
              <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5">
                {["receita", "lucro"].map(t => (
                  <button key={t} onClick={() => setChartType(t)} className={`px-2.5 py-1 rounded-md text-[10px] font-semibold ${chartType === t ? "bg-primary text-black" : "text-text-muted hover:text-text"}`}>
                    {t === "receita" ? "Receita" : "Lucro"}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.months} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="100%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} /><stop offset="100%" stopColor="#a78bfa" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip />
                  <Area type="monotone" dataKey={chartType === "receita" ? "receita" : "lucro"} name={chartType === "receita" ? "Receita" : "Lucro"} stroke={chartType === "receita" ? "#22c55e" : "#a78bfa"} strokeWidth={2.5} fill={`url(#${chartType === "receita" ? "gA" : "gL"})`} dot={false} />
                  <Area type="monotone" dataKey="despesa" name="Despesa" stroke="#ff4d6d" strokeWidth={1.5} strokeDasharray="4 3" fill="none" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card">
            <h2 className="text-sm font-bold text-text mb-4">Receita por Categoria</h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.receitaPie} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {data.receitaPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-3">
              {data.receitaPie.map(e => (
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: e.color }} /><span className="text-text-muted">{e.name}</span></div>
                  <span className="text-text font-medium">{e.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="bg-bg-card rounded-2xl p-6 border border-border-card">
          <h2 className="text-sm font-bold text-text mb-4">Lucro Líquido por Mês</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.months} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip />
                <Bar dataKey="lucro" radius={[6, 6, 0, 0]}>
                  {data.months.map((e, i) => <Cell key={i} fill={e.lucro >= 0 ? "#22c55e" : "#ff4d6d"} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}