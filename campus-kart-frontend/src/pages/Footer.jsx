import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Footer = () => (
  <footer className="bg-white shadow-inner py-6">
    <div className="max-w-7xl mx-auto text-center text-gray-600">
      &copy; {new Date().getFullYear()} Campus Kart. All rights reserved.
    </div>
  </footer>
);

export default Footer;