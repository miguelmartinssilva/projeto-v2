import { motion } from "framer-motion";
import { format } from "date-fns";
import { DollarSign, CreditCard, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import useDashboardStore from "../../../store/dashboardStore";

export default function FinanceWidget() {
  const { financeiroResumo: f } = useDashboardStore();
  const fmt = (v) => v.toLocaleString("pt-BR");

  const items = [
    { label: "Saldo Atual", value: `R$ ${fmt(f.saldoAtual)}`, icon: DollarSign, color: "#22c55e", change: 18, up: true },
    { label: "Receitas Mes", value: `R$ ${fmt(f.receitasMes)}`, icon: TrendingUp, color: "#00e676", change: 24, up: true },
    { label: "Despesas Mes", value: `R$ ${fmt(f.despesasMes)}`, icon: CreditCard, color: "#ef4444", change: -5, up: false },
    { label: "Lucro Liquido", value: `R$ ${fmt(f.lucroLiquido)}`, icon: DollarSign, color: "#3b82f6", change: 32, up: true },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-text">Financeiro</h3>
          <p className="text-xs text-text-muted mt-0.5">Resumo financeiro mensal</p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map(it => (
          <div key={it.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: it.color + "15" }}>
              <it.icon size={14} style={{ color: it.color }} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-text-muted">{it.label}</p>
              <p className="text-xs font-bold text-text">{it.value}</p>
            </div>
            <div className="flex items-center gap-0.5">
              {it.up ? <ArrowUpRight size={11} className="text-emerald-400" /> : <ArrowDownRight size={11} className="text-red-400" />}
              <span className={`text-[10px] font-semibold ${it.up ? "text-emerald-400" : "text-red-400"}`}>{it.up ? "+" : ""}{it.change}%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-border-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertCircle size={12} className="text-amber-400" /><span className="text-[10px] text-text-muted">Contas pendentes</span></div>
          <span className="text-xs font-semibold text-amber-400">{f.contasPendentes}</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-text-muted ml-5">Projecao mes</span>
          <span className="text-xs font-semibold text-text">R$ {fmt(f.projecaoMes)}</span>
        </div>
      </div>
    </motion.div>
  );
}
