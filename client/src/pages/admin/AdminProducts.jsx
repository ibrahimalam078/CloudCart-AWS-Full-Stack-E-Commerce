import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/productService';
import { FiPlusCircle, FiEdit2, FiTrash2, FiSearch, FiCloud } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Admin.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProductsList = async () => {
    try {
      setLoading(true);
      const res = await getProducts({ limit: 50, search });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will also remove the S3 image object.`)) {
      try {
        await deleteProduct(id);
        toast.success(`Product "${name}" deleted from database & S3.`);
        fetchProductsList();
      } catch (err) {
        toast.error(err.message || 'Failed to delete product.');
      }
    }
  };

  return (
    <div className="container page-container">
      <div className="admin-header">
        <div>
          <h1 className="page-title">Manage Products</h1>
          <p className="subtitle">View, edit, create products, and manage S3 uploaded assets</p>
        </div>

        <Link to="/admin/products/new" className="btn btn-primary">
          <FiPlusCircle /> Add New Product
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchProductsList();
          }}
          className="search-form"
        >
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or category..."
              className="form-input search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Filter
          </button>
        </form>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>S3 Key</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="admin-table-thumb"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                          }}
                        />
                      </td>
                      <td className="font-weight-bold">{product.name}</td>
                      <td>
                        <span className="badge badge-primary">{product.category}</span>
                      </td>
                      <td className="font-weight-bold">${product.price.toFixed(2)}</td>
                      <td>
                        <span className={`badge badge-${product.stock > 0 ? 'success' : 'danger'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="text-muted font-mono" style={{ fontSize: '0.75rem' }}>
                        <FiCloud /> {product.imageKey?.substring(0, 20)}...
                      </td>
                      <td>
                        <div className="admin-actions-cell">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="btn btn-secondary btn-sm"
                            title="Edit Product"
                          >
                            <FiEdit2 />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.name)}
                            className="btn btn-danger btn-sm"
                            title="Delete Product"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
