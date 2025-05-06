// src/components/Pagination.jsx
import React from "react";

export default function Pagination({
  totalItems,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizes = [5, 10, 20, 50],
}) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between mt-4">
      <div>
        <label>
          Afficher :
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="ml-2 border rounded px-1"
          >
            {pageSizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          &nbsp;par page
        </label>
      </div>

      <div className="space-x-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="btn px-2"
        >
          ‹ Prev
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`btn px-2 ${p === page ? "bg-blue-700 text-white" : ""}`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="btn px-2"
        >
          Next ›
        </button>
      </div>
    </div>
  );
}
