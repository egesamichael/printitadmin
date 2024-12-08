"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

interface Equipment {
  _id?: string;
  name: string;
  category: string;
  image?: File; // Changed from string to File
  price: number;
}

const fetchEquipments = async () => {
  try {
    const response = await axios.get("http://192.168.0.109:3010/equipments");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch equipments");
  }
};

const createEquipment = async (data: Equipment) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("category", data.category);
  formData.append("price", data.price.toString());
  if (data.image) {
    formData.append("image", data.image);
  }

  try {
    const response = await axios.post("http://192.168.0.109:3010/equipments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    toast.success("Equipment added successfully!");
    return response.data;
  } catch (error) {
    console.error("Error creating equipment:", error);
    toast.error("Failed to add equipment");
  }
};

const deleteEquipment = async (id: string) => {
  try {
    await axios.delete(`http://192.168.0.109:3010/equipments/${id}`);
    toast.success("Equipment deleted successfully!");
  } catch (error) {
    console.error("Error deleting equipment:", error);
    toast.error("Failed to delete equipment");
  }
};

const EquipmentsTable = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Equipment>({
    name: "",
    category: "",
    image: undefined, // Initialize image as undefined
    price: 0,
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const data = await fetchEquipments();
        setEquipments(data);
      } catch (error) {
        setError("Error fetching equipments");
        console.error("Error fetching equipments:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEquipments();
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!newEquipment.name) errors.name = "Name is required";
    if (!newEquipment.category) errors.category = "Category is required";
    if (!newEquipment.price || newEquipment.price <= 0) errors.price = "Price must be a positive number";

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleAddEquipment = async () => {
    if (!validateForm()) return;

    const addedEquipment = await createEquipment(newEquipment);
    if (addedEquipment) {
      setEquipments((prev) => [...prev, addedEquipment]);
      setShowModal(false);
      setNewEquipment({ name: "", category: "", image: undefined, price: 0 });
      setFormErrors({});
    }
  };

  const handleDelete = async (id: string) => {
    await deleteEquipment(id);
    setEquipments((prev) => prev.filter((equip) => equip._id !== id));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Equipments</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="inline mr-2" />
          Add Equipment
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Add New Equipment</h3>
            <input
              type="text"
              placeholder="Name"
              className={`w-full p-2 border mb-4 ${formErrors.name ? 'border-red-500' : ''}`}
              value={newEquipment.name}
              onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
            />
            {formErrors.name && <div className="text-red-500 mb-4">{formErrors.name}</div>}
            <input
              type="text"
              placeholder="Category"
              className={`w-full p-2 border mb-4 ${formErrors.category ? 'border-red-500' : ''}`}
              value={newEquipment.category}
              onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
            />
            {formErrors.category && <div className="text-red-500 mb-4">{formErrors.category}</div>}
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border mb-4"
              onChange={(e) => setNewEquipment({ ...newEquipment, image: e.target.files![0] })}
            />
            <input
              type="number"
              placeholder="Price"
              className={`w-full p-2 border mb-4 ${formErrors.price ? 'border-red-500' : ''}`}
              value={newEquipment.price}
              onChange={(e) => setNewEquipment({ ...newEquipment, price: parseFloat(e.target.value) })}
            />
            {formErrors.price && <div className="text-red-500 mb-4">{formErrors.price}</div>}
            <div className="flex justify-end space-x-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleAddEquipment}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-full overflow-x-auto mt-4">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left dark:bg-meta-4">
              <th>Name</th>
              <th>Category</th>
              <th>Image</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((equip) => (
              <tr key={equip._id} className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-50">
                <td>{equip.name}</td>
                <td>{equip.category}</td>
                <td>
                  <img
                    src={equip.image ? URL.createObjectURL(equip.image) : "placeholder.png"}
                    alt={equip.name}
                    className="w-16 h-16"
                  />
                </td>
                <td>${equip.price}</td>
                <td>
                  <button
                    onClick={() => handleDelete(equip._id!)}
                    className="text-red-600"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentsTable;
