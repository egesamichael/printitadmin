"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import OrdersTable from "../../../components/Tables/BrandOrdersTable";

const BrandOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        axios
            .get("/brand/orders")
            .then((response) => setOrders(response.data))
            .catch((error) => console.error("Error fetching orders:", error));
    }, []);

    return (
        <div>
            <h1 className="text-xl font-bold">Brand Orders</h1>
            <OrdersTable orders={orders} />
        </div>
    );
};

export default BrandOrders;