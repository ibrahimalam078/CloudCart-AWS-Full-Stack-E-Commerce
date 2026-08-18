import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiTrash } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart, totalAmount, itemCount } =
    useCart();
  const navigate = useNavigate();

  if (loading) return <div className="spinner"></div>;

  const isCartEmpty = !cart.items || cart.items.length === 0;

  return (
    <div className="container page-container">
      <div className="cart-header">
        <h1 className="page-title">Shopping Cart ({itemCount} items)</h1>
        {!isCartEmpty && (
          <button onClick={clearCart} className="btn btn-secondary btn-sm text-danger">
            <FiTrash /> Clear Cart
          </button>
        )}
      </div>

      {isCartEmpty ? (
        <div className="empty-cart-card card">
          <div className="empty-cart-icon">
            <FiShoppingBag />
          </div>
          <h2>Your Cart is Empty</h2>
          <p className="text-muted">Explore our catalog to add items to your shopping cart.</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Cart Item List */}
          <div className="cart-items-list card">
            {cart.items.map((item) => {
              if (!item.product) return null;
              return (
                <div key={item.product._id} className="cart-item">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="cart-item-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                    }}
                  />

                  <div className="cart-item-details">
                    <Link to={`/products/${item.product._id}`} className="cart-item-title">
                      {item.product.name}
                    </Link>
                    <span className="badge badge-primary">{item.product.category}</span>
                    <div className="cart-item-unit-price">${item.product.price.toFixed(2)} each</div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-item-quantity">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="cart-quantity-val">{item.quantity}</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">${item.itemTotal.toFixed(2)}</div>

                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="btn-remove-item"
                    title="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Card */}
          <div className="cart-summary-card card">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({itemCount} items)</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Shipping</span>
              <span className="text-success">FREE</span>
            </div>

            <div className="summary-row">
              <span>Estimated Tax</span>
              <span>$0.00</span>
            </div>

            <div className="summary-row total-row">
              <span>Total</span>
              <span className="total-price">${totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-block btn-lg mt-3"
            >
              Proceed to Checkout <FiArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
