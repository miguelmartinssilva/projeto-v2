import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Calendar, CreditCard, User, Tag, Building2, FileText, CheckCircle, Clock, AlertCircle, ArrowRight, Plus } from "lucide-react";
import useFinanceiroStore, { CATEGORIAS, CONTAS, STATUS_CONFIG, TIPO_CONFIG } from "../../../store/financeiroStore";
import { TipoBadge, StatusBadge, CategoryBadge } from "../ui/Badges";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

const statusIcons = { pago: CheckCircle, pendente: Clock, atrasado: AlertCircle, cancelado: X };

export default function FinanceDrawer() {
  const { drawerOpen, selectedMov, closeDrawer, updateMovimentacao, markAsPaid } = useFinanceiroStore();
  const [tab, setTab] = useState("info");
  const [newNote, setNote] = useState("");

  if (!selectedMov) return null;
  const mov = selectedMov;
  const StatusIcon = statusIcons[mov.status] || Clock;
  const catList = CATEGORIAS[mov.tipo] || CATEGORIAS.entrada;
  const catInfo = catList.find(c => c.key === mov.categoria) || { label: mov.categoria, color: "#94a3b8" };
  const contaInfo = CONTAS.find(c => c.key === mov.conta) || { label: mov.conta, color: "#94a3b8" };

  const tabs = [
    { key: "info", label: "Info" },
    { key: "historico", label: "Historico" },
    { key: "relacionamentos", label: "Relacionamentos" },
    { key: "anotacoes", label: "Anotacoes" },
  ];

  const handleStatusChange = (newStatus) => {
    const update = { status: newStatus };
    if (newStatus === "pago") update.dataPagamento = new Date().toISOString().slice(0, 10);
    updateMovimentacao(mov.id, update);
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={closeDrawer} />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg-card border-l border-border-card z-50 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border-card flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border-card flex items-center justify-center text-lg"
                  style={{ color: mov.tipo === "entrada" ? "#22c55e" : "#ff4d6d" }}>
                  {mov.tipo === "entrada" ? "↑" : "↓"}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text">{mov.descricao}</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <TipoBadge tipo={mov.tipo} size="sm" />
                    <StatusBadge status={mov.status} size="sm" />
                  </div>
                </div>
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors"><X size={16} /></button>
            </div>

            <div className="px-4 py-3 border-b border-border-card flex-shrink-0">
              <div className="flex gap-1 overflow-x-auto">
                {["pago", "pendente", "atrasado", "cancelado"].map(s => {
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <button key={s} onClick={() => handleStatusChange(s)} disabled={mov.status === s}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-semibold transition-all whitespace-nowrap ${mov.status === s ? "" : "bg-white/5 text-text-muted hover:text-text"}`}
                      style={mov.status === s ? { background: cfg.bg, color: cfg.color } : {}}>
                      {cfg.label}
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
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Valor</p>
                        <p className="text-lg font-bold" style={{ color: mov.tipo === "entrada" ? "#22c55e" : "#ff4d6d" }}>
                          {mov.tipo === "entrada" ? "+" : "-"}{fmt(mov.valor)}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Categoria</p>
                        <CategoryBadge categoria={mov.categoria} tipo={mov.tipo} />
                      </div>
                    </div>
                    {[
                      { icon: User, label: "Responsavel", value: mov.responsavel },
                      { icon: Building2, label: "Conta", value: contaInfo.label },
                      { icon: CreditCard, label: "Metodo Pagamento", value: mov.metodoPagamento },
                      { icon: Calendar, label: "Data Criacao", value: mov.dataCriacao ? new Date(mov.dataCriacao + "T12:00:00").toLocaleDateString("pt-BR") : "—" },
                      { icon: Calendar, label: "Data Vencimento", value: mov.dataVencimento ? new Date(mov.dataVencimento + "T12:00:00").toLocaleDateString("pt-BR") : "—" },
                      { icon: CheckCircle, label: "Data Pagamento", value: mov.dataPagamento ? new Date(mov.dataPagamento + "T12:00:00").toLocaleDateString("pt-BR") : "Pendente" },
                    ].filter(item => item.value && item.value !== "—").map(item => (
                      <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-bg-elevated/50">
                        <item.icon size={14} className="text-text-muted flex-shrink-0" />
                        <div><p className="text-[10px] text-text-muted uppercase tracking-wider">{item.label}</p><p className="text-sm text-text">{item.value}</p></div>
                      </div>
                    ))}
                    {mov.observacoes && (
                      <div className="p-3 rounded-lg bg-bg-elevated/50">
                        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Observacoes</p>
                        <p className="text-xs text-text-secondary">{mov.observacoes}</p>
                      </div>
                    )}
                    {mov.status !== "pago" && (
                      <button onClick={() => markAsPaid(mov.id)}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors flex items-center justify-center gap-2">
                        <CheckCircle size={14} /> Marcar como Pago
                      </button>
                    )}
                  </motion.div>
                )}

                {tab === "historico" && (
                  <motion.div key="historico" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border-card" />
                      {[
                        { data: mov.dataPagamento, desc: `Pagamento ${mov.status === "pago" ? "confirmado" : "pendente"}`, tipo: mov.status === "pago" ? "pago" : "pendente" },
                        { data: mov.dataVencimento, desc: "Vencimento programado", tipo: "vencimento" },
                        { data: mov.dataCriacao, desc: "Movimentacao criada", tipo: "criacao" },
                      ].filter(e => e.data).map((entry, i) => {
                        const iconMap = { pago: CheckCircle, pendente: Clock, vencimento: Calendar, criacao: FileText };
                        const Icon = iconMap[entry.tipo] || FileText;
                        return (
                          <div key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                            <div className="w-6 h-6 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center flex-shrink-0 z-10">
                              <Icon size={10} className="text-text-muted" />
                            </div>
                            <div>
                              <p className="text-xs text-text font-medium">{entry.desc}</p>
                              <p className="text-[10px] text-text-muted">{new Date(entry.data + "T12:00:00").toLocaleDateString("pt-BR")}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {tab === "relacionamentos" && (
                  <motion.div key="relacionamentos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Conta</p>
                      <div className="flex items-center gap-2">
                        <Building2 size={14} style={{ color: contaInfo.color }} />
                        <span className="text-sm text-text font-medium">{contaInfo.label}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Categoria</p>
                      <div className="flex items-center gap-2">
                        <Tag size={14} style={{ color: catInfo.color }} />
                        <span className="text-sm text-text font-medium">{catInfo.label}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Responsavel</p>
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-text-muted" />
                        <span className="text-sm text-text font-medium">{mov.responsavel || "N/A"}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {tab === "anotacoes" && (
                  <motion.div key="anotacoes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                    <div className="p-3 rounded-lg bg-bg-elevated/50">
                      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Observacoes</p>
                      <p className="text-sm text-text">{mov.observacoes || "Nenhuma anotacao"}</p>
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={newNote} onChange={e => setNote(e.target.value)} placeholder="Adicionar nota..."
                        onKeyDown={e => { if (e.key === "Enter" && newNote.trim()) { updateMovimentacao(mov.id, { observacoes: (mov.observacoes ? mov.observacoes + "\n" : "") + newNote.trim() }); setNote(""); } }}
                        className="flex-1 bg-bg-input border border-border-card rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary" />
                      <button onClick={() => { if (newNote.trim()) { updateMovimentacao(mov.id, { observacoes: (mov.observacoes ? mov.observacoes + "\n" : "") + newNote.trim() }); setNote(""); } }}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Plus size={14} /></button>
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
