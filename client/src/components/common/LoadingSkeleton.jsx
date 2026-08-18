import React from 'react';
import './LoadingSkeleton.css';

export const SkeletonProductCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-image skeleton-pulse"></div>
    <div className="skeleton-content">
      <div className="skeleton-badge skeleton-pulse"></div>
      <div className="skeleton-title skeleton-pulse"></div>
      <div className="skeleton-text skeleton-pulse"></div>
      <div className="skeleton-footer">
        <div className="skeleton-price skeleton-pulse"></div>
        <div className="skeleton-actions skeleton-pulse"></div>
      </div>
    </div>
  </div>
);

export const SkeletonProductGrid = ({ count = 8 }) => (
  <div className="products-grid">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonProductCard key={i} />
    ))}
  </div>
);

export const SkeletonProductDetail = () => (
  <div className="skeleton-detail-grid card">
    <div className="skeleton-detail-image skeleton-pulse"></div>
    <div className="skeleton-detail-info">
      <div className="skeleton-badge skeleton-pulse" style={{ width: '80px' }}></div>
      <div className="skeleton-title skeleton-pulse" style={{ width: '70%', height: '32px' }}></div>
      <div className="skeleton-price skeleton-pulse" style={{ width: '120px', height: '28px' }}></div>
      <div className="skeleton-text skeleton-pulse" style={{ width: '160px' }}></div>
      <div className="skeleton-text skeleton-pulse" style={{ width: '100%', height: '60px' }}></div>
      <div className="skeleton-text skeleton-pulse" style={{ width: '100%', height: '48px' }}></div>
    </div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, message, action }) => (
  <div className="empty-state-container">
    {Icon && <div className="empty-state-icon"><Icon size={48} /></div>}
    <h3 className="empty-state-title">{title}</h3>
    <p className="empty-state-message">{message}</p>
    {action && action}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="error-state-container">
    <div className="error-state-icon">⚠️</div>
    <h3 className="error-state-title">Something went wrong</h3>
    <p className="error-state-message">{message || 'Unable to load data. Please try again.'}</p>
    {onRetry && (
      <button onClick={onRetry} className="btn btn-primary btn-sm">
        Try Again
      </button>
    )}
  </div>
);
