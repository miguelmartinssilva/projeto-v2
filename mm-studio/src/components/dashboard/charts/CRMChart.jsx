import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import useDashboardStore from "../../../store/dashboardStore";

const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-bg-card border border-border-card rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: d.fill }} /><span className="text-xs font-semibold text-text">{d.name}</span></div>
      <p className="text-[10px] text-text-muted">{d.value}%</p>
    </div>
  );
}

export default function CRMChart() {
  const { crmResumo } = useDashboardStore();

  const data = [
    { name: "Ativos", value: crmResumo.clientesAtivos, fill: "#22c55e" },
    { name: "Leads", value: crmResumo.leadsMes, fill: "#3b82f6" },
    { name: "Negociacoes", value: crmResumo.negociacoes, fill: "#8b5cf6" },
    { name: "Follow-ups", value: crmResumo.followupsHoje, fill: "#f59e0b" },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);
  const pctData = data.map(d => ({ ...d, value: total ? Math.round((d.value / total) * 100) : 0 }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-text">CRM Performance</h3>
        <p className="text-xs text-text-muted mt-0.5">Distribuicao do funil</p>
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pctData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
              {pctData.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: d.fill }} />
            <span className="text-[10px] text-text-muted">{d.name}</span>
            <span className="text-[10px] font-semibold text-text ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
