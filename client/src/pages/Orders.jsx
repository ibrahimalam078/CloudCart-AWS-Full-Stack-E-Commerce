import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../services/orderService';
import { FiPackage, FiEye, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getUserOrders();
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="badge badge-success"><FiCheckCircle /> Delivered</span>;
      case 'shipped':
        return <span className="badge badge-primary"><FiTruck /> Shipped</span>;
      case 'processing':
        return <span className="badge badge-warning"><FiClock /> Processing</span>;
      case 'cancelled':
        return <span className="badge badge-danger"><FiXCircle /> Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="container page-container">
      <h1 className="page-title">My Orders</h1>
      <p className="subtitle">View and track your order history</p>

      {orders.length === 0 ? (
        <div className="empty-orders-card card">
          <FiPackage size={48} className="empty-icon" />
          <h3>No Orders Found</h3>
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card card">
              <div className="order-card-header">
                <div>
                  <span className="order-id">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                  <div className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="order-card-header-right">
                  {getStatusBadge(order.orderStatus)}
                  <span className="order-total">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="order-items-preview-row">
                {order.items.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="order-item-thumb">
                    <img src={item.imageUrl} alt={item.name} />
                    <span className="thumb-qty">x{item.quantity}</span>
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="order-item-thumb-more">
                    +{order.items.length - 4} more
                  </div>
                )}
              </div>

              <div className="order-card-footer">
                <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                  <FiEye /> View Order Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
