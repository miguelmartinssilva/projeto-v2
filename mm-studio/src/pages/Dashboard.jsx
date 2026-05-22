import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, PiggyBank, Users,
  Plus, ArrowUpRight, ArrowDownRight, FileText,
  Wallet, Target, BarChart3, Clock, ChevronRight,
  CheckCircle2, AlertCircle, XCircle, Circle
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import { getHistorico, getTransactions, getClientes } from "../utils/storage";

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function parseDateBR(str) {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length === 3) return new Date(+parts[2], +parts[1] - 1, +parts[0]);
  return new Date(str + "T12:00:00");
}

function fmtBRL(v) {
  return (v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function statusMeta(s) {
  if (s === "pago" || s === "aprovada" || s === "aprovado")
    return { label: "Pago", icon: CheckCircle2, cls: "text-emerald-400 bg-emerald-400/10" };
  if (s === "pendente")
    return { label: "Pendente", icon: AlertCircle, cls: "text-amber-400 bg-amber-400/10" };
  if (s === "recusada" || s === "perdida")
    return { label: "Cancelado", icon: XCircle, cls: "text-rose-400 bg-rose-400/10" };
  return { label: "Rascunho", icon: Circle, cls: "text-zinc-400 bg-zinc-400/10" };
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-border-card rounded-xl px-4 py-3 text-sm shadow-2xl backdrop-blur-sm">
      <p className="text-text-muted mb-2 text-xs font-semibold tracking-widest uppercase">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-text-secondary">{p.name === "receita" ? "Receita" : "Despesa"}:</span>
          <span className="font-bold text-text">R$ {fmtBRL(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-border-card rounded-xl px-4 py-3 text-xs shadow-2xl">
      <p className="text-text-muted mb-1 font-semibold tracking-widest uppercase">{label}</p>
      <p className="text-text font-bold">R$ {fmtBRL(payload[0]?.value)}</p>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: [0.23, 1, 0.32, 1] } }),
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [chartType, setChartType] = useState("area");
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const { metrics, chartData, barData, recentProposals, recentTransactions, summary } = useMemo(() => {
    const hist = getHistorico();
    const txns = getTransactions();
    const clts = getClientes();
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    const isThisMonth = (d) => d && d.getMonth() === curMonth && d.getFullYear() === curYear;
    const isLastMonth = (d) => {
      const lm = curMonth === 0 ? 11 : curMonth - 1;
      const ly = curMonth === 0 ? curYear - 1 : curYear;
      return d && d.getMonth() === lm && d.getFullYear() === ly;
    };

    const approved = (h) => ["aprovada", "aprovado", "pago"].includes(h.status);

    const monthRevenue = hist.filter(h => isThisMonth(parseDateBR(h.data)) && approved(h)).reduce((s, h) => s + (h.total || 0), 0);
    const lastRevenue  = hist.filter(h => isLastMonth(parseDateBR(h.data)) && approved(h)).reduce((s, h) => s + (h.total || 0), 0);

    const monthExpenses = txns.filter(t => { const d = parseDateBR(t.data); return t.tipo === "saida"   && isThisMonth(d); }).reduce((s, t) => s + (t.valor || 0), 0);
    const lastExpenses  = txns.filter(t => { const d = parseDateBR(t.data); return t.tipo === "saida"   && isLastMonth(d); }).reduce((s, t) => s + (t.valor || 0), 0);
    const monthEntries  = txns.filter(t => { const d = parseDateBR(t.data); return t.tipo === "entrada" && isThisMonth(d); }).reduce((s, t) => s + (t.valor || 0), 0);
    const lastEntries   = txns.filter(t => { const d = parseDateBR(t.data); return t.tipo === "entrada" && isLastMonth(d); }).reduce((s, t) => s + (t.valor || 0), 0);

    const netProfit   = monthEntries - monthExpenses;
    const lastProfit  = lastEntries - lastExpenses;

    const pct = (cur, prev) => prev ? Math.round((cur - prev) / prev * 1000) / 10 : 0;

    const activeClients  = clts.filter(c => c.status === "ativo").length;
    const pendingCount   = hist.filter(h => h.status === "pendente").length;
    const totalProposals = hist.length;
    const convRate = totalProposals ? Math.round(hist.filter(h => approved(h)).length / totalProposals * 100) : 0;

    const metricsArr = [
      { label: "Receita do Mês",  value: `R$ ${fmtBRL(monthRevenue)}`, change: pct(monthRevenue, lastRevenue),   up: monthRevenue >= lastRevenue,   icon: DollarSign,  accent: "#22c55e", bg: "#22c55e18" },
      { label: "Despesas",        value: `R$ ${fmtBRL(monthExpenses)}`, change: pct(monthExpenses, lastExpenses), up: monthExpenses <= lastExpenses,  icon: TrendingUp,  accent: "#f97316", bg: "#f9731618" },
      { label: "Lucro Líquido",   value: `R$ ${fmtBRL(netProfit)}`,     change: pct(netProfit, lastProfit),       up: netProfit >= lastProfit,        icon: PiggyBank,   accent: "#a78bfa", bg: "#a78bfa18" },
      { label: "Clientes Ativos", value: String(activeClients),          change: 0,                                up: true,                           icon: Users,       accent: "#facc15", bg: "#facc1518" },
    ];

    // Chart: 7 meses
    const chartArr = [];
    for (let i = 6; i >= 0; i--) {
      const m = (curMonth - i + 12) % 12;
      const y = curMonth - i < 0 ? curYear - 1 : curYear;
      const receita = txns.filter(t => { const d = parseDateBR(t.data); return d && d.getMonth() === m && d.getFullYear() === y && t.tipo === "entrada"; }).reduce((s, t) => s + (t.valor || 0), 0);
      const despesa = txns.filter(t => { const d = parseDateBR(t.data); return d && d.getMonth() === m && d.getFullYear() === y && t.tipo === "saida";   }).reduce((s, t) => s + (t.valor || 0), 0);
      chartArr.push({ mes: MESES[m], receita, despesa });
    }

    // Bar: lucro por mês (últimos 6)
    const barArr = [];
    for (let i = 5; i >= 0; i--) {
      const m = (curMonth - i + 12) % 12;
      const y = curMonth - i < 0 ? curYear - 1 : curYear;
      const ent = txns.filter(t => { const d = parseDateBR(t.data); return d && d.getMonth() === m && d.getFullYear() === y && t.tipo === "entrada"; }).reduce((s, t) => s + (t.valor || 0), 0);
      const sai = txns.filter(t => { const d = parseDateBR(t.data); return d && d.getMonth() === m && d.getFullYear() === y && t.tipo === "saida";   }).reduce((s, t) => s + (t.valor || 0), 0);
      barArr.push({ mes: MESES[m], lucro: ent - sai });
    }

    const recentProps = hist.slice(0, 5).map(h => ({
      client: h.cliente || "(sem nome)",
      value:  `R$ ${fmtBRL(h.total)}`,
      status: h.status,
      date:   h.data || "",
    }));

    const recentTxns = txns.slice(-5).reverse().map(t => {
      const d    = parseDateBR(t.data);
      if (!d) return null;
      const diff = Math.floor((now - d) / 86400000);
      const dateStr = diff === 0 ? "Hoje" : diff === 1 ? "Ontem" : `${diff}d atrás`;
      const initials = (t.cliente || "NA").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "NA";
      return {
        client:   t.cliente || "N/A",
        avatar:   initials,
        service:  t.categoria || "—",
        value:    `R$ ${fmtBRL(t.valor)}`,
        tipo:     t.tipo,
        status:   t.status || "pendente",
        date:     dateStr,
      };
    }).filter(Boolean);

    return {
      metrics: metricsArr,
      chartData: chartArr,
      barData: barArr,
      recentProposals: recentProps,
      recentTransactions: recentTxns,
      summary: { pendingCount, convRate, totalProposals },
    };
  }, []);

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">
              MM Studio <span className="mx-1.5 text-border-light">/</span>
              <span className="text-text-secondary font-medium">Dashboard</span>
            </p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Visão Geral</h1>
            <p className="text-xs text-text-muted mt-1 capitalize">{today}</p>
          </div>
          <motion.button
            onClick={() => navigate("/orcamento")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
          >
            <Plus size={16} /> Novo Orçamento
          </motion.button>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-bg-card rounded-2xl p-5 border border-border-card relative overflow-hidden group cursor-default"
            >
              {/* accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: m.accent }} />

              <div className="flex items-start justify-between mb-5">
                <span className="text-[10px] uppercase tracking-[0.14em] text-text-muted font-semibold">{m.label}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: m.bg }}>
                  <m.icon size={17} style={{ color: m.accent }} />
                </div>
              </div>

              <p className="font-display text-[1.6rem] font-bold text-text mb-2 leading-none tracking-tight">{m.value}</p>

              <div className="flex items-center gap-1.5">
                {m.up
                  ? <ArrowUpRight size={13} className="text-emerald-400 flex-shrink-0" />
                  : <ArrowDownRight size={13} className="text-rose-400 flex-shrink-0" />}
                <span className={`text-xs font-semibold ${m.up ? "text-emerald-400" : "text-rose-400"}`}>
                  {m.up ? "+" : ""}{m.change}%
                </span>
                <span className="text-xs text-text-muted">vs. mês passado</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Mini KPIs ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: "Orçamentos Pendentes", value: summary.pendingCount, icon: Clock,    color: "text-amber-400", sub: "aguardando aprovação" },
            { label: "Taxa de Conversão",    value: `${summary.convRate}%`, icon: Target,   color: "text-violet-400", sub: "orçamentos aprovados" },
            { label: "Total de Orçamentos",  value: summary.totalProposals, icon: BarChart3, color: "text-sky-400",    sub: "histórico completo" },
          ].map((k, i) => (
            <div key={i} className="bg-bg-card rounded-2xl p-4 border border-border-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                <k.icon size={18} className={k.color} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.12em] text-text-muted font-semibold truncate">{k.label}</p>
                <p className="font-display text-xl font-bold text-text leading-tight">{k.value}</p>
                <p className="text-[11px] text-text-muted truncate">{k.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Area/Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.4 }}
            className="lg:col-span-2 bg-bg-card rounded-2xl p-6 border border-border-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-text tracking-tight">Receita vs Despesas</h2>
                <p className="text-xs text-text-muted mt-0.5">Últimos 7 meses</p>
              </div>
              <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1">
                {[
                  { key: "area", icon: BarChart3, label: "Área" },
                  { key: "bar",  icon: Wallet,    label: "Barra" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setChartType(key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      chartType === key
                        ? "bg-primary text-black shadow-sm"
                        : "text-text-muted hover:text-text"
                    }`}
                  >
                    <Icon size={13} /> {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-5 mb-4">
              <span className="flex items-center gap-2 text-xs text-text-muted">
                <span className="w-3 h-[2px] rounded bg-emerald-400 inline-block" />Receita
              </span>
              <span className="flex items-center gap-2 text-xs text-text-muted">
                <span className="w-3 h-[2px] rounded bg-rose-400 inline-block" />Despesa
              </span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "area" ? (
                  <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#f43f5e" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="receita" name="receita" stroke="#22c55e" strokeWidth={2.5} fill="url(#gR)" dot={false} activeDot={{ r: 5, fill: "#22c55e", stroke: "#0d0d0d", strokeWidth: 2 }} />
                    <Area type="monotone" dataKey="despesa" name="despesa" stroke="#f43f5e" strokeWidth={2.5} fill="url(#gD)" dot={false} activeDot={{ r: 5, fill: "#f43f5e", stroke: "#0d0d0d", strokeWidth: 2 }} />
                  </AreaChart>
                ) : (
                  <BarChart data={barData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip content={<BarTooltip />} />
                    <Bar dataKey="lucro" name="lucro" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={index} fill={entry.lucro >= 0 ? "#22c55e" : "#f43f5e"} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Proposals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.4 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card flex flex-col"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-text tracking-tight">Orçamentos Recentes</h2>
                <p className="text-xs text-text-muted mt-0.5">Últimos cadastrados</p>
              </div>
              <button
                onClick={() => navigate("/historico")}
                className="text-xs text-primary hover:underline flex items-center gap-0.5 font-semibold"
              >
                Ver todos <ChevronRight size={12} />
              </button>
            </div>

            <div className="flex-1 space-y-1.5">
              {recentProposals.length > 0 ? recentProposals.map((p, i) => {
                const meta = statusMeta(p.status);
                const Icon = meta.icon;
                return (
                  <div
                    key={i}
                    onClick={() => navigate("/historico")}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.025] hover:bg-white/[0.05] transition-colors cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-semibold text-text truncate group-hover:text-primary transition-colors">{p.client}</p>
                      <p className="text-xs text-text-muted">{p.date} · <span className="text-text-secondary font-semibold">{p.value}</span></p>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${meta.cls}`}>
                      <Icon size={10} />
                      {meta.label}
                    </div>
                  </div>
                );
              }) : (
                <div className="flex-1 flex items-center justify-center py-12 flex-col gap-2">
                  <FileText size={28} className="text-text-muted opacity-30" />
                  <p className="text-sm text-text-muted">Nenhum orçamento ainda</p>
                  <button onClick={() => navigate("/orcamento")} className="text-xs text-primary hover:underline mt-1">Criar primeiro orçamento</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Recent Transactions ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-bg-card rounded-2xl p-6 border border-border-card"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-text tracking-tight">Últimas Transações</h2>
              <p className="text-xs text-text-muted mt-0.5">Movimentações recentes</p>
            </div>
            <button
              onClick={() => navigate("/financeiro")}
              className="text-xs text-primary hover:underline flex items-center gap-0.5 font-semibold"
            >
              Ver tudo <ChevronRight size={12} />
            </button>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-sm min-w-[520px]">
                <thead>
                  <tr className="text-text-muted text-[10px] uppercase tracking-[0.12em] border-b border-border-card">
                    <th className="text-left pb-3 px-2 font-semibold">Cliente</th>
                    <th className="text-left pb-3 px-2 font-semibold">Categoria</th>
                    <th className="text-left pb-3 px-2 font-semibold">Tipo</th>
                    <th className="text-right pb-3 px-2 font-semibold">Valor</th>
                    <th className="text-right pb-3 px-2 font-semibold">Status</th>
                    <th className="text-right pb-3 pl-2 pr-1 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-card/40">
                  {recentTransactions.map((t, i) => {
                    const meta = statusMeta(t.status);
                    const StatusIcon = meta.icon;
                    return (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                              {t.avatar}
                            </div>
                            <span className="text-text font-semibold text-sm">{t.client}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-text-secondary text-xs">{t.service}</td>
                        <td className="py-3 px-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide ${t.tipo === "entrada" ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"}`}>
                            {t.tipo === "entrada" ? "Entrada" : "Saída"}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-display font-bold text-text text-sm">{t.value}</td>
                        <td className="py-3 px-2 text-right">
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${meta.cls}`}>
                            <StatusIcon size={10} /> {meta.label}
                          </div>
                        </td>
                        <td className="py-3 pl-2 pr-1 text-right text-text-muted text-xs">{t.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 gap-2">
              <Wallet size={32} className="text-text-muted opacity-30" />
              <p className="text-sm text-text-muted">Nenhuma transação encontrada</p>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
