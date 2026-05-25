import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

export default function RevenueChart() {
  const { monthlyData } = useAnalyticsStore();
  const [mode, setMode] = useState("receita");

  const colors = { receita: "#22c55e", despesa: "#ff4d6d", lucro: "#a78bfa" };
  const gradientId = `gRev_${mode}`;

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text">Receita Mensal</h3>
        <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5">
          {["receita", "lucro"].map(t => (
            <button key={t} onClick={() => setMode(t)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${mode === t ? "bg-primary text-black" : "text-text-muted hover:text-text"}`}>
              {t === "receita" ? "Receita" : "Lucro"}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors[mode]} stopOpacity={0.25} />
                <stop offset="100%" stopColor={colors[mode]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={mode} name={mode === "receita" ? "Receita" : "Lucro"} stroke={colors[mode]} strokeWidth={2} fill={`url(#${gradientId})`} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="despesa" name="Despesa" stroke="#ff4d6d" strokeWidth={1.5} strokeDasharray="4 3" fill="none" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
