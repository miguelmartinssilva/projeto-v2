import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";
import useDashboardStore from "../../../store/dashboardStore";

export default function ComercialWidget() {
  const { vendedorPerformance } = useDashboardStore();
  const fmt = (v) => v.toLocaleString("pt-BR");

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Comercial</h3>
          <p className="text-xs text-text-muted mt-0.5">Ranking vendedores e metas</p>
        </div>
      </div>
      <div className="space-y-3">
        {vendedorPerformance.map((v, i) => {
          const progress = Math.min(100, Math.round((v.receita / v.meta) * 100));
          return (
            <div key={v.id} className="px-3 py-2.5 rounded-xl bg-white/[0.02]">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: v.cor + "20", color: v.cor }}>
                    {v.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text">{v.nome.split(" ")[0]}</p>
                    <p className="text-[9px] text-text-muted">{v.deals} deals · {v.conversoes} conv.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-text">R$ {fmt(v.receita)}</p>
                  <p className="text-[9px] text-text-muted">meta R$ {fmt(v.meta)}</p>
                </div>
              </div>
              <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: v.cor }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] text-text-muted">{progress}% da meta</span>
                {progress >= 100 ? <Target size={10} className="text-primary" /> : <TrendingUp size={10} className="text-text-muted" />}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
