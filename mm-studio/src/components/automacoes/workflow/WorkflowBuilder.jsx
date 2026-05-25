import { useMemo } from "react";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import useAutomacoesStore from "../../../store/automacoesStore";
import { TriggerNode, CondicaoNode, AcaoNode } from "./WorkflowNodes";

const nodeTypes = { trigger: TriggerNode, condicao: CondicaoNode, acao: AcaoNode };

const defaultEdgeOptions = { animated: true, style: { stroke: "#00e67660", strokeWidth: 2 } };

export default function WorkflowBuilder({ autoId }) {
  const { getWorkflowNodes } = useAutomacoesStore();
  const { nodes, edges } = useMemo(() => getWorkflowNodes(autoId), [autoId, getWorkflowNodes]);

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border-card">
        <h3 className="text-sm font-bold text-text">Workflow</h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted bg-white/5 px-2 py-0.5 rounded">{nodes.length} nos</span>
          <span className="text-[10px] text-text-muted bg-white/5 px-2 py-0.5 rounded">{edges.length} conexoes</span>
        </div>
      </div>
      <div className="h-72" style={{ background: "#0d0d0d" }}>
        <ReactFlow
          nodes={nodes} edges={edges} nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView proOptions={{ hideAttribution: true }}
          nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
          minZoom={0.3} maxZoom={1.5}
        >
          <Background color="#1f1f1f" gap={20} size={1} />
          <Controls showInteractive={false} className="!bg-bg-card !border-border-card !rounded-lg [&>button]:!bg-bg-card [&>button]:!border-border-card [&>button]:!text-text-muted [&>button:hover]:!bg-white/5" />
          <MiniMap nodeColor={(n) => n.data?.config?.color || "#3b82f6"} maskColor="#0d0d0d90" className="!bg-bg-card !border-border-card !rounded-lg" />
        </ReactFlow>
      </div>
    </div>
  );
}
