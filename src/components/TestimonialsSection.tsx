import React from 'react';
import { StarIcon } from 'lucide-react';
const testimonials = [{
  id: 1,
  name: 'Michael Stevens',
  role: 'Fitness Coach',
  image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  stars: 5,
  content: 'FitMeat has been a game-changer for my clients. The high-protein meals make it easy to stay on track with fitness goals. I recommend these to all my clients looking for convenient nutrition.'
}, {
  id: 2,
  name: 'Sarah Johnson',
  role: 'Marathon Runner',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  stars: 5,
  content: 'As a busy athlete, I need proper nutrition without spending hours in the kitchen. These meals have the perfect macros for my training and taste amazing. The delivery is always on time!'
}, {
  id: 3,
  name: 'David Chen',
  role: 'Bodybuilder',
  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  stars: 4,
  content: 'Finding meals with enough protein was always a challenge until I discovered FitMeat. Now I save time on meal prep while still getting the nutrition I need for muscle recovery and growth.'
}];
const TestimonialsSection = () => {
  return <section id="testimonials" className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from fitness enthusiasts
            who've made FitMeat part of their routine.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover mr-4" />
                <div>
                  <h4 className="font-semibold text-primary">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < testimonial.stars ? 'text-accent fill-accent' : 'text-gray-300'}`} />)}
              </div>
              <p className="text-gray-700">{testimonial.content}</p>
            </div>)}
        </div>
        <div className="mt-12 text-center">
          <button className="bg-secondary text-white px-6 py-3 rounded-md hover:bg-primary transition-colors">
            Read More Reviews
          </button>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;