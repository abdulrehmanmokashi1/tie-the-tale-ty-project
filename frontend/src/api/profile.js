import api from './axios';
export const getProfile = () => api.get('/profile');
export const saveProfile = (data) => api.post('/profile', data);
export const toggleWishlist = (venueId) => api.post(`/profile/wishlist/${venueId}`);
