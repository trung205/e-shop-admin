"use client";

const TablePagination = ({ total, currentPage, setCurrentPage }: any) => {
  return (
    <nav
      aria-label="Page navigation example"
      className="my-4 flex justify-center"
    >
      <ul className="inline-flex h-10 -space-x-px text-base">
        <li>
          <button
            onClick={() => {
              setCurrentPage(currentPage - 1);
            }}
            disabled={currentPage > 1 ? false : true}
            className="text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 ms-0 flex h-10 items-center justify-center rounded-s-lg border border-e-0 bg-white px-4 leading-tight dark:hover:text-white"
          >
            Previous
          </button>
        </li>
        {new Array(total).fill("").map((page, index) => {
          if (
            index + 1 == 1 ||
            index + 1 == total ||
            (index + 1 >= currentPage - 2 && index + 1 <= currentPage + 2)
          ) {
            return (
              <li key={index}>
                <button
                  onClick={() => {
                    setCurrentPage(index + 1);
                  }}
                  className={
                    currentPage !== index + 1
                      ? "text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 flex h-10 items-center justify-center border bg-white px-4 leading-tight hover:bg-blue-100 hover:text-blue-700 dark:hover:text-white"
                      : "border-gray-300 dark:border-gray-700 dark:bg-gray-700 flex h-10 items-center justify-center border bg-blue-50 px-4 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:text-white"
                  }
                >
                  {index + 1}
                </button>
              </li>
            );
          }
          if (index == 1 || index == total - 2) {
            return (
              <li key={index}>
                <button
                  key={index}
                  className="text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 flex h-10 items-center justify-center border bg-white px-4 leading-tight dark:hover:text-white"
                  onClick={() => {}}
                >
                  ...
                </button>
              </li>
            );
          }
          return null;
        })}
        <li>
          <button
            disabled={currentPage >= total ? true : false}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
            className="text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 flex h-10 items-center justify-center rounded-e-lg border bg-white px-4 leading-tight dark:hover:text-white"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default TablePagination;
