import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

function getPageHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const linkClassName =
    "rounded-md px-2 py-1 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900";
  const disabledClassName =
    "cursor-not-allowed rounded-md px-2 py-1 text-sm text-neutral-300";

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-1"
    >
      {currentPage === 1 ? (
        <span aria-disabled="true" className={disabledClassName}>
          Previous
        </span>
      ) : (
        <Link
          className={linkClassName}
          href={getPageHref(basePath, currentPage - 1)}
          rel="prev"
        >
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) =>
          page === currentPage ? (
            <span
              key={page}
              aria-current="page"
              className="rounded-md bg-neutral-900 px-2 py-1 text-sm text-white"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              aria-label={`Go to page ${page}`}
              className={linkClassName}
              href={getPageHref(basePath, page)}
            >
              {page}
            </Link>
          ),
      )}

      {currentPage === totalPages ? (
        <span aria-disabled="true" className={disabledClassName}>
          Next
        </span>
      ) : (
        <Link
          className={linkClassName}
          href={getPageHref(basePath, currentPage + 1)}
          rel="next"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
