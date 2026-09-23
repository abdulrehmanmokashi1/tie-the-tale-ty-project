import React, { useState, useEffect } from 'react';
import { getVenues } from '../api/venues';
import { getProfile, toggleWishlist } from '../api/profile';

const DEFAULT_VENUE_IMAGES = {
  'Taj Exotica Resort & Spa': 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
  'The Leela Goa': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'W Goa': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'Rambagh Palace': 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
  'Fairmont Jaipur': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
  'Shiv Vilas Resort': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80',
  'Chomu Palace': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
  'The Oberoi Udaivilas': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
  'Taj Lake Palace': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80',
  'RAAS Devigarh': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
  'Umaid Bhawan': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
};

const FALLBACK_VENUE_IMG = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';

const VenuesPage = () => {
  const [venues, setVenues] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: 'All', minCapacity: 'All', maxPrice: 'All' });

  useEffect(() => {
    fetchProfileWishlist();
    fetchVenues();
  }, []);

  const fetchProfileWishlist = async () => {
    try {
      const res = await getProfile();
      const p = res.data?.data || res.data;
      if (p?.wishlistedVenues) {
        const ids = p.wishlistedVenues.map(v => (typeof v === 'object' ? v._id : v));
        setWishlist(ids);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVenues = async (appliedFilters = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (appliedFilters.city && appliedFilters.city !== 'All') {
        params.city = appliedFilters.city;
      }
      if (appliedFilters.minCapacity && appliedFilters.minCapacity !== 'All') {
        params.minCapacity = appliedFilters.minCapacity;
      }
      if (appliedFilters.maxPrice && appliedFilters.maxPrice !== 'All') {
        params.maxPrice = appliedFilters.maxPrice;
      }

      const res = await getVenues(params);
      const data = res.data?.data || res.data;
      setVenues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch venues:', err);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    fetchVenues(updated);
  };

  const handleWishlist = async (id) => {
    try {
      const res = await toggleWishlist(id);
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setWishlist(data);
      } else {
        setWishlist(prev =>
          prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
      }
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  const getVenueImage = (venue) => {
    if (venue.name && DEFAULT_VENUE_IMAGES[venue.name]) {
      return DEFAULT_VENUE_IMAGES[venue.name];
    }
    if (venue.photos && venue.photos.length > 0 && !venue.photos[0].includes('picsum.photos')) {
      return venue.photos[0];
    }
    return DEFAULT_VENUE_IMAGES[venue.name] || FALLBACK_VENUE_IMG;
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900">Destination & Venue Explorer</h1>
        <p className="text-gray-600 mt-2">Discover palatial heritage hotels, tranquil beach resorts, and grand banquets across India.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-100 flex flex-wrap gap-4 items-center justify-center">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Destination City</label>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="rounded-xl border-gray-300 text-sm focus:ring-rose-500 focus:border-rose-500 font-medium py-2 px-3"
          >
            <option value="All">All Cities</option>
            <option value="Goa">Goa</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Udaipur">Udaipur</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Min Capacity</label>
          <select
            name="minCapacity"
            value={filters.minCapacity}
            onChange={handleFilterChange}
            className="rounded-xl border-gray-300 text-sm focus:ring-rose-500 focus:border-rose-500 font-medium py-2 px-3"
          >
            <option value="All">Any Capacity</option>
            <option value="500">500+ Guests</option>
            <option value="800">800+ Guests</option>
            <option value="1200">1200+ Guests</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Budget Per Day</label>
          <select
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="rounded-xl border-gray-300 text-sm focus:ring-rose-500 focus:border-rose-500 font-medium py-2 px-3"
          >
            <option value="All">Any Budget</option>
            <option value="500000">Up to ₹5 Lakh</option>
            <option value="800000">Up to ₹8 Lakh</option>
            <option value="1200000">Up to ₹12 Lakh</option>
            <option value="2000000">Up to ₹20 Lakh</option>
          </select>
        </div>

        <div className="self-end">
          <button
            onClick={() => {
              const reset = { city: 'All', minCapacity: 'All', maxPrice: 'All' };
              setFilters(reset);
              fetchVenues(reset);
            }}
            className="text-gray-500 hover:text-rose-600 text-sm font-medium py-2 px-3 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Venues Grid */}
      {loading ? (
        <div className="text-center py-20 text-rose-600 font-serif text-2xl">Finding perfect venues...</div>
      ) : venues.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-rose-100 p-8">
          <div className="text-5xl mb-3">🏰</div>
          <h3 className="text-xl font-serif font-bold text-gray-800">No venues matched your search</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters to see more venues.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map(venue => {
            const isWishlisted = wishlist.includes(venue._id);
            const imageSrc = getVenueImage(venue);

            return (
              <div
                key={venue._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-rose-50 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img
                      src={imageSrc}
                      alt={venue.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_VENUE_IMG;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-md">
                      📍 {venue.city}
                    </div>
                    <button
                      onClick={() => handleWishlist(venue._id)}
                      className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-600 text-white scale-110'
                          : 'bg-white/90 text-gray-400 hover:text-rose-600 hover:scale-110'
                      }`}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      ♥
                    </button>
                    <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-medium">
                      {venue.type || 'Venue'}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-rose-700 transition-colors line-clamp-1">
                        {venue.name}
                      </h3>
                      <span className="flex items-center text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 shrink-0">
                        ★ {venue.rating || 4.8}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2">{venue.description || venue.location}</p>

                    <div className="grid grid-cols-2 gap-3 py-2 border-y border-gray-100 text-xs text-gray-600">
                      <div>
                        <span className="text-gray-400 block">Capacity</span>
                        <span className="font-semibold text-gray-900 text-sm">👥 {venue.capacity} Guests</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Est. Cost</span>
                        <span className="font-semibold text-rose-700 text-sm">
                          ₹{((venue.pricePerDay || 0) / 100000).toFixed(1)} Lakh / day
                        </span>
                      </div>
                    </div>

                    {venue.facilities && venue.facilities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {venue.facilities.slice(0, 4).map((fac, idx) => (
                          <span
                            key={idx}
                            className="bg-rose-50/60 text-gray-600 text-[11px] px-2 py-0.5 rounded-md border border-rose-100"
                          >
                            ✓ {fac}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleWishlist(venue._id)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                      isWishlisted
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm'
                    }`}
                  >
                    {isWishlisted ? '❤️ Shortlisted in Wishlist' : '♡ Add to Wishlist'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VenuesPage;
