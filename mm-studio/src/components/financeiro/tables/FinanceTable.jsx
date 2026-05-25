import { useMemo } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown, Trash2, Eye, CheckCircle } from "lucide-react";
import { TipoBadge, StatusBadge, CategoryBadge } from "../ui/Badges";
import EmptyState from "../ui/EmptyState";
import useFinanceiroStore, { CATEGORIAS, CONTAS } from "../../../store/financeiroStore";

const fmt = (v) => `R$ ${(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`;

export default function FinanceTable() {
  const { getFilteredMovimentacoes, openDrawer, deleteMovimentacao, showConfirm, markAsPaid } = useFinanceiroStore();
  const movs = getFilteredMovimentacoes();

  const columns = useMemo(() => [
    {
      accessorKey: "descricao", header: "Descricao",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => openDrawer(row.original)}>
          <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-[10px] font-bold flex-shrink-0"
            style={{ color: row.original.tipo === "entrada" ? "#22c55e" : "#ff4d6d" }}>
            {row.original.tipo === "entrada" ? "↑" : "↓"}
          </div>
          <div>
            <p className="text-sm font-medium text-text">{row.original.descricao}</p>
            <p className="text-[10px] text-text-muted">{row.original.responsavel}</p>
          </div>
        </div>
      ), size: 220,
    },
    { accessorKey: "tipo", header: "Tipo", cell: ({ getValue }) => <TipoBadge tipo={getValue()} />, size: 100 },
    { accessorKey: "categoria", header: "Categoria", cell: ({ getValue, row }) => <CategoryBadge categoria={getValue()} tipo={row.original.tipo} />, size: 120 },
    {
      accessorKey: "valor", header: "Valor",
      cell: ({ getValue, row }) => (
        <span className="text-sm font-semibold" style={{ color: row.original.tipo === "entrada" ? "#22c55e" : "#ff4d6d" }}>
          {row.original.tipo === "entrada" ? "+" : "-"}{fmt(getValue())}
        </span>
      ), size: 120,
    },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} />, size: 110 },
    {
      accessorKey: "dataVencimento", header: "Vencimento",
      cell: ({ getValue }) => <span className="text-xs text-text-muted">{getValue() ? new Date(getValue() + "T12:00:00").toLocaleDateString("pt-BR") : "—"}</span>, size: 110,
    },
    {
      accessorKey: "conta", header: "Conta",
      cell: ({ getValue }) => {
        const c = CONTAS.find(ct => ct.key === getValue());
        return <span className="text-xs text-text-secondary">{c?.label || getValue()}</span>;
      }, size: 100,
    },
    {
      accessorKey: "metodoPagamento", header: "Metodo",
      cell: ({ getValue }) => <span className="text-xs text-text-muted">{getValue() || "—"}</span>, size: 100,
    },
    {
      id: "actions", header: "", size: 100,
      cell: ({ row }) => (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => openDrawer(row.original)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><Eye size={12} /></button>
          {row.original.status !== "pago" && (
            <button onClick={() => markAsPaid(row.original.id)} className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-text-muted hover:text-emerald-400"><CheckCircle size={12} /></button>
          )}
          <button onClick={() => showConfirm({ title: "Excluir movimentacao", description: `Remover "${row.original.descricao}"?`, onConfirm: () => deleteMovimentacao(row.original.id) })}
            className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={12} /></button>
        </div>
      ),
    },
  ], [openDrawer, deleteMovimentacao, showConfirm, markAsPaid]);

  const table = useReactTable({
    data: movs, columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-border-card">
                {hg.headers.map(header => (
                  <th key={header.id} className="text-left px-4 py-3 text-[10px] text-text-muted font-semibold uppercase tracking-widest cursor-pointer select-none hover:text-text-secondary transition-colors"
                    onClick={header.column.getToggleSortingHandler()} style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}>
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: <ChevronUp size={10} />, desc: <ChevronDown size={10} /> }[header.column.getIsSorted()] || (header.column.getCanSort() && <ChevronsUpDown size={10} className="opacity-30" />)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={columns.length}><EmptyState /></td></tr>
            ) : table.getRowModel().rows.map(row => (
              <tr key={row.id} className="group border-b border-border-card/40 hover:bg-white/[0.02] transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-border-card">
        <span className="text-[10px] text-text-muted">{table.getFilteredRowModel().rows.length} resultado{table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-white/5 text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Anterior</button>
          <span className="text-[10px] text-text-muted">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-white/5 text-text-muted hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Proximo</button>
        </div>
      </div>
    </div>
  );
}
