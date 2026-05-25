import { motion } from "framer-motion";
import { format } from "date-fns";
import { Clock, MapPin, Video, Phone as PhoneIcon, Users } from "lucide-react";
import useAgendaStore, { CATEGORIAS_EVENTO, RESPONSAVEIS } from "../../../store/agendaStore";
import { PriorityBadge, EventCategoryBadge, EventStatusBadge } from "../ui/Badges";

export default function MeetingCards() {
  const { getTodayMeetings, openDrawer } = useAgendaStore();
  const meetings = getTodayMeetings();

  const typeIcon = { reuniao: Users, onboarding: Users, demo: Video, followup: PhoneIcon };

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-text">Reunioes de Hoje</h3>
        <span className="text-[10px] text-text-muted bg-white/5 px-1.5 py-0.5 rounded">{meetings.length}</span>
      </div>
      {meetings.length === 0 ? (
        <div className="text-center py-8">
          <Users size={24} className="text-text-muted opacity-30 mx-auto mb-2" />
          <p className="text-xs text-text-muted">Nenhuma reuniao hoje</p>
        </div>
      ) : (
        <div className="space-y-2">
          {meetings.map((m, i) => {
            const catCfg = CATEGORIAS_EVENTO.find(c => c.key === m.categoria) || CATEGORIAS_EVENTO[9];
            const resp = RESPONSAVEIS.find(r => r.id === m.responsavel) || RESPONSAVEIS[0];
            const Icon = typeIcon[m.categoria] || Users;
            const start = m.start ? new Date(m.start) : null;
            const end = m.end ? new Date(m.end) : null;

            return (
              <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => openDrawer(m)} className="p-3 rounded-xl bg-bg-elevated/50 border border-border-card/50 hover:border-border-light cursor-pointer transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center flex-shrink-0" style={{ background: catCfg.bg }}>
                    <Icon size={14} style={{ color: catCfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text truncate group-hover:text-primary transition-colors">{m.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {start && <span className="text-[10px] text-text-muted flex items-center gap-1"><Clock size={9} />{format(start, "HH:mm")}{end ? `-${format(end, "HH:mm")}` : ""}</span>}
                      {m.local && <span className="text-[10px] text-text-muted flex items-center gap-1"><MapPin size={9} />{m.local}</span>}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <PriorityBadge prioridade={m.prioridade} />
                      <EventStatusBadge status={m.status} />
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0" style={{ background: resp.cor + "20", color: resp.cor }}>
                    {resp.avatar}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
