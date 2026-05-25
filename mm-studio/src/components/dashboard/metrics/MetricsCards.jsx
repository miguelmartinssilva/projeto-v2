import MetricCard from "../ui/MetricCard";
import { DollarSign, Users, Briefcase, TrendingUp, Wallet, CheckSquare, BarChart3, Target } from "lucide-react";
import useDashboardStore from "../../../store/dashboardStore";

function makeMini(len = 7) {
  return Array.from({ length: len }, () => 20 + Math.floor(Math.random() * 80));
}

export default function MetricsCards() {
  const { getKPIs } = useDashboardStore();
  const k = getKPIs();
  const fmt = (v) => v.toLocaleString("pt-BR");

  const cards = [
    { label: "Receita Total", value: `R$ ${fmt(k.receita)}`, icon: DollarSign, color: "#22c55e", change: k.receitaChange, miniData: makeMini() },
    { label: "Clientes Ativos", value: String(k.clientes), icon: Users, color: "#ffb800", change: k.clientesChange, miniData: makeMini() },
    { label: "Negociacoes Ativas", value: String(k.deals), icon: Briefcase, color: "#8b5cf6", change: k.dealsChange, miniData: makeMini() },
    { label: "Conversoes", value: String(k.conversoes), icon: TrendingUp, color: "#3b82f6", change: k.conversoesChange, miniData: makeMini() },
    { label: "Fluxo de Caixa", value: `R$ ${fmt(k.fluxoCaixa)}`, icon: Wallet, color: "#00e676", change: k.fluxoChange, miniData: makeMini() },
    { label: "Tarefas Pendentes", value: String(k.tarefas), icon: CheckSquare, color: "#f59e0b", change: k.tarefasChange, miniData: makeMini() },
    { label: "Crescimento", value: `${k.crescimento}%`, icon: BarChart3, color: "#ec4899", change: k.crescimentoChange, miniData: makeMini() },
    { label: "Meta do Mes", value: `${k.metaProgress}%`, icon: Target, color: "#448aff", change: k.metaChange, miniData: makeMini() },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((c, i) => <MetricCard key={c.label} {...c} delay={i * 0.03} />)}
    </div>
  );
}
