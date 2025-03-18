import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from './Toast';
import { Upload, Loader2 } from "lucide-react";
import { BASE_URL } from '../../config';

const EditProductSidebar = ({ 
  formData, 
  setFormData, 
  products, 
  setProducts, 
  isEditProductOpen, 
  setIsEditProductOpen, 
  selectedProduct, 
  setSelectedProduct 
}) => {
  const [toast, setToast] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        imageUrl: selectedProduct.imageUrl,
      });
      setImageFile(null); // reset imageFile so user can choose a new one if needed
    }
  }, [selectedProduct, setFormData]);

  const handleImageUpload = async () => {
    // If no new image is selected, use the existing URL
    if (!imageFile) {
      return formData.imageUrl;
    }
    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("image", imageFile);
      const uploadRes = await axios.post(`${BASE_URL}/upload`, uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsUploading(false);
      return uploadRes.data.imageUrl;
    } catch (error) {
      setIsUploading(false);
      setToast({ type: "error", title: "Error", message: "Failed to upload image. Try again." });
      return null;
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    const imageUrl = await handleImageUpload();
    if (imageUrl === null) return;
    try {
      const token = sessionStorage.getItem("authToken");
      const response = await axios.put(
        `${BASE_URL}/seller/products/${selectedProduct._id}`,
        {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          imageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update products state with updated product
      const updatedProduct = response.data.product;
      setProducts(
        products.map((p) =>
          p._id === updatedProduct._id ? updatedProduct : p
        )
      );
      setToast({ type: "success", title: "Success", message: "Product updated successfully" });
      // Close sidebar and reset state
      setTimeout(() => {
        setIsEditProductOpen(false);
      }, 2000);
      setSelectedProduct(null);
      setFormData({ name: '', description: '', price: '', imageUrl: '' });
      setImageFile(null);
    } catch (error) {
      console.error("Error editing product:", error);
      setToast({ type: "error", title: "Error", message: "Failed to update product. Please try again later." });
    }
  };

  return (
    <div
      className={`z-50 fixed inset-y-0 right-0 w-[529px] h-[875px] p-[30px] bg-white rounded-tl-[12px] rounded-bl-[12px] shadow-lg transform transition-transform duration-300 ease-in-out ${
        isEditProductOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <div className="w-[464px] ml-[5px]">
        <div className="flex justify-end w-[464px]">
          <button
            onClick={() => {
              setIsEditProductOpen(false);
              setSelectedProduct(null);
              setFormData({ name: '', description: '', price: '', imageUrl: '' });
              setImageFile(null);
            }}
            className="w-[32px] h-[32px] bg-white rounded-[7px] border border-[#ededed] flex justify-center items-center"
          >
            <div className="w-[17.455px] h-[17.455px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  d="M0.272461 4.27246C0.272461 2.06332 2.06332 0.272461 4.27246 0.272461H13.727C15.9362 0.272461 17.727 2.06332 17.727 4.27246V13.727C17.727 15.9362 15.9362 17.727 13.727 17.727H4.27246C2.06332 17.727 0.272461 15.9362 0.272461 13.727V4.27246Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.8705 3.37904C14.5379 3.06426 14.0175 3.06369 13.6842 3.37775L9.36387 7.44902L5.04356 3.37778C4.71029 3.06372 4.18986 3.06429 3.85727 3.37907C3.49667 3.72037 3.4973 4.29467 3.85864 4.63519L8.10424 8.63603L3.85833 12.6372C3.49698 12.9777 3.49636 13.552 3.85696 13.8933C4.18955 14.2081 4.70998 14.2086 5.04325 13.8946L9.36387 9.82304L13.6845 13.8946C14.0178 14.2087 14.5382 14.2081 14.8708 13.8933C15.2314 13.552 15.2308 12.9777 14.8694 12.6372L10.6235 8.63603L14.8691 4.63516C15.2305 4.29464 15.2311 3.72034 14.8705 3.37904Z"
                  fill="#0A1629"
                />
              </svg>
            </div>
          </button>
        </div>

        <div className="flex justify-center flex-col items-center gap-[5px] mt-[16px]">
          <div className="flex justify-between items-center">
            <h2 className="text-[#101010] font-inter font-semibold text-[25px] not-italic leading-normal">
              Edit Product
            </h2>
          </div>
        </div>

        <form className="space-y-[20px] flex flex-col mt-[19px]" onSubmit={handleEditProduct}>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Product Name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="mt-[9px] w-full h-11 pl-[15px] pr-[13px] py-5 rounded-lg border border-[#cac9d6] text-gray-700 placeholder:text-[#686677] placeholder:font-inter placeholder:text-[15px] placeholder:font-normal placeholder:leading-[25px]"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="Product description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-[9px] w-full h-11 pl-[15px] pr-[13px] py-5 rounded-lg border border-[#cac9d6] text-gray-700 placeholder:text-[#686677] placeholder:font-inter placeholder:text-[15px] placeholder:font-normal placeholder:leading-[25px]"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="price" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              placeholder="e.g. 99.99"
              required
              value={formData.price || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: e.target.value,
                }))
              }
              className="mt-[9px] w-full h-11 pl-[15px] pr-[13px] py-5 rounded-lg border border-[#cac9d6] text-gray-700 placeholder:text-[#686677] placeholder:font-inter placeholder:text-[15px] placeholder:font-normal placeholder:leading-[25px]"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="text-[#9794aa] text-[15px] font-inter font-medium">Upload Image</label>
            <div className="relative mt-2 w-full border rounded-lg p-5 flex items-center justify-center gap-2 cursor-pointer border-[#cac9d6]">
              <Upload className="text-gray-500" />
              <span className="text-gray-700">{imageFile ? imageFile.name : "Choose a file"}</span>
              {isUploading && <Loader2 className="animate-spin text-gray-500 ml-2" />}
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsEditProductOpen(false);                
                setFormData({ name: '', description: '', price: '', imageUrl: '' });
                setSelectedProduct(null);
                setImageFile(null);
              }}
              className="h-[42px] px-[20px] py-[10px] flex justify-center items-center rounded-[6px] border border-[#6938ef] text-[#6938ef] text-[12px] font-inter font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[42px] px-[20px] py-[10px] bg-[#6938ef] rounded-[6px] text-white text-[12px] font-inter font-light"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductSidebar;
