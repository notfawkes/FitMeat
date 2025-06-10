import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, CartItem } from '../context/CartContext';
import { CartItem as CartItemComponent } from '../components/checkout/CartItem';
import { TimeSlotSelector } from '../components/checkout/TimeSlotSelector';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { PaymentOptions } from '../components/checkout/PaymentOptions';
import { ArrowLeftIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../supabaseClient';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items: cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/');
    }
  }, [cartItems, navigate]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 49;
  const total = subtotal + deliveryFee;

  const handlePaymentSuccess = async () => {
    setIsProcessing(false);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const orderId = uuidv4();
      const orderItems = cartItems.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const { error: insertError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: user.id,
          order_date: new Date().toISOString(),
          total_amount: total,
          items: orderItems,
          status: 'completed',
        });

      if (insertError) {
        throw insertError;
      }

      clearCart();
      navigate('/success');
    } catch (error: any) {
      console.error('Error processing order:', error);
      setPaymentError(error.message || 'Failed to place order.');
    }
  };

  const handlePaymentError = (error: string) => {
    setIsProcessing(false);
    setPaymentError(error);
  };

  const handlePlaceOrder = (paymentMethod: string) => {
    if (!selectedTimeSlot) {
      setPaymentError('Please select a delivery time slot.');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    // Simulate payment processing based on selected payment method
    if (paymentMethod === 'card' || paymentMethod === 'gpay' || paymentMethod === 'upi') {
      // For card, GPay, and UPI, simulate a successful payment after a delay
      setTimeout(() => {
        handlePaymentSuccess();
      }, 1500);
    } else if (paymentMethod === 'cod') {
      // For Cash on Delivery, directly proceed to success
      handlePaymentSuccess();
    } else {
      handlePaymentError('Invalid payment method selected.');
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#D1F2EB] to-white">
      {/* Navbar */}
      <div className="bg-[#013220] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FitMeats</h1>
          <div className="flex items-center space-x-6">
            <span className="hover:text-[#50C878] cursor-pointer transition-colors">Search</span>
            <span className="hover:text-[#50C878] cursor-pointer transition-colors">Profile</span>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container mx-auto p-2 md:p-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-[#0B6E4F] font-medium mb-8 hover:text-[#50C878] transition-colors"
        >
          <ArrowLeftIcon size={20} className="mr-2" />
          Back to Menu
        </button>

        <h1 className="text-4xl font-bold text-[#013220] mb-8">Checkout</h1>

        {paymentError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-200">
            {paymentError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Order Items Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-[#013220] mb-6">
                Order Items
              </h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeFromCart}
                  />
                ))}
              </div>
            </div>

            {/* Time Slot Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-[#013220] mb-6">
                Delivery Time
              </h2>
              <TimeSlotSelector
                selectedTimeSlot={selectedTimeSlot}
                setSelectedTimeSlot={setSelectedTimeSlot}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Order Summary Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <OrderSummary
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
              />
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-[#013220] mb-6">
                Payment Method
              </h2>
              <PaymentOptions
                selectedPayment={selectedPayment}
                onPaymentSelect={setSelectedPayment}
                onPlaceOrder={handlePlaceOrder}
                isProcessing={isProcessing}
                totalAmount={total}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#013220] text-white mt-16 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">FitMeats</h2>
              <p className="text-gray-300 max-w-md">
                Premium quality meat for fitness enthusiasts. We deliver fresh, high-quality meat right to your doorstep.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h3 className="text-lg font-semibold mb-4">Menu</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">Chicken Bowls</li>
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">Steak Plates</li>
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">Fish Options</li>
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">Vegetarian</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">Our Story</li>
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">Sourcing</li>
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">Nutrition</li>
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">Blog</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">Support</li>
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">Careers</li>
                  <li className="hover:text-[#50C878] cursor-pointer transition-colors">FAQ</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-sm text-gray-400">
            <p>© 2024 FitMeats. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 