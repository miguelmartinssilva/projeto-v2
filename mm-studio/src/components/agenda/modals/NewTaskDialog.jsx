import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckSquare, Tag, Users } from "lucide-react";
import useAgendaStore, { CATEGORIAS_TAREFA, PRIORIDADES, STATUS_TAREFA, RESPONSAVEIS } from "../../../store/agendaStore";
import { format } from "date-fns";

const schema = z.object({
  titulo: z.string().min(1, "Titulo obrigatorio"),
  descricao: z.string().optional().default(""),
  categoria: z.string().default("outro"),
  prioridade: z.string().default("media"),
  status: z.string().default("pendente"),
  responsavel: z.string().default("v1"),
  cliente: z.string().optional().default(""),
  prazo: z.string().optional().default(""),
  tags: z.string().optional().default(""),
  observacoes: z.string().optional().default(""),
});

function emptyForm() {
  return {
    titulo: "", descricao: "", categoria: "outro", prioridade: "media", status: "pendente",
    responsavel: "v1", cliente: "", prazo: format(addDays(new Date(), 3), "yyyy-MM-dd'T'HH:mm"),
    tags: "", observacoes: "",
  };
}

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

export default function NewTaskDialog() {
  const { taskDialogOpen, closeTaskDialog, addTask, updateTask, editId, tasks } = useAgendaStore();
  const editData = editId ? tasks.find(t => t.id === editId) : null;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: editData ? { ...editData, tags: (editData.tags || []).join(", ") } : emptyForm(),
  });

  const onSubmit = (data) => {
    const payload = { ...data, tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [], checklist: [] };
    if (editId) { updateTask(editId, payload); } else { addTask(payload); }
    reset();
    closeTaskDialog();
  };

  const handleClose = () => { reset(); closeTaskDialog(); };

  return (
    <AnimatePresence>
      {taskDialogOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-text">{editId ? "Editar" : "Nova"} Tarefa</h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="floating-label"><input type="text" placeholder=" " {...register("titulo")} className="has-icon" /><CheckSquare size={14} className="input-icon" /><label>Titulo *</label></div>
                {errors.titulo && <p className="text-[10px] text-danger mt-1">{errors.titulo.message}</p>}
              </div>
              <div className="floating-label"><textarea rows={2} placeholder=" " {...register("descricao")} /><label>Descricao</label></div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="field-label">Categoria</span><select {...register("categoria")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {CATEGORIAS_TAREFA.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
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
                  {STATUS_TAREFA.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select></div>
              </div>
              <div className="floating-label"><input type="text" placeholder=" " {...register("cliente")} className="has-icon" /><Users size={14} className="input-icon" /><label>Cliente</label></div>
              <div><span className="field-label">Prazo</span><input type="datetime-local" {...register("prazo")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary" /></div>
              <div className="floating-label"><input type="text" placeholder=" " {...register("tags")} className="has-icon" /><Tag size={14} className="input-icon" /><label>Tags (separar por virgula)</label></div>
              <div className="floating-label"><textarea rows={2} placeholder=" " {...register("observacoes")} /><label>Observacoes</label></div>
              <div className="flex gap-3">
                <button type="button" onClick={handleClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted hover:text-text hover:bg-white/10 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">{editId ? "Salvar" : "Criar Tarefa"}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
