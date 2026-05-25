import { motion } from "framer-motion";
import { Check, Clock, AlertTriangle, Trash2, GripVertical } from "lucide-react";
import useAgendaStore, { CATEGORIAS_TAREFA, RESPONSAVEIS } from "../../../store/agendaStore";
import { PriorityBadge, TaskCategoryBadge, TaskStatusBadge } from "../ui/Badges";
import EmptyState from "../ui/EmptyState";
import { format } from "date-fns";

const COLUMNS = [
  { key: "pendente", label: "Pendentes", icon: Clock, color: "#f59e0b" },
  { key: "em_andamento", label: "Em Andamento", icon: AlertTriangle, color: "#3b82f6" },
  { key: "concluida", label: "Concluidas", icon: Check, color: "#22c55e" },
];

export default function TaskBoard() {
  const { getFilteredTasks, moveTaskStatus, deleteTask, showConfirm, toggleChecklist, openDrawer } = useAgendaStore();
  const tasks = getFilteredTasks();

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card p-5">
      <h3 className="text-sm font-bold text-text mb-4">Tarefas</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key);
          const Icon = col.icon;
          return (
            <div key={col.key} className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: col.color + "15" }}>
                    <Icon size={12} style={{ color: col.color }} />
                  </div>
                  <span className="text-xs font-semibold text-text">{col.label}</span>
                </div>
                <span className="text-[10px] text-text-muted bg-white/5 px-1.5 py-0.5 rounded">{colTasks.length}</span>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="text-[10px] text-text-muted text-center py-6">Nenhuma tarefa</div>
                ) : colTasks.map(task => (
                  <TaskCard key={task.id} task={task} col={col} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskCard({ task, col }) {
  const { moveTaskStatus, deleteTask, showConfirm, toggleChecklist } = useAgendaStore();
  const resp = RESPONSAVEIS.find(r => r.id === task.responsavel) || RESPONSAVEIS[0];
  const doneCount = (task.checklist || []).filter(c => c.done).length;
  const totalCount = (task.checklist || []).length;
  const progress = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const nextStatus = col.key === "pendente" ? "em_andamento" : col.key === "em_andamento" ? "concluida" : null;

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="p-3 rounded-xl bg-bg-elevated/50 border border-border-card/50 hover:border-border-light transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-semibold text-text flex-1 pr-2">{task.titulo}</p>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {nextStatus && (
            <button onClick={() => moveTaskStatus(task.id, nextStatus)}
              className="p-1 rounded hover:bg-primary/10 text-text-muted hover:text-primary"><Check size={10} /></button>
          )}
          <button onClick={() => showConfirm({ title: "Excluir tarefa", description: `Remover "${task.titulo}"?`, onConfirm: () => deleteTask(task.id) })}
            className="p-1 rounded hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={10} /></button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <PriorityBadge prioridade={task.prioridade} />
        <TaskCategoryBadge categoria={task.categoria} />
      </div>
      {task.cliente && <p className="text-[10px] text-text-muted mb-2">Cliente: {task.cliente}</p>}
      {totalCount > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between text-[9px] text-text-muted mb-1">
            <span>{doneCount}/{totalCount}</span><span>{progress}%</span>
          </div>
          <div className="w-full h-1 rounded-full bg-bg-main overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
              className="h-full rounded-full" style={{ background: col.color }} />
          </div>
        </div>
      )}
      {task.checklist && task.checklist.length > 0 && (
        <div className="space-y-1 mt-2">
          {task.checklist.slice(0, 3).map(c => (
            <div key={c.id} className="flex items-center gap-1.5">
              <button onClick={() => toggleChecklist(task.id, c.id)}
                className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 transition-all ${c.done ? "bg-primary text-bg" : "border border-border-card hover:border-primary"}`}>
                {c.done && <Check size={8} />}
              </button>
              <span className={`text-[10px] ${c.done ? "text-text-muted line-through" : "text-text-secondary"}`}>{c.desc}</span>
            </div>
          ))}
          {task.checklist.length > 3 && <p className="text-[9px] text-text-muted">+{task.checklist.length - 3} mais</p>}
        </div>
      )}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-card/40">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ background: resp.cor + "20", color: resp.cor }}>
            {resp.avatar}
          </div>
          <span className="text-[9px] text-text-muted">{resp.nome.split(" ")[0]}</span>
        </div>
        {task.prazo && <span className="text-[9px] text-text-muted">{format(new Date(task.prazo), "dd/MM")}</span>}
      </div>
    </motion.div>
  );
}
