import React from 'react';
import { useCart } from '../context/CartContext';

interface MealCardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  protein: number;
  isVeg: boolean;
  onViewDetails?: () => void;
}

const MealCard = ({
  id,
  image,
  title,
  description,
  price,
  protein,
  isVeg,
  onViewDetails,
}: MealCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      title,
      price,
      image,
      description,
      protein: `${protein}g protein`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div
          className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white"
          style={{
            backgroundColor: isVeg ? '#50C878' : '#0B6E4F'
          }}
        >
          {isVeg ? 'VEG' : 'NON-VEG'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-accent font-semibold">
              ₹{price.toFixed(0)}
            </span>
          </div>
          <div className="text-xs px-2 py-1 bg-light rounded-full text-secondary font-medium">
            {protein}g protein
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleAddToCart}
            className="w-full bg-secondary text-white py-2 rounded-md hover:bg-primary transition-colors"
          >
            Add to Cart
          </button>
          {onViewDetails && (
            <button
              type="button"
              onClick={onViewDetails}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:border-[#50C878] hover:text-[#50C878] transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealCard;