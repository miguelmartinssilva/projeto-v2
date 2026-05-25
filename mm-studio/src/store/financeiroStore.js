import { create } from "zustand";
import { getTransactions, saveTransactions, getDespesas, saveDespesa, deleteDespesa } from "../utils/storage";

const TIPO_CONFIG = {
  entrada: { label: "Entrada", color: "#22c55e", bg: "#22c55e18", icon: "↑" },
  saida: { label: "Saida", color: "#ff4d6d", bg: "#ff4d6d18", icon: "↓" },
};

const STATUS_CONFIG = {
  pago: { label: "Pago", color: "#22c55e", bg: "#22c55e18" },
  pendente: { label: "Pendente", color: "#f59e0b", bg: "#f59e0b18" },
  atrasado: { label: "Atrasado", color: "#ef4444", bg: "#ef444418" },
  cancelado: { label: "Cancelado", color: "#6b7280", bg: "#6b728018" },
};

const CATEGORIAS = {
  entrada: [
    { key: "design", label: "Design", icon: "Palette", color: "#8b5cf6" },
    { key: "social_media", label: "Social Media", icon: "Share2", color: "#3b82f6" },
    { key: "video", label: "Video", icon: "Video", color: "#f59e0b" },
    { key: "evento", label: "Evento", icon: "Camera", color: "#10b981" },
    { key: "site", label: "Site", icon: "Globe", color: "#06b6d4" },
    { key: "consultoria", label: "Consultoria", icon: "MessageCircle", color: "#f97316" },
    { key: "mensal", label: "Mensalidade", icon: "Repeat", color: "#00e676" },
    { key: "outros", label: "Outros", icon: "MoreHorizontal", color: "#94a3b8" },
  ],
  saida: [
    { key: "aluguel", label: "Aluguel", icon: "Home", color: "#ef4444" },
    { key: "internet", label: "Internet", icon: "Wifi", color: "#3b82f6" },
    { key: "software", label: "Software", icon: "Monitor", color: "#8b5cf6" },
    { key: "equipamento", label: "Equipamento", icon: "Cpu", color: "#f97316" },
    { key: "freela", label: "Freelancer", icon: "Users", color: "#f59e0b" },
    { key: "marketing", label: "Marketing", icon: "TrendingUp", color: "#ec4899" },
    { key: "transporte", label: "Transporte", icon: "Car", color: "#06b6d4" },
    { key: "escritorio", label: "Escritorio", icon: "Building", color: "#10b981" },
    { key: "salarios", label: "Salarios", icon: "Users", color: "#a78bfa" },
    { key: "impostos", label: "Impostos", icon: "FileText", color: "#f43f5e" },
    { key: "outros", label: "Outros", icon: "MoreHorizontal", color: "#94a3b8" },
  ],
};

const CONTAS = [
  { key: "banco", label: "Banco", icon: "Building2", color: "#3b82f6" },
  { key: "caixa", label: "Caixa", icon: "Wallet", color: "#22c55e" },
  { key: "carteira", label: "Carteira", icon: "CreditCard", color: "#f59e0b" },
  { key: "digital", label: "Conta Digital", icon: "Smartphone", color: "#8b5cf6" },
];

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const mockMovimentacoes = [
  { id: "f1", descricao: "Projeto Identidade Visual - Vale Verde", categoria: "design", tipo: "entrada", valor: 3200, status: "pago", conta: "banco", metodoPagamento: "PIX", responsavel: "Miguel", dataCriacao: "2024-05-10", dataVencimento: "2024-05-10", dataPagamento: "2024-05-10", observacoes: "Proposta aprovada" },
  { id: "f2", descricao: "Pacote Social Media - Loja Urbana", categoria: "mensal", tipo: "entrada", valor: 4800, status: "pago", conta: "banco", metodoPagamento: "Transferencia", responsavel: "Miguel", dataCriacao: "2024-05-01", dataVencimento: "2024-05-05", dataPagamento: "2024-05-05", observacoes: "Cliente fixo mensal" },
  { id: "f3", descricao: "Video Institucional - Clinica Bem Estar", categoria: "video", tipo: "entrada", valor: 4800, status: "pendente", conta: "banco", metodoPagamento: "Boleto", responsavel: "Ana", dataCriacao: "2024-05-18", dataVencimento: "2024-06-05", dataPagamento: null, observacoes: "Aguardando aprovacao" },
  { id: "f4", descricao: "Aluguel Escritorio", categoria: "aluguel", tipo: "saida", valor: 1500, status: "pago", conta: "banco", metodoPagamento: "Debito automatico", responsavel: "Miguel", dataCriacao: "2024-05-01", dataVencimento: "2024-05-05", dataPagamento: "2024-05-05", observacoes: "Aluguel mensal" },
  { id: "f5", descricao: "Adobe Creative Cloud", categoria: "software", tipo: "saida", valor: 350, status: "pago", conta: "digital", metodoPagamento: "Cartao", responsavel: "Miguel", dataCriacao: "2024-05-01", dataVencimento: "2024-05-10", dataPagamento: "2024-05-10", observacoes: "Assinatura mensal" },
  { id: "f6", descricao: "Freelancer Edicao Video", categoria: "freela", tipo: "saida", valor: 800, status: "pago", conta: "pix", metodoPagamento: "PIX", responsavel: "Miguel", dataCriacao: "2024-05-12", dataVencimento: "2024-05-15", dataPagamento: "2024-05-15", observacoes: "Edicao de video para cliente" },
  { id: "f7", descricao: "Internet Fibra", categoria: "internet", tipo: "saida", valor: 150, status: "pago", conta: "banco", metodoPagamento: "Debito automatico", responsavel: "Miguel", dataCriacao: "2024-05-01", dataVencimento: "2024-05-10", dataPagamento: "2024-05-10", observacoes: "" },
  { id: "f8", descricao: "Social Media - Petshop Amigo Fiel", categoria: "social_media", tipo: "entrada", valor: 1800, status: "pago", conta: "banco", metodoPagamento: "PIX", responsavel: "Ana", dataCriacao: "2024-05-01", dataVencimento: "2024-05-01", dataPagamento: "2024-05-02", observacoes: "Mensalidade petshop" },
  { id: "f9", descricao: "Marketing Google Ads", categoria: "marketing", tipo: "saida", valor: 500, status: "pendente", conta: "digital", metodoPagamento: "Cartao", responsavel: "Miguel", dataCriacao: "2024-05-15", dataVencimento: "2024-05-20", dataPagamento: null, observacoes: "Campanha de marketing" },
  { id: "f10", descricao: "Consultoria Branding - TechStart", categoria: "consultoria", tipo: "entrada", valor: 2500, status: "pendente", conta: "banco", metodoPagamento: "Transferencia", responsavel: "Miguel", dataCriacao: "2024-05-24", dataVencimento: "2024-06-10", dataPagamento: null, observacoes: "Consultoria + branding" },
  { id: "f11", descricao: "Equipamento - Monitor Extra", categoria: "equipamento", tipo: "saida", valor: 2200, status: "atrasado", conta: "carteira", metodoPagamento: "Cartao", responsavel: "Miguel", dataCriacao: "2024-04-15", dataVencimento: "2024-05-01", dataPagamento: null, observacoes: "Parcela 2/3" },
  { id: "f12", descricao: "Site Imobiliaria Prime", categoria: "site", tipo: "entrada", valor: 6000, status: "pago", conta: "banco", metodoPagamento: "Transferencia", responsavel: "Ana", dataCriacao: "2024-05-17", dataVencimento: "2024-05-20", dataPagamento: "2024-05-21", observacoes: "Site + tour virtual" },
  { id: "f13", descricao: "Transporte Uber/99", categoria: "transporte", tipo: "saida", valor: 280, status: "pago", conta: "carteira", metodoPagamento: "PIX", responsavel: "Miguel", dataCriacao: "2024-05-20", dataVencimento: "2024-05-20", dataPagamento: "2024-05-20", observacoes: "Deslocamento clientes" },
  { id: "f14", descricao: "Salarios Maio", categoria: "salarios", tipo: "saida", valor: 4200, status: "pendente", conta: "banco", metodoPagamento: "Transferencia", responsavel: "Miguel", dataCriacao: "2024-05-01", dataVencimento: "2024-05-30", dataPagamento: null, observacoes: "Folha pagamento" },
  { id: "f15", descricao: "Cobertura Evento - Buffet Delicias", categoria: "evento", tipo: "entrada", valor: 3500, status: "pendente", conta: "banco", metodoPagamento: "PIX", responsavel: "Carlos", dataCriacao: "2024-05-20", dataVencimento: "2024-06-01", dataPagamento: null, observacoes: "Cobertura evento premium" },
  { id: "f16", descricao: "Material Escritorio", categoria: "escritorio", tipo: "saida", valor: 180, status: "pago", conta: "caixa", metodoPagamento: "Dinheiro", responsavel: "Ana", dataCriacao: "2024-05-08", dataVencimento: "2024-05-08", dataPagamento: "2024-05-08", observacoes: "" },
  { id: "f17", descricao: "Impostos DAS Mei", categoria: "impostos", tipo: "saida", valor: 320, status: "pago", conta: "banco", metodoPagamento: "PIX", responsavel: "Miguel", dataCriacao: "2024-05-01", dataVencimento: "2024-05-20", dataPagamento: "2024-05-18", observacoes: "DAS mensal" },
  { id: "f18", descricao: "Design - Dr. Marcos", categoria: "design", tipo: "entrada", valor: 1500, status: "atrasado", conta: "banco", metodoPagamento: "PIX", responsavel: "Miguel", dataCriacao: "2024-04-20", dataVencimento: "2024-05-10", dataPagamento: null, observacoes: "Social media + identidade" },
];

const useFinanceiroStore = create((set, get) => ({
  movimentacoes: [],
  search: "",
  view: "dashboard",
  tipoFilter: "todos",
  statusFilter: "todos",
  categoriaFilter: "todos",
  contaFilter: "todos",
  selectedMov: null,
  drawerOpen: false,
  dialogOpen: false,
  dialogType: "entrada",
  editId: null,
  loading: true,
  confirmDialog: null,
  toast: null,
  periodo: "mes",

  init: () => {
    const txns = getTransactions();
    const despesas = getDespesas();
    let movs = [];
    if (txns.length > 0 || despesas.length > 0) {
      const entradas = txns.filter(t => t.tipo === "entrada").map(t => ({
        id: String(t.id), descricao: t.cliente || t.descricao || "", categoria: mapCategoria(t.categoria, "entrada"), tipo: "entrada",
        valor: t.valor || 0, status: mapStatus(t.status), conta: t.conta || "banco", metodoPagamento: t.metodoPagamento || "PIX",
        responsavel: t.responsavel || "Miguel", dataCriacao: t.data || new Date().toISOString().slice(0, 10),
        dataVencimento: t.dataVencimento || t.data || "", dataPagamento: t.status === "pago" ? (t.dataPagamento || t.data || "") : null,
        observacoes: t.observacoes || "",
      }));
      const saidas = txns.filter(t => t.tipo === "saida").map(t => ({
        id: String(t.id) + "_txn", descricao: t.cliente || t.descricao || "", categoria: mapCategoria(t.categoria, "saida"), tipo: "saida",
        valor: t.valor || 0, status: mapStatus(t.status), conta: t.conta || "banco", metodoPagamento: t.metodoPagamento || "PIX",
        responsavel: t.responsavel || "Miguel", dataCriacao: t.data || new Date().toISOString().slice(0, 10),
        dataVencimento: t.dataVencimento || t.data || "", dataPagamento: t.status === "pago" ? (t.dataPagamento || t.data || "") : null,
        observacoes: t.observacoes || "",
      }));
      const despesaMovs = despesas.map(d => ({
        id: String(d.id) + "_dsp", descricao: d.descricao || "", categoria: mapCategoria(d.categoria, "saida"), tipo: "saida",
        valor: d.valor || 0, status: "pago", conta: d.conta || "banco", metodoPagamento: d.metodoPagamento || "PIX",
        responsavel: d.responsavel || "Miguel", dataCriacao: d.data || "", dataVencimento: d.data || "",
        dataPagamento: d.data || "", observacoes: d.observacoes || "",
      }));
      movs = [...entradas, ...saidas, ...despesaMovs];
    }
    if (movs.length === 0) movs = mockMovimentacoes;
    set({ movimentacoes: movs, loading: false });
  },

  setSearch: (s) => set({ search: s }),
  setView: (v) => set({ view: v }),
  setTipoFilter: (f) => set({ tipoFilter: f }),
  setStatusFilter: (f) => set({ statusFilter: f }),
  setCategoriaFilter: (f) => set({ categoriaFilter: f }),
  setContaFilter: (f) => set({ contaFilter: f }),
  setPeriodo: (p) => set({ periodo: p }),

  openDrawer: (mov) => set({ selectedMov: mov, drawerOpen: true }),
  closeDrawer: () => set({ selectedMov: null, drawerOpen: false }),
  openDialog: (type, editId = null) => set({ dialogOpen: true, dialogType: type, editId }),
  closeDialog: () => set({ dialogOpen: false, editId: null }),

  addMovimentacao: (mov) => {
    const movs = [...get().movimentacoes, { ...mov, id: "f" + Date.now(), dataCriacao: new Date().toISOString().slice(0, 10) }];
    set({ movimentacoes: movs, toast: { type: "success", message: `${mov.tipo === "entrada" ? "Entrada" : "Saida"} adicionada` } });
    syncToStorage(movs);
    setTimeout(() => set({ toast: null }), 3000);
  },

  updateMovimentacao: (id, data) => {
    const movs = get().movimentacoes.map(m => m.id === id ? { ...m, ...data } : m);
    set({ movimentacoes: movs });
    syncToStorage(movs);
    const selected = get().selectedMov;
    if (selected && selected.id === id) set({ selectedMov: { ...selected, ...data } });
  },

  deleteMovimentacao: (id) => {
    const movs = get().movimentacoes.filter(m => m.id !== id);
    set({ movimentacoes: movs, drawerOpen: false, selectedMov: null, confirmDialog: null, toast: { type: "success", message: "Movimentacao removida" } });
    syncToStorage(movs);
    setTimeout(() => set({ toast: null }), 3000);
  },

  markAsPaid: (id) => {
    const movs = get().movimentacoes.map(m => m.id === id ? { ...m, status: "pago", dataPagamento: new Date().toISOString().slice(0, 10) } : m);
    set({ movimentacoes: movs, toast: { type: "success", message: "Marcado como pago" } });
    syncToStorage(movs);
    const selected = get().selectedMov;
    if (selected && selected.id === id) set({ selectedMov: { ...selected, status: "pago", dataPagamento: new Date().toISOString().slice(0, 10) } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  showConfirm: (config) => set({ confirmDialog: config }),
  hideConfirm: () => set({ confirmDialog: null }),

  getFilteredMovimentacoes: () => {
    const { movimentacoes, search, tipoFilter, statusFilter, categoriaFilter, contaFilter } = get();
    let list = [...movimentacoes];
    if (tipoFilter !== "todos") list = list.filter(m => m.tipo === tipoFilter);
    if (statusFilter !== "todos") list = list.filter(m => m.status === statusFilter);
    if (categoriaFilter !== "todos") list = list.filter(m => m.categoria === categoriaFilter);
    if (contaFilter !== "todos") list = list.filter(m => m.conta === contaFilter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(m => m.descricao?.toLowerCase().includes(s) || m.categoria?.toLowerCase().includes(s) || m.responsavel?.toLowerCase().includes(s));
    }
    return list.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao));
  },

  getMetrics: () => {
    const { movimentacoes } = get();
    const entradas = movimentacoes.filter(m => m.tipo === "entrada");
    const saidas = movimentacoes.filter(m => m.tipo === "saida");
    const receitaTotal = entradas.reduce((s, m) => s + (m.valor || 0), 0);
    const despesaTotal = saidas.reduce((s, m) => s + (m.valor || 0), 0);
    const pagas = entradas.filter(m => m.status === "pago").reduce((s, m) => s + (m.valor || 0), 0);
    const pendentes = movimentacoes.filter(m => m.status === "pendente").reduce((s, m) => s + (m.valor || 0), 0);
    const atrasadas = movimentacoes.filter(m => m.status === "atrasado").reduce((s, m) => s + (m.valor || 0), 0);
    return {
      receitaTotal, despesaTotal, lucroLiquido: receitaTotal - despesaTotal,
      fluxoCaixa: pagas - saidas.filter(m => m.status === "pago").reduce((s, m) => s + (m.valor || 0), 0),
      contasPendentes: pendentes, contasAtrasadas: atrasadas,
      faturamentoMensal: receitaTotal, totalEntradas: entradas.length, totalSaidas: saidas.length,
    };
  },

  getChartData: () => {
    const { movimentacoes } = get();
    const now = new Date();
    const cm = now.getMonth(), cy = now.getFullYear();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const m = (cm - i + 12) % 12, y = cm - i < 0 ? cy - 1 : cy;
      const r = movimentacoes.filter(mov => { const d = parseDate(mov.dataCriacao); return d && d.getMonth() === m && d.getFullYear() === y && mov.tipo === "entrada"; }).reduce((s, mov) => s + (mov.valor || 0), 0);
      const d = movimentacoes.filter(mov => { const dd = parseDate(mov.dataCriacao); return dd && dd.getMonth() === m && dd.getFullYear() === y && mov.tipo === "saida"; }).reduce((s, mov) => s + (mov.valor || 0), 0);
      data.push({ mes: MESES[m], receita: r, despesa: d, lucro: r - d });
    }
    return data;
  },

  getCashFlowData: () => {
    const { movimentacoes } = get();
    const now = new Date();
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const m = (now.getMonth() - i + 12) % 12, y = now.getMonth() - i < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const ent = movimentacoes.filter(mov => { const d = parseDate(mov.dataCriacao); return d && d.getMonth() === m && d.getFullYear() === y && mov.tipo === "entrada"; }).reduce((s, mov) => s + (mov.valor || 0), 0);
      const sai = movimentacoes.filter(mov => { const d = parseDate(mov.dataCriacao); return d && d.getMonth() === m && d.getFullYear() === y && mov.tipo === "saida"; }).reduce((s, mov) => s + (mov.valor || 0), 0);
      data.push({ mes: MESES[m], entrada: ent, saida: sai, saldo: ent - sai });
    }
    return data;
  },

  getExpenseByCategory: () => {
    const { movimentacoes } = get();
    const map = {};
    movimentacoes.filter(m => m.tipo === "saida").forEach(m => {
      const cat = m.categoria || "outros";
      map[cat] = (map[cat] || 0) + (m.valor || 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([key, value]) => {
      const cat = CATEGORIAS.saida.find(c => c.key === key) || { label: key, color: "#94a3b8" };
      return { name: cat.label, value, color: cat.color };
    });
  },

  getContaTotals: () => {
    const { movimentacoes } = get();
    return CONTAS.map(c => {
      const movs = movimentacoes.filter(m => m.conta === c.key);
      const entradas = movs.filter(m => m.tipo === "entrada").reduce((s, m) => s + (m.valor || 0), 0);
      const saidas = movs.filter(m => m.tipo === "saida").reduce((s, m) => s + (m.valor || 0), 0);
      return { ...c, entradas, saidas, saldo: entradas - saidas };
    });
  },
}));

function parseDate(str) {
  if (!str) return null;
  const p = str.split("/");
  if (p.length === 3) return new Date(+p[2], +p[1] - 1, +p[0]);
  return new Date(str + "T12:00:00");
}

function mapCategoria(cat, tipo) {
  if (!cat) return "outros";
  const lower = cat.toLowerCase().replace(/\s+/g, "_");
  const allCats = [...CATEGORIAS.entrada, ...CATEGORIAS.saida];
  if (allCats.find(c => c.key === lower)) return lower;
  const map = { design: "design", "social media": "social_media", "social_media": "social_media", video: "video", evento: "evento", site: "site", consultoria: "consultoria", mensal: "mensal", mensalidade: "mensal", aluguel: "aluguel", internet: "internet", software: "software", equipamento: "equipamento", freela: "freela", freelancer: "freela", marketing: "marketing", transporte: "transporte", escritorio: "escritorio", salarios: "salarios", impostos: "impostos", outros: "outros" };
  return map[lower] || map[cat.toLowerCase()] || "outros";
}

function mapStatus(status) {
  if (!status) return "pendente";
  const map = { pago: "pago", paid: "pago", pendente: "pendente", pending: "pendente", atrasado: "atrasado", overdue: "atrasado", cancelado: "cancelado", cancelled: "cancelado" };
  return map[status.toLowerCase()] || "pendente";
}

function syncToStorage(movs) {
  const txns = movs.filter(m => !m.id.endsWith("_dsp")).map(m => ({
    id: m.id, cliente: m.descricao, descricao: m.descricao, valor: m.valor, categoria: m.categoria,
    tipo: m.tipo, data: m.dataCriacao, status: m.status, conta: m.conta, metodoPagamento: m.metodoPagamento,
    responsavel: m.responsavel, observacoes: m.observacoes,
  }));
  saveTransactions(txns);
  const despesas = movs.filter(m => m.tipo === "saida").map(m => ({
    id: parseInt(m.id) || Date.now(), descricao: m.descricao, valor: m.valor, categoria: m.categoria,
    data: m.dataCriacao, conta: m.conta, metodoPagamento: m.metodoPagamento, responsavel: m.responsavel,
  }));
  saveDespesa(despesas[0] || {});
}

export { TIPO_CONFIG, STATUS_CONFIG, CATEGORIAS, CONTAS, MESES };
export default useFinanceiroStore;
