import { motion } from "framer-motion";
import useComercialStore from "../../../store/comercialStore";
import { Trophy } from "lucide-react";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function RankingCard() {
  const { getRanking } = useComercialStore();
  const ranking = getRanking();
  const maxReceita = Math.max(...ranking.map(r => r.receita), 1);

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Ranking Vendedores</h3>
          <p className="text-[10px] text-text-muted">Performance da equipe</p>
        </div>
        <Trophy size={16} className="text-amber-400" />
      </div>
      <div className="space-y-3">
        {ranking.map((v, i) => (
          <motion.div key={v.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-elevated/50 group hover:bg-bg-elevated/80 transition-colors">
            <span className={`text-[10px] font-bold w-5 text-center ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-700" : "text-text-muted"}`}>
              {i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : `${i + 1}`}
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: v.cor + "20", color: v.cor }}>
              {v.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text truncate">{v.nome}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1.5 bg-bg-card rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${maxReceita > 0 ? (v.receita / maxReceita) * 100 : 0}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }} className="h-full rounded-full" style={{ background: v.cor }} />
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs font-bold text-primary">{fmt(v.receita)}</p>
              <p className="text-[9px] text-text-muted">{v.vendas} venda{v.vendas !== 1 ? "s" : ""}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
