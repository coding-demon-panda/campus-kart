import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  return (
    <header className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div
          className="text-3xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Campus Kart
        </div>
        <nav className="space-x-6 relative">
          <button onClick={() => navigate('/home')} className="text-gray-700 hover:text-blue-600 transition">
            Home
          </button>

          {sessionStorage.getItem('authToken') === null && (
            <>
              {/* Sign Up Dropdown */}
              <div className="inline-block relative">
                <button
                  onClick={() => setShowSignupDropdown((prev) => !prev)}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Sign Up ▾
                </button>
                {showSignupDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
                    <button
                      onClick={() => navigate('/signup')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100"
                    >
                      Seller Sign Up
                    </button>
                    <button
                      onClick={() => navigate('/usersignup')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100"
                    >
                      Student Sign Up
                    </button>
                  </div>
                )}
              </div>

              {/* Login Dropdown */}
              <div className="inline-block relative">
                <button
                  onClick={() => setShowLoginDropdown((prev) => !prev)}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Login ▾
                </button>
                {showLoginDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
                    <button
                      onClick={() => navigate('/login')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100"
                    >
                      Seller Login
                    </button>
                    <button
                      onClick={() => navigate('/userlogin')}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100"
                    >
                      Student Login
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          <button onClick={() => navigate('/contact')} className="text-gray-700 hover:text-blue-600 transition">
            Contact
          </button>

          {sessionStorage.getItem('authToken') !== null && (
            <>
              <button onClick={() => navigate('/students/cart')} className="text-gray-700 hover:text-blue-600 transition">
                My Cart
              </button>
              <button onClick={() => navigate('/students/dashboard')} className="text-gray-700 hover:text-blue-600 transition">
                Dashboard
              </button>
              <button onClick={() => navigate('/students/orders')} className="text-gray-700 hover:text-blue-600 transition">
                Orders
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
