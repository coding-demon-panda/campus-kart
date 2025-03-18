// Signup.jsx
import { useContext, useState, useEffect } from 'react';
import { Label, TextInput, Checkbox, Button } from 'flowbite-react';
import validator from "validator";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Toast from "./Toast"; 
import Cookies from 'js-cookie';
import { BASE_URL } from '../config';

const Signup = () => {

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const [toast, setToast] = useState(null); 

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    terms: false,
  });

  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    company: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    mobile: false,
    company: false,
    password: false
  });

  const isFormComplete = () => {
    return (
      formData.name !== '' &&
      formData.email !== '' &&
      phone !== '' &&
      formData.company !== '' &&
      formData.password !== '' &&
      formData.terms &&
      !errors.name &&
      !errors.email &&
      !errors.mobile &&
      !errors.company
    );
  };

  useEffect(() => {
    const hostname = window.location.hostname; 
    const parts = hostname.split('.');
    
    if (hostname.includes("localhost")) {
      if (parts[0] !== "localhost") {
        navigate("/login");
      }
    } else {
      if (parts.length > 3) {
        navigate("/login");
      }
    }
  }, [navigate]);  

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setLoading(true);

    try {
      const phoneNumber = phone.slice(2); 
      const countryCode = phone.slice(0, 2);

      const res = await fetch(`${BASE_URL}/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organisationName: formData.company,
          userName: formData.name,
          userEmailId: formData.email,
          userPhoneNumberCountryCode: countryCode,
          userPhoneNumber: phoneNumber,
          userPassword: formData.password
        }),
      });

      if (!res.ok) {
        const errorText = await res.text(); 
        let errorMessage = 'Registration failed';
        if (errorText === 'USER_ALREADY_EXISTS') {
          errorMessage = 'Mail id is already registered';
        } else if (errorText === 'ORGANISATION_ALREADY_EXISTS') {
          errorMessage = 'Shop name is already registered';
        }
        setToast({
          type: "error",
          title: "Error",
          message: errorMessage,
        });
        return;
      }

      const responseJson = await res.json();

      // Determine the domain for cookies
      const hostname = window.location.hostname;
      let domain = '.localhost';
      if (hostname !== 'localhost') {
        const parts = hostname.split('.');
        domain = parts.slice(-2).join('.');
      }

      // Set cookies
      Cookies.set("username", formData.name, { domain, path: '/' });
      Cookies.set("role", "Owner", { domain, path: '/' });
      Cookies.set("authToken", responseJson.token, { domain, path: '/' });
      Cookies.set("expiresIn", Date.now() + 120000000, { domain, path: '/' });
      Cookies.set("organisationUrl", responseJson.organisationUrl, { domain, path: '/' });

      setToast({
        type: "success",
        title: "Signing you in...",
        message: "Redirecting to your shop's dashboard.",
      });

      setTimeout(() => {
        window.location.href = `${responseJson.organisationUrl}/dashboard`;
      }, 3000);
    } catch (error) {
      setToast({
        type: "error",
        title: "Error",
        message: error.message || "Registration failed",
      });
      return;
    } finally {
      setLoading(false);
    }
  };

  const validateField = (field, value) => {
    let errorMessage = '';
    
    if (!value && touched[field]) {
      errorMessage = '';
    } else {
      switch (field) {
        case 'name':
          if (!/^[A-Za-z\s]+$/.test(value)) {
            errorMessage = 'Please enter a valid name';
          }
          break;
        case 'username': 
          errorMessage = 'Username cannot be empty';
          break;
        case 'email':
          if (!validator.isEmail(value)) {
            errorMessage = 'Please enter a valid email address';
          }
          break;
        case 'mobile':
          if (value && !validator.isMobilePhone(value, 'en-IN')) {
            errorMessage = 'Please enter a valid mobile number';
          }
          break;
        case 'company':
          if (!/^[a-z-]+$/.test(value)) {
            // errorMessage = 'Company name can only contain lowercase letters and hyphens';
          }
          break;
      }
    }
    
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    return errorMessage;
  };

  return (
    <div className="min-h-screen bg-white flex">
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      {/* Left Side - Form */}
      <div className="w-[534px] gap-[42px] flex flex-col md:w-1/2 p-4 sm:p-8 lg: justify-center items-center ml-12 mr-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-purple-600 rounded-t-full relative">
              <div className="absolute top-1/4 left-2.5 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute left-2 top-6 w-4 h-2 bg-pink-500 rounded-t-full"></div>
              <div className="absolute left-2 top-8 w-4 h-2 bg-yellow-400 rounded-b-lg"></div>
            </div>
            <span className="text-xl font-[600] text-[20px] font-inter text-[#19181f]">Campus Kart</span>
          </div>

          {/* Form Content */}
          <div className="max-w-md">
            <div className="flex flex-col gap-[20px]">
              <h1 className="text-[32px] text-[#100f14] mt-4 leading-[41px] font-semibold font-inter">
                Create an Account
              </h1>
              <p className="mb-6 text-[16px] leading-[25px] tracking-[0.08px] text-[#49475a] font-normal font-inter">
                {/* Fill in your details to create an account */}
                Kindly fill in your details to create an account
              </p>
            </div>

            <form className="w-[534px] flex flex-col gap-[15px]" onSubmit={handleSubmit}>
              <div className="inline-flex flex-col justify-start items-start gap-2 h-[77px]">
                <label
                  htmlFor="name"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Username
                </label>
                <div className="self-stretch h-11 py-5 rounded-lg border border-[#cac9d6] inline-flex justify-between items-center">
                  <input
                    id="name"
                    type="text"
                    placeholder="John Snow"
                    required  
                    onBlur={() => handleBlur('name')}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, name: e.target.value }));
                      validateField('name', e.target.value);
                    }}
                    value={formData.name || ""}
                    className="w-full bg-transparent border-none rounded-lg outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
                  />
                </div>
                {errors.name && (
                  <p className="mt-0 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="mt-3 h-[77px] flex-col justify-start items-start gap-2 inline-flex">
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

              <div className="!mt-3 gap-2">
                <label
                  htmlFor="mobile"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Mobile Number
                </label>
                <div className="mt-2">
                <PhoneInput
                  country={'in'}
                  value={phone}
                  onChange={(phone) => {
                    setPhone(phone);
                    setFormData(prev => ({ ...prev, phone: phone }));
                    validateField('mobile', phone);
                  }}
                  inputStyle={{
                    width: '100%',
                    height: '44px',
                    // padding: '20px 15px',
                    borderColor: errors.mobile ? '#EF4444' : '#CACAD7',
                    borderRadius: '8px',
                    color: '#686677',
                    fontFamily: 'Inter',
                    fontSize: '15px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '25px'
                  }}
                  buttonStyle={{
                    borderColor: errors.mobile ? '#EF4444' : '#CACAD7',
                    borderRadius: '8px 0 0 8px',
                    backgroundColor: 'white'
                  }}
                  containerStyle={{
                    width: '100%'
                  }}
                  dropdownStyle={{
                    width: '300px',
                    maxHeight: '200px',
                    overflow: 'auto',
                    // borderRadius: '8px 8px 8px 8px'
                  }}
                />
                {errors.mobile && (
                  <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
                )}
                 </div>
              </div>
                    
              <div className="mt-3 h-[77px] flex-col justify-start items-start gap-2 inline-flex">
                <label
                  htmlFor="company"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Shop Name
                </label>
                <div className="self-stretch h-11 py-5 rounded-lg border border-[#cac9d6] justify-between items-center inline-flex">
                  <input
                    id="company"
                    type="text"
                    placeholder="Shop Name"
                    required
                    onBlur={() => handleBlur('company')}
                    onChange={(e) => {
                      const formattedValue = e.target.value
                        .toLowerCase()
                        .replace(/[\s\t]+/g, '-')
                        .replace(/[^a-z-]/g, '');
                      e.target.value = formattedValue;
                      setFormData((prev) => ({ ...prev, company: formattedValue }));
                      validateField('company', formattedValue);
                    }}
                    value={formData.company || ""}
                    className="w-full rounded-lg bg-transparent border-none outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
                  />
                </div>
                {errors.company && (
                  <p className="mt-1 text-xs text-red-500">{errors.company}</p>
                )}
              </div>
              
              <div className="inline-flex flex-col justify-start items-start gap-2 h-[77px]">
                <label
                  htmlFor="password"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Password
                </label>
                <div className="self-stretch h-11 py-5 rounded-lg border border-[#cac9d6] inline-flex justify-between items-center">
                  <input
                    id="password"
                    type="password"
                    placeholder="********"
                    required  
                    onBlur={() => handleBlur('password')}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, password: e.target.value }));
                      validateField('password', e.target.value);
                    }}
                    value={formData.password || ""}
                    className="w-full bg-transparent border-none rounded-lg outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
                  />
                </div>
                {errors.password && (
                  <p className="mt-0 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="h-[25px] justify-start items-center gap-3 inline-flex">
                <label htmlFor="terms" className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    {/* Hidden native checkbox for functionality */}
                    <input 
                      id="terms" 
                      type="checkbox" 
                      checked={formData.terms || false} 
                      onChange={(e) =>
                        setFormData(prev => ({ ...prev, terms: e.target.checked }))
                      }
                      className="absolute opacity-0 h-6 w-6"
                    />
                    {/* Custom checkbox UI */}
                    <div className="w-[29px] h-[30px]">
                      {formData.terms ? (
                        <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="2.51758" width="25" height="25" rx="5" fill="#6938EF"/>
                          <rect x="1" y="1.51758" width="27" height="27" rx="6" stroke="#6938EF" strokeOpacity="0.2" strokeWidth="2"/>
                          <path d="M7.20801 17.1011L10.8538 20.7469L21.7913 9.28857" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div className="w-[29px] h-[30px] border border-[#D1D5DB] rounded bg-white"></div>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[#9794aa] text-xs font-normal font-['Inter']">
                      I agree to the{" "}
                    </span>
                    <a href="/terms-conditions" className="text-[#6938ef] text-xs font-normal font-['Inter'] underline">
                      Terms & Conditions
                    </a>
                    <span className="text-[#9794aa] text-xs font-normal font-['Inter']">
                      {" "}and{" "}
                    </span>
                    <a href="/privacy-policy" className="text-[#6938ef] text-xs font-normal font-['Inter'] underline">
                      Privacy Policy
                    </a>
                  </div>
                </label>
              </div>

              {apiError && (
                <p className="text-red-500 text-sm text-center mb-4">{apiError}</p>
              )}

              <button
                type="submit"
                disabled={!isFormComplete() || loading}
                className={`w-[537px] h-11 px-[158px] py-2.5 rounded-lg flex flex-col justify-start items-start gap-2.5 overflow-hidden ${
                  isFormComplete() && !loading
                    ? 'bg-[#6938ef] hover:bg-[#6D28D9]'
                    : 'bg-[#6938ef]/50 cursor-not-allowed'
                }`}
              >
                <div className="self-stretch flex justify-center items-center gap-2">
                  <div className="text-center text-white text-base font-medium font-['Inter']">
                    {loading ? 'Creating Account...' : 'Create an account'}
                  </div>
                </div>
              </button>
            </form>
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

export default Signup;
