import Link from "next/link";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationBar({
  currentPage,
  totalPages,
}: PaginationBarProps) {
  const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 9));
  const minPage = Math.max(1, Math.min(currentPage - 4, totalPages - 9));

  const numberedPageItems: JSX.Element[] = [];

  for (let page = minPage; page <= maxPage; page++) {
    numberedPageItems.push(
      <Link
        key={page}
        href={`?page=${page}`}
        className={`join-item btn ${
          page === currentPage ? "btn-active pointer-events-none" : ""
        }`}
        prefetch={false}
      >
        {page}
      </Link>
    );
  }
  return (
    <>
      <div className="join hidden sm:block">{numberedPageItems}</div>
      <div className=" join block sm:hidden">
        {currentPage > 1 && (
          <Link href={"?page=" + (currentPage - 1)} className="join-item btn">
            Prev
          </Link>
        )}

        <button className="join-item btn pointer-events-none">
          Page{currentPage}
        </button>
        {currentPage < totalPages && (
          <Link href={"?page=" + (currentPage + 1)} className="join-item btn">
            Next
          </Link>
        )}
      </div>
    </>
  );
}
