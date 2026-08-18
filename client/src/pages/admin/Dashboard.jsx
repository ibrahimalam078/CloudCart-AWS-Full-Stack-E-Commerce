import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../services/adminService';
import {
  FiDollarSign,
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiPlusCircle,
  FiList,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiXCircle,
  FiAlertTriangle,
} from 'react-icons/fi';
import './Admin.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="container page-container">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="subtitle">Real-time overview of sales, products, and order activity</p>
        </div>

        <div className="admin-quick-actions">
          <Link to="/admin/products/new" className="btn btn-primary btn-sm">
            <FiPlusCircle /> Add Product
          </Link>
          <Link to="/admin/products" className="btn btn-secondary btn-sm">
            <FiBox /> Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            <FiList /> Manage Orders
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon icon-revenue">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Revenue</span>
            <h3 className="stat-value">${stats?.totalSales?.toFixed(2) || '0.00'}</h3>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon icon-orders">
            <FiShoppingBag />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Orders</span>
            <h3 className="stat-value">{stats?.totalOrders || 0}</h3>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon icon-products">
            <FiBox />
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Products</span>
            <h3 className="stat-value">{stats?.totalProducts || 0}</h3>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon icon-users">
            <FiUsers />
          </div>
          <div className="stat-content">
            <span className="stat-label">Registered Customers</span>
            <h3 className="stat-value">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon icon-pending">
            <FiClock />
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending Orders</span>
            <h3 className="stat-value">{stats?.statusCounts?.processing || 0}</h3>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon icon-lowstock">
            <FiAlertTriangle />
          </div>
          <div className="stat-content">
            <span className="stat-label">Low Stock Products</span>
            <h3 className="stat-value">{stats?.lowStockProducts || 0}</h3>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="status-breakdown-grid mt-4">
        <div className="card">
          <h3 className="card-section-title">Order Status Summary</h3>
          <div className="status-counts-row">
            <div className="status-count-box warning">
              <FiClock size={20} />
              <span className="count-number">{stats?.statusCounts?.processing || 0}</span>
              <span className="count-label">Processing</span>
            </div>

            <div className="status-count-box primary">
              <FiTruck size={20} />
              <span className="count-number">{stats?.statusCounts?.shipped || 0}</span>
              <span className="count-label">Shipped</span>
            </div>

            <div className="status-count-box success">
              <FiCheckCircle size={20} />
              <span className="count-number">{stats?.statusCounts?.delivered || 0}</span>
              <span className="count-label">Delivered</span>
            </div>

            <div className="status-count-box danger">
              <FiXCircle size={20} />
              <span className="count-number">{stats?.statusCounts?.cancelled || 0}</span>
              <span className="count-label">Cancelled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="card mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="card-section-title mb-0">Recent Orders</h3>
          <Link to="/admin/orders" className="see-all-link">View All Orders →</Link>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">No recent orders.</td>
                </tr>
              ) : (
                stats?.recentOrders?.map((order) => (
                  <tr key={order._id}>
                    <td className="font-weight-bold">#{order._id.substring(order._id.length - 8).toUpperCase()}</td>
                    <td>{order.user?.name || 'Guest'}</td>
                    <td>
                      <span className={`badge badge-${order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'cancelled' ? 'danger' : 'warning'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="font-weight-bold">${order.totalAmount.toFixed(2)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to="/admin/orders" className="btn btn-secondary btn-sm">Manage</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
