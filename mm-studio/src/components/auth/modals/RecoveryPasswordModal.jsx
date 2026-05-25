import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import useAuthStore from "../../../store/authStore";

const schema = z.object({
  email: z.string().min(1, "Email obrigatorio").email("Email invalido"),
});

export default function RecoveryPasswordModal() {
  const { recoveryOpen, closeRecovery, sendRecovery, loading, recoverySent } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data) => { sendRecovery(data.email); };

  return (
    <AnimatePresence>
      {recoveryOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeRecovery}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-sm shadow-2xl relative"
            onClick={e => e.stopPropagation()}>

            <button onClick={closeRecovery} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors">
              <X size={16} />
            </button>

            {recoverySent ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-text mb-2">Email enviado!</h3>
                <p className="text-xs text-text-muted mb-6">Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.</p>
                <button onClick={closeRecovery}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-text-muted hover:text-text transition-colors">
                  <ArrowLeft size={14} /> Voltar ao login
                </button>
              </motion.div>
            ) : (
              <>
                <div className="mb-5">
                  <h3 className="text-base font-bold text-text">Recuperar senha</h3>
                  <p className="text-xs text-text-muted mt-1">Informe seu email para receber o link de redefinicao</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      <input type="email" placeholder="Email" autoFocus {...register("email")}
                        className="w-full bg-bg-input border border-border-card rounded-lg pl-10 pr-4 py-3 text-sm text-text placeholder-text-muted/40 outline-none focus:border-primary transition-colors" />
                    </div>
                    {errors.email && <p className="text-[10px] text-danger mt-1 ml-1">{errors.email.message}</p>}
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={closeRecovery}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-text-muted hover:text-text transition-colors">
                      <ArrowLeft size={14} /> Cancelar
                    </button>
                    <button type="submit" disabled={loading}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold btn-primary disabled:opacity-60">
                      {loading ? <Loader2 size={14} className="animate-spin" /> : "Enviar link"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
