import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X } from "lucide-react";
import { format } from "date-fns";
import useDashboardStore from "../../../store/dashboardStore";
import { NotifTipoBadge } from "../ui/Badges";

export default function NotificationsDropdown() {
  const { notificacoes, notifOpen, toggleNotif, closeNotif, markAllRead } = useDashboardStore();
  const unread = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="relative">
      <button onClick={toggleNotif} className="relative p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors">
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-danger text-white text-[8px] font-bold flex items-center justify-center">{unread}</span>
        )}
      </button>
      <AnimatePresence>
        {notifOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={closeNotif} />
            <motion.div initial={{ opacity: 0, y: -4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-bg-card rounded-xl border border-border-card shadow-2xl z-40 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-card">
                <span className="text-xs font-semibold text-text">Notificacoes</span>
                {unread > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-[10px] text-primary hover:underline">
                    <Check size={10} /> Marcar tudo lido
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border-card/50">
                {notificacoes.map(n => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors ${!n.lida ? "bg-primary/[0.02]" : ""}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.lida ? "bg-primary" : "bg-transparent"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-semibold text-text">{n.titulo}</span>
                        <NotifTipoBadge tipo={n.tipo} />
                      </div>
                      <p className="text-[10px] text-text-muted">{n.descricao}</p>
                      <p className="text-[9px] text-text-muted/60 mt-0.5">{format(n.timestamp, "dd/MM HH:mm")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
