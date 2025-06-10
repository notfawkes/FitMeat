import React from 'react';
import { Trash2Icon, MinusIcon, PlusIcon } from 'lucide-react';

interface CartItemProps {
  item: {
    id: number;
    title: string;
    image: string;
    price: number;
    quantity: number;
    description: string;
    protein: string;
  };
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  updateQuantity,
  removeItem
}) => {
  return (
    <div className="flex flex-col sm:flex-row border-b border-gray-100 py-6">
      <div className="sm:w-24 sm:h-24 h-32 w-full mb-4 sm:mb-0">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover rounded-lg shadow-sm" 
        />
      </div>
      <div className="flex-1 sm:ml-6">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-[#013220] text-lg">{item.title}</h3>
          <button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <Trash2Icon size={20} />
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-1 mb-2">{item.description}</p>
        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md font-medium">NON-VEG</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">{item.protein}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-3 py-2 text-[#0B6E4F] hover:bg-gray-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <MinusIcon size={18} />
            </button>
            <span className="px-4 py-2 text-gray-700 font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-3 py-2 text-[#0B6E4F] hover:bg-gray-50 transition-colors"
              aria-label="Increase quantity"
            >
              <PlusIcon size={18} />
            </button>
          </div>
          <div className="font-semibold text-[#013220] text-lg">
            ₹{(item.price * item.quantity).toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  );
}; 