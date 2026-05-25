import { motion } from "framer-motion";
import { Star, Zap } from "lucide-react";
import useAutomacoesStore, { TRIGGER_TYPES, ACAO_TYPES } from "../../../store/automacoesStore";
import { CategoriaBadge } from "../ui/Badges";

export default function TemplatesGallery() {
  const { templates, useTemplate } = useAutomacoesStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {templates.map((tpl, i) => {
        const triggerCfg = TRIGGER_TYPES.find(t => t.key === tpl.trigger) || TRIGGER_TYPES[0];
        const acaoCfgs = tpl.acoes.map(a => ACAO_TYPES.find(at => at.key === a)).filter(Boolean);
        return (
          <motion.div key={tpl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-bg-card rounded-xl p-4 border border-border-card hover:border-border-light transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${triggerCfg.color}, transparent)` }} />
            <div className="flex items-center justify-between mb-3">
              <CategoriaBadge categoria={tpl.categoria} />
              <div className="flex items-center gap-1">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-semibold text-amber-400">{tpl.popularidade}</span>
              </div>
            </div>
            <h4 className="text-xs font-bold text-text mb-1">{tpl.nome}</h4>
            <p className="text-[10px] text-text-muted mb-3 line-clamp-2">{tpl.descricao}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {acaoCfgs.map(ac => (
                <span key={ac.key} className="px-1.5 py-0.5 rounded text-[8px] font-semibold" style={{ background: ac.bg, color: ac.color }}>{ac.label}</span>
              ))}
            </div>
            <button onClick={() => useTemplate(tpl.id)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Zap size={11} /> Usar Template
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
