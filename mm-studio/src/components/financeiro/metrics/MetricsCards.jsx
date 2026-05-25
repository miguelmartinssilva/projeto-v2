import MetricCard from "../ui/MetricCard";
import { DollarSign, TrendingUp, TrendingDown, Wallet, AlertCircle, Clock } from "lucide-react";
import useFinanceiroStore from "../../../store/financeiroStore";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function MetricsCards() {
  const { getMetrics } = useFinanceiroStore();
  const m = getMetrics();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      <MetricCard label="Receita Total" value={fmt(m.receitaTotal)} icon={TrendingUp} color="#22c55e" change={12} delay={0} />
      <MetricCard label="Despesas" value={fmt(m.despesaTotal)} icon={TrendingDown} color="#ff4d6d" change={-5} delay={0.05} />
      <MetricCard label="Lucro Liquido" value={fmt(m.lucroLiquido)} icon={DollarSign} color={m.lucroLiquido >= 0 ? "#a78bfa" : "#ff4d6d"} delay={0.1} />
      <MetricCard label="Fluxo de Caixa" value={fmt(m.fluxoCaixa)} icon={Wallet} color="#3b82f6" delay={0.15} />
      <MetricCard label="Contas Pendentes" value={fmt(m.contasPendentes)} icon={Clock} color="#f59e0b" delay={0.2} />
      <MetricCard label="Contas Atrasadas" value={fmt(m.contasAtrasadas)} icon={AlertCircle} color="#ef4444" delay={0.25} />
    </div>
  );
}
