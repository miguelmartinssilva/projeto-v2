import { create } from "zustand";
import { format, subMonths, subDays } from "date-fns";

const PERIODOS = [
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "90d", label: "90 dias" },
  { key: "12m", label: "12 meses" },
  { key: "24m", label: "24 meses" },
];

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const VENDEDORES = [
  { id: "v1", nome: "Miguel Martins", avatar: "MM", cor: "#00e676", cargo: "CEO / Designer" },
  { id: "v2", nome: "Ana Silva", avatar: "AS", cor: "#7c3aed", cargo: "Social Media" },
  { id: "v3", nome: "Carlos Oliveira", avatar: "CO", cor: "#448aff", cargo: "Video Editor" },
];

const CATEGORIAS_METRICA = [
  { key: "comercial", label: "Comercial", color: "#00e676", bg: "#00e67618" },
  { key: "financeiro", label: "Financeiro", color: "#22c55e", bg: "#22c55e18" },
  { key: "crm", label: "CRM", color: "#3b82f6", bg: "#3b82f618" },
  { key: "operacional", label: "Operacional", color: "#f59e0b", bg: "#f59e0b18" },
  { key: "marketing", label: "Marketing", color: "#ec4899", bg: "#ec489918" },
  { key: "produto", label: "Produto", color: "#8b5cf6", bg: "#8b5cf618" },
];

const STATUS_META = [
  { key: "acima", label: "Acima da Meta", color: "#22c55e", bg: "#22c55e18" },
  { key: "dentro", label: "Dentro da Meta", color: "#3b82f6", bg: "#3b82f618" },
  { key: "abaixo", label: "Abaixo da Meta", color: "#f59e0b", bg: "#f59e0b18" },
  { key: "critico", label: "Critico", color: "#ef4444", bg: "#ef444418" },
];

function makeMonthlyData(months) {
  const now = new Date();
  const data = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = subMonths(now, i);
    const m = d.getMonth();
    const y = d.getFullYear();
    const receita = 8000 + Math.random() * 12000;
    const despesa = 2000 + Math.random() * 5000;
    const leads = 8 + Math.floor(Math.random() * 20);
    const conversoes = 2 + Math.floor(Math.random() * 8);
    data.push({
      mes: MESES[m],
      mesIndex: m,
      ano: y,
      receita: Math.round(receita),
      despesa: Math.round(despesa),
      lucro: Math.round(receita - despesa),
      leads,
      conversoes,
      ticketMedio: Math.round(receita / Math.max(conversoes, 1)),
      clientesAtivos: 6 + Math.floor(Math.random() * 6),
      novosClientes: 1 + Math.floor(Math.random() * 4),
      churn: Math.random() < 0.3 ? 1 : 0,
      acessos: 120 + Math.floor(Math.random() * 300),
      acoes: 50 + Math.floor(Math.random() * 150),
      produtividade: 65 + Math.floor(Math.random() * 30),
    });
  }
  return data;
}

function makeVendedorPerformance() {
  return VENDEDORES.map(v => ({
    ...v,
    receita: 3000 + Math.floor(Math.random() * 15000),
    leads: 5 + Math.floor(Math.random() * 20),
    conversoes: 2 + Math.floor(Math.random() * 8),
    meta: 10000,
    ticketMedio: 800 + Math.floor(Math.random() * 2000),
  }));
}

function makeFunnelData() {
  return [
    { etapa: "Leads", valor: 156, color: "#3b82f6" },
    { etapa: "Contato", valor: 98, color: "#8b5cf6" },
    { etapa: "Proposta", valor: 52, color: "#f59e0b" },
    { etapa: "Negociacao", valor: 31, color: "#ec4899" },
    { etapa: "Fechado", valor: 18, color: "#22c55e" },
  ];
}

function makeInsights() {
  return [
    { id: "i1", tipo: "positivo", titulo: "Receita em alta", descricao: "Receita cresceu 23% comparado ao mes anterior", icone: "TrendingUp", prioridade: "alta" },
    { id: "i2", tipo: "alerta", titulo: "Churn aumentou", descricao: "2 clientes cancelaram nos ultimos 30 dias", icone: "AlertTriangle", prioridade: "alta" },
    { id: "i3", tipo: "positivo", titulo: "Melhor vendedor", descricao: "Miguel fechou 8 deals este mes, 40% acima da meta", icone: "Award", prioridade: "media" },
    { id: "i4", tipo: "neutro", titulo: "Ticket medio estavel", descricao: "Ticket medio se manteve em R$ 1.200 nos ultimos 3 meses", icone: "BarChart3", prioridade: "baixa" },
    { id: "i5", tipo: "positivo", titulo: "Novos clientes", descricao: "4 novos clientes adquiridos este mes, melhor resultado do trimestre", icone: "UserPlus", prioridade: "media" },
    { id: "i6", tipo: "alerta", titulo: "Despesas acima", descricao: "Despesas operacionais 15% acima do orcamento", icone: "TrendingDown", prioridade: "alta" },
    { id: "i7", tipo: "positivo", titulo: "Produtividade alta", descricao: "Produtividade da equipe atingiu 87%, maior do ano", icone: "Zap", prioridade: "media" },
    { id: "i8", tipo: "neutro", titulo: "Conversao estavel", descricao: "Taxa de conversao se manteve em 12% nos ultimos 2 meses", icone: "Target", prioridade: "baixa" },
  ];
}

function makeMetricsRows() {
  return [
    { id: "m1", metrica: "Receita Mensal", categoria: "financeiro", valorAtual: 15200, valorAnterior: 12400, crescimento: 22.6, tendencia: "alta", status: "acima", responsavel: "v1", meta: 12000 },
    { id: "m2", metrica: "Despesas Operacionais", categoria: "financeiro", valorAtual: 5800, valorAnterior: 5200, crescimento: 11.5, tendencia: "alta", status: "dentro", responsavel: "v1", meta: 6000 },
    { id: "m3", metrica: "Lucro Liquido", categoria: "financeiro", valorAtual: 9400, valorAnterior: 7200, crescimento: 30.6, tendencia: "alta", status: "acima", responsavel: "v1", meta: 8000 },
    { id: "m4", metrica: "Leads Gerados", categoria: "comercial", valorAtual: 42, valorAnterior: 35, crescimento: 20.0, tendencia: "alta", status: "acima", responsavel: "v2", meta: 30 },
    { id: "m5", metrica: "Conversoes", categoria: "comercial", valorAtual: 8, valorAnterior: 6, crescimento: 33.3, tendencia: "alta", status: "acima", responsavel: "v1", meta: 7 },
    { id: "m6", metrica: "Taxa Conversao", categoria: "comercial", valorAtual: 19.0, valorAnterior: 17.1, crescimento: 11.1, tendencia: "alta", status: "dentro", responsavel: "v1", meta: 20 },
    { id: "m7", metrica: "Ticket Medio", categoria: "comercial", valorAtual: 1900, valorAnterior: 2066, crescimento: -8.0, tendencia: "baixa", status: "dentro", responsavel: "v1", meta: 2000 },
    { id: "m8", metrica: "Clientes Ativos", categoria: "crm", valorAtual: 12, valorAnterior: 10, crescimento: 20.0, tendencia: "alta", status: "acima", responsavel: "v2", meta: 10 },
    { id: "m9", metrica: "Retencao", categoria: "crm", valorAtual: 91.7, valorAnterior: 95.0, crescimento: -3.5, tendencia: "baixa", status: "abaixo", responsavel: "v2", meta: 95 },
    { id: "m10", metrica: "Churn Rate", categoria: "crm", valorAtual: 8.3, valorAnterior: 5.0, crescimento: 66.0, tendencia: "alta", status: "critico", responsavel: "v1", meta: 5 },
    { id: "m11", metrica: "Produtividade", categoria: "operacional", valorAtual: 87, valorAnterior: 78, crescimento: 11.5, tendencia: "alta", status: "acima", responsavel: "v3", meta: 80 },
    { id: "m12", metrica: "Tarefas Concluidas", categoria: "operacional", valorAtual: 34, valorAnterior: 28, crescimento: 21.4, tendencia: "alta", status: "acima", responsavel: "v3", meta: 30 },
    { id: "m13", metrica: "ROI", categoria: "financeiro", valorAtual: 262, valorAnterior: 238, crescimento: 10.1, tendencia: "alta", status: "acima", responsavel: "v1", meta: 200 },
    { id: "m14", metrica: "CAC", categoria: "marketing", valorAtual: 450, valorAnterior: 520, crescimento: -13.5, tendencia: "baixa", status: "acima", responsavel: "v2", meta: 500 },
    { id: "m15", metrica: "LTV", categoria: "marketing", valorAtual: 8400, valorAnterior: 7800, crescimento: 7.7, tendencia: "alta", status: "dentro", responsavel: "v1", meta: 9000 },
  ];
}

const mockMonthly = makeMonthlyData(24);
const mockVendedorPerf = makeVendedorPerformance();
const mockFunnel = makeFunnelData();
const mockInsights = makeInsights();
const mockMetricsRows = makeMetricsRows();

const useAnalyticsStore = create((set, get) => ({
  periodo: "12m",
  view: "dashboard",
  search: "",
  catFilter: "todos",
  statusFilter: "todos",
  responsavelFilter: "todos",
  loading: true,
  toast: null,
  confirmDialog: null,

  monthlyData: [],
  vendedorPerformance: [],
  funnelData: [],
  insights: [],
  metricsRows: [],

  init: () => {
    const p = get().periodo;
    const months = p === "7d" ? 1 : p === "30d" ? 3 : p === "90d" ? 6 : p === "12m" ? 12 : 24;
    set({
      monthlyData: mockMonthly.slice(-months),
      vendedorPerformance: mockVendedorPerf,
      funnelData: mockFunnel,
      insights: mockInsights,
      metricsRows: mockMetricsRows,
      loading: false,
    });
  },

  setPeriodo: (p) => {
    const months = p === "7d" ? 1 : p === "30d" ? 3 : p === "90d" ? 6 : p === "12m" ? 12 : 24;
    set({ periodo: p, monthlyData: mockMonthly.slice(-months) });
  },
  setView: (v) => set({ view: v }),
  setSearch: (s) => set({ search: s }),
  setCatFilter: (f) => set({ catFilter: f }),
  setStatusFilter: (f) => set({ statusFilter: f }),
  setResponsavelFilter: (f) => set({ responsavelFilter: f }),

  getKPIs: () => {
    const { monthlyData } = get();
    if (!monthlyData.length) return {};
    const cur = monthlyData[monthlyData.length - 1];
    const prev = monthlyData.length > 1 ? monthlyData[monthlyData.length - 2] : cur;
    const totalReceita = monthlyData.reduce((s, m) => s + m.receita, 0);
    const totalDespesa = monthlyData.reduce((s, m) => s + m.despesa, 0);
    const receitaChange = prev.receita ? +((cur.receita - prev.receita) / prev.receita * 100).toFixed(1) : 0;
    const lucroChange = prev.lucro ? +((cur.lucro - prev.lucro) / Math.abs(prev.lucro) * 100).toFixed(1) : 0;
    const leadsChange = prev.leads ? +((cur.leads - prev.leads) / prev.leads * 100).toFixed(1) : 0;
    const convChange = prev.conversoes ? +((cur.conversoes - prev.conversoes) / prev.conversoes * 100).toFixed(1) : 0;
    const ticketChange = prev.ticketMedio ? +((cur.ticketMedio - prev.ticketMedio) / prev.ticketMedio * 100).toFixed(1) : 0;
    const roi = totalDespesa ? Math.round(((totalReceita - totalDespesa) / totalDespesa) * 100) : 0;
    const clientChange = prev.clientesAtivos ? +((cur.clientesAtivos - prev.clientesAtivos) / prev.clientesAtivos * 100).toFixed(1) : 0;
    const totalConv = monthlyData.reduce((s, m) => s + m.conversoes, 0);
    const totalLeads = monthlyData.reduce((s, m) => s + m.leads, 0);
    const convRate = totalLeads ? +((totalConv / totalLeads) * 100).toFixed(1) : 0;
    const prodChange = prev.produtividade ? +(cur.produtividade - prev.produtividade).toFixed(1) : 0;
    return {
      receita: cur.receita, receitaChange,
      lucro: cur.lucro, lucroChange,
      leads: cur.leads, leadsChange,
      conversoes: cur.conversoes, convChange,
      ticketMedio: cur.ticketMedio, ticketChange,
      roi, roiChange: 10.1,
      clientesAtivos: cur.clientesAtivos, clientChange,
      convRate,
      produtividade: cur.produtividade, prodChange,
      totalReceita, totalDespesa,
    };
  },

  getFilteredRows: () => {
    const { metricsRows, search, catFilter, statusFilter, responsavelFilter } = get();
    let list = [...metricsRows];
    if (catFilter !== "todos") list = list.filter(r => r.categoria === catFilter);
    if (statusFilter !== "todos") list = list.filter(r => r.status === statusFilter);
    if (responsavelFilter !== "todos") list = list.filter(r => r.responsavel === responsavelFilter);
    if (search) { const s = search.toLowerCase(); list = list.filter(r => r.metrica?.toLowerCase().includes(s) || r.categoria?.toLowerCase().includes(s)); }
    return list;
  },

  exportCSV: () => {
    const rows = get().getFilteredRows();
    const csv = ["Metrica,Categoria,Valor Atual,Valor Anterior,Crescimento,Tendencia,Status,Responsavel",
      ...rows.map(r => `"${r.metrica}",${r.categoria},${r.valorAtual},${r.valorAnterior},${r.crescimento}%,${r.tendencia},${r.status},${VENDEDORES.find(v => v.id === r.responsavel)?.nome || r.responsavel}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "analytics.csv"; a.click();
    URL.revokeObjectURL(url);
    set({ toast: { type: "success", message: "CSV exportado" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  hideConfirm: () => set({ confirmDialog: null }),
}));

export { PERIODOS, MESES, VENDEDORES, CATEGORIAS_METRICA, STATUS_META };
export default useAnalyticsStore;
