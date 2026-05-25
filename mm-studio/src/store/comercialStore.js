import { create } from "zustand";
import { getComercial, saveComercial } from "../utils/storage";

const PIPELINE_STAGES = [
  { key: "novo_lead", label: "Novo Lead", color: "#94a3b8", probability: 10 },
  { key: "primeiro_contato", label: "Primeiro Contato", color: "#3b82f6", probability: 20 },
  { key: "qualificacao", label: "Qualificacao", color: "#8b5cf6", probability: 40 },
  { key: "proposta_enviada", label: "Proposta Enviada", color: "#f59e0b", probability: 60 },
  { key: "negociacao", label: "Negociacao", color: "#f97316", probability: 75 },
  { key: "fechado", label: "Fechado", color: "#22c55e", probability: 100 },
  { key: "perdido", label: "Perdido", color: "#ef4444", probability: 0 },
];

const PRIORITIES = [
  { key: "baixa", label: "Baixa", color: "#94a3b8" },
  { key: "media", label: "Media", color: "#f59e0b" },
  { key: "alta", label: "Alta", color: "#f97316" },
  { key: "critica", label: "Critica", color: "#ef4444" },
];

const VENDEDORES = [
  { id: "v1", nome: "Miguel Martins", avatar: "MM", cor: "#00e676" },
  { id: "v2", nome: "Ana Silva", avatar: "AS", cor: "#7c3aed" },
  { id: "v3", nome: "Carlos Oliveira", avatar: "CO", cor: "#448aff" },
];

const mockDeals = [
  { id: 1, cliente: "Construtora Vale Verde", empresa: "Vale Verde Ltda", telefone: "(31) 99876-5432", email: "contato@valeverde.com", responsavel: "v1", valor: 3200, stage: "negociacao", prioridade: "alta", tags: ["design", "identidade"], criadoEm: "2024-05-10", ultimaInteracao: "2024-05-20", proximaAcao: "Follow-up proposta", probabilidade: 75, dataFechamento: null, observacoes: "Projeto de identidade visual completo", timeline: [{ data: "2024-05-20", tipo: "reuniao", desc: "Reuniao de alinhamento", autor: "Miguel" }, { data: "2024-05-15", tipo: "proposta", desc: "Proposta enviada - R$ 3.200", autor: "Miguel" }, { data: "2024-05-10", tipo: "contato", desc: "Primeiro contato via Instagram", autor: "Ana" }], tarefas: [{ id: 1, desc: "Follow-up proposta", prazo: "2024-05-25", done: false }, { id: 2, desc: "Enviar portfolio atualizado", prazo: "2024-05-22", done: true }], propostas: [{ id: 1, titulo: "Identidade Visual Completa", valor: 3200, status: "enviada", data: "2024-05-15" }] },
  { id: 2, cliente: "Clinica Bem Estar", empresa: "Bem Estar Saude", telefone: "(31) 98765-4321", email: "marketing@bemestar.com", responsavel: "v1", valor: 4800, stage: "proposta_enviada", prioridade: "alta", tags: ["video", "institucional"], criadoEm: "2024-05-05", ultimaInteracao: "2024-05-18", proximaAcao: "Ligacao para follow-up", probabilidade: 60, dataFechamento: null, observacoes: "Video institucional + social media", timeline: [{ data: "2024-05-18", tipo: "proposta", desc: "Proposta enviada - R$ 4.800", autor: "Miguel" }, { data: "2024-05-12", tipo: "reuniao", desc: "Reuniao de briefing", autor: "Miguel" }], tarefas: [{ id: 3, desc: "Agendar reuniao de apresentacao", prazo: "2024-05-23", done: false }], propostas: [{ id: 2, titulo: "Video Institucional + Social Media", valor: 4800, status: "enviada", data: "2024-05-18" }] },
  { id: 3, cliente: "Agencia Ponto Digital", empresa: "Ponto Digital", telefone: "(31) 97654-3210", email: "criativo@ponto.com", responsavel: "v2", valor: 960, stage: "qualificacao", prioridade: "media", tags: ["social media", "pacote"], criadoEm: "2024-05-15", ultimaInteracao: "2024-05-22", proximaAcao: "Enviar proposta pacote", probabilidade: 40, dataFechamento: null, observacoes: "Pack social media mensal", timeline: [{ data: "2024-05-22", tipo: "contato", desc: "Primeiro contato via Instagram", autor: "Ana" }], tarefas: [], propostas: [] },
  { id: 4, cliente: "Studio K Arquitetura", empresa: "Studio K", telefone: "(31) 96543-2109", email: "karla@studiok.com", responsavel: "v1", valor: 680, stage: "novo_lead", prioridade: "baixa", tags: ["motion", "logo"], criadoEm: "2024-05-23", ultimaInteracao: "2024-05-23", proximaAcao: "Qualificar lead", probabilidade: 10, dataFechamento: null, observacoes: "Motion logo - interesse inicial", timeline: [{ data: "2024-05-23", tipo: "contato", desc: "Lead via formulario do site", autor: "Miguel" }], tarefas: [], propostas: [] },
  { id: 5, cliente: "Loja Urbana Moda", empresa: "Urbana Moda", telefone: "(31) 95432-1098", email: "comercial@urbana.com", responsavel: "v1", valor: 4800, stage: "fechado", prioridade: "media", tags: ["pacote", "social media"], criadoEm: "2024-04-01", ultimaInteracao: "2024-05-10", proximaAcao: null, probabilidade: 100, dataFechamento: "2024-05-10", observacoes: "Cliente fixo - pacote mensal", timeline: [{ data: "2024-05-10", tipo: "fechamento", desc: "Fechamento - R$ 4.800/mes", autor: "Miguel" }], tarefas: [], propostas: [{ id: 3, titulo: "Pacote Social Media Mensal", valor: 4800, status: "aprovada", data: "2024-05-08" }] },
  { id: 6, cliente: "Restaurante Sabor", empresa: "Sabor & Cia", telefone: "(31) 94321-0987", email: "contato@sabor.com", responsavel: "v2", valor: 2400, stage: "perdido", prioridade: "baixa", tags: ["design", "cardapio"], criadoEm: "2024-04-10", ultimaInteracao: "2024-04-28", proximaAcao: null, probabilidade: 0, dataFechamento: null, observacoes: "Nao prosseguiu - orcamento acima do esperado", timeline: [{ data: "2024-04-28", tipo: "perdido", desc: "Proposta recusada - orcamento", autor: "Ana" }], tarefas: [], propostas: [{ id: 4, titulo: "Design Cardapio + Branding", valor: 2400, status: "recusada", data: "2024-04-20" }] },
  { id: 7, cliente: "TechStart Inc", empresa: "TechStart", telefone: "(11) 99123-4567", email: "ceo@techstart.io", responsavel: "v1", valor: 8500, stage: "primeiro_contato", prioridade: "critica", tags: ["site", "startup", "branding"], criadoEm: "2024-05-24", ultimaInteracao: "2024-05-24", proximaAcao: "Agendar reuniao de briefing", probabilidade: 20, dataFechamento: null, observacoes: "Startup de tech - interesse em site + branding", timeline: [{ data: "2024-05-24", tipo: "contato", desc: "Indicacao de parceria", autor: "Miguel" }], tarefas: [{ id: 4, desc: "Agendar reuniao de briefing", prazo: "2024-05-27", done: false }], propostas: [] },
  { id: 8, cliente: "Dr. Marcos Saude", empresa: "Consultorio Dr. Marcos", telefone: "(31) 91234-5678", email: "drmarcos@gmail.com", responsavel: "v1", valor: 1500, stage: "negociacao", prioridade: "media", tags: ["design", "social media"], criadoEm: "2024-05-08", ultimaInteracao: "2024-05-21", proximaAcao: "Enviar proposta revisada", probabilidade: 75, dataFechamento: null, observacoes: "Social media + identidade visual consultorio", timeline: [{ data: "2024-05-21", tipo: "reuniao", desc: "Reuniao presencial", autor: "Miguel" }], tarefas: [{ id: 5, desc: "Enviar proposta revisada", prazo: "2024-05-26", done: false }], propostas: [{ id: 5, titulo: "Social Media + Identidade Visual", valor: 1500, status: "enviada", data: "2024-05-19" }] },
  { id: 9, cliente: "Academia PowerFit", empresa: "PowerFit Academia", telefone: "(31) 92345-6789", email: "contato@powerfit.com", responsavel: "v3", valor: 2200, stage: "qualificacao", prioridade: "media", tags: ["social media", "fotos"], criadoEm: "2024-05-12", ultimaInteracao: "2024-05-19", proximaAcao: "Enviar proposta mensal", probabilidade: 40, dataFechamento: null, observacoes: "Interesse em pacote mensal de social media + fotos", timeline: [{ data: "2024-05-19", tipo: "contato", desc: "Reuniao por video", autor: "Carlos" }, { data: "2024-05-12", tipo: "contato", desc: "Lead via Google Ads", autor: "Carlos" }], tarefas: [{ id: 6, desc: "Preparar proposta mensal", prazo: "2024-05-24", done: false }], propostas: [] },
  { id: 10, cliente: "Imobiliaria Prime", empresa: "Prime Imoveis", telefone: "(31) 93456-7890", email: "vendas@primeimoveis.com", responsavel: "v2", valor: 6000, stage: "proposta_enviada", prioridade: "alta", tags: ["site", "fotos", "tour-virtual"], criadoEm: "2024-05-02", ultimaInteracao: "2024-05-17", proximaAcao: "Follow-up por telefone", probabilidade: 60, dataFechamento: null, observacoes: "Site + tour virtual 360 + fotos profissionais", timeline: [{ data: "2024-05-17", tipo: "proposta", desc: "Proposta enviada - R$ 6.000", autor: "Ana" }], tarefas: [{ id: 7, desc: "Follow-up por telefone", prazo: "2024-05-24", done: false }], propostas: [{ id: 6, titulo: "Site + Tour Virtual + Fotos", valor: 6000, status: "enviada", data: "2024-05-17" }] },
  { id: 11, cliente: "Petshop Amigo Fiel", empresa: "Amigo Fiel Petshop", telefone: "(31) 94567-8901", email: "contato@amigofiel.com", responsavel: "v1", valor: 1800, stage: "fechado", prioridade: "baixa", tags: ["social media", "pacote"], criadoEm: "2024-04-15", ultimaInteracao: "2024-05-01", proximaAcao: null, probabilidade: 100, dataFechamento: "2024-05-01", observacoes: "Pacote social media mensal assinado", timeline: [{ data: "2024-05-01", tipo: "fechamento", desc: "Fechamento - R$ 1.800/mes", autor: "Miguel" }], tarefas: [], propostas: [{ id: 7, titulo: "Pacote Social Media Petshop", valor: 1800, status: "aprovada", data: "2024-04-28" }] },
  { id: 12, cliente: "Buffet Delicias", empresa: "Delicias Buffet", telefone: "(31) 95678-9012", email: "eventos@delicias.com", responsavel: "v2", valor: 3500, stage: "primeiro_contato", prioridade: "alta", tags: ["cobertura", "video", "fotos"], criadoEm: "2024-05-20", ultimaInteracao: "2024-05-20", proximaAcao: "Enviar portfolio de eventos", probabilidade: 20, dataFechamento: null, observacoes: "Buffet precisa de cobertura de eventos", timeline: [{ data: "2024-05-20", tipo: "contato", desc: "Contato via WhatsApp", autor: "Ana" }], tarefas: [{ id: 8, desc: "Enviar portfolio de eventos", prazo: "2024-05-25", done: false }], propostas: [] },
];

const METAS = {
  mensal: 25000,
  anual: 300000,
  vendasMes: 5,
};

const useComercialStore = create((set, get) => ({
  deals: [],
  search: "",
  view: "pipeline",
  stageFilter: "todos",
  responsavelFilter: "todos",
  prioridadeFilter: "todos",
  selectedDeal: null,
  drawerOpen: false,
  newDealDialogOpen: false,
  editId: null,
  loading: true,
  confirmDialog: null,
  toast: null,

  init: () => {
    const stored = getComercial();
    const deals = stored.length > 0
      ? stored.map(d => ({ ...d, responsavel: d.responsavel || "v1", prioridade: d.prioridade || "media", tags: d.tags || [], timeline: d.timeline || [], tarefas: d.tarefas || [], propostas: d.propostas || [], probabilidade: d.probabilidade ?? PIPELINE_STAGES.find(s => s.key === d.stage)?.probability ?? 10, criadoEm: d.criadoEm || new Date().toISOString().slice(0, 10), ultimaInteracao: d.ultimaInteracao || new Date().toISOString().slice(0, 10) }))
      : mockDeals;
    set({ deals, loading: false });
  },

  setSearch: (s) => set({ search: s }),
  setView: (v) => set({ view: v }),
  setStageFilter: (f) => set({ stageFilter: f }),
  setResponsavelFilter: (f) => set({ responsavelFilter: f }),
  setPrioridadeFilter: (f) => set({ prioridadeFilter: f }),

  openDrawer: (deal) => set({ selectedDeal: deal, drawerOpen: true }),
  closeDrawer: () => set({ selectedDeal: null, drawerOpen: false }),
  openNewDealDialog: (editId = null) => set({ newDealDialogOpen: true, editId }),
  closeNewDealDialog: () => set({ newDealDialogOpen: false, editId: null }),

  addDeal: (deal) => {
    const deals = [...get().deals, { ...deal, id: Date.now(), criadoEm: new Date().toISOString().slice(0, 10), ultimaInteracao: new Date().toISOString().slice(0, 10), timeline: [{ data: new Date().toISOString().slice(0, 10), tipo: "contato", desc: "Negociacao cadastrada", autor: getVendedorName(deal.responsavel) }], tarefas: [], propostas: [], probabilidade: PIPELINE_STAGES.find(s => s.key === deal.stage)?.probability ?? 10 }];
    set({ deals, toast: { type: "success", message: "Negociacao adicionada" } });
    saveComercial(deals);
    setTimeout(() => set({ toast: null }), 3000);
  },

  updateDeal: (id, data) => {
    const deals = get().deals.map(d => d.id === id ? { ...d, ...data } : d);
    set({ deals });
    saveComercial(deals);
    const selected = get().selectedDeal;
    if (selected && selected.id === id) set({ selectedDeal: { ...selected, ...data } });
  },

  deleteDeal: (id) => {
    const deals = get().deals.filter(d => d.id !== id);
    set({ deals, drawerOpen: false, selectedDeal: null, confirmDialog: null, toast: { type: "success", message: "Negociacao removida" } });
    saveComercial(deals);
    setTimeout(() => set({ toast: null }), 3000);
  },

  moveDealStage: (id, newStage) => {
    const stage = PIPELINE_STAGES.find(s => s.key === newStage);
    const deals = get().deals.map(d => {
      if (d.id === id) {
        const timeline = [...(d.timeline || []), { data: new Date().toISOString().slice(0, 10), tipo: "status", desc: `Movido para ${stage?.label || newStage}`, autor: "Sistema" }];
        return { ...d, stage: newStage, probabilidade: stage?.probability ?? d.probabilidade, timeline, ultimaInteracao: new Date().toISOString().slice(0, 10) };
      }
      return d;
    });
    set({ deals });
    saveComercial(deals);
  },

  addTimelineEntry: (id, entry) => {
    const deals = get().deals.map(d => d.id === id ? { ...d, timeline: [...(d.timeline || []), entry], ultimaInteracao: entry.data } : d);
    set({ deals });
    saveComercial(deals);
    const selected = get().selectedDeal;
    if (selected && selected.id === id) set({ selectedDeal: { ...selected, timeline: [...(selected.timeline || []), entry] } });
  },

  addTask: (dealId, task) => {
    const deals = get().deals.map(d => d.id === dealId ? { ...d, tarefas: [...(d.tarefas || []), { ...task, id: Date.now(), done: false }] } : d);
    set({ deals });
    saveComercial(deals);
  },

  toggleTask: (dealId, taskId) => {
    const deals = get().deals.map(d => d.id === dealId ? { ...d, tarefas: (d.tarefas || []).map(t => t.id === taskId ? { ...t, done: !t.done } : t) } : d);
    set({ deals });
    saveComercial(deals);
  },

  showConfirm: (config) => set({ confirmDialog: config }),
  hideConfirm: () => set({ confirmDialog: null }),

  getFilteredDeals: () => {
    const { deals, search, stageFilter, responsavelFilter, prioridadeFilter } = get();
    let list = [...deals];
    if (stageFilter !== "todos") list = list.filter(d => d.stage === stageFilter);
    if (responsavelFilter !== "todos") list = list.filter(d => d.responsavel === responsavelFilter);
    if (prioridadeFilter !== "todos") list = list.filter(d => d.prioridade === prioridadeFilter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(d => d.cliente?.toLowerCase().includes(s) || d.empresa?.toLowerCase().includes(s) || d.email?.toLowerCase().includes(s));
    }
    return list;
  },

  getMetrics: () => {
    const { deals } = get();
    const fechados = deals.filter(d => d.stage === "fechado");
    const ativos = deals.filter(d => !["fechado", "perdido"].includes(d.stage));
    const pipeline = deals.filter(d => !["perdido"].includes(d.stage));
    return {
      receitaTotal: fechados.reduce((s, d) => s + (d.valor || 0), 0),
      negociacoesAtivas: ativos.length,
      conversoes: fechados.length,
      ticketMedio: fechados.length ? fechados.reduce((s, d) => s + (d.valor || 0), 0) / fechados.length : 0,
      metaMensal: METAS.mensal,
      metaAnual: METAS.anual,
      vendasFechadas: fechados.length,
      pipelineValor: pipeline.reduce((s, d) => s + (d.valor || 0), 0),
      taxaConversao: deals.length ? Math.round((fechados.length / deals.length) * 100) : 0,
    };
  },

  getPipelineColumns: () => {
    const deals = get().getFilteredDeals();
    const cols = {};
    PIPELINE_STAGES.forEach(s => { cols[s.key] = deals.filter(d => d.stage === s.key); });
    return cols;
  },

  getRanking: () => {
    const { deals } = get();
    return VENDEDORES.map(v => {
      const fechados = deals.filter(d => d.responsavel === v.id && d.stage === "fechado");
      const ativos = deals.filter(d => d.responsavel === v.id && !["fechado", "perdido"].includes(d.stage));
      return { ...v, vendas: fechados.length, receita: fechados.reduce((s, d) => s + (d.valor || 0), 0), ativos: ativos.length };
    }).sort((a, b) => b.receita - a.receita);
  },

  getFunnelData: () => {
    const { deals } = get();
    return PIPELINE_STAGES.filter(s => s.key !== "perdido").map(s => {
      const count = deals.filter(d => d.stage === s.key).length;
      const total = deals.filter(d => d.stage === s.key).reduce((sum, d) => sum + (d.valor || 0), 0);
      return { ...s, count, total };
    });
  },
}));

function getVendedorName(id) {
  return VENDEDORES.find(v => v.id === id)?.nome || "Miguel";
}

export { PIPELINE_STAGES, PRIORITIES, VENDEDORES, METAS, getVendedorName };
export default useComercialStore;
