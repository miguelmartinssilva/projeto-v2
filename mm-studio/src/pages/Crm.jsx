import { useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, LayoutGrid, List, Users, TrendingUp, Target, DollarSign, UserPlus } from "lucide-react";
import useCrmStore from "../store/crmStore";
import CRMTable from "../components/crm/table/CRMTable";
import KanbanBoard from "../components/crm/kanban/KanbanBoard";
import ClientDrawer from "../components/crm/drawer/ClientDrawer";
import NewClientDialog from "../components/crm/ui/NewClientDialog";
import MetricCard from "../components/crm/cards/MetricCard";
import FiltersDropdown from "../components/crm/filters/FiltersDropdown";
import Toast from "../components/crm/ui/Toast";
import ConfirmDialog from "../components/crm/ui/ConfirmDialog";
import LoadingSkeleton from "../components/crm/ui/LoadingSkeleton";

export default function Crm() {
  const { init, loading, search, setSearch, view, setView, getMetrics, toast, confirmDialog, hideConfirm, openDialog } = useCrmStore();

  useEffect(() => { init(); }, [init]);

  const metrics = getMetrics();

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs text-text-muted mb-1 tracking-wide">Visao geral <span className="mx-1.5 text-border-light">/</span><span className="text-text-secondary font-medium">CRM</span></p>
          <h1 className="text-2xl font-display font-bold text-text leading-tight">CRM</h1>
          <p className="text-xs text-text-muted mt-1">Gerencie seus clientes e pipeline de vendas</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => openDialog()}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg self-start sm:self-auto">
          <Plus size={16} /> Novo Cliente
        </motion.button>
      </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MetricCard label="Total Clientes" value={metrics.total} icon={Users} color="#7c3aed" delay={0} />
          <MetricCard label="Leads" value={metrics.leads} icon={UserPlus} color="#3b82f6" delay={0.05} />
          <MetricCard label="Em Negociacao" value={metrics.negociacoes} icon={Target} color="#f59e0b" delay={0.1} />
          <MetricCard label="Receita Pipeline" value={`R$ ${metrics.receita.toLocaleString("pt-BR")}`} icon={DollarSign} color="#00E676" delay={0.15} />
        </div>

<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <div className="relative flex-1 max-w-xs w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-bg-input border border-border-card rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <FiltersDropdown />
            <div className="flex items-center bg-white/[0.03] rounded-lg p-0.5 border border-border-card">
              <button onClick={() => setView("table")} className={`p-2 rounded-md transition-all ${view === "table" ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text"}`}><List size={14} /></button>
              <button onClick={() => setView("kanban")} className={`p-2 rounded-md transition-all ${view === "kanban" ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text"}`}><LayoutGrid size={14} /></button>
            </div>
          </div>
        </div>

        {view === "table" ? <CRMTable /> : <KanbanBoard />}
      </div>

      <ClientDrawer />
      <NewClientDialog />
      <Toast toast={toast} />
      <ConfirmDialog open={!!confirmDialog} title={confirmDialog?.title} description={confirmDialog?.description}
        onConfirm={confirmDialog?.onConfirm} onCancel={hideConfirm} />
    </div>
  );
}
