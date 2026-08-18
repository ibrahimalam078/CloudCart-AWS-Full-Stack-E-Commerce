import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { FiCreditCard, FiMapPin, FiCheckCircle, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createOrder(shippingAddress);
      toast.success('Order placed successfully!');
      await clearCart();
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container page-container text-center py-5">
        <h2>Your Cart is Empty</h2>
        <p className="text-muted">Add items to your cart before proceeding to checkout.</p>
      </div>
    );
  }

  return (
    <div className="container page-container">
      <h1 className="page-title">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="checkout-grid">
        {/* Shipping Form */}
        <div className="checkout-form-section card">
          <h3 className="section-title">
            <FiMapPin /> Shipping Address
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              className="form-input"
              placeholder="John Doe"
              value={shippingAddress.fullName}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Street Address</label>
            <input
              type="text"
              name="address"
              required
              className="form-input"
              placeholder="123 AWS Cloud Way, Suite 100"
              value={shippingAddress.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                required
                className="form-input"
                placeholder="Seattle"
                value={shippingAddress.city}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">State / Province</label>
              <input
                type="text"
                name="state"
                required
                className="form-input"
                placeholder="WA"
                value={shippingAddress.state}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Zip / Postal Code</label>
              <input
                type="text"
                name="zipCode"
                required
                className="form-input"
                placeholder="98101"
                value={shippingAddress.zipCode}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="country"
                required
                className="form-input"
                value={shippingAddress.country}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Payment Method Notice */}
          <div className="payment-notice">
            <FiCreditCard size={20} />
            <div>
              <strong>Payment Method: Simulated Instant Checkout</strong>
              <p className="text-muted mb-0">For demo purposes, payment is auto-approved upon order placement.</p>
            </div>
          </div>
        </div>

        {/* Order Items Review */}
        <div className="checkout-summary-section card">
          <h3 className="section-title">Order Items ({cart.items.length})</h3>

          <div className="checkout-items-preview">
            {cart.items.map((item) => {
              if (!item.product) return null;
              return (
                <div key={item.product._id} className="checkout-item-row">
                  <img src={item.product.imageUrl} alt={item.product.name} className="checkout-thumb" />
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.product.name}</span>
                    <span className="text-muted">Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-item-price">${item.itemTotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="checkout-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="text-success">FREE</span>
            </div>
            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span className="total-price">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block btn-lg mt-3">
            {loading ? 'Processing Order...' : <> <FiCheckCircle /> Place Order </>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
