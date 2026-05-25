import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import useAnalyticsStore from "../../../store/analyticsStore";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0]?.payload;
  return (
    <div className="bg-bg-elevated/95 backdrop-blur-sm border border-border-card rounded-lg p-3 shadow-xl">
      <p className="text-[10px] text-text-muted mb-1.5">{label}</p>
      <div className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-text-muted">Entradas:</span><span className="text-text font-semibold">{fmt(item?.receita)}</span></div>
      <div className="flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full bg-red-400" /><span className="text-text-muted">Saidas:</span><span className="text-text font-semibold">{fmt(item?.despesa)}</span></div>
      <div className="border-t border-border-card mt-1.5 pt-1.5 flex items-center gap-2 text-xs"><span className="w-2 h-2 rounded-full bg-violet-400" /><span className="text-text-muted">Lucro:</span><span className="text-text font-semibold">{fmt(item?.lucro)}</span></div>
    </div>
  );
};

export default function FinancialChart() {
  const { monthlyData } = useAnalyticsStore();

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-card">
      <h3 className="text-sm font-bold text-text mb-4">Fluxo Financeiro</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="lucro" name="Lucro" radius={[6, 6, 0, 0]} barSize={20}>
              {monthlyData.map((m, i) => <Cell key={i} fill={m.lucro >= 0 ? "#a78bfa" : "#ff4d6d"} fillOpacity={0.8} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
