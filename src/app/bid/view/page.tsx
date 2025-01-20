"use client";

import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import axios from "../../../components/axiosConfig";
import CategoriesTable from "../../../components/Tables/BrandCategoriesTable";

const BrandView = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    title: "",
    image: null,
    items: [{ name: "", price: "" }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get("/brand/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setErrorMessage("Failed to fetch categories. Please try again.");
      });
  }, []);

  const handleEditCategory = (category) => {
    setIsEditing(true);
    setShowModal(true);
    setCurrentCategory(category);
    setNewCategory({
      title: category.title,
      image: null,
      items: category.items || [{ name: "", price: "" }],
    });
  };

  const handleDeleteCategory = (categoryId) => {
    console.log("Deleting category with ID:", categoryId); // Debugging line
  
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`/brand/categories/${categoryId}`, {
          params: { id: categoryId }, // Explicitly set the ID as a parameter
        })
        .then(() => {
          alert("Category deleted successfully!");
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== categoryId)
          );
        })
        .catch((error) => {
          console.error("Error deleting category:", error.response || error);
          alert("Failed to delete category. Please try again.");
        });
    }
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", newCategory.title);
    if (newCategory.image) formData.append("image", newCategory.image);
    formData.append("items", JSON.stringify(newCategory.items));

    if (isEditing && currentCategory) {
      axios
        .put(`/brand/categories/${currentCategory._id}`, formData)
        .then((response) => {
          alert("Category updated successfully!");
          setCategories((prevCategories) =>
            prevCategories.map((cat) =>
              cat._id === currentCategory._id ? response.data.category : cat
            )
          );
          setShowModal(false);
          resetForm();
        })
        .catch((error) => {
          console.error("Error updating category:", error);
          setErrorMessage("Failed to update category. Please try again.");
        })
        .finally(() => setIsSubmitting(false));
    } else {
      axios
        .post("/brand/categories", formData)
        .then((response) => {
          alert("Category added successfully!");
          setCategories((prevCategories) => [...prevCategories, response.data.category]);
          setShowModal(false);
          resetForm();
        })
        .catch((error) => {
          console.error("Error adding category:", error);
          setErrorMessage("Failed to add category. Please try again.");
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  const resetForm = () => {
    setNewCategory({ title: "", image: null, items: [{ name: "", price: "" }] });
    setCurrentCategory(null);
    setIsEditing(false);
    setErrorMessage("");
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Branding" />
      <div className="flex flex-col gap-6">
        <div className="flex justify-start mb-4">
          <button
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
            className="px-4 py-1 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 text-sm"
          >
            Add Category
          </button>
        </div>
        <CategoriesTable
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h2>
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Category Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newCategory.title}
                  onChange={(e) =>
                    setNewCategory((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Category Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={(e) =>
                    setNewCategory((prev) => ({ ...prev, image: e.target.files[0] }))
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <h3 className="text-md font-semibold mb-2">Items</h3>
                {newCategory.items.map((item, index) => (
                  <div key={index} className="flex gap-3 mb-2">
                    <input
                      type="text"
                      name="name"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) => {
                        const updatedItems = [...newCategory.items];
                        updatedItems[index].name = e.target.value;
                        setNewCategory((prev) => ({ ...prev, items: updatedItems }));
                      }}
                      className="p-2 flex-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => {
                        const updatedItems = [...newCategory.items];
                        updatedItems[index].price = e.target.value;
                        setNewCategory((prev) => ({ ...prev, items: updatedItems }));
                      }}
                      className="p-2 flex-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedItems = newCategory.items.filter(
                          (_, i) => i !== index
                        );
                        setNewCategory((prev) => ({ ...prev, items: updatedItems }));
                      }}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setNewCategory((prev) => ({
                      ...prev,
                      items: [...prev.items, { name: "", price: "" }],
                    }))
                  }
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none text-sm"
                >
                  Add Item
                </button>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-1 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-1 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default BrandView;
