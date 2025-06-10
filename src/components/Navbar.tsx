import React, { useState, useEffect } from 'react';
import { SearchIcon, UserIcon, MenuIcon, XIcon, ShoppingCartIcon } from 'lucide-react';
import CartDropdown from './CartDropdown';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  const { totalItems } = useCart();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="font-bold text-2xl">FitMeat</Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-accent transition-colors">Home</a>
            <a href="#about" className="hover:text-accent transition-colors">About</a>
            <a href="#meals" className="hover:text-accent transition-colors">Meals</a>
            <a href="#testimonials" className="hover:text-accent transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </nav>
          {/* Search, Cart and Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your location"
                className="pl-8 pr-4 py-1 rounded-full text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
            </div>
            {/* Cart Button */}
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-secondary transition-colors" onClick={() => setIsCartOpen(!isCartOpen)}>
                <ShoppingCartIcon className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              {isCartOpen && <CartDropdown onClose={() => setIsCartOpen(false)} />}
            </div>
            {session ? (
              <>
                <Link to="/profile" className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Profile">
                  <UserIcon className="w-5 h-5" />
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Login">
                  Login
                </Link>
                <Link to="/register" className="p-2 rounded-full hover:bg-secondary transition-colors" aria-label="Register">
                  Register
                </Link>
              </>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-3">
              <a href="#home" className="hover:text-accent transition-colors">Home</a>
              <a href="#about" className="hover:text-accent transition-colors">About</a>
              <a href="#meals" className="hover:text-accent transition-colors">Meals</a>
              <a href="#testimonials" className="hover:text-accent transition-colors">Testimonials</a>
              <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
              {session ? (
                <>
                  <Link to="/profile" className="hover:text-accent transition-colors">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left hover:text-accent transition-colors">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-accent transition-colors">Login</Link>
                  <Link to="/register" className="hover:text-accent transition-colors">Register</Link>
                </>
              )}
            </nav>
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Enter your location"
                className="w-full pl-8 pr-4 py-1 rounded-full text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary" />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;