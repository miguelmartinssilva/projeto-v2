import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import useDashboardStore from "../../../store/dashboardStore";

export default function AgendaChart() {
  const { agendaHoje } = useDashboardStore();

  const data = [
    { tipo: "Reunioes", qtd: agendaHoje.filter(e => e.tipo === "reuniao").length || 1, cor: "#8b5cf6" },
    { tipo: "Entregas", qtd: agendaHoje.filter(e => e.tipo === "entrega").length || 2, cor: "#22c55e" },
    { tipo: "Follow-ups", qtd: agendaHoje.filter(e => e.tipo === "followup").length || 1, cor: "#f59e0b" },
    { tipo: "Internos", qtd: agendaHoje.filter(e => e.tipo === "interno").length || 1, cor: "#448aff" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="bg-bg-card rounded-2xl p-5 border border-border-card hover:border-border-light transition-all">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-text">Agenda Hoje</h3>
        <p className="text-xs text-text-muted mt-0.5">{agendaHoje.length} evento{agendaHoje.length !== 1 ? "s" : ""} programado{agendaHoje.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="space-y-3">
        {agendaHoje.map((ev, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <div className="w-10 h-10 rounded-lg bg-bg-elevated border border-border-card flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">{ev.hora?.slice(0, 2) || "--"}</span>
              <span className="text-[9px] text-text-muted">{ev.hora?.slice(3) || ""}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text truncate">{ev.titulo}</p>
              <p className="text-[10px] text-text-muted truncate">{ev.cliente || ev.tipo}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
