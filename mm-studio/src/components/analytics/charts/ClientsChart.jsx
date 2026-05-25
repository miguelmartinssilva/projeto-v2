import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useAnalyticsStore from "../../../store/analyticsStore";

const PIE_COLORS = ["#22c55e", "#7c3aed", "#448aff", "#facc15", "#ff6b35", "#a0a0a0"];

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

export default function ClientsChart() {
  const { monthlyData } = useAnalyticsStore();
  const totalNovos = monthlyData.reduce((s, m) => s + m.novosClientes, 0);
  const totalChurn = monthlyData.reduce((s, m) => s + m.churn, 0);
  const cur = monthlyData[monthlyData.length - 1] || {};
  const pieData = [
    { name: "Ativos", value: cur.clientesAtivos || 0, color: "#22c55e" },
    { name: "Novos", value: totalNovos, color: "#3b82f6" },
    { name: "Churn", value: totalChurn, color: "#ff4d6d" },
  ].filter(d => d.value > 0);

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-card">
      <h3 className="text-sm font-bold text-text mb-4">Clientes Ativos</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="gCli" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 9 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#555", fontSize: 9 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="clientesAtivos" name="Ativos" stroke="#3b82f6" strokeWidth={2} fill="url(#gCli)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="h-36 w-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-3 mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="text-text-muted">{d.name}</span>
                <span className="text-text font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
