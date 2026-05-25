import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, MessageCircle, Building2 } from "lucide-react";
import useCrmStore from "../../../store/crmStore";

const schema = z.object({
  nome: z.string().min(1, "Nome obrigatorio"),
  empresa: z.string().optional().default(""),
  telefone: z.string().optional().default(""),
  email: z.string().email("Email invalido").or(z.literal("")).optional(),
  whatsapp: z.string().optional().default(""),
  cpfCnpj: z.string().optional().default(""),
  status: z.enum(["lead", "contato", "proposta", "negociacao", "fechado", "perdido"]).default("lead"),
  tipo: z.enum(["avulso", "mensal", "pacote", "projeto", "retainer"]).default("avulso"),
  receita: z.coerce.number().min(0).default(0),
  tags: z.string().optional().default(""),
  observacoes: z.string().optional().default(""),
});

export default function NewClientDialog() {
  const { dialogOpen, closeDialog, addClient, editId, clients, updateClient } = useCrmStore();

  const editData = editId ? clients.find(c => c.id === editId) : null;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: editData ? { ...editData, tags: (editData.tags || []).join(", "), receita: editData.receita || 0 } : { nome: "", empresa: "", telefone: "", email: "", whatsapp: "", cpfCnpj: "", status: "lead", tipo: "avulso", receita: 0, tags: "", observacoes: "" },
  });

  const onSubmit = (data) => {
    const payload = { ...data, tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [] };
    if (editId) {
      updateClient(editId, payload);
    } else {
      addClient(payload);
    }
    reset();
    closeDialog();
  };

  return (
    <AnimatePresence>
      {dialogOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeDialog}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-text">{editId ? "Editar Cliente" : "Novo Cliente"}</h2>
              <button onClick={closeDialog} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="floating-label"><input type="text" placeholder=" " {...register("nome")} /><label>Nome *</label></div>
                {errors.nome && <p className="text-[10px] text-danger mt-1">{errors.nome.message}</p>}
              </div>
              <div className="floating-label"><input type="text" placeholder=" " {...register("empresa")} className="has-icon" /><Building2 size={14} className="input-icon" /><label>Empresa</label></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="floating-label"><input type="text" placeholder=" " {...register("telefone")} className="has-icon" /><Phone size={14} className="input-icon" /><label>Telefone</label></div>
                <div className="floating-label"><input type="text" placeholder=" " {...register("whatsapp")} className="has-icon" /><MessageCircle size={14} className="input-icon" /><label>WhatsApp</label></div>
              </div>
              <div className="floating-label"><input type="email" placeholder=" " {...register("email")} className="has-icon" /><Mail size={14} className="input-icon" /><label>Email</label></div>
              <div className="floating-label"><input type="text" placeholder=" " {...register("cpfCnpj")} /><label>CPF/CNPJ</label></div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="field-label">Status</span><select {...register("status")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  <option value="lead">Lead</option><option value="contato">Contato</option><option value="proposta">Proposta</option><option value="negociacao">Negociacao</option><option value="fechado">Fechado</option><option value="perdido">Perdido</option>
                </select></div>
                <div><span className="field-label">Tipo</span><select {...register("tipo")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  <option value="avulso">Avulso</option><option value="mensal">Mensal</option><option value="pacote">Pacote</option><option value="projeto">Projeto</option><option value="retainer">Retainer</option>
                </select></div>
              </div>
              <div className="floating-label"><input type="number" placeholder=" " {...register("receita")} /><label>Receita estimada (R$)</label></div>
              <div className="floating-label"><input type="text" placeholder=" " {...register("tags")} /><label>Tags (separar por virgula)</label></div>
              <div className="floating-label"><textarea rows={2} placeholder=" " {...register("observacoes")} /><label>Observacoes</label></div>
              <div className="flex gap-3">
                <button type="button" onClick={closeDialog} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted hover:text-text hover:bg-white/10 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">{editId ? "Salvar" : "Adicionar"}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
