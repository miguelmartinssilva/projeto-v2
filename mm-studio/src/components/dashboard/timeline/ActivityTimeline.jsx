import { motion } from "framer-motion";
import { format } from "date-fns";
import { DollarSign, UserPlus, Briefcase, CheckSquare, Zap, Video } from "lucide-react";
import useDashboardStore, { RESPONSAVEIS } from "../../../store/dashboardStore";
import { TipoBadge } from "../ui/Badges";

const iconMap = {
  pagamento: { icon: DollarSign, color: "#22c55e" },
  lead: { icon: UserPlus, color: "#3b82f6" },
  deal: { icon: Briefcase, color: "#8b5cf6" },
  tarefa: { icon: CheckSquare, color: "#f59e0b" },
  automacao: { icon: Zap, color: "#ec4899" },
  reuniao: { icon: Video, color: "#448aff" },
};

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min atras`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atras`;
  return `${Math.floor(hrs / 24)}d atras`;
}

export default function ActivityTimeline() {
  const { atividades } = useDashboardStore();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Atividades Recentes</h3>
          <p className="text-xs text-text-muted mt-0.5">Feed em tempo real da operacao</p>
        </div>
        <span className="text-[10px] text-text-muted bg-white/5 px-2 py-0.5 rounded">{atividades.length} registros</span>
      </div>
      <div className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-border-card" />
        <div className="space-y-2">
          {atividades.slice(0, 8).map((at, i) => {
            const cfg = iconMap[at.tipo] || iconMap.tarefa;
            const resp = RESPONSAVEIS.find(r => r.id === at.responsavel);
            const Icon = cfg.icon;
            return (
              <motion.div key={at.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3 pl-1 py-1.5 group">
                <div className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border border-border-card"
                  style={{ background: cfg.color + "15" }}>
                  <Icon size={12} style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-text">{at.titulo}</span>
                    <TipoBadge tipo={at.tipo} />
                  </div>
                  <p className="text-[10px] text-text-muted truncate">{at.descricao}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-text-muted/60">{timeAgo(at.timestamp)}</span>
                    {resp && (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold" style={{ background: resp.cor + "20", color: resp.cor }}>
                          {resp.avatar}
                        </div>
                        <span className="text-[9px] text-text-muted/60">{resp.nome.split(" ")[0]}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
