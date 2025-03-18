import React, { useState, useEffect } from 'react';
import { Label, TextInput, Checkbox, Button } from 'flowbite-react';
import validator from "validator";
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Toast from "./Toast"; 
import Cookies from 'js-cookie';
import { BASE_URL } from '../config';

const StudentSignup = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const [toast, setToast] = useState(null); 

  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    collegeId: '',
    studentPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState({
    studentName: '',
    studentEmail: '',
    collegeId: '',
    studentPassword: ''
  });

  const [touched, setTouched] = useState({
    studentName: false,
    studentEmail: false,
    collegeId: false,
    studentPassword: false
  });

  const isFormComplete = () => {
    return (
      formData.studentName !== '' &&
      formData.studentEmail !== '' &&
      formData.collegeId !== '' &&
      formData.studentPassword !== '' &&
      formData.terms &&
      !errors.studentName &&
      !errors.studentEmail &&
      !errors.collegeId &&
      !errors.studentPassword
    );
  };

  useEffect(() => {
    // You can add any initializations here if needed
  }, [navigate]);  

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/students/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: formData.studentName,
          studentEmail: formData.studentEmail,
          collegeId: formData.collegeId,
          studentPassword: formData.studentPassword,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text(); 
        let errorMessage = 'Registration failed';
        // Additional error text processing can be done here if necessary
        setToast({
          type: "error",
          title: "Error",
          message: errorMessage,
        });
        return;
      }

      const responseJson = await res.json();

      // Set cookies for student session if needed
      Cookies.set("studentName", formData.studentName, { path: '/' });
      Cookies.set("role", "Student", { path: '/' });
      Cookies.set("authToken", responseJson.token, { path: '/' });
      Cookies.set("expiresIn", Date.now() + 2 * 60 * 60 * 1000, { path: '/' }); // 2 hours expiry

      setToast({
        type: "success",
        title: "Signing you in...",
        message: "Redirecting to your student dashboard.",
      });

      setTimeout(() => {
        window.location.href = `/students/dashboard`;
      }, 3000);
    } catch (error) {
      setToast({
        type: "error",
        title: "Error",
        message: error.message || "Registration failed",
      });
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
        case 'studentName':
          if (!/^[A-Za-z\s]+$/.test(value)) {
            errorMessage = 'Please enter a valid name';
          }
          break;
        case 'studentEmail':
          if (!validator.isEmail(value)) {
            errorMessage = 'Please enter a valid email address';
          }
          break;
        case 'collegeId':
          if (!value.trim()) {
            errorMessage = 'College ID is required';
          }
          break;
        case 'studentPassword':
          if (value.length < 6) {
            errorMessage = 'Password must be at least 6 characters';
          }
          break;
        default:
          break;
      }
    }
    
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    return errorMessage;
  };

  return (
    <div className="min-h-screen bg-white flex">
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      
      <div className="w-[534px] flex flex-col md:w-1/2 p-4 sm:p-8 justify-center items-center ml-12 mr-8">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">SK</span>
            </div>
            <span className="text-xl font-bold text-[#19181f]">Campus Kart</span>
          </div>

          {/* Form Title */}
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl font-bold text-[#100f14]">Student Sign Up</h1>
            <p className="text-base text-[#49475a]">
              Fill in your details to create an account.
            </p>
          </div>

          {/* Form Content */}
          <form className="w-full flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
            <div className="inline-flex flex-col justify-start items-start gap-2 h-[77px]">
              <label htmlFor="studentName" className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]">Full Name</label>
              <input
                id="studentName"
                name="studentName"
                type="text"
                placeholder="John Doe"
                required
                onBlur={() => handleBlur('studentName')}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, studentName: e.target.value }));
                  validateField('studentName', e.target.value);
                }}
                value={formData.studentName}
                className="w-full bg-transparent border-none rounded-lg outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
              />
              {errors.studentName && <p className="text-xs text-red-500 mt-0">{errors.studentName}</p>}
            </div>

            <div className="mt-3 h-[77px] flex-col justify-start items-start gap-2 inline-flex">
              <label htmlFor="studentEmail" className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]">Email Address</label>
              <input
                id="studentEmail"
                name="studentEmail"
                type="email"
                placeholder="student@example.com"
                required
                onBlur={() => handleBlur('studentEmail')}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, studentEmail: e.target.value }));
                  validateField('studentEmail', e.target.value);
                }}
                value={formData.studentEmail}
                className="w-full bg-transparent rounded-lg border-none outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
              />
              {errors.studentEmail && <p className="mt-0 text-xs text-red-500">{errors.studentEmail}</p>}
            </div>

            <div className="mt-3 h-[77px] flex-col justify-start items-start gap-2 inline-flex">
              <label htmlFor="collegeId" className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]">College ID</label>
              <input
                id="collegeId"
                name="collegeId"
                type="text"
                placeholder="Enter your College ID"
                required
                onBlur={() => handleBlur('collegeId')}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, collegeId: e.target.value }));
                  validateField('collegeId', e.target.value);
                }}
                value={formData.collegeId}
                className="w-full rounded-lg bg-transparent border-none outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
              />
              {errors.collegeId && <p className="mt-1 text-xs text-red-500">{errors.collegeId}</p>}
            </div>

            <div className="inline-flex flex-col justify-start items-start gap-2 h-[77px]">
              <label htmlFor="studentPassword" className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]">Password</label>
              <input
                id="studentPassword"
                name="studentPassword"
                type="password"
                placeholder="********"
                required
                onBlur={() => handleBlur('studentPassword')}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, studentPassword: e.target.value }));
                  validateField('studentPassword', e.target.value);
                }}
                value={formData.studentPassword}
                className="w-full bg-transparent border-none rounded-lg outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
              />
              {errors.studentPassword && <p className="mt-0 text-xs text-red-500">{errors.studentPassword}</p>}
            </div>

            <div className="flex items-center gap-3">
              <input 
                id="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))}
                className="h-5 w-5"
              />
              <label htmlFor="terms" className="text-xs text-gray-600">
                I agree to the <a href="/terms-conditions" className="underline text-purple-600">Terms & Conditions</a> and <a href="/privacy-policy" className="underline text-purple-600">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormComplete() || loading}
              className={`w-full py-3 rounded-lg text-white text-base font-medium ${isFormComplete() && !loading ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600/50 cursor-not-allowed'}`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
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

export default StudentSignup;
