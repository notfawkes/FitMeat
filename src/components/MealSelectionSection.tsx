import React, { useState, useEffect } from 'react';
import MealCard from './MealCard';
import { apiClient } from '../services/apiClient';

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
  const [selectedMeal, setSelectedMeal] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const catData = await apiClient.get<any[]>('/api/db/categories');
        if (catData && catData.length > 0) {
          setCategories(['All Meals', ...catData.map((c: any) => c.name)]);
        }

        const prodData = await apiClient.get<any[]>('/api/db/products');
        if (prodData && prodData.length > 0) {
          const formattedMeals = prodData.map((p: any) => ({
            id: p.id,
            category: p.categories?.name || 'Uncategorized',
            title: p.title,
            description: p.description,
            price: Number(p.price),
            protein: Number(p.product_nutrition?.[0]?.protein ?? p.product_nutrition?.protein ?? 0),
            isVeg: p.is_veg,
            image: p.image
          }));
          setMeals(formattedMeals);
        }
      } catch (err) {
        console.error('Error fetching from Node Backend, using fallback data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredMeals = selectedCategory === 'All Meals' ? meals : meals.filter(meal => meal.category === selectedCategory);

  const openMealDetails = async (id: number) => {
    setDetailError('');
    setDetailsLoading(true);
    try {
      const meal = await apiClient.get<any>(`/api/db/products/${id}`);
      setSelectedMeal(meal);
      setShowDetails(true);
    } catch (err: any) {
      console.error('Failed to load meal details:', err);
      setDetailError(err?.message || 'Unable to load meal details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedMeal(null);
    setDetailError('');
  };

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
                {filteredMeals.map(meal => (
                  <MealCard
                    key={meal.id}
                    id={meal.id}
                    image={meal.image}
                    title={meal.title}
                    description={meal.description}
                    price={meal.price}
                    protein={meal.protein}
                    isVeg={meal.isVeg}
                    onViewDetails={() => openMealDetails(meal.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h2 className="text-2xl font-bold text-[#013220]">{selectedMeal?.title ?? 'Meal Details'}</h2>
                <p className="text-sm text-gray-500">{selectedMeal?.categories?.name ?? 'Nutrition and ingredients'}</p>
              </div>
              <button onClick={closeDetails} className="text-gray-500 hover:text-gray-900 font-semibold">Close</button>
            </div>
            <div className="p-6">
              {detailsLoading ? (
                <div className="text-center py-12">
                  <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-[#50C878] border-t-transparent" />
                </div>
              ) : detailError ? (
                <div className="rounded-xl bg-red-50 p-6 text-red-700">{detailError}</div>
              ) : selectedMeal ? (
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <img src={selectedMeal.image} alt={selectedMeal.title} className="mb-6 h-72 w-full rounded-3xl object-cover" />
                    <p className="text-gray-700 mb-4">{selectedMeal.description}</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <h3 className="font-semibold text-[#013220] mb-2">Nutrition</h3>
                        <div className="text-gray-700 text-sm space-y-2">
                          <div>Protein: {selectedMeal.product_nutrition?.[0]?.protein ?? selectedMeal.product_nutrition?.protein ?? 0} g</div>
                          <div>Carbs: {selectedMeal.product_nutrition?.[0]?.carbs ?? selectedMeal.product_nutrition?.carbs ?? 0} g</div>
                          <div>Fats: {selectedMeal.product_nutrition?.[0]?.fats ?? selectedMeal.product_nutrition?.fats ?? 0} g</div>
                          <div>Calories: {selectedMeal.product_nutrition?.[0]?.calories ?? selectedMeal.product_nutrition?.calories ?? 0} kcal</div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-4">
                        <h3 className="font-semibold text-[#013220] mb-2">Ingredients</h3>
                        {selectedMeal.ingredients?.length > 0 ? (
                          <ul className="space-y-2 text-gray-700 text-sm">
                            {selectedMeal.ingredients.map((ingredient: any) => (
                              <li key={ingredient.id} className="flex justify-between rounded-xl bg-white p-3 shadow-sm">
                                <span>{ingredient.name}</span>
                                {ingredient.quantity_used && <span className="text-gray-500">{ingredient.quantity_used}</span>}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">No ingredients available for this meal.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-[#F0F9F4] p-6">
                    <h3 className="text-xl font-semibold text-[#013220] mb-4">Meal Summary</h3>
                    <div className="space-y-3 text-gray-700 text-sm">
                      <div><span className="font-semibold">Category:</span> {selectedMeal.categories?.name ?? 'Uncategorized'}</div>
                      <div><span className="font-semibold">Price:</span> ₹{Number(selectedMeal.price).toFixed(0)}</div>
                      <div><span className="font-semibold">Type:</span> {selectedMeal.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600">No meal details available.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>;
};
export default MealSelectionSection;