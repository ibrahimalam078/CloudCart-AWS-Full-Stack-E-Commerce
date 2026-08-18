import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import {
  FiArrowLeft,
  FiMapPin,
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiCheck,
  FiClock,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import './OrderDetails.css';

const STEPS = [
  { key: 'placed', label: 'Order Placed', icon: FiCheck },
  { key: 'processing', label: 'Processing', icon: FiClock },
  { key: 'shipped', label: 'Shipped', icon: FiTruck },
  { key: 'delivered', label: 'Delivered', icon: FiCheckCircle },
];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="spinner"></div>;
  if (error || !order)
    return (
      <div className="container page-container">
        <div className="card text-center py-5">
          <h2>Order Not Found</h2>
          <p className="text-muted">{error || 'Order details unavailable.'}</p>
          <Link to="/orders" className="btn btn-primary mt-3">
            Back to Orders
          </Link>
        </div>
      </div>
    );

  const getStepStatus = (stepKey) => {
    if (order.orderStatus === 'cancelled') return 'cancelled';
    const statusOrder = ['placed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.orderStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="container page-container">
      <Link to="/orders" className="back-link">
        <FiArrowLeft /> Back to Orders
      </Link>

      <div className="order-details-header">
        <div>
          <h1 className="page-title mb-1">
            Order #{order._id.substring(order._id.length - 8).toUpperCase()}
          </h1>
          <div className="text-muted flex gap-3">
            <span><FiCalendar /> Placed on {new Date(order.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <span className={`badge badge-${order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'cancelled' ? 'danger' : 'warning'} badge-lg`}>
          {order.orderStatus.toUpperCase()}
        </span>
      </div>

      {/* Animated Order Tracker Progress Bar */}
      <div className="card order-tracker-card mb-4">
        <h3 className="card-section-title">Order Status Timeline</h3>
        {order.orderStatus === 'cancelled' ? (
          <div className="order-cancelled-banner">
            <FiXCircle size={28} />
            <div>
              <strong>Order Cancelled</strong>
              <p className="mb-0 text-xs">This order has been cancelled and stock returned to inventory.</p>
            </div>
          </div>
        ) : (
          <div className="tracker-timeline">
            {STEPS.map((step, index) => {
              const status = getStepStatus(step.key);
              const StepIcon = step.icon;
              return (
                <div key={step.key} className={`tracker-step ${status}`}>
                  <div className="step-node">
                    <StepIcon size={18} />
                  </div>
                  <span className="step-label">{step.label}</span>
                  {index < STEPS.length - 1 && <div className="step-connector"></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="order-details-grid">
        {/* Items List */}
        <div className="order-items-card card">
          <h3 className="card-section-title"><FiPackage /> Purchased Items</h3>
          <div className="order-items-table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="order-item-flex">
                        <img src={item.imageUrl} alt={item.name} className="order-item-img" />
                        <span className="font-weight-bold">{item.name}</span>
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>x{item.quantity}</td>
                    <td className="text-right font-weight-bold">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Address & Order Summary Sidebar */}
        <div className="order-sidebar">
          <div className="card mb-4">
            <h3 className="card-section-title"><FiMapPin /> Shipping Address</h3>
            <p className="font-weight-bold mb-1">{order.shippingAddress.fullName}</p>
            <p className="text-muted mb-0">{order.shippingAddress.address}</p>
            <p className="text-muted mb-0">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p className="text-muted mb-0">{order.shippingAddress.country}</p>
          </div>

          <div className="card">
            <h3 className="card-section-title"><FiDollarSign /> Payment & Total</h3>
            <div className="summary-row">
              <span>Payment Status:</span>
              <span className="badge badge-success">{order.paymentStatus}</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span className="total-price">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
