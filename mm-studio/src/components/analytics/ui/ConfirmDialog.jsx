import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onCancel}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center"><AlertTriangle size={18} className="text-danger" /></div>
              <div><h3 className="text-sm font-bold text-text">{title}</h3><p className="text-xs text-text-muted mt-0.5">{description}</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/5 text-text-muted hover:text-text transition-colors">Cancelar</button>
              <button onClick={onConfirm} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-danger/15 text-danger hover:bg-danger/25 transition-colors">Confirmar</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
