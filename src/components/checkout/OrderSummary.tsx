import React from 'react';

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  deliveryFee,
  total
}) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#013220] mb-6">
        Order Summary
      </h2>
      <div className="space-y-4 text-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-lg">Subtotal</span>
          <span className="text-lg font-medium">₹{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg">Delivery Fee</span>
          <span className="text-lg font-medium">₹{deliveryFee.toFixed(0)}</span>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center font-semibold text-[#013220]">
          <span className="text-xl">Total</span>
          <span className="text-xl">₹{total.toFixed(0)}</span>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-lg">Have a promo code?</span>
        </div>
        <div className="flex mt-3">
          <input
            type="text"
            placeholder="Enter code"
            className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#50C878] focus:border-transparent text-gray-700"
          />
          <button className="bg-[#0B6E4F] text-white px-6 py-3 rounded-r-lg hover:bg-[#50C878] transition-colors font-medium">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}; 