import { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, CheckSquare, Search, Calendar, LayoutDashboard, Table2, ListChecks } from "lucide-react";
import useAgendaStore from "../store/agendaStore";
import MetricsCards from "../components/agenda/metrics/MetricsCards";
import CalendarView from "../components/agenda/calendar/CalendarView";
import TaskBoard from "../components/agenda/tasks/TaskBoard";
import EventDrawer from "../components/agenda/drawer/EventDrawer";
import MeetingCards from "../components/agenda/meetings/MeetingCards";
import ReminderPanel from "../components/agenda/reminders/ReminderPanel";
import FiltersDropdown from "../components/agenda/filters/FiltersDropdown";
import NewEventDialog from "../components/agenda/modals/NewEventDialog";
import NewTaskDialog from "../components/agenda/modals/NewTaskDialog";
import Toast from "../components/agenda/ui/Toast";
import ConfirmDialog from "../components/agenda/ui/ConfirmDialog";
import LoadingSkeleton from "../components/agenda/ui/LoadingSkeleton";

export default function Agenda() {
  const {
    loading, view, search, toast, confirmDialog,
    init, setView, setSearch, openEventDialog, openTaskDialog, hideConfirm,
  } = useAgendaStore();

  useEffect(() => { init(); }, [init]);

  if (loading) return <LoadingSkeleton />;

  const views = [
    { key: "calendar", label: "Calendario", icon: Calendar },
    { key: "tasks", label: "Tarefas", icon: ListChecks },
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">
              MM Studio <span className="mx-1.5 text-border-light">/</span>
              <span className="text-text-secondary font-medium">Agenda</span>
            </p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Agenda</h1>
            <p className="text-xs text-text-muted mt-1">Gerencie compromissos, tarefas e lembretes</p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => openEventDialog()}
              className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg">
              <Plus size={15} /> Evento
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => openTaskDialog()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg bg-white/5 text-text-muted hover:text-text hover:bg-white/10 transition-colors border border-border-card">
              <CheckSquare size={15} /> Tarefa
            </motion.button>
          </div>
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
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar eventos, tarefas..."
                className="bg-bg-card border border-border-card rounded-lg pl-8 pr-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary w-52" />
            </div>
            <FiltersDropdown />
          </div>
        </div>

        {view === "calendar" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <CalendarView />
            </div>
            <div className="space-y-4">
              <MeetingCards />
              <ReminderPanel />
            </div>
          </motion.div>
        )}

        {view === "tasks" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TaskBoard />
          </motion.div>
        )}

        {view === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3 space-y-4">
              <CalendarView />
              <TaskBoard />
            </div>
            <div className="space-y-4">
              <MeetingCards />
              <ReminderPanel />
            </div>
          </motion.div>
        )}
      </div>

      <EventDrawer />
      <NewEventDialog />
      <NewTaskDialog />
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
