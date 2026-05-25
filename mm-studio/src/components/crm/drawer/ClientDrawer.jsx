import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, MessageCircle, Building2, Hash, Calendar, Plus, Check, Square, Clock, ArrowRight, FileText, TrendingUp } from "lucide-react";
import useCrmStore, { STATUS_ORDER } from "../../../store/crmStore";
import { statusConfig } from "../ui/StatusBadge";
import StatusBadge from "../ui/StatusBadge";
const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const timelineIcons = { reuniao: Calendar, contato: Phone, proposta: FileText, status: ArrowRight, fechamento: TrendingUp, perdido: X, observacao: FileText };

export default function ClientDrawer() {
  const { drawerOpen, selectedClient, closeDrawer, moveClientStatus, addTimelineEntry, toggleTask, addTask } = useCrmStore();
  const [tab, setTab] = useState("info");
  const [newNote, setNewNote] = useState("");
  const [newTask, setNewTask] = useState("");

  if (!selectedClient) return null;

  const client = selectedClient;
  const cfg = statusConfig[client.status] || statusConfig.lead;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addTimelineEntry(client.id, { data: new Date().toISOString().slice(0, 10), tipo: "observacao", desc: newNote });
    setNewNote("");
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addTask(client.id, { desc: newTask, prazo: new Date().toISOString().slice(0, 10) });
    setNewTask("");
  };

  const tabs = [
    { key: "info", label: "Info" },
    { key: "timeline", label: "Timeline" },
    { key: "tarefas", label: "Tarefas" },
    { key: "comercial", label: "Comercial" },
  ];

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={closeDrawer} />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg-card border-l border-border-card z-50 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border-card flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-card flex items-center justify-center text-xs font-bold text-primary">
                  {client.nome?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text">{client.nome}</h2>
                  <p className="text-[11px] text-text-muted">{client.empresa || "Sem empresa"}</p>
                </div>
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors"><X size={16} /></button>
            </div>

            <div className="px-4 py-3 border-b border-border-card flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge status={client.status} size="md" />
                <span className="text-[10px] text-text-muted">Mover para:</span>
              </div>
              <div className="flex gap-1 overflow-x-auto">
                {STATUS_ORDER.map(s => {
                  const sc = statusConfig[s];
                  return (
                    <button key={s} onClick={() => moveClientStatus(client.id, s)} disabled={client.status === s}
                      className={`px-2 py-1 rounded-md text-[9px] font-semibold transition-all whitespace-nowrap ${client.status === s ? `${sc.bg} ${sc.text} ring-1 ring-current/20` : "bg-white/5 text-text-muted hover:text-text"}`}>
                      {sc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex border-b border-border-card flex-shrink-0">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex-1 py-2.5 text-xs font-medium transition-all border-b-2 ${tab === t.key ? "text-primary border-primary" : "text-text-muted border-transparent hover:text-text"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {tab === "info" && (
                  <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { icon: Phone, label: "Telefone", value: client.telefone },
                        { icon: MessageCircle, label: "WhatsApp", value: client.whatsapp },
                        { icon: Mail, label: "Email", value: client.email },
                        { icon: Building2, label: "Empresa", value: client.empresa },
                        { icon: Hash, label: "CPF/CNPJ", value: client.cpfCnpj },
                      ].map(item => item.value && (
                        <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-elevated/50">
                          <item.icon size={14} className="text-text-muted flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-text-muted uppercase tracking-wider">{item.label}</p>
                            <p className="text-sm text-text">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {client.tags && client.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {client.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">{t}</span>)}
                      </div>
                    )}
                    {client.observacoes && (
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Observacoes</p>
                        <p className="text-xs text-text-secondary">{client.observacoes}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {tab === "timeline" && (
                  <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="flex gap-2">
                      <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Adicionar nota..."
                        onKeyDown={e => e.key === "Enter" && handleAddNote()}
                        className="flex-1 bg-bg-input border border-border-card rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary" />
                      <button onClick={handleAddNote} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Plus size={14} /></button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border-card" />
                      {(client.timeline || []).map((entry, i) => {
                        const Icon = timelineIcons[entry.tipo] || FileText;
                        return (
                          <div key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                            <div className="w-6 h-6 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center flex-shrink-0 z-10">
                              <Icon size={10} className="text-text-muted" />
                            </div>
                            <div>
                              <p className="text-xs text-text font-medium">{entry.desc}</p>
                              <p className="text-[10px] text-text-muted mt-0.5">{new Date(entry.data).toLocaleDateString("pt-BR")}</p>
                            </div>
                          </div>
                        );
                      }).reverse()}
                    </div>
                  </motion.div>
                )}

                {tab === "tarefas" && (
                  <motion.div key="tarefas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="flex gap-2">
                      <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Nova tarefa..."
                        onKeyDown={e => e.key === "Enter" && handleAddTask()}
                        className="flex-1 bg-bg-input border border-border-card rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary" />
                      <button onClick={handleAddTask} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Plus size={14} /></button>
                    </div>
                    {(client.tarefas || []).map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-elevated/50 group">
                        <button onClick={() => toggleTask(client.id, task.id)}
                          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${task.done ? "bg-primary text-bg" : "border border-border-card hover:border-primary"}`}>
                          {task.done && <Check size={10} />}
                        </button>
                        <span className={`text-xs flex-1 ${task.done ? "text-text-muted line-through" : "text-text"}`}>{task.desc}</span>
                        {task.prazo && <span className="text-[10px] text-text-muted">{new Date(task.prazo).toLocaleDateString("pt-BR")}</span>}
                      </div>
                    ))}
                    {(!client.tarefas || client.tarefas.length === 0) && <p className="text-xs text-text-muted text-center py-6">Nenhuma tarefa</p>}
                  </motion.div>
                )}

                {tab === "comercial" && (
                  <motion.div key="comercial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Receita</p>
                        <p className="text-lg font-bold text-primary">{fmt(client.receita)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Tipo</p>
                        <p className="text-sm font-medium text-text capitalize">{client.tipo || "avulso"}</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Funil</p>
                      <div className="flex items-center gap-1">
                        {STATUS_ORDER.filter(s => s !== "perdido").map((s, i) => {
                          const sc = statusConfig[s];
                          const isActive = STATUS_ORDER.indexOf(client.status) >= i;
                          return (
                            <div key={s} className="flex-1 flex flex-col items-center gap-1">
                              <div className={`w-full h-1.5 rounded-full ${isActive ? "" : "bg-bg-elevated"}`} style={{ background: isActive ? sc.dot : undefined }} />
                              <span className={`text-[8px] font-medium ${isActive ? sc.text : "text-text-muted"}`}>{sc.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Responsavel</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-[8px] font-bold text-primary">{(client.responsavel || "M")[0]}</div>
                        <span className="text-xs text-text">{client.responsavel || "Miguel"}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
