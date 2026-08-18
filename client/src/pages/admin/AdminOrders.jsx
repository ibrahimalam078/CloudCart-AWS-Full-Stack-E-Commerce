import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/adminService';
import { FiList, FiClock, FiTruck, FiCheckCircle, FiXCircle, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrdersList = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await getAllOrders(params);
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersList();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to '${newStatus}'`);
      fetchOrdersList();
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="container page-container">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Manage Customer Orders</h1>
          <p className="subtitle">View all customer orders and update status (processing, shipped, delivered, cancelled)</p>
        </div>

        <div className="sort-wrapper">
          <FiFilter /> Filter Status:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select sort-select"
          >
            <option value="">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Shipping Address</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td className="font-weight-bold">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td>
                        <div className="font-weight-bold">{order.user?.name || 'Customer'}</div>
                        <div className="text-muted text-xs">{order.user?.email}</div>
                      </td>
                      <td className="text-xs">
                        {order.shippingAddress?.address}, {order.shippingAddress?.city}
                      </td>
                      <td>{order.items?.length || 0} item(s)</td>
                      <td className="font-weight-bold">${order.totalAmount.toFixed(2)}</td>
                      <td>
                        <span
                          className={`badge badge-${
                            order.orderStatus === 'delivered'
                              ? 'success'
                              : order.orderStatus === 'cancelled'
                              ? 'danger'
                              : order.orderStatus === 'shipped'
                              ? 'primary'
                              : 'warning'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="form-select status-select-sm"
                        >
                          <option value="processing">processing</option>
                          <option value="shipped">shipped</option>
                          <option value="delivered">delivered</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
