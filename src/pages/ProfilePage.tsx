import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export const ProfilePage: React.FC = () => {
  const { user, profile, orders, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#D1F2EB] to-white">
        <p className="text-gray-700 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1F2EB] via-white to-[#E8F5F2]">
      <div className="bg-[#013220] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FitMeats</h1>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="bg-[#50C878] text-[#013220] px-6 py-2 rounded-full hover:bg-white transition-all duration-300 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold text-[#013220] mb-8 text-center">
          Welcome Back, {profile?.name?.split(' ')[0] ?? user.email.split('@')[0]}!
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#50C878] to-[#013220] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {(profile?.name || user.email)[0].toUpperCase()}
                </div>
                <h2 className="text-2xl font-semibold text-[#013220]">{profile?.name ?? 'N/A'}</h2>
                <div className="w-full space-y-4 mt-6 text-gray-700">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">Email:</span>
                    <span>{profile?.email ?? user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">Phone:</span>
                    <span>{profile?.phone_number ?? 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold">Address:</span>
                    <span>{profile?.address ?? 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-[#013220] mb-6">Order History</h2>

              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-600 text-lg">No orders yet. Start shopping to see your order history!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
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
                          <span className="font-semibold text-[#013220]">₹{Number(order.total_amount ?? 0).toFixed(0)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-700 mb-2">Order Items:</h3>
                        {(order.items as OrderItem[]).map((item) => (
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
