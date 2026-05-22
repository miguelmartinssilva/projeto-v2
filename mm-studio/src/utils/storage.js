const KEYS = {
  HIST: "historico_orcamentos_miguel",
  CLIENTES: "clientes_miguel",
  FINANCEIRO: "financeiro_miguel",
  SERVICOS: "servicos_miguel",
  PACOTES: "pacotes_miguel",
  PERFIS: "orc_perfis_v1",
  PERFIL_ATIVO: "orc_perfil_ativo_v1",
  CONTADOR: "orc_contador_v1",
  DESPESAS: "despesas_miguel",
  FIXOS: "clientes_fixos_miguel",
  PLANOS_FIXOS: "planos_fixos_miguel",
};

function get(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* ignore */ }
}

export const getHistorico = () => get(KEYS.HIST, []);
export const saveHistorico = (item) => {
  const hist = getHistorico();
  const idx = hist.findIndex(h => h.id === item.id);
  if (idx >= 0) {
    if (!item.status) item.status = hist[idx].status || "rascunho";
    hist[idx] = item;
  } else {
    hist.unshift(item);
  }
  set(KEYS.HIST, hist);
};
export const deleteHistorico = (id) => {
  const hist = getHistorico().filter(h => h.id !== id);
  set(KEYS.HIST, hist);
};
export const getDespesas = () => get(KEYS.DESPESAS, []);
export const saveDespesa = (item) => {
  const lista = getDespesas();
  const idx = lista.findIndex(d => d.id === item.id);
  if (idx >= 0) lista[idx] = item;
  else lista.unshift(item);
  set(KEYS.DESPESAS, lista);
};
export const deleteDespesa = (id) => {
  set(KEYS.DESPESAS, getDespesas().filter(d => d.id !== id));
};

export const getClientes = () => get(KEYS.CLIENTES, []);
export const saveClientes = (lista) => set(KEYS.CLIENTES, lista);

export const getTransactions = () => {
  const data = get(KEYS.FINANCEIRO, []);
  return Array.isArray(data) ? data : [];
};
export const saveTransactions = (lista) => set(KEYS.FINANCEIRO, lista);

export const getServicos = () => get(KEYS.SERVICOS, SERVICOS_PADRAO);
export const saveServicos = (lista) => set(KEYS.SERVICOS, lista);

export const getPacotes = () => get(KEYS.PACOTES, PACOTES_PADRAO);
export const savePacotes = (lista) => set(KEYS.PACOTES, lista);

export const getPerfis = () => {
  const perfis = get(KEYS.PERFIS, []);
  if (!perfis.length) return [createPerfilPadrao(1)];
  return perfis;
};
export const savePerfis = (lista) => set(KEYS.PERFIS, lista);

export const getPerfilAtivo = () => {
  const perfis = getPerfis();
  const idAtivo = parseInt(localStorage.getItem(KEYS.PERFIL_ATIVO)) || perfis[0]?.id;
  return perfis.find(p => p.id === idAtivo) || perfis[0];
};
export const setPerfilAtivo = (id) => set(KEYS.PERFIL_ATIVO, id);

export const getProximoNumero = () => {
  const ano = new Date().getFullYear();
  let c = get(KEYS.CONTADOR, {});
  if (c.ano !== ano) c = { ano, seq: 0 };
  c.seq = (c.seq || 0) + 1;
  set(KEYS.CONTADOR, c);
  return String(c.seq).padStart(3, "0") + "/" + ano;
};

function createPerfilPadrao(id) {
  return {
    id, nome: "Miguel Martins", tipo: "pf", cpf: "", cnpj: "",
    nomeEmpresa: "", telefone: "", whatsapp: "", email: "",
    endereco: "", pixTipo: "cpf", pixChave: "", logo: "", assinatura: "",
    mostrarCpfCnpj: true, mostrarPix: true, mostrarEndereco: false,
    mostrarEmail: true, mostrarTelefone: true, cor: "#00e676",
  };
}

const SERVICOS_PADRAO = [
  { id: 1, nome: "Post para Redes Sociais", unidade: "por arte", preco: 35 },
  { id: 2, nome: "Banner", unidade: "por arte", preco: 80 },
  { id: 3, nome: "Logotipo", unidade: "por pacote", preco: 350 },
  { id: 4, nome: "Video / Reels", unidade: "por video", preco: 150 },
  { id: 5, nome: "Cobertura de Evento", unidade: "por hora", preco: 200 },
  { id: 6, nome: "Transmissao ao Vivo", unidade: "por hora", preco: 250 },
];

const PACOTES_PADRAO = [
  { id: 1, nome: "Pacote 10 Posts", servico: "Post para Redes Sociais", qtd: 10, precoTotal: 120, descricao: "Ideal para 1 mes de conteudo" },
  { id: 2, nome: "Pacote 20 Posts", servico: "Post para Redes Sociais", qtd: 20, precoTotal: 200, descricao: "2 meses · economia de R$ 50" },
  { id: 3, nome: "Pacote Identidade", servico: "Logotipo", qtd: 1, precoTotal: 300, descricao: "Logo + cartao de visita" },
  { id: 4, nome: "Pacote Reels Mensal", servico: "Video / Reels", qtd: 4, precoTotal: 500, descricao: "4 videos por mes" },
  { id: 5, nome: "Pacote Evento Full", servico: "Cobertura de Evento", qtd: 4, precoTotal: 700, descricao: "Cobertura + edicao inclusa" },
];

const FIXOS_PADRAO = [
  { id: 1, nome: "Ana Beatriz Costa", whatsapp: "11987654321", plano: "premium", valorMensal: 2000, diaVencimento: 5, dataInicio: "2026-01-10", ativo: true, entregas: { "2026-05": [{ desc: "20 posts para redes sociais", qtd: 1, status: "andamento", obs: "" }, { desc: "4 artes estaticas", qtd: 1, status: "concluido", obs: "Aprovado" }, { desc: "2 Reels", qtd: 1, status: "pendente", obs: "" }, { desc: "Relatorio semanal", qtd: 1, status: "pendente", obs: "" }] }, anotacoes: { "2026-05": "Cliente pediu foco em stories hoje. Prefere tom mais descontraido." }, historicoFinanceiro: [{ mes: "2026-01", valor: 2000, status: "pago", dataPagamento: "2026-01-05" }, { mes: "2026-02", valor: 2000, status: "pago", dataPagamento: "2026-02-05" }, { mes: "2026-03", valor: 2000, status: "pago", dataPagamento: "2026-03-07" }, { mes: "2026-04", valor: 2000, status: "pago", dataPagamento: "2026-04-05" }, { mes: "2026-05", valor: 2000, status: "pendente", dataPagamento: null }] },
  { id: 2, nome: "Carlos Eduardo Santos", whatsapp: "11976543210", plano: "padrao", valorMensal: 1200, diaVencimento: 10, dataInicio: "2026-02-01", ativo: true, entregas: { "2026-05": [{ desc: "12 posts para redes sociais", qtd: 1, status: "concluido", obs: "" }, { desc: "2 artes estaticas", qtd: 1, status: "concluido", obs: "" }, { desc: "1 Reels curto", qtd: 1, status: "pendente", obs: "Cliente enviou素材" }, { desc: "Relatorio mensal", qtd: 1, status: "pendente", obs: "" }] }, anotacoes: { "2026-04": "Cliente esta viajando esta semana. Avisar antes de publicar.", "2026-05": "Pediu para adiantar os posts do fim de semana." }, historicoFinanceiro: [{ mes: "2026-02", valor: 1200, status: "pago", dataPagamento: "2026-02-10" }, { mes: "2026-03", valor: 1200, status: "pago", dataPagamento: "2026-03-12" }, { mes: "2026-04", valor: 1200, status: "pago", dataPagamento: "2026-04-10" }, { mes: "2026-05", valor: 1200, status: "pendente", dataPagamento: null }] },
  { id: 3, nome: "Juliana Menezes", whatsapp: "11965432109", plano: "basico", valorMensal: 600, diaVencimento: 15, dataInicio: "2026-04-15", ativo: true, entregas: { "2026-05": [{ desc: "8 posts para redes sociais", qtd: 1, status: "concluido", obs: "" }, { desc: "1 arte estatica", qtd: 1, status: "pendente", obs: "" }] }, anotacoes: { "2026-05": "Cliente nova, perfil de alimentacao saudavel. Tom clean e moderno." }, historicoFinanceiro: [{ mes: "2026-04", valor: 600, status: "pago", dataPagamento: "2026-04-15" }, { mes: "2026-05", valor: 600, status: "pendente", dataPagamento: null }] },
  { id: 4, nome: "Restaurante Sabor Caseiro", whatsapp: "11954321098", plano: "padrao", valorMensal: 1200, diaVencimento: 20, dataInicio: "2025-11-01", ativo: true, entregas: { "2026-05": [{ desc: "12 posts para redes sociais", qtd: 1, status: "concluido", obs: "Fotos do novo cardapio" }, { desc: "2 artes estaticas", qtd: 1, status: "concluido", obs: "" }, { desc: "1 Reels curto", qtd: 1, status: "andamento", obs: "Video do chef" }] }, anotacoes: { "2026-04": "Semana do aniversario do restaurante! Preparar postagem especial.", "2026-05": "Cliente quer impulsionar os posts esse mes." }, historicoFinanceiro: [{ mes: "2025-11", valor: 1200, status: "pago", dataPagamento: "2025-11-20" }, { mes: "2025-12", valor: 1200, status: "pago", dataPagamento: "2025-12-20" }, { mes: "2026-01", valor: 1200, status: "pago", dataPagamento: "2026-01-22" }, { mes: "2026-02", valor: 1200, status: "pago", dataPagamento: "2026-02-20" }, { mes: "2026-03", valor: 1200, status: "pago", dataPagamento: "2026-03-20" }, { mes: "2026-04", valor: 1200, status: "pago", dataPagamento: "2026-04-21" }, { mes: "2026-05", valor: 1200, status: "pendente", dataPagamento: null }] },
  { id: 5, nome: "Fernanda Oliveira", whatsapp: "11943210987", plano: "premium", valorMensal: 2000, diaVencimento: 1, dataInicio: "2026-03-01", ativo: true, entregas: { "2026-05": [{ desc: "20 posts para redes sociais", qtd: 1, status: "concluido", obs: "" }, { desc: "4 artes estaticas", qtd: 1, status: "concluido", obs: "" }, { desc: "2 Reels", qtd: 1, status: "concluido", obs: "" }, { desc: "1 Video institucional", qtd: 1, status: "pendente", obs: "Roteiro em aprovacao" }, { desc: "Agendamento", qtd: 1, status: "concluido", obs: "" }] }, anotacoes: { "2026-05": "Influencer digital, precisa de conteudo para as 3 marcas que representa." }, historicoFinanceiro: [{ mes: "2026-03", valor: 2000, status: "pago", dataPagamento: "2026-03-01" }, { mes: "2026-04", valor: 2000, status: "pago", dataPagamento: "2026-04-01" }, { mes: "2026-05", valor: 2000, status: "pendente", dataPagamento: null }] },
  { id: 6, nome: "Academia Corpo Livre", whatsapp: "11932109876", plano: "basico", valorMensal: 600, diaVencimento: 8, dataInicio: "2026-05-01", ativo: true, entregas: { "2026-05": [{ desc: "8 posts para redes sociais", qtd: 1, status: "pendente", obs: "" }, { desc: "1 arte estatica", qtd: 1, status: "pendente", obs: "" }] }, anotacoes: { "2026-05": "Cliente novo! Combinado de postar segunda, quarta e sexta." }, historicoFinanceiro: [{ mes: "2026-05", valor: 600, status: "pendente", dataPagamento: null }] },
];
export const getFixos = () => {
  try {
    const raw = localStorage.getItem(KEYS.FIXOS);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  set(KEYS.FIXOS, FIXOS_PADRAO);
  return FIXOS_PADRAO;
};
export const saveFixo = (item) => {
  const lista = getFixos();
  const idx = lista.findIndex(f => f.id === item.id);
  if (idx >= 0) lista[idx] = item;
  else lista.unshift(item);
  set(KEYS.FIXOS, lista);
};
export const deleteFixo = (id) => set(KEYS.FIXOS, getFixos().filter(f => f.id !== id));

const PLANOS_PADRAO = {
  basico: { nome: "Basico", valor: 600, cor: "#448aff", bg: "#448aff15", entregas: ["8 posts para redes sociais", "1 arte estatica", "Agendamento semanal"] },
  padrao: { nome: "Padrao", valor: 1200, cor: "#7c3aed", bg: "#7c3aed15", entregas: ["12 posts para redes sociais", "2 artes estaticas", "1 Reels curto", "Agendamento", "Relatorio mensal"] },
  premium: { nome: "Premium", valor: 2000, cor: "#ffb800", bg: "#ffb80015", entregas: ["20 posts para redes sociais", "4 artes estaticas", "2 Reels", "1 Video institucional", "Agendamento", "Relatorio semanal", "Suporte prioritario"] },
};
export const getPlanosFixos = () => get(KEYS.PLANOS_FIXOS, PLANOS_PADRAO);
export const savePlanosFixos = (planos) => set(KEYS.PLANOS_FIXOS, planos);
