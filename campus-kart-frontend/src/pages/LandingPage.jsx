import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [animateOut, setAnimateOut] = useState(false);

  // When a button is clicked, trigger the slide-up animation then navigate.
  const handleNavigation = (path) => {
    // Trigger the slide-up animation by setting animateOut to true.
    setAnimateOut(true);
    // Optionally, scroll to the top (if the page has enough content to scroll).
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // After the animation duration (800ms here), navigate to the new route.
    setTimeout(() => {
      navigate(path);
    }, 400);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 text-white flex flex-col transition-transform duration-700 ${
        animateOut ? '-translate-y-full' : ''
      }`}
    >
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="text-3xl font-bold">Campus Kart</div>
        <nav className="flex space-x-6">
          <button onClick={() => handleNavigation('/home')} className="hover:underline">
            Home
          </button>
          <button onClick={() => handleNavigation('/usersignup')} className="hover:underline">
            Sign Up
          </button>
          <button onClick={() => handleNavigation('/userlogin')} className="hover:underline">
            Login
          </button>
          <button onClick={() => handleNavigation('/contact')} className="hover:underline">
            Contact
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Your Campus Grocery, Delivered
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-10">
          Experience a seamless shopping journey with Campus Kart. Order your groceries, snacks,
          and essentials with just a few clicks—designed exclusively for college life.
        </p>
        <div className="flex space-x-4">
          <button 
            onClick={() => handleNavigation('/home')}
            className="px-6 py-3 bg-white text-blue-500 rounded-lg shadow-lg font-semibold hover:bg-gray-200 transition"
          >
            Get Started
          </button>
          <button 
            // onClick={() => handleNavigation('/explore')}
            className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white hover:text-blue-500 transition"
          >
            Learn More
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p>&copy; {new Date().getFullYear()} Campus Kart. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
