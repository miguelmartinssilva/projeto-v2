const KEYS = {
  HIST: "historico_orcamentos_miguel",
  CLIENTES: "clientes_miguel",
  FINANCEIRO: "financeiro_miguel",
  SERVICOS: "servicos_miguel",
  PACOTES: "pacotes_miguel",
  PERFIS: "orc_perfis_v1",
  PERFIL_ATIVO: "orc_perfil_ativo_v1",
  CONTADOR: "orc_contador_v1",
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
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

export const getHistorico = () => get(KEYS.HIST, []);
export const saveHistorico = (item) => {
  const hist = getHistorico();
  const idx = hist.findIndex(h => h.id === item.id);
  if (idx >= 0) {
    item.status = hist[idx].status || "rascunho";
    hist[idx] = item;
  } else {
    hist.unshift(item);
  }
  set(KEYS.HIST, hist);
};

export const getClientes = () => get(KEYS.CLIENTES, []);
export const saveClientes = (lista) => set(KEYS.CLIENTES, lista);

export const getTransactions = () => get(KEYS.FINANCEIRO, []);
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
