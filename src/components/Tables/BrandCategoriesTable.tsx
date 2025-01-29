import React, { useState, useEffect } from "react";

const CategoriesTable = ({ categories, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 shadow-md rounded-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">Categories</h2>
        <input
          type="text"
          placeholder="Search categories..."
          className="border px-3 py-2 rounded-md w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Image</th>
              <th className="border px-4 py-2 text-left">Title</th>
              <th className="border px-4 py-2 text-left">Items</th>
              {/* <th className="border px-4 py-2 text-left">Created At</th> */}
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  <img src={`https://printitug.com/api/${category.image}`} alt={category.title} className="h-16 w-16 object-cover rounded" />
                </td>
                <td className="border px-4 py-2 font-semibold">{category.title}</td>
                <td className="border px-4 py-2">
                  {category.items.map((item, index) => (
                    <div key={item._id || index} className="text-sm">
                      <span>{item.name} - UGX {item.price}</span>
                    </div>
                  ))}
                </td>
                {/* <td className="border px-4 py-2 text-sm text-gray-600">
                  {new Date(category.createdAt).toLocaleDateString("en-US")}
                </td> */}
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => onEdit(category)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(category._id)}
                    className="px-3 py-1 ml-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-3 py-1 bg-gray-300 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
        >
          Prev
        </button>
        <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-3 py-1 bg-gray-300 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoriesTable;