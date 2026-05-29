import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Download, UserPlus, FileText, Calendar, Zap, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import useDashboardStore, { PERIODOS } from "../store/dashboardStore";
import MetricsCards from "../components/dashboard/metrics/MetricsCards";
import RevenueChart from "../components/dashboard/charts/RevenueChart";
import FinanceChart from "../components/dashboard/charts/FinanceChart";
import ComercialChart from "../components/dashboard/charts/ComercialChart";
import CRMChart from "../components/dashboard/charts/CRMChart";
import AgendaChart from "../components/dashboard/charts/AgendaChart";
import AnalyticsChart from "../components/dashboard/charts/AnalyticsChart";
import FinanceWidget from "../components/dashboard/widgets/FinanceWidget";
import CRMWidget from "../components/dashboard/widgets/CRMWidget";
import ComercialWidget from "../components/dashboard/widgets/ComercialWidget";
import ActivityTimeline from "../components/dashboard/timeline/ActivityTimeline";
import NotificationsDropdown from "../components/dashboard/notifications/NotificationsDropdown";
import FiltersDropdown from "../components/dashboard/filters/FiltersDropdown";
import Toast from "../components/dashboard/ui/Toast";
import LoadingSkeleton from "../components/dashboard/ui/LoadingSkeleton";

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    loading, periodo, search, toast,
    init, setPeriodo, setSearch, exportCSV, getGreeting,
  } = useDashboardStore();

  useEffect(() => { init(); }, [init]);

  if (loading) return <LoadingSkeleton />;

  const greeting = getGreeting();
  const today = format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR });
  const shortcuts = [
    { label: "Novo Cliente", icon: UserPlus, path: "/crm", color: "#22c55e" },
    { label: "Nova Venda", icon: FileText, path: "/comercial", color: "#7c3aed" },
    { label: "Agendar", icon: Calendar, path: "/agenda", color: "#448aff" },
    { label: "Automacao", icon: Zap, path: "/automacoes", color: "#ffb800" },
  ];

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* HEADER */}
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-text-muted mb-1 tracking-wide">
            MM Studio <span className="mx-1.5 text-border-light">/</span>
            <span className="text-text-secondary font-medium">Dashboard</span>
          </p>
          <h1 className="text-2xl font-display font-bold text-text leading-tight">
            {greeting}, Miguel <span className="inline-block animate-pulse">👋</span>
          </h1>
          <p className="text-xs text-text-muted mt-1 capitalize">{today} · Visao consolidada do seu negocio</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 text-text-muted hover:text-text border border-border-card hover:border-border-light transition-all whitespace-nowrap">
            <Download size={13} /> Exportar
          </motion.button>
          <FiltersDropdown />
          <NotificationsDropdown />
          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
            MM
          </div>
        </div>
      </div>

        {/* KPI CARDS */}
        <MetricsCards />

        {/* ROW 1: Revenue + Finance Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          <RevenueChart />
          <FinanceChart />
        </div>

        {/* ROW 2: CRM + Commercial + Finance Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <CRMChart />
          <ComercialChart />
          <FinanceWidget />
        </div>

        {/* ROW 3: Timeline + Agenda + CRM Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="lg:col-span-1"><ActivityTimeline /></div>
          <AgendaChart />
          <CRMWidget />
        </div>

        {/* ROW 4: Analytics + Comercial Widget + Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <AnalyticsChart />
          <ComercialWidget />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
            <h3 className="text-sm font-bold text-text mb-4">Atalhos Rapidos</h3>
            <div className="grid grid-cols-2 gap-3">
              {shortcuts.map(s => (
                <motion.button key={s.label} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => navigate(s.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-border-card transition-all">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
                    <s.icon size={20} style={{ color: s.color }} />
                  </div>
                  <span className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.08em]">{s.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
