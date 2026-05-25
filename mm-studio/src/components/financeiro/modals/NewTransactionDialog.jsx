import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, FileText, User } from "lucide-react";
import useFinanceiroStore, { CATEGORIAS, CONTAS } from "../../../store/financeiroStore";

const entradaSchema = z.object({
  descricao: z.string().min(1, "Descricao obrigatoria"),
  valor: z.coerce.number().min(0.01, "Valor deve ser positivo"),
  categoria: z.string().default("design"),
  conta: z.string().default("banco"),
  metodoPagamento: z.string().default("PIX"),
  responsavel: z.string().default("Miguel"),
  dataVencimento: z.string().default(""),
  observacoes: z.string().optional().default(""),
  status: z.string().default("pendente"),
});

const saidaSchema = z.object({
  descricao: z.string().min(1, "Descricao obrigatoria"),
  valor: z.coerce.number().min(0.01, "Valor deve ser positivo"),
  categoria: z.string().default("outros"),
  conta: z.string().default("banco"),
  metodoPagamento: z.string().default("PIX"),
  responsavel: z.string().default("Miguel"),
  dataVencimento: z.string().default(""),
  observacoes: z.string().optional().default(""),
  status: z.string().default("pendente"),
});

function emptyForm(tipo) {
  return { descricao: "", valor: "", categoria: tipo === "entrada" ? "design" : "outros", conta: "banco", metodoPagamento: "PIX", responsavel: "Miguel", dataVencimento: new Date().toISOString().slice(0, 10), observacoes: "", status: "pendente" };
}

const METODOS = ["PIX", "Transferencia", "Boleto", "Cartao", "Debito automatico", "Dinheiro"];

export default function NewTransactionDialog() {
  const { dialogOpen, dialogType, editId, movimentacoes, closeDialog, addMovimentacao, updateMovimentacao } = useFinanceiroStore();
  const editData = editId ? movimentacoes.find(m => m.id === editId) : null;

  const schema = dialogType === "entrada" ? entradaSchema : saidaSchema;
  const cats = CATEGORIAS[dialogType] || CATEGORIAS.entrada;

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: editData ? { ...editData } : emptyForm(dialogType),
  });

  const onSubmit = (data) => {
    const payload = { ...data, tipo: dialogType, valor: parseFloat(data.valor) || 0 };
    if (editId) { updateMovimentacao(editId, payload); } else { addMovimentacao(payload); }
    reset();
    closeDialog();
  };

  const handleClose = () => { reset(); closeDialog(); };

  return (
    <AnimatePresence>
      {dialogOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleClose}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: "spring", damping: 25 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-text">{editId ? "Editar" : "Nova"} {dialogType === "entrada" ? "Entrada" : "Saida"}</h2>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="floating-label"><input type="text" placeholder=" " {...register("descricao")} className="has-icon" /><FileText size={14} className="input-icon" /><label>Descricao *</label></div>
                {errors.descricao && <p className="text-[10px] text-danger mt-1">{errors.descricao.message}</p>}
              </div>
              <div className="floating-label"><input type="number" step="0.01" placeholder=" " {...register("valor")} className="has-icon" /><DollarSign size={14} className="input-icon" /><label>Valor (R$) *</label></div>
              {errors.valor && <p className="text-[10px] text-danger mt-1">{errors.valor.message}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div><span className="field-label">Categoria</span><select {...register("categoria")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {cats.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select></div>
                <div><span className="field-label">Conta</span><select {...register("conta")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {CONTAS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><span className="field-label">Metodo Pagamento</span><select {...register("metodoPagamento")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  {METODOS.map(m => <option key={m} value={m}>{m}</option>)}
                </select></div>
                <div><span className="field-label">Status</span><select {...register("status")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
                  <option value="pendente">Pendente</option><option value="pago">Pago</option><option value="atrasado">Atrasado</option><option value="cancelado">Cancelado</option>
                </select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="floating-label"><input type="text" placeholder=" " {...register("responsavel")} className="has-icon" /><User size={14} className="input-icon" /><label>Responsavel</label></div>
                <div><span className="field-label">Data Vencimento</span><input type="date" {...register("dataVencimento")} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary" /></div>
              </div>
              <div className="floating-label"><textarea rows={2} placeholder=" " {...register("observacoes")} /><label>Observacoes</label></div>
              <div className="flex gap-3">
                <button type="button" onClick={handleClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted hover:text-text hover:bg-white/10 transition-colors">Cancelar</button>
                <button type="submit" className={`flex-1 py-2.5 rounded-xl text-sm font-semibold ${dialogType === "entrada" ? "btn-primary" : "bg-danger/80 text-white hover:bg-danger transition-colors"}`}>
                  {editId ? "Salvar" : dialogType === "entrada" ? "Criar Entrada" : "Criar Saida"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
