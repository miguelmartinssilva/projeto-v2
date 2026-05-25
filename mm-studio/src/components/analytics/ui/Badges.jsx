export function CategoryBadge({ categoria }) {
  const map = {
    comercial: { label: "Comercial", color: "#00e676", bg: "#00e67618" },
    financeiro: { label: "Financeiro", color: "#22c55e", bg: "#22c55e18" },
    crm: { label: "CRM", color: "#3b82f6", bg: "#3b82f618" },
    operacional: { label: "Operacional", color: "#f59e0b", bg: "#f59e0b18" },
    marketing: { label: "Marketing", color: "#ec4899", bg: "#ec489918" },
    produto: { label: "Produto", color: "#8b5cf6", bg: "#8b5cf618" },
  };
  const cfg = map[categoria] || map.operacional;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}

export function StatusBadge({ status }) {
  const map = {
    acima: { label: "Acima", color: "#22c55e", bg: "#22c55e18" },
    dentro: { label: "Dentro", color: "#3b82f6", bg: "#3b82f618" },
    abaixo: { label: "Abaixo", color: "#f59e0b", bg: "#f59e0b18" },
    critico: { label: "Critico", color: "#ef4444", bg: "#ef444418" },
  };
  const cfg = map[status] || map.dentro;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}

export function TrendBadge({ tendencia }) {
  if (tendencia === "alta") return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400">Alta</span>;
  if (tendencia === "baixa") return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-500/10 text-red-400">Baixa</span>;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-white/5 text-text-muted">Estavel</span>;
}

export function InsightTypeBadge({ tipo }) {
  const map = {
    positivo: { label: "Positivo", color: "#22c55e", bg: "#22c55e18" },
    alerta: { label: "Alerta", color: "#f59e0b", bg: "#f59e0b18" },
    neutro: { label: "Neutro", color: "#94a3b8", bg: "#94a3b818" },
  };
  const cfg = map[tipo] || map.neutro;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}
