import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';
import Toast from './Toast';
import Header from '../pages/Header'; // Optional: Your shared Header component
import Footer from '../pages/Footer'; // Optional: Your shared Footer component

const StudentDashboard = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Modal state for product details and add-to-cart options
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        setToast({ type: "error", title: "Error", message: "Failed to fetch products. Please try again later." });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Compute distinct sellers for filter dropdown
  const sellers = Array.from(
    new Set(products.map(product => product.owner?.organisationName))
  ).filter(Boolean);

  // Filter products based on search query, selected seller, and price range
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeller = selectedSeller ? product.owner?.organisationName === selectedSeller : true;
    const price = parseFloat(product.price);
    const matchesMin = minPrice ? price >= parseFloat(minPrice) : true;
    const matchesMax = maxPrice ? price <= parseFloat(maxPrice) : true;
    return matchesSearch && matchesSeller && matchesMin && matchesMax;
  });

  // Open modal when a product is clicked
  const openModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Add to Cart API integration
  const handleAddToCart = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      // Call the POST /cart API endpoint with product ID and quantity
      await axios.post(`${BASE_URL}/cart`, {
        product: selectedProduct._id,
        quantity: quantity,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({
        type: "success",
        title: "Added to Cart",
        message: `Added ${quantity} x ${selectedProduct.name} to your cart.`,
      });
      closeModal();
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToast({
        type: "error",
        title: "Error",
        message: "Failed to add item to cart. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>
        
        {/* Filters Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition" 
          />
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select 
              value={selectedSeller} 
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Sellers</option>
              {sellers.map((seller, index) => (
                <option key={index} value={seller}>{seller}</option>
              ))}
            </select>
            <input 
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input 
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        {loading ? (
          <p className="text-gray-600">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-gray-600">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div 
                key={product._id} 
                className="bg-white rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
                onClick={() => openModal(product)}
              >
                <img 
                  src={product.imageUrl || '/placeholder.png'} 
                  alt={product.name} 
                  className="w-[50%] pt-5 mx-auto object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-gray-800 font-bold">Rs. {product.price}</span>
                    <span className="text-sm text-gray-500">{product.owner?.organisationName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      <Footer />

      {/* Modal for Product Details & Add to Cart Options */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl">&times;</button>
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={selectedProduct.imageUrl || '/placeholder.png'} 
                alt={selectedProduct.name} 
                className="w-full md:w-1/2 object-cover rounded-lg"
              />
              <div className="flex flex-col justify-between w-full md:w-1/2">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                  <p className="text-gray-600 mt-2">{selectedProduct.description}</p>
                  <p className="text-gray-800 font-bold mt-4">Rs. {selectedProduct.price}</p>
                  <p className="text-sm text-gray-500 mt-2">Seller: {selectedProduct.owner?.organisationName}</p>
                </div>
                <div className="mt-6 flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(prev => (prev > 1 ? prev - 1 : 1))}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    –
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
