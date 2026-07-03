import api from './axios';

export const fetchOrders = (params = {}) =>
  api.get('/orders', { params }).then((res) => res.data);

export const fetchOrderStats = () =>
  api.get('/orders/stats').then((res) => res.data);

export const fetchOrderById = (id) =>
  api.get(`/orders/${id}`).then((res) => res.data);

export const createOrder = (data) =>
  api.post('/orders', data).then((res) => res.data);

export const updateOrder = (id, data) =>
  api.put(`/orders/${id}`, data).then((res) => res.data);

export const deleteOrder = (id) =>
  api.delete(`/orders/${id}`).then((res) => res.data);
