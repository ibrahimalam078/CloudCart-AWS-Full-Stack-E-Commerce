import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import AwsArchitectureVisualizer from '../components/home/AwsArchitectureVisualizer';
import { SkeletonProductGrid, EmptyState, ErrorState } from '../components/common/LoadingSkeleton';
import {
  FiArrowRight,
  FiShield,
  FiCloud,
  FiServer,
  FiZap,
  FiLock,
  FiKey,
  FiCheckCircle,
  FiUploadCloud,
  FiActivity,
  FiAlertTriangle,
  FiCpu,
  FiHeadphones,
  FiWatch,
  FiMonitor,
  FiShoppingBag,
  FiBox,
} from 'react-icons/fi';
import heroBannerImg from '../assets/hero_banner.png';
import './Home.css';

const CATEGORY_CARDS = [
  { name: 'Electronics', icon: FiMonitor, color: '#10b981' },
  { name: 'Gaming', icon: FiCpu, color: '#ec4899' },
  { name: 'Wearables', icon: FiWatch, color: '#06b6d4' },
  { name: 'Audio', icon: FiHeadphones, color: '#f59e0b' },
  { name: 'Fashion', icon: FiShoppingBag, color: '#10b981' },
  { name: 'Accessories', icon: FiBox, color: '#8b5cf6' },
];

const SECURITY_FEATURES = [
  { icon: FiLock, title: 'JWT Authentication', desc: 'Stateless token-based authentication with configurable expiration and Bearer header scheme.' },
  { icon: FiShield, title: 'Password Hashing', desc: 'Passwords hashed with bcrypt using 12 salt rounds. Never stored or transmitted in plaintext.' },
  { icon: FiKey, title: 'IAM Least Privilege', desc: 'AWS IAM roles scoped to minimum required permissions: PutObject, GetObject, DeleteObject.' },
  { icon: FiUploadCloud, title: 'S3 Secure Storage', desc: 'Product images uploaded to S3 via AWS SDK v3 with MIME validation and 5MB size limit.' },
  { icon: FiCheckCircle, title: 'Input Validation', desc: 'Request validation using express-validator chains on all API endpoints with sanitization.' },
  { icon: FiShield, title: 'Helmet Headers', desc: 'Security headers including X-Frame-Options, X-Content-Type-Options, and CSP via Helmet.' },
  { icon: FiAlertTriangle, title: 'Rate Limiting', desc: 'API rate limiting with express-rate-limit to prevent brute-force and abuse attacks.' },
  { icon: FiActivity, title: 'CloudWatch Monitoring', desc: 'Application logs streamed to AWS CloudWatch via Winston transport for centralized monitoring.' },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await getProducts({ limit: 8 });
        setFeaturedProducts(res.data);
      } catch (err) {
        setError(err.message || 'Unable to load products.');
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">
              <FiZap className="badge-zap-icon" /> Production-Ready MERN on AWS
            </span>

            <h1 className="hero-title">
              Production-Ready E-Commerce on <span className="highlight-gradient">AWS</span>
            </h1>

            <p className="hero-subtitle">
              CloudCart is a production-style MERN e-commerce platform deployed on AWS EC2, using Amazon S3 for product assets, IAM for secure access, Nginx and PM2 for application serving, and CloudWatch for monitoring.
            </p>

            <div className="hero-tech-line">
              MERN • EC2 • S3 • IAM • MongoDB Atlas • CloudWatch
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <span className="stat-num">EC2</span>
                <span className="stat-lbl">Production Deployment</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-num">S3</span>
                <span className="stat-lbl">Object Storage</span>
              </div>
              <div className="hero-stat-item">
                <span className="stat-num">CloudWatch</span>
                <span className="stat-lbl">Monitoring</span>
              </div>
            </div>

            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary btn-lg glow-btn">
                Explore Products <FiArrowRight />
              </Link>
              <a href="#architecture" className="btn btn-secondary btn-lg hero-outline-btn">
                View Architecture
              </a>
            </div>
          </div>

          {/* High Quality 3D Hero Graphic */}
          <div className="hero-graphic-wrapper">
            <div className="graphic-backdrop-glow"></div>
            <div className="hero-graphic-floating">
              <img src={heroBannerImg} alt="AWS CloudCart 3D Showcase" className="hero-3d-image" />
            </div>
            <div className="floating-badge badge-s3">
              <FiCloud /> Amazon S3 Media
            </div>
            <div className="floating-badge badge-ec2">
              <FiServer /> EC2 Ubuntu :80
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="section-title">Shop by Category</h2>
            <p className="text-muted">Browse products across our curated categories</p>
          </div>

          <div className="categories-grid">
            {CATEGORY_CARDS.map((cat) => (
              <button
                key={cat.name}
                className="category-card"
                onClick={() => handleCategoryClick(cat.name)}
              >
                <div className="category-card-icon" style={{ background: `${cat.color}15`, color: cat.color }}>
                  <cat.icon size={28} />
                </div>
                <span className="category-card-name">{cat.name}</span>
                <FiArrowRight className="category-card-arrow" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive AWS Visualizer Section */}
      <section id="architecture" className="py-5 bg-dark-section">
        <div className="container">
          <AwsArchitectureVisualizer />
        </div>
      </section>

      {/* Security Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="section-title">Built with Production Security & DevOps Principles</h2>
            <p className="text-muted">Every feature below is actually implemented in the codebase.</p>
          </div>

          <div className="security-grid">
            {SECURITY_FEATURES.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon icon-security">
                  <feature.icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="text-muted">Explore products with images securely stored using Amazon S3.</p>
            </div>
            <Link to="/products" className="see-all-link">
              Browse All Products <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <SkeletonProductGrid count={8} />
          ) : error ? (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          ) : featuredProducts.length === 0 ? (
            <EmptyState
              icon={FiShoppingBag}
              title="No products available yet"
              message="Products will appear here once they are added through the admin dashboard."
              action={<Link to="/products" className="btn btn-primary mt-2">Browse Catalog</Link>}
            />
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
