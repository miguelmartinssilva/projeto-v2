import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, Users, Target, Plus, ArrowUpRight, ArrowDownRight,
  Calendar, ChevronRight, CheckCircle2, AlertCircle, UserPlus, FileText, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";
import { getHistorico, getTransactions, getClientes, getFixos, getAgenda } from "../utils/storage";

const DIAS = ["Seg","Ter","Qua","Qui","Sex","Sab","Dom"];

function parseDateBR(str) {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length === 3) return new Date(+parts[2], +parts[1] - 1, +parts[0]);
  return new Date(str + "T12:00:00");
}

function fmtBRL(v) {
  return (v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function hoje() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] } }),
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-border-card rounded-xl px-4 py-3 text-sm shadow-2xl backdrop-blur-sm">
      <p className="text-text-muted mb-2 text-xs font-semibold tracking-widest uppercase">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-text-secondary">{p.name}:</span>
          <span className="font-bold text-text">R$ {fmtBRL(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const greet = saudacao();

  const { metrics, weekRevenue, channels, recentActivities, todayEvents, alerts } = useMemo(() => {
    const hist = getHistorico();
    const txns = getTransactions();
    const clts = getClientes();
    const fixos = getFixos();
    const agenda = getAgenda();
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

    const monthEntries = txns.filter(t => { const d = parseDateBR(t.data); return t.tipo === "entrada" && isThisMonth(d); }).reduce((s, t) => s + (t.valor || 0), 0);
    const lastEntries  = txns.filter(t => { const d = parseDateBR(t.data); return t.tipo === "entrada" && isLastMonth(d); }).reduce((s, t) => s + (t.valor || 0), 0);
    const fixosRevenue = fixos.filter(f => f.ativo !== false).reduce((s, f) => {
      const payStatus = f.historicoFinanceiro?.findLast(h => h.mes === `${curYear}-${String(curMonth + 1).padStart(2, "0")}`);
      return s + (payStatus?.status === "pago" ? (payStatus?.valor || 0) : 0);
    }, 0);
    const fixosLast = fixos.filter(f => f.ativo !== false).reduce((s, f) => {
      const prevMonth = curMonth === 0 ? 11 : curMonth - 1;
      const prevYear = curMonth === 0 ? curYear - 1 : curYear;
      const payStatus = f.historicoFinanceiro?.findLast(h => h.mes === `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}`);
      return s + (payStatus?.status === "pago" ? (payStatus?.valor || 0) : 0);
    }, 0);
    const totalRev = monthEntries + fixosRevenue;
    const totalLast = lastEntries + fixosLast;
    const pct = (cur, prev) => prev ? Math.round((cur - prev) / prev * 1000) / 10 : 0;

    const activeClients = clts.filter(c => c.status === "ativo").length + fixos.filter(f => f.ativo !== false).length;
    const totalProposals = hist.length;
    const convRate = totalProposals ? Math.round(hist.filter(h => approved(h)).length / totalProposals * 100) : 0;
    const monthGoal = 30000;
    const goalProgress = Math.min(100, Math.round(totalRev / monthGoal * 100));

    const metricsArr = [
      { label: "Receita do Mes", value: `R$ ${fmtBRL(totalRev)}`, change: pct(totalRev, totalLast), up: totalRev >= totalLast, icon: DollarSign, accent: "#22c55e", bg: "#22c55e18" },
      { label: "Clientes Ativos", value: String(activeClients), change: 0, up: true, icon: Users, accent: "#facc15", bg: "#facc1518" },
      { label: "Conversao",       value: `${convRate}%`, change: 0, up: true, icon: TrendingUp, accent: "#7c3aed", bg: "#7c3aed18" },
      { label: "Meta do Mes",     value: `${goalProgress}%`, change: 0, up: true, icon: Target, accent: "#448aff", bg: "#448aff18" },
    ];

    const weekArr = [];
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const receita = txns.filter(t => {
        const td = parseDateBR(t.data);
        return td && t.tipo === "entrada" &&
          td.getDate() === d.getDate() && td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      }).reduce((s, t) => s + (t.valor || 0), 0);
      weekArr.push({ dia: DIAS[i], receita });
    }

    const channels = [
      { name: "Direto",    value: 35, color: "#22c55e" },
      { name: "Indicacao", value: 25, color: "#7c3aed" },
      { name: "Instagram", value: 20, color: "#facc15" },
      { name: "Google",    value: 12, color: "#448aff" },
      { name: "Outros",    value: 8,  color: "#a0a0a0" },
    ];

    const recentActs = txns.slice(-5).reverse().map(t => {
      const d = parseDateBR(t.data);
      const diff = d ? Math.floor((now - d) / 86400000) : 99;
      const dateStr = diff === 0 ? "ha pouco" : diff === 1 ? "ha 1 dia" : `ha ${diff} dias`;
      const initials = (t.cliente || "NA").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "NA";
      return {
        initials, client: t.cliente || "N/A", action: t.tipo === "entrada" ? "registrou pagamento" : "nova despesa",
        value: `R$ ${fmtBRL(t.valor)}`, date: dateStr, tipo: t.tipo,
      };
    }).concat(
      hist.slice(0, 3).map(h => {
        const initials = (h.cliente || "NA").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "NA";
        return { initials, client: h.cliente || "N/A", action: approved(h) ? "fechou orcamento" : "criou orcamento",
          value: `R$ ${fmtBRL(h.total)}`, date: "hoje", tipo: "orcamento" };
      })
    ).slice(0, 5);

    const todayEvents = agenda.filter(e => {
      if (!e.data) return false;
      return e.data === hoje();
    }).slice(0, 4);

    const alertsArr = [];
    const dueBoletos = txns.filter(t => {
      if (t.tipo !== "saida") return false;
      const d = parseDateBR(t.data);
      return d && d <= now && t.status !== "pago";
    }).length;
    if (dueBoletos > 0) alertsArr.push({ icon: AlertCircle, color: "text-danger", text: `${dueBoletos} conta${dueBoletos > 1 ? "s" : ""} vence${dueBoletos > 1 ? "m" : ""} hoje` });
    if (goalProgress < 100) alertsArr.push({ icon: Target, color: "text-warning", text: `Meta mensal a ${goalProgress}%` });
    const inactiveClients = clts.filter(c => c.status === "inativo").length;
    if (inactiveClients > 0) alertsArr.push({ icon: Users, color: "text-info", text: `${inactiveClients} cliente${inactiveClients > 1 ? "s" : ""} inativo${inactiveClients > 1 ? "s" : ""} > 30 dias` });

    return {
      metrics: metricsArr,
      weekRevenue: weekArr,
      channels,
      recentActivities: recentActs,
      todayEvents,
      alerts: alertsArr,
    };
  }, []);

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">
              MM Studio <span className="mx-1.5 text-border-light">/</span>
              <span className="text-text-secondary font-medium">Dashboard</span>
            </p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">{greet}, Admin <span className="wave">👋</span></h1>
            <p className="text-xs text-text-muted mt-1">Visao consolidada do seu negocio em tempo real.</p>
          </div>
          <motion.button
            onClick={() => navigate("/orcamento")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
          >
            <Plus size={16} /> Nova Acao
          </motion.button>
        </div>

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
                <span className="text-xs text-text-muted">vs. mes anterior</span>
              </div>
              {m.label === "Meta do Mes" && (
                <div className="mt-3 h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, parseInt(m.value))}%`, background: m.accent }} />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.4 }}
            className="lg:col-span-2 bg-bg-card rounded-2xl p-6 border border-border-card"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-text tracking-tight">Receita Diaria</h2>
                <p className="text-xs text-text-muted mt-0.5">Receita realizada na semana corrente <span className="text-emerald-400 font-semibold">+24% WoW</span></p>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekRevenue} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gW" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#22c55e" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="receita" name="Receita" stroke="#22c55e" strokeWidth={2.5} fill="url(#gW)" dot={false} activeDot={{ r: 5, fill: "#22c55e", stroke: "#0d0d0d", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card"
          >
            <h2 className="text-sm font-bold text-text tracking-tight mb-1">Canais de Aquisicao</h2>
            <p className="text-xs text-text-muted mb-4">Distribuicao ultimos 30 dias</p>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channels} layout="vertical" margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                    {channels.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-3">
              {channels.map(e => (
                <div key={e.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: e.color }} /><span className="text-text-muted">{e.name}</span></div>
                  <span className="text-text font-medium">{e.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.4 }}
            className="lg:col-span-2 bg-bg-card rounded-2xl p-6 border border-border-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-text tracking-tight">Ultimas Atividades</h2>
                <p className="text-xs text-text-muted mt-0.5">Feed em tempo real da operacao</p>
              </div>
              <button className="text-xs text-primary hover:underline font-semibold">Ver tudo</button>
            </div>
            <div className="space-y-2">
              {recentActivities.length > 0 ? recentActivities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ color: a.tipo === "entrada" ? "#00e676" : a.tipo === "saida" ? "#ff4d6d" : "#7c3aed" }}>
                    {a.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text truncate">
                      <span className="font-semibold">{a.client}</span>{" "}
                      <span className="text-text-muted">{a.action}</span>{" "}
                      <span className="font-semibold">{a.value}</span>
                    </p>
                    <p className="text-[10px] text-text-muted">{a.date}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-text-muted text-center py-8">Nenhuma atividade recente</p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.4 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-text tracking-tight">Agenda do Dia</h2>
                <p className="text-xs text-text-muted mt-0.5">Hoje · {todayEvents.length} evento{todayEvents.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => navigate("/agenda")} className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5">
                Ver tudo <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {todayEvents.length > 0 ? todayEvents.map((e, i) => (
                <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-lg bg-bg-elevated border border-border-card flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">{e.hora?.slice(0, 2) || "--"}</span>
                    <span className="text-[9px] text-text-muted">{e.hora?.slice(3) || ""}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{e.titulo || "Sem titulo"}</p>
                    <p className="text-xs text-text-muted truncate">
                      {e.cliente || e.descricao || "—"}
                      {e.tipo ? ` · ${e.tipo}` : ""}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <Calendar size={24} className="text-text-muted opacity-30" />
                  <p className="text-sm text-text-muted">Nenhum evento hoje</p>
                  <button onClick={() => navigate("/agenda")} className="text-xs text-primary hover:underline">Criar evento</button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.4 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card"
          >
            <h2 className="text-sm font-bold text-text tracking-tight mb-4">Alertas</h2>
            <div className="space-y-3">
              {alerts.length > 0 ? alerts.map((a, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-3 rounded-xl ${a.color === "text-danger" ? "bg-danger/5" : a.color === "text-warning" ? "bg-warning/5" : "bg-info/5"}`}>
                  <a.icon size={16} className={`flex-shrink-0 ${a.color}`} />
                  <span className="text-sm text-text">{a.text}</span>
                </div>
              )) : (
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-emerald-400/5">
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-text">Tudo em dia!</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.4 }}
            className="lg:col-span-2 bg-bg-card rounded-2xl p-6 border border-border-card"
          >
            <h2 className="text-sm font-bold text-text tracking-tight mb-4">Atalhos Rapidos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Novo Cliente",  icon: UserPlus,  path: "/clientes",   color: "#22c55e" },
                { label: "Nova Venda",    icon: FileText,  path: "/orcamento",  color: "#7c3aed" },
                { label: "Agendamento",   icon: Calendar,  path: "/agenda",     color: "#448aff" },
                { label: "Automacao",     icon: Zap,       path: "/automacoes", color: "#facc15" },
              ].map((s) => (
                <motion.button
                  key={s.label}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate(s.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-border-card transition-all"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
                    <s.icon size={20} style={{ color: s.color }} />
                  </div>
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-[0.08em]">{s.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}