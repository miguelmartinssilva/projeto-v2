import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, X, Check, Clock, Edit3, DollarSign, FileText, Calendar, Trash2, CheckCircle } from "lucide-react";
import { getFixos, saveFixo, deleteFixo, getPlanosFixos, savePlanosFixos } from "../utils/storage";



function mesKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; }
function mesLabel(key) { const [a, m] = key.split("-"); const meses = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]; return `${meses[+m - 1]} ${a}`; }
function hojeISO() { return new Date().toISOString().slice(0, 10); }

const statusLabels = { pendente: "Pendente", andamento: "Em andamento", concluido: "Concluido" };
const statusColors = { pendente: "text-pending", andamento: "text-info", concluido: "text-success" };

export default function FixedClients() {
  const [clientes, setClientes] = useState(() => getFixos());
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPlanos, setShowPlanos] = useState(false);
  const [planos, setPlanos] = useState(() => getPlanosFixos());

  const refresh = useCallback(() => {
    const novos = getFixos();
    setClientes(novos);
    setSelected(s => s ? novos.find(c => c.id === s.id) || s : null);
    setPlanos(getPlanosFixos());
  }, []);

  const activeClients = clientes.filter(c => c.ativo !== false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-text-muted">{activeClients.length} cliente{activeClients.length !== 1 ? "s" : ""} fixo{activeClients.length !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-2">
          <motion.button onClick={() => setShowPlanos(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] bg-bg-elevated border border-border-card text-text-secondary hover:text-text transition-colors">
            <Edit3 size={13} /> Planos
          </motion.button>
          <motion.button onClick={() => setShowModal(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-[0.08em] bg-amber text-black hover:bg-amber/80 transition-colors">
            <Plus size={15} /> Novo Cliente Fixo
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
        {activeClients.map(c => {
          const plan = planos[c.plano] || planos.basico;
          const mk = mesKey(new Date());
          const fin = (c.historicoFinanceiro || []).find(h => h.mes === mk);
          const entregas = (c.entregas || {})[mk] || [];
          const totalFeito = entregas.reduce((s, i) => s + (i.feito || 0), 0);
          const totalQtd = entregas.reduce((s, i) => s + (i.qtd || 0), 0);
          return (
            <div key={c.id} className="bg-bg-elevated rounded-lg p-2 border border-border-card text-center">
              <p className="text-[10px] font-semibold text-text truncate">{c.nome.split(" ")[0]}</p>
              <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded-full font-semibold mt-0.5`} style={{ background: plan.bg, color: plan.cor }}>{plan.nome}</span>
              <div className="mt-1 flex items-center justify-center gap-1.5">
                <span className={`text-[10px] ${fin?.status === "pago" ? "text-success" : "text-pending"}`}>
                  {fin?.status === "pago" ? "Pago" : "Aberto"}
                </span>
                {totalQtd > 0 && <span className="text-[9px] text-text-muted">{totalFeito}/{totalQtd}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
        {activeClients.map(c => {
          const plan = planos[c.plano] || planos.basico;
          const now = new Date();
          const mk = mesKey(now);
          const fin = (c.historicoFinanceiro || []).find(h => h.mes === mk);
          const pago = fin?.status === "pago";
          const handleCardDelete = (e) => {
            e.stopPropagation();
            const el = e.currentTarget.closest('[data-delete-id]');
            if (el) el.dataset.deleting = "true";
            setTimeout(() => {
              if (confirm(`Excluir ${c.nome}?`)) { deleteFixo(c.id); setSelected(s => s?.id === c.id ? null : s); refresh(); }
            }, 50);
          };
          return (
            <motion.div key={c.id} data-delete-id={c.id} layout exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelected(selected?.id === c.id ? null : c)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${selected?.id === c.id ? "bg-amber/10 border-amber" : "bg-bg-card border-border-card hover:border-border-light"}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-sm font-bold text-amber flex-shrink-0">
                  {(c.nome || "FC").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-text">{c.nome}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: plan.bg, color: plan.cor }}>{plan.nome}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="text-primary font-display font-bold">R$ {(c.valorMensal || plan.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mes</span>
                    <span className={`flex items-center gap-1 ${pago ? "text-success" : "text-pending"}`}>
                      {pago ? <Check size={12} /> : <Clock size={12} />}
                      {pago ? "Pago" : "Pendente"}
                    </span>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setSelected(selected?.id === c.id ? null : c); }}
                  className="text-xs text-amber hover:underline flex-shrink-0 mt-1">Detalhes</button>
                <button onClick={handleCardDelete}
                  className="text-xs text-danger hover:underline flex-shrink-0 mt-1"><Trash2 size={12} className="inline" /></button>
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
        {activeClients.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-16 text-text-muted">
            <Star size={36} className="mb-3 opacity-20" />
            <p className="text-sm">Nenhum cliente fixo ainda</p>
            <button onClick={() => setShowModal(true)} className="mt-3 text-xs text-amber hover:underline">+ Adicionar primeiro</button>
          </div>
        )}
      </div>

      <ClienteFixoPanel cliente={selected} onClose={() => setSelected(null)} onUpdate={refresh} planos={planos} />
      <NovoFixoModal show={showModal} onClose={() => setShowModal(false)} onCreated={refresh} planos={planos} />
      <PlanosModal key={JSON.stringify(planos)} show={showPlanos} onClose={() => setShowPlanos(false)} onUpdate={refresh} planos={planos} />
    </div>
  );
}

function ClienteFixoPanel({ cliente, onClose, onUpdate, planos }) {
  const [tab, setTab] = useState("plano");
  const [saved, setSaved] = useState(false);
  const timer = useRef(null);

  const showSaved = useCallback(() => {
    setSaved(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setSaved(false), 1500);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const updateCliente = useCallback((updates) => {
    if (!cliente) return;
    const lista = getFixos();
    const idx = lista.findIndex(c => c.id === cliente.id);
    if (idx >= 0) {
      lista[idx] = { ...lista[idx], ...updates };
      saveFixo(lista[idx]);
    }
    onUpdate();
    showSaved();
  }, [cliente, onUpdate, showSaved]);

  if (!cliente) return null;

  return (
    <AnimatePresence>
      {cliente && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-bg-card rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border-card flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-sm font-bold text-amber">
                  {(cliente.nome || "FC").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-text">{cliente.nome}</h2>
                  <p className="text-xs text-text-muted">Cliente Fixo</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {saved && <span className="text-xs text-success font-semibold">Salvo</span>}
                <button onClick={() => { if (confirm(`Excluir ${cliente.nome}?`)) { deleteFixo(cliente.id); onClose(); } }}
                  className="text-text-muted hover:text-danger p-1 transition-transform active:scale-90"><Trash2 size={16} /></button>
                <button onClick={onClose} className="text-text-muted hover:text-text p-1"><X size={18} /></button>
              </div>
            </div>
            <div className="flex gap-1 px-5 pt-4 border-b border-border-card flex-shrink-0 overflow-x-auto">
              {[
                { key: "plano", label: "Plano", icon: Star },
                { key: "entregas", label: "Entregas", icon: FileText },
                { key: "anotacoes", label: "Anotacoes", icon: Edit3 },
                { key: "financeiro", label: "Financeiro", icon: DollarSign },
              ].map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] border-b-2 transition-all ${tab === t.key ? "border-amber text-amber" : "border-transparent text-text-muted hover:text-text"}`}>
                  <t.icon size={13} /> {t.label}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto p-5">
              {tab === "plano" && <PlanoTab cliente={cliente} updateCliente={updateCliente} planos={planos} />}
              {tab === "entregas" && <EntregasTab cliente={cliente} updateCliente={updateCliente} />}
              {tab === "anotacoes" && <AnotacoesTab cliente={cliente} updateCliente={updateCliente} />}
              {tab === "financeiro" && <FinTab cliente={cliente} updateCliente={updateCliente} planos={planos} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PlanoTab({ cliente, updateCliente, planos }) {
  const [plano, setPlano] = useState(cliente.plano || "basico");
  const [valor, setValor] = useState(cliente.valorMensal || planos[cliente.plano]?.valor || 600);
  const [entregas, setEntregas] = useState(cliente.entregasPersonalizadas || planos[plano]?.entregas || []);
  const [inicio, setInicio] = useState(cliente.dataInicio || hojeISO());
  const [vencimento, setVencimento] = useState(cliente.diaVencimento || 5);

  const selectPlano = (key) => {
    setPlano(key);
    if (!cliente.entregasPersonalizadas) setEntregas(planos[key].entregas);
    setValor(planos[key].valor);
  };

  const handleSave = () => {
    updateCliente({ plano, valorMensal: valor, entregasPersonalizadas: entregas, dataInicio: inicio, diaVencimento: vencimento });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(planos).map(([key, p]) => (
          <button key={key} onClick={() => selectPlano(key)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${plano === key ? "border-amber bg-amber/10" : "border-border-card bg-bg-elevated hover:border-border-light"}`}>
            <p className="text-sm font-bold text-text">{p.nome}</p>
            <p className="text-primary font-display text-lg font-bold mt-1">R$ {p.valor}</p>
            <ul className="mt-2 space-y-0.5">
              {p.entregas.map((e, i) => <li key={i} className="text-[10px] text-text-muted">+ {e}</li>)}
            </ul>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Valor Mensal (R$)</label>
          <input type="number" value={valor} onChange={(e) => setValor(+e.target.value)} className="w-full bg-bg-elevated border border-border-card rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-amber/50" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Dia Vencimento</label>
          <input type="number" min="1" max="31" value={vencimento} onChange={(e) => setVencimento(+e.target.value)} className="w-full bg-bg-elevated border border-border-card rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-amber/50" />
        </div>
        <div>
          <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Data Inicio</label>
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="w-full bg-bg-elevated border border-border-card rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-amber/50" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Entregas do Plano</label>
        <div className="space-y-1.5">
          {entregas.map((e, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={e} onChange={(v) => { const c = [...entregas]; c[i] = v.target.value; setEntregas(c); }} className="flex-1 bg-bg-elevated border border-border-card rounded-lg px-3 py-1.5 text-xs text-text outline-none focus:border-amber/50" />
              <button onClick={() => setEntregas(entregas.filter((_, j) => j !== i))} className="text-text-muted hover:text-danger p-1"><X size={13} /></button>
            </div>
          ))}
          <button onClick={() => setEntregas([...entregas, ""])} className="text-xs text-amber hover:underline">+ Adicionar entrega</button>
        </div>
      </div>
      <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-5 py-2 rounded-lg text-sm bg-amber hover:bg-amber/80 text-black"><Check size={15} /> Salvar Plano</button>
    </div>
  );
}

function EntregasTab({ cliente, updateCliente }) {
  const mk = mesKey(new Date());
  const entregasCliente = cliente.entregas || {};
  const mesEntregas = entregasCliente[mk] || [];
  const [itens, setItens] = useState(mesEntregas);

  if (JSON.stringify(itens) !== JSON.stringify(mesEntregas)) setItens(mesEntregas);

  const totalFeito = itens.reduce((s, i) => s + (i.feito || 0), 0);
  const totalQtd = itens.reduce((s, i) => s + (i.qtd || 0), 0);
  const progresso = totalQtd ? Math.round(totalFeito / totalQtd * 100) : 0;

  const saveItens = (novos) => {
    setItens(novos);
    const entregas = { ...(cliente.entregas || {}), [mk]: novos };
    updateCliente({ entregas });
  };

  const toggleStatus = (idx) => {
    const atual = itens[idx].status;
    const next = atual === "concluido" ? "pendente" : atual === "pendente" ? "andamento" : "concluido";
    const novos = itens.map((i, j) => j === idx ? { ...i, status: next } : i);
    saveItens(novos);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-bg-elevated rounded-full h-2 overflow-hidden border border-border-card">
          <div className="h-full bg-amber rounded-full transition-all duration-500" style={{ width: `${progresso}%` }} />
        </div>
        <span className="text-xs text-text-muted font-medium">{totalFeito}/{totalQtd} ({progresso}%)</span>
      </div>

      <div className="space-y-2">
        {itens.map((item, i) => {
          const feito = item.feito || 0;
          const qtd = item.qtd || 1;
          return (
          <div key={i} className="flex items-center gap-2 p-3 bg-bg-elevated rounded-lg border border-border-card/50">
            <button onClick={() => toggleStatus(i)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${item.status === "concluido" ? "bg-success border-success" : "border-border-card hover:border-amber/50"}`}>
              {item.status === "concluido" && <Check size={11} className="text-black" />}
              {item.status === "andamento" && <Clock size={10} className="text-info" />}
            </button>
            <div className="flex-1 min-w-0">
              <input type="text" value={item.desc || ""} onChange={(e) => { const c = [...itens]; c[i] = { ...c[i], desc: e.target.value }; saveItens(c); }} placeholder="Descricao da entrega" className="w-full bg-transparent border-none outline-none text-sm text-text placeholder-text-muted" />
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5 bg-bg-input border border-border-card rounded px-1.5 py-0.5 text-[11px]">
                  <button onClick={() => saveItens(itens.map((j, idx) => idx === i ? { ...j, feito: Math.max(0, (j.feito || 0) - 1) } : j))} className="text-text-muted hover:text-text px-0.5">−</button>
                  <span className="text-text font-medium min-w-[28px] text-center">{feito}/{qtd}</span>
                  <button onClick={() => saveItens(itens.map((j, idx) => idx === i ? { ...j, feito: Math.min(j.qtd || 1, (j.feito || 0) + 1) } : j))} className="text-text-muted hover:text-text px-0.5">+</button>
                </div>
                <span className={`text-[10px] font-medium ${statusColors[item.status]}`}>{statusLabels[item.status]}</span>
                <input type="text" value={item.obs || ""} onChange={(e) => { const c = [...itens]; c[i] = { ...c[i], obs: e.target.value }; saveItens(c); }} placeholder="Obs..." className="flex-1 bg-transparent border-none outline-none text-[11px] text-text-muted placeholder-text-muted" />
              </div>
            </div>
            <button onClick={() => saveItens(itens.filter((_, j) => j !== i))} className="text-text-muted hover:text-danger p-1"><X size={13} /></button>
          </div>
          );
        })}
      </div>

      <button onClick={() => saveItens([...itens, { desc: "", qtd: 1, feito: 0, status: "pendente", obs: "" }])} className="flex items-center gap-1.5 text-xs text-amber hover:underline">
        <Plus size={14} /> Adicionar entrega
      </button>
    </div>
  );
}

function AnotacoesTab({ cliente, updateCliente }) {
  const now = new Date();
  const mkAtual = mesKey(now);
  const anotacoes = useMemo(() => cliente.anotacoes || {}, [cliente.anotacoes]);
  const [mes, setMes] = useState(mkAtual);
  const [texto, setTexto] = useState(anotacoes[mes] || "");
  const debounce = useRef(null);
  const anotacoesRef = useRef(anotacoes);
  const updateRef = useRef(updateCliente);

  useEffect(() => { anotacoesRef.current = anotacoes; updateRef.current = updateCliente; });
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setTexto(anotacoes[mes] || ""); }, [cliente.id, mes, anotacoes]);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      const novas = { ...(anotacoesRef.current || {}), [mes]: texto };
      updateRef.current({ anotacoes: novas });
    }, 600);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [texto, mes]);

  const mesesDisponiveis = Object.keys(anotacoes).sort().reverse();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-text-muted" />
        <select value={mes} onChange={(e) => setMes(e.target.value)} className="bg-bg-elevated border border-border-card rounded-lg px-3 py-1.5 text-xs text-text outline-none">
          <option value={mkAtual}>{mesLabel(mkAtual)} (atual)</option>
          {mesesDisponiveis.filter(m => m !== mkAtual).map(m => <option key={m} value={m}>{mesLabel(m)}</option>)}
        </select>
      </div>
      <textarea value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Anotacoes sobre o cliente..."
        className="w-full bg-bg-elevated border border-border-card rounded-lg px-4 py-3 text-sm text-text placeholder-text-muted outline-none focus:border-amber/50 resize-none min-h-[200px]" />
      <p className="text-[10px] text-text-muted">Salvo automaticamente</p>
    </div>
  );
}

function FinTab({ cliente, updateCliente, planos }) {
  const historico = useMemo(() => cliente.historicoFinanceiro || [], [cliente.historicoFinanceiro]);
  const totalRecebido = historico.filter(h => h.status === "pago").reduce((s, h) => s + (h.valor || 0), 0);
  const marcarPago = (mes) => {
    const novos = historico.map(h => h.mes === mes ? { ...h, status: "pago", dataPagamento: hojeISO() } : h);
    updateCliente({ historicoFinanceiro: novos });
  };

  useEffect(() => {
    if (historico.some(h => h.mes === mesKey(new Date()))) return;
    const mk = mesKey(new Date());
    const novos = [...historico, { mes: mk, valor: cliente.valorMensal || planos[cliente.plano]?.valor || 600, status: "pendente", dataPagamento: null }];
    updateCliente({ historicoFinanceiro: novos });
  }, [historico, updateCliente, cliente.valorMensal, cliente.plano, planos]);

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-[10px] uppercase tracking-[0.1em] border-b border-border-card">
                <th className="text-left pb-2 font-medium">Competencia</th>
                <th className="text-right pb-2 font-medium">Valor</th>
                <th className="text-center pb-2 font-medium">Status</th>
                <th className="text-right pb-2 font-medium">Pagamento</th>
                <th className="text-center pb-2 font-medium">Acao</th>
              </tr>
            </thead>
          <tbody>
            {historico.sort((a, b) => b.mes.localeCompare(a.mes)).map(h => (
              <tr key={h.mes} className="border-b border-border-card/30">
                <td className="py-2.5 text-text font-medium text-xs">{mesLabel(h.mes)}</td>
                <td className="py-2.5 text-right text-text font-display font-semibold">R$ {(h.valor || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                <td className="py-2.5 text-center">
                  <span className={`text-[10px] font-semibold ${h.status === "pago" ? "text-success" : "text-pending"}`}>
                    {h.status === "pago" ? "Pago" : "Pendente"}
                  </span>
                </td>
                <td className="py-2.5 text-right text-xs text-text-muted">{h.status === "pago" ? h.dataPagamento : "—"}</td>
                <td className="py-2.5 text-center">
                  {h.status !== "pago" && (
                    <button onClick={() => marcarPago(h.mes)} className="text-success hover:text-success/70 transition-colors p-1" title="Marcar como pago"><CheckCircle size={15} /></button>
                  )}
                </td>
              </tr>
            ))}
            {historico.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-xs text-text-muted">Nenhum registro</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-border-card">
        <span className="text-xs text-text-muted">Total Recebido</span>
        <span className="text-primary font-display font-bold">R$ {totalRecebido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}

function NovoFixoModal({ show, onClose, onCreated, planos }) {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [plano, setPlano] = useState("basico");
  const [valor, setValor] = useState(planos.basico.valor);
  const [vencimento, setVencimento] = useState(5);

  const handleSave = () => {
    if (!nome.trim()) return;
    const obj = {
      id: Date.now(),
      nome: nome.trim(),
      whatsapp,
      plano,
      valorMensal: valor,
      diaVencimento: vencimento,
      dataInicio: hojeISO(),
      ativo: true,
      entregas: {},
      anotacoes: {},
      historicoFinanceiro: [{ mes: mesKey(new Date()), valor, status: "pendente", dataPagamento: null }],
    };
    saveFixo(obj);
    onCreated();
    onClose();
    setNome(""); setWhatsapp(""); setPlano("basico"); setValor(planos.basico.valor);
  };

  if (!show) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-bg-card rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-display font-bold text-text">Novo Cliente Fixo</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text p-1"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do cliente" className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-amber/50" />
          </div>
          <div>
            <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">WhatsApp</label>
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(99) 99999-0000" className="w-full bg-bg-elevated border border-border-card rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-muted outline-none focus:border-amber/50" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(planos).map(([key, p]) => (
              <button key={key} onClick={() => { setPlano(key); setValor(p.valor); }}
                className={`p-3 rounded-xl border text-center transition-all ${plano === key ? "border-amber bg-amber/10" : "border-border-card bg-bg-elevated"}`}>
                <p className="text-xs font-bold text-text">{p.nome}</p>
                <p className="text-primary text-xs font-bold mt-0.5">R$ {p.valor}</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Valor (R$)</label>
              <input type="number" value={valor} onChange={(e) => setValor(+e.target.value)} className="w-full bg-bg-elevated border border-border-card rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-amber/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-secondary uppercase tracking-[0.08em] mb-1.5 block">Dia Vencimento</label>
              <input type="number" min="1" max="31" value={vencimento} onChange={(e) => setVencimento(+e.target.value)} className="w-full bg-bg-elevated border border-border-card rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-amber/50" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border-card text-text-secondary hover:text-text text-sm">Cancelar</button>
            <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-amber text-black hover:bg-amber/80 text-sm font-semibold">Salvar</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PlanosModal({ show, onClose, onUpdate, planos }) {
  const [edit, setEdit] = useState(() => JSON.parse(JSON.stringify(planos)));



  const handleSave = () => {
    savePlanosFixos(edit);
    onUpdate();
    onClose();
  };

  if (!show) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-bg-card rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border-card flex-shrink-0">
          <h2 className="text-lg font-display font-bold text-text">Gerenciar Planos</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text p-1"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-auto p-5 space-y-4">
          {Object.entries(edit).map(([key, p]) => (
            <div key={key} className="bg-bg-elevated rounded-xl p-5 border border-border-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.cor }} />
                <input type="text" value={p.nome} onChange={(e) => setEdit(prev => ({ ...prev, [key]: { ...prev[key], nome: e.target.value } }))}
                  className="bg-transparent border-b border-border-card text-lg font-display font-bold text-text outline-none focus:border-amber/50 px-1 py-0.5" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.1em] text-text-muted font-medium block mb-1">Valor (R$)</label>
                  <input type="number" value={p.valor} onChange={(e) => setEdit(prev => ({ ...prev, [key]: { ...prev[key], valor: +e.target.value } }))}
                    className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-amber/50" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.1em] text-text-muted font-medium block mb-1">Cor</label>
                  <input type="color" value={p.cor} onChange={(e) => setEdit(prev => ({ ...prev, [key]: { ...prev[key], cor: e.target.value } }))}
                    className="w-full h-9 bg-bg-input border border-border-card rounded-lg cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.1em] text-text-muted font-medium block mb-2">Entregas</label>
                <div className="space-y-1.5">
                  {p.entregas.map((e, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="text" value={e} onChange={(v) => setEdit(prev => {
                        const c = [...prev[key].entregas]; c[i] = v.target.value;
                        return { ...prev, [key]: { ...prev[key], entregas: c } };
                      })} className="flex-1 bg-bg-input border border-border-card rounded-lg px-3 py-1.5 text-xs text-text outline-none focus:border-amber/50" />
                      <button onClick={() => setEdit(prev => ({ ...prev, [key]: { ...prev[key], entregas: prev[key].entregas.filter((_, j) => j !== i) } }))}
                        className="text-text-muted hover:text-danger p-1"><X size={13} /></button>
                    </div>
                  ))}
                  <button onClick={() => setEdit(prev => ({ ...prev, [key]: { ...prev[key], entregas: [...prev[key].entregas, ""] } }))}
                    className="text-xs text-amber hover:underline">+ Adicionar entrega</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 p-5 border-t border-border-card flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border-card text-text-secondary hover:text-text text-sm">Cancelar</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-amber text-black hover:bg-amber/80 text-sm font-semibold">Salvar Planos</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
