import { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, TrendingDown, LayoutDashboard, Table2, BarChart3, Download, Search } from "lucide-react";
import useFinanceiroStore from "../store/financeiroStore";
import MetricsCards from "../components/financeiro/metrics/MetricsCards";
import RevenueExpenseChart from "../components/financeiro/charts/RevenueExpenseChart";
import ExpensePieChart from "../components/financeiro/charts/ExpensePieChart";
import CashFlowChart from "../components/financeiro/charts/CashFlowChart";
import FinanceTable from "../components/financeiro/tables/FinanceTable";
import FinanceDrawer from "../components/financeiro/drawer/FinanceDrawer";
import FiltersDropdown from "../components/financeiro/filters/FiltersDropdown";
import NewTransactionDialog from "../components/financeiro/modals/NewTransactionDialog";
import Toast from "../components/financeiro/ui/Toast";
import ConfirmDialog from "../components/financeiro/ui/ConfirmDialog";
import LoadingSkeleton from "../components/financeiro/ui/LoadingSkeleton";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function Financeiro() {
  const {
    loading, view, search, toast, confirmDialog,
    init, setView, setSearch, openDialog, hideConfirm,
    getMetrics, getContaTotals,
  } = useFinanceiroStore();

  useEffect(() => { init(); }, [init]);

  if (loading) return <LoadingSkeleton />;

  const metrics = getMetrics();
  const contas = getContaTotals();

  const exportCSV = () => {
    const movs = useFinanceiroStore.getState().getFilteredMovimentacoes();
    const csv = ["Descricao,Tipo,Categoria,Valor,Status,Vencimento,Conta,Metodo,Responsavel",
      ...movs.map(m => `"${m.descricao}",${m.tipo},${m.categoria},${m.valor},${m.status},${m.dataVencimento},${m.conta},${m.metodoPagamento},${m.responsavel}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "financeiro.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const views = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "tabela", label: "Tabela", icon: Table2 },
    { key: "relatorios", label: "Relatorios", icon: BarChart3 },
  ];

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-text-muted mb-1 tracking-wide">Visao geral <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">Financeiro</span></p>
          <h1 className="text-2xl font-display font-bold text-text leading-tight">Financeiro</h1>
          <p className="text-xs text-text-muted mt-1">Controle financeiro do seu negocio</p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => openDialog("entrada")}
            className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
            <Plus size={15} /> Entrada
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => openDialog("saida")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg bg-danger/15 text-danger hover:bg-danger/25 transition-colors">
            <TrendingDown size={15} /> Saida
          </motion.button>
        </div>
      </div>

        <MetricsCards />

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 mb-4">
        <div className="flex items-center gap-1 bg-bg-card rounded-xl border border-border-card p-1 overflow-x-auto">
          {views.map(v => (
            <button key={v.key} onClick={() => setView(v.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${view === v.key ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text"}`}>
              <v.icon size={13} /> {v.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
              className="w-full sm:w-48 bg-bg-card border border-border-card rounded-lg pl-8 pr-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary" />
          </div>
          <FiltersDropdown />
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 text-text-muted hover:text-text transition-colors whitespace-nowrap">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

        {view === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2"><RevenueExpenseChart /></div>
              <ExpensePieChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CashFlowChart />
              <div className="bg-bg-card rounded-2xl border border-border-card p-5">
                <h3 className="text-sm font-bold text-text mb-4">Contas</h3>
                <div className="space-y-3">
                  {contas.map(c => (
                    <div key={c.key} className="flex items-center justify-between p-3 rounded-lg bg-bg-elevated/50">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: c.color + "15" }}>
                          <span className="text-xs font-bold" style={{ color: c.color }}>{c.label[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text">{c.label}</p>
                          <p className="text-[10px] text-text-muted">Entradas: {fmt(c.entradas)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${c.saldo >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(c.saldo)}</p>
                        <p className="text-[10px] text-text-muted">Saidas: {fmt(c.saidas)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <FinanceTable />
          </motion.div>
        )}

        {view === "tabela" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FinanceTable />
          </motion.div>
        )}

        {view === "relatorios" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RevenueExpenseChart />
              <CashFlowChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <ExpensePieChart />
              <div className="lg:col-span-2 bg-bg-card rounded-2xl border border-border-card p-5">
                <h3 className="text-sm font-bold text-text mb-4">Resumo Financeiro</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Receita", value: metrics.receitaTotal, color: "#22c55e" },
                    { label: "Despesas", value: metrics.despesaTotal, color: "#ff4d6d" },
                    { label: "Lucro", value: metrics.lucroLiquido, color: metrics.lucroLiquido >= 0 ? "#a78bfa" : "#ff4d6d" },
                    { label: "Fluxo Caixa", value: metrics.fluxoCaixa, color: "#3b82f6" },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-lg font-bold" style={{ color: item.color }}>{fmt(item.value)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border-card">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Total Entradas</p>
                      <p className="text-sm font-bold text-text">{metrics.totalEntradas} registro{metrics.totalEntradas !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Total Saidas</p>
                      <p className="text-sm font-bold text-text">{metrics.totalSaidas} registro{metrics.totalSaidas !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <FinanceDrawer />
      <NewTransactionDialog />
      <Toast toast={toast} />
      <ConfirmDialog
        open={!!confirmDialog}
        title={confirmDialog?.title || ""}
        description={confirmDialog?.description || ""}
        onConfirm={confirmDialog?.onConfirm || (() => {})}
        onCancel={hideConfirm}
      />
    </div>
  );
}
