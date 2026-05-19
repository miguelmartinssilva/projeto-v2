import { motion } from "framer-motion";
import { DollarSign, TrendingUp, PiggyBank, Users, Plus, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const chartData = [
  { mes: "Dez", receita: 5200, despesa: 1800 },
  { mes: "Jan", receita: 6800, despesa: 2100 },
  { mes: "Fev", receita: 4500, despesa: 1600 },
  { mes: "Mar", receita: 7200, despesa: 2400 },
  { mes: "Abr", receita: 8100, despesa: 1900 },
  { mes: "Mai", receita: 6400, despesa: 2200 },
  { mes: "Jun", receita: 9200, despesa: 2500 },
];

const metrics = [
  { label: "Receita do Mes", value: "R$ 8.400", change: 12.5, icon: DollarSign, borderClass: "border-top-green", color: "#00e676", changeUp: true },
  { label: "Despesas", value: "R$ 2.100", change: 4.2, icon: TrendingUp, borderClass: "border-top-orange", color: "#ff6b35", changeUp: false },
  { label: "Lucro Liquido", value: "R$ 6.300", change: 18.3, icon: PiggyBank, borderClass: "border-top-purple", color: "#7c3aed", changeUp: true },
  { label: "Clientes Ativos", value: "12", change: 8.0, icon: Users, borderClass: "border-top-yellow", color: "#ffb800", changeUp: true },
];

const recentTransactions = [
  { client: "Ana Souza", avatar: "AS", service: "Identidade Visual", value: "R$ 2.400", status: "pago", date: "2 dias atras" },
  { client: "Barbearia King", avatar: "BK", service: "Social Media Mensal", value: "R$ 1.200", status: "pago", date: "5 dias atras" },
  { client: "Dra. Patricia", avatar: "DP", service: "Site Institucional", value: "R$ 3.600", status: "pendente", date: "8 dias atras" },
  { client: "Festa Junina", avatar: "FJ", service: "Cobertura Evento", value: "R$ 800", status: "pendente", date: "12 dias atras" },
  { client: "Academia Fit", avatar: "AF", service: "Reels Mensal", value: "R$ 600", status: "aprovada", date: "15 dias atras" },
];

const statusClasses = { pago: "status-pago", pendente: "status-pendente", aprovada: "status-aprovada" };
const statusLabels = { pago: "Pago", pendente: "Pendente", aprovada: "Aprovado" };

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

export default function Dashboard() {
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span> <span className="text-text-secondary font-medium">Dashboard</span></p>
            <h1 className="text-xl font-display font-bold text-text">Dashboard</h1>
            <p className="text-xs text-text-muted mt-0.5 capitalize">{today}</p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm">
            <Plus size={18} /> Novo Orcamento
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              className={`bg-bg-card rounded-xl p-5 ${m.borderClass} glow-primary`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-muted font-medium">{m.label}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${m.color}18` }}>
                  <m.icon size={18} style={{ color: m.color }} />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-text mb-1.5">{m.value}</p>
              <div className="flex items-center gap-1.5">
                {m.changeUp ? <ArrowUpRight size={13} className="text-success" /> : <ArrowDownRight size={13} className="text-danger" />}
                <span className={`text-xs font-medium ${m.changeUp ? "text-success" : "text-danger"}`}>
                  {m.changeUp ? "+" : ""}{m.change}% vs. mes passado
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-bg-card rounded-xl p-6 card-border glow-primary"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text">Receita vs Despesas</h2>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /><span className="text-text-muted">Receita</span></span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-danger" /><span className="text-text-muted">Despesa</span></span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00e676" stopOpacity={0.3} /><stop offset="100%" stopColor="#00e676" stopOpacity={0} /></linearGradient>
                    <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff4d6d" stopOpacity={0.2} /><stop offset="100%" stopColor="#ff4d6d" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 11 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="receita" stroke="#00e676" strokeWidth={2.5} fill="url(#gR)" dot={{ fill: "#00e676", strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: "#00e676", stroke: "#0d0d0d", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="despesa" stroke="#ff4d6d" strokeWidth={2.5} fill="url(#gD)" dot={{ fill: "#ff4d6d", strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: "#ff4d6d", stroke: "#0d0d0d", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-bg-card rounded-xl p-6 card-border glow-primary"
          >
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Orcamentos Recentes</h2>
            <div className="space-y-2">
              {[
                { client: "Ana Souza", value: "R$ 2.400", status: "pago", date: "15/05" },
                { client: "Barbearia King", value: "R$ 1.200", status: "aprovada", date: "12/05" },
                { client: "Dra. Patricia", value: "R$ 3.600", status: "pendente", date: "08/05" },
                { client: "Festa Junina", value: "R$ 800", status: "pendente", date: "05/05" },
                { client: "Academia Fit", value: "R$ 600", status: "aprovada", date: "28/04" },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">{p.client}</p>
                    <p className="text-xs text-text-muted">{p.date} &middot; <span className="font-semibold text-text-secondary">{p.value}</span></p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-[0.08em] ${statusClasses[p.status] || "status-rascunho"}`}>
                    {statusLabels[p.status] || p.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs text-primary hover:underline flex items-center justify-center gap-1 py-2">
              <FileText size={14} /> Ver todos os orcamentos
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-bg-card rounded-xl p-6 card-border glow-primary"
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Ultimas Transacoes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-[11px] uppercase tracking-[0.1em] border-b border-border-card">
                  <th className="text-left pb-3 pl-1 font-medium">Cliente</th>
                  <th className="text-left pb-3 font-medium">Servico</th>
                  <th className="text-right pb-3 font-medium">Valor</th>
                  <th className="text-right pb-3 font-medium">Status</th>
                  <th className="text-right pb-3 pr-1 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t, i) => (
                  <tr key={i} className="border-b border-border-card/40 transition-colors hover:bg-white/[0.02]">
                    <td className="py-3 pl-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">{t.avatar}</div>
                        <span className="text-text font-medium text-sm">{t.client}</span>
                      </div>
                    </td>
                    <td className="py-3 text-text-secondary">{t.service}</td>
                    <td className="py-3 text-right text-text font-semibold font-display">{t.value}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-[0.08em] ${statusClasses[t.status]}`}>{statusLabels[t.status]}</span>
                    </td>
                    <td className="py-3 text-right text-text-muted text-xs pr-1">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
