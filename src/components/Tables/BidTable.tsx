import React from "react";

type Bid = {
    _id: string;
    title: string;
    createdAt: string;
};

interface Props {
    categories: Bid[];
}

const BidsTable = ({ categories, onEdit, onDelete }) => {
    return (
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Image</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Items</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-16 w-16 object-cover rounded"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 font-semibold">{category.title}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {category.items.map((item, index) => (
                    <div key={item._id || index} className="text-sm">
                      <span>{item.name} - UGX {item.price}</span>
                    </div>
                  ))}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                  {new Date(category.createdAt).toLocaleDateString("en-US")}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => onEdit(category)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(category._id)}
                    className="px-3 py-1 ml-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default BidsTable;
  