import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, FileText, DollarSign, Users, BarChart3, Zap, Target, Clock } from "lucide-react";

const reports = [
  { id: "r1", titulo: "Relatorio Financeiro", descricao: "Receitas, despesas, lucro e fluxo de caixa", icon: DollarSign, color: "#22c55e", ultima: "24/05/2026" },
  { id: "r2", titulo: "Relatorio Comercial", descricao: "Vendas, conversoes e performance por vendedor", icon: Target, color: "#00e676", ultima: "24/05/2026" },
  { id: "r3", titulo: "Relatorio de Clientes", descricao: "Clientes ativos, retencao, churn e LTV", icon: Users, color: "#3b82f6", ultima: "23/05/2026" },
  { id: "r4", titulo: "Relatorio Produtividade", descricao: "Tarefas, eficiencia e performance operacional", icon: Zap, color: "#f59e0b", ultima: "22/05/2026" },
  { id: "r5", titulo: "Relatorio Conversao", descricao: "Funil, taxas e analise de conversao por canal", icon: BarChart3, color: "#ec4899", ultima: "21/05/2026" },
];

export default function ReportsPanel() {
  const [generating, setGenerating] = useState(null);

  const handleGenerate = (id) => {
    setGenerating(id);
    setTimeout(() => setGenerating(null), 2000);
  };

  return (
    <div className="bg-bg-card rounded-2xl p-5 border border-border-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text">Relatorios</h3>
        <span className="text-[10px] text-text-muted bg-white/5 px-1.5 py-0.5 rounded">{reports.length}</span>
      </div>
      <div className="space-y-2">
        {reports.map((r, i) => {
          const Icon = r.icon;
          const isLoading = generating === r.id;
          return (
            <motion.div key={r.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated/50 border border-border-card/50 group hover:border-border-light transition-all">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: r.color + "15" }}>
                <Icon size={16} style={{ color: r.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text truncate">{r.titulo}</p>
                <p className="text-[10px] text-text-muted truncate">{r.descricao}</p>
                <div className="flex items-center gap-1 mt-0.5"><Clock size={8} className="text-text-muted/50" /><span className="text-[9px] text-text-muted/50">{r.ultima}</span></div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => handleGenerate(r.id)} disabled={isLoading}
                  className={`p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-all ${isLoading ? "opacity-50" : ""}`}>
                  {isLoading ? <div className="w-4 h-4 border-2 border-text-muted/30 border-t-primary rounded-full animate-spin" /> : <Download size={12} />}
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-all opacity-0 group-hover:opacity-100">
                  <Share2 size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
