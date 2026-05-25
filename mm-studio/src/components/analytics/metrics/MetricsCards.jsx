import MetricCard from "../ui/MetricCard";
import { DollarSign, TrendingUp, Target, Users, BarChart3, Percent, Award, Zap } from "lucide-react";
import useAnalyticsStore from "../../../store/analyticsStore";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function MetricsCards() {
  const { getKPIs, monthlyData } = useAnalyticsStore();
  const kpi = getKPIs();
  const spark = (key) => monthlyData.map(m => m[key] || 0);

  const cards = [
    { label: "Receita Total", value: fmt(kpi.receita), icon: DollarSign, color: "#22c55e", change: kpi.receitaChange, sparkData: spark("receita") },
    { label: "Lucro Liquido", value: fmt(kpi.lucro), icon: TrendingUp, color: "#a78bfa", change: kpi.lucroChange, sparkData: spark("lucro") },
    { label: "Conversoes", value: String(kpi.conversoes || 0), icon: Target, color: "#3b82f6", change: kpi.convChange, sparkData: spark("conversoes") },
    { label: "Leads Gerados", value: String(kpi.leads || 0), icon: Users, color: "#f59e0b", change: kpi.leadsChange, sparkData: spark("leads") },
    { label: "Ticket Medio", value: fmt(kpi.ticketMedio), icon: BarChart3, color: "#ec4899", change: kpi.ticketChange, sparkData: spark("ticketMedio") },
    { label: "ROI", value: `${kpi.roi || 0}%`, icon: Percent, color: "#06b6d4", change: kpi.roiChange },
    { label: "Clientes Ativos", value: String(kpi.clientesAtivos || 0), icon: Award, color: "#ffb800", change: kpi.clientChange, sparkData: spark("clientesAtivos") },
    { label: "Produtividade", value: `${kpi.produtividade || 0}%`, icon: Zap, color: "#00e676", change: kpi.prodChange, sparkData: spark("produtividade") },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {cards.map((c, i) => <MetricCard key={c.label} {...c} delay={i * 0.04} />)}
    </div>
  );
}
