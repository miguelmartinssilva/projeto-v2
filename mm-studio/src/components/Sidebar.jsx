import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, Users, DollarSign, History, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Orcamento", icon: FileText, path: "/orcamento" },
  { label: "Clientes", icon: Users, path: "/clientes" },
  { label: "Financeiro", icon: DollarSign, path: "/financeiro" },
  { label: "Historico", icon: History, path: "/historico" },
];

const bottomItems = [
  { label: "Configuracoes", icon: Settings, path: "/configuracoes" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  const linkClick = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-bg-card border border-border-card rounded-lg p-2.5 text-text-secondary hover:text-text transition-colors"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-56 bg-bg-sidebar border-r border-border-card flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-5 pb-4 border-b border-border-card">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center font-display font-bold text-sm text-black">MM</div>
            <div>
              <h1 className="font-display font-bold text-sm text-primary tracking-[0.15em] uppercase">MM Studio</h1>
              <p className="text-[10px] text-text-muted uppercase tracking-[0.2em]">Design & Video</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => linkClick(item.path)}
              className={`sidebar-item w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${isActive(item.path) ? "sidebar-item-active" : ""}`}
            >
              <item.icon size={17} />
              <span className="uppercase tracking-[0.08em] text-xs font-medium">{item.label}</span>
            </button>
          ))}
          <div className="my-2 mx-4 h-px bg-border-card/50" />
          {bottomItems.map((item) => (
            <button
              key={item.label}
              onClick={() => linkClick(item.path)}
              className={`sidebar-item w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${isActive(item.path) ? "sidebar-item-active" : ""}`}
            >
              <item.icon size={17} />
              <span className="uppercase tracking-[0.08em] text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border-card">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-xs font-bold text-primary">MM</div>
              <div className="pulse-dot absolute -bottom-0.5 -right-0.5 ring-2 ring-bg-sidebar" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">Miguel Martins</p>
              <p className="text-[10px] text-text-muted truncate tracking-wide">Online</p>
            </div>
            <button className="text-text-muted hover:text-danger transition-colors p-1 rounded hover:bg-white/5">
              <LogOut size={15} />
            </button>
          </div>
          <p className="text-[9px] text-text-muted text-center mt-3 tracking-[0.15em]">v2.0.0</p>
        </div>
      </aside>
    </>
  );
}
