import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, Users } from "lucide-react";
import useAgendaStore, { CATEGORIAS_EVENTO, STATUS_EVENTO, PRIORIDADES, RECURRENCIA, RESPONSAVEIS } from "../../../store/agendaStore";
import { format } from "date-fns";

const schema = z.object({
  title: z.string().min(1, "Titulo obrigatorio"),
  description: z.string().optional().default(""),
  start: z.string().min(1, "Data/hora obrigatoria"),
  end: z.string().optional().default(""),
  categoria: z.string().default("reuniao"),
  prioridade: z.string().default("media"),
  status: z.string().default("confirmado"),
  responsavel: z.string().default("v1"),
  local: z.string().optional().default(""),
  cliente: z.string().optional().default(""),
  recorrencia: z.string().default("nenhuma"),
  observacoes: z.string().optional().default(""),
});

function emptyForm() {
  const now = new Date();
  return {
    title: "", description: "",
    start: format(setMinutes(setHours(now, 9), 0), "yyyy-MM-dd'T'HH:mm"),
    end: format(setMinutes(setHours(addHours(now, 1), 0), 0), "yyyy-MM-dd'T'HH:mm"),
    categoria: "reuniao", prioridade: "media", status: "confirmado",
    responsavel: "v1", local: "", cliente: "", recorrencia: "nenhuma", observacoes: "",
  };
}

function setHours(d, h) { const r = new Date(d); r.setHours(h); return r; }
function setMinutes(d, m) { const r = new Date(d); r.setMinutes(m); return r; }
function addHours(d, h) { const r = new Date(d); r.setHours(r.getHours() + h); return r; }

export default function NewEventDialog() {
  const { eventDialogOpen, closeEventDialog, addEvent, updateEvent, editId, events } = useAgendaStore();
  const editData = editId ? events.find(e => e.id === editId) : null;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: editData ? { ...editData } : emptyForm(),
  });

  const onSubmit = (data) => {
    const payload = { ...data, participantes: [], lembretes: [], cor: CATEGORIAS_EVENTO.find(c => c.key === data.categoria)?.color || "#3b82f6" };
    if (!payload.end) payload.end = format(addHours(new Date(payload.start), 1), "yyyy-MM-dd'T'HH:mm");
    if (editId) { updateEvent(editId, payload); } else { addEvent(payload); }
    reset();
    closeEventDialog();
  };

  const handleClose = () => { reset(); closeEventDialog(); };

  return (
    <AnimatePresence>
      {eventDialogOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-text">{editId ? "Editar" : "Novo"} Evento</h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="floating-label"><input type="text" placeholder=" " {...register("title")} className="has-icon" /><Calendar size={14} className="input-icon" /><label>Titulo *</label></div>
                {errors.title && <p className="text-[10px] text-danger mt-1">{errors.title.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="field-label">Inicio</span><input type="datetime-local" {...register("start")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary" /></div>
                <div><span className="field-label">Fim</span><input type="datetime-local" {...register("end")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="field-label">Categoria</span><select {...register("categoria")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {CATEGORIAS_EVENTO.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select></div>
                <div><span className="field-label">Prioridade</span><select {...register("prioridade")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {PRIORIDADES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="field-label">Responsavel</span><select {...register("responsavel")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {RESPONSAVEIS.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                </select></div>
                <div><span className="field-label">Status</span><select {...register("status")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {STATUS_EVENTO.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select></div>
              </div>
              <div className="floating-label"><input type="text" placeholder=" " {...register("local")} className="has-icon" /><MapPin size={14} className="input-icon" /><label>Local</label></div>
              <div className="floating-label"><input type="text" placeholder=" " {...register("cliente")} className="has-icon" /><Users size={14} className="input-icon" /><label>Cliente</label></div>
              <div><span className="field-label">Recorrencia</span><select {...register("recorrencia")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                {RECURRENCIA.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select></div>
              <div className="floating-label"><textarea rows={2} placeholder=" " {...register("observacoes")} /><label>Observacoes</label></div>
              <div className="flex gap-3">
                <button type="button" onClick={handleClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted hover:text-text hover:bg-white/10 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">{editId ? "Salvar" : "Criar Evento"}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
