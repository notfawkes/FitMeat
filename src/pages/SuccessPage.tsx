import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#D1F2EB] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-16 h-16 text-[#50C878]" />
        </div>
        <h1 className="text-2xl font-bold text-[#013220] mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We'll start preparing your food right away.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#50C878] hover:bg-[#0B6E4F] text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.location.href = '/orders'}
            className="w-full border border-[#50C878] text-[#50C878] hover:bg-[#50C878] hover:text-white font-bold py-3 px-4 rounded-md transition-colors"
          >
            View Order Status
          </button>
        </div>
      </div>
    </div>
  );
}; 