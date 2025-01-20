"use client";
import { useState, useEffect } from "react";
import axios from "@/components/axiosConfig";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation"; // Import router

interface Stationery {
  _id: string;
  name: string;
  photo?: string; // Correctly typed as string if photo is a URL or filename
  description?: string; // Added missing description field
  price?: number; // Added missing price field
}

const fetchCategories = async () => {
  try {
    const response = await axios.get("/stationery");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

const createCategory = async (data: Stationery) => {
  const formData = new FormData();
  
  formData.append("name", data.name); // Ensure backend expects "name"
  if (data.photo) {
    formData.append("image", data.photo); // Changed "photo" to "image" (use correct name)
  }
  if (data.description) {
    formData.append("description", data.description); // Added description field
  }
  if (data.price !== undefined) {
    formData.append("price", data.price.toString()); // Added price field
  }
  
  try {
    const response = await axios.post("/stationery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Category added successfully!");
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    toast.error("Failed to add category");
  }
};

const deleteCategory = async (id: string) => {
  try {
    await axios.delete(`/stationery/${id}`);
    toast.success("Category deleted successfully!");
  } catch (error) {
    console.error("Error deleting category:", error);
    toast.error("Failed to delete category");
  }
};

const StationeryPage = () => {
  const [categories, setCategories] = useState<Stationery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState<Stationery>({
    name: "",
    photo: "", // Initialize as an empty string or null
    description: "", // Initialize description
    price: undefined, // Initialize price
  });
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        setError("Error fetching categories");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Categories</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setShowCategoryModal(true)}
        >
          <FaPlus className="inline mr-2" /> Add Category
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Image</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Price</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td
                  className="py-2 px-4 border-b cursor-pointer text-blue-500"
                  onClick={() =>
                    router.push(`http://localhost:3000/stationery/products/${category._id}`)
                  }
                >
                  {category.name}
                </td>
                <td className="py-2 px-4 border-b">
                  {category.photo ? (
                    <img src={`/uploads/${category.photo}`} alt={category.name} className="h-12 w-12 object-cover" />
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">{category.description}</td>
                <td className="py-2 px-4 border-b">${category.price}</td>
                <td className="py-2 px-4 border-b">
                  <button className="text-red-600" onClick={() => deleteCategory(category._id)}>
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal to Add Category */}
      {showCategoryModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">Add Category</h3>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="border px-4 py-2 w-full mb-4"
            />
            <textarea
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="border px-4 py-2 w-full mb-4"
            />
            <input
              type="number"
              placeholder="Price"
              value={newCategory.price || ""}
              onChange={(e) => setNewCategory({ ...newCategory, price: parseFloat(e.target.value) })}
              className="border px-4 py-2 w-full mb-4"
            />
            <input
              type="file"
              onChange={(e) => setNewCategory({ ...newCategory, photo: e.target.files?.[0] })}
              className="border px-4 py-2 w-full mb-4"
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={async () => {
                await createCategory(newCategory); // Ensure to handle the async result
                setShowCategoryModal(false); // Close the modal after creation
              }}
            >
              Save
            </button>
            <button
              className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setShowCategoryModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationeryPage;