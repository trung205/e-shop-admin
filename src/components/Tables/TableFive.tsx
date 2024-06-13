"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { useState } from "react";

const productData: Product[] = [
  {
    image: "/images/product/product-01.png",
    name: "Apple Watch Series 7",
    category: "Electronics",
    price: 296,
    sold: 22,
    profit: 45,
  },
  {
    image: "/images/product/product-02.png",
    name: "Macbook Pro M1",
    category: "Electronics",
    price: 546,
    sold: 12,
    profit: 125,
  },
  {
    image: "/images/product/product-03.png",
    name: "Dell Inspiron 15",
    category: "Electronics",
    price: 443,
    sold: 64,
    profit: 247,
  },
  {
    image: "/images/product/product-04.png",
    name: "HP Probook 450",
    category: "Electronics",
    price: 499,
    sold: 72,
    profit: 103,
  },
];

const tableQuery = {
  total: 10,
  perPage: 10,
};
const TableFive = () => {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="px-4 py-6 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Top Products
          </h4>
        </div>

        <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-3 flex items-center">
            <p className="font-medium">Product Name</p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Category</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Price</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Sold</p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="font-medium">Profit</p>
          </div>
        </div>

        {productData.map((product, key) => (
          <div
            className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-3 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-black dark:text-white">
                  {product.name}
                </p>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {product.category}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                ${product.price}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {product.sold}
              </p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-meta-3">${product.profit}</p>
            </div>
          </div>
        ))}
      </div>
      <nav 
        aria-label="Page navigation example"
        className="flex justify-center mt-4">
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
          {new Array(tableQuery.total).fill("").map((page, index) => {
            console.log(index);
            if (
              index + 1 == 1 ||
              index + 1 == tableQuery.total ||
              (index + 1 >= currentPage - 2 && index + 1 <= currentPage + 2)
            ) {
              return (
                <li>
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
            if (index == 1 || index == tableQuery.total - 2) {
              return (
                <li>
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
              disabled={currentPage >= tableQuery.total ? true : false}
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
    </div>
  );
};

export default TableFive;
