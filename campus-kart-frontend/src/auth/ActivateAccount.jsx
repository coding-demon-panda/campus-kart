// ActivateAccount.jsx
import { useState, useEffect } from 'react';
import { Label, TextInput, Button } from 'flowbite-react';
import validator from "validator";
import { Link, useNavigate } from 'react-router-dom';
import Toast from "./Toast"; 
import axios from 'axios';
import { BASE_URL } from '../config';

const ActivateAccount = () => {
  const navigate = useNavigate();
  
  const [emailVerificationToken, setEmailVerificationToken] = useState("");
  const [emailId, setEmailId] = useState("");
  const [organisationCname, setOrganisationCname] = useState("");
  const [toast, setToast] = useState(null);

  const getRedirectUrl = () => {
    return window.location.hostname.includes("localhost")
      ? `http://${organisationCname}.localhost:3000/login`
      : `http://${organisationCname}.dashboard.triumphiq.com/login`;
  };

  const [formData, setFormData] = useState({
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    company: false,
    password: false,
    confirmPassword: false
  });

  const isFormComplete = () => {
    return (
      formData.email !== '' &&
      formData.company !== '' &&
      formData.password !== '' &&
      formData.confirmPassword !== '' &&
      !errors.email &&
      !errors.company &&
      !errors.password &&
      !errors.confirmPassword
    );
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateField = (field, value) => {
    let errorMessage = '';
    if (!value && touched[field]) {
      errorMessage = '';
    } else {
      switch (field) {
        case 'email':
          if (!validator.isEmail(value)) {
            errorMessage = 'Please enter a valid email address';
          }
          break;
        case 'company':
          if (!/^[a-z-]+$/.test(value)) {
            // errorMessage = 'Company name can only contain lowercase letters and hyphens';
          }
          break;
        case 'confirmPassword':
          if (value !== formData.password) {
            errorMessage = 'Passwords do not match';
          }
          break;
        default:
          break;
      }
    }
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
    return errorMessage;
  };
  
  // useEffect(() => {
  //   if(sessionStorage.getItem("token") !== null){
  //     const tempUrl = `${sessionStorage.getItem("organisationUrl")}/settings`;
  //     setTimeout(() => {
  //       window.location.href = tempUrl;
  //     }, 1000);
  //     return;
  //   }
  // })
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const password = params.get('password');

    if (email && password) {
      const login = async () => {
        try {
          const response = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password,
            organisationCname: window.location.hostname.split('.')[0],
          });

          const data = response.data;

          sessionStorage.setItem("username", data.username);
          sessionStorage.setItem("role", data.role);
          sessionStorage.setItem("authToken", data.token);
          sessionStorage.setItem("expiresIn", Date.now() + 120000000);
          sessionStorage.setItem("organisationUrl", data.organisationUrl);
          sessionStorage.setItem("email", email);

          navigate('/settings');
        } catch (error) {
          console.error("Login failed", error);
        }
      };

      login();
    }
  }, [navigate]);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailCode = params.get("email-verification-code");
    const email = params.get("user-email");
    const orgcname = params.get("organisation-cname");

    setEmailVerificationToken(emailCode);
    setEmailId(email);
    setOrganisationCname(orgcname);

    setFormData(prev => ({ ...prev, email: email, company: orgcname }));
  }, []);

  useEffect(() => {
    const verifyMail = async () => {
      const params = new URLSearchParams(window.location.search);
      const emailCode = params.get("email-verification-code");
      const email = params.get("user-email");
      const orgcname = params.get("organisation-cname");
  
      if (!emailCode || !email) {
        console.error("Missing required parameters");
        setToast({
          type: "error",
          title: "Missing required parameters",
          message: "Please check your email for a valid verification link. Redirecting to Login...",
        });
        setTimeout(() => {
          window.location.href = getRedirectUrl();
        }, 3000);
        return;
      }
      if(!orgcname) {
        console.error("Missing required parameters");
        setToast({
          type: "error",
          title: "Missing required parameters",
          message: "Please check your email for a valid verification link. Redirecting to Login...",
        });
        setTimeout(() => {
          window.location.href = window.location.hostname.includes("localhost")
          ? `http://localhost:3000/signup`
          : `http://dashboard.triumphiq.com/signup`;
        }, 3000);
        return;
      }
  
      try {
        const response = await fetch(`${BASE_URL}/auth/verify-mail-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emailId: email,
            emailVerificationToken: emailCode,
            organisationCname: orgcname,
          }),
        });
  
        if (response.status === 400) {
          const responseData = await response.text();
          if (responseData === "MAIL_TOKEN_INVALID") {
            setToast({
              type: "error",
              title: "Mail Token Invalid",
              message: "Please check your email for valid login instructions.",
            });
          } else if (responseData === "USER_ALREADY_VERIFIED") {
            setToast({
              type: "info",
              title: "User Already Verified",
              message: "You can log in using your registered credentials.",
            });
            setTimeout(() => {
              window.location.href = getRedirectUrl();
            }, 2000);
            return;
          }
        }
  
        if (!response.ok) {
          throw new Error("Failed to verify email details");
        }
  
        setToast({
          type: "success",
          title: "Verification Successful",
          message: "You can now set your password.",
        });
      } catch (error) {
        console.error("Error:", error);
        setToast({
          type: "error",
          title: "Verification Failed",
          message: "An error occurred while verifying your email.",
        });
        setTimeout(() => {
          window.location.href = getRedirectUrl();
        }, 3000);
      }
    };
  
    verifyMail();
  }, []); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/submit-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailId,
          emailVerificationToken,
          organisationCname,
          password: formData.password,
        }),
      });
      
      if (response.status === 400) {
        setToast({
          type: "error",
          title: "User Already Verified",
          message: "You can log in using your credentials.",
        });
        setTimeout(() => {
          window.location.href = getRedirectUrl();
        }, 3000);
      }
      
      if (response.ok) {
        setToast({
          type: "success",
          title: "Account Activated",
          message: "Redirecting to dashboard...",
        });
        setTimeout(() => {
          window.location.href = window.location.hostname.includes("localhost")
            ? `http://${organisationCname}.localhost:3000/login?email=${formData.email}&password=${formData.password}`
            : `http://${organisationCname}.dashboard.triumphiq.com/login?email=${formData.email}&password=${formData.password}`;
        }, 3000);
      } else {
        console.error("Submit password failed", response);
        setToast({
          type: "error",
          title: "Activation Failed",
          message: "Please try again.",
        });
        return;
      }
    } catch (error) {
      console.error("Error during password submission:", error);
      setToast({
        type: "error",
        title: "Network Error",
        message: "Unable to connect to the server.",
      });
      return;
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
            <div className="w-8 h-8 bg-purple-600 rounded-t-full relative">
              <div className="absolute top-1/4 left-2.5 w-3 h-3 bg-white rounded-full"></div>
              <div className="absolute left-2 top-6 w-4 h-2 bg-pink-500 rounded-t-full"></div>
              <div className="absolute left-2 top-8 w-4 h-2 bg-yellow-400 rounded-b-lg"></div>
            </div>
            <span className="text-xl font-[600] text-[20px] font-inter text-[#19181f]">Triumph IQ</span>
          </div>

          {/* Form Content */}
          <div className="w-full">
            <div className="w-full flex flex-col gap-[5px]">
              <h1 className="text-[40px] text-[#100f14] mt-4 leading-[41px] font-semibold font-inter">
                Activate Your Account
              </h1>
              <p className="w-full mb-6 text-[16px] leading-[25px] tracking-[0.08px] text-[#49475a] font-normal font-inter">
                Set your password to get started with your Triumph IQ account
              </p>
            </div>

            <form className="w-[534px] flex flex-col gap-[15px]" onSubmit={handleSubmit}>
              <div className="inline-flex flex-col justify-start items-start gap-2 h-[77px]">                <label
                  htmlFor="email"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Email Address
                </label>
                <div className="w-full h-11 pr-[13px] py-5 opacity-50 bg-[#d3d3d3] rounded-lg border border-[#cac9d6] flex justify-between items-center">
                  <input
                    id="email"
                    type="email"
                    disabled
                    value={formData.email || "work@company.com"}
                    className="w-full bg-transparent text-[#676576] text-[15px] font-normal font-['Inter'] leading-[25px] border-none outline-none"
                  />
                  <span className="opacity-0 text-white text-[15px] font-normal font-['Inter'] leading-[25px]">.</span>
                </div>
              </div>

              <div className="mt-3 h-[77px] flex-col justify-start items-start gap-2 inline-flex">
                <label
                  htmlFor="company"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Company Name
                </label>
                <div className="h-11 w-full pr-[13px] py-5 bg-[#d3d3d3] opacity-50 rounded-lg border border-[#cac9d6] flex justify-between items-center">
                  <input
                    id="company"
                    type="text"
                    value={formData.company || "Triumph IQ"}
                    className="w-full bg-transparent text-[#676576] text-[15px] font-normal font-['Inter'] leading-[25px] border-none outline-none"
                    disabled
                  />
                  <span className="opacity-0 text-white text-[15px] font-normal font-['Inter'] leading-[25px]">.</span>
                </div>
              </div>

              <div className="mt-3 h-[77px] flex-col justify-start items-start gap-2 inline-flex">
                <label
                  htmlFor="password"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Password
                </label>
                <div className="self-stretch h-11 py-5 rounded-lg border border-[#cac9d6] justify-between items-center inline-flex">
                  <input
                    id="password"
                    type="password"
                    placeholder="**********" 
                    required
                    onBlur={() => handleBlur('password')}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, password: e.target.value }));
                    }}
                    value={formData.password || ""}
                    className="w-full bg-transparent rounded-lg border-none outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
                  />
                </div>
              </div>
              
              <div className="mt-3 h-[77px] flex-col justify-start items-start gap-2 inline-flex">
                <label
                  htmlFor="confirmPassword"
                  className="self-stretch text-[#9794aa] text-base font-medium font-['Inter'] leading-[25px]"
                >
                  Confirm Password
                </label>
                <div className="self-stretch h-11 py-5 rounded-lg border border-[#cac9d6] justify-between items-center inline-flex">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="**********" 
                    required
                    onBlur={() => handleBlur('confirmPassword')}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                      validateField('confirmPassword', e.target.value);
                    }}
                    value={formData.confirmPassword || ""}
                    className="w-full bg-transparent rounded-lg border-none outline-none text-[#676576] text-base font-normal font-['Inter'] leading-[25px]"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                className={`w-[537px] h-[39px] px-[158px] py-2.5 rounded-lg flex items-center justify-center text-center text-white text-base font-medium font-['Inter'] ${
                  isFormComplete()
                    ? 'bg-[#6938ef] hover:bg-[#6D28D9]'
                    : 'bg-[#6938ef]/50 cursor-not-allowed'
                }`}
                disabled={!isFormComplete()}
              >
                Continue
              </Button>
            </form>
          
            <div className="mt-3 w-[534px] h-[25px] px-[232px] flex justify-between items-center">
              <Link to="/signup" className="flex items-center gap-2 text-[#494759] text-base font-normal font-['Inter'] leading-[25px] tracking-tight hover:text-gray-800">
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
      
      <div className="hidden md:block w-1/2 bg-[#dfe1fe] pl-[64px] pt-[80px] pb-[64px] pr-[80px] relative rounded-l-[70px]">
        <div className="w-full">
          <img 
            src="/Container.svg" 
            alt="Container illustration"
            className="w-full"
          />
        </div>
      </div> 
    </div>
  );
};

export default ActivateAccount;
