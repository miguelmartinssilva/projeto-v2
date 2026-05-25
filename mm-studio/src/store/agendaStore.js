import { create } from "zustand";
import { format, addDays, subDays, addHours, setHours, setMinutes } from "date-fns";
import { getAgenda, saveAgenda } from "../utils/storage";

const PRIORIDADES = [
  { key: "urgente", label: "Urgente", color: "#ef4444", bg: "#ef444418" },
  { key: "alta", label: "Alta", color: "#f97316", bg: "#f9731618" },
  { key: "media", label: "Media", color: "#f59e0b", bg: "#f59e0b18" },
  { key: "baixa", label: "Baixa", color: "#22c55e", bg: "#22c55e18" },
];

const CATEGORIAS_EVENTO = [
  { key: "reuniao", label: "Reuniao", color: "#3b82f6", bg: "#3b82f618", icon: "Users" },
  { key: "onboarding", label: "Onboarding", color: "#8b5cf6", bg: "#8b5cf618", icon: "UserPlus" },
  { key: "entrega", label: "Entrega", color: "#22c55e", bg: "#22c55e18", icon: "Package" },
  { key: "revisao", label: "Revisao", color: "#f59e0b", bg: "#f59e0b18", icon: "Eye" },
  { key: "demo", label: "Demo", color: "#06b6d4", bg: "#06b6d418", icon: "Monitor" },
  { key: "followup", label: "Follow-up", color: "#ec4899", bg: "#ec489918", icon: "Phone" },
  { key: "pagamento", label: "Pagamento", color: "#00e676", bg: "#00e67618", icon: "DollarSign" },
  { key: "lembrete", label: "Lembrete", color: "#f97316", bg: "#f9731618", icon: "Bell" },
  { key: "pessoal", label: "Pessoal", color: "#a78bfa", bg: "#a78bfa18", icon: "Heart" },
  { key: "outro", label: "Outro", color: "#94a3b8", bg: "#94a3b818", icon: "MoreHorizontal" },
];

const CATEGORIAS_TAREFA = [
  { key: "design", label: "Design", color: "#8b5cf6" },
  { key: "social_media", label: "Social Media", color: "#3b82f6" },
  { key: "video", label: "Video", color: "#f59e0b" },
  { key: "site", label: "Site", color: "#06b6d4" },
  { key: "reuniao", label: "Reuniao", color: "#ec4899" },
  { key: "administrativo", label: "Administrativo", color: "#94a3b8" },
  { key: "outro", label: "Outro", color: "#6b7280" },
];

const STATUS_TAREFA = [
  { key: "pendente", label: "Pendente", color: "#f59e0b", bg: "#f59e0b18" },
  { key: "em_andamento", label: "Em Andamento", color: "#3b82f6", bg: "#3b82f618" },
  { key: "concluida", label: "Concluida", color: "#22c55e", bg: "#22c55e18" },
];

const RESPONSAVEIS = [
  { id: "v1", nome: "Miguel Martins", avatar: "MM", cor: "#00e676", cargo: "Designer / CEO" },
  { id: "v2", nome: "Ana Silva", avatar: "AS", cor: "#7c3aed", cargo: "Social Media" },
  { id: "v3", nome: "Carlos Oliveira", avatar: "CO", cor: "#448aff", cargo: "Video Editor" },
];

const STATUS_EVENTO = [
  { key: "confirmado", label: "Confirmado", color: "#22c55e", bg: "#22c55e18" },
  { key: "tentativo", label: "Tentativo", color: "#f59e0b", bg: "#f59e0b18" },
  { key: "cancelado", label: "Cancelado", color: "#ef4444", bg: "#ef444418" },
];

const RECURRENCIA = [
  { key: "nenhuma", label: "Nao se repete" },
  { key: "diario", label: "Diario" },
  { key: "semanal", label: "Semanal" },
  { key: "quinzenal", label: "Quinzenal" },
  { key: "mensal", label: "Mensal" },
  { key: "anual", label: "Anual" },
];

function makeDate(dayOffset, hour, minute = 0) {
  const d = addDays(new Date(), dayOffset);
  return format(setMinutes(setHours(d, hour), minute), "yyyy-MM-dd'T'HH:mm");
}

function makeEndDate(startStr, durationHours) {
  const d = new Date(startStr);
  return format(addHours(d, durationHours), "yyyy-MM-dd'T'HH:mm");
}

const mockEvents = [
  { id: "evt1", title: "Reuniao - Ana Beatriz Costa", description: "Revisao de conteudo mensal", start: makeDate(0, 9), end: makeEndDate(makeDate(0, 9), 1), categoria: "reuniao", prioridade: "alta", status: "confirmado", responsavel: "v1", participantes: ["v1", "v2"], cliente: "Ana Beatriz Costa", local: "Google Meet", recorrencia: "semanal", observacoes: "Discutir metricas do mes", lembretes: [{ tipo: "antes_15min", ativo: true }], cor: "#3b82f6" },
  { id: "evt2", title: "Onboarding - Academia Corpo Livre", description: "Primeira reuniao com novo cliente", start: makeDate(0, 11), end: makeEndDate(makeDate(0, 11), 1), categoria: "onboarding", prioridade: "media", status: "confirmado", responsavel: "v1", participantes: ["v1"], cliente: "Academia Corpo Livre", local: "Zoom", recorrencia: "nenhuma", observacoes: "", lembretes: [{ tipo: "antes_30min", ativo: true }], cor: "#8b5cf6" },
  { id: "evt3", title: "Entrega - Pacote 20 Posts", description: "Entrega de artes para cliente Fernanda", start: makeDate(1, 14), end: makeEndDate(makeDate(1, 14), 0.5), categoria: "entrega", prioridade: "urgente", status: "confirmado", responsavel: "v2", participantes: ["v2", "v1"], cliente: "Fernanda Oliveira", local: "", recorrencia: "nenhuma", observacoes: "20 posts + 4 artes estaticas", lembretes: [{ tipo: "antes_1h", ativo: true }], cor: "#22c55e" },
  { id: "evt4", title: "Demo - Site Imobiliaria Prime", description: "Apresentacao do site para cliente", start: makeDate(1, 10), end: makeEndDate(makeDate(1, 10), 1.5), categoria: "demo", prioridade: "alta", status: "tentativo", responsavel: "v1", participantes: ["v1", "v3"], cliente: "Imobiliaria Prime", local: "Escritorio cliente", recorrencia: "nenhuma", observacoes: "", lembretes: [{ tipo: "antes_15min", ativo: true }], cor: "#06b6d4" },
  { id: "evt5", title: "Follow-up - Dr. Marcos", description: "Verificar andamento do projeto de identidade", start: makeDate(2, 9), end: makeEndDate(makeDate(2, 9), 0.5), categoria: "followup", prioridade: "media", status: "confirmado", responsavel: "v1", participantes: ["v1"], cliente: "Dr. Marcos", local: "Telefone", recorrencia: "nenhuma", observacoes: "", lembretes: [], cor: "#ec4899" },
  { id: "evt6", title: "Revisao - Restaurante Sabor Caseiro", description: "Revisao de conteudo da semana", start: makeDate(2, 15), end: makeEndDate(makeDate(2, 15), 1), categoria: "revisao", prioridade: "baixa", status: "confirmado", responsavel: "v2", participantes: ["v2"], cliente: "Restaurante Sabor Caseiro", local: "Google Meet", recorrencia: "semanal", observacoes: "Cliente pediu foco em stories", lembretes: [{ tipo: "antes_15min", ativo: true }], cor: "#f59e0b" },
  { id: "evt7", title: "Reuniao equipe semanal", description: "Alinhamento semanal da equipe", start: makeDate(3, 9), end: makeEndDate(makeDate(3, 9), 1), categoria: "reuniao", prioridade: "media", status: "confirmado", responsavel: "v1", participantes: ["v1", "v2", "v3"], cliente: "", local: "Escritorio", recorrencia: "semanal", observacoes: "", lembretes: [{ tipo: "antes_15min", ativo: true }], cor: "#3b82f6" },
  { id: "evt8", title: "Lembrete - Pagamento aluguel", description: "", start: makeDate(5, 8), end: makeEndDate(makeDate(5, 8), 0.25), categoria: "pagamento", prioridade: "alta", status: "confirmado", responsavel: "v1", participantes: ["v1"], cliente: "", local: "", recorrencia: "mensal", observacoes: "Aluguel do escritorio", lembretes: [{ tipo: "no_dia", ativo: true }], cor: "#00e676" },
  { id: "evt9", title: "Ligacao - Carlos Eduardo Santos", description: "Follow-up sobre entregas pendentes", start: makeDate(0, 16), end: makeEndDate(makeDate(0, 16), 0.25), categoria: "followup", prioridade: "alta", status: "tentativo", responsavel: "v2", participantes: ["v2"], cliente: "Carlos Eduardo Santos", local: "WhatsApp", recorrencia: "nenhuma", observacoes: "", lembretes: [], cor: "#ec4899" },
  { id: "evt10", title: "Planejamento mensal", description: "Planejamento de conteudo e metas do proximo mes", start: makeDate(4, 10), end: makeEndDate(makeDate(4, 10), 2), categoria: "reuniao", prioridade: "urgente", status: "confirmado", responsavel: "v1", participantes: ["v1", "v2"], cliente: "", local: "Escritorio", recorrencia: "mensal", observacoes: "Traz dados de performance do mes", lembretes: [{ tipo: "antes_1h", ativo: true }, { tipo: "no_dia", ativo: true }], cor: "#3b82f6" },
  { id: "evt11", title: "Entrega - Reels Juliana Menezes", description: "1 Reels curto para perfil de alimentacao", start: makeDate(-1, 14), end: makeEndDate(makeDate(-1, 14), 0.5), categoria: "entrega", prioridade: "media", status: "confirmado", responsavel: "v3", participantes: ["v3"], cliente: "Juliana Menezes", local: "", recorrencia: "nenhuma", observacoes: "", lembretes: [], cor: "#22c55e" },
  { id: "evt12", title: "Consulta dentistica", description: "", start: makeDate(6, 14), end: makeEndDate(makeDate(6, 14), 1), categoria: "pessoal", prioridade: "baixa", status: "confirmado", responsavel: "v1", participantes: ["v1"], cliente: "", local: "Clinica Sorriso", recorrencia: "nenhuma", observacoes: "", lembretes: [{ tipo: "antes_1h", ativo: true }], cor: "#a78bfa" },
];

const mockTasks = [
  { id: "t1", titulo: "Criar 20 posts - Ana Beatriz", descricao: "Pacote premium de conteudo mensal", categoria: "social_media", prioridade: "urgente", status: "em_andamento", responsavel: "v2", cliente: "Ana Beatriz Costa", prazo: makeDate(1, 18), checklist: [{ id: "c1", desc: "20 posts feed", done: true }, { id: "c2", desc: "4 artes estaticas", done: true }, { id: "c3", desc: "2 Reels", done: false }, { id: "c4", desc: "Relatorio semanal", done: false }], tags: ["premium", "mensal"], observacoes: "" },
  { id: "t2", titulo: "Edicao video - Clinica Bem Estar", descricao: "Video institucional 2min", categoria: "video", prioridade: "alta", status: "em_andamento", responsavel: "v3", cliente: "Clinica Bem Estar", prazo: makeDate(2, 18), checklist: [{ id: "c5", desc: "Roteiro aprovado", done: true }, { id: "c6", desc: "Edicao rough cut", done: true }, { id: "c7", desc: "Color grading", done: false }, { id: "c8", desc: "Trilha sonora", done: false }], tags: ["video", "institucional"], observacoes: "Cliente quer tom clean" },
  { id: "t3", titulo: "Entregar artes - Restaurante", descricao: "2 artes estaticas para semana especial", categoria: "design", prioridade: "media", status: "pendente", responsavel: "v1", cliente: "Restaurante Sabor Caseiro", prazo: makeDate(0, 18), checklist: [{ id: "c9", desc: "Arte aniversario", done: false }, { id: "c10", desc: "Arte cardapio especial", done: false }], tags: ["design", "restaurante"], observacoes: "Semana do aniversario!" },
  { id: "t4", titulo: "Agendamento posts - Fernanda", descricao: "Agendar conteudo da semana no Buffer", categoria: "social_media", prioridade: "baixa", status: "concluida", responsavel: "v2", cliente: "Fernanda Oliveira", prazo: makeDate(-1, 18), checklist: [{ id: "c11", desc: "Agendar Instagram", done: true }, { id: "c12", desc: "Agendar TikTok", done: true }], tags: ["agendamento"], observacoes: "" },
  { id: "t5", titulo: "Site - Imobiliaria Prime", descricao: "Finalizar tour virtual e integrar", categoria: "site", prioridade: "alta", status: "em_andamento", responsavel: "v1", cliente: "Imobiliaria Prime", prazo: makeDate(3, 18), checklist: [{ id: "c13", desc: "Tour virtual 360", done: true }, { id: "c14", desc: "Integracao mapa", done: false }, { id: "c15", desc: "Formulario contato", done: false }, { id: "c16", desc: "Testes mobile", done: false }], tags: ["site", "premium"], observacoes: "Demo agendado para quinta" },
  { id: "t6", titulo: "Relatorio mensal - Maio", descricao: "Compilar metricas de todos clientes", categoria: "administrativo", prioridade: "media", status: "pendente", responsavel: "v1", cliente: "", prazo: makeDate(4, 18), checklist: [], tags: ["relatorio", "mensal"], observacoes: "" },
  { id: "t7", titulo: "8 posts - Academia Corpo Livre", descricao: "Pacote basico de conteudo", categoria: "social_media", prioridade: "media", status: "pendente", responsavel: "v2", cliente: "Academia Corpo Livre", prazo: makeDate(5, 18), checklist: [{ id: "c17", desc: "8 posts feed", done: false }, { id: "c18", desc: "1 arte estatica", done: false }], tags: ["basico"], observacoes: "Cliente novo" },
  { id: "t8", titulo: "Logo - Dr. Marcos", descricao: "Identidade visual para consultorio", categoria: "design", prioridade: "urgente", status: "pendente", responsavel: "v1", cliente: "Dr. Marcos", prazo: makeDate(0, 18), checklist: [{ id: "c19", desc: "Pesquisa referencias", done: true }, { id: "c20", desc: "3 propostas logo", done: false }, { id: "c21", desc: "Cartao de visita", done: false }], tags: ["logo", "identidade"], observacoes: "Atrasado - follow-up feito" },
  { id: "t9", titulo: "1 Reels - Juliana Menezes", descricao: "Reels curto para perfil de alimentacao", categoria: "video", prioridade: "baixa", status: "pendente", responsavel: "v3", cliente: "Juliana Menezes", prazo: makeDate(3, 18), checklist: [], tags: ["reels"], observacoes: "" },
  { id: "t10", titulo: "Revisao contrato - Carlos Eduardo", descricao: "Atualizar plano para premium", categoria: "administrativo", prioridade: "baixa", status: "concluida", responsavel: "v1", cliente: "Carlos Eduardo Santos", prazo: makeDate(-2, 18), checklist: [{ id: "c22", desc: "Revisar clausulas", done: true }, { id: "c23", desc: "Enviar contrato", done: true }], tags: ["contrato"], observacoes: "" },
];

const mockReminders = [
  { id: "r1", titulo: "Ligar para Ana Beatriz", tipo: "followup", horario: makeDate(0, 10), ativo: true, responsavel: "v1" },
  { id: "r2", titulo: "Enviar proposta - TechStart", tipo: "pagamento", horario: makeDate(1, 9), ativo: true, responsavel: "v1" },
  { id: "r3", titulo: "Revisar metricas semanais", tipo: "lembrete", horario: makeDate(0, 17), ativo: true, responsavel: "v2" },
  { id: "r4", titulo: "Pagar DAS mei", tipo: "pagamento", horario: makeDate(5, 8), ativo: true, responsavel: "v1" },
  { id: "r5", titulo: "Follow-up Imobiliaria Prime", tipo: "followup", horario: makeDate(2, 11), ativo: true, responsavel: "v1" },
  { id: "r6", titulo: "Backup arquivos semana", tipo: "lembrete", horario: makeDate(4, 18), ativo: false, responsavel: "v1" },
];

const useAgendaStore = create((set, get) => ({
  events: [],
  tasks: [],
  reminders: [],
  search: "",
  view: "calendar",
  calView: "dayGridMonth",
  tipoFilter: "todos",
  prioridadeFilter: "todos",
  responsavelFilter: "todos",
  statusFilter: "todos",
  categoriaFilter: "todos",
  selectedEvent: null,
  selectedTask: null,
  drawerOpen: false,
  eventDialogOpen: false,
  taskDialogOpen: false,
  editId: null,
  loading: true,
  confirmDialog: null,
  toast: null,
  currentDate: new Date(),

  init: () => {
    const stored = getAgenda();
    let events = stored.length > 0 ? stored.map(e => ({
      ...e,
      id: String(e.id),
      start: e.start || makeDate(0, 9),
      end: e.end || makeEndDate(makeDate(0, 9), 1),
      cor: e.cor || "#3b82f6",
      categoria: e.categoria || "reuniao",
      prioridade: e.prioridade || "media",
      status: e.status || "confirmado",
      responsavel: e.responsavel || "v1",
      participantes: e.participantes || [],
      lembretes: e.lembretes || [],
    })) : mockEvents;
    set({ events, tasks: mockTasks, reminders: mockReminders, loading: false });
  },

  setSearch: (s) => set({ search: s }),
  setView: (v) => set({ view: v }),
  setCalView: (v) => set({ calView: v }),
  setCurrentDate: (d) => set({ currentDate: d }),
  setTipoFilter: (f) => set({ tipoFilter: f }),
  setPrioridadeFilter: (f) => set({ prioridadeFilter: f }),
  setResponsavelFilter: (f) => set({ responsavelFilter: f }),
  setStatusFilter: (f) => set({ statusFilter: f }),
  setCategoriaFilter: (f) => set({ categoriaFilter: f }),

  openDrawer: (event) => set({ selectedEvent: event, drawerOpen: true }),
  closeDrawer: () => set({ selectedEvent: null, drawerOpen: false }),
  openEventDialog: (editId = null) => set({ eventDialogOpen: true, editId }),
  closeEventDialog: () => set({ eventDialogOpen: false, editId: null }),
  openTaskDialog: (editId = null) => set({ taskDialogOpen: true, editId }),
  closeTaskDialog: () => set({ taskDialogOpen: false, editId: null }),

  addEvent: (evt) => {
    const newEvt = { ...evt, id: "evt" + Date.now(), cor: CATEGORIAS_EVENTO.find(c => c.key === evt.categoria)?.color || "#3b82f6" };
    const events = [...get().events, newEvt];
    set({ events, toast: { type: "success", message: "Evento criado" } });
    syncEvents(events);
    setTimeout(() => set({ toast: null }), 3000);
  },

  updateEvent: (id, data) => {
    const events = get().events.map(e => e.id === id ? { ...e, ...data } : e);
    set({ events });
    syncEvents(events);
    const selected = get().selectedEvent;
    if (selected && selected.id === id) set({ selectedEvent: { ...selected, ...data } });
  },

  deleteEvent: (id) => {
    const events = get().events.filter(e => e.id !== id);
    set({ events, drawerOpen: false, selectedEvent: null, confirmDialog: null, toast: { type: "success", message: "Evento removido" } });
    syncEvents(events);
    setTimeout(() => set({ toast: null }), 3000);
  },

  moveEvent: (id, start, end) => {
    const events = get().events.map(e => e.id === id ? { ...e, start, end } : e);
    set({ events });
    syncEvents(events);
  },

  addTask: (task) => {
    const newTask = { ...task, id: "t" + Date.now() };
    const tasks = [...get().tasks, newTask];
    set({ tasks, toast: { type: "success", message: "Tarefa criada" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  updateTask: (id, data) => {
    const tasks = get().tasks.map(t => t.id === id ? { ...t, ...data } : t);
    set({ tasks });
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter(t => t.id !== id);
    set({ tasks, confirmDialog: null, toast: { type: "success", message: "Tarefa removida" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  toggleChecklist: (taskId, checkId) => {
    const tasks = get().tasks.map(t => {
      if (t.id !== taskId) return t;
      const checklist = (t.checklist || []).map(c => c.id === checkId ? { ...c, done: !c.done } : c);
      const allDone = checklist.length > 0 && checklist.every(c => c.done);
      return { ...t, checklist, status: allDone ? "concluida" : t.status === "concluida" ? "em_andamento" : t.status };
    });
    set({ tasks });
  },

  moveTaskStatus: (taskId, newStatus) => {
    const tasks = get().tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    set({ tasks, toast: { type: "success", message: "Tarefa movida" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  toggleReminder: (id) => {
    const reminders = get().reminders.map(r => r.id === id ? { ...r, ativo: !r.ativo } : r);
    set({ reminders });
  },

  addReminder: (rem) => {
    const reminders = [...get().reminders, { ...rem, id: "r" + Date.now(), ativo: true }];
    set({ reminders, toast: { type: "success", message: "Lembrete adicionado" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  deleteReminder: (id) => {
    const reminders = get().reminders.filter(r => r.id !== id);
    set({ reminders });
  },

  showConfirm: (config) => set({ confirmDialog: config }),
  hideConfirm: () => set({ confirmDialog: null }),

  getFilteredEvents: () => {
    const { events, search, tipoFilter, prioridadeFilter, responsavelFilter, statusFilter, categoriaFilter } = get();
    let list = [...events];
    if (tipoFilter !== "todos") list = list.filter(e => e.categoria === tipoFilter);
    if (prioridadeFilter !== "todos") list = list.filter(e => e.prioridade === prioridadeFilter);
    if (responsavelFilter !== "todos") list = list.filter(e => e.responsavel === responsavelFilter);
    if (statusFilter !== "todos") list = list.filter(e => e.status === statusFilter);
    if (categoriaFilter !== "todos") list = list.filter(e => e.categoria === categoriaFilter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(e => e.title?.toLowerCase().includes(s) || e.cliente?.toLowerCase().includes(s) || e.description?.toLowerCase().includes(s));
    }
    return list;
  },

  getFilteredTasks: () => {
    const { tasks, search, prioridadeFilter, responsavelFilter, statusFilter } = get();
    let list = [...tasks];
    if (prioridadeFilter !== "todos") list = list.filter(t => t.prioridade === prioridadeFilter);
    if (responsavelFilter !== "todos") list = list.filter(t => t.responsavel === responsavelFilter);
    if (statusFilter !== "todos") list = list.filter(t => t.status === statusFilter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(t => t.titulo?.toLowerCase().includes(s) || t.cliente?.toLowerCase().includes(s));
    }
    return list;
  },

  getMetrics: () => {
    const { events, tasks, reminders } = get();
    const today = format(new Date(), "yyyy-MM-dd");
    const todayEvents = events.filter(e => e.start?.startsWith(today));
    const pendingTasks = tasks.filter(t => t.status !== "concluida");
    const todayMeetings = todayEvents.filter(e => e.categoria === "reuniao" || e.categoria === "onboarding" || e.categoria === "demo");
    const followups = events.filter(e => e.categoria === "followup" && e.start >= format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    const completedTasks = tasks.filter(t => t.status === "concluida");
    const activeReminders = reminders.filter(r => r.ativo);
    const totalTasks = tasks.length || 1;
    const produtividade = Math.round((completedTasks.length / totalTasks) * 100);
    return {
      eventosHoje: todayEvents.length,
      tarefasPendentes: pendingTasks.length,
      reunioesHoje: todayMeetings.length,
      followups: followups.length,
      tarefasConcluidas: completedTasks.length,
      produtividade,
      lembretesAtivos: activeReminders.length,
    };
  },

  getTodayMeetings: () => {
    const { events } = get();
    const today = format(new Date(), "yyyy-MM-dd");
    return events.filter(e => e.start?.startsWith(today) && ["reuniao", "onboarding", "demo", "followup"].includes(e.categoria))
      .sort((a, b) => (a.start || "").localeCompare(b.start || ""));
  },

  getUpcomingEvents: () => {
    const { events } = get();
    const now = format(new Date(), "yyyy-MM-dd'T'HH:mm");
    return events.filter(e => e.start >= now).sort((a, b) => (a.start || "").localeCompare(b.start || "")).slice(0, 5);
  },

  getCalendarEvents: () => {
    const { getFilteredEvents } = get();
    return getFilteredEvents().map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      backgroundColor: "transparent",
      borderColor: "transparent",
      extendedProps: { ...e },
    }));
  },
}));

function syncEvents(events) {
  saveAgenda(events.map(e => ({
    id: e.id, title: e.title, description: e.description, start: e.start, end: e.end,
    categoria: e.categoria, prioridade: e.prioridade, status: e.status, responsavel: e.responsavel,
    participantes: e.participantes, cliente: e.cliente, local: e.local, recorrencia: e.recorrencia,
    observacoes: e.observacoes, lembretes: e.lembretes, cor: e.cor,
  })));
}

export {
  PRIORIDADES, CATEGORIAS_EVENTO, CATEGORIAS_TAREFA, STATUS_TAREFA, STATUS_EVENTO,
  RECURRENCIA, RESPONSAVEIS,
};
export default useAgendaStore;
