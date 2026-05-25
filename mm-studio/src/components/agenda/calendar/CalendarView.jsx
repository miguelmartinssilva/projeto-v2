import { memo, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import useAgendaStore, { CATEGORIAS_EVENTO, RESPONSAVEIS } from "../../../store/agendaStore";
import { PriorityBadge, EventCategoryBadge } from "../ui/Badges";

const EVENT_RENDER = memo(function EventRender({ event }) {
  const ext = event.extendedProps;
  const catCfg = CATEGORIAS_EVENTO.find(c => c.key === ext.categoria) || CATEGORIAS_EVENTO[9];
  const resp = RESPONSAVEIS.find(r => r.id === ext.responsavel) || RESPONSAVEIS[0];

  return (
    <div className="flex items-center gap-1.5 px-1.5 py-0.5 w-full overflow-hidden cursor-pointer group/evt">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: catCfg.color }} />
      <span className="text-[10px] font-medium truncate text-white/90 group-hover/evt:text-white transition-colors">{event.title}</span>
      {ext.prioridade === "urgente" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />}
    </div>
  );
});

export default function CalendarView() {
  const { calView, setCalView, currentDate, setCurrentDate, getCalendarEvents, openDrawer, moveEvent, openEventDialog } = useAgendaStore();
  const calendarEvents = getCalendarEvents();

  const handleDateClick = useCallback((info) => {
    const start = info.dateStr + "T09:00";
    const end = info.dateStr + "T10:00";
    openEventDialog();
  }, [openEventDialog]);

  const handleEventClick = useCallback((info) => {
    const ext = info.event.extendedProps;
    openDrawer({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr,
      ...ext,
    });
  }, [openDrawer]);

  const handleEventDrop = useCallback((info) => {
    moveEvent(info.event.id, info.event.startStr, info.event.endStr);
  }, [moveEvent]);

  const handleEventResize = useCallback((info) => {
    moveEvent(info.event.id, info.event.startStr, info.event.endStr);
  }, [moveEvent]);

  const handleDatesSet = useCallback((info) => {
    setCalView(info.view.type);
    setCurrentDate(info.view.currentStart);
  }, [setCalView, setCurrentDate]);

  const renderEventContent = (eventInfo) => <EVENT_RENDER event={eventInfo.event} />;

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card overflow-hidden agenda-calendar">
      <style>{`
        .agenda-calendar .fc { --fc-border-color: #1f1f1f; --fc-today-bg-color: rgba(0,230,118,0.04); --fc-neutral-bg-color: transparent; --fc-page-bg-color: transparent; font-size: 12px; }
        .agenda-calendar .fc .fc-toolbar-title { font-size: 16px; font-weight: 700; color: #f5f5f5; font-family: 'Space Grotesk', sans-serif; }
        .agenda-calendar .fc .fc-button { background: transparent; border: 1px solid #1f1f1f; color: #a0a0a0; font-size: 11px; font-weight: 600; border-radius: 8px; padding: 4px 10px; transition: all 0.2s; }
        .agenda-calendar .fc .fc-button:hover { background: rgba(255,255,255,0.05); color: #f5f5f5; }
        .agenda-calendar .fc .fc-button-active { background: rgba(0,230,118,0.12) !important; border-color: rgba(0,230,118,0.3) !important; color: #00e676 !important; }
        .agenda-calendar .fc .fc-button:disabled { opacity: 0.3; }
        .agenda-calendar .fc th { color: #555; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; border-color: #1f1f1f; padding: 8px 0; }
        .agenda-calendar .fc td { border-color: #1a1a1a; }
        .agenda-calendar .fc .fc-daygrid-day { cursor: pointer; transition: background 0.15s; }
        .agenda-calendar .fc .fc-daygrid-day:hover { background: rgba(255,255,255,0.02); }
        .agenda-calendar .fc .fc-daygrid-day-number { color: #a0a0a0; font-size: 11px; font-weight: 500; padding: 6px 8px; }
        .agenda-calendar .fc .fc-day-today .fc-daygrid-day-number { color: #00e676; font-weight: 700; }
        .agenda-calendar .fc .fc-event { border: none !important; border-radius: 4px !important; padding: 0 !important; margin: 1px 2px !important; }
        .agenda-calendar .fc .fc-daygrid-event { background: rgba(255,255,255,0.05) !important; border-left: 2px solid; }
        .agenda-calendar .fc .fc-timegrid-event { border-radius: 6px !important; background: rgba(255,255,255,0.05) !important; border-left: 3px solid; }
        .agenda-calendar .fc .fc-list-event { background: transparent; border-radius: 8px; }
        .agenda-calendar .fc .fc-list-event:hover { background: rgba(255,255,255,0.03); }
        .agenda-calendar .fc .fc-list-day-text { color: #f5f5f5; font-weight: 700; }
        .agenda-calendar .fc .fc-list-event-title { color: #f5f5f5; }
        .agenda-calendar .fc .fc-list-event-time { color: #555; font-size: 10px; }
        .agenda-calendar .fc .fc-timegrid-slot { border-color: #1a1a1a; height: 40px; }
        .agenda-calendar .fc .fc-timegrid-slot-label { color: #555; font-size: 9px; }
        .agenda-calendar .fc .fc-scrollgrid { border-color: #1f1f1f; }
        .agenda-calendar .fc .fc-col-header { background: transparent; }
        .agenda-calendar .fc .fc-daygrid-day-frame { min-height: 80px; }
        .agenda-calendar .fc .fc-more-link { color: #00e676; font-size: 10px; font-weight: 600; }
      `}</style>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={calView}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        locale="pt-br"
        firstDay={0}
        events={calendarEvents}
        editable={true}
        droppable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={3}
        weekends={true}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        datesSet={handleDatesSet}
        height="auto"
        aspectRatio={1.5}
        buttonText={{ today: "Hoje", month: "Mes", week: "Semana", day: "Dia", list: "Lista" }}
        eventDidMount={(info) => {
          const ext = info.event.extendedProps;
          const catCfg = CATEGORIAS_EVENTO.find(c => c.key === ext.categoria) || CATEGORIAS_EVENTO[9];
          info.el.style.borderLeftColor = catCfg.color;
        }}
      />
    </div>
  );
}
