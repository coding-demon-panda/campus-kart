import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import Layout from '../Layout'
import AddProductSidebar from './AddProductSidebar';
import EditProductSidebar from './EditProductSidebar';;

const SellerProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Get the seller's auth token from sessionStorage (set during login)
  const authToken = sessionStorage.getItem("authToken");

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/seller/products`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        // Assuming the API returns { products: [...] }
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
        setToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch products. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authToken]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: ''
  });

  // Handler for delete cancel
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };  

  // Handler for delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${BASE_URL}/seller/products/${selectedProduct._id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      // Update the products list
      setProducts(products.filter(p => p._id !== selectedProduct._id));
      setToast({
        type: 'success',
        title: 'Success',
        message: 'Product deleted successfully',
      });
    } catch (error) {
      console.error("Error deleting product", error);
      setToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete product. Please try again later.',
      });
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow pt-20 pb-10 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border mr-4 border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  />
                </div>
                <button 
                  onClick={() => setIsAddProductOpen(true)}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Add Product
                </button>
              </div>
            </div>
            {loading ? (
              <p className="text-gray-600">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-600">No products found. Start by adding a new product.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out flex flex-col"
                >
                  <img 
                    src={product.imageUrl || '/placeholder.png'} 
                    alt={product.name}
                    className="w-[50%] pt-5 object-cover rounded-t-lg mx-auto"  // Added mx-auto here
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-2 flex-grow">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-800 font-bold">Rs.{product.price}</p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditProductOpen(true);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteModalOpen(true);
                          }}                            
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </main>
        {toast && (
          <Toast 
            type={toast.type} 
            title={toast.title} 
            message={toast.message} 
            onClose={() => setToast(null)} 
          />
        )}
      </div>
      {/* Render overlay for Add and Edit Product sidebars */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-black/30 z-40"></div>
      )}
      <AddProductSidebar 
        formData={formData}
        setFormData={setFormData}
        products={products}
        setProducts={setProducts}
        isAddProductOpen={isAddProductOpen}
        setIsAddProductOpen={setIsAddProductOpen}
      />
      {isEditProductOpen && (
        <div className="fixed inset-0 bg-black/30 z-40"></div>
      )}
      <EditProductSidebar 
        formData={formData}
        setFormData={setFormData}
        products={products}
        setProducts={setProducts}
        isEditProductOpen={isEditProductOpen}
        setIsEditProductOpen={setIsEditProductOpen}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />

      {/* Delete Confirmation Modal */}
{isDeleteModalOpen && (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
    <div className="relative w-[550px] h-[234px] pt-2.5 bg-white rounded-xl shadow-[0px_8px_36px_0px_rgba(0,0,0,0.16)] flex-col justify-center items-center overflow-hidden">
      
      {/* Close (Cross) Icon at Top Right */}
      <div
        className="absolute top-4 right-4 cursor-pointer"
        onClick={handleDeleteCancel}
      >
        <div className="w-8 h-8 relative">
          <div className="w-8 h-8 absolute bg-white rounded-[7px] border border-[#ececec]" />
          <div className="w-[17.45px] h-[17.45px] absolute left-[7.27px] top-[7.27px] bg-white rounded">
            <div className="w-[17.45px] h-[17.45px] absolute">
              <div className="w-[17.45px] h-[17.45px] absolute" />
              <div data-svg-wrapper className="absolute left-[3.31px] top-[2.87px]">
                <svg
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.8705 0.379038C11.5379 0.0642572 11.0175 0.0636908 10.6842 0.377747L6.36387 4.44902L2.04356 0.377777C1.71029 0.0637203 1.18986 0.0642868 0.857274 0.379067C0.496671 0.720366 0.497295 1.29467 0.85864 1.63519L5.10424 5.63603L0.858329 9.63716C0.496983 9.97767 0.496359 10.552 0.856962 10.8933C1.18955 11.2081 1.70998 11.2086 2.04325 10.8946L6.36387 6.82304L10.6845 10.8946C11.0178 11.2087 11.5382 11.2081 11.8708 10.8933C12.2314 10.552 12.2308 9.9777 11.8694 9.63719L7.6235 5.63603L11.8691 1.63516C12.2305 1.29464 12.2311 0.720337 11.8705 0.379038Z"
                    fill="#0A1629"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Modal Content */}
      <div data-svg-wrapper className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="32" height="32" rx="16" fill="#FF0000" fillOpacity="0.2" />
          <path
            d="M23.5 9.5L22.8803 19.5251C22.7219 22.0864 22.6428 23.3671 22.0008 24.2879C21.6833 24.7431 21.2747 25.1273 20.8007 25.416C19.8421 26 18.559 26 15.9927 26C13.4231 26 12.1383 26 11.179 25.4149C10.7048 25.1257 10.296 24.7408 9.97868 24.2848C9.33688 23.3626 9.25945 22.0801 9.10461 19.5152L8.5 9.5"
            stroke="#FF0000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M7 9.5H25M20.0557 9.5L19.3731 8.09173C18.9196 7.15626 18.6928 6.68852 18.3017 6.39681C18.215 6.3321 18.1231 6.27454 18.027 6.2247C17.5939 6 17.0741 6 16.0345 6C14.9688 6 14.436 6 13.9957 6.23412C13.8981 6.28601 13.805 6.3459 13.7173 6.41317C13.3216 6.7167 13.1006 7.20155 12.6586 8.17126L12.0529 9.5"
            stroke="#FF0000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M13.5 20.5V14.5"
            stroke="#FF0000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M18.5 20.5V14.5"
            stroke="#FF0000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="mt-8 self-stretch h-11 px-6 py-2.5 flex flex-col justify-start items-center overflow-hidden">
        <div className="text-center text-black text-lg font-bold font-['Inter'] leading-normal">
          Delete Product
        </div>
      </div>
      <div className="self-stretch h-[66px] px-6 py-2 flex flex-col justify-start items-center gap-2.5">
        <div className="text-center text-[#9794aa] text-sm font-normal font-['Inter'] leading-tight">
          Are you sure you want to delete this product?
        </div>
        <div className="flex gap-2 items-center">
          <div data-svg-wrapper className="relative">
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.8333 10.0003C18.8333 5.39795 15.1023 1.66699 10.5 1.66699C5.89758 1.66699 2.16663 5.39795 2.16663 10.0003C2.16663 14.6027 5.89758 18.3337 10.5 18.3337C15.1023 18.3337 18.8333 14.6027 18.8333 10.0003Z"
                stroke="#FCD451"
                strokeWidth="1.2"
              />
              <path
                opacity="0.4"
                d="M10.7019 14.167V10.0003C10.7019 9.60749 10.7019 9.41108 10.5798 9.28899C10.4578 9.16699 10.2614 9.16699 9.86853 9.16699"
                stroke="#FCD451"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                opacity="0.4"
                d="M10.4933 6.66699H10.501"
                stroke="#FCD451"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="text-center text-[#9794aa] text-sm font-normal font-['Inter'] leading-tight">
            Note: This will unassign all the managed account of the user
          </div>
        </div>
      </div>
      <div className="self-stretch px-6 pt-4 pb-6 flex justify-center items-center gap-4">
        <div
          className="w-52 h-[42px] px-4 py-1.5 bg-[#6938ef] rounded-lg flex justify-center items-center cursor-pointer"
          onClick={handleDeleteConfirm}
        >
          <div className="text-center text-white text-xs font-medium font-['Inter']">
            Confirm
          </div>
        </div>
        <div
          className="w-52 h-[42px] px-4 py-1.5 rounded-lg border border-[#6938ef] flex justify-center items-center cursor-pointer"
          onClick={handleDeleteCancel}
        >
          <div className="text-center text-[#6938ef] text-xs font-medium font-['Inter']">
            Cancel
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </Layout>
  );
};

export default SellerProductsPage;
