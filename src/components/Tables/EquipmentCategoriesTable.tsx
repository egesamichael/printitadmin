"use client";
import { useState, useEffect } from "react";
import axios from "@/components/axiosConfig";
import { FaTrashAlt, FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  photo?: string;
}

const fetchCategories = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`/equipments?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

const deleteCategory = async (id: string, refresh: () => void) => {
  try {
    await axios.delete(`/equipments/${id}`);
    toast.success("Category deleted successfully!");
    refresh();
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.error("Failed to delete category");
  }
};
const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, totalPages } = await fetchCategories(page, limit);
      if (Array.isArray(data)) {
        setCategories(data); // Ensure 'data' is an array
      } else {
        throw new Error("Invalid data format");
      }
      setTotalPages(totalPages);
    } catch (error) {
      setError("Error fetching categories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center">
          <FaPlus className="mr-2" /> Add Category
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-4 border">Name</th>
                <th className="py-3 px-4 border">Image</th>
                <th className="py-3 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-100">
                  <td
                    className="py-3 px-4 border cursor-pointer text-blue-600 hover:underline"
                    onClick={() => router.push(`/equipment/products/${category._id}`)}
                  >
                    {category.name}
                  </td>
                  <td className="py-3 px-4 border text-center">
                    <img
                      src={`https://printitug.com/api/uploads/${category.photo}`}
                      alt={category.name}
                      className="h-12 w-12 object-cover mx-auto rounded"
                    />
                  </td>
                  <td className="py-3 px-4 border text-center">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => deleteCategory(category._id, loadCategories)}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              <FaChevronLeft /> Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
