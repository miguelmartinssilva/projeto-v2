import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import useFinanceiroStore from "../../../store/financeiroStore";
import { Wallet } from "lucide-react";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-border-card rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[10px] text-text-muted mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
      {payload.length >= 2 && (
        <p className="text-[10px] text-text-muted mt-1 border-t border-border-card pt-1">
          Saldo: {fmt(payload.find(p => p.dataKey === "entrada")?.value - payload.find(p => p.dataKey === "saida")?.value)}
        </p>
      )}
    </div>
  );
};

export default function CashFlowChart() {
  const { getCashFlowData } = useFinanceiroStore();
  const data = getCashFlowData();

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Fluxo de Caixa</h3>
          <p className="text-[10px] text-text-muted">Entradas vs Saidas mensais</p>
        </div>
        <Wallet size={16} className="text-text-muted" />
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: "#555", fontSize: 10 }} axisLine={{ stroke: "#1f1f1f" }} tickLine={false} />
            <YAxis tick={{ fill: "#555", fontSize: 9 }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
            <Bar dataKey="entrada" name="Entrada" radius={[4, 4, 0, 0]} maxBarSize={24}>
              {data.map((_, idx) => <Cell key={idx} fill="#22c55e" fillOpacity={0.6} />)}
            </Bar>
            <Bar dataKey="saida" name="Saida" radius={[4, 4, 0, 0]} maxBarSize={24}>
              {data.map((_, idx) => <Cell key={idx} fill="#ff4d6d" fillOpacity={0.6} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
