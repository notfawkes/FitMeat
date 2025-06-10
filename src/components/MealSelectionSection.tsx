import React, { useState } from 'react';
import MealCard from './MealCard';
const categories = ['All Meals', 'Chicken Bowls', 'Beef Bowls', 'Paneer Bowls', 'Fish Meals', 'Protein Snacks', 'Keto Friendly', 'Low Carb'];
const meals = [{
  id: 1,
  category: 'Chicken Bowls',
  title: 'Grilled Chicken Rice Bowl',
  description: 'Tender grilled chicken breast with brown rice, steamed broccoli, and our signature sauce.',
  price: 299,
  protein: 32,
  isVeg: false,
  image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 2,
  category: 'Chicken Bowls',
  title: 'Chicken Teriyaki Bowl',
  description: 'Japanese-inspired chicken teriyaki with vegetables over jasmine rice.',
  price: 349,
  protein: 28,
  isVeg: false,
  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 3,
  category: 'Beef Bowls',
  title: 'Steak & Quinoa Bowl',
  description: 'Grass-fed steak slices with quinoa, roasted sweet potatoes, and mixed greens.',
  price: 399,
  protein: 35,
  isVeg: false,
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 4,
  category: 'Paneer Bowls',
  title: 'Spicy Paneer Bowl',
  description: 'Protein-rich paneer cubes in a flavorful curry with brown rice and vegetables.',
  price: 249,
  protein: 24,
  isVeg: true,
  image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 5,
  category: 'Fish Meals',
  title: 'Salmon & Avocado Plate',
  description: 'Omega-rich grilled salmon with avocado, mixed greens, and lemon dill sauce.',
  price: 449,
  protein: 30,
  isVeg: false,
  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
}, {
  id: 6,
  category: 'Protein Snacks',
  title: 'Protein Energy Balls',
  description: 'Natural protein balls made with dates, nuts, and whey protein.',
  price: 199,
  protein: 15,
  isVeg: true,
  image: 'https://images.unsplash.com/photo-1604467715878-83e57e8bc129?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
}];
const MealSelectionSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Meals');
  const filteredMeals = selectedCategory === 'All Meals' ? meals : meals.filter(meal => meal.category === selectedCategory);
  return <section id="meals" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Our Meal Selection
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Perfectly portioned, protein-packed meals designed to fuel your
            fitness journey.
          </p>
        </div>
        <div className="flex flex-col md:flex-row">
          {/* Categories Menu - Left Side */}
          <div className="md:w-1/4 mb-6 md:mb-0 md:pr-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map(category => <li key={category}>
                    <button className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category ? 'bg-accent text-white' : 'hover:bg-light text-gray-700'}`} onClick={() => setSelectedCategory(category)}>
                      {category}
                    </button>
                  </li>)}
              </ul>
            </div>
          </div>
          {/* Meal Cards - Right Side */}
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map(meal => <MealCard key={meal.id} id={meal.id} image={meal.image} title={meal.title} description={meal.description} price={meal.price} protein={meal.protein} isVeg={meal.isVeg} />)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default MealSelectionSection;