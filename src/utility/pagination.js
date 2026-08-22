
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-4 select-none">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 ${
          currentPage === 1
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-300 text-gray-600 hover:border-[#c1552c] hover:text-[#c1552c] hover:bg-amber-50 hover:shadow-sm cursor-pointer"
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} strokeWidth={2} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5 mx-2">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm font-medium"
              >
                …
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#c1552c] text-white shadow-md shadow-amber-200/50 scale-105"
                  : "text-gray-600 hover:bg-amber-50 hover:text-[#c1552c] hover:border hover:border-[#c1552c] hover:shadow-sm cursor-pointer"
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 ${
          currentPage === totalPages
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-300 text-gray-600 hover:border-[#c1552c] hover:text-[#c1552c] hover:bg-amber-50 hover:shadow-sm cursor-pointer"
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={18} strokeWidth={2} />
      </button>
    </div>
  );
};

export default Pagination;