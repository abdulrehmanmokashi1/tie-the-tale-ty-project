import React, { useState, useEffect } from 'react';
import { getEvents, createEvent, deleteEvent } from '../api/events';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    eventType: 'Haldi',
    date: '',
    time: '',
    venueName: '',
    guestCount: 100,
    status: 'Planned',
    notes: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getEvents();
      const data = res.data?.data || res.data;
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestCount' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      setIsModalOpen(false);
      setFormData({
        eventType: 'Haldi',
        date: '',
        time: '',
        venueName: '',
        guestCount: 100,
        status: 'Planned',
        notes: ''
      });
      fetchEvents();
    } catch (err) {
      console.error('Failed to create event:', err);
      alert('Could not save event. Please check inputs and try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        fetchEvents();
      } catch (err) {
        console.error('Failed to delete event:', err);
      }
    }
  };

  const getBadgeColor = (type) => {
    const colors = {
      'Haldi': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Mehendi': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Sangeet': 'bg-purple-100 text-purple-800 border-purple-200',
      'Wedding': 'bg-rose-100 text-rose-800 border-rose-200',
      'Reception': 'bg-blue-100 text-blue-800 border-blue-200',
      'Nikah': 'bg-teal-100 text-teal-800 border-teal-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Done':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">Wedding Events Tracker</h1>
          <p className="text-gray-600 mt-1">Organize all your ceremonies from Haldi to Reception in one place.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-600 text-white px-6 py-2.5 rounded-xl hover:bg-rose-700 shadow-md font-medium transition-colors cursor-pointer"
        >
          + Add Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-rose-600 font-serif text-2xl">Loading Events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-rose-100 p-8">
          <div className="text-6xl mb-4">🎭</div>
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">No events added yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Start planning your Haldi, Mehendi, Sangeet, Wedding, and Reception ceremonies!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-rose-600 text-white px-6 py-2.5 rounded-xl hover:bg-rose-700 shadow font-medium transition-colors"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(ev => {
            const type = ev.eventType || ev.type || 'Wedding';
            return (
              <div
                key={ev._id || ev.id}
                className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(type)}`}>
                      {type}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusBadge(ev.status)}`}>
                      {ev.status || 'Planned'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900">{type} Ceremony</h3>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{ev.date ? new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBD'} {ev.time ? `at ${ev.time}` : ''}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="truncate">{ev.venueName || 'Venue TBD'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>👥</span>
                      <span>{ev.guestCount || 0} Guests Expected</span>
                    </p>
                  </div>
                  {ev.notes && (
                    <div className="text-xs text-gray-500 bg-rose-50/50 p-3 rounded-xl border border-rose-100/50 italic">
                      "{ev.notes}"
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => handleDelete(ev._id || ev.id)}
                    className="text-rose-600 hover:text-rose-800 text-sm font-medium transition-colors"
                  >
                    Delete Event
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-rose-100 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Add New Ceremony / Event</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Type</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                >
                  <option value="Haldi">Haldi</option>
                  <option value="Mehendi">Mehendi</option>
                  <option value="Sangeet">Sangeet</option>
                  <option value="Nikah">Nikah</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Reception">Reception</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    required
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    required
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Venue Name</label>
                <input
                  type="text"
                  name="venueName"
                  placeholder="e.g. Grand Ballroom, Taj Palace"
                  value={formData.venueName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Guests</label>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  >
                    <option value="Planned">Planned</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes & Special Details</label>
                <textarea
                  name="notes"
                  rows="2"
                  placeholder="e.g. Yellow dress code, Dholak artist arriving at 4 PM"
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 shadow font-medium transition-colors"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
