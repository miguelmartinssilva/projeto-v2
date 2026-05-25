import { create } from "zustand";
import { format, subDays, subHours, subMinutes, subMonths } from "date-fns";

const PERIODOS = [
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "90d", label: "90 dias" },
  { key: "12m", label: "12 meses" },
];

const RESPONSAVEIS = [
  { id: "v1", nome: "Miguel Martins", avatar: "MM", cor: "#00e676", cargo: "CEO / Designer" },
  { id: "v2", nome: "Ana Silva", avatar: "AS", cor: "#7c3aed", cargo: "Social Media" },
  { id: "v3", nome: "Carlos Oliveira", avatar: "CO", cor: "#448aff", cargo: "Video Editor" },
];

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

function makeRevenueData() {
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = subMonths(now, 11 - i);
    const receita = 8000 + Math.random() * 12000;
    const despesa = 2000 + Math.random() * 5000;
    return {
      mes: MESES[d.getMonth()],
      receita: Math.round(receita),
      despesa: Math.round(despesa),
      lucro: Math.round(receita - despesa),
    };
  });
}

function makeWeeklyData() {
  const DIAS = ["Seg","Ter","Qua","Qui","Sex","Sab","Dom"];
  return DIAS.map(dia => ({
    dia,
    receita: Math.round(500 + Math.random() * 2500),
    despesa: Math.round(200 + Math.random() * 800),
  }));
}

function makeFinanceFlow() {
  return Array.from({ length: 6 }, (_, i) => {
    const m = subMonths(new Date(), 5 - i);
    const entrada = 6000 + Math.random() * 10000;
    const saida = 2000 + Math.random() * 4000;
    return {
      mes: MESES[m.getMonth()],
      entrada: Math.round(entrada),
      saida: Math.round(saida),
      liquido: Math.round(entrada - saida),
    };
  });
}

function makePipelineData() {
  return [
    { etapa: "Lead", valor: 12000, qtd: 8, cor: "#3b82f6" },
    { etapa: "Proposta", valor: 28000, qtd: 5, cor: "#8b5cf6" },
    { etapa: "Negociacao", valor: 18000, qtd: 3, cor: "#f59e0b" },
    { etapa: "Fechado", valor: 42000, qtd: 7, cor: "#22c55e" },
    { etapa: "Perdido", valor: 8000, qtd: 2, cor: "#ef4444" },
  ];
}

function makeVendedorPerformance() {
  return RESPONSAVEIS.map(r => ({
    ...r,
    deals: 3 + Math.floor(Math.random() * 8),
    receita: Math.round(5000 + Math.random() * 15000),
    meta: 20000,
    conversoes: 2 + Math.floor(Math.random() * 6),
  }));
}

const mockNotificacoes = [
  { id: "n1", titulo: "Pagamento recebido", descricao: "Ana Beatriz - R$ 2.000", tipo: "financeiro", lida: false, timestamp: subMinutes(new Date(), 12) },
  { id: "n2", titulo: "Novo lead cadastrado", descricao: "Restaurante Sabor & Arte", tipo: "crm", lida: false, timestamp: subMinutes(new Date(), 45) },
  { id: "n3", titulo: "Deal movido para Fechado", descricao: "Imobiliaria Prime - R$ 5.000", tipo: "comercial", lida: false, timestamp: subHours(new Date(), 2) },
  { id: "n4", titulo: "Tarefa concluida", descricao: "Reels Fernanda Oliveira", tipo: "operacional", lida: true, timestamp: subHours(new Date(), 4) },
  { id: "n5", titulo: "Automacao executada", descricao: "Boas-vindas novo cliente", tipo: "automacao", lida: true, timestamp: subHours(new Date(), 6) },
  { id: "n6", titulo: "Reuniao agendada", descricao: "Follow-up Dr. Marcos - 15:00", tipo: "agenda", lida: true, timestamp: subHours(new Date(), 8) },
  { id: "n7", titulo: "Boleto vencendo", descricao: "Juliana Menezes - R$ 600", tipo: "financeiro", lida: false, timestamp: subHours(new Date(), 1) },
];

const mockAtividades = [
  { id: "at1", tipo: "pagamento", titulo: "Pagamento recebido", descricao: "Ana Beatriz Costa - R$ 2.000", responsavel: "v1", timestamp: subMinutes(new Date(), 12) },
  { id: "at2", tipo: "lead", titulo: "Novo lead", descricao: "Restaurante Sabor & Arte via formulario", responsavel: "v2", timestamp: subMinutes(new Date(), 45) },
  { id: "at3", tipo: "deal", titulo: "Deal fechado", descricao: "Imobiliaria Prime - R$ 5.000", responsavel: "v1", timestamp: subHours(new Date(), 2) },
  { id: "at4", tipo: "tarefa", titulo: "Tarefa concluida", descricao: "Reels Fernanda Oliveira - 2/2", responsavel: "v3", timestamp: subHours(new Date(), 3) },
  { id: "at5", tipo: "automacao", titulo: "Automacao executada", descricao: "WhatsApp boas-vindas enviado", responsavel: null, timestamp: subHours(new Date(), 4) },
  { id: "at6", tipo: "reuniao", titulo: "Reuniao finalizada", descricao: "Follow-up Dr. Marcos Ribeiro", responsavel: "v1", timestamp: subHours(new Date(), 5) },
  { id: "at7", tipo: "pagamento", titulo: "Pagamento pendente", descricao: "Juliana Menezes - R$ 600", responsavel: "v1", timestamp: subHours(new Date(), 6) },
  { id: "at8", tipo: "lead", titulo: "Lead qualificado", descricao: "Clinica Saude Total - R$ 1.200/mes", responsavel: "v2", timestamp: subHours(new Date(), 8) },
  { id: "at9", tipo: "deal", titulo: "Proposta enviada", descricao: "Academia Fit Life - R$ 1.500", responsavel: "v1", timestamp: subHours(new Date(), 10) },
  { id: "at10", tipo: "tarefa", titulo: "Tarefa criada", descricao: "Criar 12 posts - Academia Corpo Livre", responsavel: "v2", timestamp: subHours(new Date(), 12) },
];

const mockAgendaHoje = [
  { id: "ag1", titulo: "Reuniao com Fernanda Oliveira", hora: "09:00", tipo: "reuniao", cliente: "Fernanda Oliveira" },
  { id: "ag2", titulo: "Entrega Reels - Ana Beatriz", hora: "11:00", tipo: "entrega", cliente: "Ana Beatriz Costa" },
  { id: "ag3", titulo: "Follow-up Dr. Marcos", hora: "15:00", tipo: "followup", cliente: "Dr. Marcos Ribeiro" },
  { id: "ag4", titulo: "Planejamento semanal equipe", hora: "16:30", tipo: "interno", cliente: null },
];

const mockClientesRecentes = [
  { id: "cr1", nome: "Academia Corpo Livre", plano: "basico", valor: 600, status: "novo", data: subDays(new Date(), 2) },
  { id: "cr2", nome: "Juliana Menezes", plano: "basico", valor: 600, status: "ativo", data: subDays(new Date(), 5) },
  { id: "cr3", nome: "Fernanda Oliveira", plano: "premium", valor: 2000, status: "ativo", data: subDays(new Date(), 12) },
  { id: "cr4", nome: "Carlos Eduardo Santos", plano: "padrao", valor: 1200, status: "ativo", data: subDays(new Date(), 18) },
  { id: "cr5", nome: "Ana Beatriz Costa", plano: "premium", valor: 2000, status: "ativo", data: subDays(new Date(), 25) },
];

const mockFinanceiroResumo = {
  saldoAtual: 28450,
  receitasMes: 12400,
  despesasMes: 4280,
  lucroLiquido: 8120,
  contasPendentes: 3,
  contasVencer: 2,
  projecaoMes: 15600,
};

const mockCrmResumo = {
  leadsMes: 12,
  clientesAtivos: 8,
  negociacoes: 6,
  followupsHoje: 3,
  conversao: 67,
  novosLeads: 4,
};

const mockAnalyticsResumo = {
  acessosHoje: 47,
  acessosSemana: 312,
  produtividade: 84,
  tarefasConcluidas: 28,
  tarefasPendentes: 5,
  crescimento: 12,
};

const useDashboardStore = create((set, get) => ({
  periodo: "30d",
  search: "",
  responsavelFilter: "todos",
  loading: true,
  toast: null,
  notificacoes: [],
  notifOpen: false,
  revenueData: [],
  weeklyData: [],
  financeFlow: [],
  pipelineData: [],
  vendedorPerformance: [],
  atividades: [],
  agendaHoje: [],
  clientesRecentes: [],
  financeiroResumo: {},
  crmResumo: {},
  analyticsResumo: {},

  init: () => {
    set({
      revenueData: makeRevenueData(),
      weeklyData: makeWeeklyData(),
      financeFlow: makeFinanceFlow(),
      pipelineData: makePipelineData(),
      vendedorPerformance: makeVendedorPerformance(),
      notificacoes: mockNotificacoes,
      atividades: mockAtividades,
      agendaHoje: mockAgendaHoje,
      clientesRecentes: mockClientesRecentes,
      financeiroResumo: mockFinanceiroResumo,
      crmResumo: mockCrmResumo,
      analyticsResumo: mockAnalyticsResumo,
      loading: false,
    });
  },

  setPeriodo: (p) => set({ periodo: p }),
  setSearch: (s) => set({ search: s }),
  setResponsavelFilter: (f) => set({ responsavelFilter: f }),
  toggleNotif: () => set(s => ({ notifOpen: !s.notifOpen })),
  closeNotif: () => set({ notifOpen: false }),
  markAllRead: () => set(s => ({ notificacoes: s.notificacoes.map(n => ({ ...n, lida: true })), notifOpen: false })),

  exportCSV: () => {
    const { revenueData } = get();
    const header = "Mes,Receita,Despesa,Lucro\n";
    const rows = revenueData.map(r => `${r.mes},${r.receita},${r.despesa},${r.lucro}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "dashboard_mm_studio.csv"; a.click();
    URL.revokeObjectURL(url);
    set({ toast: { type: "success", message: "CSV exportado" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  getKPIs: () => {
    const { financeiroResumo: f, crmResumo: c, analyticsResumo: a, vendedorPerformance: vp } = get();
    const metaMes = 30000;
    const metaProgress = Math.min(100, Math.round((f.receitasMes / metaMes) * 100));
    const totalDeals = vp.reduce((s, v) => s + v.deals, 0);
    const totalConversoes = vp.reduce((s, v) => s + v.conversoes, 0);
    return {
      receita: f.receitasMes,
      receitaChange: 24,
      clientes: c.clientesAtivos,
      clientesChange: 42,
      deals: totalDeals,
      dealsChange: 12,
      conversoes: totalConversoes,
      conversoesChange: 8,
      fluxoCaixa: f.lucroLiquido,
      fluxoChange: 18,
      tarefas: a.tarefasPendentes,
      tarefasChange: -15,
      crescimento: a.crescimento,
      crescimentoChange: 5,
      metaProgress,
      metaChange: 10,
    };
  },

  getGreeting: () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  },
}));

export { PERIODOS, RESPONSAVEIS };
export default useDashboardStore;
