import api from './axiosConfig';

export const getWorkouts = () => api.get('/workouts');
export const createWorkout = (data) => api.post('/workouts', data);
export const updateWorkout = (id, data) => api.put(`/workouts/${id}`, data);
export const deleteWorkout = (id) => api.delete(`/workouts/${id}`);
