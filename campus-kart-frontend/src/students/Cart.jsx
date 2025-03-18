import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import Toast from './Toast';
import Header from '../pages/Header'; // Shared header component
import Footer from '../pages/Footer'; // Shared footer component
import { useNavigate } from 'react-router-dom';

const StudentCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const token = sessionStorage.getItem("authToken");
  const navigate = useNavigate();

  // Fetch all cart items for the student on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(res.data.cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setToast({ type: "error", title: "Error", message: "Failed to fetch cart items. Please try again later." });
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [token]);

  // Update quantity for a cart item
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await axios.put(`${BASE_URL}/cart/${cartItemId}`, { quantity: newQuantity }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedItem = res.data.cartItem;
      setCartItems(cartItems.map(item => item._id === updatedItem._id ? updatedItem : item));
      setToast({ type: "success", title: "Updated", message: "Cart item updated successfully." });
      window.location.reload();
    } catch (error) {
      console.error("Error updating cart item:", error);
      setToast({ type: "error", title: "Error", message: "Failed to update cart item." });
    }
  };

  // Remove a cart item
  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`${BASE_URL}/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(cartItems.filter(item => item._id !== cartItemId));
      setToast({ type: "success", title: "Removed", message: "Item removed from cart." });
      window.location.reload();
    } catch (error) {
      console.error("Error removing cart item:", error);
      setToast({ type: "error", title: "Error", message: "Failed to remove cart item." });
    }
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.product.price);
    return total + (price * item.quantity);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
        {loading ? (
          <p className="text-gray-600">Loading cart items...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item._id} className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow p-4">
                  <img 
                    src={item.product.imageUrl || '/placeholder.png'} 
                    alt={item.product.name} 
                    className="w-24 h-24 object-cover rounded-lg mr-4"
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-gray-800">{item.product.name}</h2>
                    <p className="text-gray-600">{item.product.description}</p>
                    <p className="text-gray-800 font-bold">Rs. {item.product.price}</p>
                    <p className="text-sm text-gray-500">Seller: {item.product.owner?.organisationName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      –
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item._id)}
                    className="ml-4 text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between border-t pt-4">
              <div className="text-2xl font-bold text-gray-800">
                Total: Rs. {totalPrice.toFixed(2)}
              </div>
              <button 
                onClick={() => navigate('/students/checkout')}
                className="mt-4 md:mt-0 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
};

export default StudentCartPage;
