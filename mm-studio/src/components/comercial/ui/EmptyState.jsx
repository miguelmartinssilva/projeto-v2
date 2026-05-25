import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function EmptyState({ message = "Nenhuma negociacao encontrada" }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center"><Briefcase size={28} className="text-text-muted opacity-30" /></div>
      <p className="text-sm text-text-muted">{message}</p>
    </motion.div>
  );
}
