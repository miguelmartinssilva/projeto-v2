import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, FileText, Download, Eye, ChevronDown, CheckCircle, Clock, XCircle } from "lucide-react";

const proposals = [
  { id: "ORC-001", client: "Ana Souza", service: "Identidade Visual", value: "R$ 2.400", status: "aprovado", date: "15/05/2026", payment: "Pix" },
  { id: "ORC-002", client: "Barbearia King", service: "Social Media Mensal", value: "R$ 1.200", status: "aprovado", date: "12/05/2026", payment: "Boleto" },
  { id: "ORC-003", client: "Dra. Patricia", service: "Site Institucional", value: "R$ 3.600", status: "pendente", date: "08/05/2026", payment: null },
  { id: "ORC-004", client: "Festa Junina", service: "Cobertura Evento", value: "R$ 800", status: "cancelado", date: "05/05/2026", payment: null },
  { id: "ORC-005", client: "Academia Fit", service: "Pacote Reels", value: "R$ 600", status: "aprovado", date: "28/04/2026", payment: "Cartao" },
  { id: "ORC-006", client: "Restaurante Sabor", service: "Cardapio Digital", value: "R$ 1.800", status: "rascunho", date: "25/04/2026", payment: null },
  { id: "ORC-007", client: "Studio Pilates", service: "Identidade Visual", value: "R$ 3.000", status: "aprovado", date: "20/04/2026", payment: "Pix" },
  { id: "ORC-008", client: "Loja Online", service: "E-commerce", value: "R$ 5.200", status: "cancelado", date: "15/04/2026", payment: null },
];

const statusConfig = {
  aprovado: { label: "Aprovado", class: "status-aprovado", icon: CheckCircle },
  pendente: { label: "Pendente", class: "status-pendente", icon: Clock },
  cancelado: { label: "Cancelado", class: "status-cancelado", icon: XCircle },
  rascunho: { label: "Rascunho", class: "status-rascunho", icon: FileText },
};

const tabs = ["todos", "aprovado", "pendente", "rascunho", "cancelado"];

export default function History() {
  const [tab, setTab] = useState("todos");
  const [search, setSearch] = useState("");

  const filtered = proposals.filter(p => {
    if (tab !== "todos" && p.status !== tab) return false;
    if (search && !p.client.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalValue = filtered.reduce((acc, p) => {
    const v = parseFloat(p.value.replace("R$ ", "").replace(".", "").replace(",", "."));
    return acc + (isNaN(v) ? 0 : v);
  }, 0);

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span> <span className="text-text-secondary font-medium">Historico</span></p>
            <h1 className="text-xl font-display font-bold text-text">Historico de Orcamentos</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-bg-card border border-border-card rounded-lg px-4 py-2 text-sm">
              <span className="text-text-muted">Total filtrado: </span>
              <span className="text-primary font-display font-bold">R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-card bg-bg-card text-text-secondary hover:text-text text-sm transition-colors">
              <Filter size={15} /> Filtros <ChevronDown size={13} />
            </motion.button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all ${tab === t ? "bg-primary text-black font-bold" : "bg-bg-card border border-border-card text-text-muted hover:text-text"}`}
            >
              {t === "todos" ? "Todos" : statusConfig[t].label}
            </button>
          ))}
          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Buscar por cliente ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-bg-card border border-border-card rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors w-60"
            />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-bg-card rounded-xl card-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-[11px] uppercase tracking-[0.1em] border-b border-border-card bg-white/[0.02]">
                  <th className="text-left px-4 py-3.5 font-semibold">ID</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Cliente</th>
                  <th className="text-left px-4 py-3.5 font-semibold">Servico</th>
                  <th className="text-right px-4 py-3.5 font-semibold">Valor</th>
                  <th className="text-center px-4 py-3.5 font-semibold">Status</th>
                  <th className="text-right px-4 py-3.5 font-semibold">Data</th>
                  <th className="text-center px-4 py-3.5 font-semibold">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const cfg = statusConfig[p.status];
                  const Icon = cfg.icon;
                  return (
                    <tr key={p.id} className="border-b border-border-card/30 transition-colors hover:bg-white/[0.02] group">
                      <td className="px-4 py-3.5 text-text-muted font-mono text-xs">{p.id}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                            {p.client.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </div>
                          <span className="text-text font-medium">{p.client}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-text-secondary">{p.service}</td>
                      <td className="px-4 py-3.5 text-right text-text font-semibold font-display">{p.value}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-[0.08em] ${cfg.class}`}>
                          <Icon size={11} /> {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-text-muted text-xs">{p.date}</td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors"><Eye size={14} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-primary transition-colors"><Download size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-text-muted">
              <FileText size={36} className="mb-3 opacity-20" />
              <p className="text-sm">Nenhum orcamento encontrado</p>
            </div>
          )}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-card/30 text-xs text-text-muted">
            <span>Mostrando {filtered.length} de {proposals.length} orcamentos</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded border border-border-card bg-bg-card hover:text-text transition-colors disabled:opacity-40" disabled>Anterior</button>
              <button className="px-3 py-1 rounded border border-border-card bg-bg-card hover:text-text transition-colors">Proximo</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
