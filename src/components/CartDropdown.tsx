import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, X } from 'lucide-react';
import { supabase } from '../supabaseClient'; // Import supabase

const CartDropdown = ({
  onClose
}: {
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null); // Add session state
  const {
    items,
    updateQuantity,
    removeFromCart,
    totalPrice
  } = useCart();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCheckout = () => {
    onClose(); // Close the cart dropdown
    navigate('/checkout');
  };


  if (items.length === 0) {
    return <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg p-4 text-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Your Cart</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <p className="text-center text-gray-500">Your cart is empty</p>
      </div>;
  }
  return <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg p-4 text-gray-700 max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Your Cart</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>
      <div className="space-y-4">
        {items.map(item =><div key={item.id} className="flex items-center space-x-4 border-b pb-4">
            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h4 className="font-medium">{item.title}</h4>
              <div className="text-accent font-semibold">
                ₹{(item.price * item.quantity).toFixed(0)}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-100">
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-gray-100">
                  <Plus size={16} />
                </button>
                <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500 hover:text-red-700">
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>)}
      </div>
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg">₹{totalPrice.toFixed(0)}</span>
        </div>
        {session ? (
          <button 
            onClick={handleCheckout}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition-colors"
          >
            Checkout
          </button>
        ) : (
          <p className="text-center text-gray-500">Please log in to checkout</p>
        )}
      </div>
    </div>;
};
export default CartDropdown;