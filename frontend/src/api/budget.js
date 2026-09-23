import api from './axios';
export const getBudgetSummary = () => api.get('/budget');
export const getCategories = () => api.get('/budget/categories');
export const updateAllocation = (category, allocated) => api.put(`/budget/categories/${category}`, { allocated });
export const getExpenses = (params) => api.get('/budget/expenses', { params });
export const addExpense = (data) => api.post('/budget/expenses', data);
export const deleteExpense = (id) => api.delete(`/budget/expenses/${id}`);
