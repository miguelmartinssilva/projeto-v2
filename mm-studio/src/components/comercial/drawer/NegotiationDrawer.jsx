import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, MessageCircle, Building2, Calendar, Plus, Check, ArrowRight, FileText, TrendingUp, DollarSign, Clock, User, Tag } from "lucide-react";
import useComercialStore, { PIPELINE_STAGES, VENDEDORES } from "../../../store/comercialStore";
import { StageBadge, PrioridadeBadge, stageConfig } from "../ui/Badges";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const timelineIcons = { reuniao: Calendar, contato: Phone, proposta: FileText, status: ArrowRight, fechamento: TrendingUp, perdido: X, observacao: FileText };

const propostaStatusConfig = {
  enviada: { label: "Enviada", bg: "bg-blue-500/15", text: "text-blue-400" },
  aprovada: { label: "Aprovada", bg: "bg-emerald-500/15", text: "text-emerald-400" },
  recusada: { label: "Recusada", bg: "bg-red-500/15", text: "text-red-400" },
  rascunho: { label: "Rascunho", bg: "bg-white/5", text: "text-text-muted" },
};

export default function NegotiationDrawer() {
  const { drawerOpen, selectedDeal, closeDrawer, moveDealStage, addTimelineEntry, toggleTask, addTask } = useComercialStore();
  const [tab, setTab] = useState("info");
  const [newNote, setNote] = useState("");
  const [newTask, setNewTask] = useState("");

  if (!selectedDeal) return null;

  const deal = selectedDeal;
  const vendedor = VENDEDORES.find(v => v.id === deal.responsavel) || VENDEDORES[0];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addTimelineEntry(deal.id, { data: new Date().toISOString().slice(0, 10), tipo: "observacao", desc: newNote, autor: vendedor.nome.split(" ")[0] });
    setNote("");
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    addTask(deal.id, { desc: newTask, prazo: new Date().toISOString().slice(0, 10) });
    setNewTask("");
  };

  const tabs = [
    { key: "info", label: "Info" },
    { key: "timeline", label: "Timeline" },
    { key: "tarefas", label: "Tarefas" },
    { key: "propostas", label: "Propostas" },
    { key: "financeiro", label: "Financeiro" },
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
                  {deal.cliente?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text">{deal.cliente}</h2>
                  <p className="text-[11px] text-text-muted">{deal.empresa || "Sem empresa"}</p>
                </div>
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors"><X size={16} /></button>
            </div>

            <div className="px-4 py-3 border-b border-border-card flex-shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <StageBadge stage={deal.stage} size="md" />
                <PrioridadeBadge prioridade={deal.prioridade} />
              </div>
              <div className="flex gap-1 overflow-x-auto">
                {PIPELINE_STAGES.map(s => {
                  const cfg = stageConfig[s.key];
                  return (
                    <button key={s.key} onClick={() => moveDealStage(deal.id, s.key)} disabled={deal.stage === s.key}
                      className={`px-2 py-1 rounded-md text-[9px] font-semibold transition-all whitespace-nowrap ${deal.stage === s.key ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                      style={deal.stage === s.key ? { background: s.color + "18", color: s.color } : {}}>
                      {s.label}
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
                    {[
                      { icon: Phone, label: "Telefone", value: deal.telefone },
                      { icon: MessageCircle, label: "WhatsApp", value: deal.telefone },
                      { icon: Mail, label: "Email", value: deal.email },
                      { icon: Building2, label: "Empresa", value: deal.empresa },
                      { icon: User, label: "Responsavel", value: vendedor.nome },
                      { icon: Calendar, label: "Criado em", value: deal.criadoEm ? new Date(deal.criadoEm).toLocaleDateString("pt-BR") : "—" },
                      { icon: Clock, label: "Ultima interacao", value: deal.ultimaInteracao ? new Date(deal.ultimaInteracao).toLocaleDateString("pt-BR") : "—" },
                      { icon: ArrowRight, label: "Proxima acao", value: deal.proximaAcao },
                    ].filter(item => item.value).map(item => (
                      <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-elevated/50">
                        <item.icon size={14} className="text-text-muted flex-shrink-0" />
                        <div><p className="text-[10px] text-text-muted uppercase tracking-wider">{item.label}</p><p className="text-sm text-text">{item.value}</p></div>
                      </div>
                    ))}
                    {deal.tags && deal.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {deal.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">{t}</span>)}
                      </div>
                    )}
                    {deal.observacoes && (
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Observacoes</p>
                        <p className="text-xs text-text-secondary">{deal.observacoes}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {tab === "timeline" && (
                  <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="flex gap-2">
                      <input type="text" value={newNote} onChange={e => setNote(e.target.value)} placeholder="Adicionar nota..."
                        onKeyDown={e => e.key === "Enter" && handleAddNote()}
                        className="flex-1 bg-bg-input border border-border-card rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary" />
                      <button onClick={handleAddNote} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Plus size={14} /></button>
                    </div>
                    <div className="relative">
                      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border-card" />
                      {(deal.timeline || []).slice().reverse().map((entry, i) => {
                        const Icon = timelineIcons[entry.tipo] || FileText;
                        return (
                          <div key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                            <div className="w-6 h-6 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center flex-shrink-0 z-10">
                              <Icon size={10} className="text-text-muted" />
                            </div>
                            <div>
                              <p className="text-xs text-text font-medium">{entry.desc}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[10px] text-text-muted">{new Date(entry.data).toLocaleDateString("pt-BR")}</p>
                                {entry.autor && <span className="text-[9px] text-text-muted opacity-60">por {entry.autor}</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {tab === "tarefas" && (
                  <motion.div key="tarefas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    <div className="flex gap-2">
                      <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Nova tarefa..."
                        onKeyDown={e => e.key === "Enter" && handleAddTask()}
                        className="flex-1 bg-bg-input border border-border-card rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary" />
                      <button onClick={handleAddTask} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Plus size={14} /></button>
                    </div>
                    {(deal.tarefas || []).map(task => (
                      <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-elevated/50 group">
                        <button onClick={() => toggleTask(deal.id, task.id)}
                          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all ${task.done ? "bg-primary text-bg" : "border border-border-card hover:border-primary"}`}>
                          {task.done && <Check size={10} />}
                        </button>
                        <span className={`text-xs flex-1 ${task.done ? "text-text-muted line-through" : "text-text"}`}>{task.desc}</span>
                        {task.prazo && <span className="text-[10px] text-text-muted">{new Date(task.prazo).toLocaleDateString("pt-BR")}</span>}
                      </div>
                    ))}
                    {(!deal.tarefas || deal.tarefas.length === 0) && <p className="text-xs text-text-muted text-center py-6">Nenhuma tarefa</p>}
                  </motion.div>
                )}

                {tab === "propostas" && (
                  <motion.div key="propostas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    {(deal.propostas || []).map(p => {
                      const st = propostaStatusConfig[p.status] || propostaStatusConfig.rascunho;
                      return (
                        <div key={p.id} className="p-3 rounded-lg bg-bg-elevated/50 border border-border-card/50">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2"><FileText size={13} className="text-text-muted" /><span className="text-xs font-medium text-text">{p.titulo}</span></div>
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${st.bg} ${st.text}`}>{st.label}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-primary">{fmt(p.valor)}</span>
                            <span className="text-[10px] text-text-muted">{new Date(p.data).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                      );
                    })}
                    {(!deal.propostas || deal.propostas.length === 0) && <p className="text-xs text-text-muted text-center py-6">Nenhuma proposta enviada</p>}
                  </motion.div>
                )}

                {tab === "financeiro" && (
                  <motion.div key="financeiro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Valor negociacao</p>
                        <p className="text-lg font-bold text-primary">{fmt(deal.valor)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Probabilidade</p>
                        <p className="text-lg font-bold text-text">{deal.probabilidade ?? 0}%</p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Previsao de receita</p>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-primary" />
                        <span className="text-xl font-bold text-primary">{fmt(Math.round(deal.valor * (deal.probabilidade ?? 0) / 100))}</span>
                      </div>
                      <p className="text-[10px] text-text-muted mt-1">Valor x Probabilidade</p>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Funil</p>
                      <div className="flex items-center gap-1">
                        {PIPELINE_STAGES.filter(s => s.key !== "perdido").map((s, i) => {
                          const isActive = PIPELINE_STAGES.findIndex(ps => ps.key === deal.stage) >= i;
                          return (
                            <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
                              <div className={`w-full h-1.5 rounded-full transition-all ${isActive ? "" : "bg-bg-elevated"}`}
                                style={isActive ? { background: s.color } : {}} />
                              <span className={`text-[7px] font-medium ${isActive ? "" : "text-text-muted"}`}
                                style={isActive ? { color: s.color } : {}}>{s.label.split(" ")[0]}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Data fechamento</p>
                      <p className="text-sm text-text font-medium">{deal.dataFechamento ? new Date(deal.dataFechamento).toLocaleDateString("pt-BR") : "Pendente"}</p>
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
