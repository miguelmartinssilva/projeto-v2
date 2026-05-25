import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import useDashboardStore from "../../../store/dashboardStore";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const fmt = (v) => v.toLocaleString("pt-BR");
  return (
    <div className="bg-bg-card border border-border-card rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 text-xs py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.payload?.cor }} />
          <span className="text-text-secondary">{p.name}:</span>
          <span className="font-bold text-text">R$ {fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function FinanceChart() {
  const { financeFlow } = useDashboardStore();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Fluxo Financeiro</h3>
          <p className="text-xs text-text-muted mt-0.5">Entradas, saidas e lucro liquido</p>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={financeFlow} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="entrada" name="Entrada" radius={[4, 4, 0, 0]} barSize={14} fill="#22c55e" fillOpacity={0.8} />
            <Bar dataKey="saida" name="Saida" radius={[4, 4, 0, 0]} barSize={14} fill="#ef4444" fillOpacity={0.6} />
            <Bar dataKey="liquido" name="Liquido" radius={[4, 4, 0, 0]} barSize={14} fill="#3b82f6" fillOpacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
