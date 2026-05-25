import { motion } from "framer-motion";
import { format } from "date-fns";
import { MessageCircle, Mail, Send, Hash, Calendar, CreditCard, Link2 } from "lucide-react";
import useAutomacoesStore from "../../../store/automacoesStore";

const iconMap = { MessageCircle, Mail, Send, Hash, Calendar, CreditCard, Link2 };

export default function IntegrationCards() {
  const { integracoes, toggleIntegracao } = useAutomacoesStore();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {integracoes.map((intg, i) => {
        const Icon = iconMap[intg.icon] || Link2;
        const isOn = intg.status === "conectado";
        return (
          <motion.div key={intg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="bg-bg-card rounded-xl p-4 border border-border-card hover:border-border-light transition-all group relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(90deg, transparent, ${intg.color}, transparent)` }} />
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: intg.color + "15" }}>
                <Icon size={15} style={{ color: intg.color }} />
              </div>
              <button onClick={() => toggleIntegracao(intg.id)}
                className={`w-8 h-4 rounded-full relative transition-colors ${isOn ? "bg-primary" : "bg-white/10"}`}>
                <div className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-all ${isOn ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <p className="text-xs font-semibold text-text mb-0.5">{intg.nome}</p>
            <p className="text-[10px] font-medium mb-2" style={{ color: isOn ? "#22c55e" : "#6b7280" }}>
              {isOn ? "Conectado" : "Desconectado"}
            </p>
            {isOn && (
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-muted">{intg.execucoes} exec.</span>
                {intg.ultimaSync && <span className="text-[9px] text-text-muted">{format(intg.ultimaSync, "HH:mm")}</span>}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
