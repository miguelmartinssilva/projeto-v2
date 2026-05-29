import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import PasswordInput from "../ui/PasswordInput";
import SocialLoginButtons from "../forms/SocialLoginButtons";

const schema = z.object({
  email: z.string().min(1, "Email obrigatorio").email("Email invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

function emptyForm() {
  return { email: "", password: "" };
}

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, loading, loginError, rememberMe, setRememberMe, openRecovery } = useAuthStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: emptyForm(),
  });

  const onSubmit = async (data) => {
    const ok = await login(data.email, data.password);
    if (ok) navigate("/");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full max-w-sm mx-auto space-y-6">

      <div>
        <h2 className="text-xl font-display font-bold text-text">Entrar</h2>
        <p className="text-xs text-text-muted mt-1">Acesse sua conta MM Studio</p>
      </div>

      {loginError && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          {loginError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input type="email" placeholder="Email" autoFocus
              {...register("email")}
              className="w-full bg-bg-input border border-border-card rounded-lg pl-10 pr-4 py-3 text-sm text-text placeholder-text-muted/40 outline-none focus:border-primary transition-colors" />
          </div>
          {errors.email && <p className="text-[10px] text-danger mt-1 ml-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none z-10" />
            <PasswordInput placeholder="Senha" {...register("password")}
              className="w-full bg-bg-input border border-border-card rounded-lg pl-10 pr-10 py-3 text-sm text-text placeholder-text-muted/40 outline-none focus:border-primary transition-colors" />
          </div>
          {errors.password && <p className="text-[10px] text-danger mt-1 ml-1">{errors.password.message}</p>}
        </div>

<div className="flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-border-card bg-bg-input accent-primary" />
          <span className="text-[11px] text-text-muted whitespace-nowrap">Lembrar de mim</span>
        </label>
        <button type="button" onClick={openRecovery} className="text-[11px] text-primary hover:underline font-medium whitespace-nowrap">
          Esqueceu a senha?
        </button>
      </div>

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Entrando...</> : <>Entrar <ArrowRight size={16} /></>}
        </motion.button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-card" /></div>
        <div className="relative flex justify-center"><span className="px-3 bg-bg-main text-[10px] text-text-muted uppercase">ou continue com</span></div>
      </div>

      <SocialLoginButtons />

      <p className="text-center text-[10px] text-text-muted mt-4">
        Nao tem conta? <span className="text-primary font-medium cursor-pointer hover:underline">Solicitar acesso</span>
      </p>
    </motion.div>
  );
}
