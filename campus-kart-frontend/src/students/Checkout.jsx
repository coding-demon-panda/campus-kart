import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import Toast from './Toast';
import Header from '../pages/Header';
import Footer from '../pages/Footer';
import { useNavigate } from 'react-router-dom';

const StudentCheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Payment and delivery states
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [address, setAddress] = useState({
    addressLine: "",
    city: "",
    pincode: "",
  });
  const [deliverySlot, setDeliverySlot] = useState("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState("");

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const navigate = useNavigate();
  const token = sessionStorage.getItem("authToken");

  // Fetch cart items on mount
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

    // Set an estimated delivery date (e.g., current date + 3 days)
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);
    setEstimatedDeliveryDate(currentDate.toLocaleDateString());
  }, [token]);

  // Get user's location and reverse geocode to auto-fill city and pincode
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const { city, principalSubdivision, postcode } = res.data;
            setAddress((prev) => ({
              ...prev,
              city: city || principalSubdivision || "",
              pincode: postcode || ""
            }));
          } catch (error) {
            console.error("Reverse geocoding error:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const price = parseFloat(item.product.price);
    return total + (price * item.quantity);
  }, 0);

  // Order submission: calls the order API and clears the cart
  const handleSubmitOrder = async () => {
    try {
      const orderData = {
        cartItems,
        totalPrice,
        paymentMethod,
        address,
        deliverySlot,
        estimatedDeliveryDate,
      };
      const res = await axios.post(`${BASE_URL}/order`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ type: "success", title: "Order Placed", message: "Your order has been submitted successfully!" });
      
      // Clear the cart on successful order submission
      setCartItems([]);
      
      // Redirect to orders summary or confirmation page after a delay
      setTimeout(() => {
        navigate('/students/orders');
      }, 3000);
    } catch (error) {
      console.error("Error submitting order:", error);
      setToast({ type: "error", title: "Error", message: "Failed to create order. Please try again later." });
    }
  };

  // Simulate Razorpay integration: open modal and then process dummy payment
  const handlePayment = async () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      await handleSubmitOrder();
      setIsPaymentModalOpen(false);
    }, 2000);
  };

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
    } catch (error) {
      console.error("Error removing cart item:", error);
      setToast({ type: "error", title: "Error", message: "Failed to remove cart item." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container w-[75%] mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
        
        {/* Cart Items List */}
        <div className="space-y-4 mb-8">
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
                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary and Delivery Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600">Address</label>
              <input
                type="text"
                value={address.addressLine}
                onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                placeholder="Enter your address"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-gray-600">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="City"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-600">Pincode</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  placeholder="Pincode"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Options</h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="block text-gray-600">Preferable Delivery Slot</label>
              <select 
                value={deliverySlot} 
                onChange={(e) => setDeliverySlot(e.target.value)}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a slot</option>
                <option value="10AM-12PM">10 AM - 12 PM</option>
                <option value="12PM-2PM">12 PM - 2 PM</option>
                <option value="2PM-4PM">2 PM - 4 PM</option>
                <option value="4PM-6PM">4 PM - 6 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-600">Estimated Delivery Date</label>
              <input
                type="text"
                value={estimatedDeliveryDate}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Options</h2>
          <div className="flex flex-col gap-4">
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="upi">UPI</option>
              <option value="card">Credit/Debit Card</option>
              <option value="netbanking">Net Banking</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
        </div>

        {/* Order Summary & Proceed to Payment */}
        <div className="flex flex-col items-end mb-8">
          <div className="text-2xl font-bold text-gray-800 mb-2">
            Total: Rs. {totalPrice.toFixed(2)}
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      {/* Payment Modal with Dummy Razorpay Integration */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-8 relative">
            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment</h2>
            <p className="text-gray-600 mb-6">This is a dummy Razorpay integration. Click "Pay Now" to simulate payment.</p>
            <button
              onClick={handlePayment}
              className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default StudentCheckoutPage;
