import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import useAnalyticsStore from "../../../store/analyticsStore";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="bg-bg-elevated/95 backdrop-blur-sm border border-border-card rounded-lg p-3 shadow-xl">
      <p className="text-[10px] text-text-muted mb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-muted">{p.name}:</span>
          <span className="text-text font-semibold">{p.value}</span>
        </div>
      ))}
      <div className="border-t border-border-card mt-1.5 pt-1.5 text-[10px] text-text-muted">
        Taxa: {total ? ((payload[payload.length - 1]?.value || 0) / (payload[0]?.value || 1) * 100).toFixed(0) : 0}%
      </div>
    </div>
  );
};

export default function ConversionChart() {
  const { funnelData } = useAnalyticsStore();

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-card">
      <h3 className="text-sm font-bold text-text mb-4">Funil de Conversao</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={funnelData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} />
            <YAxis type="category" dataKey="etapa" axisLine={false} tickLine={false} tick={{ fill: "#999", fontSize: 10 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="valor" name="Quantidade" radius={[0, 6, 6, 0]} barSize={24}>
              {funnelData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.8} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1">
        {funnelData.map((f, i) => {
          const nextVal = i < funnelData.length - 1 ? funnelData[i + 1].valor : f.valor;
          const rate = f.valor ? ((nextVal / f.valor) * 100).toFixed(0) : 0;
          return (
            <div key={f.etapa} className="text-center">
              <p className="text-xs font-bold text-text">{f.valor}</p>
              <p className="text-[9px] text-text-muted">{f.etapa}</p>
              {i < funnelData.length - 1 && <p className="text-[8px] font-semibold mt-0.5" style={{ color: funnelData[i + 1].color }}>{rate}%</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
