import API from './api';

export const getAdminStats = async () => {
  const res = await API.get('/admin/stats');
  return res.data;
};

export const getAllOrders = async (params = {}) => {
  const res = await API.get('/admin/orders', { params });
  return res.data;
};

export const updateOrderStatus = async (orderId, orderStatus) => {
  const res = await API.put(`/admin/orders/${orderId}/status`, { orderStatus });
  return res.data;
};
