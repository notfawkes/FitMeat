import React from 'react';
const HeroSection = () => {
  return <section id="home" className="bg-light py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Premium Meat for{' '}
              <span className="text-secondary">Fitness Enthusiasts</span>
            </h1>
            <p className="text-lg mb-6 text-gray-700">
              High-quality, protein-rich meals delivered to your doorstep.
              Perfect for your fitness journey.
            </p>
            <div className="flex space-x-4">
              <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-secondary transition-colors">
                Order Now
              </button>
              <button className="border-2 border-primary text-primary px-6 py-3 rounded-md hover:bg-light transition-colors">
                View Menu
              </button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="High protein meal" className="rounded-lg shadow-lg w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;