import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, updateProduct } from '../../services/productService';
import { FiArrowLeft, FiUploadCloud, FiSave, FiCloud } from 'react-icons/fi';
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

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [currentImageKey, setCurrentImageKey] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        const p = res.data;
        setName(p.name);
        setDescription(p.description);
        setPrice(p.price);
        setCategory(p.category);
        setStock(p.stock);
        setCurrentImageUrl(p.imageUrl);
        setCurrentImageKey(p.imageKey);
      } catch (err) {
        toast.error(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        return toast.error('Only JPEG, PNG, and WebP images are allowed.');
      }
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('File size cannot exceed 5MB.');
      }
      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('stock', stock);

      if (newImageFile) {
        formData.append('image', newImageFile);
      }

      await updateProduct(id, formData);
      toast.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to update product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="container page-container">
      <Link to="/admin/products" className="back-link">
        <FiArrowLeft /> Back to Manage Products
      </Link>

      <div className="admin-form-card card">
        <h1 className="page-title mb-1">Edit Product</h1>
        <p className="subtitle">Updating image will delete the existing image object on S3 and upload the new asset</p>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              required
              className="form-input"
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Current & New Image */}
          <div className="form-group">
            <label className="form-label">Current Product Image (AWS S3)</label>
            <div className="current-image-preview flex items-center gap-3 mb-3">
              <img src={currentImageUrl} alt={name} className="admin-table-thumb lg" />
              <span className="text-muted text-xs"><FiCloud /> Key: <code>{currentImageKey}</code></span>
            </div>

            <label className="form-label">Replace Image (Optional)</label>
            <div className="image-upload-box">
              {newImagePreview ? (
                <div className="image-preview-wrapper">
                  <img src={newImagePreview} alt="Preview" className="upload-preview-img" />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => {
                      setNewImageFile(null);
                      setNewImagePreview(null);
                    }}
                  >
                    Cancel Image Replacement
                  </button>
                </div>
              ) : (
                <label className="upload-dropzone">
                  <FiUploadCloud size={32} className="upload-icon" />
                  <span>Click to select new image file (Max 5MB)</span>
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

          <button type="submit" disabled={submitting} className="btn btn-primary btn-block btn-lg mt-3">
            {submitting ? 'Updating Product...' : <> <FiSave /> Save Changes </>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
