const Product = require('../models/Product');
const s3Service = require('./s3Service');
const AppError = require('../utils/AppError');

/**
 * Get paginated, filtered, searched, and sorted products
 */
const getProducts = async (query) => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    sort = 'createdAt',
    order = 'desc',
    minPrice,
    maxPrice,
  } = query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  // Build filter object
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  // Build sort object
  const sortObj = {};
  const sortDirection = order === 'asc' ? 1 : -1;
  sortObj[sort] = sortDirection;

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum);

  return {
    products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

/**
 * Get product by ID
 */
const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found.', 404);
  }
  return product;
};

/**
 * Create new product with image upload to S3
 */
const createProduct = async (productData, file) => {
  let imageData = {
    imageUrl: productData.imageUrl || 'https://via.placeholder.com/600x600?text=No+Image',
    imageKey: 'placeholder-key',
  };

  if (file) {
    imageData = await s3Service.uploadImage(
      file.buffer,
      file.originalname,
      file.mimetype
    );
  }

  const product = await Product.create({
    name: productData.name,
    description: productData.description,
    price: Number(productData.price),
    category: productData.category,
    stock: Number(productData.stock),
    imageUrl: imageData.imageUrl,
    imageKey: imageData.imageKey,
  });

  return product;
};

/**
 * Update product (with optional new image upload)
 */
const updateProduct = async (id, updateData, file) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  if (file) {
    // Delete old image from S3 if it exists and is not a placeholder
    if (product.imageKey && product.imageKey !== 'placeholder-key') {
      await s3Service.deleteImage(product.imageKey);
    }

    // Upload new image to S3
    const imageData = await s3Service.uploadImage(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    product.imageUrl = imageData.imageUrl;
    product.imageKey = imageData.imageKey;
  }

  if (updateData.name) product.name = updateData.name;
  if (updateData.description) product.description = updateData.description;
  if (updateData.price !== undefined) product.price = Number(updateData.price);
  if (updateData.category) product.category = updateData.category;
  if (updateData.stock !== undefined) product.stock = Number(updateData.stock);

  await product.save();
  return product;
};

/**
 * Delete product and its S3 image
 */
const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  // Delete image from S3
  if (product.imageKey && product.imageKey !== 'placeholder-key') {
    await s3Service.deleteImage(product.imageKey);
  }

  await Product.findByIdAndDelete(id);
  return { message: 'Product deleted successfully' };
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
