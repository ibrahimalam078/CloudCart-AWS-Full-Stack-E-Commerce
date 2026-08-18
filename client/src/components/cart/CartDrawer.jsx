import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiX, FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import './CartDrawer.css';

const CartDrawer = () => {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart, totalAmount, itemCount } =
    useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeDrawer();
    navigate('/cart');
  };

  const isCartEmpty = !cart.items || cart.items.length === 0;

  return (
    <div className="cart-drawer-overlay" onClick={closeDrawer}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="flex items-center gap-2">
            <FiShoppingBag size={22} className="text-primary" />
            <h3 className="drawer-title">Your Cart ({itemCount})</h3>
          </div>
          <button onClick={closeDrawer} className="btn-close-drawer" aria-label="Close Cart">
            <FiX size={22} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-body">
          {isCartEmpty ? (
            <div className="drawer-empty-state">
              <FiShoppingBag size={48} className="text-muted mb-3" />
              <h4>Your Cart is Empty</h4>
              <p className="text-muted text-sm">Add items from our catalog to get started.</p>
            </div>
          ) : (
            <div className="drawer-items-list">
              {cart.items.map((item) => {
                if (!item.product) return null;
                return (
                  <div key={item.product._id} className="drawer-item-row">
                    <img src={item.product.imageUrl} alt={item.product.name} className="drawer-item-img" />

                    <div className="drawer-item-info">
                      <span className="drawer-item-title">{item.product.name}</span>
                      <span className="drawer-item-price">${item.product.price.toFixed(2)}</span>

                      <div className="drawer-quantity-controls">
                        <button
                          className="btn-qty"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="btn-qty"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="drawer-item-actions">
                      <span className="drawer-item-subtotal">${item.itemTotal.toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="btn-remove-drawer"
                        title="Remove"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {!isCartEmpty && (
          <div className="cart-drawer-footer">
            <div className="drawer-subtotal-row">
              <span>Subtotal</span>
              <span className="drawer-total-price">${totalAmount.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted mb-3">Taxes and shipping calculated at checkout.</p>

            <div className="drawer-buttons-group">
              <button onClick={handleCheckoutClick} className="btn btn-primary btn-block btn-lg">
                Checkout Now <FiArrowRight />
              </button>
              <button onClick={handleViewCartClick} className="btn btn-secondary btn-block btn-sm">
                View Full Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
