import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Users, User, Tag, Calendar, Phone, FileText, Bell, Repeat, Plus, Check, ArrowRight, Building2, Link2 } from "lucide-react";
import { format } from "date-fns";
import useAgendaStore, { CATEGORIAS_EVENTO, STATUS_EVENTO, RESPONSAVEIS, RECURRENCIA } from "../../../store/agendaStore";
import { PriorityBadge, EventCategoryBadge, EventStatusBadge } from "../ui/Badges";

export default function EventDrawer() {
  const { drawerOpen, selectedEvent, closeDrawer, updateEvent, deleteEvent, showConfirm } = useAgendaStore();
  const [tab, setTab] = useState("info");
  const [newNote, setNote] = useState("");

  if (!selectedEvent) return null;
  const evt = selectedEvent;
  const catCfg = CATEGORIAS_EVENTO.find(c => c.key === evt.categoria) || CATEGORIAS_EVENTO[9];
  const resp = RESPONSAVEIS.find(r => r.id === evt.responsavel) || RESPONSAVEIS[0];
  const recCfg = RECURRENCIA.find(r => r.key === evt.recorrencia) || RECURRENCIA[0];

  const handleStatusChange = (newStatus) => updateEvent(evt.id, { status: newStatus });

  const tabs = [
    { key: "info", label: "Info" },
    { key: "relacionamentos", label: "Relacionamentos" },
    { key: "timeline", label: "Timeline" },
    { key: "notificacoes", label: "Notificacoes" },
  ];

  const startDate = evt.start ? new Date(evt.start) : null;
  const endDate = evt.end ? new Date(evt.end) : null;

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={closeDrawer} />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg-card border-l border-border-card z-50 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border-card flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-card flex items-center justify-center text-sm"
                  style={{ color: catCfg.color }}>
                  <span className="w-3 h-3 rounded-full" style={{ background: catCfg.color }} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text">{evt.title}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <EventCategoryBadge categoria={evt.categoria} />
                    <EventStatusBadge status={evt.status} />
                  </div>
                </div>
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors"><X size={16} /></button>
            </div>

            <div className="px-4 py-3 border-b border-border-card flex-shrink-0">
              <div className="flex gap-1 overflow-x-auto">
                {STATUS_EVENTO.map(s => (
                  <button key={s.key} onClick={() => handleStatusChange(s.key)} disabled={evt.status === s.key}
                    className={`px-2.5 py-1 rounded-md text-[9px] font-semibold transition-all whitespace-nowrap ${evt.status === s.key ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                    style={evt.status === s.key ? { background: s.bg, color: s.color } : {}}>
                    {s.label}
                  </button>
                ))}
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
                      { icon: Calendar, label: "Data", value: startDate ? format(startDate, "dd/MM/yyyy") : "—" },
                      { icon: Clock, label: "Horario", value: startDate ? `${format(startDate, "HH:mm")} - ${endDate ? format(endDate, "HH:mm") : "?"}` : "—" },
                      { icon: MapPin, label: "Local", value: evt.local },
                      { icon: User, label: "Responsavel", value: resp.nome },
                      { icon: Repeat, label: "Recorrencia", value: recCfg.label },
                    ].filter(i => i.value).map(item => (
                      <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-elevated/50">
                        <item.icon size={14} className="text-text-muted flex-shrink-0" />
                        <div><p className="text-[10px] text-text-muted uppercase tracking-wider">{item.label}</p><p className="text-sm text-text">{item.value}</p></div>
                      </div>
                    ))}
                    {evt.participantes && evt.participantes.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Participantes</p>
                        <div className="flex flex-wrap gap-2">
                          {evt.participantes.map(pId => {
                            const p = RESPONSAVEIS.find(r => r.id === pId);
                            return p ? (
                              <div key={pId} className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: p.cor + "20", color: p.cor }}>{p.avatar}</div>
                                <span className="text-[10px] text-text-secondary">{p.nome.split(" ")[0]}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    {evt.description && (
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Descricao</p>
                        <p className="text-xs text-text-secondary">{evt.description}</p>
                      </div>
                    )}
                    {evt.observacoes && (
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Observacoes</p>
                        <p className="text-xs text-text-secondary">{evt.observacoes}</p>
                      </div>
                    )}
                    <button onClick={() => showConfirm({ title: "Excluir evento", description: `Remover "${evt.title}"?`, onConfirm: () => deleteEvent(evt.id) })}
                      className="w-full py-2 rounded-xl text-xs font-semibold bg-danger/10 text-danger hover:bg-danger/20 transition-colors">
                      Excluir Evento
                    </button>
                  </motion.div>
                )}

                {tab === "relacionamentos" && (
                  <motion.div key="relacionamentos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    {evt.cliente && (
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Cliente Relacionado</p>
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-primary" />
                          <span className="text-sm text-text font-medium">{evt.cliente}</span>
                        </div>
                      </div>
                    )}
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Responsavel</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: resp.cor + "20", color: resp.cor }}>{resp.avatar}</div>
                        <div>
                          <p className="text-sm text-text font-medium">{resp.nome}</p>
                          <p className="text-[10px] text-text-muted">{resp.cargo}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Categoria</p>
                      <div className="flex items-center gap-2">
                        <Tag size={14} style={{ color: catCfg.color }} />
                        <span className="text-sm text-text font-medium">{catCfg.label}</span>
                      </div>
                    </div>
                    {evt.recorrencia && evt.recorrencia !== "nenhuma" && (
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Recorrencia</p>
                        <div className="flex items-center gap-2">
                          <Repeat size={14} className="text-text-muted" />
                          <span className="text-sm text-text font-medium">{recCfg.label}</span>
                        </div>
                      </div>
                    )}
                    {!evt.cliente && <p className="text-xs text-text-muted text-center py-4">Nenhum relacionamento vinculado</p>}
                  </motion.div>
                )}

                {tab === "timeline" && (
                  <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border-card" />
                      {[
                        { data: evt.start, desc: `Evento ${evt.status === "confirmado" ? "confirmado" : "tentativo"}`, tipo: "confirmado" },
                        { data: evt.start, desc: "Evento criado", tipo: "criacao" },
                      ].map((entry, i) => {
                        const Icon = entry.tipo === "confirmado" ? Check : FileText;
                        return (
                          <div key={i} className="relative flex items-start gap-3 pb-4">
                            <div className="w-6 h-6 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center flex-shrink-0 z-10">
                              <Icon size={10} className="text-text-muted" />
                            </div>
                            <div>
                              <p className="text-xs text-text font-medium">{entry.desc}</p>
                              <p className="text-[10px] text-text-muted">{entry.data ? format(new Date(entry.data), "dd/MM/yyyy HH:mm") : "—"}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newNote} onChange={e => setNote(e.target.value)} placeholder="Adicionar nota..."
                        onKeyDown={e => { if (e.key === "Enter" && newNote.trim()) { updateEvent(evt.id, { observacoes: (evt.observacoes ? evt.observacoes + "\n" : "") + newNote.trim() }); setNote(""); } }}
                        className="flex-1 bg-bg-input border border-border-card rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary" />
                      <button onClick={() => { if (newNote.trim()) { updateEvent(evt.id, { observacoes: (evt.observacoes ? evt.observacoes + "\n" : "") + newNote.trim() }); setNote(""); } }}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Plus size={14} /></button>
                    </div>
                  </motion.div>
                )}

                {tab === "notificacoes" && (
                  <motion.div key="notificacoes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Lembretes</p>
                      {(evt.lembretes || []).length > 0 ? evt.lembretes.map((l, i) => (
                        <div key={i} className="flex items-center gap-2 py-1.5">
                          <Bell size={12} className={l.ativo ? "text-primary" : "text-text-muted"} />
                          <span className="text-xs text-text">{l.tipo === "antes_15min" ? "15 min antes" : l.tipo === "antes_30min" ? "30 min antes" : l.tipo === "antes_1h" ? "1h antes" : l.tipo === "no_dia" ? "No dia" : l.tipo}</span>
                          <span className={`w-2 h-2 rounded-full ${l.ativo ? "bg-primary" : "bg-text-muted"}`} />
                        </div>
                      )) : <p className="text-xs text-text-muted">Nenhum lembrete configurado</p>}
                    </div>
                    {evt.recorrencia && evt.recorrencia !== "nenhuma" && (
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Recorrencia</p>
                        <div className="flex items-center gap-2">
                          <Repeat size={14} className="text-primary" />
                          <span className="text-sm text-text">{recCfg.label}</span>
                        </div>
                      </div>
                    )}
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
