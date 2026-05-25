import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import useComercialStore from "../../../store/comercialStore";
import { BarChart3 } from "lucide-react";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-bg-card border border-border-card rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[10px] text-text-muted mb-0.5">{label}</p>
      <p className="text-xs font-bold text-primary">{fmt(payload[0].value)}</p>
    </div>
  );
};

export default function RevenueChart() {
  const { getFunnelData } = useComercialStore();
  const data = getFunnelData().map(d => ({ name: d.label.split(" ").pop(), valor: d.total, color: d.color }));

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Receita por Etapa</h3>
          <p className="text-[10px] text-text-muted">Valor total no pipeline</p>
        </div>
        <BarChart3 size={16} className="text-text-muted" />
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 10 }} axisLine={{ stroke: "#1f1f1f" }} tickLine={false} />
            <YAxis tick={{ fill: "#555", fontSize: 9 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
            <Bar dataKey="valor" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} fillOpacity={0.6} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
