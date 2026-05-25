import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import useAnalyticsStore from "../../../store/analyticsStore";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-elevated/95 backdrop-blur-sm border border-border-card rounded-lg p-3 shadow-xl">
      <p className="text-[10px] text-text-muted mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-text-muted">{p.name}:</span>
          <span className="text-text font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function ActivityChart() {
  const { monthlyData } = useAnalyticsStore();

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-card">
      <h3 className="text-sm font-bold text-text mb-4">Atividades do Sistema</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-2">Acessos & Acoes</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gAcs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity={0.2} /><stop offset="100%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 9 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 9 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="acessos" name="Acessos" stroke="#06b6d4" strokeWidth={1.5} fill="url(#gAcs)" dot={false} />
                <Area type="monotone" dataKey="acoes" name="Acoes" stroke="#f59e0b" strokeWidth={1.5} fill="none" dot={false} strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-2">Produtividade</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 9 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 9 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="produtividade" name="Produtividade" radius={[4, 4, 0, 0]} barSize={16}>
                  {monthlyData.map((m, i) => <Cell key={i} fill={m.produtividade >= 80 ? "#22c55e" : m.produtividade >= 60 ? "#f59e0b" : "#ef4444"} fillOpacity={0.7} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
