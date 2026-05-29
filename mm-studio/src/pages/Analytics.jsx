import { useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Download, LayoutDashboard, Table2, BarChart3 } from "lucide-react";
import useAnalyticsStore, { PERIODOS } from "../store/analyticsStore";
import MetricsCards from "../components/analytics/metrics/MetricsCards";
import RevenueChart from "../components/analytics/charts/RevenueChart";
import ConversionChart from "../components/analytics/charts/ConversionChart";
import SalesChart from "../components/analytics/charts/SalesChart";
import FinancialChart from "../components/analytics/charts/FinancialChart";
import ClientsChart from "../components/analytics/charts/ClientsChart";
import ActivityChart from "../components/analytics/charts/ActivityChart";
import InsightCards from "../components/analytics/insights/InsightCards";
import AnalyticsTable from "../components/analytics/tables/AnalyticsTable";
import PerformanceCards from "../components/analytics/performance/PerformanceCards";
import ReportsPanel from "../components/analytics/reports/ReportsPanel";
import FiltersDropdown from "../components/analytics/filters/FiltersDropdown";
import Toast from "../components/analytics/ui/Toast";
import ConfirmDialog from "../components/analytics/ui/ConfirmDialog";
import LoadingSkeleton from "../components/analytics/ui/LoadingSkeleton";

export default function Analytics() {
  const {
    loading, view, periodo, search, toast, confirmDialog,
    init, setView, setPeriodo, setSearch, exportCSV, hideConfirm,
  } = useAnalyticsStore();

  useEffect(() => { init(); }, [init]);

  if (loading) return <LoadingSkeleton />;

  const views = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "tabela", label: "Metricas", icon: Table2 },
    { key: "relatorios", label: "Relatorios", icon: BarChart3 },
  ];

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-text-muted mb-1 tracking-wide">
            MM Studio <span className="mx-1.5 text-border-light">/</span>
            <span className="text-text-secondary font-medium">Analytics</span>
          </p>
          <h1 className="text-2xl font-display font-bold text-text leading-tight">Analytics</h1>
          <p className="text-xs text-text-muted mt-1">Business Intelligence e insights estrategicos</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto">
          <div className="flex gap-1 bg-bg-card rounded-xl border border-border-card p-1">
            {PERIODOS.map(p => (
              <button key={p.key} onClick={() => setPeriodo(p.key)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all whitespace-nowrap ${periodo === p.key ? "bg-primary text-black" : "text-text-muted hover:text-text"}`}>
                {p.label}
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-text-muted hover:text-text border border-border-card hover:border-border-light transition-all whitespace-nowrap">
            <Download size={13} /> Exportar
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
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar metricas..."
              className="w-full sm:w-52 bg-bg-card border border-border-card rounded-lg pl-8 pr-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary" />
          </div>
          <FiltersDropdown />
        </div>
      </div>

        {view === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RevenueChart />
              <ConversionChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SalesChart />
              <FinancialChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ClientsChart />
              <ActivityChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2"><PerformanceCards /></div>
              <InsightCards />
            </div>
          </motion.div>
        )}

        {view === "tabela" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <AnalyticsTable />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RevenueChart />
              <SalesChart />
            </div>
            <InsightCards />
          </motion.div>
        )}

        {view === "relatorios" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <RevenueChart />
                <FinancialChart />
              </div>
              <ReportsPanel />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ConversionChart />
              <ClientsChart />
            </div>
            <PerformanceCards />
          </motion.div>
        )}
      </div>

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
