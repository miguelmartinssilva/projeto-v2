import { motion } from "framer-motion";
import GradientBackground from "../animations/GradientBackground";
import AnimatedShapes from "../animations/AnimatedShapes";
import FloatingCards from "../branding/FloatingCards";

export default function BrandingPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between relative overflow-hidden w-1/2 min-h-screen p-12">
      <GradientBackground />
      <AnimatedShapes />

      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center border border-primary/20">
              <span className="text-primary font-display font-bold text-lg">M</span>
            </div>
            <div>
              <span className="text-lg font-display font-bold text-text">MM Studio</span>
              <span className="block text-[10px] text-text-muted tracking-widest uppercase">Gestao Criativa</span>
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-text leading-tight mb-3">
            Gerencie seu estúdio <br />
            <span className="text-primary">com inteligencia</span>
          </h1>
          <p className="text-sm text-text-secondary max-w-sm leading-relaxed">
            Plataforma completa para gestao de clientes, financeiro, comercial e automacoes. Tudo em um so lugar.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10">
        <FloatingCards />
      </div>

      <div className="relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.8 }}
          className="flex items-center gap-3 text-[10px] text-text-muted/50">
          <span>&copy; 2026 MM Studio</span>
          <span>·</span>
          <span>v2.0</span>
          <span>·</span>
          <span>SaaS Premium</span>
        </motion.div>
      </div>
    </div>
  );
}
