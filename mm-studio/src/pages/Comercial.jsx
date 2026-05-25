import { useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, LayoutGrid, List, BarChart3, Download } from "lucide-react";
import useComercialStore from "../store/comercialStore";
import PipelineBoard from "../components/comercial/pipeline/PipelineBoard";
import ComercialTable from "../components/comercial/table/ComercialTable";
import NegotiationDrawer from "../components/comercial/drawer/NegotiationDrawer";
import NewDealDialog from "../components/comercial/modals/NewDealDialog";
import MetricsCards from "../components/comercial/metrics/MetricsCards";
import SalesFunnel from "../components/comercial/charts/SalesFunnel";
import RankingCard from "../components/comercial/charts/RankingCard";
import RevenueChart from "../components/comercial/charts/RevenueChart";
import FiltersDropdown from "../components/comercial/filters/FiltersDropdown";
import Toast from "../components/comercial/ui/Toast";
import ConfirmDialog from "../components/comercial/ui/ConfirmDialog";
import LoadingSkeleton from "../components/comercial/ui/LoadingSkeleton";
import { getComercial } from "../utils/storage";

export default function Comercial() {
  const { init, loading, search, setSearch, view, setView, toast, confirmDialog, hideConfirm, openNewDealDialog, getMetrics, deleteDeal } = useComercialStore();

  useEffect(() => { init(); }, [init]);

  const metrics = getMetrics();
  const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

  const handleExport = () => {
    const deals = getComercial();
    const csv = ["Cliente,Empresa,Valor,Etapa,Prioridade,Responsavel,Probabilidade"]
      .concat(deals.map(d => `"${d.cliente}","${d.empresa || ""}",${d.valor},${d.stage},${d.prioridade},${d.responsavel},${d.probabilidade ?? 0}%`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "comercial_pipeline.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">Comercial</span></p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Pipeline Comercial</h1>
            <p className="text-xs text-text-muted mt-1">Acompanhe suas oportunidades, negociacoes e metas de venda</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 text-text-muted hover:text-text hover:bg-white/10 border border-border-card transition-all">
              <Download size={13} /> Exportar
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => openNewDealDialog()}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
              <Plus size={16} /> Nova Negociacao
            </motion.button>
          </div>
        </div>

        {/* METRICS */}
        <div className="mb-6">
          <MetricsCards />
        </div>

        {/* META PROGRESS */}
        <div className="bg-bg-card rounded-xl border border-border-card p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Meta Mensal</span>
              <span className="text-xs font-bold text-primary">{fmt(metrics.receitaTotal)}</span>
              <span className="text-[10px] text-text-muted">de {fmt(metrics.metaMensal)}</span>
            </div>
            <span className={`text-xs font-bold ${metrics.receitaTotal >= metrics.metaMensal ? "text-emerald-400" : "text-amber-400"}`}>
              {Math.round((metrics.receitaTotal / metrics.metaMensal) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((metrics.receitaTotal / metrics.metaMensal) * 100, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: metrics.receitaTotal >= metrics.metaMensal ? "#22c55e" : "linear-gradient(90deg, #00e676, #00c853)" }} />
          </div>
        </div>

        {/* SEARCH + FILTERS + VIEW TOGGLE */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Buscar negociacao..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-bg-input border border-border-card rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <FiltersDropdown />
            <div className="flex items-center bg-white/[0.03] rounded-lg p-0.5 border border-border-card">
              <button onClick={() => setView("pipeline")} className={`p-2 rounded-md transition-all ${view === "pipeline" ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text"}`}><LayoutGrid size={14} /></button>
              <button onClick={() => setView("table")} className={`p-2 rounded-md transition-all ${view === "table" ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text"}`}><List size={14} /></button>
              <button onClick={() => setView("analytics")} className={`p-2 rounded-md transition-all ${view === "analytics" ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text"}`}><BarChart3 size={14} /></button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        {view === "pipeline" && <PipelineBoard />}
        {view === "table" && <ComercialTable />}
        {view === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SalesFunnel />
            <RevenueChart />
            <RankingCard />
            <div className="bg-bg-card rounded-2xl border border-border-card p-5">
              <h3 className="text-sm font-bold text-text mb-1">Resumo Geral</h3>
              <p className="text-[10px] text-text-muted mb-4">Metricas consolidadas do pipeline</p>
              <div className="space-y-3">
                {[
                  { label: "Valor no Pipeline", value: fmt(metrics.pipelineValor), color: "#3b82f6" },
                  { label: "Receita Fechada", value: fmt(metrics.receitaTotal), color: "#22c55e" },
                  { label: "Taxa de Conversao", value: `${metrics.taxaConversao}%`, color: "#8b5cf6" },
                  { label: "Ticket Medio", value: fmt(metrics.ticketMedio), color: "#f59e0b" },
                  { label: "Negociacoes Ativas", value: metrics.negociacoesAtivas, color: "#00e676" },
                  { label: "Vendas Fechadas", value: metrics.vendasFechadas, color: "#7c3aed" },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-elevated/50">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-xs text-text-secondary">{item.label}</span>
                    </div>
                    <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* OVERLAYS */}
      <NegotiationDrawer />
      <NewDealDialog />
      <Toast toast={toast} />
      <ConfirmDialog open={!!confirmDialog} title={confirmDialog?.title} description={confirmDialog?.description}
        onConfirm={confirmDialog?.onConfirm} onCancel={hideConfirm} />
    </div>
  );
}
