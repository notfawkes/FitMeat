import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  // profile_picture?: string; // Optional: if you implement profile picture uploads later
}

interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface UserOrder {
  id: string;
  order_date: string;
  total_amount: number;
  items: OrderItem[];
  status: string;
}

export const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [previousOrders, setPreviousOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          navigate('/login'); // Redirect to login if no user session
          return;
        }

        // Fetch profile data from 'profiles' table
        console.log('Attempting to fetch profile for user ID:', user.id);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, name, address, phone_number')
          .eq('id', user.id);

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        if (profileData && profileData.length > 0) {
          console.log('Profile data found:', profileData[0]);
          setUserProfile({
            id: user.id,
            name: profileData[0].name || '',
            email: user.email || '',
            phone_number: profileData[0].phone_number || '',
            address: profileData[0].address || '',
          });
        } else {
            console.log('No profile data found for user, attempting to create new profile.');
            // If no profile data exists, create it
            const { data: newProfileData, error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    name: user.user_metadata?.full_name || '',
                    phone_number: user.user_metadata?.phone_number || '',
                    address: user.user_metadata?.address || '',
                })
                .select() // Select the newly inserted data to use
                .single();

            if (insertError) {
                console.error('Error inserting new profile:', insertError);
                throw insertError;
            }

            console.log('New profile created:', newProfileData);
            // Use the newly created profile data
            setUserProfile({
                id: user.id,
                name: newProfileData.name || '',
                email: user.email || '',
                phone_number: newProfileData.phone_number || '',
                address: newProfileData.address || '',
            });
        }

        // Fetch previous orders from 'orders' table
        console.log('Attempting to fetch orders for user ID:', user.id);
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('id, order_date, total_amount, items, status')
          .eq('user_id', user.id)
          .order('order_date', { ascending: false });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          throw ordersError;
        }

        if (ordersData) {
          console.log('Orders data received:', ordersData);
          setPreviousOrders(ordersData);
        }

      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load profile data.');
        navigate('/login'); // Redirect to login if there's a serious error fetching data
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        throw signOutError;
      }
      navigate('/'); // Redirect to landing page after logout
    } catch (err: any) {
      setError(err.message || 'Failed to log out.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#D1F2EB] to-white">
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#D1F2EB] to-white p-4">
        <p className="text-red-700 text-lg mb-4">Error: {error}</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#0B6E4F] text-white px-6 py-3 rounded-lg hover:bg-[#50C878] transition-colors font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#D1F2EB] to-white p-4">
        <p className="text-gray-700 text-lg mb-4">No profile data found. Please log in.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#0B6E4F] text-white px-6 py-3 rounded-lg hover:bg-[#50C878] transition-colors font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1F2EB] via-white to-[#E8F5F2]">
      {/* Navbar */}
      <div className="bg-[#013220] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">FitMeats</h1>
          <button 
            onClick={handleLogout}
            className="bg-[#50C878] text-[#013220] px-6 py-2 rounded-full hover:bg-white transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            disabled={loading}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-[#013220] mb-8 text-center">
          Welcome Back, {userProfile.name?.split(' ')[0] || 'User'}!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#50C878] to-[#013220] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
                </div>
                <h2 className="text-2xl font-semibold text-[#013220]">{userProfile.name || 'N/A'}</h2>
                <div className="w-full space-y-4 mt-6">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <svg className="w-5 h-5 text-[#50C878]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{userProfile.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <svg className="w-5 h-5 text-[#50C878]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{userProfile.phone_number || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <svg className="w-5 h-5 text-[#50C878]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{userProfile.address || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-[#013220] mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-[#50C878]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Order History
              </h2>
              
              {previousOrders.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-600 text-lg">No orders yet. Start shopping to see your order history!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {previousOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="font-semibold text-lg text-[#013220]">Order #{order.id.substring(0, 8)}</span>
                          <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-gray-500">{new Date(order.order_date).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Total Amount</span>
                          <span className="font-semibold text-[#013220]">₹{order.total_amount.toFixed(0)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-700 mb-2">Order Items:</h3>
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm text-gray-600">
                            <span>{item.title} × {item.quantity}</span>
                            <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};