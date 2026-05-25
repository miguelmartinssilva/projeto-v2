import MetricCard from "../ui/MetricCard";
import { Calendar, CheckSquare, Users, Phone, CheckCircle, TrendingUp, Bell } from "lucide-react";
import useAgendaStore from "../../../store/agendaStore";

export default function MetricsCards() {
  const { getMetrics } = useAgendaStore();
  const m = getMetrics();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      <MetricCard label="Eventos Hoje" value={m.eventosHoje} icon={Calendar} color="#3b82f6" delay={0} />
      <MetricCard label="Tarefas Pendentes" value={m.tarefasPendentes} icon={CheckSquare} color="#f59e0b" delay={0.04} />
      <MetricCard label="Reunioes Hoje" value={m.reunioesHoje} icon={Users} color="#8b5cf6" delay={0.08} />
      <MetricCard label="Follow-ups" value={m.followups} icon={Phone} color="#ec4899" delay={0.12} />
      <MetricCard label="Concluidas" value={m.tarefasConcluidas} icon={CheckCircle} color="#22c55e" delay={0.16} />
      <MetricCard label="Produtividade" value={m.produtividade} icon={TrendingUp} color="#00e676" suffix="%" delay={0.2} />
      <MetricCard label="Lembretes" value={m.lembretesAtivos} icon={Bell} color="#f97316" delay={0.24} />
    </div>
  );
}
