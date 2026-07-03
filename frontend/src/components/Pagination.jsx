const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Page {page} of {pages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 text-sm rounded border dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(5, pages) }, (_, i) => {
          const start = Math.max(1, Math.min(page - 2, pages - 4));
          const pageNum = start + i;
          if (pageNum > pages) return null;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 text-sm rounded ${
                pageNum === page
                  ? 'bg-blue-600 text-white'
                  : 'border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="px-3 py-1 text-sm rounded border dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
