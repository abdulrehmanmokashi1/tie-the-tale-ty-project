import React, { useState, useEffect } from 'react';
import { getVendors, createEnquiry, getMyEnquiries, toggleShortlist, updateStatus } from '../api/vendors';

const VENDOR_CATEGORY_IMAGES = {
  'Photographer': 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
  'Decorator': 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
  'Caterer': 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
  'Makeup Artist': 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  'DJ': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
  'Mehendi Artist': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'Transport': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'
};

const FALLBACK_VENDOR_IMG = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80';

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: 'All', category: 'All' });
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchVendors();
    fetchEnquiries();
  }, []);

  const fetchVendors = async (appliedFilters = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (appliedFilters.city && appliedFilters.city !== 'All') {
        params.city = appliedFilters.city;
      }
      if (appliedFilters.category && appliedFilters.category !== 'All') {
        params.category = appliedFilters.category;
      }

      const res = await getVendors(params);
      const data = res.data?.data || res.data;
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await getMyEnquiries();
      const data = res.data?.data || res.data;
      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
    }
  };

  const handleFilterChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    fetchVendors(updated);
  };

  const handleEnquireSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVendor) return;
    setSending(true);
    try {
      await createEnquiry({
        vendorId: selectedVendor._id,
        message: enquiryMsg
      });
      alert(`Quote request sent to ${selectedVendor.name}! Track progress below in "My Vendor Bookings".`);
      setSelectedVendor(null);
      setEnquiryMsg('');
      fetchEnquiries();
    } catch (err) {
      console.error('Enquiry failed:', err);
      alert('Could not submit enquiry. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await updateStatus(enquiryId, newStatus);
      fetchEnquiries();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleToggleShortlist = async (enquiryId) => {
    try {
      await toggleShortlist(enquiryId);
      fetchEnquiries();
    } catch (err) {
      console.error('Failed to toggle shortlist:', err);
    }
  };

  const getCategoryBadgeColor = (cat) => {
    const map = {
      'Photographer': 'bg-blue-100 text-blue-800 border-blue-200',
      'Decorator': 'bg-purple-100 text-purple-800 border-purple-200',
      'Caterer': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Makeup Artist': 'bg-pink-100 text-pink-800 border-pink-200',
      'DJ': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Mehendi Artist': 'bg-amber-100 text-amber-800 border-amber-200',
      'Transport': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return map[cat] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-gray-900">Vendor Directory & Management</h1>
        <p className="text-gray-600 mt-2">Connect with top wedding photographers, caterers, makeup artists, DJs, and decor specialists.</p>
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
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="rounded-xl border-gray-300 text-sm focus:ring-rose-500 focus:border-rose-500 font-medium py-2 px-3"
          >
            <option value="All">All Categories</option>
            <option value="Photographer">Photographers</option>
            <option value="Decorator">Decorators</option>
            <option value="Caterer">Caterers</option>
            <option value="Makeup Artist">Makeup Artists</option>
            <option value="DJ">DJs</option>
            <option value="Mehendi Artist">Mehendi Artists</option>
          </select>
        </div>

        <div className="self-end">
          <button
            onClick={() => {
              const reset = { city: 'All', category: 'All' };
              setFilters(reset);
              fetchVendors(reset);
            }}
            className="text-gray-500 hover:text-rose-600 text-sm font-medium py-2 px-3 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Vendors Grid */}
      {loading ? (
        <div className="text-center py-20 text-rose-600 font-serif text-2xl">Loading verified vendors...</div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-rose-100 p-8">
          <div className="text-5xl mb-3">👥</div>
          <h3 className="text-xl font-serif font-bold text-gray-800">No vendors found</h3>
          <p className="text-gray-500 mt-1">Try changing your city or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vendors.map(vendor => {
            const imageSrc =
              (vendor.photos && vendor.photos.length > 0 && !vendor.photos[0].includes('picsum.photos'))
                ? vendor.photos[0]
                : VENDOR_CATEGORY_IMAGES[vendor.category] || FALLBACK_VENDOR_IMG;

            return (
              <div
                key={vendor._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-rose-50 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={imageSrc}
                      alt={vendor.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_VENDOR_IMG;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-md">
                      📍 {vendor.city}
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${getCategoryBadgeColor(vendor.category)}`}>
                        {vendor.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-serif font-bold text-gray-900 group-hover:text-rose-700 transition-colors">
                        {vendor.name}
                      </h3>
                      <span className="flex items-center text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 shrink-0">
                        ★ {vendor.rating || 4.8}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2">{vendor.description}</p>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>📧 {vendor.contactEmail || 'Available on request'}</span>
                      <span>📞 {vendor.contactPhone || 'Available on request'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-50 bg-rose-50/20">
                  <div>
                    <p className="text-[11px] text-gray-500 font-medium">Starting from</p>
                    <p className="font-bold text-gray-900 text-base">
                      {vendor.category === 'Caterer'
                        ? `₹${(vendor.startingPrice || 1200).toLocaleString('en-IN')}/plate`
                        : `₹${(vendor.startingPrice || 25000).toLocaleString('en-IN')}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedVendor(vendor)}
                    className="bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 shadow-sm transition-colors cursor-pointer"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My Bookings / Enquiries Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-rose-100 space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-900">My Vendor Bookings & Quotations</h2>
          <p className="text-sm text-gray-500 mt-1">Track quotation requests, shortlisted artists, and confirmed bookings in one place.</p>
        </div>

        {enquiries.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            No vendor enquiries yet. Click <strong>"Request Quote"</strong> on any vendor above to start!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-rose-50/60 text-gray-700 font-semibold border-b border-rose-100">
                <tr>
                  <th className="px-6 py-3.5">Vendor</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">My Message</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-center">Shortlist</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map(enq => (
                  <tr key={enq._id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{enq.vendor?.name || 'Vendor'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getCategoryBadgeColor(enq.vendor?.category)}`}>
                        {enq.vendor?.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">"{enq.message}"</td>
                    <td className="px-6 py-4">
                      <select
                        value={enq.status || 'Enquired'}
                        onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        className="text-xs font-semibold rounded-lg border-gray-300 py-1.5 px-2.5 focus:ring-rose-500 focus:border-rose-500 bg-white"
                      >
                        <option value="Enquired">Enquired</option>
                        <option value="Quoted">Quoted</option>
                        <option value="Booked">Booked</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleShortlist(enq._id)}
                        className={`text-xl transition-transform hover:scale-125 cursor-pointer ${
                          enq.isShortlisted ? 'text-rose-600' : 'text-gray-300 hover:text-rose-400'
                        }`}
                        title={enq.isShortlisted ? 'Shortlisted' : 'Click to shortlist'}
                      >
                        {enq.isShortlisted ? '❤️' : '🤍'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">
              Request Quotation
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Sending enquiry to <strong className="text-rose-700">{selectedVendor.name}</strong> ({selectedVendor.category} in {selectedVendor.city})
            </p>
            <form onSubmit={handleEnquireSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Requirements & Event Date</label>
                <textarea
                  required
                  rows="4"
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:ring-rose-500 focus:border-rose-500 text-sm p-3"
                  placeholder="Hi, I am looking for your services for my wedding in Goa on December 15. We expect around 250 guests. Please share your availability and package details..."
                  value={enquiryMsg}
                  onChange={(e) => setEnquiryMsg(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedVendor(null)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-6 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 shadow font-medium transition-colors disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorsPage;
