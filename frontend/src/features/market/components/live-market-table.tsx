"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { TrendingUp, TrendingDown, Minus, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useMarketPrices } from "../queries/market.queries";
import { useMarketStore } from "@/store/market-store";
import { MarketTableSkeleton } from "./market-skeleton";
import { MarketError } from "./market-error";
import type { MarketPrice } from "../types/market.types";
import { cn } from "@/lib/utils/helpers";

const columnHelper = createColumnHelper<MarketPrice>();

export function LiveMarketTable() {
  const t = useTranslations("market.table");
  const { filters, setFilters, setSelectedCrop } = useMarketStore();
  const [sorting, setSorting] = useState<SortingState>([{ id: "dailyChangePercent", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data, isLoading, isError, refetch } = useMarketPrices(filters);

  const columns = useMemo(
    () => [
      columnHelper.accessor("crop", {
        header: t("crop"),
        cell: (info) => (
          <button
            className="flex items-center gap-2 text-left font-semibold text-gray-900 hover:text-green-600 dark:text-white dark:hover:text-green-400"
            onClick={() => setSelectedCrop(info.row.original.cropId, info.getValue())}
          >
            {info.getValue()}
          </button>
        ),
      }),
      columnHelper.accessor("currentPrice", {
        header: t("currentPrice"),
        cell: (info) => (
          <span className="font-mono font-semibold">₹{info.getValue().toFixed(2)}</span>
        ),
      }),
      columnHelper.accessor("previousPrice", {
        header: t("prevPrice"),
        cell: (info) => (
          <span className="font-mono text-gray-500 dark:text-gray-400">
            ₹{info.getValue().toFixed(2)}
          </span>
        ),
      }),
      columnHelper.accessor("dailyChangePercent", {
        header: t("change"),
        cell: (info) => {
          const v = info.getValue();
          const isUp = v > 0;
          const isDown = v < 0;
          return (
            <span
              className={cn(
                "flex items-center gap-1 font-semibold",
                isUp && "text-emerald-600 dark:text-emerald-400",
                isDown && "text-red-600 dark:text-red-400",
                !isUp && !isDown && "text-gray-500"
              )}
            >
              {isUp ? <TrendingUp className="h-3 w-3" /> : isDown ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {isUp ? "+" : ""}
              {v.toFixed(2)}%
            </span>
          );
        },
      }),
      columnHelper.accessor("market", {
        header: t("market"),
        cell: (info) => <span className="text-sm text-gray-600 dark:text-gray-300">{info.getValue()}</span>,
      }),
      columnHelper.accessor("volume", {
        header: t("volume"),
        cell: (info) => (
          <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
            {info.getValue().toLocaleString("en-IN")} MT
          </span>
        ),
      }),
    ],
    [t, setSelectedCrop]
  );

  const tableData = useMemo(() => data?.data ?? [], [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (isLoading) return <MarketTableSkeleton />;
  if (isError) return <MarketError onRetry={refetch} />;

  return (
    <section aria-label={t("title")} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("title")}</h2>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
            <input
              type="search"
              placeholder={t("searchPlaceholder")}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-48 rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              aria-label={t("searchPlaceholder")}
            />
          </div>
          {/* State Filter */}
          <select
            value={filters.state}
            onChange={(e) => setFilters({ state: e.target.value })}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            aria-label={t("filterByState")}
          >
            <option value="">{t("allStates")}</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="gujarat">Gujarat</option>
            <option value="punjab">Punjab</option>
            <option value="karnataka">Karnataka</option>
            <option value="tamil_nadu">Tamil Nadu</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label={t("title")}>
            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className={cn(
                            "flex items-center gap-1",
                            header.column.getCanSort() && "cursor-pointer hover:text-gray-900 dark:hover:text-white"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          aria-sort={
                            header.column.getIsSorted() === "asc"
                              ? "ascending"
                              : header.column.getIsSorted() === "desc"
                              ? "descending"
                              : "none"
                          }
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === "asc" && " ↑"}
                          {header.column.getIsSorted() === "desc" && " ↓"}
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="py-8 text-center text-gray-500">
                    {t("noResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {t("showing", {
              from: table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1,
              to: Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              ),
              total: table.getFilteredRowModel().rows.length,
            })}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label={t("prevPage")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs text-gray-600 dark:text-gray-300">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label={t("nextPage")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
