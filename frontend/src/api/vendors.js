import api from './axios';
export const getVendors = (params) => api.get('/vendors', { params });
export const createEnquiry = (data) => api.post('/vendors/enquiry', data);
export const getMyEnquiries = () => api.get('/vendors/my-enquiries');
export const toggleShortlist = (id) => api.put(`/vendors/enquiry/${id}/shortlist`);
export const updateStatus = (id, status) => api.put(`/vendors/enquiry/${id}/status`, { status });
