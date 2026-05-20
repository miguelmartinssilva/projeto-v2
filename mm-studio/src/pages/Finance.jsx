import { useMemo } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingDown, PiggyBank, Clock, ArrowUpRight, ArrowDownRight, Check } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getTransactions, getDespesas } from "../utils/storage";

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const PIE_COLORS = ["#00e676","#7c3aed","#448aff","#ffb800","#ff6b35","#ff4d6d","#00bcd4","#69f0ae"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-bg-elevated border border-border-card rounded-xl px-4 py-3 text-sm shadow-2xl">
      <p className="text-text-muted mb-2 font-semibold text-xs tracking-wide">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-secondary">{p.name === "receita" ? "Receita" : "Despesa"}:</span>
          <span className="font-semibold text-text">R$ {p.value.toLocaleString("pt-BR")}</span>
        </div>
      ))}
    </div>
  );
}

export default function Finance() {
  const now = new Date();
  const curMonth = now.getMonth();
  const curYear = now.getFullYear();

  const { topCards, chartData, pieData, pendings } = useMemo(() => {
    const txns = getTransactions();
    const despesas = getDespesas();
    const saidas = [
      ...txns.filter(t => t.tipo === "saida"),
      ...despesas.filter(d => !txns.some(t => t.tipo === "saida" && t.id === d.id)),
    ];
    const allTxns = [...txns.filter(t => t.tipo !== "saida"), ...saidas];

    const totalEntradas = txns.filter(t => t.tipo === "entrada").reduce((s, t) => s + (t.valor || 0), 0);
    const totalSaidas = allTxns.filter(t => t.tipo === "saida").reduce((s, t) => s + (t.valor || 0), 0);
    const totalPendentes = txns.filter(t => t.status === "pendente").reduce((s, t) => s + (t.valor || 0), 0);
    const lucro = totalEntradas - totalSaidas;

    const lastMonthEntradas = txns.filter(t => {
      const d = new Date(t.data + "T12:00:00");
      const lm = curMonth === 0 ? 11 : curMonth - 1;
      const ly = curMonth === 0 ? curYear - 1 : curYear;
      return t.tipo === "entrada" && d.getMonth() === lm && d.getFullYear() === ly;
    }).reduce((s, t) => s + (t.valor || 0), 0);

    const lastMonthSaidas = allTxns.filter(t => {
      const d = new Date(t.data + "T12:00:00");
      const lm = curMonth === 0 ? 11 : curMonth - 1;
      const ly = curMonth === 0 ? curYear - 1 : curYear;
      return t.tipo === "saida" && d.getMonth() === lm && d.getFullYear() === ly;
    }).reduce((s, t) => s + (t.valor || 0), 0);

    const lastMonthPendentes = txns.filter(t => {
      const d = new Date(t.data + "T12:00:00");
      const lm = curMonth === 0 ? 11 : curMonth - 1;
      const ly = curMonth === 0 ? curYear - 1 : curYear;
      return t.status === "pendente" && d.getMonth() === lm && d.getFullYear() === ly;
    }).reduce((s, t) => s + (t.valor || 0), 0);

    const cards = [
      { label: "Receita Total", value: `R$ ${totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, change: lastMonthEntradas ? Math.abs(Math.round((totalEntradas - lastMonthEntradas) / lastMonthEntradas * 100 * 10) / 10) : 0, icon: DollarSign, borderClass: "border-top-green", color: "#00e676", up: totalEntradas >= lastMonthEntradas },
      { label: "Despesas", value: `R$ ${totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, change: lastMonthSaidas ? Math.abs(Math.round((totalSaidas - lastMonthSaidas) / lastMonthSaidas * 100 * 10) / 10) : 0, icon: TrendingDown, borderClass: "border-top-red", color: "#ff4d6d", up: false },
      { label: "Lucro Liquido", value: `R$ ${lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, change: 0, icon: PiggyBank, borderClass: "border-top-purple", color: "#7c3aed", up: true },
      { label: "Pendentes", value: `R$ ${totalPendentes.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, change: lastMonthPendentes ? Math.abs(Math.round((totalPendentes - lastMonthPendentes) / lastMonthPendentes * 100 * 10) / 10) : 0, icon: Clock, borderClass: "border-top-orange", color: "#ff6b35", up: totalPendentes <= lastMonthPendentes },
    ];

    const chart = [];
    for (let i = 6; i >= 0; i--) {
      const m = (curMonth - i + 12) % 12;
      const y = curMonth - i < 0 ? curYear - 1 : curYear;
      const receita = txns.filter(t => { const d = new Date(t.data + "T12:00:00"); return d.getMonth() === m && d.getFullYear() === y && t.tipo === "entrada"; }).reduce((s, t) => s + (t.valor || 0), 0);
      const despesa = allTxns.filter(t => { const d = new Date(t.data + "T12:00:00"); return d.getMonth() === m && d.getFullYear() === y && t.tipo === "saida"; }).reduce((s, t) => s + (t.valor || 0), 0);
      chart.push({ mes: MESES[m], receita, despesa });
    }

    const catMap = {};
    txns.filter(t => t.tipo === "entrada").forEach(t => {
      const cat = t.categoria || "outros";
      catMap[cat] = (catMap[cat] || 0) + (t.valor || 0);
    });
    const totalCat = Object.values(catMap).reduce((s, v) => s + v, 0) || 1;
    const pie = Object.entries(catMap).map(([name, value], i) => ({
      name: name.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      value: Math.round(value / totalCat * 100),
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));

    const pends = txns.filter(t => t.status === "pendente").slice(0, 10).map(t => {
      const initials = (t.cliente || "N/A").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
      const d = new Date(t.data + "T12:00:00");
      const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
      return {
        client: t.cliente || "N/A",
        avatar: initials || "NA",
        service: t.categoria || "",
        value: `R$ ${(t.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        date: t.data,
        overdue: diff > 7,
      };
    });

    return { topCards: cards, chartData: chart, pieData: pie, pendings: pends };
  }, []);

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span> <span className="text-text-secondary font-medium">Financeiro</span></p>
            <h1 className="text-xl font-display font-bold text-text">Financeiro</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {topCards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`bg-bg-card rounded-xl p-5 ${c.borderClass} glow-primary`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-medium">{c.label}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${c.color}18` }}>
                  <c.icon size={18} style={{ color: c.color }} />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-text mb-1.5">{c.value}</p>
              <div className="flex items-center gap-1.5">
                {c.up ? <ArrowUpRight size={13} className="text-success" /> : <ArrowDownRight size={13} className="text-danger" />}
                <span className={`text-xs font-medium ${c.up ? "text-success" : "text-danger"}`}>{c.up ? "+" : ""}{c.change}% vs. mes passado</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-bg-card rounded-xl p-6 card-border glow-primary">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-6">Receitas vs Despesas</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00e676" stopOpacity={0.3} /><stop offset="100%" stopColor="#00e676" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff4d6d" stopOpacity={0.2} /><stop offset="100%" stopColor="#ff4d6d" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="receita" stroke="#00e676" strokeWidth={2.5} fill="url(#gr)" dot={{ fill: "#00e676", r: 3 }} activeDot={{ r: 5, strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="despesa" stroke="#ff4d6d" strokeWidth={2.5} fill="url(#gd)" dot={{ fill: "#ff4d6d", r: 3 }} activeDot={{ r: 5, strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-bg-card rounded-xl p-6 card-border glow-primary">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Por Servico</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2">
              {pieData.map((e) => (
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: e.color }} /><span className="text-text-muted">{e.name}</span></div>
                  <span className="text-text font-medium">{e.value}%</span>
                </div>
              ))}
              {pieData.length === 0 && <p className="text-xs text-text-muted text-center py-4">Nenhum dado disponivel</p>}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-bg-card rounded-xl p-6 card-border glow-warning">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4 flex items-center gap-2"><Clock size={15} className="text-pending" /> Pendencias</h2>
          {pendings.length > 0 ? pendings.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-bg-elevated border border-border-card/50 mb-2 last:mb-0 hover:bg-white/[0.03] transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-bg-card border border-border-card flex items-center justify-center text-xs font-bold text-primary">{p.avatar}</div>
                <div>
                  <p className="text-sm font-medium text-text">{p.client}</p>
                  <p className="text-xs text-text-muted">{p.service} &middot; {p.value}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs font-semibold ${p.overdue ? "text-danger" : "text-pending"}`}>{p.overdue ? "Vencido" : "Pendente"}</p>
                <p className="text-[11px] text-text-muted">{p.date}</p>
              </div>
              <button className="ml-3 p-2 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all"><Check size={14} /></button>
            </div>
          )) : (
            <p className="text-sm text-text-muted text-center py-8">Nenhuma pendencia</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
