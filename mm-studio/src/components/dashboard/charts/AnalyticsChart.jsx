import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import useDashboardStore from "../../../store/dashboardStore";

function makeActivityData() {
  const days = ["Seg","Ter","Qua","Qui","Sex","Sab","Dom"];
  return days.map(d => ({ dia: d, acessos: 30 + Math.floor(Math.random() * 70), tarefas: 3 + Math.floor(Math.random() * 12) }));
}

export default function AnalyticsChart() {
  const { analyticsResumo } = useDashboardStore();
  const data = makeActivityData();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Analytics</h3>
          <p className="text-xs text-text-muted mt-0.5">Acessos e produtividade semanal</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[10px] text-text-muted">Acessos</span></div>
          <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /><span className="text-[10px] text-text-muted">Tarefas</span></div>
        </div>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="gAcc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gTask" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#448aff" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#448aff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#161616", border: "1px solid #1f1f1f", borderRadius: 12, fontSize: 11 }} />
            <Area type="monotone" dataKey="acessos" stroke="#22c55e" strokeWidth={1.5} fill="url(#gAcc)" dot={false} />
            <Area type="monotone" dataKey="tarefas" stroke="#448aff" strokeWidth={1.5} fill="url(#gTask)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="p-2 rounded-lg bg-white/[0.02]"><p className="text-[9px] text-text-muted uppercase">Hoje</p><p className="text-sm font-bold text-text">{analyticsResumo.acessosHoje}</p></div>
        <div className="p-2 rounded-lg bg-white/[0.02]"><p className="text-[9px] text-text-muted uppercase">Semana</p><p className="text-sm font-bold text-text">{analyticsResumo.acessosSemana}</p></div>
        <div className="p-2 rounded-lg bg-white/[0.02]"><p className="text-[9px] text-text-muted uppercase">Produtiv.</p><p className="text-sm font-bold text-emerald-400">{analyticsResumo.produtividade}%</p></div>
      </div>
    </motion.div>
  );
}
