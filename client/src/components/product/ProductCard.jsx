import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiEye, FiStar } from 'react-icons/fi';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product._id, 1);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="product-card">
      <div className="product-card-image-wrapper">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
          width="400"
          height="400"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
          }}
        />
        <span className="product-card-category">{product.category}</span>
        {isOutOfStock && <span className="badge badge-danger out-of-stock-badge">Out of Stock</span>}
        {isLowStock && <span className="badge badge-warning low-stock-badge">Low Stock</span>}
      </div>

      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-desc">{product.description}</p>

        {product.rating > 0 && (
          <div className="product-card-rating">
            <FiStar className="star-filled" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="product-card-stock-line">
          {isOutOfStock ? (
            <span className="stock-text out">Out of Stock</span>
          ) : isLowStock ? (
            <span className="stock-text low">Only {product.stock} left</span>
          ) : (
            <span className="stock-text available">In Stock</span>
          )}
        </div>

        <div className="product-card-footer">
          <div className="product-card-price">${product.price.toFixed(2)}</div>

          <div className="product-card-actions">
            <Link to={`/products/${product._id}`} className="btn btn-secondary btn-sm" title="View Details">
              <FiEye /> Details
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn btn-primary btn-sm"
              title="Add to Cart"
            >
              <FiShoppingCart /> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
