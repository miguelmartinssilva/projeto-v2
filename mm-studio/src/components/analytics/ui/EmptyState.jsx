import { BarChart3 } from "lucide-react";

export default function EmptyState({ icon: Icon = BarChart3, title = "Nenhum dado", description = "Nao ha dados para exibir" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-3"><Icon size={24} className="text-text-muted opacity-40" /></div>
      <p className="text-sm font-semibold text-text-muted mb-1">{title}</p>
      <p className="text-xs text-text-muted/60">{description}</p>
    </div>
  );
}
