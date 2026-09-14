import api from './axiosConfig';

export const getHabits = () => api.get('/habits');
export const createHabit = (data) => api.post('/habits', data);
export const checkInHabit = (id) => api.post(`/habits/${id}/checkin`);
export const deleteHabit = (id) => api.delete(`/habits/${id}`);
