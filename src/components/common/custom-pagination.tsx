"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  updatePage: (page: number) => void;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  updatePage,
}: CustomPaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i += 1
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <Pagination>
      <PaginationContent className="gap-1">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={isFirstPage}
            tabIndex={isFirstPage ? -1 : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (!isFirstPage) updatePage(currentPage - 1);
            }}
            className={cn(
              "h-8 w-8 cursor-pointer p-0 sm:w-auto sm:px-3",
              isFirstPage && "pointer-events-none opacity-50",
            )}
          />
        </PaginationItem>

        {pages.map((pageItem, idx) =>
          pageItem === "..." ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis className="h-8 w-8" />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageItem}>
              <PaginationLink
                href="#"
                aria-label={`Go to page ${pageItem}`}
                onClick={(e) => {
                  e.preventDefault();
                  updatePage(Number(pageItem));
                }}
                isActive={Number(pageItem) === currentPage}
                className="h-8 w-8 cursor-pointer p-0 text-xs"
              >
                {pageItem}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={isLastPage}
            tabIndex={isLastPage ? -1 : undefined}
            onClick={(e) => {
              e.preventDefault();
              if (!isLastPage) updatePage(currentPage + 1);
            }}
            className={cn(
              "h-8 w-8 cursor-pointer p-0 sm:w-auto sm:px-3",
              isLastPage && "pointer-events-none opacity-50",
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
