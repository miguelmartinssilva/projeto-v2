import MetricCard from "../ui/MetricCard";
import { DollarSign, TrendingUp, Target, BarChart3, Flag, ShoppingBag } from "lucide-react";
import useComercialStore from "../../../store/comercialStore";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function MetricsCards() {
  const { getMetrics } = useComercialStore();
  const m = getMetrics();
  const metaProgress = Math.round((m.receitaTotal / m.metaMensal) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      <MetricCard label="Receita Total" value={fmt(m.receitaTotal)} icon={DollarSign} color="#22c55e" change={12} delay={0} />
      <MetricCard label="Negociacoes Ativas" value={m.negociacoesAtivas} icon={TrendingUp} color="#3b82f6" change={8} delay={0.05} />
      <MetricCard label="Conversoes" value={m.conversoes} icon={Target} color="#8b5cf6" change={5} delay={0.1} />
      <MetricCard label="Ticket Medio" value={fmt(m.ticketMedio)} icon={BarChart3} color="#f59e0b" delay={0.15} />
      <MetricCard label="Meta Mensal" value={`${metaProgress}%`} icon={Flag} color="#00e676" delay={0.2} />
      <MetricCard label="Vendas Fechadas" value={m.vendasFechadas} icon={ShoppingBag} color="#7c3aed" change={15} delay={0.25} />
    </div>
  );
}
