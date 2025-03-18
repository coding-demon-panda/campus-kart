// ForgotPassword.jsx
import { useState, useEffect } from 'react';
import { Label, TextInput, Button } from 'flowbite-react';
import validator from "validator";
import 'react-phone-input-2/lib/style.css';
import { Link, useNavigate } from 'react-router-dom';
import Toast from "./Toast"; 
import { BASE_URL } from '../config';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({ email: '' });
  const [touched, setTouched] = useState({ email: false });
  const [organisationCname, setOrganisationCname] = useState("");
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const isFormComplete = () => {
    return formData.email !== '' && !errors.email;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateField = (field, value) => {
    let errorMessage = '';
    if (!value && touched[field]) {
      errorMessage = '';
    } else {
      if (field === 'email' && !validator.isEmail(value)) {
        errorMessage = 'Please enter a valid email address';
      }
    }
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    return errorMessage;
  };

  useEffect(() => {
    const hostname = window.location.hostname; 
    const parts = hostname.split('.');
    
    if (hostname.includes("localhost") && hostname !== "localhost") {
      setOrganisationCname(parts[0]);
      sessionStorage.setItem('organisationCname', parts[0]);
    } else if (parts.length >= 4 && parts[1] === 'campus-kart-frontend' && parts[2] === 'vercel') {
      setOrganisationCname(parts[0]);
      sessionStorage.setItem('organisationCname', parts[0]);
    } else {
      navigate('/signup');
    }
  }, []);  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: formData.email, organisationCname })
      });
  
      if (!response.ok) {
        setToast({
          type: "error",
          title: "Error",
          message: "Some Error Occured",
        });
      }

      setToast({
        type: "success",
        title: "Success",
        message: "We have sent you the instruction to set your password on your email..",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error("Error during password submission:", error);
      setToast({
        type: "error",
        title: "Error",
        message: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      {/* Left Side - Form */}
      <div className="w-[534px] gap-[42px] flex flex-col md:w-1/2 p-4 sm:p-8 lg: justify-center items-center ml-12 mr-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-purple-600 rounded-t-full relative">
              <div className="absolute top-3 left-3.5 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute left-2.5 top-7 w-5 h-3 bg-pink-500 rounded-t-full"></div>
              <div className="absolute left-2.5 top-10 w-5 h-3 bg-yellow-400 rounded-b-full"></div>
            </div>
            <span className="text-xl font-[600] text-[20px] font-inter text-[#19181f]">Triumph IQ</span>
          </div>

          {/* Form Content */}
          <div className="max-w-md">
            <div className="flex flex-col gap-[5px]">
              <h1 className="text-[40px] text-[#100f14] mt-4 leading-[41px] font-semibold font-inter">
              Forgot Password
              </h1>
              <p className="w-full mb-6 text-[16px] leading-[25px] tracking-[0.08px] text-[#49475a] font-normal font-inter">
                No worries! We will send you instructions to reset your password.
              </p>
            </div>

            <form className="w-[534px] flex flex-col gap-[15px]" onSubmit={handleSubmit}>
              <div className="inline-flex flex-col justify-start items-start gap-2 h-[77px]">
              <label
                  htmlFor="email"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Email Address
                </label>
                <div className="self-stretch h-11 py-5 rounded-lg border border-[#cac9d6] justify-between items-center inline-flex">
                  <input
                    id="email"
                    type="email"
                    placeholder="john@shop.com"
                    required
                    onBlur={() => handleBlur('email')}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      validateField('email', e.target.value);
                    }}
                    value={formData.email || ""}
                    className="w-full bg-transparent rounded-lg border-none outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
                  />
                </div>
                {errors.email && (
                  <p className="mt-0 text-xs text-red-500">{errors.email}</p>
                )}
              </div>            

              <Button
                type="submit"
                className={`w-[537px] h-[39px] px-[158px] py-2.5 mt-4 rounded-lg flex items-center justify-center text-center text-white text-base font-medium font-['Inter'] ${
                  isFormComplete()
                    ? 'bg-[#6938ef] hover:bg-[#6D28D9]'
                    : 'bg-[#6938ef]/50 cursor-not-allowed'
                }`}
                disabled={!isFormComplete()}
              >
                Continue
              </Button>
            </form>
        
            {/* Back Button */}
            <div className="mt-3 w-[534px] h-[25px] px-[232px] flex justify-between items-center">
              <Link to="/login" className="flex items-center gap-2 text-[#494759] text-base font-normal font-['Inter'] leading-[25px] tracking-tight hover:text-gray-800">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M3.99976 12.5072H19.9997" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.99973 17.5074C8.99973 17.5074 3.99978 13.825 3.99976 12.5074C3.99975 11.1898 8.99976 7.50745 8.99976 7.50745" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Back</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden md:block w-1/2  pl-[64px] pt-[80px] pb-[64px] pr-[80px] relative rounded-l-[70px]">
        <div className="w-full">
          <img 
            src="/iitbbs.jpg" 
            alt="Container illustration"
            className="w-full"
          />
        </div>
      </div> 
    </div>
  );
};

export default ForgotPassword;
