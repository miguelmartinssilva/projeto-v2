import { useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, List, GitBranch, Link2 } from "lucide-react";
import useAutomacoesStore from "../store/automacoesStore";
import MetricsCards from "../components/automacoes/metrics/MetricsCards";
import AutomationTable from "../components/automacoes/tables/AutomationTable";
import AutomationDrawer from "../components/automacoes/drawer/AutomationDrawer";
import WorkflowBuilder from "../components/automacoes/workflow/WorkflowBuilder";
import IntegrationCards from "../components/automacoes/integrations/IntegrationCards";
import TemplatesGallery from "../components/automacoes/templates/TemplatesGallery";
import LogsPanel from "../components/automacoes/logs/LogsPanel";
import FiltersDropdown from "../components/automacoes/filters/FiltersDropdown";
import NewAutomationDialog from "../components/automacoes/modals/NewAutomationDialog";
import Toast from "../components/automacoes/ui/Toast";
import ConfirmDialog from "../components/automacoes/ui/ConfirmDialog";
import LoadingSkeleton from "../components/automacoes/ui/LoadingSkeleton";

export default function Automacoes() {
  const {
    loading, view, search, toast, confirmDialog, selectedAuto,
    init, setView, setSearch, openDialog, hideConfirm,
  } = useAutomacoesStore();

  useEffect(() => { init(); }, [init]);

  if (loading) return <LoadingSkeleton />;

  const views = [
    { key: "list", label: "Automacoes", icon: List },
    { key: "workflow", label: "Workflow", icon: GitBranch },
    { key: "integrations", label: "Integracoes", icon: Link2 },
  ];

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">
              MM Studio <span className="mx-1.5 text-border-light">/</span>
              <span className="text-text-secondary font-medium">Automacoes</span>
            </p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Automacoes</h1>
            <p className="text-xs text-text-muted mt-1">Automatize tarefas e integre seus sistemas</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => openDialog()}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
            <Plus size={16} /> Nova Automacao
          </motion.button>
        </div>

        <MetricsCards />

        <div className="flex items-center justify-between mt-6 mb-4">
          <div className="flex items-center gap-1 bg-bg-card rounded-xl border border-border-card p-1">
            {views.map(v => (
              <button key={v.key} onClick={() => setView(v.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === v.key ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text"}`}>
                <v.icon size={13} /> {v.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar automacoes..."
                className="bg-bg-card border border-border-card rounded-lg pl-8 pr-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary w-52" />
            </div>
            <FiltersDropdown />
          </div>
        </div>

        {view === "list" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <AutomationTable />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LogsPanel />
              <TemplatesGallery />
            </div>
          </motion.div>
        )}

        {view === "workflow" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {selectedAuto ? (
              <WorkflowBuilder autoId={selectedAuto.id} />
            ) : (
              <div className="bg-bg-card rounded-2xl border border-border-card p-12 flex flex-col items-center justify-center">
                <GitBranch size={32} className="text-text-muted opacity-20 mb-3" />
                <p className="text-sm text-text-muted mb-1">Selecione uma automacao</p>
                <p className="text-xs text-text-muted/60">Clique em uma automacao na tabela para visualizar o workflow</p>
              </div>
            )}
            <AutomationTable />
          </motion.div>
        )}

        {view === "integrations" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <IntegrationCards />
            <LogsPanel />
          </motion.div>
        )}
      </div>

      <AutomationDrawer />
      <NewAutomationDialog />
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
