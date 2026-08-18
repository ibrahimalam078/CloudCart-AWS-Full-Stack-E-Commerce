import React from 'react';
import { Link } from 'react-router-dom';
import { FiCloud, FiLock, FiServer, FiCheckCircle } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="brand-logo">
            <span className="brand-badge">AWS</span>
            <span className="brand-text">CloudCart</span>
          </div>
          <p className="footer-desc">
            Production-Style MERN E-Commerce Application Deployed on AWS Infrastructure.
          </p>
          <div className="aws-badges">
            <span className="aws-tag"><FiServer /> EC2 Ubuntu</span>
            <span className="aws-tag"><FiCloud /> S3 Storage</span>
            <span className="aws-tag"><FiLock /> IAM Security</span>
          </div>
        </div>

        <div className="footer-links">
          <h4>Architecture & Tech Stack</h4>
          <ul>
            <li><FiCheckCircle /> React 18 + Vite</li>
            <li><FiCheckCircle /> Express.js REST API</li>
            <li><FiCheckCircle /> MongoDB Atlas M0</li>
            <li><FiCheckCircle /> Nginx Reverse Proxy</li>
            <li><FiCheckCircle /> PM2 Process Manager</li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><a href="/#architecture">Architecture</a></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} CloudCart — Built with React, Node.js, MongoDB Atlas and AWS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
