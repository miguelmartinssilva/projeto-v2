/* ═══════════════════════════════════════════════════════════════
   CONFIG.JS — Constantes globais e utilitários de segurança
   ═══════════════════════════════════════════════════════════════ */

/* ─── CHAVES DE LOCALSTORAGE ───────────────────────────────────── */
const HIST_KEY          = "historico_orcamentos_miguel";
const SERVICOS_KEY      = "servicos_miguel";
const PACOTES_KEY       = "pacotes_miguel";
const PERFIS_KEY        = "orc_perfis_v1";
const PERFIL_ATIVO_KEY  = "orc_perfil_ativo_v1";
const ADMIN_SESSION_KEY = "miguel_admin_session";
const ADMIN_USER_KEY    = "miguel_admin_user";
const ADMIN_PASS_KEY    = "miguel_admin_pass";
const ADMIN_PASS_HASH   = "miguel_admin_pass_hash";
const CONTADOR_KEY      = "orc_contador_v1";
const CLIENTES_KEY      = "clientes_miguel";
const FINANCEIRO_KEY    = "financeiro_miguel";

/* ─── DURAÇÃO DA SESSÃO ────────────────────────────────────────── */
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; /* 8 horas */

/* ─── LIMITE DE AVISO DO STORAGE ───────────────────────────────── */
const STORAGE_WARN_BYTES = 3_000_000; /* ~3MB */

/* ─── SANITIZAÇÃO XSS ──────────────────────────────────────────── */
/**
 * Escapa HTML para uso seguro em innerHTML.
 * Usa o parser do próprio browser — sem dependências externas.
 */
function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ─── HASH DE SENHA (SHA-256 via Web Crypto API) ───────────────── */
async function hashSenha(senha) {
  const encoder = new TextEncoder();
  const data     = encoder.encode(senha);
  const hashBuf  = await crypto.subtle.digest("SHA-256", data);
  const hashArr  = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ─── GERENCIAMENTO DE SESSÃO SEGURA ───────────────────────────── */
function criarSessao() {
  const sessao = {
    on:      true,
    expires: Date.now() + SESSION_TTL_MS,
  };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessao));
}

function sessaoValida() {
  try {
    const raw  = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const sess = JSON.parse(raw);
    /* exige sessão com expiração válida — sessões antigas sem expires são rejeitadas */
    if (sess?.on && sess?.expires && Date.now() < sess.expires) {
      sess.expires = Date.now() + SESSION_TTL_MS;
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sess));
      return true;
    }
    /* sessão expirada — limpar */
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  } catch {
    return false;
  }
}

function encerrarSessao() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

/* ─── VERIFICAÇÃO DE STORAGE ───────────────────────────────────── */
function verificarStorage() {
  try {
    const hist    = localStorage.getItem(HIST_KEY) || "";
    const perfis  = localStorage.getItem(PERFIS_KEY) || "";
    const total   = hist.length + perfis.length;
    if (total > STORAGE_WARN_BYTES && typeof toast === "function") {
      toast("Armazenamento quase cheio — considere exportar e limpar o histórico", "#e88a00");
    }
  } catch { /* silencioso */ }
}

/* ─── MÁSCARA DE WHATSAPP ──────────────────────────────────────── */
function aplicarMascaraWpp(input) {
  if (!input) return;
  input.addEventListener("input", function () {
    let v = this.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) {
      v = "(" + v.slice(0, 2) + ") " + v.slice(2, 7) + "-" + v.slice(7);
    } else if (v.length > 2) {
      v = "(" + v.slice(0, 2) + ") " + v.slice(2);
    } else if (v.length > 0) {
      v = "(" + v;
    }
    this.value = v;
  });
}

/* ─── SERVICE WORKER (PWA) ──────────────────────────────────────── */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

/* ─── FAVICON ──────────────────────────────────────────────────── */
(function() {
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = "IMG/LOGO.png";
  document.head.appendChild(link);
  const apple = document.createElement("link");
  apple.rel = "apple-touch-icon";
  apple.href = "IMG/LOGO.png";
  document.head.appendChild(apple);
})();

/* ─── EXPORTS GLOBAIS ──────────────────────────────────────────── */
window.esc               = esc;
window.hashSenha         = hashSenha;
window.criarSessao       = criarSessao;
window.sessaoValida      = sessaoValida;
window.encerrarSessao    = encerrarSessao;
window.verificarStorage  = verificarStorage;
window.aplicarMascaraWpp = aplicarMascaraWpp;
window.HIST_KEY          = HIST_KEY;
window.CLIENTES_KEY      = CLIENTES_KEY;
window.FINANCEIRO_KEY    = FINANCEIRO_KEY;

