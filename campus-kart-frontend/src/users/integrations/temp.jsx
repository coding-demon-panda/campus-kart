import { useState } from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import { Upload, Loader2 } from "lucide-react";
import Toast from "./Toast";
import { BASE_URL } from "../../config";

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
      setIsAddProductOpen(false);
    } catch (error) {
      setToast({ type: "error", title: "Error", message: "Failed to add product. Try again later." });
    }
  };

  return (
    <div className={`z-50 fixed inset-y-0 right-0 w-[529px] h-[875px] p-[30px] bg-white rounded-tl-[12px] rounded-bl-[12px] shadow-lg transform transition-transform duration-300 ease-in-out ${isAddProductOpen ? 'translate-x-0' : 'translate-x-full'}`}> 
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="w-[464px] ml-[5px]">
        <div className="flex justify-end">
          <button onClick={() => setIsAddProductOpen(false)} className="w-8 h-8 bg-white rounded border border-gray-300 flex justify-center items-center">✖</button>
        </div>

        <h2 className="text-black font-semibold text-2xl mt-4">Add Product</h2>
        
        <form className="space-y-5 mt-5" onSubmit={handleAddProduct}>
          <div className="flex flex-col">
            <label className="text-[#9794aa] text-[15px] font-inter font-medium">Name</label>
            <input type="text" name="name" placeholder="Product Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-2 p-2 border rounded-lg" />
          </div>

          <div>
            <label className="text-[#9794aa] text-[15px] font-inter font-medium">Description</label>
            <input type="text" name="description" placeholder="Product description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-2 p-2 border rounded-lg" />
          </div>

          <div>
            <label className="text-[#9794aa] text-[15px] font-inter font-medium">Price</label>
            <input type="number" name="price" placeholder="99.99" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="mt-2 p-2 border rounded-lg" />
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