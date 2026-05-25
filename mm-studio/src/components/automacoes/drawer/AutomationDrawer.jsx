import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Activity, BarChart3, Clock, User, Link2, ToggleLeft, ToggleRight, Copy, Trash2 } from "lucide-react";
import { format } from "date-fns";
import useAutomacoesStore, { STATUS_AUTO, TRIGGER_TYPES, ACAO_TYPES, CONDICAO_TYPES, RESPONSAVEIS } from "../../../store/automacoesStore";
import { StatusBadge, IntegracaoBadge } from "../ui/Badges";
import WorkflowBuilder from "../workflow/WorkflowBuilder";

const tabs = [
  { key: "info", label: "Info", icon: Zap },
  { key: "workflow", label: "Workflow", icon: Activity },
  { key: "logs", label: "Logs", icon: Clock },
  { key: "stats", label: "Stats", icon: BarChart3 },
];

export default function AutomationDrawer() {
  const { drawerOpen, closeDrawer, selectedAuto, logs, toggleAutomacao, duplicateAutomacao, showConfirm, deleteAutomacao } = useAutomacoesStore();
  const [activeTab, setActiveTab] = useState("info");

  if (!selectedAuto) return null;

  const triggerCfg = TRIGGER_TYPES.find(t => t.key === selectedAuto.trigger) || TRIGGER_TYPES[0];
  const autoLogs = logs.filter(l => l.automacaoId === selectedAuto.id).sort((a, b) => b.timestamp - a.timestamp);
  const resp = RESPONSAVEIS.find(r => r.id === selectedAuto.responsavel);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDrawer} />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-bg-card border-l border-border-card shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-bg-card/95 backdrop-blur-sm z-10 border-b border-border-card px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: triggerCfg.bg }}>
                    <Zap size={16} style={{ color: triggerCfg.color }} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-text">{selectedAuto.nome}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StatusBadge status={selectedAuto.status} />
                      <IntegracaoBadge integracao={selectedAuto.integracao} />
                    </div>
                  </div>
                </div>
                <button onClick={closeDrawer} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
              </div>
              <div className="flex items-center gap-1 mt-4">
                {tabs.map(t => (
                  <button key={t.key} onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${activeTab === t.key ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text"}`}>
                    <t.icon size={11} /> {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5">
              {activeTab === "info" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-bg-elevated/50 border border-border-card/50">
                    <p className="text-xs text-text-muted mb-2">{selectedAuto.descricao}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div><span className="text-[10px] text-text-muted block">Trigger</span><span className="text-xs text-text font-medium">{triggerCfg.label}</span></div>
                      <div><span className="text-[10px] text-text-muted block">Integracao</span><IntegracaoBadge integracao={selectedAuto.integracao} /></div>
                      <div><span className="text-[10px] text-text-muted block">Responsavel</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {resp && <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ background: resp.cor + "20", color: resp.cor }}>{resp.avatar}</div>}
                          <span className="text-xs text-text">{resp?.nome || "-"}</span>
                        </div>
                      </div>
                      <div><span className="text-[10px] text-text-muted block">Criada em</span><span className="text-xs text-text">{format(new Date(selectedAuto.created_at), "dd/MM/yyyy")}</span></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Acoes configuradas</p>
                    <div className="space-y-1.5">
                      {selectedAuto.acoes.map((a, i) => {
                        const cfg = ACAO_TYPES.find(at => at.key === a);
                        return cfg ? (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: cfg.bg }}>
                              <Zap size={10} style={{ color: cfg.color }} />
                            </div>
                            <span className="text-xs text-text">{cfg.label}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => toggleAutomacao(selectedAuto.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-white/5 text-text-muted hover:text-text transition-colors">
                      {selectedAuto.status === "ativa" ? <><ToggleRight size={14} className="text-primary" /> Pausar</> : <><ToggleLeft size={14} /> Ativar</>}
                    </button>
                    <button onClick={() => duplicateAutomacao(selectedAuto.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-white/5 text-text-muted hover:text-text transition-colors">
                      <Copy size={14} /> Duplicar
                    </button>
                    <button onClick={() => showConfirm({ title: "Excluir?", description: selectedAuto.nome, onConfirm: () => deleteAutomacao(selectedAuto.id) })}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "workflow" && <WorkflowBuilder autoId={selectedAuto.id} />}

              {activeTab === "logs" && (
                <div className="space-y-2">
                  {autoLogs.length === 0 ? (
                    <p className="text-xs text-text-muted text-center py-8">Nenhum log registrado</p>
                  ) : autoLogs.map(log => (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/50 border border-border-card/50">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${log.status === "sucesso" ? "bg-emerald-400" : log.status === "erro" ? "bg-red-400" : "bg-amber-400"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text">{log.detalhes}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-text-muted">{format(log.timestamp, "dd/MM HH:mm")}</span>
                          <span className="text-[9px] text-text-muted">{log.duracao}s</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "stats" && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Execucoes", value: selectedAuto.execucoes, color: "#3b82f6" },
                    { label: "Taxa Sucesso", value: `${selectedAuto.taxaSucesso}%`, color: "#22c55e" },
                    { label: "Tempo Medio", value: `${selectedAuto.tempoMedio}s`, color: "#f59e0b" },
                    { label: "Erros", value: Math.round(selectedAuto.execucoes * (1 - selectedAuto.taxaSucesso / 100)), color: "#ef4444" },
                  ].map(s => (
                    <div key={s.label} className="p-3 rounded-xl bg-bg-elevated/50 border border-border-card/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{s.label}</p>
                      <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
