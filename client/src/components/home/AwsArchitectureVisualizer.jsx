import React, { useState } from 'react';
import { FiServer, FiCloud, FiDatabase, FiActivity, FiShield, FiCheckCircle, FiKey } from 'react-icons/fi';
import './AwsArchitectureVisualizer.css';

const NODES = {
  nginx: {
    id: 'nginx',
    title: 'Nginx Reverse Proxy',
    subtitle: 'Public Entry Point (Port 80)',
    icon: FiServer,
    color: '#10b981',
    details: [
      { label: 'Public Port', value: '80 (HTTP)' },
      { label: 'Role', value: 'Reverse Proxy' },
      { label: 'Internal API', value: '127.0.0.1:5000' },
      { label: 'SPA Routing', value: 'try_files $uri $uri/ /index.html' },
      { label: 'Gzip Compression', value: 'Enabled' },
    ],
  },
  express: {
    id: 'express',
    title: 'Express REST API',
    subtitle: 'App Server (Port 5000)',
    icon: FiCloud,
    color: '#10b981',
    details: [
      { label: 'Authentication', value: 'JWT Bearer + bcrypt (12 rounds)' },
      { label: 'Security Layer', value: 'Helmet headers, CORS, express-rate-limit' },
      { label: 'Error Handling', value: 'Centralized AppError middleware' },
      { label: 'Validation', value: 'express-validator chains' },
      { label: 'Logging', value: 'Winston + Morgan' },
    ],
  },
  pm2: {
    id: 'pm2',
    title: 'PM2',
    subtitle: 'Node.js Process Manager',
    icon: FiServer,
    color: '#059669',
    details: [
      { label: 'Role', value: 'Node.js Process Manager' },
      { label: 'Purpose', value: 'Application process management' },
      { label: 'Restart on crash', value: 'Enabled' },
      { label: 'Memory Limit', value: '300MB auto-restart threshold' },
      { label: 'Logs', value: 'Managed via PM2 log rotation' },
    ],
  },
  s3: {
    id: 's3',
    title: 'Amazon S3 Bucket',
    subtitle: 'Product Media Storage',
    icon: FiCloud,
    color: '#06b6d4',
    details: [
      { label: 'Purpose', value: 'Product image/object storage' },
      { label: 'Maximum upload', value: '5 MB' },
      { label: 'Access', value: 'IAM-controlled' },
      { label: 'Upload Pipeline', value: 'Express Multer → AWS SDK v3' },
      { label: 'Validation', value: 'MIME types (JPEG/PNG/WebP)' },
    ],
  },
  atlas: {
    id: 'atlas',
    title: 'MongoDB Atlas',
    subtitle: 'Application Database',
    icon: FiDatabase,
    color: '#059669',
    details: [
      { label: 'Purpose', value: 'Application database' },
      { label: 'Stores', value: 'Users, Products, Orders, Carts' },
      { label: 'Indexes', value: 'Compound (category/price), Text (search)' },
      { label: 'Atomicity', value: 'Stock reservation via $gte and $inc' },
      { label: 'Security', value: 'TLS encrypted connections' },
    ],
  },
  cloudwatch: {
    id: 'cloudwatch',
    title: 'AWS CloudWatch',
    subtitle: 'Monitoring & Logs',
    icon: FiActivity,
    color: '#f59e0b',
    details: [
      { label: 'Purpose', value: 'Monitoring and logs' },
      { label: 'Tracks', value: 'Application/EC2 metrics and logs' },
      { label: 'Log Group', value: '/cloudcart/application' },
      { label: 'Transport', value: 'Winston → PutLogEventsCommand' },
      { label: 'Alarms', value: 'CPU > 80% for 5 minutes' },
    ],
  },
  iam: {
    id: 'iam',
    title: 'AWS IAM',
    subtitle: 'Access Control',
    icon: FiKey,
    color: '#dc2626',
    details: [
      { label: 'Purpose', value: 'AWS access control' },
      { label: 'Principle', value: 'Least privilege' },
      { label: 'S3 Permissions', value: 'PutObject, GetObject, DeleteObject' },
      { label: 'CloudWatch', value: 'PutLogEvents, CreateLogStream' },
      { label: 'Credentials', value: 'IAM role / env vars (never in code)' },
    ],
  },
};

const AwsArchitectureVisualizer = () => {
  const [activeNode, setActiveNode] = useState(NODES.nginx);

  return (
    <div className="aws-visualizer-container card">
      <div className="visualizer-header">
        <div>
          <span className="badge badge-primary mb-1"><FiShield /> Interactive Architecture</span>
          <h3 className="visualizer-title">Click Any Component to Inspect Real AWS Specs</h3>
        </div>
      </div>

      <div className="visualizer-grid">
        {/* Nodes Diagram Column */}
        <div className="nodes-flow">
          <button
            onClick={() => setActiveNode(NODES.nginx)}
            className={`node-button ${activeNode.id === 'nginx' ? 'active' : ''}`}
          >
            <FiServer size={20} />
            <div className="node-btn-text">
              <span className="node-name">Nginx Reverse Proxy</span>
              <span className="node-sub">:80 Port</span>
            </div>
          </button>

          <div className="flow-arrow">↓</div>

          <button
            onClick={() => setActiveNode(NODES.express)}
            className={`node-button ${activeNode.id === 'express' ? 'active' : ''}`}
          >
            <FiCloud size={20} />
            <div className="node-btn-text">
              <span className="node-name">Express REST API</span>
              <span className="node-sub">:5000 Port</span>
            </div>
          </button>

          <div className="flow-arrow">↓</div>

          <button
            onClick={() => setActiveNode(NODES.pm2)}
            className={`node-button ${activeNode.id === 'pm2' ? 'active' : ''}`}
          >
            <FiServer size={20} />
            <div className="node-btn-text">
              <span className="node-name">PM2 Process Manager</span>
              <span className="node-sub">Auto-restart</span>
            </div>
          </button>

          <div className="flow-arrow">↓</div>

          <div className="nodes-branch">
            <button
              onClick={() => setActiveNode(NODES.s3)}
              className={`node-button branch-btn ${activeNode.id === 's3' ? 'active' : ''}`}
            >
              <FiCloud size={18} /> Amazon S3
            </button>

            <button
              onClick={() => setActiveNode(NODES.atlas)}
              className={`node-button branch-btn ${activeNode.id === 'atlas' ? 'active' : ''}`}
            >
              <FiDatabase size={18} /> MongoDB Atlas
            </button>

            <button
              onClick={() => setActiveNode(NODES.cloudwatch)}
              className={`node-button branch-btn ${activeNode.id === 'cloudwatch' ? 'active' : ''}`}
            >
              <FiActivity size={18} /> CloudWatch
            </button>

            <button
              onClick={() => setActiveNode(NODES.iam)}
              className={`node-button branch-btn ${activeNode.id === 'iam' ? 'active' : ''}`}
            >
              <FiKey size={18} /> IAM
            </button>
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className="node-inspector">
          <div className="inspector-header" style={{ borderColor: activeNode.color }}>
            <activeNode.icon size={26} style={{ color: activeNode.color }} />
            <div>
              <h4 className="inspector-title">{activeNode.title}</h4>
              <span className="inspector-sub">{activeNode.subtitle}</span>
            </div>
          </div>

          <div className="inspector-details-list">
            {activeNode.details.map((detail, idx) => (
              <div key={idx} className="inspector-detail-item">
                <span className="detail-label"><FiCheckCircle size={14} className="text-primary" /> {detail.label}</span>
                <span className="detail-value">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwsArchitectureVisualizer;
