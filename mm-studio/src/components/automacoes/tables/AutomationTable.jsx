import { useMemo } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, Copy, Trash2, Eye } from "lucide-react";
import useAutomacoesStore, { RESPONSAVEIS } from "../../../store/automacoesStore";
import { StatusBadge, IntegracaoBadge } from "../ui/Badges";
import { format } from "date-fns";

export default function AutomationTable() {
  const { getFilteredAutomacoes, toggleAutomacao, duplicateAutomacao, openDrawer, showConfirm, deleteAutomacao } = useAutomacoesStore();
  const rows = getFilteredAutomacoes();

  const columns = useMemo(() => [
    { accessorKey: "nome", header: "Nome", size: 200,
      cell: ({ getValue, row }) => (
        <div className="min-w-0">
          <p className="text-xs font-semibold text-text truncate">{getValue()}</p>
          <p className="text-[10px] text-text-muted truncate max-w-[180px]">{row.original.descricao}</p>
        </div>
      )
    },
    { accessorKey: "status", header: "Status", size: 80, cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    { accessorKey: "integracao", header: "Integracao", size: 100, cell: ({ getValue }) => <IntegracaoBadge integracao={getValue()} /> },
    { accessorKey: "execucoes", header: "Exec.", size: 70, cell: ({ getValue }) => <span className="text-xs text-text font-medium">{getValue()}</span> },
    { accessorKey: "taxaSucesso", header: "Sucesso", size: 80,
      cell: ({ getValue }) => {
        const v = getValue();
        const c = v >= 95 ? "#22c55e" : v >= 80 ? "#f59e0b" : "#ef4444";
        return <span className="text-xs font-semibold" style={{ color: c }}>{v}%</span>;
      }
    },
    { accessorKey: "ultimaExecucao", header: "Ultima", size: 100,
      cell: ({ getValue }) => <span className="text-[10px] text-text-muted">{getValue() ? format(new Date(getValue()), "dd/MM HH:mm") : "-"}</span>
    },
    { accessorKey: "responsavel", header: "Resp.", size: 80,
      cell: ({ getValue }) => {
        const v = RESPONSAVEIS.find(r => r.id === getValue());
        return v ? <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: v.cor + "20", color: v.cor }}>{v.avatar}</div> : null;
      }
    },
    {
      id: "acoes", header: "", size: 120,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openDrawer(row.original)} className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-text"><Eye size={12} /></button>
          <button onClick={() => toggleAutomacao(row.original.id)} className="p-1 rounded hover:bg-white/5 text-text-muted">
            {row.original.status === "ativa" ? <ToggleRight size={14} className="text-primary" /> : <ToggleLeft size={14} className="text-text-muted" />}
          </button>
          <button onClick={() => duplicateAutomacao(row.original.id)} className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-text"><Copy size={12} /></button>
          <button onClick={() => showConfirm({ title: "Excluir automacao?", description: row.original.nome, onConfirm: () => deleteAutomacao(row.original.id) })}
            className="p-1 rounded hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={12} /></button>
        </div>
      )
    },
  ], [toggleAutomacao, duplicateAutomacao, openDrawer, showConfirm, deleteAutomacao]);

  const table = useReactTable({
    data: rows, columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-border-card">
                {hg.headers.map(h => (
                  <th key={h.id} onClick={h.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-text-muted font-semibold cursor-pointer select-none hover:text-text transition-colors whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {{ asc: <ChevronUp size={10} />, desc: <ChevronDown size={10} /> }[h.column.getIsSorted()] || null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-border-card/50 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => openDrawer(row.original)}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap" onClick={e => cell.column.id === "acoes" && e.stopPropagation()}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-border-card">
        <span className="text-[10px] text-text-muted">{rows.length} automacao{rows.length !== 1 ? "es" : ""}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1 rounded hover:bg-white/5 disabled:opacity-30"><ChevronLeft size={14} className="text-text-muted" /></button>
          <span className="text-[10px] text-text-muted">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1 rounded hover:bg-white/5 disabled:opacity-30"><ChevronRight size={14} className="text-text-muted" /></button>
        </div>
      </div>
    </div>
  );
}
