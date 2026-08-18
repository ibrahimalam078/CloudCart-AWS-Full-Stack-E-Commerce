import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProduct } from '../../services/productService';
import { FiArrowLeft, FiUploadCloud, FiPlusCircle, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Admin.css';

const CATEGORIES = [
  'Electronics',
  'Gaming',
  'Wearables',
  'Audio',
  'Fashion',
  'Accessories',
];

const AddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        return toast.error('Only JPEG, PNG, and WebP images are allowed.');
      }
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('File size cannot exceed 5MB.');
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      return toast.error('Please select a product image file for AWS S3 upload.');
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('stock', stock);
      formData.append('image', imageFile);

      await createProduct(formData);
      toast.success('Product created and image uploaded to AWS S3!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container">
      <Link to="/admin/products" className="back-link">
        <FiArrowLeft /> Back to Manage Products
      </Link>

      <div className="admin-form-card card">
        <h1 className="page-title mb-1">Add New Product</h1>
        <p className="subtitle">Product image will be streamed directly to Amazon S3 Bucket</p>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                className="form-input"
                placeholder="99.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                min="0"
                required
                className="form-input"
                placeholder="50"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows="4"
              required
              className="form-textarea"
              placeholder="Detailed product specifications and features..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* S3 Image File Upload Box */}
          <div className="form-group">
            <label className="form-label">Product Image (AWS S3 Upload)</label>
            <div className="image-upload-box">
              {imagePreview ? (
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="Preview" className="upload-preview-img" />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="upload-dropzone">
                  <FiUploadCloud size={40} className="upload-icon" />
                  <span>Click or drag image file here (Max 5MB)</span>
                  <span className="text-muted text-xs">JPEG, PNG, WebP supported</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="file-input-hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block btn-lg mt-3">
            {loading ? 'Uploading Image to S3...' : <> <FiPlusCircle /> Save & Upload Product </>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
