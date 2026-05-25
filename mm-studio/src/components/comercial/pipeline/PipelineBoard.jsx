import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import useComercialStore, { PIPELINE_STAGES } from "../../../store/comercialStore";
import DealCard from "./DealCard";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

function PipelineColumn({ stage, deals, onCardClick }) {
  const total = deals.reduce((s, d) => s + (d.valor || 0), 0);
  return (
    <div className="flex-shrink-0 w-[270px] flex flex-col rounded-xl bg-bg-card/40 border border-border-card/50 min-h-[500px]">
      <div className="px-3 py-3 border-b border-border-card/40 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
            <span className="text-xs font-semibold text-text">{stage.label}</span>
            <span className="text-[10px] text-text-muted bg-bg-elevated px-1.5 py-0.5 rounded-md font-semibold">{deals.length}</span>
          </div>
        </div>
        <p className="text-[10px] text-text-muted font-medium">{fmt(total)}</p>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto" data-stage={stage.key}>
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {deals.map(deal => (
              <DealCard key={deal.id} deal={deal} onClick={() => onCardClick(deal)} isDragging={false} />
            ))}
          </AnimatePresence>
        </SortableContext>
        {deals.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-[10px] text-text-muted opacity-50">Arraste deals aqui</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PipelineBoard() {
  const { getPipelineColumns, moveDealStage, openDrawer } = useComercialStore();
  const columns = getPipelineColumns();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findDealStage = (id) => {
    const deal = useComercialStore.getState().deals.find(d => d.id === id);
    return deal?.stage;
  };

  const handleDragStart = (e) => setActiveId(e.active.id);

  const handleDragOver = (e) => {
    const { active, over } = e;
    if (!over) return;
    const activeStage = findDealStage(active.id);
    let overStage;
    if (over.data?.current?.stage) {
      overStage = over.data.current.stage;
    } else {
      const overDeal = useComercialStore.getState().deals.find(d => d.id === over.id);
      overStage = overDeal?.stage;
    }
    if (!overStage) {
      const overContainer = document.querySelector(`[data-stage]`);
      const allContainers = document.querySelectorAll(`[data-stage]`);
      for (const c of allContainers) {
        const rect = c.getBoundingClientRect();
        if (e.activatorEvent?.clientX >= rect.left && e.activatorEvent?.clientX <= rect.right) {
          overStage = c.dataset.stage;
          break;
        }
      }
    }
    if (activeStage && overStage && activeStage !== overStage) {
      moveDealStage(active.id, overStage);
    }
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over) { setActiveId(null); return; }
    const activeStage = findDealStage(active.id);
    let overStage;
    if (over.data?.current?.stage) {
      overStage = over.data.current.stage;
    } else {
      const overDeal = useComercialStore.getState().deals.find(d => d.id === over.id);
      overStage = overDeal?.stage;
    }
    if (!overStage) {
      const allContainers = document.querySelectorAll(`[data-stage]`);
      for (const c of allContainers) {
        const rect = c.getBoundingClientRect();
        const clientX = e.activatorEvent?.clientX || 0;
        if (clientX >= rect.left && clientX <= rect.right) {
          overStage = c.dataset.stage;
          break;
        }
      }
    }
    if (activeStage && overStage && activeStage !== overStage) {
      moveDealStage(active.id, overStage);
    }
    setActiveId(null);
  };

  const activeDeal = activeId ? useComercialStore.getState().deals.find(d => d.id === activeId) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
      <div className="flex gap-3 overflow-x-auto pb-4 min-h-[540px]">
        {PIPELINE_STAGES.map(stage => (
          <PipelineColumn key={stage.key} stage={stage} deals={columns[stage.key] || []} onCardClick={openDrawer} />
        ))}
      </div>
      <DragOverlay>
        {activeDeal && <DealCard deal={activeDeal} onClick={() => {}} isDragging={true} />}
      </DragOverlay>
    </DndContext>
  );
}
