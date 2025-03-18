import { Button } from 'flowbite-react';
import axios from 'axios';
import Toast from './Toast';
import { Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import { BASE_URL } from '../../config';

const AddProductSidebar = ({ formData, setFormData, products, setProducts, isAddProductOpen, setIsAddProductOpen }) => {
  const [toast, setToast] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async () => {
    if (!imageFile) {
      setToast({ type: "error", title: "Error", message: "Please select an image to upload." });
      return null;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadRes = await axios.post(`${BASE_URL}/upload`, formData, {
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const imageUrl = await handleImageUpload();
    if (!imageUrl) return;

    try {
      const token = sessionStorage.getItem("authToken");
      const res = await axios.post(
        `${BASE_URL}/seller/products`,
        { name: formData.name, description: formData.description, price: formData.price, imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts([...products, res.data.product]);
      setToast({ type: "success", title: "Success", message: "Product added successfully" });
      setFormData({ name: "", description: "", price: "", imageUrl: "" });
      setImageFile(null);
      setTimeout(() => {
        setIsAddProductOpen(false);
      }, 2000);
    } catch (error) {
      setToast({ type: "error", title: "Error", message: "Failed to add product. Try again later." });
    }
  };

  return (
    <div
      className={`z-50 fixed inset-y-0 right-0 w-[529px] h-[875px] p-[30px] bg-white rounded-tl-[12px] rounded-bl-[12px] shadow-[0px_6px_58px_0px_rgba(121,145,173,0.20)] transform transition-transform duration-300 ease-in-out ${isAddProductOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}

      <div className="w-[464px] ml-[5px]">
        <div className="flex justify-end w-[464px]">
          <button
            onClick={() => setIsAddProductOpen(false)}
            className="w-[32px] h-[32px] bg-white rounded-[7px] border border-[#ededed] flex justify-center items-center"
          >
            <div className="w-[17.455px] h-[17.455px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M0.272461 4.27246C0.272461 2.06332 2.06332 0.272461 4.27246 0.272461H13.727C15.9362 0.272461 17.727 2.06332 17.727 4.27246V13.727C17.727 15.9362 15.9362 17.727 13.727 17.727H4.27246C2.06332 17.727 0.272461 15.9362 0.272461 13.727V4.27246Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M14.8705 3.37904C14.5379 3.06426 14.0175 3.06369 13.6842 3.37775L9.36387 7.44902L5.04356 3.37778C4.71029 3.06372 4.18986 3.06429 3.85727 3.37907C3.49667 3.72037 3.4973 4.29467 3.85864 4.63519L8.10424 8.63603L3.85833 12.6372C3.49698 12.9777 3.49636 13.552 3.85696 13.8933C4.18955 14.2081 4.70998 14.2086 5.04325 13.8946L9.36387 9.82304L13.6845 13.8946C14.0178 14.2087 14.5382 14.2081 14.8708 13.8933C15.2314 13.552 15.2308 12.9777 14.8694 12.6372L10.6235 8.63603L14.8691 4.63516C15.2305 4.29464 15.2311 3.72034 14.8705 3.37904Z" fill="#0A1629"/>
              </svg>
            </div>
          </button>
        </div>

        <div className="flex justify-center flex-col align-middle gap-[5px] mt-[16px]">
          <div className="flex justify-between items-center">
            <h2 className="text-[#101010] font-inter font-semibold text-[25px] not-italic leading-normal">
              Add Product
            </h2>
          </div>
        </div>
        
        <form className="space-y-[20px] flex flex-col align-bottom mt-[19px]" onSubmit={handleAddProduct}>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Product Name"
              required
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

          <div>
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

          <div className="flex gap-3 justify-end mt-6">
            <button type="button" onClick={() => setIsAddProductOpen(false)} className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg">Cancel</button>
            <button type="submit" disabled={isUploading} className={`px-4 py-2 bg-purple-600 text-white rounded-lg ${isUploading ? 'opacity-50' : ''}`}>
              {isUploading ? "Uploading..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductSidebar;
