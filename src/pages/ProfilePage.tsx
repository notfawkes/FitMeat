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
    <div className="min-h-screen bg-gradient-to-b from-[#D1F2EB] to-white p-4">
      {/* Navbar - You might want a consistent navbar component here */}
      <div className="bg-[#013220] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FitMeats</h1>
          <button 
            onClick={handleLogout}
            className="bg-[#50C878] text-[#013220] px-4 py-2 rounded-md hover:bg-white transition-colors font-medium"
            disabled={loading}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-[#013220] mb-8">Your Profile</h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#013220] mb-6">Profile Details</h2>
          <div className="space-y-4 text-gray-700">
            {/* Profile Picture Placeholder */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold">
                {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
              </div>
              <p className="text-xl font-medium">{userProfile.name || 'N/A'}</p>
            </div>
            <p><span className="font-semibold">Email:</span> {userProfile.email || 'N/A'}</p>
            <p><span className="font-semibold">Phone:</span> {userProfile.phone_number || 'N/A'}</p>
            <p><span className="font-semibold">Address:</span> {userProfile.address || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-[#013220] mb-6">Previous Orders</h2>
          {previousOrders.length === 0 ? (
            <p className="text-gray-600">No previous orders found.</p>
          ) : (
            <div className="space-y-6">
              {previousOrders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-lg">Order #{order.id.substring(0, 8)}</span>
                    <span className="text-gray-500 text-sm">{new Date(order.order_date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-600 mb-2">Total: ₹{order.total_amount.toFixed(0)}</p>
                  <p className={`font-medium ${order.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>Status: {order.status}</p>
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium text-gray-700">Items:</h3>
                    {order.items.map((item) => (
                      <p key={item.id} className="text-sm text-gray-500">
                        - {item.title} x {item.quantity} (₹{item.price.toFixed(0)} each)
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};