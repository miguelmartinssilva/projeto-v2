import { create } from "zustand";
import { getClientes, saveClientes } from "../utils/storage";

const STATUS_ORDER = ["lead", "contato", "proposta", "negociacao", "fechado", "perdido"];

const mockClients = [
  { id: 1, nome: "Construtora Vale Verde", empresa: "Vale Verde Ltda", telefone: "(31) 99876-5432", email: "contato@valeverde.com", whatsapp: "(31) 99876-5432", cpfCnpj: "12.345.678/0001-90", status: "negociacao", responsavel: "Miguel", receita: 3200, tags: ["design", "identidade"], ultimoContato: "2024-05-20", tipo: "projeto", observacoes: "Projeto de identidade visual completo", timeline: [{ data: "2024-05-20", tipo: "reuniao", desc: "Reuniao de alinhamento" }, { data: "2024-05-15", tipo: "proposta", desc: "Proposta enviada - R$ 3.200" }], tarefas: [{ id: 1, desc: "Follow-up proposta", prazo: "2024-05-25", done: false }] },
  { id: 2, nome: "Clinica Bem Estar", empresa: "Bem Estar Saude", telefone: "(31) 98765-4321", email: "marketing@bemestar.com", whatsapp: "(31) 98765-4321", cpfCnpj: "98.765.432/0001-10", status: "proposta", responsavel: "Miguel", receita: 4800, tags: ["video", "institucional"], ultimoContato: "2024-05-18", tipo: "mensal", observacoes: "Video institucional + social media", timeline: [{ data: "2024-05-18", tipo: "proposta", desc: "Proposta enviada - R$ 4.800" }], tarefas: [] },
  { id: 3, nome: "Agencia Ponto", empresa: "Ponto Digital", telefone: "(31) 97654-3210", email: "criativo@ponto.com", whatsapp: "(31) 97654-3210", cpfCnpj: "11.222.333/0001-44", status: "contato", responsavel: "Miguel", receita: 960, tags: ["social media", "pacote"], ultimoContato: "2024-05-22", tipo: "pacote", observacoes: "Pack social media mensal", timeline: [{ data: "2024-05-22", tipo: "contato", desc: "Primeiro contato via Instagram" }], tarefas: [] },
  { id: 4, nome: "Studio K Arquitetura", empresa: "Studio K", telefone: "(31) 96543-2109", email: "karla@studiok.com", whatsapp: "(31) 96543-2109", cpfCnpj: "456.789.012-33", status: "lead", responsavel: "Miguel", receita: 680, tags: ["motion", "logo"], ultimoContato: "2024-05-23", tipo: "avulso", observacoes: "Motion logo - interesse inicial", timeline: [{ data: "2024-05-23", tipo: "contato", desc: "Lead via formulario do site" }], tarefas: [] },
  { id: 5, nome: "Loja Urbana", empresa: "Urbana Moda", telefone: "(31) 95432-1098", email: "comercial@urbana.com", whatsapp: "(31) 95432-1098", cpfCnpj: "55.666.777/0001-88", status: "fechado", responsavel: "Miguel", receita: 4800, tags: ["pacote", "social media"], ultimoContato: "2024-05-10", tipo: "retainer", observacoes: "Cliente fixo - pacote mensal", timeline: [{ data: "2024-05-10", tipo: "fechamento", desc: "Fechamento - R$ 4.800/mes" }], tarefas: [] },
  { id: 6, nome: "Restaurante Sabor", empresa: "Sabor & Cia", telefone: "(31) 94321-0987", email: "contato@sabor.com", whatsapp: "(31) 94321-0987", cpfCnpj: "99.888.777/0001-66", status: "perdido", responsavel: "Miguel", receita: 0, tags: ["design", "cardapio"], ultimoContato: "2024-04-28", tipo: "avulso", observacoes: "Nao prosseguiu - orçamento acima do esperado", timeline: [{ data: "2024-04-28", tipo: "perdido", desc: "Proposta recusada" }], tarefas: [] },
  { id: 7, nome: "TechStart", empresa: "TechStart Inc", telefone: "(11) 99123-4567", email: "ceo@techstart.io", whatsapp: "(11) 99123-4567", cpfCnpj: "22.333.444/0001-55", status: "lead", responsavel: "Miguel", receita: 0, tags: ["site", "startup"], ultimoContato: "2024-05-24", tipo: "projeto", observacoes: "Startup de tech - interesse em site + branding", timeline: [{ data: "2024-05-24", tipo: "contato", desc: "Indicacao de parceria" }], tarefas: [] },
  { id: 8, nome: "Dr. Marcos Saude", empresa: "Consultorio Dr. Marcos", telefone: "(31) 91234-5678", email: "drmarcos@gmail.com", whatsapp: "(31) 91234-5678", cpfCnpj: "123.456.789-00", status: "negociacao", responsavel: "Miguel", receita: 1500, tags: ["design", "social media"], ultimoContato: "2024-05-21", tipo: "mensal", observacoes: "Social media + identidade visual consultorio", timeline: [{ data: "2024-05-21", tipo: "reuniao", desc: "Reuniao presencial" }], tarefas: [{ id: 2, desc: "Enviar proposta revisada", prazo: "2024-05-26", done: false }] },
];

const useCrmStore = create((set, get) => ({
  clients: [],
  search: "",
  view: "table",
  statusFilter: "todos",
  tipoFilter: "todos",
  selectedClient: null,
  drawerOpen: false,
  dialogOpen: false,
  editId: null,
  loading: true,
  confirmDialog: null,
  toast: null,

  init: () => {
    const stored = getClientes();
    const clients = stored.length > 0 ? stored.map(c => ({ ...c, status: c.status === "ativo" ? "fechado" : c.status === "pendente" ? "lead" : c.status || "lead", timeline: c.timeline || [], tarefas: c.tarefas || [], tags: c.tags || [], observacoes: c.observacoes || "", receita: c.receita || 0, responsavel: c.responsavel || "Miguel", ultimoContato: c.ultimoContato || new Date().toISOString().slice(0, 10) })) : mockClients;
    set({ clients, loading: false });
  },

  setSearch: (search) => set({ search }),
  setView: (view) => set({ view }),
  setStatusFilter: (f) => set({ statusFilter: f }),
  setTipoFilter: (f) => set({ tipoFilter: f }),

  openDrawer: (client) => set({ selectedClient: client, drawerOpen: true }),
  closeDrawer: () => set({ selectedClient: null, drawerOpen: false }),

  openDialog: (editId = null) => set({ dialogOpen: true, editId }),
  closeDialog: () => set({ dialogOpen: false, editId: null }),

  addClient: (client) => {
    const clients = [...get().clients, { ...client, id: Date.now(), timeline: [{ data: new Date().toISOString().slice(0, 10), tipo: "contato", desc: "Cliente cadastrado" }], tarefas: [], tags: client.tags || [], ultimoContato: new Date().toISOString().slice(0, 10) }];
    set({ clients });
    saveClientes(clients);
    set({ toast: { type: "success", message: "Cliente adicionado" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  updateClient: (id, data) => {
    const clients = get().clients.map(c => c.id === id ? { ...c, ...data } : c);
    set({ clients });
    saveClientes(clients);
    const selected = get().selectedClient;
    if (selected && selected.id === id) set({ selectedClient: { ...selected, ...data } });
  },

  deleteClient: (id) => {
    const clients = get().clients.filter(c => c.id !== id);
    set({ clients });
    saveClientes(clients);
    set({ drawerOpen: false, selectedClient: null, confirmDialog: null, toast: { type: "success", message: "Cliente removido" } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  moveClientStatus: (id, newStatus) => {
    const clients = get().clients.map(c => {
      if (c.id === id) {
        const timeline = [...(c.timeline || []), { data: new Date().toISOString().slice(0, 10), tipo: "status", desc: `Status alterado para ${newStatus}` }];
        return { ...c, status: newStatus, timeline };
      }
      return c;
    });
    set({ clients });
    saveClientes(clients);
  },

  addTimelineEntry: (id, entry) => {
    const clients = get().clients.map(c => {
      if (c.id === id) return { ...c, timeline: [...(c.timeline || []), entry], ultimoContato: entry.data };
      return c;
    });
    set({ clients });
    saveClientes(clients);
    const selected = get().selectedClient;
    if (selected && selected.id === id) set({ selectedClient: { ...selected, timeline: [...(selected.timeline || []), entry] } });
  },

  addTask: (clientId, task) => {
    const clients = get().clients.map(c => {
      if (c.id === clientId) return { ...c, tarefas: [...(c.tarefas || []), { ...task, id: Date.now(), done: false }] };
      return c;
    });
    set({ clients });
    saveClientes(clients);
  },

  toggleTask: (clientId, taskId) => {
    const clients = get().clients.map(c => {
      if (c.id === clientId) return { ...c, tarefas: (c.tarefas || []).map(t => t.id === taskId ? { ...t, done: !t.done } : t) };
      return c;
    });
    set({ clients });
    saveClientes(clients);
  },

  showConfirm: (config) => set({ confirmDialog: config }),
  hideConfirm: () => set({ confirmDialog: null }),

  getFilteredClients: () => {
    const { clients, search, statusFilter, tipoFilter } = get();
    let list = [...clients];
    if (statusFilter !== "todos") list = list.filter(c => c.status === statusFilter);
    if (tipoFilter !== "todos") list = list.filter(c => c.tipo === tipoFilter);
    if (search) { const s = search.toLowerCase(); list = list.filter(c => c.nome?.toLowerCase().includes(s) || c.empresa?.toLowerCase().includes(s) || c.email?.toLowerCase().includes(s)); }
    return list;
  },

  getMetrics: () => {
    const { clients } = get();
    return {
      total: clients.length,
      leads: clients.filter(c => c.status === "lead").length,
      negociacoes: clients.filter(c => ["proposta", "negociacao"].includes(c.status)).length,
      conversoes: clients.filter(c => c.status === "fechado").length,
      receita: clients.reduce((s, c) => s + (c.receita || 0), 0),
    };
  },

  getKanbanColumns: () => {
    const clients = get().getFilteredClients();
    const cols = {};
    STATUS_ORDER.forEach(s => { cols[s] = clients.filter(c => c.status === s); });
    return cols;
  },
}));

export { STATUS_ORDER };
export default useCrmStore;
