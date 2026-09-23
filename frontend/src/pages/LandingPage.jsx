import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-rose-50 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-br from-rose-700 to-rose-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">Plan Your Dream Wedding</h1>
          <p className="text-xl md:text-2xl mb-10 text-rose-100 font-light max-w-2xl mx-auto">
            TieTheTale makes it effortless to organize your venues, vendors, budget, and events all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth" className="px-8 py-4 bg-gold hover:bg-gold-light text-rose-900 font-semibold rounded-full shadow-lg transition-all text-lg border border-transparent">
              Get Started
            </Link>
            <Link to="/auth" className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold rounded-full shadow-lg transition-all text-lg">
              Explore Venues
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center text-rose-700 mb-16">Why Choose TieTheTale?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-rose-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Destination Planning</h3>
              <p className="text-gray-600">Find the perfect location from Goa to Udaipur with detailed insights.</p>
            </div>
            <div className="bg-rose-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Budget Planner</h3>
              <p className="text-gray-600">Keep track of every rupee with our smart, visual budget management tools.</p>
            </div>
            <div className="bg-rose-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">🏨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Venue Explorer</h3>
              <p className="text-gray-600">Discover handpicked venues that match your dream aesthetic and capacity.</p>
            </div>
            <div className="bg-rose-50 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Vendor Management</h3>
              <p className="text-gray-600">Connect with top-rated photographers, decorators, and caterers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-rose-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-rose-700 mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
            <div className="flex-1 z-10">
              <div className="w-16 h-16 bg-rose-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">1</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your wedding profile and set your core details.</p>
            </div>
            <div className="flex-1 z-10">
              <div className="w-16 h-16 bg-rose-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">2</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Plan</h3>
              <p className="text-gray-600">Use our tools to build out your budget, guest list, and events.</p>
            </div>
            <div className="flex-1 z-10">
              <div className="w-16 h-16 bg-rose-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">3</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Celebrate</h3>
              <p className="text-gray-600">Enjoy a stress-free beautiful wedding day knowing everything is sorted.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-rose-900 text-rose-100 py-8 text-center">
        <p>&copy; {new Date().getFullYear()} TieTheTale. All rights reserved. Made with ❤️</p>
      </footer>
    </div>
  );
};

export default LandingPage;
