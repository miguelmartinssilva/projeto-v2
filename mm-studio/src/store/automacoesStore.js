import { create } from "zustand";
import { format, subDays, subHours, subMinutes } from "date-fns";

const STATUS_AUTO = [
  { key: "ativa", label: "Ativa", color: "#22c55e", bg: "#22c55e18" },
  { key: "pausada", label: "Pausada", color: "#f59e0b", bg: "#f59e0b18" },
  { key: "erro", label: "Erro", color: "#ef4444", bg: "#ef444418" },
  { key: "teste", label: "Em Teste", color: "#3b82f6", bg: "#3b82f618" },
];

const TRIGGER_TYPES = [
  { key: "novo_cliente", label: "Novo Cliente", color: "#3b82f6", bg: "#3b82f618", icon: "UserPlus", category: "crm" },
  { key: "novo_lead", label: "Novo Lead", color: "#8b5cf6", bg: "#8b5cf618", icon: "Target", category: "crm" },
  { key: "pagamento", label: "Pagamento Recebido", color: "#22c55e", bg: "#22c55e18", icon: "DollarSign", category: "financeiro" },
  { key: "negociacao_fechada", label: "Negociacao Fechada", color: "#00e676", bg: "#00e67618", icon: "CheckCircle", category: "comercial" },
  { key: "evento_agendado", label: "Evento Agendado", color: "#f59e0b", bg: "#f59e0b18", icon: "Calendar", category: "agenda" },
  { key: "formulario", label: "Formulario Enviado", color: "#06b6d4", bg: "#06b6d418", icon: "FileText", category: "crm" },
  { key: "mensagem_recebida", label: "Mensagem Recebida", color: "#ec4899", bg: "#ec489918", icon: "MessageCircle", category: "comunicacao" },
];

const CONDICAO_TYPES = [
  { key: "status_cliente", label: "Status Cliente", color: "#f59e0b", bg: "#f59e0b18", icon: "Filter" },
  { key: "valor_negociacao", label: "Valor Negociacao", color: "#22c55e", bg: "#22c55e18", icon: "DollarSign" },
  { key: "categoria", label: "Categoria", color: "#8b5cf6", bg: "#8b5cf618", icon: "Tag" },
  { key: "responsavel", label: "Responsavel", color: "#3b82f6", bg: "#3b82f618", icon: "User" },
  { key: "horario", label: "Horario", color: "#06b6d4", bg: "#06b6d418", icon: "Clock" },
  { key: "tags", label: "Tags", color: "#ec4899", bg: "#ec489918", icon: "Hash" },
];

const ACAO_TYPES = [
  { key: "whatsapp", label: "Enviar WhatsApp", color: "#22c55e", bg: "#22c55e18", icon: "MessageCircle", category: "comunicacao" },
  { key: "email", label: "Enviar Email", color: "#3b82f6", bg: "#3b82f618", icon: "Mail", category: "comunicacao" },
  { key: "criar_tarefa", label: "Criar Tarefa", color: "#f59e0b", bg: "#f59e0b18", icon: "CheckSquare", category: "operacional" },
  { key: "atualizar_status", label: "Atualizar Status", color: "#8b5cf6", bg: "#8b5cf618", icon: "RefreshCw", category: "crm" },
  { key: "notificacao", label: "Criar Notificacao", color: "#ef4444", bg: "#ef444418", icon: "Bell", category: "sistema" },
  { key: "mover_pipeline", label: "Mover Pipeline", color: "#ec4899", bg: "#ec489918", icon: "ArrowRightLeft", category: "comercial" },
  { key: "relatorio", label: "Gerar Relatorio", color: "#06b6d4", bg: "#06b6d418", icon: "BarChart3", category: "analytics" },
  { key: "criar_evento", label: "Criar Evento Agenda", color: "#a78bfa", bg: "#a78bfa18", icon: "CalendarPlus", category: "agenda" },
];

const INTEGRACOES = [
  { id: "whatsapp", nome: "WhatsApp", icon: "MessageCircle", color: "#22c55e", status: "conectado", execucoes: 342, ultimaSync: subMinutes(new Date(), 15) },
  { id: "email", nome: "Email SMTP", icon: "Mail", color: "#3b82f6", status: "conectado", execucoes: 128, ultimaSync: subHours(new Date(), 1) },
  { id: "telegram", nome: "Telegram", icon: "Send", color: "#06b6d4", status: "desconectado", execucoes: 0, ultimaSync: null },
  { id: "discord", nome: "Discord", icon: "Hash", color: "#8b5cf6", status: "desconectado", execucoes: 0, ultimaSync: null },
  { id: "slack", nome: "Slack", icon: "Hash", color: "#ef4444", status: "desconectado", execucoes: 0, ultimaSync: null },
  { id: "google_calendar", nome: "Google Calendar", icon: "Calendar", color: "#f59e0b", status: "conectado", execucoes: 56, ultimaSync: subHours(new Date(), 2) },
  { id: "stripe", nome: "Stripe", icon: "CreditCard", color: "#a78bfa", status: "desconectado", execucoes: 0, ultimaSync: null },
  { id: "webhooks", nome: "Webhooks", icon: "Link2", color: "#94a3b8", status: "conectado", execucoes: 89, ultimaSync: subMinutes(new Date(), 45) },
];

const TEMPLATES = [
  { id: "t1", nome: "Novo Lead WhatsApp", descricao: "Notifica via WhatsApp quando um novo lead chega", categoria: "crm", trigger: "novo_lead", acoes: ["whatsapp", "notificacao"], popularidade: 95, ativo: true },
  { id: "t2", nome: "Follow-up Automatico", descricao: "Envia follow-up apos 3 dias sem resposta", categoria: "comercial", trigger: "novo_lead", acoes: ["email", "criar_tarefa"], popularidade: 88, ativo: true },
  { id: "t3", nome: "Cobranca Automatica", descricao: "Dispara cobranca quando pagamento atrasa", categoria: "financeiro", trigger: "pagamento", acoes: ["whatsapp", "email"], popularidade: 82, ativo: true },
  { id: "t4", nome: "Notificacao Financeira", descricao: "Notifica sobre recebimentos e inadimplencia", categoria: "financeiro", trigger: "pagamento", acoes: ["notificacao", "relatorio"], popularidade: 76, ativo: true },
  { id: "t5", nome: "Boas-vindas Cliente", descricao: "Envia mensagem de boas-vindas ao novo cliente", categoria: "crm", trigger: "novo_cliente", acoes: ["whatsapp", "email", "criar_tarefa"], popularidade: 92, ativo: true },
  { id: "t6", nome: "Pipeline Automatico", descricao: "Move deal no pipeline conforme status muda", categoria: "comercial", trigger: "negociacao_fechada", acoes: ["mover_pipeline", "notificacao"], popularidade: 70, ativo: true },
];

const RESPONSAVEIS = [
  { id: "v1", nome: "Miguel Martins", avatar: "MM", cor: "#00e676" },
  { id: "v2", nome: "Ana Silva", avatar: "AS", cor: "#7c3aed" },
  { id: "v3", nome: "Carlos Oliveira", avatar: "CO", cor: "#448aff" },
];

function makeDate(daysAgo, hour = 9) {
  const d = subDays(new Date(), daysAgo);
  d.setHours(hour, 0, 0, 0);
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

const mockAutomacoes = [
  { id: "a1", nome: "Boas-vindas novo cliente", descricao: "Envia WhatsApp e email de boas-vindas quando um novo cliente e cadastrado", trigger: "novo_cliente", condicoes: [], acoes: ["whatsapp", "email", "criar_tarefa"], integracao: "whatsapp", status: "ativa", execucoes: 47, ultimaExecucao: makeDate(0, 14), responsavel: "v1", created_at: makeDate(30), updated_at: makeDate(1), taxaSucesso: 98, tempoMedio: 2.3 },
  { id: "a2", nome: "Follow-up 3 dias", descricao: "Envia follow-up apos 3 dias sem resposta do cliente", trigger: "novo_lead", condicoes: ["horario"], acoes: ["email", "criar_tarefa"], integracao: "email", status: "ativa", execucoes: 32, ultimaExecucao: makeDate(0, 11), responsavel: "v2", created_at: makeDate(25), updated_at: makeDate(2), taxaSucesso: 91, tempoMedio: 4.1 },
  { id: "a3", nome: "Cobranca pagamento atrasado", descricao: "Notifica cliente via WhatsApp quando pagamento esta atrasado", trigger: "pagamento", condicoes: ["status_cliente"], acoes: ["whatsapp", "notificacao"], integracao: "whatsapp", status: "ativa", execucoes: 18, ultimaExecucao: makeDate(1, 9), responsavel: "v1", created_at: makeDate(20), updated_at: makeDate(3), taxaSucesso: 85, tempoMedio: 1.8 },
  { id: "a4", nome: "Notificacao pagamento recebido", descricao: "Notifica equipe quando pagamento e confirmado", trigger: "pagamento", condicoes: [], acoes: ["notificacao", "atualizar_status"], integracao: "webhooks", status: "ativa", execucoes: 56, ultimaExecucao: makeDate(0, 16), responsavel: "v1", created_at: makeDate(15), updated_at: makeDate(0), taxaSucesso: 100, tempoMedio: 0.5 },
  { id: "a5", nome: "Mover pipeline automatico", descricao: "Move deal automaticamente quando negociacao e fechada", trigger: "negociacao_fechada", condicoes: ["valor_negociacao"], acoes: ["mover_pipeline", "notificacao"], integracao: "webhooks", status: "ativa", execucoes: 12, ultimaExecucao: makeDate(2, 10), responsavel: "v1", created_at: makeDate(18), updated_at: makeDate(5), taxaSucesso: 92, tempoMedio: 1.2 },
  { id: "a6", nome: "Relatorio semanal", descricao: "Gera relatorio semanal de performance e envia por email", trigger: "evento_agendado", condicoes: ["horario"], acoes: ["relatorio", "email"], integracao: "email", status: "pausada", execucoes: 24, ultimaExecucao: makeDate(7, 8), responsavel: "v1", created_at: makeDate(40), updated_at: makeDate(8), taxaSucesso: 96, tempoMedio: 8.5 },
  { id: "a7", nome: "Lembrete entrega", descricao: "Envia lembrete ao cliente 1 dia antes da entrega", trigger: "evento_agendado", condicoes: ["horario"], acoes: ["whatsapp", "notificacao"], integracao: "whatsapp", status: "ativa", execucoes: 89, ultimaExecucao: makeDate(0, 8), responsavel: "v2", created_at: makeDate(60), updated_at: makeDate(1), taxaSucesso: 99, tempoMedio: 1.1 },
  { id: "a8", nome: "Novo lead formulario", descricao: "Processa leads do formulario e cria tarefa de contato", trigger: "formulario", condicoes: ["categoria"], acoes: ["criar_tarefa", "whatsapp"], integracao: "webhooks", status: "teste", execucoes: 5, ultimaExecucao: makeDate(1, 15), responsavel: "v2", created_at: makeDate(3), updated_at: makeDate(1), taxaSucesso: 80, tempoMedio: 3.2 },
  { id: "a9", nome: "Sync Google Calendar", descricao: "Sincroniza eventos automaticamente com Google Calendar", trigger: "evento_agendado", condicoes: [], acoes: ["criar_evento"], integracao: "google_calendar", status: "ativa", execucoes: 34, ultimaExecucao: makeDate(0, 7), responsavel: "v1", created_at: makeDate(10), updated_at: makeDate(0), taxaSucesso: 97, tempoMedio: 2.0 },
  { id: "a10", nome: "Alerta erro sistema", descricao: "Notifica equipe quando ocorre erro em automacao", trigger: "mensagem_recebida", condicoes: [], acoes: ["notificacao"], integracao: "webhooks", status: "erro", execucoes: 8, ultimaExecucao: makeDate(3, 22), responsavel: "v1", created_at: makeDate(14), updated_at: makeDate(3), taxaSucesso: 38, tempoMedio: 0.3 },
];

const mockLogs = [
  { id: "l1", automacaoId: "a1", automacaoNome: "Boas-vindas novo cliente", status: "sucesso", timestamp: subMinutes(new Date(), 15), duracao: 2.1, detalhes: "WhatsApp + Email enviados para Academia Corpo Livre" },
  { id: "l2", automacaoId: "a4", automacaoNome: "Notificacao pagamento recebido", status: "sucesso", timestamp: subMinutes(new Date(), 42), duracao: 0.4, detalhes: "Pagamento R$ 2.000 confirmado - Ana Beatriz" },
  { id: "l3", automacaoId: "a7", automacaoNome: "Lembrete entrega", status: "sucesso", timestamp: subHours(new Date(), 1), duracao: 1.0, detalhes: "Lembrete enviado para Fernanda Oliveira" },
  { id: "l4", automacaoId: "a3", automacaoNome: "Cobranca pagamento atrasado", status: "sucesso", timestamp: subHours(new Date(), 3), duracao: 1.8, detalhes: "Cobranca enviada para Juliana Menezes" },
  { id: "l5", automacaoId: "a10", automacaoNome: "Alerta erro sistema", status: "erro", timestamp: subHours(new Date(), 5), duracao: 0.2, detalhes: "Erro: Webhook endpoint retornou 500" },
  { id: "l6", automacaoId: "a2", automacaoNome: "Follow-up 3 dias", status: "sucesso", timestamp: subHours(new Date(), 8), duracao: 3.9, detalhes: "Email + tarefa criada para Dr. Marcos" },
  { id: "l7", automacaoId: "a5", automacaoNome: "Mover pipeline automatico", status: "sucesso", timestamp: subDays(new Date(), 1), duracao: 1.1, detalhes: "Deal movido para Fechado - Imobiliaria Prime" },
  { id: "l8", automacaoId: "a9", automacaoNome: "Sync Google Calendar", status: "sucesso", timestamp: subDays(new Date(), 1), duracao: 2.0, detalhes: "Evento sincronizado: Reuniao equipe semanal" },
  { id: "l9", automacaoId: "a1", automacaoNome: "Boas-vindas novo cliente", status: "sucesso", timestamp: subDays(new Date(), 2), duracao: 2.4, detalhes: "WhatsApp + Email enviados para Dr. Marcos" },
  { id: "l10", automacaoId: "a10", automacaoNome: "Alerta erro sistema", status: "erro", timestamp: subDays(new Date(), 2), duracao: 0.1, detalhes: "Erro: Timeout ao conectar webhook" },
  { id: "l11", automacaoId: "a6", automacaoNome: "Relatorio semanal", status: "sucesso", timestamp: subDays(new Date(), 7), duracao: 8.2, detalhes: "Relatorio semanal gerado e enviado por email" },
  { id: "l12", automacaoId: "a8", automacaoNome: "Novo lead formulario", status: "aviso", timestamp: subDays(new Date(), 1), duracao: 4.5, detalhes: "Lead processado com atraso - fila cheia" },
];

const useAutomacoesStore = create((set, get) => ({
  automacoes: [],
  integracoes: [],
  templates: [],
  logs: [],
  search: "",
  statusFilter: "todos",
  integracaoFilter: "todos",
  responsavelFilter: "todos",
  view: "list",
  loading: true,
  toast: null,
  confirmDialog: null,
  selectedAuto: null,
  drawerOpen: false,
  dialogOpen: false,
  editId: null,

  init: () => {
    set({
      automacoes: mockAutomacoes,
      integracoes: INTEGRACOES,
      templates: TEMPLATES,
      logs: mockLogs,
      loading: false,
    });
  },

  setSearch: (s) => set({ search: s }),
  setView: (v) => set({ view: v }),
  setStatusFilter: (f) => set({ statusFilter: f }),
  setIntegracaoFilter: (f) => set({ integracaoFilter: f }),
  setResponsavelFilter: (f) => set({ responsavelFilter: f }),

  openDrawer: (auto) => set({ selectedAuto: auto, drawerOpen: true }),
  closeDrawer: () => set({ selectedAuto: null, drawerOpen: false }),
  openDialog: (editId = null) => set({ dialogOpen: true, editId }),
  closeDialog: () => set({ dialogOpen: false, editId: null }),

  addAutomacao: (data) => {
    const novo = { ...data, id: "a" + Date.now(), execucoes: 0, ultimaExecucao: null, taxaSucesso: 100, tempoMedio: 0, created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"), updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm") };
    const automacoes = [...get().automacoes, novo];
    set({ automacoes, dialogOpen: false, toast: { type: "success", message: "Automacao criada" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  updateAutomacao: (id, data) => {
    const automacoes = get().automacoes.map(a => a.id === id ? { ...a, ...data, updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm") } : a);
    set({ automacoes });
    const sel = get().selectedAuto;
    if (sel && sel.id === id) set({ selectedAuto: { ...sel, ...data } });
  },

  deleteAutomacao: (id) => {
    const automacoes = get().automacoes.filter(a => a.id !== id);
    set({ automacoes, drawerOpen: false, selectedAuto: null, confirmDialog: null, toast: { type: "success", message: "Automacao removida" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  toggleAutomacao: (id) => {
    const automacoes = get().automacoes.map(a => {
      if (a.id !== id) return a;
      const newStatus = a.status === "ativa" ? "pausada" : "ativa";
      return { ...a, status: newStatus };
    });
    set({ automacoes, toast: { type: "success", message: "Status atualizado" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  duplicateAutomacao: (id) => {
    const orig = get().automacoes.find(a => a.id === id);
    if (!orig) return;
    const dup = { ...orig, id: "a" + Date.now(), nome: orig.nome + " (copia)", status: "pausada", execucoes: 0, created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm") };
    const automacoes = [...get().automacoes, dup];
    set({ automacoes, toast: { type: "success", message: "Automacao duplicada" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  useTemplate: (templateId) => {
    const tpl = get().templates.find(t => t.id === templateId);
    if (!tpl) return;
    const novo = { id: "a" + Date.now(), nome: tpl.nome, descricao: tpl.descricao, trigger: tpl.trigger, condicoes: [], acoes: tpl.acoes, integracao: tpl.acoes[0] || "whatsapp", status: "pausada", execucoes: 0, responsavel: "v1", taxaSucesso: 100, tempoMedio: 0, created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm"), updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm") };
    const automacoes = [...get().automacoes, novo];
    set({ automacoes, toast: { type: "success", message: "Template aplicado" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  toggleIntegracao: (id) => {
    const integracoes = get().integracoes.map(i => i.id === id ? { ...i, status: i.status === "conectado" ? "desconectado" : "conectado" } : i);
    set({ integracoes });
  },

  showConfirm: (cfg) => set({ confirmDialog: cfg }),
  hideConfirm: () => set({ confirmDialog: null }),

  getMetrics: () => {
    const { automacoes, logs } = get();
    const ativas = automacoes.filter(a => a.status === "ativa").length;
    const total = automacoes.length;
    const today = format(new Date(), "yyyy-MM-dd");
    const execucoesHoje = logs.filter(l => format(l.timestamp, "yyyy-MM-dd") === today).length;
    const mensagensEnviadas = logs.filter(l => l.status === "sucesso" && (l.automacaoNome?.toLowerCase().includes("whatsapp") || l.automacaoNome?.toLowerCase().includes("email"))).length;
    const workflowsExecutados = logs.filter(l => l.status === "sucesso").length;
    const taxaSucesso = logs.length ? Math.round((logs.filter(l => l.status === "sucesso").length / logs.length) * 100) : 0;
    const economiaTempo = Math.round(execucoesHoje * 2.5);
    return { ativas, total, execucoesHoje, mensagensEnviadas, workflowsExecutados, taxaSucesso, economiaTempo };
  },

  getFilteredAutomacoes: () => {
    const { automacoes, search, statusFilter, integracaoFilter, responsavelFilter } = get();
    let list = [...automacoes];
    if (statusFilter !== "todos") list = list.filter(a => a.status === statusFilter);
    if (integracaoFilter !== "todos") list = list.filter(a => a.integracao === integracaoFilter);
    if (responsavelFilter !== "todos") list = list.filter(a => a.responsavel === responsavelFilter);
    if (search) { const s = search.toLowerCase(); list = list.filter(a => a.nome?.toLowerCase().includes(s) || a.descricao?.toLowerCase().includes(s)); }
    return list;
  },

  getWorkflowNodes: (autoId) => {
    const auto = get().automacoes.find(a => a.id === autoId);
    if (!auto) return { nodes: [], edges: [] };
    const trigger = TRIGGER_TYPES.find(t => t.key === auto.trigger) || TRIGGER_TYPES[0];
    const nodes = [{ id: "trigger", type: "trigger", position: { x: 250, y: 0 }, data: { label: trigger.label, config: trigger } }];
    let y = 120;
    auto.condicoes.forEach((c, i) => {
      const cfg = CONDICAO_TYPES.find(ct => ct.key === c) || CONDICAO_TYPES[0];
      nodes.push({ id: `cond_${i}`, type: "condicao", position: { x: 250, y }, data: { label: cfg.label, config: cfg } });
      y += 100;
    });
    auto.acoes.forEach((a, i) => {
      const cfg = ACAO_TYPES.find(at => at.key === a) || ACAO_TYPES[0];
      nodes.push({ id: `acao_${i}`, type: "acao", position: { x: 250, y }, data: { label: cfg.label, config: cfg } });
      y += 100;
    });
    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({ id: `e_${i}`, source: nodes[i].id, target: nodes[i + 1].id, animated: true, style: { stroke: "#00e67680" } });
    }
    return { nodes, edges };
  },
}));

export {
  STATUS_AUTO, TRIGGER_TYPES, CONDICAO_TYPES, ACAO_TYPES,
  INTEGRACOES, TEMPLATES, RESPONSAVEIS,
};
export default useAutomacoesStore;
