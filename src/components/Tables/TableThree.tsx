'use client';
import { useState, useEffect } from "react";
import axios from "axios";
// Function to fetch orders using axios
const fetchOrders = async () => {
  try {
    const response = await axios.get("http://localhost:4000/api/orders");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch orders");
  }
};

const TableThree = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch orders from the API
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Document Type
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Description
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Print Type
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Copies
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                File Name
              </th>
              <th className="px-4 py-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {order.documentType}
                  </h5>
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
                  <div className="flex items-center space-x-3.5">
                    <button className="hover:text-primary">
                      {/* Edit Icon */}
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Edit Icon */}
                      </svg>
                    </button>
                    <button className="hover:text-primary">
                      {/* Delete Icon */}
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