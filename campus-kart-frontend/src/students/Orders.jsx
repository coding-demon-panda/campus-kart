import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import Toast from './Toast';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import { useNavigate } from 'react-router-dom';

const StudentOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/students/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setToast({ type: "error", title: "Error", message: "Failed to fetch orders. Please try again later." });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>
        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">You have no orders.</p>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold text-gray-800">Order ID: {order._id}</div>
                  <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Items:</h2>
                  {order.cartItems.map(item => (
                    <div key={item._id} className="flex items-center mb-2">
                      <img 
                        src={item.product.imageUrl || '/placeholder.png'} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <div className="font-semibold text-gray-800">{item.product.name}</div>
                        <div className="text-gray-600">Quantity: {item.quantity}</div>
                        <div className="text-gray-800 font-bold">Rs. {item.product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-4">
                  <div className="mb-4 md:mb-0">
                    <div className="text-gray-800">
                      <span className="font-semibold">Total Price:</span> Rs. {order.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-semibold">Payment:</span> {order.paymentMethod}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-semibold">Status:</span> {order.orderStatus}
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm">
                    <div>
                      <span className="font-semibold">Delivery Slot:</span> {order.deliverySlot}
                    </div>
                    <div>
                      <span className="font-semibold">Estimated Delivery:</span> {order.estimatedDeliveryDate}
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold">Address:</span> {order.address.addressLine}, {order.address.city}, {order.address.pincode}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      <Footer />
    </div>
  );
};

export default StudentOrdersPage;
