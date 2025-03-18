import { Button } from 'flowbite-react';
import axios from 'axios';
import Toast from './Toast';
import { useState } from "react";
import { BASE_URL } from '../../../config';

const AddFieldSidebar = ({ modules, isAddFieldOpen, setIsAddFieldOpen }) => {
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    fieldName: "",
    module: "",       // This will store the module key
    fieldType: "",    // This will store the selected field type
    mandatory: false, // Checkbox for mandatory field
    possibleValues: [""],
  });

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.possibleValues];
    updatedOptions[index] = value;
    setFormData((prev) => ({ ...prev, possibleValues: updatedOptions }));
  };

  const addOption = () => {
    setFormData((prev) => ({ ...prev, possibleValues: [...prev.possibleValues, ""] }));
  };

  const removeOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      possibleValues: prev.possibleValues.filter((_, i) => i !== index),
    }));
  };

  const handleAddField = async (e) => {
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

    // Validate required fields
    if (!formData.fieldName || !formData.module || !formData.fieldType) {
      setToast({
        type: "error",
        title: "Missing Fields",
        message: "Please fill in all required fields.",
      });
      return;
    }

    // Find the selected module using its key
    const moduleName = formData.module;
    const selectedModule = modules[moduleName];
    if (!selectedModule) {
      setToast({
        type: "error",
        title: "Invalid Module",
        message: "The selected module was not found.",
      });
      return;
    }

    // Determine a new numeric key for the field within the selected module.
    const fieldKeys = selectedModule.fields ? Object.keys(selectedModule.fields) : [];
    const newFieldId = fieldKeys.length > 0
      ? Math.max(...Object.values(selectedModule.fields).map(field => field.fieldId)) + 1 
      : 1;

    // Build the new field object.
    const newField = {
      fieldId: newFieldId,
      mandatory: formData.mandatory,
      deletable: true, // New fields assumed deletable.
      dataType: formData.fieldType,
      possibleValues: formData.possibleValues, 
    };

    // Create an updated module object by adding the new field.
    const updatedModule = {
      ...selectedModule,
      fields: {
        ...selectedModule.fields,
        [formData.fieldName]: newField,
      },
    };

    // Create an updated modules object with the selected module updated.
    const updatedModules = {
      ...modules,
      [moduleName]: updatedModule,
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
          title: "Field Added",
          message: "Field has been added successfully.",
        });
        // Clear form fields.
        setFormData({
          fieldName: "",
          module: "",
          fieldType: "",
          mandatory: false,
          possibleValues: [""]
        });
        // Close the sidebar after a short delay.
        setTimeout(() => {
          setIsAddFieldOpen(false);
          setToast(null);
        }, 1500);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding field:", error);
      setToast({
        type: "error",
        title: "Error",
        message: "Failed to add field. Please try again.",
      });
    }
  };

  // Options for field type dropdown.
  const fieldTypeOptions = [
    "Text",
    "Dropdown",
    "Number",
    "Boolean",
    "Date",
    "EmailId",
  ];

  return (
    <div
      className={`z-50 overflow-y-auto fixed inset-y-0 right-0 w-[529px] h-[875px] p-[30px] bg-white rounded-tl-[12px] rounded-bl-[12px] shadow-[0px_6px_58px_0px_rgba(121,145,173,0.20)] transform transition-transform duration-300 ease-in-out ${isAddFieldOpen ? 'translate-x-0' : 'translate-x-full'}`}
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
                setFormData({
                  fieldName: "",
                  module: "",
                  fieldType: "",
                  mandatory: false,
                  possibleValues: [""]
                });
                setIsAddFieldOpen(false);
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
              Add Field
            </h2>
          </div>

          <p className="text-[rgba(16,16,16,0.8)] font-inter text-sm font-normal leading-normal">
            Add field you want to track
          </p>
        </div>
        
        <form className="space-y-[20px] flex flex-col align-bottom mt-[19px]" onSubmit={handleAddField}>
          <div className="flex flex-col">
            <label htmlFor="fieldName" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Field Name
            </label>
            <input
              id="fieldName"
              name="fieldName"
              type="text"
              placeholder="Field Name"
              required
              maxLength="20"
              value={formData.fieldName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="mt-[9px] w-full h-11 pl-[15px] pr-[13px] py-5 rounded-lg border border-[#cac9d6] text-gray-700 
                        placeholder:text-[#686677] placeholder:font-inter placeholder:text-[15px] placeholder:font-normal placeholder:leading-[25px]"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="module" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Select Module
            </label>
            <select
              id="module"
              name="module"
              required
              value={formData.module}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="mt-[9px] w-full pl-[15px] pr-[13px] py-[10px] rounded-lg border border-[#cac9d6] text-gray-700"
            >
              <option value="">Select</option>
              {Object.entries(modules).map(([moduleName, moduleData]) => (
                <option key={moduleName} value={moduleName}>
                  {moduleName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="fieldType" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Field Type
            </label>
            <select
              id="fieldType"
              name="fieldType"
              required
              value={formData.fieldType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              className="mt-[9px] w-full pl-[15px] pr-[13px] py-[10px] rounded-lg border border-[#cac9d6] text-gray-700"
            >
              <option value="">Select</option>
              {fieldTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type == "Text" && "String"}
                  {type == "EmailId" && "TIQ User Email"}
                  {type == "Number" && "Number"}
                  {type == "Date" && "Date"}
                  {type == "Dropdown" && "Dropdown"}
                  {type == "Boolean" && "Boolean"}
                </option>
              ))}
            </select>
          </div>
          
          {formData.fieldType === "Dropdown" && (
          <div>
            <label className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">Option Value</label>
            {formData.possibleValues.map((option, index) => (
              <div key={index} className="flex items-center relative">
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="mt-[9px] w-full h-11 pl-[15px] pr-[40px] py-5 rounded-lg border border-[#cac9d6] text-gray-700 
                            placeholder:text-[#686677] placeholder:font-inter placeholder:text-[15px] placeholder:font-normal placeholder:leading-[25px]"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="absolute right-1 top-7 transform -translate-y-1/2 text-red-500"
                  >
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.625 12.125L22.1602 19.6438C22.0414 21.5648 21.9821 22.5253 21.5006 23.2159C21.2625 23.5573 20.956 23.8455 20.6005 24.062C19.8816 24.5 18.9192 24.5 16.9945 24.5C15.0673 24.5 14.1037 24.5 13.3843 24.0612C13.0286 23.8443 12.722 23.5556 12.484 23.2136C12.0027 22.5219 11.9446 21.5601 11.8285 19.6364L11.375 12.125" stroke="#101010" strokeLinecap="round"/>
                        <path d="M10.25 12.125H23.75M20.0418 12.125L19.5298 11.0688C19.1897 10.3672 19.0196 10.0164 18.7263 9.79761C18.6612 9.74908 18.5923 9.7059 18.5203 9.66852C18.1954 9.5 17.8056 9.5 17.0259 9.5C16.2266 9.5 15.827 9.5 15.4968 9.67559C15.4236 9.71451 15.3537 9.75943 15.288 9.80988C14.9912 10.0375 14.8255 10.4012 14.494 11.1284L14.0397 12.125" stroke="#101010" strokeLinecap="round"/>
                        <path d="M15.125 20.375V15.875" stroke="#101010" strokeLinecap="round"/>
                        <path d="M18.875 20.375V15.875" stroke="#101010" strokeLinecap="round"/>
                      </svg>
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOption} className="mt-2 text-purple-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#6938ef" fill="none">
                <path d="M12 8V16M16 12L8 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5" />
              </svg> 
              <div className="ml-1 justify-center text-[#6938ef] text-[15px] font-medium font-['Inter'] leading-[25px]">Add another value</div>
            </button>
          </div>
        )}
         
          <div className="flex items-center gap-2">
            <input
              id="mandatory"
              name="mandatory"
              type="checkbox"
              checked={formData.mandatory}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  mandatory: e.target.checked,
                }))
              }
              className="w-[19px] h-[19px] rounded-[3.6px]"
            />
            <label htmlFor="mandatory" className="text-center justify-center text-[#0f0f0f]/80 text-[12px] font-normal font-['Inter']">
              <div >This is a mandatory field</div>
            </label>
          </div>

          <div className="flex gap-2.5 justify-end mt-8">
            <button
              type="button"
              onClick={() => {
                  setIsAddFieldOpen(false);
                  setFormData({
                    fieldName: "",
                    module: "",
                    fieldType: "",
                    mandatory: false,
                    possibleValues: [""]
                  });
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
            >
              Add Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFieldSidebar;
