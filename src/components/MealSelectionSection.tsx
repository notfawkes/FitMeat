import React, { useState, useEffect } from 'react';
import MealCard from './MealCard';
import { supabase } from '../supabaseClient';

const fallbackCategories = ['All Meals', 'Chicken Bowls', 'Beef Bowls', 'Paneer Bowls', 'Fish Meals', 'Protein Snacks', 'Keto Friendly', 'Low Carb'];
const fallbackMeals = [{
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
  const [categories, setCategories] = useState<string[]>(fallbackCategories);
  const [meals, setMeals] = useState<any[]>(fallbackMeals);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const catResponse = await fetch('http://localhost:4000/api/db/categories');
        if (catResponse.ok) {
          const catData = await catResponse.json();
          if (catData && catData.length > 0) {
            setCategories(['All Meals', ...catData.map((c: any) => c.name)]);
          }
        }

        const prodResponse = await fetch('http://localhost:4000/api/db/products');
        if (prodResponse.ok) {
          const prodData = await prodResponse.json();
          if (prodData && prodData.length > 0) {
            const formattedMeals = prodData.map((p: any) => ({
              id: p.id,
              category: p.categories?.name || 'Uncategorized',
              title: p.title,
              description: p.description,
              price: Number(p.price),
              protein: p.product_nutrition?.[0]?.protein ?? p.product_nutrition?.protein ?? 0,
              isVeg: p.is_veg,
              image: p.image
            }));
            setMeals(formattedMeals);
          }
        }
      } catch (err) {
        console.error("Error fetching from Node Backend, using fallback data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
              {loading ? (
                <div className="animate-pulse space-y-2">
                  {[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-200 rounded w-full"></div>)}
                </div>
              ) : (
              <ul className="space-y-2">
                {categories.map(category => <li key={category}>
                    <button className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category ? 'bg-accent text-white' : 'hover:bg-light text-gray-700'}`} onClick={() => setSelectedCategory(category)}>
                      {category}
                    </button>
                  </li>)}
              </ul>
              )}
            </div>
          </div>
          {/* Meal Cards - Right Side */}
          <div className="md:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(i => (
                   <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                     <div className="h-48 bg-gray-200 w-full" />
                     <div className="p-4 space-y-3">
                       <div className="h-6 bg-gray-200 rounded w-3/4" />
                       <div className="h-4 bg-gray-200 rounded w-full" />
                       <div className="h-4 bg-gray-200 rounded w-1/2" />
                     </div>
                   </div>
                 ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMeals.map(meal => <MealCard key={meal.id} id={meal.id} image={meal.image} title={meal.title} description={meal.description} price={meal.price} protein={meal.protein} isVeg={meal.isVeg} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>;
};
export default MealSelectionSection;