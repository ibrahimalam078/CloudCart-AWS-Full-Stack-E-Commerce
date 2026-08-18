import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';
import { SkeletonProductDetail } from '../components/common/LoadingSkeleton';
import { FiShoppingCart, FiArrowLeft, FiCheck, FiX, FiShield, FiStar } from 'react-icons/fi';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id, quantity);
    }
  };

  if (loading) {
    return (
      <div className="container page-container">
        <div className="back-link-skeleton skeleton-pulse" style={{ width: '160px', height: '20px', marginBottom: '1.5rem', borderRadius: '8px' }}></div>
        <SkeletonProductDetail />
      </div>
    );
  }

  if (error || !product)
    return (
      <div className="container page-container">
        <div className="card text-center py-5">
          <h2>Product Not Found</h2>
          <p className="text-muted">{error || 'The requested product does not exist.'}</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Back to Catalog
          </Link>
        </div>
      </div>
    );

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="container page-container">
      <Link to="/products" className="back-link">
        <FiArrowLeft /> Back to Products
      </Link>

      <div className="product-details-grid card">
        {/* Product Image */}
        <div className="product-details-image-container">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-details-image"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
            }}
          />
        </div>

        {/* Product Meta & Actions */}
        <div className="product-details-info">
          <span className="badge badge-primary mb-2">{product.category}</span>
          <h1 className="product-details-title">{product.name}</h1>

          <div className="product-details-price">${product.price.toFixed(2)}</div>

          {/* Rating */}
          {product.rating > 0 && (
            <div className="product-rating">
              <FiStar className="star-icon" />
              <span className="rating-value">{product.rating.toFixed(1)}</span>
              <span className="rating-label">out of 5</span>
            </div>
          )}

          {/* Stock Status */}
          <div className="stock-status">
            {isOutOfStock ? (
              <span className="stock-badge out-of-stock">
                <FiX /> Out of Stock (0 remaining)
              </span>
            ) : (
              <span className="stock-badge in-stock">
                <FiCheck /> In Stock ({product.stock} units available)
              </span>
            )}
          </div>

          <p className="product-details-description">{product.description}</p>

          <div className="s3-meta-card">
            <FiShield /> Asset served from Amazon S3 Storage Key: <code>{product.imageKey}</code>
          </div>

          {/* Quantity Selector & Add to Cart */}
          {!isOutOfStock && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label className="form-label">Quantity:</label>
                <div className="quantity-controls">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button onClick={handleAddToCart} className="btn btn-primary btn-block btn-lg">
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
