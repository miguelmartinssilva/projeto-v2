import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, FileText, User } from "lucide-react";
import useAutomacoesStore, { TRIGGER_TYPES, ACAO_TYPES, CONDICAO_TYPES, RESPONSAVEIS } from "../../../store/automacoesStore";

const schema = z.object({
  nome: z.string().min(1, "Nome obrigatorio"),
  descricao: z.string().min(1, "Descricao obrigatoria"),
  trigger: z.string().min(1, "Trigger obrigatorio"),
  integracao: z.string().default("whatsapp"),
  responsavel: z.string().default("v1"),
});

function emptyForm() {
  return { nome: "", descricao: "", trigger: "novo_cliente", integracao: "whatsapp", responsavel: "v1" };
}

export default function NewAutomationDialog() {
  const { dialogOpen, closeDialog, addAutomacao } = useAutomacoesStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: emptyForm(),
  });

  const onSubmit = (data) => {
    addAutomacao({ ...data, condicoes: [], acoes: ["notificacao"], status: "pausada" });
    reset();
  };

  const handleClose = () => { reset(); closeDialog(); };

  return (
    <AnimatePresence>
      {dialogOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-text">Nova Automacao</h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="floating-label"><input type="text" placeholder=" " {...register("nome")} className="has-icon" /><Zap size={14} className="input-icon" /><label>Nome *</label></div>
                {errors.nome && <p className="text-[10px] text-danger mt-1">{errors.nome.message}</p>}
              </div>
              <div className="floating-label"><textarea rows={2} placeholder=" " {...register("descricao")} /><label>Descricao *</label></div>
              {errors.descricao && <p className="text-[10px] text-danger mt-1">{errors.descricao.message}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="field-label">Trigger</span>
                  <select {...register("trigger")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                    {TRIGGER_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <span className="field-label">Integracao</span>
                  <select {...register("integracao")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="webhooks">Webhook</option>
                    <option value="google_calendar">Google Calendar</option>
                  </select>
                </div>
              </div>
              <div>
                <span className="field-label">Responsavel</span>
                <select {...register("responsavel")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {RESPONSAVEIS.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={handleClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted hover:text-text hover:bg-white/10 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">Criar Automacao</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
