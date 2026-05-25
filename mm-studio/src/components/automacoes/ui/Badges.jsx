export function StatusBadge({ status }) {
  const map = {
    ativa: { label: "Ativa", color: "#22c55e", bg: "#22c55e18" },
    pausada: { label: "Pausada", color: "#f59e0b", bg: "#f59e0b18" },
    erro: { label: "Erro", color: "#ef4444", bg: "#ef444418" },
    teste: { label: "Em Teste", color: "#3b82f6", bg: "#3b82f618" },
  };
  const cfg = map[status] || map.pausada;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}

export function IntegracaoBadge({ integracao }) {
  const map = {
    whatsapp: { label: "WhatsApp", color: "#22c55e", bg: "#22c55e18" },
    email: { label: "Email", color: "#3b82f6", bg: "#3b82f618" },
    webhooks: { label: "Webhook", color: "#94a3b8", bg: "#94a3b818" },
    google_calendar: { label: "G.Calendar", color: "#f59e0b", bg: "#f59e0b18" },
    telegram: { label: "Telegram", color: "#06b6d4", bg: "#06b6d418" },
  };
  const cfg = map[integracao] || map.webhooks;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}

export function LogStatusBadge({ status }) {
  const map = {
    sucesso: { label: "Sucesso", color: "#22c55e", bg: "#22c55e18" },
    erro: { label: "Erro", color: "#ef4444", bg: "#ef444418" },
    aviso: { label: "Aviso", color: "#f59e0b", bg: "#f59e0b18" },
  };
  const cfg = map[status] || map.sucesso;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}

export function CategoriaBadge({ categoria }) {
  const map = {
    crm: { label: "CRM", color: "#3b82f6", bg: "#3b82f618" },
    financeiro: { label: "Financeiro", color: "#22c55e", bg: "#22c55e18" },
    comercial: { label: "Comercial", color: "#00e676", bg: "#00e67618" },
    comunicacao: { label: "Comunicacao", color: "#ec4899", bg: "#ec489918" },
  };
  const cfg = map[categoria] || map.crm;
  return <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}
