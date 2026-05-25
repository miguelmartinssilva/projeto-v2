export function StatusBadge({ status }) {
  const map = {
    novo: { label: "Novo", color: "#3b82f6", bg: "#3b82f618" },
    ativo: { label: "Ativo", color: "#22c55e", bg: "#22c55e18" },
    inativo: { label: "Inativo", color: "#6b7280", bg: "#6b728018" },
    pendente: { label: "Pendente", color: "#f59e0b", bg: "#f59e0b18" },
    pago: { label: "Pago", color: "#22c55e", bg: "#22c55e18" },
    atrasado: { label: "Atrasado", color: "#ef4444", bg: "#ef444418" },
  };
  const cfg = map[status] || map.ativo;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}

export function TipoBadge({ tipo }) {
  const map = {
    pagamento: { label: "Pagamento", color: "#22c55e", bg: "#22c55e18" },
    lead: { label: "Lead", color: "#3b82f6", bg: "#3b82f618" },
    deal: { label: "Deal", color: "#8b5cf6", bg: "#8b5cf618" },
    tarefa: { label: "Tarefa", color: "#f59e0b", bg: "#f59e0b18" },
    automacao: { label: "Auto", color: "#ec4899", bg: "#ec489918" },
    reuniao: { label: "Reuniao", color: "#448aff", bg: "#448aff18" },
  };
  const cfg = map[tipo] || map.tarefa;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}

export function NotifTipoBadge({ tipo }) {
  const map = {
    financeiro: { label: "Financeiro", color: "#22c55e", bg: "#22c55e18" },
    crm: { label: "CRM", color: "#3b82f6", bg: "#3b82f618" },
    comercial: { label: "Comercial", color: "#8b5cf6", bg: "#8b5cf618" },
    operacional: { label: "Ops", color: "#f59e0b", bg: "#f59e0b18" },
    automacao: { label: "Auto", color: "#ec4899", bg: "#ec489918" },
    agenda: { label: "Agenda", color: "#448aff", bg: "#448aff18" },
  };
  const cfg = map[tipo] || map.operacional;
  return <span className="px-1.5 py-0.5 rounded text-[8px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}

export function PlanoBadge({ plano }) {
  const map = {
    basico: { label: "Basico", color: "#448aff", bg: "#448aff18" },
    padrao: { label: "Padrao", color: "#7c3aed", bg: "#7c3aed18" },
    premium: { label: "Premium", color: "#ffb800", bg: "#ffb80018" },
  };
  const cfg = map[plano] || map.basico;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}
