"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaEdit, 
  FaTrashAlt, 
  FaCheck, 
  FaDollarSign, 
  FaDownload 
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

interface FileData {
  _id?: string;
  name: string;
  path: string;
  size?: number;
}

interface Order {
  _id: string;
  documentType: string;
  description: string;
  printType: string;
  copies: number;
  documentFormat: string;
  paperSize: string;
  descriptionType: string;
  textDescription: string;
  status: string;
  paymentStatus: string;
  quotationAmount?: number;
  files?: FileData[];
  createdAt?: string;
}

const fetchOrders = async () => {
  try {
    const response = await axios.get("http://192.168.0.109:3010/requests");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
};

const acceptOrder = async (orderId: string) => {
  try {
    const response = await axios.patch(`http://192.168.0.109:3010/requests/${orderId}`, { status: "Accepted" });
    if (response.data.message !== "Order status updated successfully") {
      throw new Error(response.data.message);
    }
    toast.success("Order accepted!");
    return response.data.request;
  } catch (error) {
    console.error("Error accepting order:", error);
    toast.error("Failed to accept order");
  }
};


const addQuotation = async (orderId: string, quotationAmount: number) => {
  try {
    const response = await axios.patch(`http://192.168.0.109:3010/requests/${orderId}/quotation`, { quotationAmount });
    if (response.data.message !== "Quotation added successfully") {
      throw new Error(response.data.message);
    }
    toast.success("Quotation added!");
    return response.data.request;
  } catch (error) {
    console.error("Error adding quotation:", error);
    toast.error("Failed to add quotation");
  }
};

const deleteOrder = async (orderId: string) => {
  try {
    const response = await axios.delete(`http://192.168.0.109:3010/requests/${orderId}`);
    toast.success("Order deleted!");
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    toast.error("Failed to delete order");
  }
};

const TableWithAdditionalFields = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state for quotation
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [quotationValue, setQuotationValue] = useState<string>("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        setError("Error fetching orders");
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleAccept = async (orderId: string) => {
    await acceptOrder(orderId);
    setOrders((prevOrders) =>
      prevOrders.map(order =>
        order._id === orderId ? { ...order, status: 'Accepted' } : order
      )
    );
  };

  const openQuotationModal = (orderId: string, existingAmount?: number) => {
    setCurrentOrderId(orderId);
    setQuotationValue(existingAmount ? existingAmount.toString() : "");
    setShowQuotationModal(true);
  };

  const handleQuotationSave = async () => {
    if (currentOrderId && quotationValue) {
      const amount = parseFloat(quotationValue);
      await addQuotation(currentOrderId, amount);
      setOrders((prevOrders) =>
        prevOrders.map(order =>
          order._id === currentOrderId ? { ...order, quotationAmount: amount } : order
        )
      );
      setShowQuotationModal(false);
      setCurrentOrderId(null);
      setQuotationValue("");
    }
  };

  const handleDelete = async (orderId: string) => {
    await deleteOrder(orderId);
    setOrders(orders.filter(order => order._id !== orderId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 animate-pulse text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="relative rounded-sm border border-stroke bg-white px-5 pb-5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <Toaster position="top-right" reverseOrder={false} />

      {showQuotationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-boxdark p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">Add Quotation</h2>
            <input
              type="number"
              placeholder="Enter quotation amount"
              className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={quotationValue}
              onChange={(e) => setQuotationValue(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 rounded text-black"
                onClick={() => {
                  setShowQuotationModal(false);
                  setQuotationValue("");
                  setCurrentOrderId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                onClick={handleQuotationSave}
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
             
              <th className="min-w-[90px] px-4 py-4 font-medium text-black dark:text-white">
                Print
              </th>
              <th className="min-w-[90px] px-4 py-4 font-medium text-black dark:text-white">
                Copies
              </th>
              <th className="min-w-[90px] px-4 py-4 font-medium text-black dark:text-white">
               Type
              </th>
              <th className="min-w-[90px] px-4 py-4 font-medium text-black dark:text-white">
              Size
              </th>
            
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                Description 
              </th>
              <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                Created At
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Files
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Payment Status
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Quotation
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const createdDate = order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A';
              return (
                <tr key={order._id} className="border-b border-[#eee] dark:border-strokedark hover:bg-gray-50">
                 
                  <td className="px-4 py-5 dark:border-strokedark text-black dark:text-white">
                    {order.printType}
                  </td>
                  <td className="px-4 py-5 dark:border-strokedark text-black dark:text-white">
                    {order.copies}
                  </td>
                  <td className="px-4 py-5 dark:border-strokedark text-black dark:text-white">
                    {order.documentFormat}
                  </td>
                  <td className="px-4 py-5 dark:border-strokedark text-black dark:text-white">
                    {order.paperSize}
                  </td>
                
                  <td className="px-4 py-5 dark:border-strokedark text-black dark:text-white">
                    {order.descriptionType === 'Text' ? (
                      order.textDescription || <span className="text-gray-500 italic">None</span>
                    ) : (
                      // Placeholder for audio player
                      <div className="italic text-gray-500">Audio description coming soon...</div>
                    )}
                  </td>
                  <td className="px-4 py-5 dark:border-strokedark text-black dark:text-white">
                    {createdDate}
                  </td>
                  <td className="px-4 py-5 dark:border-strokedark text-black dark:text-white">
                    {order.files && order.files.length > 0 ? (
                      <div className="space-y-1">
                        {order.files.map((file) => (
                          <a
                            key={file._id}
                            href={`http://192.168.0.109:3010/${file.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                          >
                          
                            {file.name}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No files</span>
                    )}
                  </td>
                  <td className="px-4 py-5 dark:border-strokedark">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${
                        order.status === 'Accepted' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-5 dark:border-strokedark">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm ${
                        order.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {order.paymentStatus === 'Paid' ? (
                        <>
                          <FaDollarSign className="mr-1" />
                          Paid
                        </>
                      ) : (
                        <>
                          <FaCheck className="mr-1" />
                          {order.paymentStatus}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-5 dark:border-strokedark text-black dark:text-white">
                    {order.quotationAmount !== undefined && order.quotationAmount !== null ? (
                      <span className="inline-block text-sm font-medium">
                        ${order.quotationAmount.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-gray-500 italic">Not set</span>
                    )}
                  </td>
                  <td className="px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {order.status !== 'Accepted' && (
                        <button
                          onClick={() => handleAccept(order._id)}
                          className="text-green-600 hover:text-green-800"
                          title="Accept Order"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {order.status === 'Accepted' && order.paymentStatus !== 'Paid' && (
                        <button
                          onClick={() => openQuotationModal(order._id, order.quotationAmount)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Add/Update Quotation"
                        >
                          <FaDollarSign />
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-800" title="Edit Order">
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(order._id)}
                        title="Delete Order"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableWithAdditionalFields;
