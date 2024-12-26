import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="border-b">
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-bold text-blue-600">
            <a href="/">
              <img src="/logo.svg" alt="" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 flex-row justify-center gap-10 w-[30rem]">
            <a href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </a>
            <a href="/hotel" className="text-gray-600 hover:text-blue-600">
              Hotels
            </a>
            <a href="*" className="text-gray-600 hover:text-blue-600">
              Places
            </a>
          </div>

          <div className="hidden md:flex justify-end items-center w-[40rem]">
            <a href="*" className="text-gray-600 hover:text-blue-600">
              Sign in
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-blue-600"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <a
                href="/"
                className="text-gray-600 hover:text-blue-600 px-2 py-1"
              >
                Home
              </a>
              <a
                href="/hotel"
                className="text-gray-600 hover:text-blue-600 px-2 py-1"
              >
                Hotels
              </a>
              <a
                href="*"
                className="text-gray-600 hover:text-blue-600 px-2 py-1"
              >
                Places
              </a>
              <a
                href="*"
                className="text-gray-600 hover:text-blue-600 px-2 py-1"
              >
                Sign in
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;