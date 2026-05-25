import { motion } from "framer-motion";
import { format } from "date-fns";
import { Bell, Phone, DollarSign, BellOff, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import useAgendaStore, { RESPONSAVEIS } from "../../../store/agendaStore";

const tipoIcons = { followup: Phone, pagamento: DollarSign, lembrete: Bell };

export default function ReminderPanel() {
  const { reminders, toggleReminder, deleteReminder, addReminder } = useAgendaStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTipo, setNewTipo] = useState("lembrete");

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addReminder({ titulo: newTitle, tipo: newTipo, horario: format(new Date(), "yyyy-MM-dd'T'HH:mm"), responsavel: "v1" });
    setNewTitle("");
    setShowAdd(false);
  };

  const sorted = [...reminders].sort((a, b) => (a.ativo === b.ativo ? 0 : a.ativo ? -1 : 1));

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text">Lembretes</h3>
        <button onClick={() => setShowAdd(!showAdd)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-primary transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {showAdd && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          className="mb-3 p-3 rounded-lg bg-bg-elevated/50 border border-border-card/50 space-y-2">
          <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Titulo do lembrete..."
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2 text-xs text-text placeholder-text-muted outline-none focus:border-primary" />
          <div className="flex gap-2">
            <select value={newTipo} onChange={e => setNewTipo(e.target.value)}
              className="flex-1 bg-bg-input border border-border-card rounded-lg px-3 py-1.5 text-xs text-text outline-none focus:border-primary">
              <option value="lembrete">Lembrete</option><option value="followup">Follow-up</option><option value="pagamento">Pagamento</option>
            </select>
            <button onClick={handleAdd} className="px-3 py-1.5 rounded-lg text-xs font-semibold btn-primary">Adicionar</button>
            <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted"><X size={12} /></button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {sorted.length === 0 ? (
          <p className="text-xs text-text-muted text-center py-6">Nenhum lembrete</p>
        ) : sorted.map(rem => {
          const Icon = tipoIcons[rem.tipo] || Bell;
          const resp = RESPONSAVEIS.find(r => r.id === rem.responsavel) || RESPONSAVEIS[0];
          const date = rem.horario ? new Date(rem.horario) : null;

          return (
            <motion.div key={rem.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={`flex items-center gap-3 p-2.5 rounded-lg group transition-all ${rem.ativo ? "bg-bg-elevated/50" : "bg-bg-elevated/20 opacity-50"}`}>
              <button onClick={() => toggleReminder(rem.id)} className="flex-shrink-0">
                {rem.ativo ? <Bell size={14} className="text-primary" /> : <BellOff size={14} className="text-text-muted" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${rem.ativo ? "text-text" : "text-text-muted line-through"}`}>{rem.titulo}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-text-muted flex items-center gap-1"><Icon size={8} />{rem.tipo}</span>
                  {date && <span className="text-[9px] text-text-muted">{format(date, "dd/MM HH:mm")}</span>}
                </div>
              </div>
              <button onClick={() => deleteReminder(rem.id)} className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-danger/10 text-text-muted hover:text-danger transition-all">
                <Trash2 size={10} />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
