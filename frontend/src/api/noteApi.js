import api from './axiosConfig';

export const getNotes = (search = '') =>
  api.get('/notes', { params: search ? { search } : {} });
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
