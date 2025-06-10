import React from 'react';
import { MapPinIcon, PhoneIcon, MailIcon, InstagramIcon, FacebookIcon, TwitterIcon } from 'lucide-react';
const Footer = () => {
  return <footer id="contact" className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">FitMeat</h3>
            <p className="mb-4 text-gray-300">
              Premium quality meat and meal solutions for fitness enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors">
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#meals" className="hover:text-accent transition-colors">
                  Meals
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-accent transition-colors">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2 text-accent" />
                <span>123 Fitness Street, Health City</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-5 h-5 mr-2 text-accent" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <MailIcon className="w-5 h-5 mr-2 text-accent" />
                <span>info@fitmeat.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} FitMeat. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;