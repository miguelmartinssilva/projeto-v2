import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Zap, Filter, Play } from "lucide-react";

function BaseNode({ data, type, icon: Icon, color }) {
  return (
    <div className="px-4 py-3 rounded-xl border shadow-xl min-w-[200px] backdrop-blur-sm"
      style={{ background: "#1a1a1aee", borderColor: color + "40" }}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: color + "20" }}>
          <Icon size={12} style={{ color }} />
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color }}>{type}</span>
      </div>
      <p className="text-xs font-semibold text-text">{data.label}</p>
      {type === "TRIGGER" && <Handle type="source" position={Position.Bottom} style={{ background: color, width: 8, height: 8, border: "none" }} />}
      {type === "ACAO" && <Handle type="target" position={Position.Top} style={{ background: color, width: 8, height: 8, border: "none" }} />}
      {type === "CONDICAO" && (
        <>
          <Handle type="target" position={Position.Top} style={{ background: color, width: 8, height: 8, border: "none" }} />
          <Handle type="source" position={Position.Bottom} id="yes" style={{ background: "#22c55e", width: 8, height: 8, border: "none", left: "30%" }} />
          <Handle type="source" position={Position.Bottom} id="no" style={{ background: "#ef4444", width: 8, height: 8, border: "none", left: "70%" }} />
        </>
      )}
      {type !== "CONDICAO" && type !== "TRIGGER" && <Handle type="source" position={Position.Bottom} style={{ background: color, width: 8, height: 8, border: "none" }} />}
    </div>
  );
}

export const TriggerNode = memo(({ data }) => <BaseNode data={data} type="TRIGGER" icon={Zap} color={data.config?.color || "#3b82f6"} />);
export const CondicaoNode = memo(({ data }) => <BaseNode data={data} type="CONDICAO" icon={Filter} color={data.config?.color || "#f59e0b"} />);
export const AcaoNode = memo(({ data }) => <BaseNode data={data} type="ACAO" icon={Play} color={data.config?.color || "#22c55e"} />);
