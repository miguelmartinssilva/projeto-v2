import { useMemo } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown, Edit3, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StatusBadge, { statusConfig } from "../ui/StatusBadge";
import EmptyState from "../ui/EmptyState";
import useCrmStore from "../../../store/crmStore";

const tipoLabels = { avulso: "Avulso", mensal: "Mensal", pacote: "Pacote", projeto: "Projeto", retainer: "Retainer" };

export default function CRMTable() {
  const { getFilteredClients, openDrawer, deleteClient, showConfirm } = useCrmStore();
  const clients = getFilteredClients();

  const columns = useMemo(() => [
    { accessorKey: "nome", header: "Cliente", cell: ({ row }) => (
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => openDrawer(row.original)}>
        <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border-card flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
          {row.original.nome?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-text">{row.original.nome}</p>
          {row.original.empresa && <p className="text-[10px] text-text-muted">{row.original.empresa}</p>}
        </div>
      </div>
    ), size: 200 },
    { accessorKey: "email", header: "Email", cell: ({ getValue }) => <span className="text-xs text-text-secondary truncate block max-w-[160px]">{getValue() || "—"}</span>, size: 160 },
    { accessorKey: "telefone", header: "Telefone", cell: ({ getValue }) => <span className="text-xs text-text-secondary">{getValue() || "—"}</span>, size: 130 },
    { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} />, size: 120, filterFn: (row, id, value) => value.includes(row.getValue(id)) },
    { accessorKey: "tipo", header: "Tipo", cell: ({ getValue }) => <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">{tipoLabels[getValue()] || getValue()}</span>, size: 90 },
    { accessorKey: "receita", header: "Receita", cell: ({ getValue }) => <span className="text-sm font-semibold text-primary">R$ {(getValue() || 0).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}</span>, size: 110 },
    { accessorKey: "ultimoContato", header: "Ultimo contato", cell: ({ getValue }) => <span className="text-xs text-text-muted">{getValue() ? new Date(getValue()).toLocaleDateString("pt-BR") : "—"}</span>, size: 110 },
    { id: "actions", header: "", cell: ({ row }) => (
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => openDrawer(row.original)} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text"><Eye size={12} /></button>
        <button onClick={() => showConfirm({ title: "Excluir cliente", description: `Remover ${row.original.nome}?`, onConfirm: () => deleteClient(row.original.id) })} className="p-1.5 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"><Trash2 size={12} /></button>
      </div>
    ), size: 80 },
  ], [openDrawer, deleteClient, showConfirm]);

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="bg-bg-card rounded-2xl border border-border-card overflow-hidden min-w-0">
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
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
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
