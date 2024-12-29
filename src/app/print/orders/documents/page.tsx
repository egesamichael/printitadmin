'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface File {
    name: string;
    uri: string;
}

interface Order {
    _id: string;
    documentType: string;
    description: string;
    printType: string;
    copies: number;
    status: string;
    paymentStatus: string;
    quotationAmount?: number;
    files?: File[];
}

const OrderDetails = () => {
  const params = useParams();
  const orderId = params.orderId;
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await axios.get(`https://printit.praisewebsolutions.com/api/orders/${orderId}`);
          setOrder(response.data);
        } catch (error) {
          console.error('Error fetching order details:', error);
          setError('Failed to load order details');
        }
      };

      fetchOrderDetails();
    }
  }, [orderId]);

  if (error) return <div>{error}</div>;
  if (!order) return <div>Loading...</div>;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Order Details" />

      <div className="flex flex-col gap-10">
        <div>
          <p><strong>Document Type:</strong> {order.documentType}</p>
          <p><strong>Description:</strong> {order.description}</p>
          <p><strong>Print Type:</strong> {order.printType}</p>
          <p><strong>Copies:</strong> {order.copies}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          {order.quotationAmount && <p><strong>Quotation Amount:</strong> ${order.quotationAmount}</p>}
          {order.files && (
            <div>
              <strong>Attachments:</strong>
              <ul>
                {order.files.map((file, index) => (
                  <li key={index}>
                    <a href={file.uri} target="_blank" rel="noopener noreferrer">{file.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrderDetails;