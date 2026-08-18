import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import { SkeletonProductGrid, ErrorState } from '../components/common/LoadingSkeleton';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import './Products.css';

const CATEGORIES = [
  'All',
  'Electronics',
  'Gaming',
  'Wearables',
  'Audio',
  'Fashion',
  'Accessories',
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read initial category from URL query params
  const initialCategory = searchParams.get('category') || 'All';

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(
    CATEGORIES.includes(initialCategory) ? initialCategory : 'All'
  );
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        limit: 12,
        sort,
        order,
      };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;

      const res = await getProducts(params);
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load products. Please try again.');
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, category, sort, order]);

  // Sync category to URL params
  useEffect(() => {
    const newParams = {};
    if (category !== 'All') newParams.category = category;
    setSearchParams(newParams, { replace: true });
  }, [category]);

  // Listen for URL param changes (e.g. from category cards on homepage)
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && CATEGORIES.includes(urlCategory) && urlCategory !== category) {
      setCategory(urlCategory);
      setPage(1);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="container page-container">
      <div className="products-header">
        <div>
          <h1 className="page-title">Product Catalog</h1>
          <p className="subtitle">Browse our collection hosted on Amazon S3 infrastructure</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input search-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="filter-toolbar">
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${category === cat ? 'active' : ''}`}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sort-wrapper">
          <FiFilter /> Sort By:
          <select
            value={`${sort}-${order}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split('-');
              setSort(s);
              setOrder(o);
              setPage(1);
            }}
            className="form-select sort-select"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
          </select>
        </div>
      </div>

      {/* Main Grid / Empty State / Spinner */}
      {loading ? (
        <SkeletonProductGrid count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchProducts()} />
      ) : products.length === 0 ? (
        <div className="empty-state-container">
          <div className="empty-state-icon"><FiShoppingBag size={48} /></div>
          <h3 className="empty-state-title">No Products Found</h3>
          <p className="empty-state-message">Try adjusting your search criteria or category filter.</p>
          {category !== 'All' && (
            <button onClick={() => { setCategory('All'); setSearch(''); }} className="btn btn-primary btn-sm">
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <FiChevronLeft /> Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.pages} ({pagination.total} items)
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
