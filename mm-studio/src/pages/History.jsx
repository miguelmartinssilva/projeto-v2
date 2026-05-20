import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, FileText, Download, Eye, ChevronDown, CheckCircle, Clock, XCircle, Trash2, X } from "lucide-react";
import { getHistorico, saveHistorico, deleteHistorico } from "../utils/storage";
import { jsPDF } from "jspdf";

const STATUS_MAP = {
  aprovada: { label: "Aprovado", class: "status-aprovado", icon: CheckCircle },
  aprovado: { label: "Aprovado", class: "status-aprovado", icon: CheckCircle },
  pago: { label: "Pago", class: "status-pago", icon: CheckCircle },
  pendente: { label: "Pendente", class: "status-pendente", icon: Clock },
  enviada: { label: "Enviada", class: "status-pendente", icon: Clock },
  recusada: { label: "Cancelado", class: "status-cancelado", icon: XCircle },
  perdida: { label: "Cancelado", class: "status-cancelado", icon: XCircle },
  rascunho: { label: "Rascunho", class: "status-rascunho", icon: FileText },
};

const tabs = ["todos", "aprovado", "pendente", "rascunho", "cancelado"];

function mapStatus(s) {
  if (s === "aprovada" || s === "aprovado") return "aprovado";
  if (s === "pago") return "aprovado";
  if (s === "pendente" || s === "enviada") return "pendente";
  if (s === "recusada" || s === "perdida") return "cancelado";
  return "rascunho";
}

function statusLabel(s) {
  if (s === "aprovada" || s === "aprovado" || s === "pago") return "Aprovado";
  if (s === "pendente" || s === "enviada") return "Pendente";
  if (s === "recusada" || s === "perdida") return "Cancelado";
  return "Rascunho";
}

export default function History() {
  const [tab, setTab] = useState("todos");
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [viewStatus, setViewStatus] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { proposals, rawItems, totalCount } = useMemo(() => {
    const hist = getHistorico();
    const mapped = hist.map(h => ({
      id: h.numero || `#${h.id}`,
      rawId: h.id,
      client: h.cliente || "(sem nome)",
      service: h.itens?.[0]?.desc || `${h.itens?.length || 0} itens`,
      value: (h.total || 0),
      valueStr: `R$ ${(h.total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      status: mapStatus(h.status),
      date: h.data || "",
      payment: h.status === "pago" ? "Pix" : null,
    }));
    return { proposals: mapped, rawItems: hist, totalCount: mapped.length };
  }, []);

  const filtered = proposals.filter(p => {
    if (tab !== "todos" && p.status !== tab) return false;
    if (search && !p.client.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalValue = filtered.reduce((acc, p) => acc + p.value, 0);

  const handleView = (p) => {
    const raw = rawItems.find(r => (r.numero || `#${r.id}`) === p.id);
    if (raw) { setViewItem(raw); setViewStatus(raw.status || "rascunho"); }
  };

  const handleStatusChange = (newStatus) => {
    if (!viewItem) return;
    const hist = getHistorico();
    const idx = hist.findIndex(h => h.id === viewItem.id);
    if (idx >= 0) {
      hist[idx].status = newStatus;
      saveHistorico(hist[idx]);
      setViewItem(hist[idx]);
      setViewStatus(newStatus);
    }
  };

  const handleDownloadPDF = (p) => {
    const raw = rawItems.find(r => (r.numero || `#${r.id}`) === p.id);
    if (!raw) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pw = pdf.internal.pageSize.getWidth();
    const lm = 15, rm = pw - 15;
    let y = 15;

    const w = (text, opts = {}) => {
      const { size = 10, bold = false, color = "#111", align = "left" } = opts;
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(size);
      if (color !== "#111") pdf.setTextColor(color);
      if (align === "center") pdf.text(text, pw / 2, y, { align: "center" });
      else if (align === "right") pdf.text(text, rm, y, { align: "right" });
      else pdf.text(text, lm, y);
      pdf.setTextColor("#111");
      y += size * 0.45;
    };
    const l = (yp) => { pdf.setDrawColor(0, 230, 118); pdf.setLineWidth(0.5); pdf.line(lm, yp, rm, yp); };
    const cp = () => { if (y > 270) { pdf.addPage(); y = 15; } };
    const f = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

    w("MM STUDIO", { size: 20, bold: true, color: "#00e676", align: "center" });
    w(`Proposta ${raw.numero || ""}`, { size: 12, color: "#555", align: "center" });
    y += 2; l(y); y += 6;
    w("DADOS DO CLIENTE", { size: 9, bold: true, color: "#00e676" }); y += 2;
    w(`Nome: ${raw.cliente || "---"}`);
    if (raw.contato) w(`Contato: ${raw.contato}`);
    w(`Tipo: ${raw.tipo || "---"}`);
    y += 4; cp();

    w("SERVICOS", { size: 9, bold: true, color: "#00e676" }); y += 2;
    const colW = [80, 15, 25, 30];
    const hdrs = ["Descricao", "Qtd", "Valor Un.", "Subtotal"];
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor("#555");
    let x = lm;
    hdrs.forEach(h => { pdf.text(h, x, y); x += colW[hdrs.indexOf(h)]; });
    y += 5; l(y - 2);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor("#333");
    (raw.itens || []).forEach(i => {
      cp(); x = lm;
      pdf.text((i.desc || "").substring(0, 30), x, y); x += colW[0];
      pdf.text(String(i.qtd || 0), x, y); x += colW[1];
      pdf.text(f(i.unit || 0), x, y); x += colW[2];
      pdf.text(f(i.sub || i.qtd * i.unit || 0), x, y);
      y += 5;
    });
    y += 3; cp();
    w(`Subtotal: ${f(raw.subtotal)}`, { align: "right" });
    if (raw.tipoFator && raw.tipoFator !== 1) w(`Fator: x${raw.tipoFator.toFixed(2)}`, { align: "right" });
    if (raw.descPct > 0) w(`Desconto: -${raw.descPct}%`, { align: "right", color: "#e53935" });
    y += 2; l(y); y += 4; cp();
    w(`TOTAL: ${f(raw.total)}`, { size: 14, bold: true, color: "#00e676", align: "right" });

    if (raw.obs) {
      y += 6; cp();
      w("OBSERVACOES", { size: 9, bold: true, color: "#00e676" }); y += 2;
      const lines = pdf.splitTextToSize(raw.obs, rm - lm);
      lines.forEach(line => { cp(); pdf.text(line, lm, y); y += 4; });
    }

    y += 8; cp();
    pdf.setFontSize(8); pdf.setTextColor("#777");
    w(`Proposta ${raw.numero} - gerada em ${raw.data}`, { align: "center", size: 8, color: "#777" });

    pdf.save(`proposta-${raw.numero || raw.id}.pdf`);
  };

  const handleDelete = (p) => {
    setConfirmDelete(p);
  };

  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    const raw = rawItems.find(r => (r.numero || `#${r.id}`) === confirmDelete.id);
    if (raw) deleteHistorico(raw.id);
    setConfirmDelete(null);
    window.location.reload();
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span> <span className="text-text-secondary font-medium">Historico</span></p>
            <h1 className="text-xl font-display font-bold text-text">Historico de Orcamentos</h1>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="bg-bg-card border border-border-card rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm flex-1 sm:flex-none text-center sm:text-left">
              <span className="text-text-muted hidden sm:inline">Total filtrado: </span>
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
              {t === "todos" ? "Todos" : STATUS_MAP[t === "cancelado" ? "recusada" : t === "aprovado" ? "aprovada" : t === "pendente" ? "pendente" : "rascunho"].label}
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
                  <th className="text-left px-4 py-3.5 font-semibold hidden md:table-cell">Servico</th>
                  <th className="text-right px-4 py-3.5 font-semibold">Valor</th>
                  <th className="text-center px-4 py-3.5 font-semibold">Status</th>
                  <th className="text-right px-4 py-3.5 font-semibold hidden sm:table-cell">Data</th>
                  <th className="text-center px-4 py-3.5 font-semibold">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const cfg = STATUS_MAP[p.status === "aprovado" ? "aprovada" : p.status === "cancelado" ? "recusada" : p.status];
                  const Icon = cfg.icon;
                  return (
                    <tr key={`${p.id}-${i}`} className="border-b border-border-card/30 transition-colors hover:bg-white/[0.02] group">
                      <td className="px-4 py-3.5 text-text-muted font-mono text-xs">{p.id}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                            {p.client.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </div>
                          <span className="text-text font-medium">{p.client}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-text-secondary hidden md:table-cell">{p.service}</td>
                      <td className="px-4 py-3.5 text-right text-text font-semibold font-display">{p.valueStr}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-[0.08em] ${cfg.class}`}>
                          <Icon size={11} /> {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-text-muted text-xs hidden sm:table-cell">{p.date}</td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity xs:opacity-100">
                          <button onClick={() => handleView(p)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors" title="Visualizar"><Eye size={14} /></button>
                          <button onClick={() => handleDownloadPDF(p)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-primary transition-colors" title="Baixar PDF"><Download size={14} /></button>
                          <button onClick={() => handleDelete(p)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-danger transition-colors" title="Excluir"><Trash2 size={14} /></button>
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
            <span>Mostrando {filtered.length} de {totalCount} orcamentos</span>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 rounded border border-border-card bg-bg-card hover:text-text transition-colors disabled:opacity-40" disabled>Anterior</button>
              <button className="px-3 py-1 rounded border border-border-card bg-bg-card hover:text-text transition-colors">Proximo</button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {viewItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setViewItem(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-bg-card rounded-2xl max-w-lg w-full max-h-[80vh] overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-bold text-text">{viewItem.numero || "Orcamento"}</h2>
                <button onClick={() => setViewItem(null)} className="text-text-muted hover:text-text p-1"><X size={18} /></button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-bg-elevated rounded-lg p-3 border border-border-card">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted mb-2">Cliente</p>
                  <p className="text-text font-medium">{viewItem.cliente || "---"}</p>
                  {viewItem.contato && <p className="text-xs text-text-muted">{viewItem.contato}</p>}
                  {viewItem.tipo && <p className="text-xs text-text-muted">{viewItem.tipo}</p>}
                </div>
                <div className="bg-bg-elevated rounded-lg p-3 border border-border-card">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted mb-2">Status</p>
                  <div className="flex items-center gap-2">
                    <select value={viewStatus} onChange={(e) => handleStatusChange(e.target.value)}
                      className="flex-1 bg-bg-card border border-border-card rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-primary/50">
                      <option value="rascunho">Rascunho</option>
                      <option value="pendente">Pendente</option>
                      <option value="enviada">Enviada</option>
                      <option value="aprovada">Aprovado</option>
                      <option value="recusada">Cancelado</option>
                      <option value="pago">Pago</option>
                    </select>
                  </div>
                </div>
                <div className="bg-bg-elevated rounded-lg p-3 border border-border-card">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted mb-2">Itens</p>
                  {(viewItem.itens || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5 border-b border-border-card/30 last:border-0">
                      <span className="text-text text-xs">{item.desc} <span className="text-text-muted">x{item.qtd}</span></span>
                      <span className="text-text font-medium text-xs">R$ {(item.sub || item.qtd * item.unit || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border-card">
                  <span className="text-text font-semibold">Total</span>
                  <span className="text-primary font-display text-xl font-bold">R$ {(viewItem.total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                {viewItem.obs && (
                  <div className="bg-bg-elevated rounded-lg p-3 border border-border-card">
                    <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted mb-1">Observacoes</p>
                    <p className="text-xs text-text whitespace-pre-wrap">{viewItem.obs}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-bg-card rounded-2xl max-w-sm w-full p-6 text-center">
              <Trash2 size={36} className="text-danger mx-auto mb-3" />
              <h2 className="text-lg font-display font-bold text-text mb-2">Excluir Orcamento?</h2>
              <p className="text-sm text-text-muted mb-5">Esta acao nao pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-lg border border-border-card text-text-secondary hover:text-text transition-colors text-sm">Cancelar</button>
                <button onClick={confirmDeleteAction} className="flex-1 py-2.5 rounded-lg bg-danger text-white hover:bg-danger/80 transition-colors text-sm font-semibold">Excluir</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
