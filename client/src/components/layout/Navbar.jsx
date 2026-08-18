import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiGrid,
  FiMenu,
  FiX,
  FiShield,
  FiHome,
  FiLayers,
  FiCpu,
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, openDrawer } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobile}>
          <span className="brand-badge">AWS</span>
          <span className="brand-text">CloudCart</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation Links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <FiHome /> Home
          </Link>

          <Link
            to="/products"
            className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <FiGrid /> Products
          </Link>

          <Link
            to="/products"
            className={`nav-link ${location.search.includes('category') ? 'active' : ''}`}
            onClick={closeMobile}
          >
            <FiLayers /> Categories
          </Link>

          <a
            href="/#architecture"
            className="nav-link"
            onClick={closeMobile}
          >
            <FiCpu /> Architecture
          </a>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`nav-link admin-link ${isActive('/admin') ? 'active' : ''}`}
                  onClick={closeMobile}
                >
                  <FiShield /> Admin Dashboard
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  openDrawer();
                }}
                className="nav-link cart-link btn-cart-trigger"
              >
                <FiShoppingCart size={20} />
                <span>Cart</span>
                {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </button>

              <div className="user-dropdown">
                <Link
                  to="/profile"
                  className="user-profile-btn"
                  onClick={closeMobile}
                >
                  <FiUser /> {user.name.split(' ')[0]}
                  {isAdmin && <span className="role-tag">Admin</span>}
                </Link>

                <button onClick={handleLogout} className="btn-logout">
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link
                to="/login"
                className="btn btn-outline btn-sm"
                onClick={closeMobile}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                onClick={closeMobile}
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
