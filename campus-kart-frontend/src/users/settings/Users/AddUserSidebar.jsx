import { Button } from 'flowbite-react';
import axios from 'axios';
import Toast from './Toast';
import { useState } from "react";
import { BASE_URL } from '../../../config';

const AddUserSidebar = ({ formData, setFormData, users, setUsers, isAddUserOpen, setIsAddUserOpen }) => {
  const [toast, setToast] = useState(null);

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Check if user with this email already exists in local state (optional)
    const emailExists = users.some(user => user.email === formData.email);
    if (emailExists) {
      setToast({
        type: "error",
        title: "Email already registered",
        message: "User with this email already exists!",
      });
      return;
    }

    // Get token and organisation name from sessionStorage
    const token = sessionStorage.getItem("authToken");

    // Generate a random 10-digit mobile number
    const phoneNumber = Math.floor(Math.random() * 9000000000 + 1000000000).toString();

    try {
      const response = await axios.post(
        `${BASE_URL}/users`,
        {
          emailId: formData.email,
          username: formData.name,
          role: formData.role,
          mobilePhoneNumber: phoneNumber,
          mobileCountryCode: "91",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      // Response returns the new user data. Map it to your local format.
      const newUser = {
        id: users.length + 1,  // Alternatively, you could use a value from the response if available
        name: response.data.username, // Using username as name/email
        email: response.data.userEmailId,
        role: response.data.role
      };

      // Update the users state with the newly added user
      setUsers([...users, newUser]);

      // Reset the form data and close the sidebar
      setFormData({ name: '', email: '', role: '' });
      
      setToast({
        type: "success",
        title: "Information",
        message: "An activation link has been sent to the mail id.",
      });

      setTimeout(() => {
        setIsAddUserOpen(false);
        setToast(null);
      }, 1500);

      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error("Error adding user:", error);
      // alert("Error adding user, please try again.");
      setToast({
        type: "error",
        title: "Error",
        message: "Error adding user, please try again.",
      });
    }
  };

  return (
    <div
      className={`z-50 fixed inset-y-0 right-0 w-[529px] h-[875px] p-[30px] bg-white rounded-tl-[12px] rounded-bl-[12px] shadow-[0px_6px_58px_0px_rgba(121,145,173,0.20)] transform transition-transform duration-300 ease-in-out ${isAddUserOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}

      <div className="w-[464px] ml-[5px]">
        <div className="flex justify-end w-[464px]">
          <button
            onClick={() => setIsAddUserOpen(false)}
            className="w-[32px] h-[32px] bg-white rounded-[7px] border border-[#ededed] flex justify-center items-center"
          >
            <div className="w-[17.455px] h-[17.455px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M0.272461 4.27246C0.272461 2.06332 2.06332 0.272461 4.27246 0.272461H13.727C15.9362 0.272461 17.727 2.06332 17.727 4.27246V13.727C17.727 15.9362 15.9362 17.727 13.727 17.727H4.27246C2.06332 17.727 0.272461 15.9362 0.272461 13.727V4.27246Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.8705 3.37904C14.5379 3.06426 14.0175 3.06369 13.6842 3.37775L9.36387 7.44902L5.04356 3.37778C4.71029 3.06372 4.18986 3.06429 3.85727 3.37907C3.49667 3.72037 3.4973 4.29467 3.85864 4.63519L8.10424 8.63603L3.85833 12.6372C3.49698 12.9777 3.49636 13.552 3.85696 13.8933C4.18955 14.2081 4.70998 14.2086 5.04325 13.8946L9.36387 9.82304L13.6845 13.8946C14.0178 14.2087 14.5382 14.2081 14.8708 13.8933C15.2314 13.552 15.2308 12.9777 14.8694 12.6372L10.6235 8.63603L14.8691 4.63516C15.2305 4.29464 15.2311 3.72034 14.8705 3.37904Z" fill="#0A1629"/>
              </svg>
            </div>
          </button>
        </div>

        <div className="flex justify-center flex-col align-middle gap-[5px] mt-[16px]">
          <div className="flex justify-between items-center">
            <h2 className="text-[#101010] font-inter font-semibold text-[25px] not-italic leading-normal">
              Add User
            </h2>
          </div>

          <p className="text-[rgba(16,16,16,0.8)] font-inter text-sm font-normal leading-normal">
            An activation email will be sent to the newly added user
          </p>
        </div>
        
        <form className="space-y-[20px] flex flex-col align-bottom mt-[19px]" onSubmit={handleAddUser}>
          <div className="flex flex-col">
            <label htmlFor="name" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Snow"
              required
              value={formData.name || ""}
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

          <div>
            <label htmlFor="email" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="work@company.com"
              required
              value={formData.email || ""}
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

          <div>
            <label htmlFor="role" className="text-[#9794aa] text-[15px] font-inter font-medium leading-normal">
              Role
            </label>
            <div className="mt-[9px] w-full h-11 pl-[5px] pr-[13px] rounded-lg border border-[#cac9d6]">
              <select
                id="role"
                name="role"
                required
                value={formData.role || ""}
                onChange={(e) => {
                  console.log("Selected Role:", e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }));
                }}
                className="border-none w-full text-[#686677] font-inter text-[15px] font-normal leading-[25px] bg-white outline-none"
              >
                <option value="" className="text-[#686677] text-[15px] font-normal">
                  Select
                </option>
                <option value="Admin" className="text-[#686677] text-[15px] font-normal">
                  Admin
                </option>
                <option value="Member" className="text-[#686677] text-[15px] font-normal">
                  Member
                </option>
                <option value="Viewer" className="text-[#686677] text-[15px] font-normal">
                  Viewer
                </option>
              </select>
            </div>
          </div>

          <div className="flex gap-2.5 justify-end mt-8">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="h-[42px] px-[20px] py-[10px] flex justify-center items-center rounded-[6px] border border-[#6938ef] 
                        text-[#6938ef] text-[12px] font-inter font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[42px] px-[20px] py-[10px] bg-[#6938ef] rounded-[6px] text-white text-[12px] font-inter font-light"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserSidebar;
