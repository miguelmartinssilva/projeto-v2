import { useMemo } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import useAnalyticsStore, { VENDEDORES, CATEGORIAS_METRICA } from "../../../store/analyticsStore";
import { CategoryBadge, StatusBadge, TrendBadge } from "../ui/Badges";
import EmptyState from "../ui/EmptyState";

const fmt = (v, cat) => {
  if (cat === "financeiro" || cat === "marketing") return `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;
  if (cat === "crm" || cat === "operacional") return String(v);
  return String(v);
};

export default function AnalyticsTable() {
  const { getFilteredRows } = useAnalyticsStore();
  const rows = getFilteredRows();

  const columns = useMemo(() => [
    { accessorKey: "metrica", header: "Metrica", size: 180, cell: ({ getValue }) => <span className="text-xs font-semibold text-text">{getValue()}</span> },
    { accessorKey: "categoria", header: "Categoria", size: 100, cell: ({ getValue }) => <CategoryBadge categoria={getValue()} /> },
    { accessorKey: "valorAtual", header: "Atual", size: 100, cell: ({ getValue, row }) => <span className="text-xs text-text font-medium">{fmt(getValue(), row.original.categoria)}</span> },
    { accessorKey: "valorAnterior", header: "Anterior", size: 100, cell: ({ getValue, row }) => <span className="text-xs text-text-muted">{fmt(getValue(), row.original.categoria)}</span> },
    { accessorKey: "crescimento", header: "Crescimento", size: 90,
      cell: ({ getValue }) => {
        const v = getValue();
        const pos = v >= 0;
        return <span className={`text-xs font-semibold ${pos ? "text-emerald-400" : "text-red-400"}`}>{pos ? "+" : ""}{v}%</span>;
      }
    },
    { accessorKey: "tendencia", header: "Tendencia", size: 80, cell: ({ getValue }) => <TrendBadge tendencia={getValue()} /> },
    { accessorKey: "status", header: "Status", size: 90, cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    { accessorKey: "responsavel", header: "Responsavel", size: 120,
      cell: ({ getValue }) => {
        const v = VENDEDORES.find(x => x.id === getValue());
        return v ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold" style={{ background: v.cor + "20", color: v.cor }}>{v.avatar}</div>
            <span className="text-[10px] text-text-muted">{v.nome.split(" ")[0]}</span>
          </div>
        ) : <span className="text-xs text-text-muted">-</span>;
      }
    },
  ], []);

  const table = useReactTable({
    data: rows, columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  if (rows.length === 0) return <EmptyState title="Sem metricas" description="Nenhum dado para os filtros aplicados" />;

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card overflow-hidden min-w-0">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-border-card">
                {hg.headers.map(h => (
                  <th key={h.id} onClick={h.column.getToggleSortingHandler()} className="px-4 py-3 text-left text-[10px] uppercase tracking-wider text-text-muted font-semibold cursor-pointer select-none hover:text-text transition-colors whitespace-nowrap">
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
              <tr key={row.id} className="border-b border-border-card/50 hover:bg-white/[0.02] transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-border-card">
        <span className="text-[10px] text-text-muted">{rows.length} metrica{rows.length !== 1 ? "s" : ""}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1 rounded hover:bg-white/5 disabled:opacity-30"><ChevronLeft size={14} className="text-text-muted" /></button>
          <span className="text-[10px] text-text-muted">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1 rounded hover:bg-white/5 disabled:opacity-30"><ChevronRight size={14} className="text-text-muted" /></button>
        </div>
      </div>
    </div>
  );
}
