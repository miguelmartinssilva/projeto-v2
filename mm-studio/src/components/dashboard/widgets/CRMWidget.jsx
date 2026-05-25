import { motion } from "framer-motion";
import { Users, UserPlus, Briefcase, Phone, ArrowUpRight } from "lucide-react";
import useDashboardStore, { RESPONSAVEIS } from "../../../store/dashboardStore";
import { PlanoBadge } from "../ui/Badges";

export default function CRMWidget() {
  const { crmResumo, clientesRecentes } = useDashboardStore();
  const fmt = (v) => v.toLocaleString("pt-BR");

  const stats = [
    { label: "Leads Mes", value: crmResumo.leadsMes, icon: UserPlus, color: "#3b82f6" },
    { label: "Clientes Ativos", value: crmResumo.clientesAtivos, icon: Users, color: "#22c55e" },
    { label: "Negociacoes", value: crmResumo.negociacoes, icon: Briefcase, color: "#8b5cf6" },
    { label: "Follow-ups Hoje", value: crmResumo.followupsHoje, icon: Phone, color: "#f59e0b" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">CRM</h3>
          <p className="text-xs text-text-muted mt-0.5">Performance e clientes recentes</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10">
          <ArrowUpRight size={10} className="text-emerald-400" />
          <span className="text-[10px] font-semibold text-emerald-400">{crmResumo.conversao}% conv.</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {stats.map(s => (
          <div key={s.label} className="p-2.5 rounded-lg bg-white/[0.02]">
            <div className="flex items-center gap-1.5 mb-1">
              <s.icon size={11} style={{ color: s.color }} />
              <span className="text-[9px] text-text-muted uppercase">{s.label}</span>
            </div>
            <p className="text-sm font-bold text-text">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Clientes Recentes</p>
        {clientesRecentes.slice(0, 4).map(c => (
          <div key={c.id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-[9px] font-bold text-text-muted">
              {c.nome.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text truncate">{c.nome}</p>
              <div className="flex items-center gap-1.5">
                <PlanoBadge plano={c.plano} />
                <span className="text-[9px] text-text-muted">R$ {fmt(c.valor)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
