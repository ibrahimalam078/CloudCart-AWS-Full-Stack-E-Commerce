import API from './api';

export const createOrder = async (shippingAddress) => {
  const res = await API.post('/orders', { shippingAddress });
  return res.data;
};

export const getUserOrders = async (params = {}) => {
  const res = await API.get('/orders', { params });
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await API.get(`/orders/${id}`);
  return res.data;
};
