import React from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 w-full p-6 md:p-10 z-50 flex justify-end items-center mix-blend-difference text-white pointer-events-none">
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="pointer-events-auto hover-trigger w-12 h-12 flex items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </nav>
  );
};
