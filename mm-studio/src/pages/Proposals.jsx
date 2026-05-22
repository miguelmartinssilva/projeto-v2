import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, MessageCircle, Palette, Layers, Star, Trash2 } from "lucide-react";
import { getServicos, getPacotes, getPerfilAtivo, saveHistorico, getProximoNumero } from "../utils/storage";
import { jsPDF } from "jspdf";

const CATEGORIAS = ["Branding", "Social", "Web", "Video", "Evento", "Outro"];

const TIPOS_CLIENTE = [
  { label: "Particular", value: 1.0 },
  { label: "Comercio", value: 1.5 },
  { label: "Evento", value: 1.8 },
  { label: "Vereador", value: 2.0 },
  { label: "Prefeitura", value: 2.5 },
];

export default function Proposals() {
  const perfil = useMemo(() => getPerfilAtivo(), []);
  const { servicos, pacotes } = useMemo(() => ({ servicos: getServicos(), pacotes: getPacotes() }), []);

  const [items, setItems] = useState([{ desc: "", qtd: 1, unit: 0 }]);
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [tipoIndex, setTipoIndex] = useState(0);
  const [cxFactor, setCxFactor] = useState(1.0);
  const [urgFactor, setUrgFactor] = useState(1.0);
  const [freqFactor, setFreqFactor] = useState(1.0);
  const [discount, setDiscount] = useState(0);
  const [obs, setObs] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [catFilter, setCatFilter] = useState("Todas");
  const [saved, setSaved] = useState(false);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.qtd * i.unit, 0), [items]);
  const fator = TIPOS_CLIENTE[tipoIndex].value;
  const total = useMemo(() => {
    let t = subtotal * fator * cxFactor * urgFactor * freqFactor;
    if (discount > 0) t -= t * (discount / 100);
    return t;
  }, [subtotal, fator, cxFactor, urgFactor, freqFactor, discount]);

  const addItem = () => setItems([...items, { desc: "", qtd: 1, unit: 0 }]);
  const removeItem = (i) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => {
    const copy = [...items];
    copy[i][field] = field === "desc" ? val : parseFloat(val) || 0;
    setItems(copy);
  };

  const addService = (s) => {
    const existing = items.find(i => i.desc === s.nome);
    if (existing) {
      setItems(items.map(i => i.desc === s.nome ? { ...i, qtd: i.qtd + 1 } : i));
    } else {
      setItems([...items, { desc: s.nome, qtd: 1, unit: s.preco }]);
    }
  };

  const addPacote = (p) => {
    const existing = items.find(i => i.desc === p.nome);
    if (existing) {
      setItems(items.map(i => i.desc === p.nome ? { ...i, qtd: i.qtd + p.qtd } : i));
    } else {
      setItems([...items, { desc: p.nome, qtd: p.qtd, unit: Math.round(p.precoTotal / p.qtd) }]);
    }
  };

  const filteredServices = servicos.filter(s =>
    (catFilter === "Todas" || s.categoria === catFilter) &&
    s.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pw = pdf.internal.pageSize.getWidth();
    const lm = 15, rm = pw - 15;
    let y = 15;

    const write = (text, opts = {}) => {
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

    const line = (yPos) => { pdf.setDrawColor(0, 230, 118); pdf.setLineWidth(0.5); pdf.line(lm, yPos, rm, yPos); };
    const checkPage = () => { if (y > 270) { pdf.addPage(); y = 15; } };

    write("MM STUDIO", { size: 20, bold: true, color: "#00e676", align: "center" });
    write("Proposta Comercial", { size: 12, color: "#555", align: "center" });
    y += 4; line(y); y += 8;

    write("DADOS DO CLIENTE", { size: 9, bold: true, color: "#00e676" });
    y += 2;
    write(`Nome: ${clientName || "—"}`);
    if (clientCompany) write(`Empresa: ${clientCompany}`);
    if (clientContact) write(`Contato: ${clientContact}`);
    write(`Tipo: ${TIPOS_CLIENTE[tipoIndex].label}`);
    y += 4;

    write("SERVICOS", { size: 9, bold: true, color: "#00e676" });
    y += 2;
    const colW = [80, 15, 30, 30];
    const headers = ["Descricao", "Qtd", "Valor Un.", "Subtotal"];
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor("#555");
    let x = lm;
    headers.forEach((h, i) => { pdf.text(h, x, y); x += colW[i]; });
    y += 5; line(y - 2);

    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor("#333");
    const validItems = items.filter(i => i.desc && i.unit > 0);
    validItems.forEach(i => {
      checkPage();
      x = lm;
      pdf.text(i.desc.substring(0, 30), x, y); x += colW[0];
      pdf.text(String(i.qtd), x, y); x += colW[1];
      pdf.text(`R$ ${i.unit.toLocaleString("pt-BR", { minFrac: 2 })}`, x, y); x += colW[2];
      pdf.text(`R$ ${(i.qtd * i.unit).toLocaleString("pt-BR", { minFrac: 2 })}`, x, y);
      y += 5;
    });

    y += 3; checkPage();
    const f = (v) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    write(`Subtotal: ${f(subtotal)}`, { align: "right" });
    write(`Fator (${TIPOS_CLIENTE[tipoIndex].label}): x${fator.toFixed(2)}`, { align: "right" });
    if (cxFactor !== 1.0) write(`Complexidade: x${cxFactor.toFixed(2)}`, { align: "right" });
    if (urgFactor !== 1.0) write(`Urgencia: x${urgFactor.toFixed(2)}`, { align: "right" });
    if (freqFactor !== 1.0) write(`Frequencia: x${freqFactor.toFixed(2)}`, { align: "right" });
    if (discount > 0) write(`Desconto: -${discount}%`, { align: "right", color: "#e53935" });

    y += 2; line(y); y += 4; checkPage();
    write(`TOTAL: ${f(total)}`, { size: 14, bold: true, color: "#00e676", align: "right" });

    if (obs) {
      y += 6; checkPage();
      write("OBSERVACOES", { size: 9, bold: true, color: "#00e676" });
      y += 2;
      const lines = pdf.splitTextToSize(obs, rm - lm);
      lines.forEach(l => { checkPage(); pdf.text(l, lm, y); y += 4; });
    }

    y += 8; checkPage();
    pdf.setFontSize(8); pdf.setTextColor("#777");
    const info = perfil || {};
    if (info.endereco) write(info.endereco, { align: "center", size: 8, color: "#777" });
    if (info.email) write(info.email, { align: "center", size: 8, color: "#777" });
    if (info.telefone) write(info.telefone, { align: "center", size: 8, color: "#777" });
    if (info.pixChave) write(`PIX (${info.pixTipo?.toUpperCase()}): ${info.pixChave}`, { align: "center", size: 8, color: "#00e676" });
    write(`Proposta gerada em ${new Date().toLocaleDateString("pt-BR")}`, { align: "center", size: 7, color: "#999" });

    pdf.save(`proposta-${clientName || "cliente"}.pdf`);
  };

  const sendWhatsApp = () => {
    if (!clientContact) return;
    const msg = `Ola ${clientName || "tudo bem"}! Segue minha proposta: 💼`;
    const url = `https://wa.me/55${clientContact.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const saveProposal = () => {
    const numero = getProximoNumero();
    const item = {
      id: Date.now(),
      numero,
      status: "rascunho",
      data: new Date().toLocaleDateString("pt-BR"),
      cliente: clientName || "(cliente nao informado)",
      contato: clientContact,
      tipo: TIPOS_CLIENTE[tipoIndex].label,
      itens: items.filter(i => i.desc && i.unit > 0).map(i => ({ desc: i.desc, qtd: i.qtd, unit: i.unit, sub: i.qtd * i.unit })),
      subtotal,
      total: Math.round(total * 100) / 100,
      tipoFator: fator,
      cxFator: cxFactor,
      urgFator: urgFactor,
      freqFator: freqFactor,
      descPct: discount,
      obs,
    };
    saveHistorico(item);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">MM Studio <span className="mx-1.5 text-border-light">/</span> <span className="text-text-secondary font-medium">Orcamento</span></p>
            <h1 className="text-xl font-display font-bold text-text">Novo Orcamento</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-secondary bg-bg-card border border-border-card rounded-lg px-3 py-2">
            <Star size={14} className="text-primary" />
            <span>Perfil: <span className="text-text font-medium">{perfil?.nome || "Miguel Martins"}</span> <span className="text-text-muted">({perfil?.tipo?.toUpperCase() || "PF"})</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-bg-card rounded-xl p-6 card-border glow-primary">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text flex items-center gap-2"><Palette size={16} className="text-primary" /> Catalogo de Servicos</h2>
                <div className="flex items-center gap-2">
                  <input
                    type="search" placeholder="Buscar..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-bg-elevated border border-border-card rounded-lg px-3 py-1.5 text-xs text-text placeholder-text-muted outline-none focus:border-primary/50 w-36"
                  />
                  <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="bg-bg-elevated border border-border-card rounded-lg px-2 py-1.5 text-xs text-text outline-none">
                    <option value="Todas">Todas</option>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredServices.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.02 * i }}
                    onClick={() => addService(s)}
                    className="group relative bg-bg-elevated border border-border-card rounded-xl p-3.5 cursor-pointer transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Palette size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{s.nome}</p>
                        <p className="text-xs text-text-muted">{s.unidade || ""}</p>
                        <p className="text-sm font-display font-bold text-primary mt-0.5">R$ {s.preco?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                    <button className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 bg-primary text-black transition-all">
                      <Plus size={13} />
                    </button>
                  </motion.div>
                ))}
              </div>
              {pacotes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border-card/50">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-text mb-3">Pacotes</h3>
                  <div className="flex flex-wrap gap-2">
                    {pacotes.map(p => (
                      <button key={p.id} onClick={() => addPacote(p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border-card text-xs text-text-secondary hover:border-primary/40 hover:text-text transition-all">
                        <Layers size={12} className="text-primary" /> {p.nome} - R$ {p.precoTotal?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-bg-card rounded-xl p-6 card-border glow-primary">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Dados do Cliente</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cli-nome" className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Nome do cliente</label>
                  <input type="text" id="cli-nome" placeholder="Digite o nome do cliente" value={clientName} onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cli-contato" className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">WhatsApp</label>
                    <div className="relative">
                      <MessageCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                      <input type="text" id="cli-contato" placeholder="(99) 99999-0000" value={clientContact} onChange={(e) => setClientContact(e.target.value)}
                        className="w-full bg-bg-elevated border border-border-card rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cli-empresa" className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Empresa</label>
                    <input type="text" id="cli-empresa" placeholder="Nome da empresa" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)}
                      className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="cli-tipo" className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Tipo de Cliente</label>
                  <select id="cli-tipo" value={tipoIndex} onChange={(e) => setTipoIndex(+e.target.value)}
                    className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text outline-none focus:border-primary/50 transition-colors"
                  >
                    {TIPOS_CLIENTE.map((t, i) => <option key={i} value={i}>{t.label} (x{t.value})</option>)}
                  </select>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-bg-card rounded-xl p-6 card-border glow-primary">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text">Servicos</h2>
                <motion.button whileTap={{ scale: 0.95 }} onClick={addItem} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <Plus size={14} /> Adicionar
                </motion.button>
              </div>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-bg-elevated rounded-lg border border-border-card/50">
                    <input
                      className="flex-1 bg-transparent border-none outline-none text-sm text-text placeholder-text-muted min-w-0"
                      placeholder="Descricao do servico"
                      value={item.desc}
                      onChange={(e) => updateItem(i, "desc", e.target.value)}
                    />
                    <input
                      className="w-14 bg-bg-input border border-border-card rounded-md px-2 py-1.5 text-xs text-text text-center"
                      placeholder="Qtd"
                      type="number" min="1"
                      value={item.qtd || ""}
                      onChange={(e) => updateItem(i, "qtd", e.target.value)}
                    />
                    <input
                      className="w-20 bg-bg-input border border-border-card rounded-md px-2 py-1.5 text-xs text-text text-right"
                      placeholder="Valor"
                      type="number" min="0" step="0.01"
                      value={item.unit || ""}
                      onChange={(e) => updateItem(i, "unit", e.target.value)}
                    />
                    <span className="text-xs text-text-muted w-16 text-right font-medium">
                      R$ {(item.qtd * item.unit).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <button onClick={() => removeItem(i)} className="text-text-muted hover:text-danger transition-colors p-1"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-bg-card rounded-xl p-6 card-border glow-primary">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Fatores</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Complexidade", val: cxFactor, set: setCxFactor },
                  { label: "Urgencia", val: urgFactor, set: setUrgFactor },
                  { label: "Frequencia", val: freqFactor, set: setFreqFactor },
                  { label: "Desconto %", val: discount, set: setDiscount, max: 100, step: 1 },
                ].map((f, i) => (
                  <div key={i}>
                    <label className="text-[10px] uppercase tracking-[0.1em] text-text-muted mb-1 block">{f.label}</label>
                    <input
                      type="number" min="0.5" max={f.max || 5} step={f.step || 0.05}
                      value={f.val}
                      onChange={(e) => f.set(parseFloat(e.target.value) || 0)}
                      className="w-full bg-bg-elevated border border-border-card rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-primary/50"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-bg-card rounded-xl p-6 card-border glow-primary">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Observacoes</h2>
              <textarea
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                placeholder="Condicoes de pagamento, prazo de entrega, revisoes..."
                className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-primary/50 resize-none h-20"
              />
            </motion.div>
          </div>

          <div className="lg:sticky lg:top-6 space-y-4">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-bg-card rounded-xl p-6 card-border glow-primary">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-text mb-4">Resumo</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="text-text font-medium">R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Tipo ({TIPOS_CLIENTE[tipoIndex].label})</span>
                  <span className="text-text font-medium">x{fator.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Complexidade</span>
                  <span className="text-text font-medium">x{cxFactor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Urgencia</span>
                  <span className="text-text font-medium">x{urgFactor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Frequencia</span>
                  <span className="text-text font-medium">x{freqFactor.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Desconto</span>
                    <span className="text-danger font-medium">-{discount}%</span>
                  </div>
                )}
                <div className="h-px bg-border-card my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-text font-semibold">Total</span>
                  <span className="font-display text-xl font-bold text-primary glow-primary px-3 py-1 rounded-lg">
                    R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="flex gap-2">
              {["Economico", "Ideal", "Premium"].map((tier, i) => {
                const multipliers = [0.8, 1.0, 1.5];
                const val = subtotal * fator * multipliers[i];
                return (
                  <button key={tier} onClick={() => { setCxFactor(multipliers[i]); }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] transition-all border ${cxFactor === multipliers[i] ? "bg-primary/15 border-primary text-primary" : "bg-bg-elevated border-border-card text-text-muted hover:border-primary/30"}`}
                  >
                    {tier}
                    <span className="block text-[10px] font-normal normal-case mt-0.5 opacity-70">
                      R$ {val.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.97 }} onClick={generatePDF} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm">
                <FileText size={16} /> PDF
              </motion.button>
              {!saved ? (
                <motion.button whileTap={{ scale: 0.97 }} onClick={saveProposal} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm border border-primary/30 text-primary hover:bg-primary/10 transition-all">
                  Salvar
                </motion.button>
              ) : (
                <span className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm bg-success/10 text-success border border-success/30">
                  Salvo
                </span>
              )}
            </div>

            <button onClick={sendWhatsApp} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm border border-primary/30 text-primary hover:bg-primary/10 transition-all">
              <MessageCircle size={16} /> Enviar WhatsApp
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
