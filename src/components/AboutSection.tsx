import React from 'react';
import { CheckCircleIcon, TruckIcon, HeartIcon, GlobeIcon } from 'lucide-react';
const AboutSection = () => {
  return <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-2">
            About Us & Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide premium quality meat and meal solutions for fitness
            enthusiasts who care about their nutrition.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-2xl font-semibold text-secondary mb-4">
              Our Story
            </h3>
            <p className="text-gray-700 mb-4">
              Founded by fitness enthusiasts who understand the importance of
              quality protein in a balanced diet, FitMeat was born from a desire
              to make premium, clean protein accessible to everyone on their
              fitness journey.
            </p>
            <p className="text-gray-700">
              We partner with local farms that share our commitment to
              sustainable practices and ethical treatment of animals, ensuring
              you get the highest quality products that are good for your body
              and the planet.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Our team" className="w-full h-64 object-cover" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-light p-6 rounded-lg text-center">
            <div className="mb-4 flex justify-center">
              <CheckCircleIcon className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Premium Quality
            </h3>
            <p className="text-gray-700">
              All our meats are sourced from trusted farms with the highest
              quality standards.
            </p>
          </div>
          <div className="bg-light p-6 rounded-lg text-center">
            <div className="mb-4 flex justify-center">
              <TruckIcon className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-700">
              We deliver your orders fresh and on time, right to your doorstep.
            </p>
          </div>
          <div className="bg-light p-6 rounded-lg text-center">
            <div className="mb-4 flex justify-center">
              <HeartIcon className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Nutrition Focused
            </h3>
            <p className="text-gray-700">
              Each meal is crafted by nutritionists to support your fitness
              goals.
            </p>
          </div>
          <div className="bg-light p-6 rounded-lg text-center">
            <div className="mb-4 flex justify-center">
              <GlobeIcon className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Sustainable
            </h3>
            <p className="text-gray-700">
              We're committed to ethical practices and eco-friendly packaging.
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default AboutSection;