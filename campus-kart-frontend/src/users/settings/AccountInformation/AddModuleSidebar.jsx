import { Button } from 'flowbite-react';
import axios from 'axios';
import Toast from './Toast';
import { useState } from "react";
import { BASE_URL } from '../../../config';

const AddModuleSidebar = ({ modules, isAddModuleOpen, setIsAddModuleOpen }) => {
  const [toast, setToast] = useState(null);
  const [moduleNameError, setModuleNameError] = useState("");
  const [formData, setFormData] = useState({
    moduleName: "",
    description: "",
  });

  const handleAddModule = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      setToast({
        type: "error",
        title: "Authentication Error",
        message: "Auth token not found.",
      });
      return;
    }

    console.log("Hello Damn");
    // Check for duplicate module name (case-insensitive, trimmed)
    const duplicateModule = Object.keys(modules).find(
      (moduleName) =>
        moduleName.toLowerCase() === formData.moduleName.trim().toLowerCase()
    );
    if (duplicateModule) {
      setModuleNameError("A module with this name already exists. Please choose another name.");
      return;
    }

    // Clear any previous error if name is valid.
    setModuleNameError("");

    // Determine a new numeric key for the module.
    const newModuleId =
      Object.keys(modules).length > 0
        ? Math.max(...Object.values(modules).map((module) => module.moduleId)) + 1
        : 1;

    // Build the new module object in the expected format.
    const newModule = {
      moduleId: newModuleId,
      deletable: true, // New modules are assumed to be deletable.
      fields: {},      // Initially, there are no fields.
    };

    // Merge the new module into the existing modules object using the new key.
    const updatedModules = {
      ...modules,
      [formData.moduleName]: newModule,
    };

    try {
      const response = await axios.patch(
        `${BASE_URL}/module`,
        updatedModules,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (response.status === 200) {
        setToast({
          type: "success",
          title: "Module Added",
          message: "Module has been added successfully.",
        });
        // Clear form fields.
        setFormData({ moduleName: "", description: "" });
        // Close the sidebar after a short delay so the user can see the toast.
        setTimeout(() => {
          setIsAddModuleOpen(false);
          setToast(null);
        }, 1500);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding module:", error);
      setToast({
        type: "error",
        title: "Error",
        message: "Failed to add module. Please try again.",
      });
    }
  };

  return (
    <div
      className={`z-50 fixed inset-y-0 right-0 w-[529px] h-[875px] p-[30px] bg-white rounded-tl-[12px] rounded-bl-[12px] shadow-[0px_6px_58px_0px_rgba(121,145,173,0.20)] transform transition-transform duration-300 ease-in-out ${isAddModuleOpen ? 'translate-x-0' : 'translate-x-full'}`}
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
                setFormData({ moduleName: "", description: "" });
                setIsAddModuleOpen(false);
              }
            }
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
              Add Module
            </h2>
          </div>

          <p className="text-[rgba(16,16,16,0.8)] font-inter text-sm font-normal leading-normal">
            Create new module and organise similar data together
          </p>
        </div>
        
        <form className="space-y-[20px] flex flex-col align-bottom mt-[19px]" onSubmit={handleAddModule}>
          <div className="flex flex-col">
            <label htmlFor="moduleName" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Module Name*
            </label>
            <input
              id="moduleName"
              name="moduleName"
              type="text"
              placeholder="Module Name"
              required
              value={formData.moduleName}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
                if (moduleNameError) {
                  setModuleNameError("");
                }
              }}
              className="mt-[9px] w-full h-11 pl-[15px] pr-[13px] py-5 rounded-lg border border-[#cac9d6] text-gray-700 
                        placeholder:text-[#686677] placeholder:font-inter placeholder:text-[15px] placeholder:font-normal placeholder:leading-[25px]"
            />
            {moduleNameError && (
              <p className="mt-1 text-xs text-red-500">{moduleNameError}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="mt-[9px] w-full h-32 pl-[15px] pr-[13px] py-5 rounded-lg border border-[#cac9d6] text-gray-700 
                        placeholder:text-[#686677] placeholder:font-inter placeholder:text-[15px] placeholder:font-normal placeholder:leading-[25px]"
            ></textarea>
          </div>

          <div className="flex gap-2.5 justify-end mt-8">
            <button
              type="button"
              onClick={() => {
                  setFormData({ moduleName: "", description: "" });
                  setIsAddModuleOpen(false);
                }
              }
              className="h-[42px] px-[20px] py-[10px] flex justify-center items-center rounded-[6px] border border-[#6938ef] 
                        text-[#6938ef] text-[12px] font-inter font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[42px] px-[20px] py-[10px] bg-[#6938ef] rounded-[6px] text-white text-[12px] font-inter font-light"
              onClick={() => {
                handleAddModule(e); 
              }}
            >
              Add Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModuleSidebar;
