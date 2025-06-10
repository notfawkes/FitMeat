import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { UserIcon, PhoneIcon, MailIcon, LockIcon, MapPinIcon } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
            address: address,
            phone_number: phoneNumber,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        const { error: insertProfileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: name,
            address: address,
            phone_number: phoneNumber,
          });

        if (insertProfileError) {
          console.error('Error inserting profile data:', insertProfileError.message);
          setError('Registration successful, but failed to save profile details. Please try logging in.');
          navigate('/login');
          return;
        }
      }

      setMessage('Registration successful! Please check your email to verify your account. You can now login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80" alt="Healthy food background" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#D1F2EB]/80 to-white/90"></div>
      </div>
      <main className="flex-grow flex items-center justify-center w-full relative z-10">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform w-full max-w-md px-4">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-[#013220] mb-6">Create Your FitMeats Account</h2>
            {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#50C878] focus:border-transparent"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#50C878] focus:border-transparent"
                    placeholder="(123) 456-7890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#50C878] focus:border-transparent"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#50C878] focus:border-transparent"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Delivery Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#50C878] focus:border-transparent"
                    placeholder="123 Main St, City, State"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#0B6E4F] focus:ring-[#50C878] border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0B6E4F] hover:bg-[#013220] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#50C878] transition-colors duration-200 ${loading ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Sign Up'}
                </button>
              </div>
              <div>
                <button type="button" className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#50C878] transition-colors duration-200">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign Up with Google
                </button>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-[#0B6E4F] hover:text-[#013220] focus:outline-none focus:underline transition-colors duration-200">
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}; 