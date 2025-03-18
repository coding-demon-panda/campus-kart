import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

// ImageSlider Component to cycle through 3 images
const ImageSlider = () => {
  const images = ["/oldsc.png", "/newsc.jpg", "/academicsc.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Change image every 3 seconds
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex-1 mt-10 md:mt-0">
      <img 
        src={images[currentIndex]} 
        alt="Campus Shopping" 
        className="w-full rounded-lg shadow-2xl transform hover:scale-105 transition duration-500"
      />
    </div>
  );
};

// HomePage Component with slide-in from bottom functionality
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-slideInUp flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white">
          <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
            <div className="flex-1">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 animate-fadeInDown">
                Discover the <br/> Future of Campus Shopping
              </h1>
              <p className="text-lg md:text-2xl mb-8 animate-fadeInUp">
                Experience a seamless, convenient, and fun way to order your groceries and essentials right on campus.
              </p>
              <div className="space-x-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-8 py-4 bg-white text-red-500 rounded-lg font-bold hover:bg-gray-100 transition animate-bounce"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => navigate('/products')}
                  className="px-8 py-4 border border-white rounded-lg font-bold hover:bg-white hover:text-red-500 transition"
                >
                  Browse Products
                </button>
              </div>
            </div>
            {/* Image Slider */}
            <ImageSlider />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">Why Choose Campus Kart?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition">
                <img 
                  className="w-16 h-16 mx-auto mb-4" 
                  src="https://cdn-icons-png.flaticon.com/512/2950/2950272.png" 
                  alt="Convenience Icon" 
                />
                <h3 className="text-xl font-semibold mb-2">Convenience</h3>
                <p className="text-gray-600">Order with just a few clicks, anytime, anywhere on campus.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition">
                <img 
                  className="w-16 h-16 mx-auto mb-4" 
                  src="https://cdn-icons-png.flaticon.com/512/1238/1238135.png" 
                  alt="Fast Delivery Icon" 
                />
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Get your orders delivered quickly right to your doorstep.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition">
                <img 
                  className="w-16 h-16 mx-auto mb-4" 
                  src="https://cdn-icons-png.flaticon.com/512/2907/2907806.png" 
                  alt="Exclusive Deals Icon" 
                />
                <h3 className="text-xl font-semibold mb-2">Exclusive Deals</h3>
                <p className="text-gray-600">Enjoy special discounts and offers only available on Campus Kart.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Product Showcase */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12">Our Top Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Product Card 1 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
                <img 
                  src="/fruits.webp" 
                  alt="Fresh Fruits" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">Fresh Fruits</h3>
                  <p className="text-gray-600">Quality fruits delivered fresh from local markets.</p>
                </div>
              </div>
              {/* Product Card 2 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
                <img 
                  src="/grocery.jpg" 
                  alt="Grocery Essentials" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">Grocery Essentials</h3>
                  <p className="text-gray-600">Everything you need for your daily routine.</p>
                </div>
              </div>
              {/* Product Card 3 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition">
                <img 
                  src="/stationary.jpg" 
                  alt="Stationery Supplies" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">Stationery Supplies</h3>
                  <p className="text-gray-600">All your academic and creative needs in one place.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition">
                <p className="text-lg italic text-gray-700 mb-4">
                  "Campus Kart has completely transformed campus shopping for me. It's fast, easy, and incredibly reliable!"
                </p>
                <div className="text-right font-bold">- Raj, IIT Bhubaneswar</div>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition">
                <p className="text-lg italic text-gray-700 mb-4">
                  "Managing my shop's orders has never been easier. Campus Kart is a true game-changer for our business."
                </p>
                <div className="text-right font-bold">- Sneha, Shop Owner</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call To Action Section */}
        <section className="py-20 bg-red-500 text-white text-center">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Campus Experience?</h2>
            <p className="text-xl mb-8">
              Join Campus Kart today and get the best of campus shopping at your fingertips.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-white text-red-500 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Sign Up Now
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
