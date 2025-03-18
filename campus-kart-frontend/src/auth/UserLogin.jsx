import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import validator from "validator";
import { Link, useNavigate } from 'react-router-dom';
import Toast from "./Toast"; 
import axios from 'axios';
import { BASE_URL } from '../config';

const StudentLogin = () => {
  const [formData, setFormData] = useState({ studentEmail: '', studentPassword: '' });
  const [errors, setErrors] = useState({ studentEmail: '' });
  const [touched, setTouched] = useState({ studentEmail: false, studentPassword: false });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if URL contains email/password params for auto-login (optional)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const studentEmail = params.get('studentEmail');
    const studentPassword = params.get('studentPassword');

    if (studentEmail && studentPassword) {
      const login = async () => {
        try {
          const response = await axios.post(`${BASE_URL}/students/login`, {
            studentEmail,
            studentPassword,
          });
          const data = response.data;
          sessionStorage.setItem("studentName", data.studentName);
          sessionStorage.setItem("role", "Student");
          sessionStorage.setItem("authToken", data.token);
          sessionStorage.setItem("expiresIn", Date.now() + 2 * 60 * 60 * 1000);
          sessionStorage.setItem("studentEmail", studentEmail);
          navigate('/students/dashboard');
        } catch (error) {
          console.error("Login failed", error);
        }
      };
      login();
    }
  }, [navigate]);

  const isFormComplete = () => {
    return (
      formData.studentEmail !== '' &&
      formData.studentPassword !== '' &&
      !errors.studentEmail
    );
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateField = (field, value) => {
    let errorMessage = '';
    if (field === 'studentEmail' && !validator.isEmail(value)) {
      errorMessage = 'Please enter a valid email address';
    }
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    return errorMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/students/login`, {
        studentEmail: formData.studentEmail,
        studentPassword: formData.studentPassword,
      });
      const data = response.data;
      console.log("Login Response Data:", data);
      
      // Store student data in session storage
      sessionStorage.setItem("studentName", data.studentName);
      sessionStorage.setItem("role", "Student");
      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("expiresIn", Date.now() + 2 * 60 * 60 * 1000);
      sessionStorage.setItem("studentEmail", formData.studentEmail);

      setToast({
        type: "success",
        title: "Logging you in...",
        message: "Welcome back!",
      });
      
      setTimeout(() => {
        window.location.href = `/students/dashboard`;
      }, 3000);

    } catch (error) {
      setToast({
        type: "error",
        title: "Error",
        message: "Error Logging In!",
      });
      console.error("Login error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      {/* Left Side - Form */}
      <div className="w-[534px] gap-[42px] flex flex-col md:w-1/2 p-4 sm:p-8 lg:justify-center items-center ml-12 mr-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">SC</span>
            </div>
            <span className="text-xl font-bold text-[#19181f]">Campus Cart</span>
          </div>
          {/* Form Content */}
          <div className="max-w-md">
            <div className="flex flex-col gap-5">
              <h1 className="text-3xl font-bold text-[#100f14]">Student Login</h1>
              <p className="text-base text-[#49475a]">
                Login to access your student dashboard.
              </p>
            </div>
            <form className="w-[534px] flex flex-col gap-[15px] mt-5" onSubmit={handleSubmit}>
              <div className="mt-3 h-[77px] flex-col justify-start items-start gap-2 inline-flex">
                <label
                  htmlFor="studentEmail"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Email Address
                </label>
                <div className="self-stretch h-11 py-5 rounded-lg border border-[#cac9d6] justify-between items-center inline-flex">
                  <input
                    id="studentEmail"
                    type="email"
                    placeholder="student@example.com"
                    required
                    onBlur={() => handleBlur('studentEmail')}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, studentEmail: e.target.value }));
                      validateField('studentEmail', e.target.value);
                    }}
                    value={formData.studentEmail || ""}
                    className="w-full bg-transparent rounded-lg border-none outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
                  />
                </div>
                {errors.studentEmail && (
                  <p className="mt-0 text-xs text-red-500">{errors.studentEmail}</p>
                )}
              </div>
              <div className="mt-3 h-[77px] flex-col justify-start items-start gap-2 inline-flex">
                <label
                  htmlFor="studentPassword"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Password
                </label>
                <div className="self-stretch h-11 py-5 rounded-lg border border-[#cac9d6] justify-between items-center inline-flex">
                  <input
                    id="studentPassword"
                    type="password"
                    placeholder="********"
                    required
                    onBlur={() => handleBlur('studentPassword')}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, studentPassword: e.target.value }));
                    }}
                    value={formData.studentPassword || ""}
                    className="w-full bg-transparent rounded-lg border-none outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Link 
                  className="text-center text-[#6938ef] text-xs font-normal font-['Inter'] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                type="submit"
                className={`w-[537px] h-[39px] px-[158px] py-2.5 rounded-lg flex items-center justify-center text-center text-white text-base font-medium font-['Inter'] ${
                  isFormComplete() && !loading
                    ? 'bg-[#6938ef] hover:bg-[#6D28D9]'
                    : 'bg-[#6938ef]/50 cursor-not-allowed'
                }`}
                disabled={!isFormComplete()}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              <button 
                type="button"
                className="w-[534px] h-11 px-[15px] py-5 bg-white rounded-lg border border-[#cac9d6] flex justify-center items-center gap-2"
              >
                <div data-svg-wrapper className="relative">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.06 12.7676C23.06 11.9876 22.99 11.2376 22.86 10.5176H12.5V14.7726H18.42C18.165 16.1476 17.39 17.3126 16.225 18.0926V20.8526H19.78C21.86 18.9376 23.06 16.1176 23.06 12.7676Z" fill="#4285F4"/>
                    <path d="M12.5 23.5177C15.47 23.5177 17.96 22.5327 19.78 20.8527L16.225 18.0927C15.24 18.7527 13.98 19.1427 12.5 19.1427C9.63504 19.1427 7.21004 17.2077 6.34504 14.6077H2.67V17.4577C4.48 21.0527 8.2 23.5177 12.5 23.5177Z" fill="#34A853"/>
                    <path d="M6.345 14.6076C6.125 13.9476 6 13.2426 6 12.5176C6 11.7926 6.125 11.0876 6.345 10.4276V7.57764H2.67C1.9 9.11049 1.49932 10.8022 1.5 12.5176C1.5 14.2926 1.925 15.9726 2.67 17.4576L6.345 14.6076Z" fill="#FBBC05"/>
                    <path d="M12.5 5.89258C14.115 5.89258 15.565 6.44758 16.705 7.53758L19.86 4.38258C17.955 2.60758 15.465 1.51758 12.5 1.51758C8.2 1.51758 4.48 3.98258 2.67 7.57758L6.34504 10.4276C7.21004 7.82758 9.63504 5.89258 12.5 5.89258Z" fill="#EA4335"/>
                  </svg>
                </div>
                <span className="text-base text-gray-600">
                  Login with Google
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-1/2 pl-[64px] pt-[80px] pb-[64px] pr-[80px] relative rounded-l-[70px]">
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

export default StudentLogin;
