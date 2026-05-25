import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, Award, BarChart3, UserPlus, Zap, Target } from "lucide-react";
import useAnalyticsStore from "../../../store/analyticsStore";
import { InsightTypeBadge } from "../ui/Badges";

const iconMap = { TrendingUp, TrendingDown, AlertTriangle, Award, BarChart3, UserPlus, Zap, Target };

const tipoStyles = {
  positivo: { border: "border-l-emerald-400", bg: "bg-emerald-500/5" },
  alerta: { border: "border-l-amber-400", bg: "bg-amber-500/5" },
  neutro: { border: "border-l-slate-400", bg: "bg-white/[0.02]" },
};

const prioridadeOrder = { alta: 0, media: 1, baixa: 2 };

export default function InsightCards() {
  const { insights } = useAnalyticsStore();
  const sorted = [...insights].sort((a, b) => (prioridadeOrder[a.prioridade] || 2) - (prioridadeOrder[b.prioridade] || 2));

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text">Insights Estrategicos</h3>
        <span className="text-[10px] text-text-muted bg-white/5 px-1.5 py-0.5 rounded">{sorted.length} insights</span>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {sorted.map((ins, i) => {
          const Icon = iconMap[ins.icone] || BarChart3;
          const style = tipoStyles[ins.tipo] || tipoStyles.neutro;
          return (
            <motion.div key={ins.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-lg border-l-2 ${style.border} ${style.bg} group hover:bg-white/[0.03] transition-colors`}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 group-hover:bg-white/10 transition-colors">
                <Icon size={14} className={ins.tipo === "positivo" ? "text-emerald-400" : ins.tipo === "alerta" ? "text-amber-400" : "text-slate-400"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-semibold text-text">{ins.titulo}</p>
                  <InsightTypeBadge tipo={ins.tipo} />
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">{ins.descricao}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
