import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, saveProfile } from '../api/profile';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    destination: 'Goa',
    guestCount: 100,
    totalBudget: 1000000
  });

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const profileData = res.data?.data || res.data;
      if (profileData && profileData._id) {
        setProfile(profileData);
        setFormData({
          brideName: profileData.brideName || '',
          groomName: profileData.groomName || '',
          weddingDate: profileData.weddingDate ? new Date(profileData.weddingDate).toISOString().split('T')[0] : '',
          destination: profileData.destination || 'Goa',
          guestCount: profileData.guestCount || 100,
          totalBudget: profileData.totalBudget || 1000000
        });
      }
    } catch (err) {
      if (err.response?.status !== 404) console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestCount' || name === 'totalBudget' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await saveProfile(formData);
      const saved = res.data?.data || res.data;
      setProfile(saved);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert('Could not save profile. Please check your inputs.');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-rose-600 font-serif text-2xl">Loading Dashboard...</div>;
  }

  const calculateDays = (dateStr) => {
    if (!dateStr) return 0;
    const target = new Date(dateStr);
    const now = new Date();
    // Normalize both to start of day for accurate countdown
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  if (!profile || isEditing) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-rose-100">
          <h2 className="text-3xl font-serif font-bold text-rose-700 mb-6 text-center">
            {profile ? 'Edit Wedding Profile' : 'Set Up Your Wedding Profile'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bride's Name</label>
                <input
                  required
                  type="text"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Groom's Name</label>
                <input
                  required
                  type="text"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Wedding Date</label>
                <input
                  required
                  type="date"
                  name="weddingDate"
                  value={formData.weddingDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <select
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                >
                  <option value="Goa">Goa</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Udaipur">Udaipur</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Guests</label>
                <input
                  required
                  type="number"
                  name="guestCount"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Budget (₹)</label>
                <input
                  required
                  type="number"
                  name="totalBudget"
                  value={formData.totalBudget}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              {profile && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 shadow-sm font-medium"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const daysLeft = calculateDays(profile.weddingDate);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-800 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-20 text-9xl">💍</div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
            Welcome, {profile.brideName} <span className="text-amber-300">❤️</span> {profile.groomName}!
          </h1>
          <p className="text-rose-100 text-lg">Your beautiful journey to {profile.destination} awaits.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors font-medium cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-2xl">📅</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Countdown</p>
            <p className="text-2xl font-bold text-gray-900">{daysLeft} Days</p>
            {profile.weddingDate && (
              <p className="text-xs text-gray-400 mt-0.5">{new Date(profile.weddingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-2xl">📍</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Destination</p>
            <p className="text-xl font-bold text-gray-900 truncate">{profile.destination}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl">👥</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Guests</p>
            <p className="text-2xl font-bold text-gray-900">{profile.guestCount || 0}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl">💰</div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Budget</p>
            <p className="text-xl font-bold text-gray-900">₹{(profile.totalBudget ?? 0).toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <h2 className="text-2xl font-serif font-bold text-gray-800 mt-12 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Link to="/events" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100 group">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎭</div>
          <h3 className="font-semibold text-gray-800">Plan Events</h3>
        </Link>
        <Link to="/venues" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100 group">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏰</div>
          <h3 className="font-semibold text-gray-800">Explore Venues</h3>
        </Link>
        <Link to="/budget" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100 group">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📈</div>
          <h3 className="font-semibold text-gray-800">Track Budget</h3>
        </Link>
        <Link to="/vendors" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100 group">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📷</div>
          <h3 className="font-semibold text-gray-800">Book Vendors</h3>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
