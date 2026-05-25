import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import useAnalyticsStore from "../../../store/analyticsStore";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-elevated/95 backdrop-blur-sm border border-border-card rounded-lg p-3 shadow-xl">
      <p className="text-[10px] text-text-muted mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-muted">{p.name}:</span>
          <span className="text-text font-semibold">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function SalesChart() {
  const { vendedorPerformance } = useAnalyticsStore();
  const data = vendedorPerformance.map(v => ({
    nome: v.nome.split(" ")[0],
    receita: v.receita,
    meta: v.meta,
    conversoes: v.conversoes,
  }));

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-card">
      <h3 className="text-sm font-bold text-text mb-4">Performance Vendas</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="nome" axisLine={false} tickLine={false} tick={{ fill: "#999", fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "10px", color: "#999" }} />
            <Bar dataKey="receita" name="Receita" radius={[6, 6, 0, 0]} barSize={28}>
              {data.map((_, i) => <Cell key={i} fill={vendedorPerformance[i]?.cor || "#22c55e"} fillOpacity={0.8} />)}
            </Bar>
            <Bar dataKey="meta" name="Meta" radius={[6, 6, 0, 0]} barSize={28} fill="#334155" fillOpacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 space-y-2">
        {vendedorPerformance.map(v => {
          const pct = v.meta ? Math.round((v.receita / v.meta) * 100) : 0;
          const isAbove = pct >= 100;
          return (
            <div key={v.id} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: v.cor + "20", color: v.cor }}>{v.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-text-muted">{v.nome}</span>
                  <span className={`text-[10px] font-semibold ${isAbove ? "text-emerald-400" : "text-amber-400"}`}>{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: isAbove ? v.cor : "#f59e0b" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
