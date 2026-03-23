import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const user = localStorage.getItem('localbuy_user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  signup: (data) => API.post('/auth/signup', data),
};

export const productAPI = {
  addProduct: (formData) =>
    API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMyProducts: () => API.get('/products/my'),
  getAllProducts: () => API.get('/products/all'),
  deleteProduct: (id) => API.delete(`/products/${id}`),
};

export default API;
