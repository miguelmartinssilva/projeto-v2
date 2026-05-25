import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, Building2, DollarSign, User } from "lucide-react";
import useComercialStore, { PIPELINE_STAGES, PRIORITIES, VENDEDORES } from "../../../store/comercialStore";

const schema = z.object({
  cliente: z.string().min(1, "Nome obrigatorio"),
  empresa: z.string().optional().default(""),
  telefone: z.string().optional().default(""),
  email: z.string().email("Email invalido").or(z.literal("")).optional(),
  responsavel: z.string().default("v1"),
  valor: z.coerce.number().min(0).default(0),
  stage: z.string().default("novo_lead"),
  prioridade: z.string().default("media"),
  tags: z.string().optional().default(""),
  probabilidade: z.coerce.number().min(0).max(100).default(10),
  proximaAcao: z.string().optional().default(""),
  observacoes: z.string().optional().default(""),
});

export default function NewDealDialog() {
  const { newDealDialogOpen, closeNewDealDialog, addDeal, updateDeal, editId, deals } = useComercialStore();
  const editData = editId ? deals.find(d => d.id === editId) : null;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: editData ? { ...editData, tags: (editData.tags || []).join(", "), probabilidade: editData.probabilidade ?? 10 } : { cliente: "", empresa: "", telefone: "", email: "", responsavel: "v1", valor: 0, stage: "novo_lead", prioridade: "media", tags: "", probabilidade: 10, proximaAcao: "", observacoes: "" },
  });

  const onSubmit = (data) => {
    const payload = { ...data, tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [] };
    if (editId) { updateDeal(editId, payload); } else { addDeal(payload); }
    reset(); closeNewDealDialog();
  };

  return (
    <AnimatePresence>
      {newDealDialogOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeNewDealDialog}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-text">{editId ? "Editar Negociacao" : "Nova Negociacao"}</h2>
              <button onClick={closeNewDealDialog} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="floating-label"><input type="text" placeholder=" " {...register("cliente")} className="has-icon" /><User size={14} className="input-icon" /><label>Cliente *</label></div>
                {errors.cliente && <p className="text-[10px] text-danger mt-1">{errors.cliente.message}</p>}
              </div>
              <div className="floating-label"><input type="text" placeholder=" " {...register("empresa")} className="has-icon" /><Building2 size={14} className="input-icon" /><label>Empresa</label></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="floating-label"><input type="text" placeholder=" " {...register("telefone")} className="has-icon" /><Phone size={14} className="input-icon" /><label>Telefone</label></div>
                <div className="floating-label"><input type="email" placeholder=" " {...register("email")} className="has-icon" /><Mail size={14} className="input-icon" /><label>Email</label></div>
              </div>
              <div className="floating-label"><input type="number" placeholder=" " {...register("valor")} className="has-icon" /><DollarSign size={14} className="input-icon" /><label>Valor estimado (R$)</label></div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="field-label">Etapa</span><select {...register("stage")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {PIPELINE_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select></div>
                <div><span className="field-label">Prioridade</span><select {...register("prioridade")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="field-label">Responsavel</span><select {...register("responsavel")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {VENDEDORES.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
                </select></div>
                <div className="floating-label"><input type="number" placeholder=" " {...register("probabilidade")} /><label>Probabilidade (%)</label></div>
              </div>
              <div className="floating-label"><input type="text" placeholder=" " {...register("proximaAcao")} /><label>Proxima acao</label></div>
              <div className="floating-label"><input type="text" placeholder=" " {...register("tags")} /><label>Tags (separar por virgula)</label></div>
              <div className="floating-label"><textarea rows={2} placeholder=" " {...register("observacoes")} /><label>Observacoes</label></div>
              <div className="flex gap-3">
                <button type="button" onClick={closeNewDealDialog} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted hover:text-text hover:bg-white/10 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">{editId ? "Salvar" : "Criar Negociacao"}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
