import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, Users, Edit3, Trash2 } from "lucide-react";
import { getAgenda, saveAgenda } from "../utils/storage";

const MESES = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const TIPOS = ["Reuniao", "Onboarding", "Entrega", "Revisao", "Demo", "Outro"];

function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function emptyForm() { return { titulo: "", data: hojeISO(), hora: "09:00", tipo: "Reuniao", cliente: "", descricao: "" }; }

export default function Agenda() {
  const [events, setEvents] = useState(() => getAgenda());
  const [mes, setMes] = useState(new Date().getMonth());
  const [ano, setAno] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const refresh = () => setEvents(getAgenda());

  const daysInMonth = new Date(ano, mes + 1, 0).getDate();
  const firstDay = new Date(ano, mes, 1).getDay();

  const monthEvents = useMemo(() => {
    const map = {};
    events.forEach(e => {
      if (!map[e.data]) map[e.data] = [];
      map[e.data].push(e);
    });
    return map;
  }, [events]);

  const selectedDay = useMemo(() => {
    const today = hojeISO();
    return events.filter(e => e.data === today).sort((a, b) => a.hora?.localeCompare(b.hora || ""));
  }, [events]);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const save = () => {
    if (!form.titulo.trim()) return;
    const lista = getAgenda();
    if (editingId) {
      const idx = lista.findIndex(e => e.id === editingId);
      if (idx >= 0) lista[idx] = { ...form, id: editingId };
    } else {
      lista.push({ ...form, id: Date.now() });
    }
    saveAgenda(lista);
    refresh();
    setShowModal(false);
    setForm(emptyForm());
    setEditingId(null);
  };

  const openEdit = (e) => {
    setForm({ titulo: e.titulo, data: e.data, hora: e.hora, tipo: e.tipo, cliente: e.cliente, descricao: e.descricao });
    setEditingId(e.id);
    setShowModal(true);
  };

  const deleteEvt = (id) => {
    saveAgenda(getAgenda().filter(e => e.id !== id));
    refresh();
  };

  return (
    <div className="flex-1 min-h-screen page-enter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-text-muted mb-1 tracking-wide">
              MM Studio <span className="mx-1.5 text-border-light">/</span>
              <span className="text-text-secondary font-medium">Agenda</span>
            </p>
            <h1 className="text-2xl font-display font-bold text-text leading-tight">Agenda</h1>
            <p className="text-xs text-text-muted mt-1">Gerencie seus compromissos e eventos</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setForm(emptyForm()); setEditingId(null); setShowModal(true); }}
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg"
          >
            <Plus size={16} /> Novo Evento
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-bg-card rounded-2xl p-6 border border-border-card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button onClick={() => { if (mes === 0) { setMes(11); setAno(a => a - 1); } else setMes(m => m - 1); }} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <h2 className="text-base font-bold text-text tracking-tight">{MESES[mes]} {ano}</h2>
                <button onClick={() => { if (mes === 11) { setMes(0); setAno(a => a + 1); } else setMes(m => m + 1); }} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
              <button onClick={() => { setMes(new Date().getMonth()); setAno(new Date().getFullYear()); }} className="text-xs text-primary hover:underline font-semibold">Hoje</button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {DIAS_SEMANA.map(d => (
                <div key={d} className="text-center text-[10px] uppercase tracking-[0.12em] text-text-muted font-semibold py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, i) => {
                const dateStr = day ? `${ano}-${String(mes + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
                const dayEvents = dateStr ? (monthEvents[dateStr] || []) : [];
                const isToday = dateStr === hojeISO();
                return (
                  <div key={i} className={`min-h-[72px] rounded-xl p-1.5 transition-colors ${day ? "bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer" : ""} ${isToday ? "ring-1 ring-primary" : ""}`}>
                    {day && (
                      <>
                        <p className={`text-xs font-semibold mb-0.5 ${isToday ? "text-primary" : "text-text-muted"}`}>{day}</p>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map(e => (
                            <div key={e.id} onClick={() => openEdit(e)} className="text-[9px] bg-primary/10 text-primary rounded px-1 py-0.5 truncate leading-tight">{e.titulo}</div>
                          ))}
                          {dayEvents.length > 2 && <p className="text-[9px] text-text-muted">+{dayEvents.length - 2} mais</p>}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-bg-card rounded-2xl p-6 border border-border-card">
              <h3 className="text-sm font-bold text-text tracking-tight mb-4">Eventos de Hoje</h3>
              {selectedDay.length > 0 ? selectedDay.map(e => (
                <div key={e.id} className="flex items-start gap-3 px-3 py-3 rounded-xl bg-white/[0.02] mb-2 last:mb-0">
                  <div className="w-12 h-12 rounded-lg bg-bg-elevated border border-border-card flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{e.hora?.slice(0, 2) || "--"}</span>
                    <span className="text-[9px] text-text-muted">{e.hora?.slice(3) || ""}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{e.titulo}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] bg-white/[0.04] text-text-muted px-1.5 py-0.5 rounded">{e.tipo}</span>
                      {e.cliente && <span className="text-[10px] text-text-muted">{e.cliente}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><Edit3 size={12} /></button>
                    <button onClick={() => deleteEvt(e.id)} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={12} /></button>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <CalendarIcon size={24} className="text-text-muted opacity-30" />
                  <p className="text-sm text-text-muted">Nenhum evento hoje</p>
                </div>
              )}
            </div>

            <div className="bg-bg-card rounded-2xl p-6 border border-border-card">
              <h3 className="text-sm font-bold text-text tracking-tight mb-3">Proximos Eventos</h3>
              {events.filter(e => e.data >= hojeISO()).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 3).map(e => (
                <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] mb-2 last:mb-0 cursor-pointer hover:bg-white/[0.04]" onClick={() => openEdit(e)}>
                  <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-border-card flex items-center justify-center flex-shrink-0">
                    <CalendarIcon size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{e.titulo}</p>
                    <p className="text-[10px] text-text-muted">{e.data} as {e.hora}</p>
                  </div>
                </div>
              ))}
              {events.filter(e => e.data >= hojeISO()).length === 0 && <p className="text-xs text-text-muted text-center py-4">Nenhum evento futuro</p>}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-bg-card rounded-2xl p-6 border border-border-card w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-text">{editingId ? "Editar Evento" : "Novo Evento"}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><X size={16} /></button>
              </div>
              <div className="space-y-4">
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} className="has-icon" />
                  <CalendarIcon size={14} className="input-icon" />
                  <label>Titulo</label>
                </div>
          <div className="grid grid-cols-2 gap-3">
            <div><span className="field-label">Data</span><input type="date" value={form.data} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary" /></div>
            <div><span className="field-label">Hora</span><input type="time" value={form.hora} onChange={e => setForm(f => ({ ...f, hora: e.target.value }))} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary" /></div>
          </div>
          <div><span className="field-label">Tipo</span><select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))} className="w-full bg-bg-input border border-border-card rounded-lg px-3 py-2.5 text-sm text-text outline-none focus:border-primary">
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select></div>
                <div className="floating-label">
                  <input type="text" placeholder=" " value={form.cliente} onChange={e => setForm(f => ({ ...f, cliente: e.target.value }))} className="has-icon" />
                  <Users size={14} className="input-icon" />
                  <label>Cliente (opcional)</label>
                </div>
                <div className="floating-label">
                  <textarea rows={3} placeholder=" " value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} />
                  <label>Descricao (opcional)</label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-text-muted hover:text-text hover:bg-white/10 transition-colors">Cancelar</button>
                <button onClick={save} className="flex-1 py-2.5 rounded-xl text-sm font-semibold btn-primary">Salvar</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}