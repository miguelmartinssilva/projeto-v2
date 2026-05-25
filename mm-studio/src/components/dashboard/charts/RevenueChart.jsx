import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import useDashboardStore from "../../../store/dashboardStore";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const fmt = (v) => v.toLocaleString("pt-BR");
  return (
    <div className="bg-bg-card border border-border-card rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 text-xs py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-secondary">{p.name}:</span>
          <span className="font-bold text-text">R$ {fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueChart() {
  const { revenueData } = useDashboardStore();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Receita Mensal</h3>
          <p className="text-xs text-text-muted mt-0.5">Comparacao receita vs despesa <span className="text-emerald-400 font-semibold">+24% MoM</span></p>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gDesp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="receita" name="Receita" stroke="#22c55e" strokeWidth={2} fill="url(#gRev)" dot={false} activeDot={{ r: 4, fill: "#22c55e", stroke: "#0d0d0d", strokeWidth: 2 }} />
            <Area type="monotone" dataKey="despesa" name="Despesa" stroke="#ef4444" strokeWidth={1.5} fill="url(#gDesp)" dot={false} strokeDasharray="4 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
