const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const AppError = require('../utils/AppError');

/**
 * Create order from user's current cart
 */
const createOrder = async (userId, shippingAddress) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError('Your cart is empty.', 400);
  }

  // Filter valid products and check stock
  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    if (!item.product) {
      throw new AppError('One of the products in your cart is no longer available.', 400);
    }

    if (item.product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}, requested: ${item.quantity}`,
        400
      );
    }

    const itemTotal = item.product.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
    });
  }

  // Atomically decrement stock for each product
  for (const item of cart.items) {
    const updated = await Product.updateOne(
      { _id: item.product._id, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } }
    );

    if (updated.modifiedCount === 0) {
      throw new AppError(
        `Stock modified during checkout for "${item.product.name}". Please try again.`,
        400
      );
    }
  }

  // Create the order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentStatus: 'paid', // Simulated payment success for checkout
    orderStatus: 'processing',
  });

  // Clear user's cart after successful order creation
  cart.items = [];
  await cart.save();

  return order;
};

/**
 * Get user's order history (paginated)
 */
const getUserOrders = async (userId, query) => {
  const { page = 1, limit = 10 } = query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Order.countDocuments({ user: userId });
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return {
    orders,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

/**
 * Get order details by ID
 */
const getOrderById = async (userId, userRole, orderId) => {
  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) {
    throw new AppError('Order not found.', 404);
  }

  // Ensure consumer can only view their own orders
  if (userRole !== 'admin' && order.user._id.toString() !== userId) {
    throw new AppError('Access denied. You can only view your own orders.', 403);
  }

  return order;
};

/**
 * Get all orders for admin (paginated & filterable by status)
 */
const getAllOrders = async (query) => {
  const { page = 1, limit = 15, status } = query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (status) {
    filter.orderStatus = status;
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return {
    orders,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

/**
 * Update order status (Admin only)
 */
const updateOrderStatus = async (orderId, newStatus) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found.', 404);
  }

  const oldStatus = order.orderStatus;

  // If cancelling an order, restore stock
  if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } }
      );
    }
  }

  order.orderStatus = newStatus;
  await order.save();

  return order;
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
