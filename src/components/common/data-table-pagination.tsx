"use client";

import { Table } from "@tanstack/react-table";
import CustomPagination from "./custom-pagination";

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type FilterValue = string | number | null | undefined;

type StateFilterController<T extends string> = {
  updateFilter: (
    key: T,
    value: FilterValue,
    options?:
      | {
          debounce?: number;
          resetPage?: boolean;
        }
      | number,
  ) => void;
};

interface DataTablePaginationProps<
  TData,
  TFilterKey extends string = string,
> {
  table: Table<TData>;
  meta?: PaginationMeta;

  /**
   * Required when pagination is server-side.
   */
  filter?: StateFilterController<TFilterKey>;

  paginationKey?: TFilterKey;
}

export function DataTablePagination<
  TData,
  TFilterKey extends string = string,
>({
  table,
  meta,
  filter,
  paginationKey = "page" as TFilterKey,
}: DataTablePaginationProps<TData, TFilterKey>) {
  const localPagination = table.getState().pagination;
  const localTotal = table.getFilteredRowModel().rows.length;
  const localFrom =
    localTotal === 0
      ? 0
      : localPagination.pageIndex * localPagination.pageSize + 1;
  const localTo = Math.min(
    (localPagination.pageIndex + 1) * localPagination.pageSize,
    localTotal,
  );

  const serverFrom =
    meta && meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const serverTo = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  const currentPage = meta ? meta.page : localPagination.pageIndex + 1;
  const totalPages = meta
    ? (meta.totalPages ?? Math.ceil(meta.total / meta.limit))
    : table.getPageCount();

  const handlePageChange = (page: number) => {
    if (meta) {
      filter?.updateFilter(paginationKey, page, { resetPage: false });
      return;
    }
    table.setPageIndex(page - 1);
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-2 sm:flex-row">
      <div className="text-center text-sm text-muted-foreground sm:text-left">
        {meta ? (
          <>
            Showing {serverFrom} to {serverTo} of {meta.total} entries
          </>
        ) : (
          <>
            Showing {localFrom} to {localTo} of {localTotal} entries
          </>
        )}
      </div>

      <div className="flex items-center">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          updatePage={handlePageChange}
        />
      </div>
    </div>
  );
}