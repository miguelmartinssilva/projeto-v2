import { motion } from "framer-motion";

export default function LoadingOverlay({ visible }) {
  if (!visible) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 bg-bg-card/80 backdrop-blur-sm rounded-2xl z-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        </div>
        <p className="text-xs text-text-muted font-medium">Autenticando...</p>
      </div>
    </motion.div>
  );
}
