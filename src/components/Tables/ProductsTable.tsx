"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "@/components/axiosConfig";
import toast, { Toaster } from "react-hot-toast";

interface Item {
  name: string;
  quantity: number;
  price: number;
  description: string;
}

interface Category {
  _id: string;
  name: string;
  image: string;
  items: Item[];
}

const Products = () => {
  const { id } = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<Item>({ name: "", quantity: 1, price: 0, description: "" });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`/equipments/${id}`);
        setCategory(response.data);
      } catch (error) {
        toast.error("Failed to fetch category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProductImage(e.target.files[0]);
    }
  };

  const addItem = async () => {
    if (!newItem.name || newItem.quantity <= 0 || newItem.price <= 0 || !newItem.description) {
      toast.error("Invalid item details");
      return;
    }
  
    // Create the FormData object
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("quantity", String(newItem.quantity));
    formData.append("price", String(newItem.price));
    formData.append("description", newItem.description);
  
    if (productImage) {
      formData.append("image", productImage);
    }
  
    // Create an updated list of items
    const updatedItems = [...(category?.items || []), newItem];
    formData.append("items", JSON.stringify(updatedItems)); // Convert the items to a string
  
    try {
      // Send the FormData to the backend to update the equipment
      await axios.patch(`/equipments/${id}`, formData);
  
      // Update the state with the new items
      setCategory((prev) => prev && { ...prev, items: updatedItems });
      setNewItem({ name: "", quantity: 1, price: 0, description: "" });
      setProductImage(null);
  
      toast.success("Item added successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to add item");
    }
  };
  
//   const addItem = async () => {
//     if (!newItem.name || newItem.quantity <= 0 || newItem.price <= 0 || !newItem.description) {
//       toast.error("Invalid item details");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", newItem.name);
//     formData.append("quantity", String(newItem.quantity));
//     formData.append("price", String(newItem.price));
//     formData.append("description", newItem.description);

//     if (productImage) {
//       formData.append("image", productImage);
//     }

//     try {
//       const updatedItems = [...(category?.items || []), newItem];
//       formData.append("items", JSON.stringify(updatedItems));

//       await axios.patch(`/equipments/${id}`, formData);

//       setCategory((prev) => prev && { ...prev, items: updatedItems });
//       setNewItem({ name: "", quantity: 1, price: 0, description: "" });
//       setProductImage(null);

//       toast.success("Item added successfully!");
//       setIsModalOpen(false);
//     } catch (error) {
//       toast.error("Failed to add item");
//     }
//   };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <Toaster position="top-right" />
      <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => router.push("/categories")}>
        Back
      </button>
      <h2 className="text-xl font-bold my-4">{category?.name}</h2>
      <img src={`/uploads/${category?.image}`} alt={category?.name} className="h-20 w-20 object-cover" />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        onClick={openModal}
      >
        Add Product
      </button>

      {/* Modal for Adding Item */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="font-bold mb-4">Add Item</h3>
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border px-4 py-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
              className="border px-4 py-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
              className="border px-4 py-2 w-full mb-2"
            />
            <textarea
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="border px-4 py-2 w-full mb-2"
            />
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="border px-4 py-2 w-full mb-2"
            />
            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={addItem}
              >
                Add Item
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="font-bold mt-6">Items</h3>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {category?.items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">${item.price.toFixed(2)}</td>
              <td className="border p-2">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;