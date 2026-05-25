import { motion } from "framer-motion";
import useComercialStore, { PIPELINE_STAGES } from "../../../store/comercialStore";
import { BarChart3, TrendingDown } from "lucide-react";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function SalesFunnel() {
  const { getFunnelData } = useComercialStore();
  const data = getFunnelData();
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Funil de Vendas</h3>
          <p className="text-[10px] text-text-muted">Conversao por etapa do pipeline</p>
        </div>
        <BarChart3 size={16} className="text-text-muted" />
      </div>

      <div className="space-y-3">
        {data.map((stage, i) => {
          const width = maxCount > 0 ? Math.max((stage.count / maxCount) * 100, 8) : 8;
          const conversionRate = i > 0 && data[i - 1].count > 0 ? Math.round((stage.count / data[i - 1].count) * 100) : (i === 0 ? 100 : 0);
          return (
            <motion.div key={stage.key} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold" style={{ color: stage.color }}>{stage.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-text-muted">{stage.count} deal{stage.count !== 1 ? "s" : ""}</span>
                  <span className="text-[10px] text-text-muted">{fmt(stage.total)}</span>
                  {i > 0 && <span className={`text-[9px] font-bold ${conversionRate >= 50 ? "text-emerald-400" : conversionRate >= 25 ? "text-amber-400" : "text-red-400"}`}>{conversionRate}%</span>}
                </div>
              </div>
              <div className="relative h-7 bg-bg-elevated rounded-lg overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ delay: i * 0.05 + 0.2, duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 rounded-lg flex items-center px-2.5"
                  style={{ background: `linear-gradient(90deg, ${stage.color}25, ${stage.color}10)` }}>
                  <div className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: stage.color }} />
                  <span className="text-[9px] font-bold" style={{ color: stage.color }}>{stage.count}</span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border-card flex items-center justify-between">
        <div className="flex items-center gap-2"><TrendingDown size={14} className="text-amber-400" /><span className="text-[10px] text-text-muted">Taxa conversao geral</span></div>
        <span className="text-sm font-bold text-primary">{data.length > 0 && data[0].count > 0 ? Math.round((data[data.length - 1].count / data[0].count) * 100) : 0}%</span>
      </div>
    </div>
  );
}
