'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaCheck, FaDollarSign } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

interface Order {
  _id: string;
  documentType: string;
  description: string;
  printType: string;
  copies: number;
  status: string;
  paymentStatus: string;
  quotationAmount?: number;
  file?: {
    name: string;
    uri: string;
  };
}

const fetchOrders = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/orders");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
};

const acceptOrder = async (orderId: string) => {
  try {
    await axios.patch(`http://localhost:4000/api/orders/${orderId}`, { status: 'Accepted' });
    toast.success("Order accepted!");
  } catch (error) {
    console.error("Error accepting order:", error);
    toast.error("Failed to accept order");
  }
};

const addQuotation = async (orderId: string, quotationAmount: number) => {
  try {
    await axios.patch(`http://localhost:4000/api/orders/${orderId}/quotation`, { quotationAmount });
    toast.success("Quotation added!");
  } catch (error) {
    console.error("Error adding quotation:", error);
    toast.error("Failed to add quotation");
  }
};

const deleteOrder = async (orderId: string) => {
  try {
    await axios.delete(`http://localhost:4000/api/orders/${orderId}`);
    toast.success("Order deleted!");
  } catch (error) {
    console.error("Error deleting order:", error);
    toast.error("Failed to delete order");
  }
};

const TableThree = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'Accepted' } : order));
  };

  const handleQuotation = async (orderId: string) => {
    const quotationAmount = prompt("Enter the quotation amount:");
    if (quotationAmount) {
      await addQuotation(orderId, parseFloat(quotationAmount));
      setOrders(orders.map(order => order._id === orderId ? { ...order, quotationAmount: parseFloat(quotationAmount) } : order));
    }
  };

  const handleDelete = async (orderId: string) => {
    await deleteOrder(orderId);
    setOrders(orders.filter(order => order._id !== orderId));
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Document Type</th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Description</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Print Type</th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">Copies</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">File Name</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Status</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Payment Status</th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">{order.documentType}</h5>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{order.description}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{order.printType}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <p className="text-black dark:text-white">{order.copies}</p>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  {order.file && order.file.name ? (
                    <a href={order.file.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                      {order.file.name}
                    </a>
                  ) : (
                    <p className="text-gray-500">No file</p>
                  )}
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-white ${
                    order.status === 'Accepted' ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-white ${
                    order.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {order.paymentStatus === 'Paid' ? <FaDollarSign className="mr-1" /> : <FaCheck className="mr-1" />}
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    {order.status !== 'Accepted' ? (
                      <button onClick={() => handleAccept(order._id)} className="text-green-600 hover:text-green-800">
                        <FaCheck />
                      </button>
                    ) : (
                      order.paymentStatus !== 'Paid' && (
                        <button onClick={() => handleQuotation(order._id)} className="text-blue-600 hover:text-blue-800">
                          <FaDollarSign />
                        </button>
                      )
                    )}
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(order._id)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableThree;
