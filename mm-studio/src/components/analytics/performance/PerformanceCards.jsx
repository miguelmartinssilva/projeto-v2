import { motion } from "framer-motion";
import useAnalyticsStore, { VENDEDORES } from "../../../store/analyticsStore";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const sections = [
  {
    key: "comercial", label: "Comercial", color: "#00e676",
    items: [
      { label: "Meta Mensal", getKey: "receita", metaKey: "meta", format: true },
      { label: "Taxa Conversao", getKey: "conversoes", metaKey: "leads", format: false, pct: true },
      { label: "Receita", getKey: "receita", metaKey: "meta", format: true },
    ],
  },
  {
    key: "financeiro", label: "Financeiro", color: "#22c55e",
    items: [
      { label: "Lucro", key: "lucro", format: true },
      { label: "Despesas", key: "despesa", format: true },
      { label: "Faturamento", key: "receita", format: true },
    ],
  },
  {
    key: "crm", label: "CRM", color: "#3b82f6",
    items: [
      { label: "Leads", key: "leads", format: false },
      { label: "Clientes Ativos", key: "clientesAtivos", format: false },
      { label: "Retencao", key: "retencao", format: false, pct: true },
    ],
  },
  {
    key: "operacional", label: "Operacional", color: "#f59e0b",
    items: [
      { label: "Produtividade", key: "produtividade", format: false, pct: true },
      { label: "Tarefas Concluidas", key: "conversoes", format: false },
      { label: "Eficiencia", key: "produtividade", format: false, pct: true },
    ],
  },
];

export default function PerformanceCards() {
  const { monthlyData, vendedorPerformance } = useAnalyticsStore();
  const cur = monthlyData[monthlyData.length - 1] || {};

  const getValue = (item) => {
    if (item.pct) {
      const val = cur[item.getKey || item.key] || 0;
      const meta = cur[item.metaKey] || 1;
      return Math.round((val / meta) * 100);
    }
    return cur[item.getKey || item.key] || 0;
  };

  const getTarget = (item) => {
    if (item.pct) return 100;
    return cur[item.metaKey] || Math.round((cur[item.getKey || item.key] || 0) * 1.2);
  };

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-card">
      <h3 className="text-sm font-bold text-text mb-4">Performance</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(sec => (
          <div key={sec.key} className="p-3 rounded-xl bg-bg-elevated/50 border border-border-card/50">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: sec.color }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: sec.color }}>{sec.label}</span>
            </div>
            <div className="space-y-3">
              {sec.items.map(item => {
                const val = getValue(item);
                const target = getTarget(item);
                const pct = target ? Math.round((val / target) * 100) : 0;
                const isAbove = pct >= 100;
                const displayVal = item.format ? fmt(val) : item.pct ? `${val}%` : String(val);
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-text-muted">{item.label}</span>
                      <span className={`text-[10px] font-semibold ${isAbove ? "text-emerald-400" : pct >= 70 ? "text-amber-400" : "text-red-400"}`}>{displayVal}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: isAbove ? sec.color : pct >= 70 ? "#f59e0b" : "#ef4444" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border-card">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-3">Ranking Vendedores</p>
        <div className="space-y-2">
          {[...vendedorPerformance].sort((a, b) => b.receita - a.receita).map((v, i) => (
            <div key={v.id} className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-text-muted w-3">{i + 1}</span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: v.cor + "20", color: v.cor }}>{v.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-text">{v.nome}</span>
                  <span className="text-[10px] font-semibold text-text">{fmt(v.receita)}</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min((v.receita / v.meta) * 100, 100)}%`, background: v.cor }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
