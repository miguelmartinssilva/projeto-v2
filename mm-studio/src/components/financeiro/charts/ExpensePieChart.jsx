import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import useFinanceiroStore from "../../../store/financeiroStore";
import { PieChart as PieIcon } from "lucide-react";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="bg-bg-card border border-border-card rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs font-semibold" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-[10px] text-text-muted">{fmt(payload[0].value)}</p>
    </div>
  );
};

export default function ExpensePieChart() {
  const { getExpenseByCategory } = useFinanceiroStore();
  const data = getExpenseByCategory();

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Despesas por Categoria</h3>
          <p className="text-[10px] text-text-muted">Distribuicao percentual</p>
        </div>
        <PieIcon size={16} className="text-text-muted" />
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1.5 mt-3 max-h-32 overflow-y-auto">
        {data.map(e => {
          const total = data.reduce((s, d) => s + d.value, 0);
          const pct = total > 0 ? Math.round((e.value / total) * 100) : 0;
          return (
            <div key={e.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                <span className="text-text-muted">{e.name}</span>
              </div>
              <span className="text-text font-medium">{pct}%</span>
            </div>
          );
        })}
        {data.length === 0 && <p className="text-xs text-text-muted text-center py-4">Nenhuma despesa</p>}
      </div>
    </div>
  );
}
