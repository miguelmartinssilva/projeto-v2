import MetricCard from "../ui/MetricCard";
import { Zap, Play, MessageCircle, GitBranch, CheckCircle, Clock } from "lucide-react";
import useAutomacoesStore from "../../../store/automacoesStore";

export default function MetricsCards() {
  const { getMetrics } = useAutomacoesStore();
  const m = getMetrics();

  const cards = [
    { label: "Ativas", value: String(m.ativas), icon: Zap, color: "#22c55e", change: 12 },
    { label: "Execucoes Hoje", value: String(m.execucoesHoje), icon: Play, color: "#3b82f6", change: 8 },
    { label: "Mensagens", value: String(m.mensagensEnviadas), icon: MessageCircle, color: "#22c55e", change: 15 },
    { label: "Workflows", value: String(m.workflowsExecutados), icon: GitBranch, color: "#8b5cf6", change: 5 },
    { label: "Taxa Sucesso", value: `${m.taxaSucesso}%`, icon: CheckCircle, color: "#f59e0b", change: 2 },
    { label: "Economia", value: `${m.economiaTempo}min`, icon: Clock, color: "#00e676", suffix: "/dia", change: 18 },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c, i) => <MetricCard key={c.label} {...c} delay={i * 0.04} />)}
    </div>
  );
}
