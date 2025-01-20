import React from "react";

type Order = {
    _id: string;
    details: string;
    status: string;
    createdAt: string;
};

interface Props {
    orders: Order[];
}

const OrdersTable: React.FC<Props> = ({ orders }) => {
    return (
        <div>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Details</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td className="border px-4 py-2">{order.details}</td>
                            <td className="border px-4 py-2">{order.status}</td>
                            <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;