import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import MealSelectionSection from './components/MealSelectionSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <AboutSection />
        <MealSelectionSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#50C878]"></div>
  </div>
);

const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-[#013220] mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-6">Please try refreshing the page</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#50C878] hover:bg-[#0B6E4F] text-white font-bold py-3 px-4 rounded-md transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </ErrorBoundary>
  );
}