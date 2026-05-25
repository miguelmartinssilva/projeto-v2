import { motion } from "framer-motion";
import { format } from "date-fns";
import { Clock, Zap } from "lucide-react";
import useAutomacoesStore from "../../../store/automacoesStore";
import { LogStatusBadge } from "../ui/Badges";

export default function LogsPanel() {
  const { logs } = useAutomacoesStore();
  const sorted = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border-card">
        <div className="flex items-center gap-2"><Clock size={14} className="text-text-muted" /><h3 className="text-sm font-bold text-text">Logs de Execucao</h3></div>
        <span className="text-[10px] text-text-muted bg-white/5 px-2 py-0.5 rounded">{sorted.length} registros</span>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-border-card/50">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Zap size={20} className="text-text-muted opacity-30 mb-2" />
            <p className="text-xs text-text-muted">Nenhum log registrado</p>
          </div>
        ) : sorted.map((log, i) => (
          <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.status === "sucesso" ? "bg-emerald-400" : log.status === "erro" ? "bg-red-400" : "bg-amber-400"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-semibold text-text">{log.automacaoNome}</span>
                <LogStatusBadge status={log.status} />
              </div>
              <p className="text-[10px] text-text-muted truncate">{log.detalhes}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[9px] text-text-muted">{format(log.timestamp, "dd/MM HH:mm")}</p>
              <p className="text-[9px] text-text-muted">{log.duracao}s</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
