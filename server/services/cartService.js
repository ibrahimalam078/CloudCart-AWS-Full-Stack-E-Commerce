const Cart = require('../models/Cart');
const Product = require('../models/Product');
const AppError = require('../utils/AppError');

/**
 * Get populated cart for user
 */
const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Calculate total amount dynamically
  let totalAmount = 0;
  const formattedItems = cart.items
    .filter((item) => item.product != null) // filter out deleted products
    .map((item) => {
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        product: item.product,
        quantity: item.quantity,
        itemTotal,
      };
    });

  return {
    _id: cart._id,
    user: cart.user,
    items: formattedItems,
    totalAmount,
    itemCount: formattedItems.reduce((acc, item) => acc + item.quantity, 0),
  };
};

/**
 * Add item to cart
 */
const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  if (product.stock < quantity) {
    throw new AppError(`Insufficient stock. Only ${product.stock} available.`, 400);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    if (product.stock < newQuantity) {
      throw new AppError(
        `Cannot add. Total requested (${newQuantity}) exceeds stock (${product.stock}).`,
        400
      );
    }
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  return getCart(userId);
};

/**
 * Update quantity of an item in cart
 */
const updateCartItemQuantity = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  if (product.stock < quantity) {
    throw new AppError(`Insufficient stock. Only ${product.stock} available.`, 400);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new AppError('Item not found in cart.', 404);
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  return getCart(userId);
};

/**
 * Remove item from cart
 */
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  return getCart(userId);
};

/**
 * Clear entire cart
 */
const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return { message: 'Cart cleared successfully' };
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};
