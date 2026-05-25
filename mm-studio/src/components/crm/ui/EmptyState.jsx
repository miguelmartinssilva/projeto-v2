import { Users } from "lucide-react";

export default function EmptyState({ title = "Nenhum resultado", description = "Tente ajustar os filtros ou adicione um novo item" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center">
        <Users size={28} className="text-text-muted opacity-30" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-text mb-1">{title}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
    </div>
  );
}
