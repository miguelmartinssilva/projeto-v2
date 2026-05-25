import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import useDashboardStore from "../../../store/dashboardStore";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const fmt = (v) => v.toLocaleString("pt-BR");
  return (
    <div className="bg-bg-card border border-border-card rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: d.cor }} /><span className="text-xs font-semibold text-text">{d.etapa}</span></div>
      <p className="text-[10px] text-text-muted">Valor: R$ {fmt(d.valor)}</p>
      <p className="text-[10px] text-text-muted">{d.qtd} negociacoes</p>
    </div>
  );
}

export default function ComercialChart() {
  const { pipelineData } = useDashboardStore();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-text">Pipeline Comercial</h3>
        <p className="text-xs text-text-muted mt-0.5">Distribuicao por etapa</p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pipelineData} layout="vertical" margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="etapa" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="valor" radius={[0, 4, 4, 0]} barSize={14}>
              {pipelineData.map((e, i) => <Cell key={i} fill={e.cor} fillOpacity={0.8} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
