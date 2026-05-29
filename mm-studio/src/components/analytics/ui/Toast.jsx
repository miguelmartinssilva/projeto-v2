import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info } from "lucide-react";

export default function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-[60]">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium shadow-2xl border backdrop-blur-sm ${
            toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
            toast.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
            "bg-blue-500/10 border-blue-500/20 text-blue-400"
          }`}>
            {toast.type === "success" ? <CheckCircle size={14} /> : toast.type === "error" ? <XCircle size={14} /> : <Info size={14} />}
            {toast.message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
