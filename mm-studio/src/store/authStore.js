import { create } from "zustand";

const MOCK_USER = {
  id: "u1",
  nome: "Miguel Martins",
  email: "miguel@mmstudio.com",
  avatar: "MM",
  cargo: "CEO / Designer",
  cor: "#00e676",
};

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  loginError: null,
  recoverySent: false,
  recoveryOpen: false,
  rememberMe: false,

  login: async (email, password) => {
    set({ loading: true, loginError: null });
    await new Promise(r => setTimeout(r, 1500));
    if (email === "miguel@mmstudio.com" && password === "123456") {
      set({ user: MOCK_USER, isAuthenticated: true, loading: false, loginError: null });
      if (get().rememberMe) {
        localStorage.setItem("mm_auth", JSON.stringify({ user: MOCK_USER }));
      }
      return true;
    }
    if (email && password.length >= 6) {
      set({ user: { ...MOCK_USER, email }, isAuthenticated: true, loading: false, loginError: null });
      if (get().rememberMe) {
        localStorage.setItem("mm_auth", JSON.stringify({ user: { ...MOCK_USER, email } }));
      }
      return true;
    }
    set({ loading: false, loginError: "Email ou senha invalidos" });
    return false;
  },

  loginSocial: async (provider) => {
    set({ loading: true, loginError: null });
    await new Promise(r => setTimeout(r, 1200));
    set({ user: { ...MOCK_USER, email: `miguel@${provider}.com` }, isAuthenticated: true, loading: false });
    return true;
  },

  logout: () => {
    localStorage.removeItem("mm_auth");
    set({ user: null, isAuthenticated: false, loginError: null });
  },

  restore: () => {
    try {
      const raw = localStorage.getItem("mm_auth");
      if (raw) {
        const { user } = JSON.parse(raw);
        if (user) set({ user, isAuthenticated: true });
      }
    } catch {}
  },

  setRememberMe: (v) => set({ rememberMe: v }),

  sendRecovery: async (email) => {
    set({ loading: true });
    await new Promise(r => setTimeout(r, 1500));
    set({ recoverySent: true, loading: false });
  },

  openRecovery: () => set({ recoveryOpen: true, recoverySent: false }),
  closeRecovery: () => set({ recoveryOpen: false, recoverySent: false, loading: false }),
}));

export default useAuthStore;
